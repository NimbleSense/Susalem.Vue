<template>
    <div class="user">
        <div class="action">
            <div>
                <el-button type="primary" icon="el-icon-plus" @click="addAlarmRule">{{ $t('AlarmRule.Create') }}</el-button>
            </div>
        </div>
        <div class="user-table">
            <el-table :data="alarmRuleList" border style="width: 100%;">
                <el-table-column prop="name" :label="$t('AlarmRule.Detail')" />
                <el-table-column prop="positionId" :label="$t('Positions')" width="180" :filters="positionTypeData" :filter-method="filterTag">
                    <template slot-scope="scope">
                        <el-button type="text">
                            {{ (positionList.find(res =>res.id === scope.row.positionId) || {}).name }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="alarmLevel" :label="$t('AlarmRule.AlarmLevel')" width="150">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.alarmLevel === 'Alarm' ? 'danger' : 'warning'" disable-transitions>{{ $t(scope.row.alarmLevel) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('AlarmRule.Contacts')">
                    <template v-if="scope.row.notification !=null" slot-scope="scope">
                        <el-button v-for="item in scope.row.notification.contacts" :key="item" type="text" size="mini">
                            {{ (userList.find(res =>res.id === item) || {}).userName }}
                        </el-button>
                    </template>
                </el-table-column>
               
                <el-table-column prop="active" :label="$t('AlarmRule.Status')" width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.active" type="success">{{ $t('Enable') }}</el-tag>
                        <el-tag v-else type="danger">{{ $t('Disable') }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('AlarmRule.Action')" width="160">
                    <template slot-scope="scope">
                        <el-button type="success" icon="el-icon-edit" size="mini" @click="initRuleForm(scope.row)" />
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delItem(scope.row)" />
                        <el-button type="text" size="mini" @click="manageNotification(scope.row)">{{ $t('AlarmRule.Notify') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :close-on-click-modal="false"
                   :title="ruleForm.id ? $t('AlarmRule.Edit2'): $t('AlarmRule.Add')"
                   :visible.sync="editAlarmRuleDialog"
                   :modal-append-to-body="false"
                   width="600px"
        >
            <div>
                <el-form ref="ruleForm" :model="ruleForm" label-position="top" label-width="150px" class="demo-ruleForm">
                    <el-form-item :label="$t('AlarmRule.Detail')" prop="name" :rules="[
                        { required: true, message:$t('AlarmRule.DetailInput'), trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="ruleForm.name" :placeholder="$t('AlarmRule.Detail')" />
                    </el-form-item>
                    
                    <el-form-item :label="$t('Positions')" prop="positionId" :rules="[
                        { required: true, message: $t('AlarmRule.PositionsSelect'), trigger: 'blur' }
                    ]"
                    >
                        <el-select v-model="ruleForm.positionId" clearable filterable :placeholder="$t('AlarmRule.PositionsSelect')" value-key="id" style="width: 100%;" @change="getSelectedPostionId">
                            <el-option v-for="item in positionList" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('AlarmRule.AlarmLevel')" prop="alarmLevel" :rules="[
                        { required: true, message: $t('AlarmRule.AlarmLevelSelect'), trigger: 'blur' }
                    ]"
                    >
                        <el-select v-model="ruleForm.alarmLevel" clearable :placeholder="$t('AlarmRule.AlarmLevelSelect')" style="width: 100%;">
                            <el-option v-for="item in alarmList" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('AlarmRule.TriggerCondition')" prop="rules">
                        <div v-for="item in ruleForm.rules" :key="item.$index">
                            <el-row :gutter="6">
                                <el-col :span="4">
                                    <el-select v-model="item.condition">
                                        <el-option v-for="item1 in conditionList" :key="item1.value" :label="item1.label" :value="item1.value" />
                                    </el-select>
                                </el-col>
                                <el-col :span="7">
                                    <el-select v-model="item.key" :placeholder="$t('AlarmRule.SelectProperty')">
                                        <el-option
                                            v-for="(item1,index) in keyList"
                                            :key="index"
                                            :label="$t(item1)"
                                            :value="item1"
                                        />
                                    </el-select>
                                </el-col>
                                <el-col :span="5">
                                    <el-select v-model="item.calFormula">
                                        <el-option v-for="item1 in formulaList" :key="item1.value" :label="item1.label" :value="item1.value" />
                                    </el-select>
                                </el-col>
                                <el-col :span="6">
                                    <el-input v-model="item.ruleValue" :placeholder="$t('AlarmRule.IntValue')" />
                                </el-col>
                                <el-col :span="2">
                                    <el-button type="danger" plain icon="el-icon-delete" circle @click="removeRule(item)" />
                                </el-col>
                            </el-row>
                        </div>
                        <el-button @click="addRule">{{ $t('AlarmRule.AddCondition') }}</el-button>
                    </el-form-item>

                    <el-row :gutter="8">
                        <el-col :span="12">
                            <el-form-item :label="$t('AlarmRule.TriggerCount')">
                                <el-input-number v-model="ruleForm.settings.triggerInterval" :min="1" :max="15" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="$t('AlarmRule.TriggerInterval')">
                                <el-input-number v-model="ruleForm.settings.triggerCount" :min="1" :max="15" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item :label="$t('AlarmRule.Status')" prop="active" :rules="[
                        { required: true, message: $t('AlarmRule.StatusSelect'), trigger: 'blur' }
                    ]"
                    >
                        <el-radio-group v-model="ruleForm.active" size="small">
                            <el-radio-button :label="true">{{ $t('Enable') }}</el-radio-button>
                            <el-radio-button :label="false">{{ $t('Disable') }}</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('AlarmRule.Comment')" prop="description">
                        <el-input v-model="ruleForm.description" type="textarea" />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editAlarmRuleDialog = false">{{ $t('Cancel') }}</el-button>
                <el-button type="primary" @click="sendForm">{{ $t('Confirm') }}</el-button>
            </span>
        </el-dialog>

        <el-dialog :close-on-click-modal="false"
                   :title="ruleForm.id ? $t('AlarmRule.EditNotify'): $t('AlarmRule.AddNotify')"
                   :visible.sync="editAlarmNotificationDialog"
                   :modal-append-to-body="false"
                   width="600px"
        >
            <div>
                <el-form ref="notificationRuleForm" :model="notificationRuleForm" label-width="150px" class="demo-ruleForm">
                    <el-form-item :label="$t('AlarmRule.Contacts')" prop="contacts" :rules="[
                        { required: true, message: $t('AlarmRule.SelectContacts'), trigger: 'blur' }
                    ]"
                    >
                        <el-select v-model="notificationRuleForm.contacts" value-key="id" multiple :placeholder="$t('AlarmRule.SelectContacts')" style="width: 100%;">
                            <el-option v-for="item in userList" :key="item.id" :label="item.userName" :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editAlarmNotificationDialog = false">{{ $t('Cancel') }}</el-button>
                <el-button type="primary" @click="sendAlarmNotification">{{ $t('Confirm') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

export default {
    data() {
        return {
            alarmList: [
                {
                    value: 'Warning',
                    label: this.$t('Warning')
                }, {
                    value: 'Alarm',
                    label: this.$t('Alarm')
                }
            ],
            conditionList: [
                {value: 'AND', label: this.$t('AlarmRule.And')},
                {value: 'OR', label: this.$t('AlarmRule.Or')}
            ],
            formulaList: [
                {value: 'GreaterThan', label: '>'},
                {value: 'GreaterThanOrEqual', label: '>='},
                {value: 'LessThan', label: '<'},
                {value: 'LessThanOrEqualOrEqual', label: '<='},
                {value: 'Equal', label: '='},
                {value: 'NotEqual', label: '≠'}
            ],
            alarmRuleList: [],
            keyList: [],
            positionList: [],
            messageSettingList: [],
            userList: [],
            editAlarmRuleDialog: false,
            editAlarmNotificationDialog: false,
            notificationRuleForm: {
                contacts: []
            },
            currentAlarmRule: {},
            ruleForm: {
                id: '',
                name: '',
                positionId: '',
                alarmLevel: 'Warning',
                description: '',
                rules: [],
                settings: {
                    triggerInterval: 1,
                    triggerCount: 1
                },
                active: true
            },
            rule: {
                condition: 'AND',
                calFormula: 'GreaterThan',
                ruleValue: 0,
                key: ''
            },
            positionTypeData: []
        }
    },
    mounted() {
        this.loadUserList()
        this.loadPositionList()	
        this.loadList()
    },
    methods: {
        async loadList() {
            const bdata = await this.$api.get('/api/AlarmRule')
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                console.log(data)
                this.alarmRuleList = data
            } else {
                this.$message.error(
                    this.$t('AlarmRule.SearchFailed')
                )
            }
        },
        async loadPositionList() {
            const bdata = await this.$api.get('/api/Position')
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                console.log(data)
                this.positionList = data
                this.positionList.forEach(element => {
                    this.positionTypeData.push({
                        text: element.name,
                        value: element.id
                    })
                })
            } else {
                this.$message.error(this.$t('AlarmRule.SearchPositionsFailed'))
            }
        },
        getSelectedPostionId(id) {
            this.keyList = []
            let item = this.positionList.find(t => t.id == id)
            let positionFunctionList = item.functions.map(t => t)
            positionFunctionList.forEach(p => {
                let tempDeviceList = p.devices.map(t => t.key)
                tempDeviceList.forEach(p2 => {
                    this.keyList.push(p2)
                })
            })
        },
        delItem(item) {
            this.$confirm(this.$t('AlarmRule.DeleteConfirm'), this.$t('WarnHint'), { confirmButtonText: this.$t('Confirm'), cancelButtonText: this.$t('Cancel'), type: 'warning'}).then(() => {
                this.$api.delete(`/api/AlarmRule/${item.id}`).then(() => {
                    this.$message({type: 'success', message: this.$t('AlarmRule.DeleteSuccess')})
                    this.loadList() 
                }, () => {
                    this.$message({type: 'error', message: this.$t('AlarmRule.DeleteFailed')})
                })
                
            })
        },
        async manageNotification(item) {
            this.currentAlarmRule = item
            if (item.notification === null) {
                this.notificationRuleForm = {
                    contacts: []
                    
                }            
            } else {
                this.notificationRuleForm.contacts = [...item.notification.contacts]
            }
            this.editAlarmNotificationDialog = true
        },
        async loadUserList() {
            const bdata = await this.$api.get('/api/User')
            console.log('/api/User', bdata)
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                this.userList = data
            }
        },
        filterTag(value, row) {
            return row.positionId === value
        },
        addRule() {
            this.rule = {
                condition: 'AND',
                calFormula: 'GreaterThan',
                ruleValue: 0,
                key: ''
            }
            this.ruleForm.rules.push(this.rule)
        },
        removeRule(item) {
            let a = this.ruleForm.rules.indexOf(item)
            this.ruleForm.rules.splice(a, 1)
        },
        addAlarmRule() {
            this.initRuleForm()
        },
        initRuleForm(data) {
            this.editAlarmRuleDialog = true
            this.ruleForm = {
                id: '',
                name: '',
                alarmLevel: 'Warning',
                positionId: '',
                description: '',
                rules: [],
                active: true,
                settings: {
                    triggerInterval: 1,
                    triggerCount: 1
                }
            }
            if (data) {
                this.ruleForm.id = data.id
                this.ruleForm.name = data.name
                this.ruleForm.positionId = data.positionId
                this.ruleForm.alarmLevel = data.alarmLevel
                this.ruleForm.description = data.description
                this.ruleForm.active = data.active
                
                this.ruleForm.settings = Object.assign({}, data.settings)
                this.ruleForm.rules = [...data.rules]

                this.getSelectedPostionId(data.positionId)
            }
        },
        sendForm() {
            this.$refs.ruleForm.validate((async valid => {
                if (!valid) {
                    console.log(valid)
                    return
                }
                const sendData = {...this.ruleForm}
                const {id = null} = sendData
                let res = {}
                if (id) {
                    res =  await this.$api.put(`/api/AlarmRule/${id}`, sendData)
                } else {
                    res =  await this.$api.post('/api/AlarmRule', sendData)
                }

                console.log(res)
                const { status } = res 
                if (status === 201 || status === 204 || status === 200) {
                    this.loadList()
                    this.editAlarmRuleDialog = false
                } else {
                    this.$message.error(this.$t('AlarmRule.UpdateFailed'))
                }
            }))
        },
        sendAlarmNotification() {
            this.$refs.notificationRuleForm.validate((async valid => {
                if (!valid) {
                    console.log(valid)
                    return
                }
                const sendData = {...this.notificationRuleForm}
                let res =  await this.$api.put(`/api/AlarmRule/${this.currentAlarmRule.id}/notification`, sendData)

                const { status } = res 
                if (status === 201 || status === 204 || status === 200) {
                    this.loadList()
                    this.editAlarmNotificationDialog = false
                } else {
                    this.$message.error(this.$t('AlarmRule.UpdateContactsFailed'))
                }
            }))
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