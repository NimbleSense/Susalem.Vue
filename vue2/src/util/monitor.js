import * as signalR from '@microsoft/signalr'
import store from '../store/index'

export default class Monitor1 {
    refreshActions = []
    constructor() {
        console.log('on monitor')
        this.monitor = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.VUE_APP_API_ROOT}/MonitorHub`, { 
                transport: signalR.HttpTransportType.WebSockets, withCredentials: false
            }).withAutomaticReconnect().build()
    }
    registerRefrshData(refreshAction) {
        this.refreshActions.push(refreshAction)
    }
    init(success) {
        this.monitor.on('DevicesStatusChanged', (offlineDevices, status) => {
            const data = {
                offlineDevices,
                status
            }
            store.commit('monitorstatus/changeDeviceStatus', data)
        })
        this.monitor.on('LicenseExpired', () => {
            store.commit('monitorstatus/setExpired', true)
        })
        this.monitor.on('MonitoringPositions', positions => {
            store.commit('monitorstatus/updateMonitoringPositions', positions)
        })
        this.monitor.on('MonitorCancelledPositions', positions => {
            store.commit('monitorstatus/updateCancelledPositions', positions)
        })
        this.monitor.on('AlarmReported', alarmQueryModel => {
            store.commit('monitorstatus/reportAlarm', alarmQueryModel)
        })
        this.monitor.on('RobotAlarmReported', (robotName, alarm, alarmAutoClear, reportTime) => {
            const data = {
                robotName,
                alarm,
                alarmAutoClear,
                reportTime
            }
            store.commit('monitorstatus/reportRobotAlarm', data)
        })
        this.monitor.on('PositionRecordReported', (positionId, functionName, recordContents) => {
            const data = {
                positionId,
                functionName,
                recordContents
            }
            console.log(data)
            this.refreshActions.forEach(t => {
                t(data)
            })
            // store.commit('monitorstatus/setPositionData', data)
        })
        this.monitor.on('MonitoringStatusChanged', monitoring => {
            store.commit('monitorstatus/setMonitoring', monitoring)
        }),
        // 更新报警器蜂鸣状态事件
        this.monitor.on('AlerterBuzzingChanged', isEnableBuzzing => {
            store.commit('monitorstatus/setEnableBuzzing', isEnableBuzzing)
        })
        // 更新报警灯状态事件
        this.monitor.on('AlerterLightingChanged', isEnableAlerter => {
            store.commit('monitorstatus/setEnableAlerter', isEnableAlerter)
        })
        this.monitor.start().then(() => {
            success()
            store.commit('monitorstatus/setConnected', true)
        }).catch(res => {
            console.log(res)
            store.commit('monitorstatus/setConnected', false)
        }) 
    }
    stop() {
        this.refreshActions = []
        this.monitor.stop().then(() => {
            store.commit('monitorstatus/setConnected', false)
        })
    }
}
