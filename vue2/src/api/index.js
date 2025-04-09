import axios from 'axios'
// import Qs from 'qs'

const api = axios.create({
    baseURL: process.env.VUE_APP_API_ROOT,
    timeout: 10000,
    responseType: 'json'
})

let jwt =  localStorage.getItem('jwt', jwt)
// 登陆设置jwt-token
if (jwt) {
    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
} else {
    window.location.href = window.location.origin + '#/login'
}

var lan = localStorage.getItem('locale')
if (lan) {
    api.defaults.headers.common['Accept-Language'] = lan
}

const lanjie = res => {
    const { status } = res
    if (status === 401) {
        return window.location.href = window.location.origin + '#/login'
    }
    return false
}

//  api.get('wwww')
const ax = {
    setTenant: tenant => {
        api.defaults.headers.common['tenant'] = tenant
    },
    setHead: au => {
        api.defaults.headers.common['Authorization'] = au
    },
    setLan: au1 => {
        api.defaults.headers.common['Accept-Language'] = au1
    },
    get: url => {
        return new Promise((rs, rj) => {
            api.get(url).then(res => {
                if (!lanjie(res)) {
                    rs(res)
                }
            }, err => {
                if (!lanjie(err.response)) {
                    rj(err)
                }
            })
        })
    },

    delete: (url, param) => {
        return new Promise((rs, rj) => {
            api.delete(url, {data: param}).then(res => {
                if (!lanjie(res)) {
                    rs(res)
                }
            }, err => {
                if (!lanjie(err.response)) {
                    rj(err)
                }
            })
        })
    },

    post: (url, param) => {
        return new Promise((rs, rj) => {
            api.post(url, param).then(res => {
                if (!lanjie(res)) {
                    rs(res)
                }
            }, err => {
                if (!lanjie(err.response)) {
                    rj(err)
                }
            })
        })
		
    },

    put: (url, param) => {
        return new Promise((rs, rj) => {
            api.put(url, param).then(res => {
                if (!lanjie(res)) {
                    rs(res)
                }
            }, err => {
                if (!lanjie(err.response)) {
                    rj(err)
                }
            })
        })
		
    }

    // download: url => {
    //     return new Promise((rs, rj) => {
    //         api.get(url, {}).then(res => {
    //             if (!lanjie(res)) {
    //                 rs(res)
    //             }
    //         }, err => {
    //             if (!lanjie(err.response)) {
    //                 rj(err)
    //             }
    //         })
    //     })
    // }

}
export default ax
