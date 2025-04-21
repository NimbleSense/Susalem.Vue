<template>
    <div class="container">

  
    <div class="content-wrapper">
        <DragableList/>
        <DiagramCanvas/>
    </div>  
    </div>
</template>

<script setup lang="ts">
import DiagramCanvas from './DiagramCanvas.vue';
import DragableList from './DragableList.vue';
</script>

<style scoped>
.container {
  width: 100%;  
  height: 100%; 
  position: relative; 
}
.content-wrapper {
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  display: flex; /* 使用flex布局 */
}
</style>