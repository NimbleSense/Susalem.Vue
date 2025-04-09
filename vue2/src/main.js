import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import ax from './api'
Vue.prototype.$api = ax

import dayjs from 'dayjs'
Vue.prototype.$dayjs = dayjs

import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import twLocale from 'element-ui/lib/locale/lang/zh-TW'

import zh from './assets/locales/zh.json'
import en from './assets/locales/en.json'
import tw from './assets/locales/tw.json'

Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: localStorage.getItem('locale') || 'zh-CN',
    messages: {
        'zh-CN': {...zh, ...zhLocale},
        'en-US': {...en, ...enLocale},
        'zh-TW': {...tw, ...twLocale}
    }
})

import util from './util/index'
Vue.use(util)

import Cookies from 'js-cookie'
Vue.prototype.$cookies = Cookies
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

import VueMeta from 'vue-meta'
Vue.use(VueMeta)
import ElementUI from 'element-ui'
// import ElementLocale from 'element-ui/lib/locale'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI, {
    i18n: (key, value) => i18n.t(key, value)
})
// ElementLocale.i18n((key, value) => i18n.t(key, value))

// 全局组件自动注册
import '@/components/autoRegister'

// 自动加载 svg 图标
const req = require.context('./assets/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

import './mock'

import LiveMonitor from './util/monitor'
const liveMonitor = new LiveMonitor()
Vue.prototype.$liveMonitor = liveMonitor

Vue.config.productionTip = false

new Vue({
    router,
    i18n,
    store,
    render: h => h(App)
}).$mount('#app')
