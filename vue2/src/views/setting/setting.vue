<template>
    <div class="setting">
        <el-page-header :content="$t('UserSetting')" @back="goBack" />
        <el-tabs v-model="activeTabName" class="tab" @tab-click="handleTabClick">
            <el-tab-pane :label="$t('UserSetting1.AccountInfo')" name="accountInfo">
                <el-form label-position="top">
                    <el-form-item :label="$t('User.Account')" class="item">
                        <span>{{ userName }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('User.Pwd')" class="item">
                        <el-button @click="dialogVisible = true">{{ $t('User.ChangePwd') }}</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane v-if="advancedSetting" :label="$t('UserSetting1.SystemSetting')" name="systemSetting">
                <el-form ref="systemSetting" :model="systemSetting" label-position="top" class="system">
                    <el-form-item :label="$t('UserSetting1.CustomerName')" prop="customerName" class="item">
                        <el-input v-model="systemSetting.customerName" />
                    </el-form-item>
                    <el-form-item :label="$t('UserSetting1.ExportExcel')" prop="exportExcel" class="item">
                        <el-switch v-model="systemSetting.exportExcel" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitSystemSetting">
                            {{ $t('Save') }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane v-if="advancedSetting" :label="$t('UserSetting1.MonitorSetting')" name="monitorSettingTab">
                <el-form ref="monitorSetting1" :model="monitorSetting" label-position="top" class="system">
                    <el-form-item :label="$t('UserSetting1.PositionTimer')" prop="positionTimer" class="item">
                        <el-input-number v-model="monitorSetting.positionTimer" :min="1" :max="300" />
                        <div class="note">
                            {{ $t('UserSetting1.PositionTimerNote') }}
                        </div>
                    </el-form-item>
                    <el-form-item :label="$t('UserSetting1.SaveFrequency')" prop="positionSaveFrequency" class="item">
                        <el-input-number v-model="monitorSetting.positionSaveFrequency" :min="1" :max="120" />
                        <div class="note">
                            {{ $t('UserSetting1.SaveFrequencyNote') }}
                        </div>
                    </el-form-item>                    
                    <el-form-item>
                        <el-button type="primary" @click="submitmonitorSetting">{{ $t('Save') }}</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :close-on-click-modal="false"
                   :title="$t('User.ChangePwd')"
                   :visible.sync="dialogVisible"
                   :modal-append-to-body="false"
                   width="500px"
        >
            <div>
                <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item :label="$t('User.NewPwd')" prop="newPassword" :rules="[
                        { required: true, message: $t('User.NewPwdInput'), trigger: 'blur' }]"
                    >
                        <el-input v-model="ruleForm.newPassword" show-password />
                    </el-form-item>
                    <el-form-item :label="$t('User.ConfirmNewPwd')" prop="confirmPassword" :rules="[
                        { required: true, message: $t('User.ConfirmPwdInput'), trigger: 'blur' }]"
                    >
                        <el-input v-model="ruleForm.confirmPassword" show-password />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ $t('Cancel') }}</el-button>
                <el-button type="primary" @click="changePassword">{{ $t('Confirm') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            activeTabName: 'accountInfo',
            dialogVisible: false,
            userName: '',
            permissions: [],
            systemSetting: {
                customerName: '',
                exportExcel: true
            },
            monitorSetting: {
                positionTimer: 5,
                positionSaveFrequency: 12
            },
            ruleForm: {
                newPassword: '',
                confirmPassword: ''
            }
        }
    },
    mounted() {
        const userInfo = localStorage.getItem('a_user')
        if (userInfo) {
            let userInfoDate = JSON.parse(userInfo)
            this.userName = userInfoDate.userName
            this.permissions = userInfoDate.permissions || []
            this.advancedSetting = this.permissions.includes('AdavncedSetting')
        }
    },
    methods: {
        goBack() {
            this.$router.back()
        },

        loadSystemSetting() {
            this.$api.get('/api/Config/system')
                .then(reponse => {
                    let data = reponse.data
                    this.systemSetting = data
                }, () => {
                    this.$message.error(this.$t('UserSetting1.SystemSettingFailed'))
                })
        },        
        loadmonitorSetting() {
            this.$api.get('/api/Config/monitor/setting')
                .then(reponse => {
                    let data = reponse.data
                    this.monitorSetting = data
                }, () => {
                    this.$message.error(this.$t('UserSetting1.monitorSettingFailed'))
                })
        },

        handleTabClick() {
            if (this.activeTabName === 'systemSetting') {
                this.loadSystemSetting()
            } else if (this.activeTabName === 'monitorSettingTab') {
                this.loadmonitorSetting()
            }
        },
        submitSystemSetting() {
            this.systemSetting.tablettheme = '555'
            this.$api.post('/api/Config/system', this.systemSetting)
                .then(() => {
                    const config = localStorage.getItem('config')
                    if (config) {
                        let configInfo = JSON.parse(config)
                        configInfo.customerName = this.systemSetting.customerName
                        configInfo.exportExcel = this.systemSetting.exportExcel
                        configInfo.tablettheme = this.systemSetting.tablettheme
                        localStorage.setItem('config', JSON.stringify(configInfo))
                        
                    }
                    this.$message.success(this.$t('UserSetting1.SetSystemSuccess'))
                }, () => {
                    this.$message.error(this.$t('UserSetting1.SetSystemFailed'))
                })
        },
        submitmonitorSetting() {
            console.log(this.monitorSetting)
            this.$api.post('/api/Config/monitor/setting', this.monitorSetting)
                .then(() => {
                    this.$confirm(this.$t('UserSetting1.RestartHint'), this.$t('Hint'), { confirmButtonText: this.$t('Confirm'), cancelButtonText: this.$t('Cancel'), type: 'success'}).then(() => {
                        this.$api.post('/api/Action/restart').then(() => {
                            this.$message({type: 'success', message: this.$t('UserSetting1.StartRestart')})
                        })
                    })
                }, () => {
                    this.$message.error(this.$t('UserSetting1.SetmonitorSettingFailed'))
                })
        },
        changePassword() {
            if (this.ruleForm.newPassword != this.ruleForm.confirmPassword) {
                this.$message({
                    type: 'error',
                    message: this.$t('User.PwdNotRight')
                }) 
                return
            }

            this.$api.post(`/api/User/${this.userName}/password`, this.ruleForm).then(() => {
                this.$message({
                    type: 'success',
                    message: this.$t('User.ChangePwdSuccess')
                })
                this.dialogVisible = false

            }, () => {
                this.$message.error(this.$t('User.ChangePwdFailed'))
            })
        }
    }
}
</script>
<style lang="scss">
.setting {
    padding: 20px;
    .tab {
        margin-top: 20px;
        .system {
            width: 600px;
            .note {
                font-size: 12px;
                min-height: 17px;
                color: #c3c5c6;
            }
        }
    }
}
.item .el-form-item__label {
    font-weight: bold;
    padding: 0;
    font-size: 16px;
}
</style>