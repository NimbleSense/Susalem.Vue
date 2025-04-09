<template>
    <div>
        <div>
            <el-tabs v-model="activeTab" class="tab">
                <el-tab-pane name="setting" :label="$t('Notice.Setting')">
                    <el-descriptions class="margin-top" :title="$t('Notice.Detail')" direction="vertical" :column="5" size="medium" border>
                        <template slot="extra">
                            <el-button-group>
                                <el-button type="primary" size="small" @click="editSetting()">{{ $t('Notice.EditSetting') }}</el-button>
                            </el-button-group>
                        </template>
                        <el-descriptions-item :label="$t('Notice.Status')">
                            <el-tag v-if="setting.isEnable" class="ml-3" type="success">{{ $t('Enable') }}</el-tag>
                            <el-tag v-else class="ml-3" type="info">{{ $t('Disable') }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="URL">
                            {{ setting.webHookUrl }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('Notice.PostRecord')">
                            <el-tag v-if="setting.postRecord" class="ml-3" type="success">{{ $t('Notice.Open') }}</el-tag>
                            <el-tag v-else class="ml-3" type="info">{{ $t('Notice.Close') }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('Notice.PostAlarm')">
                            <el-tag v-if="setting.postAlarm" class="ml-3" type="success">{{ $t('Notice.Open') }}</el-tag>
                            <el-tag v-else class="ml-3" type="info">{{ $t('Notice.Close') }}</el-tag>
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
                    <el-form-item label="URL" prop="webHookUrl" :rules="[
                        { required: true, message: $t('Notice.UrlInput'), trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="ruleForm.webHookUrl" />
                    </el-form-item>
                    <el-form-item :label="$t('Notice.PostRecord')" prop="postRecord">
                        <el-switch v-model="ruleForm.postRecord" />
                    </el-form-item>
                    <el-form-item :label="$t('Notice.PostAlarm')" prop="postAlarm">
                        <el-switch v-model="ruleForm.postAlarm" />
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
    </div>
</template>

<script>

export default ({
    data() {
        return {
            activeTab: 'setting',
            setting: {},
            dialogVisible: false,
            ruleForm: {
                webHookUrl: '',
                postRecord: false,
                postAlarm: false,
                isEnable: false
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
        },
        editSetting() {
            console.log(this.setting)
            this.ruleForm.webHookUrl = this.setting.webHookUrl
            this.ruleForm.postRecord = this.setting.postRecord
            this.ruleForm.postAlarm = this.setting.postAlarm
            this.ruleForm.isEnable = this.setting.isEnable
            console.log(this.ruleForm)

            this.dialogVisible = true
        },
        async loadSetting() {
            await this.$api.get('/api/Notice/webhook').then(reponse => {
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
                res =  await this.$api.post('/api/Notice/webhook/setting', sendData)

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
