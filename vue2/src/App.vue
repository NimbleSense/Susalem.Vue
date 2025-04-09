<template>
    <div id="app">
        <RouterView v-if="isRouterAlive" />
    </div>
</template>

<script>
export default {
    provide() {
        return {
            reload: this.reload
        }
    },
    data() {
        return {
            isRouterAlive: true
        }
    },
    watch: {
        $route: 'routeChange'
    },
    mounted() {
        let beginTime = 0
        let differTime = 0
        window.onunload = function() {
            differTime = new Date().getTime() - beginTime
            if (differTime <= 5) {
                localStorage.clear()
            }
        },
        window.onbeforeunload = function() {
            beginTime = new Date().getTime()
        }
    },
    methods: {
        reload() {
            // this.isRouterAlive = false
            // this.$nextTick(() => (this.isRouterAlive = true))
        },
        routeChange(newVal, oldVal) {
            if (newVal.name == oldVal.name) {
                this.reload()
            }
        }
    },
    metaInfo: {
        titleTemplate: title => {
            return title
                ? `${title} - ${process.env.VUE_APP_TITLE}`
                : process.env.VUE_APP_TITLE
        }
    }
}
</script>
<style lang="scss">
html,
body,
#app {
    height: 100%;
    padding: 0;
    margin: 0;
    position: relative;
    z-index: 2;
    overflow: hidden;
}
.iib {
    // box-shadow: inset 0 0 9px #d4d4d4;
    border: 1px solid #d4d4d4;
    background: #fff;
}
.iib0 {
    // box-shadow: inset 0 0 3px #d4d4d4;
    border: 1px solid #d4d4d4;
    border-radius: 4px;
    background: #fff;
}
// #app::after {
//     content: "";
//     // background: url('../assets/images/bg.png') no-repeat;
//     opacity: 0.1;
//     top: 0;
//     left: 0;
//     bottom: 0;
//     right: 0;
//     position: absolute;
//     background-size: 100% 100%;
//     z-index: 1;
//     animation: myfirst1 5s  linear infinite normal;
// }
// @keyframes myfirst1 {
//     0% {
//         opacity: 0.1;
//         background: url('./assets/images/b1g.png') no-repeat;
//         background-size: 100% 100%;
//     }
//     20% {
//         opacity: 0.1;
//         background: url('./assets/images/b1g1.png') no-repeat;
//         background-size: 100% 100%;
//     }
//     50% {
//         opacity: 0.1;
//         background: url('./assets/images/b1g.png') no-repeat;
//         background-size: 100% 100%;
//     }
//     80% {
//         opacity: 0.1;
//         background: url('./assets/images/b1g1.png') no-repeat;
//         background-size: 100% 100%;
//     }
//     100% {
//         opacity: 0.1;
//         background: url('./assets/images/b1g.png') no-repeat;
//         background-size: 100% 100%;
//     }
// }
* {
    box-sizing: border-box;
}
</style>
