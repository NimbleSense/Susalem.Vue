<template>
    <div class="user">
        <div class="action">
            <div>
                <el-button type="primary" @click="addUser">{{ $t('Role.Create') }}</el-button>
            </div>
        </div>
        <div class="user-table">
            <el-table :data="roleList" border style="width: 100%;">
                <el-table-column prop="name" :label="$t('Role.Detail')" width="180" />
                <el-table-column prop="roles" :label="$t('Role.authority')">
                    <template slot-scope="scope">
                        <el-button v-for="item in scope.row.permissions" :key="item" type="text" size="mini">
                            {{ $t(item) }}
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" :label="$t('Role.Action')" width="160">
                    <template slot-scope="scope">
                        <el-button type="success" icon="el-icon-edit" size="mini" @click="initRuleForm(scope.row)" />
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delItem(scope.row)" />
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :close-on-click-modal="false"
                   :title="ruleForm.id ? $t('Role.EditRole'): $t('Role.Add')"
                   :visible.sync="dialogVisible"
                   :modal-append-to-body="false"
                   width="800px"
        >
            <div>
                <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item :label="$t('Role.Detail')" prop="" :rules="[
                        { required: true, message: $t('Role.NameInput'), trigger: 'blur' }]"
                    >
                        <el-input v-model="ruleForm.name" />
                    </el-form-item>
                    <el-form-item :label="$t('Role.authority')" prop="roles">
                        <el-checkbox-group v-model="ruleForm.permissions">
                            <el-checkbox v-for="item in permissionList" :key="item" :label="item">{{ $t(item) }}</el-checkbox>
                        </el-checkbox-group>
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

export default {
    data() {
        return {
            dialogVisible: false,
            roleList: [
            ],
            permissionList: [
                'AdavncedSetting',
                'DeviceManagement.All',
                'RoleManagement.All',
                'UserManagement.All',
                'PositionControl',
                'Notification.All'
            ],
            ruleForm: {
                name: '',
                permissions: []
            }
        }
    },

    mounted() {
        this.loadList()
    },

    methods: {
        async loadList() {
            const bdata = await this.$api.get('/api/Role')
            console.log('/api/Role', bdata)
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                this.roleList = data
            } else {
                this.$message.error(this.$t('Role.SearchFailed'))
            }
        },

        delItem(item) {
            this.$confirm(this.$t('Role.DeleteConfirm'), this.$t('WarnHint'), { confirmButtonText: this.$t('Confirm'), cancelButtonText: this.$t('Cancel'), type: 'warning'}).then(() => {
                this.$api.delete(`api/Role/${item.id}/${item.name}`).then(res => {
                    console.log(res)
                    this.$message({type: 'success', message: this.$t('Role.DeleteSuccess')})
                    this.loadList() 
                })
            }) 
        },

        addUser() {
            this.initRuleForm()
        },
        initRuleForm(data) {
            this.dialogVisible = true
            this.ruleForm = {
                name: '',
                permissions: []
            }
            if (data) {
                this.ruleForm.id = data.id
                this.ruleForm.name = data.name
                this.ruleForm.permissions = data.permissions
            }
        },
        sendForm() {
            this.$refs.ruleForm.validate((async valid => {
                if (!valid) {
                    return
                }

                const sendData = {...this.ruleForm}
                const {id = null} = sendData
                let res = {}
                if (id) {
                    res =  await this.$api.put(`/api/Role/${id}`, sendData)
                } else {
                    res =  await this.$api.post('/api/Role', sendData)
                }

                console.log(res)
                const { status } = res 
                if (status === 201 || status === 204 || status === 200) {
                    this.loadList()
                    this.dialogVisible = false
                } else {
                    this.$message.error(this.$t('User.RoleUpdateFailed'))
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
