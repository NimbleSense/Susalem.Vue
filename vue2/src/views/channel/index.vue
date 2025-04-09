<template>
    <div class="container">
        <div class="action">
            <div>
                <el-button type="primary" icon="el-icon-plus" @click="addChannel">{{ $t('Channel.Create') }}</el-button>
            </div>
        </div>
        <el-row class="channels">
            <el-col v-for="item in mainList" :key="item.id" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                <el-card shadow="hover" :body-style="{ padding: '0px' }" class="ft-card">
                    <div class="ft-head">
                        <div class="ft-tag">
                            <el-tag class="ml-3" :type="item.status | statusFilter">{{ $t(item.status) }}</el-tag>
                            <el-tag class="ml-3" type="primary">{{ $t(item.channelType) }}</el-tag>
                        </div>
                        <div class="ft-body">
                            <div class="ft-body-image">
                                <img style="height: 100%;" :src="item.channelType | imgFilter">
                            </div>
                            <div class="ft-body-item">
                                <div class="item-mb">
                                    <td>{{ $t('Channel.ParamInfo') }}</td>
                                    <td>{{ item.title }}</td>
                                </div>
                                <div class="item-mb"> 
                                    <td>{{ $t('Channel.DeviceCount') }}</td>
                                    <td>{{ item.devices }}</td>
                                </div>
                                <div class="item-mb">
                                    <td>{{ $t('Channel.CreateTime') }}</td>
                                    <td>{{ item.createTime }}</td>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="ft-foot">
                        <div class="ft-item-name">
                            <span style="width: 260px;">{{ item.name }}</span>
                        </div>
                        <div>
                            <el-switch v-model="item.enable" active-color="#13ce66" disabled style="margin-right: 8px;" />
                            <el-popover trigger="hover">
                                <template #reference>
                                    <el-button plain size="small" circle icon="el-icon-setting" />
                                </template>
                                <div>
                                    <el-button type="text" icon="el-icon-view" @click="detail(item)">
                                        {{ $t('Channel.Detail') }}
                                    </el-button>
                                </div>
                                <div>
                                    <el-button type="text" icon="el-icon-edit" @click="editItem(item)">
                                        {{ $t('Channel.Edit') }}
                                    </el-button>
                                </div>
                                <div>
                                    <el-button type="text" icon="el-icon-close" @click="delItem(item)">
                                        {{ $t('Channel.Delete') }}
                                    </el-button>
                                </div>
                            </el-popover>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <dialog1 ref="channelDialog" @refresh="refresh" />
    </div>
</template>

<script>
import dialog1 from './components/channeldialog.vue'

export default {
    components: { dialog1 },
    filters: {
        statusFilter(status) {
            const statusMap = {
                'Offline': 'info',    // 离线
                'Connected': 'success', // 已连接
                'Fault': 'danger'   // 故障
            }
            return statusMap[status]
        },
        imgFilter(status) {
            const statusMap = {
                'ModbusRtu': require('../../assets/images/channel2.png'),    // 离线
                'ModbusTcp': require('../../assets/images/channel1.png')
            }
            return statusMap[status]
        }
        
    },
    data() {
        return {
            mainList: [
            ]
        }
    },
	
    mounted() {
        this.loadList()		
    },
    methods: {
        refresh() {
            this.loadList()	
        },
        addChannel() {
            this.$refs.channelDialog.add()
        },
        async loadList() {
            const bdata = await this.$api.get('/api/Channel')
            const { data = [] } = bdata
            if (Array.isArray(data)) {
                this.mainList = data
            } else {
                this.$message.error(this.$t('Channel.SearchFailed'))
            }
        },
        detail(item) {
            this.$router.push(`/channelDetail?id=${ item.id}&name=${ item.name}`)
        },
        editItem(item) {
            this.$refs.channelDialog.edit(item)
        },
        delItem(item) {
            this.$confirm(this.$t('Channel.DeleteConfirm'), this.$t('WarnHint'), { confirmButtonText: this.$t('Confirm'), cancelButtonText: this.$t('Cancel'), type: 'warning'}).then(() => {
                this.$api.delete(`/api/Channel/${item.id}`).then(() => {
                    this.$message({type: 'success', message: this.$t('Channel.DeleteSuccess')})
                    this.loadList() 
                }, () => {
                    this.$message({type: 'error', message: this.$t('Channel.DeleteFailed')})
                })
                
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .action {
        height: 60px;
        line-height: 60px;
        display: flex;
        >div {
            margin-left: 8px;
        }
    }
    .channels {
        .ft-card {
            position: relative;
            height: 220px;
            margin: 12px;
            .ft-head {
                width: 100%;
                height: 170px;
                border-bottom: 1px solid #3dd2b4;
                background: linear-gradient(141.6deg, #f5f7fa 0%, rgba(255, 255, 255, 0) 70%);
                .ft-tag {
                    padding: 10px;
                    height: 40px;
                    .ml-3 {
                        margin-left: 6px;
                    }
                }
                .ft-body {
                    margin-top: 5px;
                    height: 130px;
                    padding: 10px;
                    display: flex;
                    justify-content: space-between;
                    .ft-body-image {
                        width: 40%;
                        height: 100px;
                        text-align: center;
                        margin-right: 10px;
                    }
                    .ft-body-item {
                        width: 60%;
                        .item-mb {
                            width: 100%;
                            margin-bottom: 10px;
                            text-overflow: ellipsis;
                            font-size: 14px;
                        }
                    }
                }
            }
            .ft-foot {
                .ft-item-name {
                    font-size: 16px;
                    font-weight: 700;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                height: 50px;
                padding: 0 10px;
                line-height: 50px;
                display: flex;
                justify-content: space-between;
            }
        }
    }
}
</style>
