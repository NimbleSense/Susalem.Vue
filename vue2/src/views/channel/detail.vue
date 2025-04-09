<template>
    <div class="setting">
        <div>
            <td>
                <el-page-header :content="`${$route.query.name}`" @back="goBack" />
            </td>
            <td style="margin-left: 10px;">
                <el-button type="text" icon="el-icon-refresh" circle @click="refresh" />
            </td>
        </div>
        
        <el-tabs v-model="selectedTab" class="tab">
            <el-tab-pane name="channel" :label="$t('Channel.ChannelInfo')">
                <channelInfo ref="channelInfo" />
            </el-tab-pane>
            <el-tab-pane name="devices" :label="$t('Channel.devices')">
                <devices ref="devices" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

import devices from './components/devices.vue'
import channelInfo from './components/channelInfo.vue'

export default ({
    components: { devices, channelInfo },
    data() {
        return {
            selectedTab: 'channel'
        }
    },
    computed: {
        positionName() {
            return this.$route.query.name
        }
    },
    activated() {
        this.refresh()
        this.selectedTab = 'channel'
    },
    deactivated() {
        console.log('detail deactivated')
    },
    created() {
    },
    mounted() {
        console.log('detail mounted')
    },
    methods: {
        refresh() {
            this.$refs.channelInfo.loadChannel(this.$route.query.id)
            this.$refs.devices.loadList(this.$route.query.id)
        },
        goBack() {
            this.$router.back()
        }
    }
})
</script>

<style lang="scss" scoped>
.setting {
    padding: 20px;
    .tab {
        .system {
            width: 400px;
        }
    }
}

</style>
