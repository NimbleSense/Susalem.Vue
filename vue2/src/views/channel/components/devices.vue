<template>
    <div class="user">
        <div class="action">
            <el-button type="primary" @click="addUser">{{ $t('Device.Create') }}</el-button>
        </div>
        <div class="user-table">
            <el-table :data="mainList" border style="width: 100%;">
                <el-table-column prop="online" :label="$t('Device.Status')" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.online" type="success">
                            {{ $t('Device.Online') }}
                        </el-tag>
                        <el-tag v-else type="info">{{ $t('Device.Offline') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" :label="$t('Device.Name')" />
                <el-table-column prop="address" :label="$t('Device.Address')" width="80" />
                <el-table-column prop="deviceTypeId" :label="$t('Device.Type')">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini">
                            {{ $t((typeList.find(res =>res.id === scope.row.deviceTypeId) || {}).name) }}
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="properties" :label="$t('Device.Function')">
                    <template slot-scope="scope">
                        <el-button v-for="(item, index) in scope.row.properties" :key="index" type="text" size="mini">
                            {{ $t(item.key) }}
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" :label="$t('Operation')" width="180">
                    <template slot-scope="scope">
                        <el-button type="success" icon="el-icon-edit" size="mini" @click="initRuleForm(scope.row)" />
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delItem(scope.row)" />
                        <el-button type="text" size="mini" @click="debugDevice(scope.row)">调试</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :close-on-click-modal="false"
                   :title="ruleForm.id ? $t('Device.Edit2'): $t('Device.Add')"
                   :visible.sync="dialogVisible"
                   :modal-append-to-body="false"
                   width="820px"
        >
            <div>
                <el-divider content-position="left">{{ $t('Device.BasicSetting') }}</el-divider>
                <el-form ref="ruleForm" :model="ruleForm" label-width="150px" class="demo-ruleForm">
                    <el-form-item :label="$t('Device.DeviceInfo')" required="">
                        <el-row :gutter="10" type="flex">
                            <el-col :span="8">
                                <el-form-item prop="name" :rules="[
                                    { required: true, message:$t('Device.NameInput'), trigger: 'blur' }
                                ]"
                                >
                                    <el-input v-model="ruleForm.name" :placeholder="$t('Device.Name')" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item prop="address" :rules="[
                                    { required: true, message: $t('Device.AddressInput'), trigger: 'blur' }
                                ]"
                                >
                                    <el-input v-model="ruleForm.address" :placeholder="$t('Device.Address')" type="number" />
                                </el-form-item>
                            </el-col>
                            
                            <el-col :span="8">
                                <el-form-item prop="deviceTypeId" :rules="[
                                    { required: true, message: $t('Device.TypeSelect'), trigger: 'change' }
                                ]"
                                >
                                    <el-select v-model="ruleForm.deviceTypeId" clearable :placeholder="$t('Device.TypeSelect')" style="width: 100%;" @change="deviceTypeChange">
                                        <el-option
                                            v-for="item in typeList"
                                            :key="item.id"
                                            :label="$t(item.name)"
                                            :value="item.id"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>

                    <el-form-item :label="$t('Device.Function')" prop="properties" :rules="[
                        { required: true, message: $t('Device.FunctionInput'), trigger: 'change' }
                    ]"
                    >
                        <el-select v-model="ruleForm.properties" value-key="key" multiple :placeholder="$t('Device.FunctionInput')" style="width: 100%;" @change="deviceTypeFn">
                            <el-option
                                v-for="(item,index) in propertyList"
                                :key="index"
                                :label="$t(item.key)"
                                :value="item"
                            />
                        </el-select>
                    </el-form-item>
                    <el-divider content-position="left">{{ $t('Device.FunctionSetting') }}</el-divider>
                    <el-form-item :label="$t('Device.Function')" style="margin-bottom: 2px;">
                        <el-row :gutter="8">
                            <el-col :span="4">
                                <span>{{ $t('Device.Reg') }}</span>
                            </el-col>
                            <el-col :span="4">
                                <span>{{ $t('Device.Factor') }}</span>
                            </el-col>
                            <el-col :span="10">
                                <span> {{ $t('Device.Express') }}</span>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item v-for="item in ruleForm.properties" :key="item.key" :label="$t(item.key)" required>
                        <el-row :gutter="8">
                            <el-col :span="4">
                                <el-input v-model="item.reg" :placeholder="$t('Device.Reg')" />
                            </el-col>
                            <el-col :span="4">
                                <el-input v-model="item.factor" :placeholder="$t('Device.Factor')" />
                            </el-col>
                            <el-col :span="14">
                                <el-input v-model="item.formula" :placeholder="$t('Device.Express')" />  
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ $t('Cancel') }}</el-button>
                <el-button type="primary" @click="sendForm()">{{ $t('Confirm') }}</el-button>
            </span>
        </el-dialog>

        <el-drawer
            title="设备调试"
            :visible.sync="uploadDrawerVisible"
            :modal-append-to-body="false"
        >
            <div style="margin-left: 15px; margin-top: 15px; margin-right: 10px;">
                <el-row>
                    <el-button plain @click="syncTime()">同步时钟</el-button>
                </el-row>
            </div>
            <div style="margin-left: 15px; margin-top: 15px; margin-right: 10px;">
                <el-table :data="debugDataList" border style="width: 100%;">
                    <el-table-column prop="key" label="功能" />

                    <el-table-column label="数据">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.value" type="text" />
                        </template>
                    </el-table-column>

                    <el-table-column prop="unit" label="单位" width="60" />

                    <el-table-column :label="$t('Zone.Action')" width="70">
                        <template slot-scope="scope">
                            <el-button type="success" icon="el-icon-edit" size="mini" @click="updateDebugData(scope.row)" />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-drawer>
    </div>
