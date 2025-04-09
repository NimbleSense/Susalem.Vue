<template>
    <div class="device a">
        <div v-show="controlEnabled" style="display: inline;">
            <el-button v-if="monitoring" :loading="monitorConnecting" type="danger" @click="stopMonitor">{{ $t('Monitor.StopMonitor') }}</el-button>
            <el-button v-else type="success" :loading="monitorConnecting" :disabled="!monitorEnabled" @click="startMonitor">{{ $t('Monitor.StartMonitor') }}</el-button>
            <div style="display: inline;">
                <el-popover
                    placement="bottom"
                    width="300"
                    trigger="hover"
                >
                    <div style="display: flex; justify-content: center;">
                        <el-checkbox :value="isEnableBuzzing" :label="$t('Buzzing')" border @change="BuzzingChanged" />
                        <el-checkbox :value="isEnableAlerter" :label="$t('Alerter')" border @change="EnableAlerterChanged" />
                    </div>
                    <el-button slot="reference" class="more" icon="el-icon-more" type="text" />
                </el-popover>
            </div>
        </div>
        <div style="width: 100%; height: 100%; flex-shrink: 0;">
            <div v-show="displayMode == 0" class="doat">
                <div v-show="showList" class="list iib0 a" style="overflow: auto;">
                    <div class="title">
                        <span>{{ $t('Monitor.Positions') }}</span>
                    </div>
                    <doatlist ref="positionTree" :tree-data="treeData" style="overflow: auto;" @checkChange="checkChange" />
                </div>

                <div v-if="checkList.length <=0" :style="{display:'flex',width:'100%'}" class="empty-content">
                    <img src="./../../assets/images/empty-content.png" class="eicon">
                    <div class="etitle">{{ $t('Monitor.EmptyPositions') }}</div>
                    <div class="edescr">{{ $t('Monitor.EmptyPositionsDesc') }}</div>
                </div>
                <div v-else-if="display=='grid'" class="cont iib0 a" :style="{display:'flex',width:'100%'}">
                    <positionCard v-for="item in checkList" :key="item.id" :position="item" :controlenabled="controlEnabled" :startable="monitoring" class="pos" @openChange="openChanged" />
                </div>
            </div>            
        </div>
    </div>
</template>

<script>
import doatlist from './doatlist.vue'
import positionCard from './positionCard.vue'
import { mapState } from 'vuex'

