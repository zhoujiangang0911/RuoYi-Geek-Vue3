<script setup lang="ts">
import { ref } from "vue";
import useDragStore from './dragStore';
const dragStore = useDragStore();
function dragover(e: DragEvent) {
    // 阻止默认行为 - 使所有元素都可以接收
    e.preventDefault()
    // 拖拽过程 - 一直触发
    // const element = e.target // 在哪个元素上面
    // console.log("dragover", element);
}
function drop(e: DragEvent) {
    // 拖拽结束
    const element = e.target as HTMLDivElement // 在那个元素上面松开拖拽
    element.appendChild(dragStore.getDragingElement())
}
</script>
<template>
    <div @drop="drop" @dragover="dragover" style="width: 200px;height: 200px;background-color: aqua;">
    </div>
</template>