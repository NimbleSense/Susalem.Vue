<template>
    <div class="alarm-conter">
        <div class="alarm-head">
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
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        :clearable="false"
                        align="right"
                    />
                </el-col>
                <el-col :span="3">
                    <el-select ref="myselect" v-model="AlarmLevel" style="width: 100%;" :placeholder="$t('AlarmRule.AlarmLevel')" value-key="id">
                        <el-option v-for="item in alarmList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select ref="confirmselect" v-model="ConfirmStatus" style="width: 100%;" placeholder="确认状态" value-key="id">
                        <el-option v-for="item in confirmList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="search()">{{ $t('Search') }}</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="alarm-main">
            <div id="contentDiv" ref="contentDiv">
                <el-table 
                    id="alarmTable"
                    v-loading="loading"
                    :data="tableData"
                    :height="height"
                    :cell-style="tableCellStyle"
                    border stripe width="100%"
                >
                    <el-table-column :label="$t('AlarmRule.AlarmTime')" width="220">
                        <template slot-scope="scope">
                            <p> {{ scope.row.reportTime }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="positionName" :label="$t('Positions')" />
                    <el-table-column
                        :label="$t('AlarmContent')"
                        width="150"
                    >
                        <template slot-scope="scope">
                            <el-popover
                                placement="right"
                                width="400"
                                trigger="click"
                            >
                                <el-table :data="scope.row.alarmDetails">
                                    <el-table-column width="100" property="alarmProperty" :label="$t('Position.Function')">
                                        <template slot-scope="scope1">
                                            <p>{{ $t(scope1.row.alarmProperty) }}</p>
                                        </template>
                                    </el-table-column>
                                    <el-table-column width="100" property="alarmValue" :label="$t('AlarmValue')" />
                                    <el-table-column width="200" property="reportTime" :label="$t('AlarmTime')" />
                                </el-table>
                                <el-button slot="reference" type="text">{{ $t('AlarmRule.AlarmDetail') }}</el-button>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="level" :label="$t('AlarmRule.AlarmLevel')" width="80">
                        <template slot-scope="scope">
                            <p>{{ $t(scope.row.level) }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="confirmUser" :label="$t('Audit.User')" width="120" />
                    <el-table-column prop="confirmContent" :label="$t('AlarmRule.ConfirmContent')" />
                </el-table>
            </div>
        </div>
        <div class="aram-foot">
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
                        <!-- <json-excel v-show="enableExcel"
                                    style="margin-right: 10px;"
                                    :data="tableData"
                                    :fields="json_fields"
                                    :worksheet="$t('AlarmRule.AlarmData')"
                                    name="AlarmReport.xls"
                        >
                            <el-button v-show="enableExcel" type="primary" size="small" @click="exportExcel()">{{ $t('ExportExcel') }}</el-button>
                        </json-excel> -->
                        <el-button type="primary" size="small" :loading="isPrintPDF" @click="PrintPDF()">{{ $t('Print') }}</el-button>
                    </el-row>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
// import JsonExcel from 'vue-json-excel'
import moment from 'moment'
export default {
    // components: { JsonExcel },
    data() {
        return  {
            pickerOptions: {
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
            alarmList: [
                {id: 0, name: this.$t('Warning')},
                {id: 1, name: this.$t('Alarm')}
            ],
            confirmList: [
                {id: false, name: this.$t('NotConfirmed')},
                {id: true, name: this.$t('Confirmed')}
            ],
            AlarmLevel: 1,
            ConfirmStatus: true,
            tableData: [],
            json_fields: {
                '告警时间': 'reportTime',
                '点位': 'positionName',
                '功能': 'alarmProperty',
                '告警值': 'alarmValue',
                '等级': {
                    field: 'level',
                    callback: value => {
                        if (value === 'Alarm') {
                            return this.$t('Alarm')
                        } else {
                            return this.$t('Warning')
                        }
                    }},
                '操作用户': 'confirmUser',
                '确认内容': 'confirmContent'
            },
            loading: false,
            isExportPDF: false,
            isPrintPDF: false,
            pageNumber: 1,
            pageSize: 200,
            total: 0,
            keyList: [],
            height: 500,
            enableExcel: false
        }
    },
    computed: {
        
    },
    created() {
        this.getHeight()
    },
    mounted() {
        let startTime = new Date(new Date().setHours(0, 0, 0, 0))
        let endTime = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1)
        this.dateTime = [startTime, endTime]

        this.enableExcel = this.$store.state.global.exportExcel
    },
    methods: {
        getHeight() {
            this.height = window.innerHeight - 180
        },
        tableCellStyle() {
            return {'padding': '0px'}
        },
        enableGetRecord() {
            // let startYear = moment(this.dateTime[0]).format('YYYY')
            // let endYear = moment(this.dateTime[1]).format('YYYY')
            // if (startYear != endYear) {
            //     this.$message.error('不支持跨年查询记录')
            //     return false
            // }
            // this.$api.setTenant(startYear)
            return true
        },
        async getRecord() {
            if (!this.enableGetRecord()) return

            this.loading = true
            let startTime = moment(this.dateTime[0]).format('YYYY-MM-DDTHH:mm:ss')
            let endTime = moment(this.dateTime[1]).format('YYYY-MM-DDTHH:mm:ss')
            await this.$api.get(`/api/Alarm?StartTime=${startTime}&EndTime=${endTime}&AlarmLevel=${this.$refs.myselect.selected.value}&ConfirmStatus=${this.$refs.confirmselect.selected.value}&PageNumber=${this.pageNumber}&PageSize=${this.pageSize}`)
                .then(reponse => {
                    let data = reponse.data
                    this.tableData = data
                    let pageInfo = reponse.headers['x-pagination']
                    let totalCount = JSON.parse(pageInfo)['TotalCount']
                    this.total = totalCount
                })

            this.loading = false
        },
        async PrintPDF() {
            if (!this.enableGetRecord()) return
            
            let startTime = moment(this.dateTime[0]).format('YYYY-MM-DDTHH:mm:ss')
            let endTime = moment(this.dateTime[1]).format('YYYY-MM-DDTHH:mm:ss')
            this.isPrintPDF = true
            await this.$api.get(`/api/Alarm/report/${this.$refs.myselect.selected.value}?ConfirmStatus=${this.$refs.confirmselect.selected.value}&StartTime=${startTime}&EndTime=${endTime}`)
                .then(response => {
                    window.open(response.data, '_blank')
                }, err => {
                    console.log(err)
                })
            this.isPrintPDF = false
        },
        async exportPDF() {
            if (!this.enableGetRecord()) return

            let startTime = moment(this.dateTime[0]).format('YYYY-MM-DDTHH:mm:ss')
            let endTime = moment(this.dateTime[1]).format('YYYY-MM-DDTHH:mm:ss')
            this.isExportPDF = true
            await this.$api.get(`/api/Alarm/report/${this.$refs.myselect.selected.value}?ConfirmStatus=${this.$refs.confirmselect.selected.value}&StartTime=${startTime}&EndTime=${endTime}`)
                .then(response => {
                    let link = document.createElement('a')
                    let fname = 'AlarmRecord' // 下载文件的名字
                    link.href = response.data
                    link.setAttribute('download', fname)
                    document.body.appendChild(link)
                    link.click()
                }, err => {
                    console.log(err)
                })
            this.isExportPDF = false
        },
        search() {
            this.pageNumber = 1
            this.getRecord()
        },
        handleCurrentChange(val) {
            this.pageNumber = val
            this.getRecord()
        }
    }
}
</script>

<style lang="scss" scoped>
.alarm-conter {
    height: 100%;
    width: 100%;
    flex-direction: column;
    display: flex;
    .alarm-head {
        height: 60px;
        padding: 10px 0;
    }
    .alarm-main {
        flex: 1;
        overflow: auto;
    }
    .aram-foot {
        padding-top: 10px;
        height: 40px;
    }
}

</style>