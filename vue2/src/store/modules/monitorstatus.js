/**
 * 存放全局公用状态
 */

const state = {
    // 连接状态
    connected: false,
    // 监控状态
    montioring: false,
    // License是否过期
    licenseExpired: false,
    // 是否允许蜂鸣器
    enableBuzzing: false,
    // 是否允许报警灯
    enableAlerter: false,
    // 告警数量
    alarmCount: 0,
    // 监控中的点位
    monitoringPositions: [],
    // 取消监控的点位
    cancelledPositions: [],
    // 点位数据
    positionData: {
    },
    // 告警数据
    alarmData: {
    },
    // 机器人告警数据
    robotAlarmData: {
    },
    // 离线设备状态
    deviceStatus: {

    }
}

const getters = {
    getPositionData(state) {
        return state.positionData
    },
    getMonitoring(state) {
        return state.montioring
    }
}

const actions = {}

const mutations = {
    setPositionData(state, data) {
        state.positionData = data
    },
    setMonitoring(state, data) {
        state.montioring = data
    },
    setConnected(state, data) {
        state.connected = data
    },
    setExpired(state, data) {
        state.licenseExpired = data
    },
    updateAlarmCount(state, data) {
        state.alarmCount = data
    },
    reportAlarm(state, alarmdata) {
        state.alarmData = alarmdata
        state.alarmCount = state.alarmCount + 1
    },
    reportRobotAlarm(state, robotAlarmdata) {
        state.robotAlarmData = robotAlarmdata
    },
    updateMonitoringPositions(state, data) {
        state.monitoringPositions = data
    },
    updateCancelledPositions(state, data) {
        state.cancelledPositions = data
    },
    changeDeviceStatus(state, data) {
        state.deviceStatus = data
    },
    setEnableBuzzing(state, data) {
        state.enableBuzzing = data
    },
    setEnableAlerter(state, data) {
        state.enableAlerter = data
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
