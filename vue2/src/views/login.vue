<template>
    <div class="login-container">
        <div class="login-left">
            <a class="logo">
                <img src="../assets/images/logo.png">
                <span>Susalem</span>
            </a>
        </div>
        <div class="login-right">
            <el-card class="login-right-warp ">
                <span class="login-right-warp-one" />
                <span class="login-right-warp-two" />
                <div class="login-right-warp-mian">
                    <div class="login-right-warp-main-title">{{ $t('LoginTitle') }}</div>
                    <div class="login-right-warp-main-form">
                        <el-form size="large" class="login-content-form">
                            <el-form-item class="login-animation1">
                                <el-input v-model="userInfo.userName" clearable="" :placeholder="$t('InputAccount')" text prefix-icon="el-icon-user" />
                            </el-form-item>

                            <el-form-item class="login-animation2">
                                <el-input v-model="userInfo.password" :placeholder="$t('InputPwd')" show-password prefix-icon="el-icon-unlock" @keyup.enter.native="login" />
                            </el-form-item>

                            <el-form-item class="login-animation4">
                                <el-button type="primary" class="login-content-submit" :loading="logining" @click="login">{{ $t('SignIn') }}</el-button>
                            </el-form-item>

                            <div class="login-hint">
                                {{ $t('LoginHint') }}
                            </div>
                        </el-form>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            logining: false,
            locale: 'zh-CN',
            userInfo: {
                userName: '',
                password: ''
            }
        }
    },
    mounted() {
        var command = localStorage.getItem('locale')
        if (command  != null) {
            this.$i18n.locale = command
            this.locale = command
        }
    },
    methods: {
        login() {
            this.logining = true
            this.$api.post('/api/Auth', this.userInfo).then(res => {
                console.log('login success')
                this.logining = false
                const { data } = res || {}
                const { token, userName, permissions, config } = data || {}
                if (!token) {
                    this.$message.error(this.$t('SignInFailed'))
                }
                localStorage.setItem('jwt', token)
                localStorage.setItem('a_user', JSON.stringify({userName, permissions}))
                localStorage.setItem('config', JSON.stringify(config))
                this.$api.setHead(`Bearer ${token}`)
                this.$router.push({ path: '/' })
            }, () => {
                this.logining = false
                this.$message.error(this.$t('SignInFailed'))
            }).catch(() => {
                this.logining = false
                this.$message.error(this.$t('SignInFailed'))
            })
        },
        ChangeLan(command) {
            this.locale = command
            this.$i18n.locale = command
            this.$api.setLan(command)
            localStorage.setItem('locale', command)
        }
    }
}
</script>
<style lang="scss" scoped>
.login-container {
    background: url(../assets/images/hero-bg.png) left center no-repeat;
    height: 100%;
    display: flex;
    .login-left {
        width: 50%;
        display: flex;
        .logo {
            position: fixed;
            line-height: 0;
            align-items: center;
            display: flex;
            margin-top: 20px;
            margin-left: 20px;
            text-decoration: none;
        }
        .logo img {
            max-height: 50px;
            margin-right: 6px;
        }
        .logo span {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 1px;
            color: #012970;
            font-family: "Nunito", sans-serif;
        }
        .login-content {
            flex-direction: column;
            .h2 {
                color: #444;
                margin: 80px 0 0 0;
                font-size: 40px;
            }
        }
        .login-left-waves {
            position: absolute;
            top: 0;
            right: -100px;
        }
    }
    .login-right {
        width: 50%;
        display: flex;
        .login-right-warp {
            border-radius: 3px;
            width: 500px;
            height: 500px;
            position: relative;
            overflow: hidden;
            background-color: var(--el-color-white);
            //display: flex;
            margin: auto;
            .login-right-warp-one,
            .login-right-warp-two {
                position: absolute;
                display: block;
                width: inherit;
                height: inherit;
                &::before,
                &::after {
                    content: '';
                    position: absolute;
                    z-index: 1;
                }
            }
            .login-right-warp-one {
                &::before {
                    filter: hue-rotate(0deg);
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: linear-gradient(90deg, transparent, var(--el-color-primary));
                    animation: loginLeft 3s linear infinite;
                }
                &::after {
                    filter: hue-rotate(60deg);
                    top: -100%;
                    right: 2px;
                    width: 3px;
                    height: 100%;
                    background: linear-gradient(180deg, transparent, var(--el-color-primary));
                    animation: loginTop 3s linear infinite;
                    animation-delay: 0.7s;
                }
            }
            .login-right-warp-two {
                &::before {
                    filter: hue-rotate(120deg);
                    bottom: 2px;
                    right: -100%;
                    width: 100%;
                    height: 3px;
                    background: linear-gradient(270deg, transparent, var(--el-color-primary));
                    animation: loginRight 3s linear infinite;
                    animation-delay: 1.4s;
                }
                &::after {
                    filter: hue-rotate(300deg);
                    bottom: -100%;
                    left: 0;
                    width: 3px;
                    height: 100%;
                    background: linear-gradient(360deg, transparent, var(--el-color-primary));
                    animation: loginBottom 3s linear infinite;
                    animation-delay: 2.1s;
                }
            }
            .login-right-warp-mian {
                display: flex;
                flex-direction: column;
                height: 100%;
                .login-right-warp-main-title {
                    height: 130px;
                    line-height: 130px;
                    font-size: 27px;
                    text-align: center;
                    letter-spacing: 3px;
                    animation: logoAnimation 0.3s ease;
                    animation-delay: 0.3s;
                    color: var(--el-text-color-primary);
                }
                .login-right-warp-main-form {
                    flex: 1;
                    padding: 0 50px 50px;
                    .login-content-form {
                        margin-top: 20px;
                        .login-content-submit {
                            width: 100%;
                            letter-spacing: 2px;
                            font-weight: 300;
                            margin-top: 20px;
                        }
                        .login-hint {
                            margin-top: 20px;
                            color: #a8abb2;
                            font-size: 8pt;
                        }
                    }
                }
            }
        }
        .language {
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 20px;
        }
    }
}

</style>
