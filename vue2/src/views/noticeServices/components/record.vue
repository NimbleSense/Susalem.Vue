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
                <el-col :span="6">
                    <el-button type="primary" @click="search()">{{ $t('Search') }}</el-button>
                </el-col>
            </el-row>
        </div>
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
                    <el-table-column prop="sucess" :label="$t('Notice.Type')" width="120">
                        <template slot-scope="scope">
                            <el-tag type="warning">{{ $t(scope.row.noticeEvent) }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="content" :label="$t('Notice.Content')" width="250">
                        <template slot-scope="scope">
                            <el-button type="text" @click="showSetting(scope.row.content)">
                                {{ $t('Notice.CheckContent') }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="exception" :label="$t('Notice.Exception')" />
                    <el-table-column :label="$t('Notice.SendTime')" width="220">
                        <template slot-scope="scope">
                            <p> {{ scope.row.sendTime }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('Info.Action')" width="120">
                        <template slot-scope="scope">
                            <el-button :disabled="scope.row.ignored" type="text" size="mini" @click="retry(scope.row)">{{ $t('Notice.Retry') }}</el-button>
                            <el-button :disabled="scope.row.ignored" type="text" size="mini" @click="ignore(scope.row)">{{ $t('Notice.Ignore') }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="record-foot">
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
            </el-row>
        </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    props: {
        recordname: {
            type: String
        }
    },
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
            tableData: [],
            loading: false,
            pageNumber: 1,
            pageSize: 200,
            total: 0,
            height: 500
        }
    },
    computed: {
        
    },
    created() {
        // this.getHeight()
        window.addEventListener('resize', () => {
            this.tableHeight = this.calcHeightx(180)
        })
        this.tableHeight = this.calcHeightx(180)
    },
    mounted() {
        let startTime = new Date(new Date().setHours(0, 0, 0, 0))
        let endTime = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1)
        this.dateTime = [startTime, endTime]
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
        showSetting(content) {
            var jsonObj = JSON.parse(content)

            this.$alert(JSON.stringify(jsonObj, null, 4), {
                confirmButtonText: this.$t('Info.GotIt'),
                type: 'warning'
            })
        },
        getHeight() {
            this.height = window.innerHeight - 180 
        },
        tableCellStyle() {
            return {'padding': '0px'}
        },
        async getRecord() {
            let startTime = moment(this.dateTime[0]).format('YYYY-MM-DDTHH:mm:ss')
            let endTime = moment(this.dateTime[1]).format('YYYY-MM-DDTHH:mm:ss')
            this.loading = true
            await this.$api.get('/api/Notice/records?NoticeType=' + this.recordname + '&StartTime=' + startTime + '&EndTime=' + endTime + `&PageNumber=${this.pageNumber}&PageSize=${this.pageSize}`)
                .then(reponse => {
                    let data = reponse.data
                    this.tableData = data
                    console.log('table data ' + this.tableData.length)
                    let pageInfo = reponse.headers['x-pagination']
                    let totalCount = JSON.parse(pageInfo)['TotalCount']
                    this.total = totalCount
                })
            this.loading = false
        },
        search() {
            this.pageNumber = 1
            this.getRecord()
        },
        handleCurrentChange(val) {
            this.pageNumber = val
            this.getRecord()
        },
        retry(item) {
            this.$confirm(this.$t('Notice.RetryHint'), this.$t('WarnHint'), { confirmButtonText: this.$t('Confirm'), cancelButtonText: this.$t('Cancel'), type: 'warning'}).then(async() => {
                this.$api.post(`/api/Notice/${item.id}/retry`).then(() => {
                    this.$message({type: 'success', message: this.$t('Notice.RetrySuccess')})
                    this.getRecord()
                }, () => {
                    this.$message({type: 'error', message: this.$t('Notice.RetryFailed')})
                })            
            })
        },
        ignore(item) {
            this.$confirm(this.$t('Notice.IgnoreHint'), this.$t('WarnHint'), { confirmButtonText: this.$t('Confirm'), cancelButtonText: this.$t('Cancel'), type: 'warning'}).then(() => {
                this.$api.post(`/api/Notice/${item.id}/ignore`).then(() => {
                    this.$message({type: 'success', message: this.$t('Notice.IgnoreSuccess')})
                    this.getRecord() 
                }, () => {
                    this.$message({type: 'error', message: this.$t('Notice.IgnoreFailed')})
                })
                
            })
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
    .record-main {
        flex: 1;
        overflow: auto;
        .tableBox {
            .el-table__body-wrapper {
                height: calc(100% - 44px) !important;
            }
            th {
                padding: 0;
                height: 48px;
                line-height: 48px;
            }
            td {
                padding: 0;
                height: 40px;
                line-height: 40px;
            }
        }
    }
    .record-foot {
        padding-top: 10px;
        height: 40px;
    }
}
</style>