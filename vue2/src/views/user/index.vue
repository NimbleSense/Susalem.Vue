<template>
    <div class="user">
        <div class="action">
            <div>
                <el-button type="primary" @click="addUser">{{ $t('User.Create') }}</el-button>
            </div>
        </div>
        <div class="user-table">
            <el-table :data="userList" border style="width: 100%;">
                <el-table-column prop="userName" :label="$t('User.Account')" width="180" />
                <el-table-column prop="phoneNumber" :label="$t('User.Phone')" />
                <el-table-column prop="email" :label="$t('User.Mail')" />
                <el-table-column prop="isActive" :label="$t('User.Status')" width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isActive" type="success">{{ $t('Enable') }}</el-tag>
                        <el-tag v-else type="danger">{{ $t('Disable') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="roleName" :label="$t('User.Role')">
                    <template slot-scope="scope">
                        <el-button :key="item" type="text" size="mini">
                            {{ scope.row.roleName }}
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" :label="$t('User.Action')" width="180">
                    <template slot-scope="scope">
                        <el-button type="success" icon="el-icon-edit" size="mini" @click="initRuleForm(scope.row)" />
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delItem(scope.row)" />
                        <el-button type="text" size="mini" @click="changePwd(scope.row)">{{ $t('User.ChangePwd') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :close-on-click-modal="false"
                   :title="ruleForm.id ? $t('User.EditUser'): $t('User.Add')"
                   :visible.sync="dialogVisible"
                   :modal-append-to-body="false"
                   width="800px"
        >
            <div>
                <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item :label="$t('User.Account')" prop="userName" :rules="[
                        { required: true, message: $t('User.UserInput'), trigger: 'blur' }]"
                    >
                        <el-input v-model="ruleForm.userName" />
                    </el-form-item>
                    <el-form-item v-show="ruleForm.id ? false: true" :label="$t('User.Pwd')" prop="password" :rules="[
                        { required: true, message: $t('User.PwdInput'), trigger: 'blur' }]"
                    >
                        <el-input v-model="ruleForm.password" />
                    </el-form-item>

                    <el-form-item :label="$t('User.Phone')" prop="phoneNumber">
                        <el-input v-model="ruleForm.phoneNumber" />
                    </el-form-item>
                    <el-form-item
                        prop="email"
                        :label="$t('User.Mail')"
                    >
                        <el-input v-model="ruleForm.email" />
                    </el-form-item>
                    <el-form-item :label="$t('User.Status')" prop="isActive">
                        <el-radio v-model="ruleForm.isActive" :label="true">{{ $t('Enable') }}</el-radio>
                        <el-radio v-model="ruleForm.isActive" :label="false">{{ $t('Disable') }}</el-radio>
                    </el-form-item>
                    <el-form-item :label="$t('User.Role')" prop="roleName" :rules="[
                        { required: true, message: $t('User.RoleSelect'), trigger: 'change' }]"
                    >
                        <el-select v-model="ruleForm.roleName" clearable :placeholder="$t('User.RoleSelect')" style="width: 100%;">
                            <el-option
                                v-for="item in userRoleList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name"
                            />
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
                   :title="$t('User.ChangePwd')"
                   :visible.sync="updatePwd"
                   :modal-append-to-body="false"
                   width="500px"
        >
            <div>
                <el-form ref="pwdForm" :model="pwdForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item :label="$t('User.NewPwd')" prop="newPassword" :rules="[
                        { required: true, message: $t('User.NewPwdInput'), trigger: 'blur' }]"
                    >
                        <el-input v-model="pwdForm.newPassword" show-password />
                    </el-form-item>
                    <el-form-item :label="$t('User.ConfirmNewPwd')" prop="confirmPassword" :rules="[
                        { required: true, message: $t('User.ConfirmPwdInput'), trigger: 'blur' }]"
                    >
                        <el-input v-model="pwdForm.confirmPassword" show-password />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updatePwd = false">{{ $t('Cancel') }}</el-button>
                <el-button type="primary" @click="changePassword">{{ $t('Confirm') }}</el-button>
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
            updatePwd: false,
            updatePwdUser: '',
            userList: [
            ],
            userRoleList: [

            ],
            ruleForm: {
                userName: '',
                name: '',
                phoneNumber: '',
                email: '',
                roleName: ''
            },
            pwdForm: {
                newPassword: '',
                confirmPassword: ''
            }
        }
    },

    mounted() {
        this.loadUserRoleList()
        this.loadList()
    },

    methods: {
        changePassword() {
            if (this.pwdForm.newPassword != this.pwdForm.confirmPassword) {
                this.$message({
                    type: 'error',
                    message: this.$t('User.PwdNotRight')
                }) 
                return
            }

            this.$api.post(`/api/User/${this.updatePwdUser}/password`, this.pwdForm).then(() => {
                this.$message({
                    type: 'success',
                    message: this.$t('User.ChangePwdSuccess')
                })
                this.updatePwd = false

            }, () => {
                this.$message.error(this.$t('User.ChangePwdFailed'))
            })
        },
        changePwd(item) {
            this.updatePwdUser = item.userName
            this.updatePwd = true
        },
        async loadUserRoleList() {
            const bdata = await this.$api.get('/api/Role')
            console.log('/api/Role', bdata)
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                this.userRoleList = data
            } else {
                this.$message.error(this.$t('Role.SearchFailed'))

            }
        },

        async loadList() {
            const bdata = await this.$api.get('/api/User')
            console.log('/api/User', bdata)
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                this.userList = data
            } else {
                this.$message.error(this.$t('User.SearchFailed'))
            }
        },

        delItem(item) {
            this.$confirm(this.$t('User.DeleteConfirm'), this.$t('WarnHint'), { confirmButtonText: this.$t('Confirm'), cancelButtonText: this.$t('Cancel'), type: 'warning'}).then(() => {
                this.$api.delete(`api/User/${item.userName}`).then(res => {
                    console.log(res)
                    this.$message({type: 'success', message: this.$t('User.DeleteSuccess')})
                    this.loadList() 
                })
                
            }) 
        },

        addUser() {
            // this.dialogVisible = true
            this.initRuleForm()
        },
        initRuleForm(data) {
            this.dialogVisible = true
            this.ruleForm = {
                name: '',
                userName: '',
                email: '',
                isActive: false,
                roleName: ''
            }
            if (data) {
                this.ruleForm.id = data.id
                this.ruleForm.phoneNumber = data.phoneNumber
                this.ruleForm.isActive = data.isActive
                this.ruleForm.userName = data.userName
                this.ruleForm.email = data.email
                this.ruleForm.roleName = data.roleName
                this.ruleForm.password = '1234'
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
                    res =  await this.$api.put(`/api/User/${id}`, sendData)
                } else {
                    res =  await this.$api.post('/api/User', sendData)
                }

                console.log(res)
                const { status } = res 
                if (status === 201 || status === 204 || status === 200) {
                    this.loadList()
                    this.dialogVisible = false
                } else {
                    this.$message.error(this.$t('User.UserUpdateFailed'))
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