export default {
    name: 'Device',
    components: { doatlist, positionCard },
    props: {
        
    },
    data() {
        return {
            display: 'grid',
            displayMode: 0,
            controlEnabled: false,
            showList: true,
            monitorConnecting: false,
            isHandlingPositions: false,
            centralPumpName: '',
            centralPumpStatus: 'primary',
            permissions: [],
            treeData: [],
            checkList: [],
            position: {
            },
            keyList: [
            ]
        }
    },
    computed: {
        ...mapState({
            monitorEnabled: state => state.monitorstatus.connected,
            monitoring: state => state.monitorstatus.montioring,
            isEnableBuzzing: state => state.monitorstatus.enableBuzzing,
            isEnableAlerter: state => state.monitorstatus.enableAlerter,
            monitoringPositions: state => state.monitorstatus.monitoringPositions,
            deviceStatus: state => state.monitorstatus.deviceStatus
        }),
        ...mapState('monitorstatus', ['montioring', 'monitoringPositions', 'cancelledPositions', 'deviceStatus'])
    },
    watch: {
        deviceStatus(newValue) {
            const offlineDevices = newValue.offlineDevices
            const status = newValue.status
            for (var i = 0;i < this.treeData.length;i++) {
                for (var j = 0;j < this.treeData[i].positions.length;j++) {
                    var currentPosition = this.treeData[i].positions[j]
                    currentPosition.positionFunctions.forEach(t1 => {
                        t1.deviceFunctions.forEach(t2 => {
                            if (offlineDevices.includes(t2.id)) {
                                t2.deviceStatus = status
                                // t2.updatedValue = 0
                            }
                        })
                    })
                }
            }
        },
        montioring(newValue) {
            this.monitorConnecting = false
            // 监控停止，数据清零
            if (!newValue) {
                for (var i = 0;i < this.treeData.length;i++) {
                    for (var j = 0;j < this.treeData[i].positions.length;j++) {
                        var currentPosition = this.treeData[i].positions[j]
                        currentPosition.opened = false       
                        currentPosition.positionFunctions.forEach(t1 => {
                            t1.deviceFunctions.forEach(t2 => {
                                if (t2.deviceStatus !== 'Offline') {
                                    t2.deviceStatus = 'NotStarted' 
                                }     
                                t2.updatedValue = 0
                            })
                        })
                    }
                }
            }
        },
        monitoringPositions(monitorPositions) {
            console.log('Call Monitoring Positions event ' + monitorPositions.length)
            monitorPositions.forEach(positionId => {                    
                for (var i = 0;i < this.treeData.length;i++) {
                    for (var j = 0;j < this.treeData[i].positions.length;j++) {
                        var currentPosition = this.treeData[i].positions[j]
                        if (currentPosition.id == positionId) {
                            currentPosition.opened = true       
                            break
                        }
                    }
                }
            })
        },
        cancelledPositions(monitorPositions) {
            console.log('call Cancel Monitor Positions event')
            this.isHandlingPositions = true
            monitorPositions.forEach(positionId => {                    
                for (let i = 0;i < this.treeData.length;i++) {
                    for (let j = 0;j < this.treeData[i].positions.length;j++) {
                        let currentPosition = this.treeData[i].positions[j]
                        if (currentPosition.id == positionId) {
                            currentPosition.opened = false       
                            currentPosition.positionFunctions.forEach(t1 => {
                                t1.deviceFunctions.forEach(t2 => {
                                    if (t2.deviceStatus !== 'Offline') {
                                        t2.deviceStatus = 'NotStarted' 
                                    } 
                                    t2.updatedValue = 0
                                })
                            })
                            break
                        }
                    }
                }
            })
            this.isHandlingPositions = false
        }
    },
    created() {
        
    },
    mounted() {
        this.loadAreaList()
        const userInfo = localStorage.getItem('a_user')
        if (userInfo) {
            let userInfoDate = JSON.parse(userInfo)
            this.permissions = userInfoDate.permissions || []
            this.controlEnabled = this.permissions.includes('PositionControl')
        }
        this.$liveMonitor.registerRefrshData(data => {
            let functionName = data.functionName
            let recordContents = data.recordContents
            let positionId = data.positionId

            for (let i = 0;i < this.treeData.length;i++) {
                for (let j = 0;j < this.treeData[i].positions.length;j++) {
                    let currentPosition = this.treeData[i].positions[j]
                
                    if (currentPosition.id == positionId) {
                        currentPosition.door1 = data.door1
                        currentPosition.door2 = data.door2
                        currentPosition.door3 = data.door3
                        currentPosition.door4 = data.door4
                        
                        for (let t = 0; t < currentPosition.positionFunctions.length; t++) {
                            let currentPositionFunction = currentPosition.positionFunctions[t]
                            // 找到点位对应的功能
                            if (currentPositionFunction.key.toLowerCase() == functionName.toLowerCase()) {
                                for (let k = 0; k < recordContents.length;k++) {
                                    let deviceFunctions = currentPositionFunction.deviceFunctions
                                    let currentDeviceFunction = deviceFunctions.find(element => element.key.toLowerCase() == recordContents[k].key.toLowerCase())
                                    currentDeviceFunction.updatedValue = recordContents[k].value
                                    currentDeviceFunction.deviceStatus = recordContents[k].deviceStatus
                                }
                                break
                            }
                        }
                        break
                    }
                }
            }
        })
    },
    activated() {
       
    },
    beforeDestroy() {
    },
    methods: {
        goDetail(data) {
            console.log(data)
            this.$router.push(`/detail?id=${ data.id}&name=${ data.name}`)
        },
        refreshStyle(data, item) {
            const statusMap = {
                'NotStarted': '#40a9ff',
                'Offline': '#c3c4c6',    // 离线
                'Normal': '#13ce66', // 正常
                'Warning': '#e6a23c', // 预警
                'Alarm': '#f56c6c'   // 报警
            }
            let newColor = 'black'
            var positionFunction = data.positionFunctions.filter(t => t.key == item.parentName)
            if (positionFunction.length > 0) {
                var deviceFunction = positionFunction[0].deviceFunctions.filter(t2 => t2.key == item.name)
                if (deviceFunction.length > 0) {
                    newColor = statusMap[deviceFunction[0].deviceStatus]
                }
            }
            return {
                color: newColor
            }
        },
        refreshValue(data, item) {
            var positionFunction = data.positionFunctions.filter(t => t.key == item.parentName)
            if (positionFunction.length > 0) {
                var deviceFunction = positionFunction[0].deviceFunctions.filter(t2 => t2.key == item.name)
                if (deviceFunction.length > 0) {
                    return deviceFunction[0].updatedValue
                }
                return undefined
            }
            return undefined
        },
        async loadAreaList() {
            const bdata = await this.$api.get('/api/Area/monitor')
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                this.treeData = data
                let offlineDevices = this.deviceStatus.offlineDevices

                const status = this.deviceStatus.status
                for (var i = 0;i < this.treeData.length;i++) {
                    for (var j = 0;j < this.treeData[i].positions.length;j++) {
                        var currentPosition = this.treeData[i].positions[j]
                        // 更新离线的点位
                        currentPosition.positionFunctions.forEach(t1 => {
                            t1.deviceFunctions.forEach(t2 => {
                                let a = {
                                    name: t2.key,
                                    parentName: t1.key
                                }
                                if (this.keyList.findIndex(k => k.name === a.name && k.parentName === a.parentName) < 0) {
                                    this.keyList.push(a)
                                }

                                if (offlineDevices != undefined && offlineDevices.findIndex(x => x === t2.id) > -1) {
                                    t2.deviceStatus = status
                                }
                            })
                        })

                        // 更新开启的点位
                        const index = this.monitoringPositions.findIndex(t => t === currentPosition.id)
                        if (index > -1) {
                            currentPosition.opened = true
                        }
                    }
                }
            } else {
                this.$message.error(this.$t('Position.SearchDevicesError'))
            }
        },
        async loadCentralPump() {
            const bdata = await this.$api.get('/api/CentralPump')
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                if (data.length > 0) {
                    this.centralPumpName = data[0].name
                }
            }
        },
        initPositionData(positionId) {
            var currentPosition = this.checkList.find(t => t.id == positionId)
            if (currentPosition != null) {
                currentPosition.opened = false       
                currentPosition.positionFunctions.forEach(t1 => {
                    t1.deviceFunctions.forEach(t2 => {
                        t2.deviceStatus = 'NotStarted'
                        t2.updatedValue = 0
                    })
                })
            }
        },
        startMonitor() {
            if (!this.monitoring) {
                let positionIds = this.checkList.map(item => {
                    return item.id
                })
                this.monitorConnecting = true
                this.$api.post('/api/Action/monitor/start', positionIds).then(() => {
                    this.checkList.forEach(t => t.opened = true)
                })
            }
        },
        stopMonitor() {
            this.monitorConnecting = true
            this.$api.post('/api/Action/monitor/stop').then(() => {
            }).catch(() => {
                this.$message.error(this.$t('Monitor.StopFailed'))
            })
        },
        registerPosition(positionId) {
            this.$api.post('/api/Action/positions/monitor', [positionId])
        },
        unRegisterPositions(positionId) {
            this.$api.post('/api/Action/positions/cancel', [positionId])
        },
        BuzzingChanged(item) {
            this.$api.post(`/api/Action/alerter/buzzing/${item}`)
        },
        EnableAlerterChanged(item) {
            this.$api.post(`/api/Action/alerter/lighting/${item}`)
        },
        openChangedFromTable(data) {
            this.openChanged(data.opened, data)
        },
        openChanged(status, position) {
            if (!this.controlEnabled) // 无权限不允许启动设备
                return

            if (!this.monitoring) // 未开启监控不允许启动设备
                return

            position.opened = status
            if (status) {
                this.registerPosition(position.id)
            } else {
                this.unRegisterPositions(position.id)
                this.initPositionData(position.id)
            }
        },
        checkChange(item, itemIsChecked) {
            if (itemIsChecked) {
                // 选中点位
                this.checkList.push(item)
            } else {
                // 取消选中点位
                this.checkList = this.checkList.filter(item1 => item1.id !== item.id)
            }	
        }
    }
}
</script>
<style lang="scss" scoped>
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
.a::-webkit-scrollbar-thumb {
    background-color: rgba(193, 193, 193, 0.5); /* 滚动条颜色 */
    border-radius: 50px; /* 滚动条圆角 */
}
.a {
    scrollbar-width: thin;
    scrollbar-color: rgba(193, 193, 193, 0.5) #f0f0f0;
}
.device {
    overflow: auto;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .title {
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        span {
            border-left: 6px solid #00837c;
            padding: 0 10px;
        }
    }
    .centralPump {
        float: right;
        margin-right: 20px;
        margin-top: 4px;
    }
    .buzzing {
        float: right;
        margin-right: 20px;
        margin-top: 8px;
    }
    .more {
        float: right;
        font-size: 18px;
        margin-right: 20px;
    }
    .poler {
        height: 80px;
        margin: 4px 4px;
        padding: 8px;
        display: flex;
        flex-direction: row;
        .poler-list {
            width: 160px;
            margin: 0 2px;
            line-height: 64px;
            background: #b0d93333;
            padding: 0 300px;
            .sound {
                text-align: right;
                float: right;
                line-height: 32px;
                cursor: pointer;
            }
            i {
                font-size: 20px;
                font-weight: 600;
            }
            span.ok {
                color: #0abd04;
                box-shadow: 0 0 27px #7df7b9;
                border-radius: 20px;
            }
            i.ok {
                box-shadow: inset 0 0 20px #2ead2a;
                border-radius: 20px;
            }
            span.err {
                color: #f00;
                box-shadow: 0 0 27px #f00;
                border-radius: 20px;
                animation: myfirst 2s  linear infinite normal;
            }
            i.err {
                box-shadow: inset 0 0 20px #f00;
                border-radius: 20px;
                animation: myfirst 1s  linear infinite normal;
            }
            @keyframes myfirst {
                from {
                    color: #f00;
                    box-shadow: 0 0 27px #f00;
                }
                to {
                    color: rgba(141, 0, 0, 0.637);
                    box-shadow: 0 0 27px rgba(141, 0, 0, 0.637);
                }
            }
        }
    }
    .doat {
        width: 100%;
        height: 100%;
        display: flex;
        overflow: hidden;
        .list {
            width: 260px;
            margin: 4px;
            padding: 8px;
        }
        .cont {
            flex: 1;
            overflow: auto;
            margin: 4px;
            padding: 8px;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-content: flex-start;
            .pos {
                margin-right: 8px;
                margin-bottom: 8px;
            }
        }
        .empty-content {
            flex: 1;
            overflow: auto;
            margin: 4px;
            padding: 8px;
            display: flex;
            align-content: flex-start;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            .eicon {
                width: 180px;
                display: inline-block;
            }
            .etitle {
                margin: 20px 0 0 0;
                font-size: 26px;
                line-height: 36px;
            }
            .edescr {
                margin: 10px 0 0 0;
                display: inline-block;
                padding: 0 20px;
                width: 500px;
                font-size: 14px;
                line-height: 22px;
                color: #909399;
            }
        }
    }
    .plane {
        width: 100%;
        height: 100%;
        overflow: hidden;
        .monitor {
            width: 200px;
            height: 70px;
            background: linear-gradient(to right, #fd7b64 30%, #ffa463 70%);
            border-radius: 12px;
            position: fixed;
            display: flex;
            align-items: center;
            right: 20px;
            bottom: 20px;
            .logo {
                font-size: 45px;
                margin-left: 20px;
            }
            .text {
                font-size: 18px;
                font-weight: 600;
                color: white;
                margin-left: 12px;
            }
        }
    }
}

</style>