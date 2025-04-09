<template>
    <div class="container">
        <el-descriptions class="margin-top" :title="$t('Channel.Setting')" :column="3" size="medium" border>
            <el-descriptions-item :label="$t('Channel.Module')">
                {{ $t(channel.channelType) }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('Channel.DeviceCount')">
                {{ channel.devices }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('Channel.Status')">
                <el-tag :type="channel.status | statusFilter">{{ $t(channel.status) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('Channel.Detail')">
                <el-button type="text" @click="showContent()">
                    {{ $t('Info.CheckSetting') }}
                </el-button>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('Channel.ReadTimeout')">
                {{ channel.settings.readTimeout }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('Channel.WriteTimeout')">
                {{ channel.settings.writeTimeout }}
            </el-descriptions-item>
            <el-descriptions-item label="设备轮询间隔(毫秒)">
                {{ channel.settings.deviceInterval }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('Channel.CreateTime')">
                {{ channel.createTime }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('Info.Comment')">
                {{ channel.description }}
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script>
export default {
    filters: {
        statusFilter(status) {
            const statusMap = {
                'Offline': 'info',    // 离线
                'Connected': 'success', // 已连接
                'Fault': 'danger'   // 故障
            }
            return statusMap[status]
        }        
    },
    data() {
        return {
            channelid: 0,
            channel: {}
        }
    },
    mounted() {
    },
    methods: {
        async loadChannel(channelid) {
            this.channelid = channelid
            await this.$api.get(`/api/Channel/${channelid}`).then(reponse => {
                let data = reponse.data
                this.channel = data
            })
        },
        showContent() {
            var jsonObj = JSON.parse(this.channel.content)

            this.$alert(JSON.stringify(jsonObj, null, 4), {
                confirmButtonText: this.$t('Info.GotIt'),
                type: 'warning'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
}
</style>
