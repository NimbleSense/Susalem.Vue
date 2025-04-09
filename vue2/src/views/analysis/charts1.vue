<template>
    <div class="echarts-001" :style="{ height: height +'px', width: width+'px' }" :class="selfClass" />
</template>

<script>
export default {
    name: 'Charts1',
    comments: {},
    props: {
        selfClass: {
            type: String,
            default: () => {
                return `ll${Math.floor(Math.round() * 100000)}`
            }
        },
        title: {
            type: String
        }
    },
    data() {
        return {
            charts: null,
            height: 450,
            width: 1000
        }
    },

    mounted() {
        this.charts = this.$echarts.init(document.querySelector(`.${this.selfClass}`))
    },
    created() {
        this.height = document.documentElement.clientHeight - 140
        this.width = document.documentElement.clientWidth - 280
    },
    methods: {
        drawChart(chartData) {
            let option = {
                title: {
                    text: this.$t(this.title),
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                        label: {
                            backgroundColor: '#505765'
                        }
                    }
                },
                legend: {
                    left: 0
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 0
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 0
                    }
                ],
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        magicType: { 
                            type: ['line', 'bar'],
                            title: {
                                'line': this.$t('SwicthToLine'),
                                'bar': this.$t('SwitchToBar')
                            } },
                        saveAsImage: {title: this.$t('SaveImg')}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: chartData.xData.map(function(str) {
                        return str.replace(' ', '\n')
                    })
                },
                yAxis: [],
                series: [
                ]
            }
            option.yAxis.push({
                name: chartData.yLeftName,
                type: 'value'
            })
            if (chartData.yRightName != null) {
                option.yAxis.push({
                    name: chartData.yRightName,
                    type: 'value'
                })
            }
            chartData.yLeft.forEach(element => {
                let marklineData = []
                element.markLineData.forEach(t => {
                    marklineData.push({yAxis: t})
                })
                let marklineContent = this.$t('ParticleThreshold')
                option.series.push({
                    name: this.$t(element.name),
                    type: 'line',
                    data: element.data,
                    markLine: {
                        silent: false,
                        label: {
                            position: 'middle',
                            color: 'red',
                            formatter: function(param) {
                                console.log(param)
                                return marklineContent + param.value
                            }
                        },
                        data: marklineData,
                        lineStyle: {width: 2, color: 'red' }
                    }
                })
            })
            chartData.yRight.forEach(element => {
                let marklineData = []
                element.markLineData.forEach(t => {
                    marklineData.push({yAxis: t})
                })
                option.series.push({
                    name: this.$t(element.name),
                    yAxisIndex: 1,
                    type: 'line',
                    data: element.data
                    
                })
            })
            this.charts.clear()
            // 使用刚指定的配置项和数据显示图表。
            this.charts.setOption(option)
        }
    }	
}
</script>