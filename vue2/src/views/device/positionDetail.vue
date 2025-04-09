<template>
    <div class="setting">
        <el-page-header :content="`${$route.query.name}`" @back="goBack" />
        <el-tabs class="tab" @tab-click="handleTabClick">
            <el-tab-pane :label="$t('DataQuery')">
                <div>
                    <el-row :gutter="10">
                        <el-col :span="10">
                            <el-date-picker
                                v-model="dateTime"
                                type="datetimerange"
                                :picker-options="pickerOptions"
                                style="width: 100%;"
                                :range-separator="$t('To')"
                                :start-placeholder="$t('StartDate')"
                                :end-placeholder="$t('EndDate')"
                                :clearable="false"
                                align="right"
                            />
                        </el-col>
                        <el-col :span="4">
                            <el-select ref="myselectpositionFun" v-model="PositionFunction" style="width: 100%;" :placeholder="$t('Position.Function')" value-key="key" @change="getSelectedFunction">
                                <el-option v-for="item in positionFunctionList" :key="item.key" :label="$t(item.key)" :value="item">{{ $t(item.key) }}</el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary" @click="search()">{{ $t('Search') }}</el-button>
                        </el-col>
                        <el-col :offset="1" :span="3">
                            <el-radio-group v-model="display" size="small">
                                <el-radio-button :label="1">{{ $t('Monitor.Table') }}</el-radio-button>
                                <el-radio-button :label="2">{{ $t('Monitor.Curve') }}</el-radio-button>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                </div>
                <div v-if="display == 1" style="margin-top: 10px;">
                    <div class="record-main">
                        <div id="contentDiv" ref="contentDiv">
                            <el-table 
                                ref="recordTable"
                                v-loading="loading"
                                :height="height"
                                :data="tableData"
                                border stripe
                                :cell-style="tableCellStyle"
                                width="100%"
                            >
                                <el-table-column prop="positionName" :label="$t('Position.Name')" />
                                <el-table-column :label="$t('AlarmTime')">
                                    <template slot-scope="scope">
                                        <p> {{ scope.row.createTime }}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column v-for="item in keyList" :key="item" :label="$t(item)">
                                    <template slot-scope="scope">
                                        {{ scope.row[item] }}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div style="padding-top: 10px; height: 40px;">
                        <el-row type="flex" justify="space-between">
                            <el-col>
                                <el-pagination
                                    background
                                    :current-page="pageNumber"
                                    :page-size="pageSize"
                                    layout="total, prev, pager, next"
                                    :total="total"
                                    @current-change="handleCurrentChange"
                                />
                            </el-col>
                            <el-col>
                                <el-row :gutter="10" type="flex" justify="start">
                                    <el-button type="primary" style="margin-right: 10px;" size="small" :loading="isExportPDF" @click="exportPDF()">{{ $t('ExportPdf') }}</el-button>
                                    <json-excel v-if="enableExcel"
                                                style="margin-right: 10px;"
                                                :data="tableData"
                                                :fields="json_fields"
                                                :worksheet="$t('DataRecord')"
                                                name="DataReport.xls"
                                    >
                                        <el-button v-if="enableExcel" type="primary" size="small" @click="exportExcel()">{{ $t('ExportExcel') }}</el-button>
                                    </json-excel>
                                    <el-button type="primary" size="small" :loading="isPrintPDF" @click="print()">{{ $t('Print') }}</el-button>
                                </el-row>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div v-else style="margin-top: 15px; width: 100%; height: 100%;">
                    <Charts1 ref="chart" :title="chartTitle" />
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import JsonExcel from 'vue-json-excel'
import Charts1 from '../analysis/charts1.vue'

import moment from 'moment'

