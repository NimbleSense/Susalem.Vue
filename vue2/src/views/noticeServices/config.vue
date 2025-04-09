<template>
    <div class="container">
        <el-row :gutter="20" type="flex" style="flex-wrap: wrap; flex-direction: row;">
            <el-col :span="12" style="margin-top: 20px;" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-card shadow="hover">
                    <div class="content">
                        <div class="left">
                            <img src="../../assets/images/notice/mail.svg" alt="sms" style="height: 100px; width: 100px;">
                            <div class="context">
                                <div class="title">{{ $t('Notice.Mail') }}</div>
                                <div class="desc">{{ $t('Notice.MailNote') }}</div>
                            </div>
                        </div>
                        <div class="right">
                            <el-badge :value="info.mailInfo" style="margin-top: 10; margin-right: 40px;">
                                <el-button icon="el-icon-setting" circle @click="goto('Mail')" />
                            </el-badge>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12" style="margin-top: 20px;" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-card shadow="hover">
                    <div class="content">
                        <div class="left">
                            <img src="../../assets/images/notice/webhook.svg" alt="sms" style="height: 100px; width: 100px;">
                            <div class="context">
                                <div class="title">{{ $t('Notice.Webhook') }}</div>
                                <div class="desc">{{ $t('Notice.WebhookNote') }}</div>
                            </div>
                        </div>
                        <div class="right">
                            <el-badge :value="info.webhookInfo" style="margin-top: 10; margin-right: 40px;">
                                <el-button icon="el-icon-setting" circle @click="goto('Webhook')" />
                            </el-badge>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            info: {}
        }
    },
    mounted() {
        // this.loadInfo()
    },
    methods: {
        goto(item) {
            this.$router.push(`/noticesetting?name=${item}`)
        },
        async loadInfo() {
            const bdata = await this.$api.get('/api/Notice/info')
            console.log('/api/Notice/info', bdata)
            this.info = bdata.data
        }
    }
}
</script>

<style lang="scss" scoped>
    .container {
        width: 100%;
        height: 100%;
        padding: 20px;
        .content {
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .left {
                display: flex;
                .context {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    height: 100px;
                    margin-left: 15px;
                    .title {
                        font-size: 24px;
                    }
                    .desc {
                        font-size: 14px;
                    }
                }
            }
        }
    }
</style>