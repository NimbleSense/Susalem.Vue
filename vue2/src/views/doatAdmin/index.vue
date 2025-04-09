<template>
    <div class="user">
        <div class="action">
            <div>
                <el-button type="primary" icon="el-icon-plus" @click="addUser">{{ $t('Position.Create') }}</el-button>
                <el-button @click="uploadDrawerVisible = true">{{ $t('Zone.List') }}</el-button>
            </div>
        </div>
        <div class="user-table">
            <el-table :data="mainList" border style="width: 100%;" height="100%">
                <el-table-column prop="name" :label="$t('Position.Detail')" />
   
                <el-table-column prop="areaId" :label="$t('Position.BelongArea')">
                    <template slot-scope="scope">
                        {{ (areaList.find(res =>res.id === scope.row.areaId) || {}).name }}
                    </template>
                </el-table-column>

                <el-table-column prop="description" :label="$t('Position.Function')">
                    <template slot-scope="scope">
                        <el-button v-for="(item, index) in scope.row.functions" :key="index" type="text" size="mini">
                            {{ $t(item.key) }}
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="areaId" :label="$t('Position.RelatedAlarms')">
                    <template slot-scope="scope">
                        <el-button v-for="item in scope.row.boundedAlerter" :key="item" type="text" size="mini">
                            {{ (alerterList.find(res =>res.id === item) || {}).name }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('Position.Action')" width="200">
                    <template slot-scope="scope">
                        <el-button type="success" icon="el-icon-edit" size="mini" @click="initRuleForm(scope.row)" />
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delItem(scope.row)" />
                        <el-dropdown style="margin-left: 20px;" @command="handleMenuCommand">
                            <el-button text size="small" icon="el-icon-setting" />
                            
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="beforeHandleCommand(scope.row, 'resource')">{{ $t('Position.AssignResource') }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :close-on-click-modal="false"
                   :title="ruleForm.id ? $t('Position.EditPosition'): $t('Position.Add')"
                   :visible.sync="dialogVisible"
                   :modal-append-to-body="false"
                   width="800px"
        >
            <div>
                <el-form ref="ruleForm" :model="ruleForm" label-width="150px" class="demo-ruleForm">
                    <el-form-item :label="$t('Position.Detail')" prop="name" :rules="[
                        { required: true, message: $t('Position.NameInput'), trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="ruleForm.name" />
                    </el-form-item>
                    <el-form-item :label="$t('Position.Description')" prop="description" :rules="[
                        { required: true, message: $t('Position.DescriptionInput'), trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="ruleForm.description" />
                    </el-form-item>

                    <el-form-item :label="$t('Position.PositionZone')" prop="areaId" :rules="[
                        { required: true, message: $t('Position.ZoneSelect'), trigger: 'blur' }
                    ]"
                    >
                        <el-select v-model="ruleForm.areaId" clearable :placeholder="$t('Position.ZoneSelect')" style="width: 100%;">
                            <el-option
                                v-for="item in areaList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="显示门状态" prop="showDoor">
                        <el-radio-group v-model="ruleForm.showDoor" size="small">
                            <el-radio-button :label="true">{{ $t('Enable') }}</el-radio-button>
                            <el-radio-button :label="false">{{ $t('Disable') }}</el-radio-button>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item :label="$t('Position.BoundAlarms')" prop="boundedAlerter">
                        <el-select v-model="ruleForm.boundedAlerter" value-key="id" multiple :placeholder="$t('Position.BoundAlarms')" style="width: 100%;">
                            <el-option v-for="item in alerterList" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ $t('Cancel') }}</el-button>
                <el-button type="primary" @click="sendForm">{{ $t('Confirm') }}</el-button>
            </span>
        </el-dialog>

        <el-dialog :close-on-click-modal="false"
                   :title="currentName"
                   :visible.sync="sourceDailog"
                   :modal-append-to-body="false"
                   width="960px"
        >
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane v-for="typeItem in fnList" :key="typeItem" :label="$t(typeItem)" :name="typeItem">
                    <el-table :data="deviceList" border style="width: 100%;" max-height="400">
                        <el-table-column fixed="" prop="name" :label="$t('Device.Name')" width="200px" sortable />
                        <el-table-column prop="properties" :label="$t('Device.Function')">
                            <template slot-scope="scope">
                                <el-checkbox v-for="(item, index) in scope.row.properties" :key="index" :value="isCheck(item.id)" size="mini" @change="(key) => itemChange(key, item.id)">
                                    {{ $t(item.key) }}
                                </el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column prop="deviceTypeId" :label="$t('Device.Type')" :filters="deviceTypeFilterList" :filter-method="filterTag" filter-placement="bottom-end" width="160px">
                            <template slot-scope="scope">
                                <el-button type="text" size="mini">
                                    {{ (deviceTypeFilterList.find(res =>res.value === scope.row.deviceTypeId) || {}).text }}
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <span slot="footer" class="dialog-footer">
                <el-button @click="sourceDailog = false">{{ $t('Cancel') }}</el-button>
                <el-button type="primary" @click="applyRule">{{ $t('Confirm') }}</el-button>
            </span>
        </el-dialog>

        <el-drawer
            :title="$t('Zone.List')"
            :visible.sync="uploadDrawerVisible"
            :modal-append-to-body="false"
        >
            <div style="margin-left: 15px; margin-right: 10px;">
                <div>
                    <el-button type="primary" icon="el-icon-plus" @click="addArea">{{ $t('Zone.Create') }}</el-button>
                </div>
            </div>
            <div style="margin-left: 15px; margin-top: 15px; margin-right: 10px;">
                <el-table :data="areaList" border style="width: 100%;">
                    <el-table-column prop="name" :label="$t('Zone.Detail')" />

                    <el-table-column :label="$t('Zone.Action')" width="120">
                        <template slot-scope="scope">
                            <el-button type="success" icon="el-icon-edit" size="mini" @click="initAreaRuleForm(scope.row)" />
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delAreaItem(scope.row)" />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-drawer>

        <el-dialog :close-on-click-modal="false"
                   :title="areaRuleForm.id ? $t('Zone.EditZone'): $t('Zone.Add')"
                   :visible.sync="areaDialogVisible"
                   :modal-append-to-body="false"
                   width="500px"
        >
            <div>
                <el-form ref="areaRuleForm" :model="areaRuleForm" label-width="150px" class="demo-ruleForm">
                    <el-form-item :label="$t('Zone.Detail')" prop="name" :rules="[
                        { required: true, message: $t('Zone.NameInput'), trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="areaRuleForm.name" />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="areaDialogVisible = false">{{ $t('Cancel') }}</el-button>
                <el-button type="primary" @click="sendAreaForm">{{ $t('Confirm') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchVal: '',
            dialogVisible: false,
            areaDialogVisible: false,
            sourceDailog: false,
            uploadDrawerVisible: false,
            alerterList: [
            ],
            mainList: [
            ],
            deviceList: [],
            optsCheck: [],
            currentId: '',
            currentName: '',
            areaList: [],
            deviceTypeFilterList: [],
            fnList: [],
            propertyList: [],
            positionFunctionList: [],
            activeName: '',
            ruleForm: {
                name: '',
                areaId: '', 
                description: '',
                showDoor: true,
                boundedAlerter: []
            },
            areaRuleForm: {
                name: ''
            },
            boundPosition: {
                positionKey: '',
                deviceFunction: '',
                deviceFunctionList: []
            },
            checkItems: [],
            robotSelected: [],
            fnObj: {} // 定位对象
        }
    },
	
    mounted() {
        this.loadList()
        this.loadArealist()
        this.loadTypeList()
        this.loadFnList()
        this.loadDeviceList()
        this.loadAlerter()
    },
    methods: {
        beforeHandleCommand(row, command) {
            return {
                'row': row,
                'command': command
            }
        },
        handleMenuCommand(command) {
            if (command.command === 'resource') {
                this.setSource(command.row)
            }
        },
        addArea() {
            this.initAreaRuleForm()
        },
        initAreaRuleForm(data) {
            this.areaDialogVisible = true
            this.areaRuleForm = {
                name: ''
            }
            if (data) {
                this.areaRuleForm.id = data.id
                this.areaRuleForm.name = data.name
            }
        },
        delAreaItem(item) {
            this.$confirm(this.$t('Zone.DeleteConfirm'), this.$t('WarnHint'), { confirmButtonText: this.$t('Confirm'), cancelButtonText: this.$t('Cancel'), type: 'warning'}).then(() => {
                this.$api.delete(`/api/Area/${item.id}`).then(() => {
                    this.$message({type: 'success', message: this.$t('Zone.DeleteSuccess')})
                    this.loadArealist() 
                }, () => {
                    this.$message({type: 'error', message: this.$t('Zone.DeleteFailed')})
                })
            }) 
        },

        sendAreaForm() {
            this.$refs.areaRuleForm.validate((async valid => {
                if (!valid) {
                    console.log(valid)
                    return
                }

                const sendData = {...this.areaRuleForm}
                const {id = null} = sendData
                let res = {}
                if (id) {
                    res =  await this.$api.put(`/api/Area/${id}`, sendData)
                } else {
                    res =  await this.$api.post('/api/Area', sendData)
                }

                console.log(res)
                const { status } = res 
                if (status === 201 || status === 204 || status === 200) {
                    await this.loadArealist()
                    this.areaDialogVisible = false
                } else {
                    this.$message.error(this.$t('Zone.UpdateFailed'))
                }
            }))
        },
        addUser() {
            this.initRuleForm()
        },
        initRuleForm(data) {
            this.dialogVisible = true
            this.ruleForm = {
                name: '',
                areaId: '', 
                description: '',
                showDoor: true,
                boundedAlerter: []
            }
            if (data) {
                this.ruleForm.id = data.id
                this.ruleForm.name = data.name
                this.ruleForm.description = data.description
                this.ruleForm.areaId = data.areaId
                this.ruleForm.showDoor = data.showDoor
                this.ruleForm.boundedAlerter = data.boundedAlerter
            }
        },

        async loadList() {
            const bdata = await this.$api.get('/api/Position')
            console.log('/api/Position', bdata)
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                this.mainList = data
            } else {
                this.$message.error(this.$t('Position.SearchDevicesError'))
            }
        },

        async loadAlerter() {
            const bdata = await this.$api.get('/api/Alerter')
            console.log('/api/Alerter', bdata)
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                this.alerterList = data
            } else {
                this.$message.error(this.$t('Position.SearchAlarmDevicesError'))
            }

        },

        async loadDeviceList() {
            const bdata = await this.$api.get('/api/Device')
            console.log('/api/Device/runnable', bdata)
            const { data = [] } = bdata
            this.deviceList = []
            this.optsCheck = []

            if (Array.isArray(data)) {
                data.forEach(item => {
                    item.properties.forEach(deviceFn => {
                        deviceFn.id = `${item.id},${deviceFn.key},${deviceFn.unit}`
                        deviceFn.deviceName = item.name
                        this.optsCheck.push({...deviceFn})
                    })
                    this.deviceList.push(item)
                })
                console.log('load device list')
                console.log(this.deviceList, this.optsCheck)
                
            } else {
                this.$message.error(this.$t('Position.SearchDevicesError'))
            }

        },
        async loadArealist() {
            const bdata = await this.$api.get('/api/Area/list')
            console.log('/api/Area/list', bdata)
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                this.areaList = data
            } else {
                this.$message.error(this.$t('Zone.SearchZonesError'))
            }
        },
        async loadTypeList() {
            const deviceTypeData = await this.$api.get('api/Device/types')
            deviceTypeData.data.forEach(element => {
                this.deviceTypeFilterList.push({
                    text: this.$t(element.name),
                    value: element.id
                })
            })
            console.log(this.deviceTypeFilterList)
        },

        async loadFnList() {
            const bdata = await this.$api.get('/api/Position/functions')
            console.log('/api/Area', bdata)
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                this.fnList = data
                this.activeName = this.fnList[0]
                this.fnList.forEach(key => {
                    this.fnObj[key] = []
                })
            } else {
                this.$message.error(this.$t('Position.SearchFunctionsError'))
            }
        },
        getSelectedFunction(item) {
            const newItem = this.positionFunctionList.find(item2 => item2.key === item)
            this.boundPosition.deviceFunctionList = newItem.devices.map(t => t.key)
        },

        deviceTypeFn() {
        },

        delItem(item) {
            this.$confirm(this.$t('Position.DeleteConfirm'), this.$t('WarnHint'), { confirmButtonText: this.$t('Confirm'), cancelButtonText: this.$t('Cancel'), type: 'warning'}).then(() => {
                this.$api.delete(`/api/Position/${item.id}`).then(() => {
                    this.$message({type: 'success', message: this.$t('Position.DeleteSuccess')})
                    this.loadList() 
                }, () => {
                    this.$message({type: 'error', message: this.$t('Position.DeleteFailed')})
                })
            })  
            
        },

        filterTag(value, row) {
            return row.deviceTypeId === value
        },

        sendForm() {
            this.$refs.ruleForm.validate((async valid => {
                if (!valid) {
                    console.log(valid)
                    return
                }

                const sendData = {...this.ruleForm}
                console.log(sendData)
                const {id = null} = sendData
                let res = {}
                console.log(sendData)
                if (id) {
                    res =  await this.$api.put(`/api/Position/${id}`, sendData)
                } else {
                    res =  await this.$api.post('/api/Position', sendData)

                }

                console.log(res)
                const { status } = res 
                if (status === 201 || status === 204 || status === 200) {
                    this.loadList()
                    this.dialogVisible = false
                } else {
                    this.$message.error(this.$t('Position.UpdateFailed'))
                }
            }))
        },

        setSource(item) {
            console.log('set source', item)
            this.sourceDailog = true
            this.currentId = item.id
            this.currentName = item.name
            this.fnList.forEach(key => {
                this.fnObj[key] = []
            })
            const { functions } = item
            functions.forEach(item => {
                console.log('set source')
                console.log(item)
                this.fnObj[item.key] = [...item.devices]
            })

            this.handleClick()

        },

        checkItemsChange() {
            console.log(this.checkItems)
        },

        itemChange(item1, item2) {
            console.log('item change')
            console.log(item1, item2)
            if (item1) {
                this.checkItems.push(item2)
            } else {
                this.checkItems = this.checkItems.filter(item => item2 !== item)
            }
            this.fnObj[this.activeName] = this.checkItems.map(item => {
                const arr = item.split(',')
                return {
                    unit: arr[2],
                    key: arr[1],
                    id: arr[0]
                }
            })
        },
        isCheck(id) {
            return this.checkItems.includes(id)
        },

        handleClick() {
            console.log('handle click', this.activeName, this.fnObj)
            this.checkItems = this.fnObj[this.activeName].map(item => {
                var device = this.deviceList.find(deviceItem => deviceItem.id == item.id)
                var deviceProperty = device.properties.find(prop => prop.key  == item.key)
                return `${item.id},${item.key},${deviceProperty.unit}`
            })
        },

        applyRule() {
            console.log(this.fnObj)
            let arr = []
            for (let key in this.fnObj) {
                if (this.fnObj[key].length) {
                    arr.push({
                        key,
                        devices: this.fnObj[key]
                    })
                }

            }
            console.log(arr)
            this.$api.put(`/api/Position/${this.currentId}/function`, arr).then(res => {
                console.log(res)
                this.$message.success(this.$t('Position.SetSuccess'))
                this.loadList()
                this.sourceDailog = false
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
            height: 60px;
            line-height: 60px;
            display: flex;
            >div {
                margin-left: 8px;
            }
        }
        .user-table {
            flex: 1;
            padding: 8px;
        }
        .user-foot {
            height: 60px;
            padding: 13px 8px 0 8px;
            text-align: right;
        }
    }
</style>
