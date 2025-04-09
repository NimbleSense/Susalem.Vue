<template>
    <el-dialog :close-on-click-modal="false"
               :title="ruleForm.id ? $t('Channel.Edit2'): $t('Channel.Add')"
               :visible.sync="dialogVisible" :before-close="closeDialog"
               :modal-append-to-body="false"
               width="800px"
    >
        <el-form ref="ruleForm" label-position="top" label-width="80px" :model="ruleForm" class="demo-ruleForm">
            <el-form-item :label="$t('Channel.Name1')" prop="name" :rules="[
                { required: true, message: $t('Channel.Name1Input'), trigger: 'blur' }
            ]"
            >
                <el-input v-model="ruleForm.name" />
            </el-form-item>
            <el-form-item :label="$t('Channel.Module')" prop="enable" :rules="[
                { required: true, message: $t('Channel.ModuleSelect'), trigger: 'blur' }
            ]"
            >
                <el-radio-group v-model="ruleForm.channelType">
                    <el-radio :label="'ModbusRtu'">{{ $t('ModbusRtu') }}</el-radio>
                    <el-radio :label="'ModbusTcp'">{{ $t('ModbusTcp') }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-divider content-position="left">{{ $t('Channel.CommSetting') }}</el-divider>
            <el-row v-if="ruleForm.channelType=='ModbusRtu'" :gutter="10">
                <el-col :span="8">
                    <el-form-item :label="$t('Channel.Serial')" prop="serialportSetting.portName" :rules="[
                        { required: true, message: $t('Channel.SerialSelect'), trigger: 'blur' }
                    ]"
                    >
                        <el-select v-model="ruleForm.serialportSetting.portName" style="width: 100%;">
                            <el-option
                                v-for="item in comsettings.coms"
                                :key="item"
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="$t('Channel.BaudRate')" class="label-right-align" prop="serialportSetting.baudRate" :rules="[
                        { required: true, message: $t('Channel.BaudRateSelect'), trigger: 'blur' }
                    ]"
                    >
                        <el-select v-model="ruleForm.serialportSetting.baudRate" style="width: 100%;">
                            <el-option
                                v-for="item in comsettings.baudrate"
                                :key="item"
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="$t('Channel.Parity')" prop="serialportSetting.parity" :rules="[
                        { required: true, message: $t('Channel.ParitySelect'), trigger: 'blur' }
                    ]"
                    >
                        <el-select v-model="ruleForm.serialportSetting.parity" style="width: 100%;">
                            <el-option
                                v-for="item in comsettings.parity"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="$t('Channel.DataBits')" prop="serialportSetting.dataBits" :rules="[
                        { required: true, message: $t('Channel.DataBitsSelect'), trigger: 'blur' }
                    ]"
                    >
                        <el-select v-model="ruleForm.serialportSetting.dataBits" style="width: 100%;">
                            <el-option
                                v-for="item in comsettings.dataBits"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="$t('Channel.StopBits')" prop="serialportSetting.stopBits" :rules="[
                        { required: true, message: $t('Channel.StopBitsSelect'), trigger: 'blur' }
                    ]"
                    >
                        <el-select v-model="ruleForm.serialportSetting.stopBits" style="width: 100%;">
                            <el-option
                                v-for="item in comsettings.stopBits"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="ruleForm.channelType=='ModbusTcp'" :gutter="10">
                <el-col :span="12">
                    <el-form-item :label="$t('Channel.Host')" prop="tcpSetting.host" :rules="[
                        { required: true, message: $t('Channel.HostInput'), trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="ruleForm.tcpSetting.host" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('Channel.Port')" prop="tcpSetting.port" :rules="[
                        { required: true, message: $t('Channel.PortInput'), trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="ruleForm.tcpSetting.port" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="8">
                <el-col :span="12">
                    <el-form-item :label="$t('Channel.ReadTimeout')" prop="settings.readTimeout">
                        <el-input-number v-model="ruleForm.settings.readTimeout" :min="1" :max="15000" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('Channel.WriteTimeout')" prop="settings.writeTimeout">
                        <el-input-number v-model="ruleForm.settings.writeTimeout" :min="1" :max="15000" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="8">
                <el-col :span="12">
                    <el-form-item label="设备轮询间隔(毫秒)" prop="settings.deviceInterval">
                        <el-input-number v-model="ruleForm.settings.deviceInterval" :min="1" :max="60000" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item :label="$t('Device.Status')" prop="enable">
                <el-radio-group v-model="ruleForm.enable" size="small">
                    <el-radio-button :label="true">{{ $t('Enable') }}</el-radio-button>
                    <el-radio-button :label="false">{{ $t('Disable') }}</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item :label="$t('Info.Comment')" prop="description">
                <el-input v-model="ruleForm.description" type="textarea" />
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">{{ $t('Cancel') }}</el-button>
            <el-button type="primary" @click="sendForm()">{{ $t('Confirm') }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            comsettings: {
                coms: [],
                baudrate: [38400, 115200],
                parity: [{
                    value: 0,
                    label: 'None'
                }, {
                    value: 1,
                    label: 'Odd'
                }, {
                    value: 2,
                    label: 'Even'
                }, {
                    value: 3,
                    label: 'Mark'
                }, {
                    value: 4,
                    label: 'Space'
                }],
                dataBits: [{value: 7, label: '7 Bits'}, {value: 8, label: '8 Bits'}],
                stopBits: [{value: 1, label: '1 Bit'}, {value: 2, label: '2 Bit'}, {value: 3, label: '1.5 Bit'}]
            },
            dialogVisible: false,
            ruleForm: {
                id: null,
                name: '',
                channelType: 'Simulator',
                enable: true,
                content: '',
                description: '',
                settings: {
                    readTimeout: 2000,
                    writeTimeout: 2000,
                    deviceInterval: 300
                },
                tcpSetting: {
                    host: '127.0.0.1',
                    port: 502
                },
                serialportSetting: {
                    portName: '',
                    baudRate: 38400,
                    parity: 0,
                    dataBits: 8,
                    stopBits: 1
                }
            }
        }
    },
    methods: {
        loadAvailablePorts() {
            this.$api.get('/api/Config/serialports')
                .then(reponse => {
                    let data = reponse.data
                    console.log(data)
                    this.comsettings.coms = data
                }, () => {
                    this.$message.error(this.$t('UserSetting1.SerialportsFailed'))
                })
        },
        add() {
            this.loadAvailablePorts()
            this.ruleForm = {
                id: null,
                name: '',
                channelType: 'Simulator',
                enable: true,
                content: '',
                description: '',
                settings: {
                    readTimeout: 2000,
                    writeTimeout: 2000,
                    deviceInterval: 300
                },
                tcpSetting: {
                    host: '127.0.0.1',
                    port: 502
                },
                serialportSetting: {
                    portName: '',
                    baudRate: 9600,
                    parity: 0,
                    dataBits: 8,
                    stopBits: 1
                }
            }
            this.dialogVisible = true
        },
        edit(item) {
            console.log(item)
            this.loadAvailablePorts()

            this.ruleForm.id = item.id
            this.ruleForm.name = item.name
            this.ruleForm.channelType = item.channelType
            this.ruleForm.enable = item.enable
            this.ruleForm.content = item.content
            this.ruleForm.description = item.description
            this.ruleForm.settings = item.settings

            if (this.ruleForm.channelType === 'ModbusRtu') {
                this.ruleForm.serialportSetting = JSON.parse(this.ruleForm.content)
            } else if (this.ruleForm.channelType === 'ModbusTcp') {
                this.ruleForm.tcpSetting = JSON.parse(this.ruleForm.content)
            }

            this.dialogVisible = true
        },

        sendForm() {
            this.$refs.ruleForm.validate((async valid => {
                if (!valid) {
                    console.log(valid)
                    return
                }
                const sendData = {...this.ruleForm}
                if (this.ruleForm.channelType === 'ModbusRtu') {
                    sendData.content = JSON.stringify(this.ruleForm.serialportSetting)
                } else if (this.ruleForm.channelType === 'ModbusTcp') {
                    sendData.content = JSON.stringify(this.ruleForm.tcpSetting)
                }

                const {id = null} = sendData
                console.log(sendData)
                let res = {}
                if (id) {
                    res =  await this.$api.put(`/api/Channel/${id}`, sendData)
                } else {
                    res =  await this.$api.post('/api/Channel', sendData)
                }

                console.log(res)
                const { status } = res 
                if (status === 201 || status === 204 || status === 200) {
                    this.dialogVisible = false
                    this.$emit('refresh')
                } else {
                    this.$message.error(this.$t('Channel.UpdateFailed'))
                }
            }))
        },
        closeDialog() {
            this.dialogVisible = false
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
}
</style>
