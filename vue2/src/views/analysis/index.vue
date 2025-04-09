<template>
    <div class="record-conter">
        <div class="record-head">
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
                <el-col :span="5">
                    <el-cascader 
                        style="width: 100%;"
                        :options="positionList"
                        :props="{ expandTrigger: 'hover' }"
                        filterable
                        @change="getSelectedPostionId"
                    />
                </el-col>
                <el-col :span="4">
                    <el-select ref="myselectpositionFun" v-model="PositionFunction" style="width: 100%;" :placeholder="$t('Position.Function')" value-key="key" @change="getSelectedFunction">
                        <el-option v-for="item in positionFunctionList" :key="item.key" :label="$t(item.key)" :value="item">{{ $t(item.key) }}</el-option>
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <el-button type="primary" @click="search()">{{ $t('Search') }}</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="chart-main">
            <Charts1 ref="chart" :title="chartTitle" />
        </div>
    </div>
</template>
<script>
import Charts1 from './charts1.vue'
import moment from 'moment'

export default {
    components: { Charts1 },

    data() {
        return  {
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
            positionList: [
            ],
            tableData: [],
            loading: false,
            keyList: [],
            selectedPosition: {},
            chartTitle: ''
        }
    },
    mounted() {
        this.getPositionId()
        let startTime = new Date(new Date().setHours(0, 0, 0, 0))
        let endTime = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1)
        this.dateTime = [startTime, endTime]
    },
    methods: {
        getSelectedPostionId(item) {
            let position = this.positionList.filter(t => t['value'] == item[0])
            if (position.length > 0) {
                this.selectedPosition = position[0].children.filter(t => t['value'] == item[1])[0] 
                this.positionFunctionList = this.selectedPosition.functions.map(t => t)
                if (this.positionFunctionList.length > 0) {
                    this.PositionFunction = this.positionFunctionList[0]
                    this.getSelectedFunction(this.PositionFunction)
                }
            }
        },
        getSelectedFunction(item) {
            this.chartTitle = item.key
        },
        async getPositionId() {
            await this.$api.get('/api/Position/cascade')
                .then(reponse => {
                    let data = reponse.data
                    this.positionList = data
                    // this.getSelectedPostionId(this.positionList[0])
                })
        },
        async getRecord() {
            if (this.positionFunctionList.length <= 0) {
                return
            }
            
            let startTime = moment(this.dateTime[0]).format('YYYY-MM-DDTHH:mm:ss')
            let endTime = moment(this.dateTime[1]).format('YYYY-MM-DDTHH:mm:ss')
            this.loading = true
            this.$api.setTenant(this.dateTime[0].getFullYear())
            await this.$api.get('/api/records/chart?StartTime=' + startTime + '&EndTime=' + endTime + '&PositionFunction=' + this.PositionFunction.key + '&PositionId=' + this.selectedPosition.value)
                .then(reponse => {
                    let data = reponse.data
                    this.tableData = data
                    this.$refs.chart.drawChart(this.tableData)
                }, () => {
                    this.$message.error(this.$t('SearchFailed'))
                })
            this.loading = false
        },
        search() {
            this.getRecord()
        }
    }
	
}
</script>
<style lang="scss" scoped>
.record-conter {
    height: 100%;
    width: 100%;
    flex-direction: column;
    display: flex;
    .record-head {
        height: 60px;
        padding: 10px 0;
    }
    .chart-main {
        padding-top: 10px;
        width: 100%;
        height: 100%;
    }
}
</style>