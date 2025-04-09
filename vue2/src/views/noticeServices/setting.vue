<template>
    <div class="setting">
        <div>
            <td>
                <el-page-header :content="$t('Notice.'+ `${$route.query.name}`)" @back="goBack" />
            </td>
            <td style="margin-left: 10px;">
                <el-button type="text" icon="el-icon-refresh" circle @click="refresh" />
            </td>
        </div>  
        
        <mail v-if="`${$route.query.name}` == 'Mail'" ref="mail" />
        <webhook v-if="`${$route.query.name}` == 'Webhook'" ref="webhook" />
    </div>
</template>

<script>

import mail from './components/mail.vue'
import webhook from './components/webhook.vue'

export default ({
    components: { mail, webhook },
    data() {
        return {
        }
    },
    computed: {
        positionName() {
            return this.$route.query.name
        }
    },
    activated() {
        // this.refresh()
        // this.selectedTab = 'channel'
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
            this.$refs.cloud.refresh()
            // this.$refs.devices.loadList(this.$route.query.id)
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
        margin-top: 20px;
        .system {
            width: 400px;
        }
    }
}

</style>
