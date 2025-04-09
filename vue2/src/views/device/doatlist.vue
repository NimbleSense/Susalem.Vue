<template>
    <el-tree ref="tree"
             class="el-scrollbar"
             :data="treeData"      
             show-checkbox
             node-key="id"
             :props="defaultProps"
             default-expand-all
             @check-change="checkChange"
    />
</template>
<script>
export default {
    props: {
        treeData: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            data: [],
            defaultProps: {
                children: 'positions',
                label: 'name'
            }
        }
        
    },
    methods: {
        checkChange(item, itemIsChecked) {
            if (item.positions != null) {
                // 选中的是区域
                return
            }
            this.$emit('checkChange', item, itemIsChecked)
        },
        setCheckedPosition(positionId, checked) {
            this.$refs.tree.setChecked(positionId, checked)
        }
    }
}
</script>
<style lang="scss">
.el-tree-node {
    white-space: normal;
    .el-tree-node__content {
        height: 100%;
        display: block;
    }
}
.doat-check-area {
    height: 30px;
    line-height: 30px;
}
.doat-check-area-list {
    height: 30px;
    line-height: 30px;
    padding-left: 30px;
}
</style>