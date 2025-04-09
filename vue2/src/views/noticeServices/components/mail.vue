<template>
    <div>
        <div>
            <el-tabs v-model="activeTab" class="tab">
                <el-tab-pane name="setting" :label="$t('Notice.Setting')">
                    <el-descriptions class="margin-top" :title="$t('Notice.Detail')" direction="vertical" :column="5" size="medium" border>
                        <template slot="extra">
                            <el-button-group>
                                <el-button type="primary" size="small" @click="editSetting()">{{ $t('Notice.EditSetting') }}</el-button>
                                <el-button type="primary" size="small" @click="showSendMail()">{{ $t('Notice.MailTest') }}</el-button>
                            </el-button-group>
                        </template>
                        <el-descriptions-item :label="$t('Info.Status')">
                            <el-tag v-if="setting.isEnable" class="ml-3" type="success">{{ $t('Enable') }}</el-tag>
                            <el-tag v-else class="ml-3" type="info">{{ $t('Disable') }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('Info.Server')">
                            {{ setting.server }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('Info.Port')">
                            {{ setting.port }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('Info.User')">
                            {{ setting.sender }}
                        </el-descriptions-item>
                    </el-descriptions>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog :close-on-click-modal="false"
                   :title="$t('Notice.EditSetting')"
                   :visible.sync="dialogVisible"
                   :modal-append-to-body="false"
                   width="600px"
        >
            <div>
                <el-form ref="ruleForm" :model="ruleForm" label-width="150px" class="demo-ruleForm">
                    <el-form-item :label="$t('Info.Server')" prop="server" :rules="[
                        { required: true, message: $t('Info.ServerInput'), trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="ruleForm.server" />
                    </el-form-item>
                    <el-form-item :label="$t('Info.Port')" prop="port" :rules="[
                        { required: true, message: $t('Info.PortInput'), trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="ruleForm.port" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item :label="$t('Info.User')" prop="sender" :rules="[
                        { required: true, message: $t('Info.UserInput'), trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="ruleForm.sender" />
                    </el-form-item>
                    <el-form-item :label="$t('Info.Pwd')" prop="code" :rules="[
                        { required: true, message: $t('Info.PwdInput'), trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="ruleForm.code" show-password />
                    </el-form-item>
                    <el-form-item :label="$t('Info.Status')" prop="isEnable">
                        <el-radio-group v-model="ruleForm.isEnable" size="small">
                            <el-radio-button :label="true">{{ $t('Enable') }}</el-radio-button>
                            <el-radio-button :label="false">{{ $t('Disable') }}</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ $t('Cancel') }}</el-button>
                <el-button type="primary" @click="sendForm">{{ $t('Confirm') }}</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false"
                   :title="$t('Notice.EditSetting')"
                   :visible.sync="showSendMailDialog"
                   :modal-append-to-body="false"
                   width="600px"
        >
            <div>
                <el-form ref="ruleForm" :model="sendMailForm" label-width="150px" class="demo-ruleForm">
                    <el-form-item :label="$t('Notice.Receiver')" prop="receiver" :rules="[
                        { required: true, message: $t('Notice.ReceiverInput'), trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="sendMailForm.receiver" />
                    </el-form-item>
                    <el-form-item :label="$t('Notice.Subject')" prop="subject" :rules="[
                        { required: true, message: $t('Notice.SubjectInput'), trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="sendMailForm.subject" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item :label="$t('Notice.Body')" prop="body" :rules="[
                        { required: true, message: $t('Notice.BodyInput'), trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="sendMailForm.body" />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showSendMailDialog = false">{{ $t('Cancel') }}</el-button>
                <el-button type="primary" @click="sendMail">{{ $t('Confirm') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

export default ({
    data() {
        return {
            activeTab: 'setting',
            setting: {},
            dialogVisible: false,
            showSendMailDialog: false,
            sendMailForm: {
                receiver: '',
                subject: '',
                body: ''
            },
            ruleForm: {
                server: '',
                sender: '',
                port: 25,
                isEnable: false,
                code: ''
            }
        }
    },
    computed: {
        positionName() {
            return this.$route.query.name
        }
    },
    activated() {
        this.refresh()
        // this.selectedTab = 'channel'
    },
    deactivated() {
        console.log('detail deactivated')
    },
    created() {
    },
    mounted() {
        console.log('detail mounted')
    },
    methods: {
        refresh() {
            this.loadSetting()
            // this.$refs.channelInfo.loadChannel(this.$route.query.id)
            // this.$refs.devices.loadList(this.$route.query.id)
        },
        editSetting() {
            console.log(this.setting)
            this.ruleForm.sender = this.setting.sender
            this.ruleForm.server = this.setting.server
            this.ruleForm.port = this.setting.port
            this.ruleForm.isEnable = this.setting.isEnable
            this.ruleForm.code = this.setting.code
            console.log(this.ruleForm)

            this.dialogVisible = true
        },
        showSendMail() {
            if (!this.setting.isEnable) {
                this.$message({type: 'error', message: this.$t('Notice.NeedEnableMail')})
                return
            }
            this.sendMailForm.receiver = ''
            this.sendMailForm.subject = ''
            this.sendMailForm.body = ''
            this.showSendMailDialog = true
        },
        sendMail() {
            this.$api.post('/api/Notice/mail/test', this.sendMailForm).then(() => {
                this.$message({type: 'success', message: this.$t('Notice.MailTestSuccess')})
            }, () => {
                this.$message({type: 'error', message: this.$t('Notice.MailTestFailed')})
            })
            
        },
        async loadSetting() {
            await this.$api.get('/api/Notice/mail').then(reponse => {
                let data = reponse.data
                console.log(data)
                this.setting = data
            })
        },
        sendForm() {
            this.$refs.ruleForm.validate((async valid => {
                if (!valid) {
                    console.log(valid)
                    return
                }
                const sendData = {...this.ruleForm}
                console.log(sendData)
                let res = {}
                res =  await this.$api.post('/api/Notice/mail/setting', sendData)

                console.log(res)
                const { status } = res 
                if (status === 201 || status === 204) {
                    this.dialogVisible = false
                    this.loadSetting()
                } else {
                    this.$message.error(this.$t('Info.EditFailed'))
                }
            }))
        },
        goBack() {
            this.$router.back()
        }
    }
})
</script>

