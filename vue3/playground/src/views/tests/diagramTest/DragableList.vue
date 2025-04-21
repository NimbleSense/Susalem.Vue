<template>
    <div >
        <ul class="list">
            <li v-for="i in 20" :key="i">
                <DragableItem />
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import DragableItem from './DragableItem.vue';
</script>

<style scoped>

.list {
    width: 200px;
    display: flex;
    flex-wrap: wrap;
}
</style>
