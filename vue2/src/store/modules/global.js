/**
 * 存放全局公用状态
 */

const state = {
    userName: '',
    serialConnected: false,
    exportExcel: false
}

const getters = {
    getUserName(state) {
        return state.userName
    },
    getConnected(state) {
        return state.serialConnected
    },
    getExportExcel(state) {
        return state.exportExcel
    }
}

const actions = {}

const mutations = {
    setUserName(state, data) {
        state.userName = data
    },
    setSerialConnected(state, data) {
        state.serialConnected = data
    },
    setExportExcel(state, data) {
        state.exportExcel = data
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
