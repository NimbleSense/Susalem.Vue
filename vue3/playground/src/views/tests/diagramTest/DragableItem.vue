<template>
    <div class="dragable-item">
        Dragable Item
    </div>

</template>

<script lang="ts" setup>

</script>

<style scoped>
.dragable-item {
    width: 100px;
    height: 100px;
    background: #f0f0f0;
    color: #333;

    &:hover {
        background: #ddd;
    }

    ;
}
</style>