</template>

<script>

export default {
    data() {
        return {
            channelid: 0,
            dialogVisible: false,
            uploadDrawerVisible: false,
            mainList: [
            ],
            currentDeviceId: '',
            typeList: [],

            propertyList: [],
            ruleForm: {
                address: 0,
                name: '',
                deviceTypeId: '', // 设备类型id
                properties: [] // 设备功能
            },
            debugDataList: []
        }
    },
	
    mounted() {
        this.loadTypeList()
		
    },
    methods: {
        updateDebugData(item) {
            this.$api.post(`/api/Device/${this.currentDeviceId}/write`, item).then(() => {
                this.$message.success(`${item.key} 写入成功`)
            }).catch(() => {
                this.$message.error(`${item.key} 写入失败`)
            })
        },
        async debugDevice(item) {
            this.currentDeviceId = item.id
            this.uploadDrawerVisible = true

            const bdata = await this.$api.get(`/api/Device/${this.currentDeviceId}/debugdata`)
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                this.debugDataList = data
            } else {
                this.$message.error('获取调试属性失败')
            }
        },
        addUser() {
            this.initRuleForm()
        },
        initRuleForm(data) {
            this.dialogVisible = true
            this.ruleForm = {
                address: 0,
                name: '',
                deviceTypeId: '', // 设备类型id
                properties: [] // 设备功能
            }
            if (data) {
                this.ruleForm.id = data.id
                this.ruleForm.address = data.address
                this.ruleForm.name = data.name
                this.ruleForm.deviceTypeId = data.deviceTypeId
                this.ruleForm.properties = data.properties

                const item = this.typeList.find (item => item.id === this.ruleForm.deviceTypeId)
                const { properties = [] } = item || {}
                this.propertyList = [...properties]
            }
        },
        async loadList(channelid) {
            this.channelid = channelid
            const bdata = await this.$api.get(`/api/Channel/${channelid}/devices`)
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                this.mainList = data
            } else {
                this.$message.error(this.$t('Position.SearchDevicesError'))
            }
        },

        async loadTypeList() {
            const bdata = await this.$api.get('/api/Device/types')
            console.log('/api/Device/types', bdata)
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                this.typeList = data
            } else {
                this.$message.error(this.$t('Device.SearchTypesError'))
            }
        },
        deviceTypeChange() {
            const item = this.typeList.find (item => item.id === this.ruleForm.deviceTypeId)
            console.log(this.ruleForm, item)
            const { properties = [] } = item || {}
            this.propertyList = [...properties]
            this.ruleForm.properties = []			
        },

        deviceTypeFn(item) {
            console.log(item)
        },
        delItem(item) {
            this.$confirm(this.$t('Device.DeleteConfirm'), this.$t('WarnHint'), { confirmButtonText: this.$t('Confirm'), cancelButtonText: this.$t('Cancel'), type: 'warning'}).then(() => {
                this.$api.delete(`/api/Device/${item.id}`).then(() => {
                    this.$message({type: 'success', message: this.$t('Device.DeleteSuccess')})
                    this.loadList(this.channelid) 
                }, () => {
                    this.$message({type: 'error', message: this.$t('Device.DeleteFailed')})
                })
                
            })
        },
        sendForm() {
            this.$refs.ruleForm.validate((async valid => {
                if (!valid) {
                    console.log(valid)
                    return
                }
                const sendData = {...this.ruleForm}
                const {id = null} = sendData
                console.log(sendData)
                let res = {}
                if (id) {
                    res =  await this.$api.put(`/api/Device/${id}`, sendData)
                } else {
                    res =  await this.$api.post(`/api/Device/channel/${this.channelid}`, sendData)
                }

                console.log(res)
                const { status } = res 
                if (status === 201 || status === 204 || status === 200) {
                    this.loadList(this.channelid)
                    this.dialogVisible = false
                } else {
                    this.$message.error(this.$t('Device.UpdateFailed'))
                }
            }))
        },
        syncTime() {
            this.$api.post(`/api/Device/${this.currentDeviceId}/synctime`).then(() => {
                this.$message.success('时钟同步成功')
            }).catch(() => {
                this.$message.error('时钟同步失败')
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .user {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .action {
            height: 40px;
            margin-bottom: 10px;
        }
        .user-table {
            flex: 1;
        }
        .user-foot {
            height: 60px;
            padding: 13px 8px 0 8px;
            text-align: right;
        }
    }
</style>
