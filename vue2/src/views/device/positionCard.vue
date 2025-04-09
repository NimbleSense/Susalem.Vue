<template>
    <el-card :key="position.id" class="box-card">
        <div slot="header">
            <el-link :underline="false">{{ position.name }}</el-link>
            <el-switch :disabled="!controlenabled" :value="position.opened" style="float: right;" active-color="#13ce66" @change="openChanged" />
        </div>

        <div v-for="positionFunction in position.positionFunctions" :key="positionFunction.key" class="pos">
            <el-tag v-for="deviceFunction in positionFunction.deviceFunctions" :key="deviceFunction.key" class="eltag" :type="deviceFunction.deviceStatus | statusFilter">
                <ul>
                    <li>{{ $t(deviceFunction.key) }}</li>
                    <li style="font-size: 16px; color: #333;">{{ deviceFunction.updatedValue }}</li>
                </ul>
            </el-tag>
        </div>
        <el-divider />
        <div v-if="position.showDoor">
            <el-tag v-if="position.door1" size="small" class="door">柜一关闭</el-tag>
            <el-tag v-else size="small" type="success" class="door">柜一已开</el-tag>

            <el-tag v-if="position.door2" size="small" class="door">柜二关闭</el-tag>
            <el-tag v-else size="small" type="success" class="door">柜二已开</el-tag>

            <el-tag v-if="position.door3" size="small" class="door">柜三关闭</el-tag>
            <el-tag v-else size="small" type="success" class="door">柜三已开</el-tag>

            <el-tag v-if="position.door4" size="small" class="door">柜四关闭</el-tag>
            <el-tag v-else size="small" type="success" class="door">柜四已开</el-tag>
        </div>
    </el-card>
</template>

<script>

export default ({
    filters: {
        statusFilter(status) {
            const statusMap = {
                'NotStarted': '',
                'Offline': 'info',    // 离线
                'Normal': 'success', // 正常
                'Warning': 'warning', // 预警
                'Alarm': 'danger'   // 报警
            }
            return statusMap[status]
        }
    },
    props: {
        position: {
            type: Object,
            required: true
        },
        startable: {
            type: Boolean
        },
        controlenabled: {
            type: Boolean
        }
    },
    data() {
        return {
            opened1: false
        }
    },
    computed: {
        opened2() {
            return this.position.opened
        }
    },
    methods: {
        goDetail() {
            this.$router.push(`/detail?id=${ this.position.id}&name=${ this.position.name}`)
        },
        openChanged(status) {
            this.$emit('openChange', status, this.position)
        }
    }
    
})
</script>
<style scoped>

.box-card {
    flex-direction: column;
    background-color: white;
}
.el-card >>> .el-card__header {
    padding: 8px 10px;
}
.el-card >>> .el-card__body {
    padding: 8px;
}
.el-divider--horizontal {
    margin: 12px 0;
}
.pos {
    display: inline;
    width: max-content;
}
.eltag {
    width: 100px;
    height: 60px;
    margin: 4px;
    display: inline-flex;
    align-items: center;
}
.ilogo {
    font-size: 32px;
    margin-right: 5px;
    vertical-align: 0;
}
ul {
    list-style: none;
    text-align: left;
    margin: 0;
    padding: 0;
}
li {
    line-height: 20px;
}
.door {
    margin-left: 10px;
}
</style>
