export default [
    {
        path: '/',
        component: () => import(/* webpackChunkName: 'root' */ '@/views/index.vue'),
        redirect: 'device',
        meta: {
            keepAlive: true
        },
        children: [
            {
                path: '/user',	
                component: () => import(/* webpackChunkName: 'root' */ '@/views/user/index.vue')
            },
            {
                path: '/device',	
                component: () => import(/* webpackChunkName: 'root' */ '@/views/device/index.vue')
            },
            {
                path: '/doatAdmin',	
                component: () => import(/* webpackChunkName: 'root' */ '@/views/doatAdmin/index.vue')
            },
            {
                path: '/alarm',	
                component: () => import(/* webpackChunkName: 'root' */ '@/views/alarm/index.vue')
            },
            {
                path: '/record',	
                component: () => import(/* webpackChunkName: 'root' */ '@/views/Record/index.vue')
            },
            {
                path: '/alarmSetting',	
                component: () => import(/* webpackChunkName: 'root' */ '@/views/alarmSetting/index.vue')
            },
            {
                path: '/analysis',	
                component: () => import(/* webpackChunkName: 'root' */ '@/views/analysis/index.vue')
            },
            {
                path: '/setting',	
                component: () => import(/* webpackChunkName: 'root' */ '@/views/setting/setting.vue')
            },
            {
                path: '/detail',	
                component: () => import(/* webpackChunkName: 'root' */ '@/views/device/positionDetail.vue')
            },
            {
                path: '/role',	
                component: () => import(/* webpackChunkName: 'root' */ '@/views/role/index.vue')
            }, 
            {
                path: '/channel',	
                component: () => import(/* webpackChunkName: 'root' */ '@/views/channel/index.vue')
            },
            {
                path: '/channelDetail',	
                component: () => import(/* webpackChunkName: 'root' */ '@/views/channel/detail.vue')
            },
            {
                path: '/noticeservices',	
                component: () => import(/* webpackChunkName: 'root' */ '@/views/noticeServices/config.vue')
            },            
            {
                path: '/noticesetting',	
                component: () => import(/* webpackChunkName: 'root' */ '@/views/noticeServices/setting.vue')
            }
            
        ]
    },
    {
        path: '/login',
        component: () => import(/* webpackChunkName: 'root' */ '@/views/login.vue')
    }
]
