<template>
    <div class="main">
        <div class="main-head">
            <div style="display: flex; align-items: center;">
                <i v-if="isCollapse" style="font-size: 22px;" class="el-icon-s-unfold" @click="showTree" />
                <i v-else style="font-size: 22px;" class="el-icon-s-fold" @click="showTree" />
                <span
                    class="company-name"
                >   {{ companyName }}</span>
            </div>
            <div :style="{display:'flex','align-items':'center'}">
                <el-badge :value="alarms.length" :max="99" class="item" :style="{margin:'-2px 30px 0 6px'}">
                    <i class="el-icon-bell" @click="showAlarmRecord" />
                </el-badge>
                
                <el-dropdown @command="handleCommand">
                    <span>
                        <i class="el-icon-user-solid" /> &nbsp; {{ userName }} <i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="changeSetting">{{ $t('UserSetting') }}</el-dropdown-item>
                        <el-dropdown-item command="handleLogout">{{ $t('SignOut') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-divider class="divider" />
        <div class="main-cont">
            <el-menu :default-active="activeMenuItem" background-color="#304156" text-color="#ffffff" class="el-menu-vertical-demo" :collapse="isCollapse" @select="handleOpen">
                <el-submenu v-if="permissions.includes('DeviceManagement.All')" index="1">
                    <template slot="title">
                        <i class="el-icon-mobile" />
                        <span slot="title">{{ $t('DeviceManagement') }}</span>
                    </template>
                    <el-menu-item index="channel">{{ $t('Channel.Name') }}</el-menu-item>
                    <el-menu-item index="doatAdmin">{{ $t('Positions') }}</el-menu-item>
                </el-submenu>
                <el-menu-item index="device">
                    <i class="el-icon-monitor" />
                    <span slot="title">{{ $t('MonitorCenter') }}</span>
                </el-menu-item>
                <el-menu-item index="record">
                    <i class="el-icon-postcard" />
                    <span slot="title">{{ $t('DataQuery') }}</span>
                </el-menu-item>
                <el-menu-item index="analysis">
                    <i class="el-icon-data-line" />
                    <span slot="title">{{ $t('DataCurves') }}</span>
                </el-menu-item>
                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-bell" />
                        <span slot="title">{{ $t('Alarms') }}</span>
                    </template>
                    <el-menu-item index="alarm">{{ $t('AlarmsHistory') }}</el-menu-item>
                    <el-menu-item v-if="permissions.includes('PositionControl')" index="alarmSetting">{{ $t('AlarmsSetting') }}</el-menu-item>
                </el-submenu>
                <el-submenu v-if="permissions.includes('RoleManagement.All') || permissions.includes('UserManagement.All')" index="4">
                    <template slot="title">
                        <i class="el-icon-setting" />
                        <span slot="title">{{ $t('SystemSetting') }}</span>
                    </template>
                    <el-menu-item v-if="permissions.includes('Notification.All')" index="noticeservices">{{ $t('Notice.NoticeInfo') }}</el-menu-item>
                    <el-menu-item v-if="permissions.includes('RoleManagement.All')" index="role">{{ $t('Role.Name') }}</el-menu-item>
                    <el-menu-item v-if="permissions.includes('UserManagement.All')" index="user">{{ $t('User.Name') }}</el-menu-item>
                </el-submenu>
            </el-menu>
            <div class="main-router">
                <keep-alive>
                    <router-view />
                </keep-alive>
            </div>
        </div>
        <el-drawer
            title="告警通知"
            :visible.sync="alarmDrawer"
            :modal-append-to-body="false"
            :append-to-body="true"
            size="40%"
        >
            <el-button type="primary" style="margin-left: 5px;" @click="confirmAll">{{ $t('ConfirmAll') }}</el-button>
            <el-table style="width: 100%;" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="alarms" :height="tableHeight">
                <el-table-column :label="$t('AlarmTime')" width="170">
                    <template slot-scope="scope">
                        <p style="font-size: 14px;"> {{ scope.row.reportTime }}</p>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('Positions')" width="170">
                    <template slot-scope="scope">
                        <p style="font-size: 14px;"> {{ scope.row.positionName }}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('AlarmContent')"
                    width="150"
                >
                    <template slot-scope="scope">
                        <el-popover
                            placement="right"
                            width="470"
                            trigger="click"
                        >
                            <el-table :data="scope.row.alarmDetails">
                                <el-table-column width="150" property="alarmProperty" :label="$t('Position.Function')">
                                    <template slot-scope="scope1">
                                        <p>{{ $t(scope1.row.alarmProperty) }}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column width="120" property="alarmValue" :label="$t('AlarmValue')" />
                                <el-table-column width="200" property="reportTime" :label="$t('AlarmTime')" />
                            </el-table>
                            <el-button slot="reference" type="text">{{ $t('AlarmRule.AlarmDetail') }}</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('Type')">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.level === 'Alarm' ? 'danger' : 'warning'" disable-transitions>{{ $t(scope.row.level) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('Operation')" width="80">
                    <template slot-scope="scope">
                        <el-button type="text" @click.native.prevent="confirmAlarm(scope.$index, scope.row)">{{ $t('AlarmRule.Confirm') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-drawer>
    </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
    data() {
        return {
            misDeclaration: false,
            isCollapse: false,
            alarmDrawer: false,
            deviceDrawer: false,
            settingVisible: false,
            enableRobot: false,
            alarms: [],
            robotAlarms: [],
            pageSize: 60,
            userName: '',
            permissions: [],
            companyName: '',
            tableHeight: 400,
            activeMenuItem: 'Device'
        }
    },
    computed: {
        urlName() {
            return this.$route.path
        },
        ...mapState('monitorstatus', ['alarmData'])
    },
    watch: {
        alarmData(newValue) {
            this.alarms.push(newValue)
        },
        robotAlarmData(newValue) {
            this.showRobotAlarm = true
            this.robotAlarms.push(newValue)
        }
    },
    created() {
        const userInfo = localStorage.getItem('a_user')
        if (userInfo) {
            let userInfoDate = JSON.parse(userInfo)
            this.userName = userInfoDate.userName
            this.permissions = userInfoDate.permissions || []
        }

        const config = localStorage.getItem('config')
        if (config) {
            let configInfo = JSON.parse(config)
            this.companyName = configInfo.customerName
            this.enableRobot = configInfo.robot
            this.$store.commit('global/setExportExcel', configInfo.exportExcel)
        }
    },
    mounted() {
        console.log('live monitor mount')
        this.loadAlarms()
        this.getTableHeight()
        this.activeMenuItem = this.$route.path.replace('/', '').trim()
        let output = localStorage.getItem('navCollapsed')
        this.isCollapse = (output ||  'false').toLowerCase() == 'true'
        
        this.$liveMonitor.init(() => {
            this.$message({type: 'success', message: this.$t('Monitor.MonitorSuccess')})
        })
    },
    beforeDestroy() {
        console.log('live monitor stop')
        this.$liveMonitor.stop()
    },
    methods: {
        getTableHeight() {
            this.tableHeight = window.innerHeight - 150
        },
        gonext(state) {
            console.log(state)
            this.$router.push(`/${state}`)
        },
        loadAlarms() {
            this.alarmLoading = true
            this.alarms.length = 0
            this.$api.get('/api/Alarm/unconfirmed/100').then(res => {
                console.log(res)
                const { data = [] } = res
                if (Array.isArray(data)) {
                    this.alarms = data
                } else {
                    this.$message.error(this.$t('AueryAlarmFailed'))
                }
                this.alarmLoading = false
            })
            
        },
        showAlarmRecord() {
            this.alarmDrawer = true
        },
        showDrawerRecord() {
            this.showRobotAlarm = false
            this.deviceDrawer = true
        },
        handleClose(done) {
            this.$confirm(this.$t('CloseConfirm')).then(_ => {
                done()
                console.log(_)
            }).catch(() => {

            })
        },
        handleOpen(key) {
            this.gonext(key)
        },
        showTree() {
            this.isCollapse = !this.isCollapse
            localStorage.setItem('navCollapsed', this.isCollapse)
        },
        confirmAlarm(index, row) {
            this.$prompt(this.$t('ConfirmContent'), this.$t('Hint'), {
                confirmButtonText: this.$t('Confirm'),
                cancelButtonText: this.$t('Cancel')
            }).then(({ value }) => {
                let confirm = {confirmContent: value}
                this.$api.post(`/api/Alarm/${row.id}/confirm`, confirm).then(() => {
                    this.alarms.splice(index, 1)
                    this.$message({
                        type: 'success',
                        message: this.$t('AlarmConfirmed')
                    })
                })
               
            }).catch(() => {
                   
            })
        },
        misdeclarationAlarm(index, row) {
            let confirm = {confirmContent: this.$t('AlarmRule.MisInfo')}
            this.$api.post(`/api/Alarm/${row.id}/confirm`, confirm).then(() => {
                this.alarms.splice(index, 1)
                this.$message({
                    type: 'success',
                    message: this.$t('AlarmConfirmed')
                })
            })
        },
        confirmAll() {
            this.$prompt(this.$t('ConfirmContent'), this.$t('Hint'), {
                confirmButtonText: this.$t('Confirm'),
                cancelButtonText: this.$t('Cancel')
            }).then(({ value }) => {
                let confirm = {confirmContent: value}
                this.$api.post('/api/Alarm/confirm/100', confirm).then(res => {
                    console.log(res)
                    this.alarms.splice(0, this.alarms.length) 
                    this.loadAlarms()
                    this.$message({
                        type: 'success',
                        message: this.$t('AllAlarmsConfirmed')
                    })
                })
               
            }).catch(() => {
                    
            })
        },
        handleCommand(command) {
            if (command === 'handleLogout') {
                this.$confirm(this.$t('ExitAccount')).then(() => {
                    localStorage.clear()
                    window.location.href = window.location.origin + '#/login'
                }).catch(() => {

                })                
            } else if (command === 'changeSetting') {
                this.gonext('setting')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.main {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    z-index: 10;
    .main-head {
        height: 52px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        flex-shrink: 0;
        background: #fff;
        .company-name {
            font-size: 20px;
            font-weight: 600;
            margin-left: 10px;
            letter-spacing: 3px;
            font-family: 宋体, sans-serif;
        }
        .el-dropdown-link {
            cursor: pointer;
            margin-left: 25px;
        }
        .el-icon-arrow-down {
            font-size: 12px;
        }
        .serialLogo {
            font-size: 20px;
        }
    }
    .divider {
        margin: 0;
    }
    .main-cont {
        flex: 1;
        height: 100%;
        display: flex;
        // min-height: 500px;
        overflow: hidden;
        .main-side {
            width: 165px;
            height: 100%;
            margin-right: 8px;
            padding: 120px 8px 8px 8px;
            overflow: auto;
            .list {
                height: 45px;
                line-height: 45px;
                padding: 0 16px;
                cursor: pointer;
                border-bottom: 1px solid #00837c;
                transition: 0.8s all;
                &.active {
                    background: #00837c;
                    color: #fff;
                }
                &:hover {
                    background: #409eff;
                    color: #fff;
                }
            }
        }
        .main-router {
            flex: 1;
            padding: 8px;
            overflow: auto;
            background: #fff;
        }
    }
    .item {
        margin-top: 10px;
        margin-right: 40px;
    }
    .confirmBtn {
        margin-left: 5px;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
        background: #304156;
    }
}

</style>