export default ({
    components: { Charts1, JsonExcel},
    data() {
        return {
            display: 1,
            selectDate: null,
            pickerOptions: {
                disabledDate: time => {
                    console.log(time)
                    if (this.selectDate == null) {
                        return false
                    } else {
                        return (this.selectDate.getFullYear() != time.getFullYear())
                    }
                },
                onPick: date => {
                    if (date.minDate && !date.maxDate) {
                        this.selectDate = date.minDate
                    } else {
                        this.selectDate = null
                    }
                },
                shortcuts: [{
                    text: this.$t('LastWeek'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: this.$t('LastMonth'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: this.$t('LastThreeMonth'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },
            dateTime: [],
            PositionFunction: '',
            positionFunctionList: [],
            json_fields: {},
            origin_json_fields: {},
            tableData: [], 
            chartData: [],
            keyList: [],
            loading: false,
            isExportPDF: false,
            enableExcel: false,
            isPrintPDF: false,
            pageNumber: 1,
            pageSize: 200,
            total: 0,
            chartTitle: '',
            height: 500
        }
    },
    computed: {
        positionName() {
            return this.$route.query.name
        }
    },
    created() {
        window.addEventListener('resize', () => {
            this.tableHeight = this.calcHeightx(180)
        })
        this.tableHeight = this.calcHeightx(180)
    },
    mounted() {
        
    },
    activated() {
        let jsonObject = {}
        let json1 = [
            {
                key: this.$t('Position.Name'),
                value: 'positionName'
            },
            { 
                key: this.$t('AlarmTime'),
                value: 'createTime'
            }
        ]
        for (let itemIndex = 0; itemIndex < json1.length; itemIndex++) {
            this.$set(jsonObject, json1[itemIndex].key + '', json1[itemIndex].value + '')
        }

        this.origin_json_fields = jsonObject

        let startTime = new Date(new Date().setHours(0, 0, 0, 0))
        let endTime = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1)
        this.dateTime = [startTime, endTime]
        this.tableData = []
        this.chartData = []
        this.enableExcel = this.$store.state.global.exportExcel
        this.getPositionDetail()
    },
    methods: {
        calcHeightx(value) {
            let res = window.innerHeight
            let wapper = window.document.getElementsByClassName('el-table__body-wrapper')
            setTimeout(() => {
                wapper[0].style.height = (window.innerHeight - value) + 'px'
                this.height = window.innerHeight - value
            }, 100)
            return res
        },
        tableCellStyle() {
            return {'padding': '0px'}
        },
        async getPositionDetail() {
            await this.$api.get(`/api/Position/${this.$route.query.id}`)
                .then(reponse => {
                    let data = reponse.data
                    this.getSelectedPostionId(data)
                })
        },
        getSelectedPostionId(item) {
            this.positionFunctionList = item.functions.map(t => t)
            if (this.positionFunctionList.length > 0) {
                this.PositionFunction = this.positionFunctionList[0]
                this.chartTitle = this.PositionFunction.key
                this.getSelectedFunction(this.PositionFunction)
            }
        },
        getSelectedFunction(item) {
            this.chartTitle = item.key
            this.keyList = item.devices.map(t => t.key)
            this.json_fields = Object.assign({}, this.origin_json_fields)
        },
        goBack() {
            this.$router.back()
        },
        search() {
            this.pageNumber = 1
            this.getRecord()
        },
        async getRecord() {
            let startTime = moment(this.dateTime[0]).format('YYYY-MM-DDTHH:mm:ss')
            let endTime = moment(this.dateTime[1]).format('YYYY-MM-DDTHH:mm:ss')
            this.loading = true
            this.$api.setTenant(this.dateTime[0].getFullYear())
            if (this.display == 1) {
                await this.$api.get('/api/records?StartTime=' + startTime + '&EndTime=' + endTime + '&PositionFunction=' + this.PositionFunction.key + '&PositionId=' + this.$route.query.id + `&PageNumber=${this.pageNumber}&PageSize=${this.pageSize}`)
                    .then(reponse => {
                        let data = reponse.data
                        this.tableData = data
                        console.log('table data ' + this.tableData.length)
                        let pageInfo = reponse.headers['x-pagination']
                        let totalCount = JSON.parse(pageInfo)['TotalCount']
                        this.total = totalCount
                        if (this.total > 0) {
                            this.tableData.map(item => {
                                for (let content of item.contents) {
                                    item[content.key] = content.value
                                    this.json_fields[content.key] = content.key
                                }
                            })
                        }   
                    })
            } else {
                await this.$api.get('/api/records/chart?StartTime=' + startTime + '&EndTime=' + endTime + '&PositionFunction=' + this.PositionFunction.key + '&PositionId=' + this.$route.query.id)
                    .then(reponse => {
                        let data = reponse.data
                        this.chartData = data
                        this.$refs.chart.drawChart(this.chartData)
                    }, () => {
                        this.$message.error(this.$t('SearchFailed'))
                    })
            }
            
            this.loading = false
        },
        handleCurrentChange(val) {
            this.pageNumber = val
            this.getRecord()
        },
        async print() {
            if (!this.enableGetRecord()) return

            let startTime = moment(this.dateTime[0]).format('YYYY-MM-DDTHH:mm:ss')
            let endTime = moment(this.dateTime[1]).format('YYYY-MM-DDTHH:mm:ss')
            this.$api.setTenant(this.dateTime[0].getFullYear())
            this.isPrintPDF = true
            await this.$api.get('/api/records/report/' + this.selectedPosition.id + '/' + this.PositionFunction.key + '?StartTime=' + startTime + '&EndTime=' + endTime)
                .then(response => {
                    window.open(response.data, '_blank')
                }, err => {
                    console.log(err)
                })
            this.isPrintPDF = false
        },
        async exportPDF() {
            let startTime = moment(this.dateTime[0]).format('YYYY-MM-DDTHH:mm:ss')
            let endTime = moment(this.dateTime[1]).format('YYYY-MM-DDTHH:mm:ss')
            this.isExportPDF = true
            this.$api.setTenant(this.dateTime[0].getFullYear())
            await this.$api.get('/api/records/report/' + this.selectedPosition.id + '/' + this.PositionFunction.key + '?StartTime=' + startTime + '&EndTime=' + endTime)
                .then(response => {
                    let link = document.createElement('a')
                    let fname = 'DataReport' // 下载文件的名字
                    link.href = response.data
                    link.setAttribute('download', fname)
                    document.body.appendChild(link)
                    link.click()
                }, err => {
                    console.log(err)
                })
            this.isExportPDF = false
        },
        handleTabClick() {

        }
    }
})
</script>

<style lang="scss" scoped>
.setting {
    padding: 20px;
    .tab {
        margin-top: 20px;
        .system {
            width: 400px;
        }
    }
}

</style>
