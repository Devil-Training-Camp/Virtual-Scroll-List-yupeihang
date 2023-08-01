<template>
  <div class="virtual-wrapper" ref="wrapperRef" style="height:500px"  @scroll="onScroll">
        <div class="inner" ref="innerRef" style="height:500000px">
            <div class="list" ref="virtualListRef" :style="{ transform: `translateY(${state.scrollOffset}px)`}">
                <div v-for="(item, index) in clientData" :key="index + state.start">
                    {{item}}
                </div>
            </div>
        </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, computed } from 'vue'
import virtualProps from "./props";

const props = defineProps(virtualProps);
const state = reactive<any>({
    start: 0,
    end: 10,
    scrollOffset: 0
});

//当前可视的数据。
const clientData = computed(() => {
    return props.data.slice(state.start, state.end);
});
const onScroll = (e: any) => {
    const { scrollTop } = e.target;
    if (state.scrollOffset === scrollTop) return;
    const cacheCount = 5 // 防止列表滚动过快，数据还没渲染，可能会导致空白的情况，效果不太好，关于这点，我们可以和无缝滚动一样，在当前可视区域前后各插入一屏，这样即可优化滚动效果。
    let startIndex = Math.floor(scrollTop / 50);

    const endIndex = startIndex + 10 + cacheCount
    
     if (startIndex > cacheCount) {
        startIndex = startIndex - cacheCount;
    }

    // 偏移量
    const offset = scrollTop - (scrollTop % 50);

    Object.assign(state, {
        start: startIndex,
        end: endIndex,
        scrollOffset: offset
    });
};
</script>

<style lang="scss" scoped>
.virtual-wrapper {
    position: relative;
    overflow-y: auto;
}
// .list {
//     willChange: "transform"
// }
</style>