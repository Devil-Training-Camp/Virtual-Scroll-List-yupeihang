<template>
  <div class="virtual-wrapper" ref="wrapperRef" style="height:500px"  @scroll="onScroll">
        <div class="inner" ref="innerRef" style="height:500000px">
            <div class="list" ref="virtualListRef" :style="{ transform: `translateY(${state.scrollOffset}px)`}">
                <div v-for="(item, index) in clientData" :key="index + state.start">
                    <slot name="item" :item="item"></slot>
                </div>
            </div>
        </div>
  </div>
</template>
<script setup lang="ts">
import virtualProps from "./props";

const props = defineProps(virtualProps);
const virtualListRef = ref();
const state = reactive<any>({
    start: 0,
    end: 10,
    scrollOffset: 0,
    cacheData: []
});

//当前可视的数据。
const clientData = computed(() => {
    return props.data.slice(state.start, state.end);
});
const onScroll = (e: any) => {
    const { scrollTop } = e.target;
    const { cache, dynamic, itemHeight } = props;
    if (state.scrollOffset === scrollTop) return;
    const cacheCount = Math.max(1, cache) // 防止列表滚动过快，数据还没渲染，可能会导致空白的情况，效果不太好，关于这点，我们可以和无缝滚动一样，在当前可视区域前后各插入一屏，这样即可优化滚动效果。
    let startIndex = dynamic ? getStartIndex(scrollTop) : Math.floor(scrollTop / itemHeight);

    const endIndex = startIndex + 10 + cacheCount
    
    if (startIndex > cacheCount) {
        startIndex = startIndex - cacheCount;
    }

    // 偏移量
    const offset = getCurrentTop(startIndex);
    Object.assign(state, {
        start: startIndex,
        end: endIndex,
        scrollOffset: offset
    });
};
// 二分法去查找对应的index
const getStartIndex = (scrollTop = 0): number => {
    let low = 0;
    let high = state.cacheData.length - 1;
    while (low <= high) {
        const middle = low + Math.floor((high - low) / 2);
        const middleTopValue = getCurrentTop(middle);
        const middleBottomValue = getCurrentTop(middle + 1);

        if (middleTopValue <= scrollTop && scrollTop <= middleBottomValue) {
            return middle;
        } else if (middleBottomValue < scrollTop) {
            low = middle + 1;
        } else if (middleBottomValue > scrollTop) {
            high = middle - 1;
        }
    }
    return Math.min(10000 - 10, Math.floor(scrollTop / 50));
};
const getCurrentTop = (index: number) => {
    const lastIndex = state.cacheData.length - 1;
    if (Object.hasOwn(state.cacheData, index)) {
        return state.cacheData[index].top;
    } else if (Object.hasOwn(state.cacheData, index - 1)) {
        return state.cacheData[index - 1].bottom;
    } else if (index > lastIndex) {
        return state.cacheData[lastIndex].bottom + Math.max(0, index - state.cacheData[lastIndex].index) * props.itemHeight;
    } else {
        return index * props.itemHeight;
    }
};
const getTotalHeight = computed(() => {
    return getCurrentTop(props.data.length);
});
onUpdated(() => {
    const childrenList = virtualListRef.value.children || [];
    [...childrenList].forEach((node: any, index: number) => {
        const height = node.getBoundingClientRect().height;
        const currentIndex = state.start + index;
        if (state.cacheData[currentIndex].height === height) return;

        state.cacheData[currentIndex].height = height;
        state.cacheData[currentIndex].top = getCurrentTop(currentIndex);
        state.cacheData[currentIndex].bottom = state.cacheData[currentIndex].top + state.cacheData[currentIndex].height;
    });
});
watchEffect(() => {
    clientData.value.forEach((_, index) => {
        const currentIndex = state.start + index;
        if (Object.hasOwn(state.cacheData, currentIndex)) return;
        state.cacheData[currentIndex] = {
            top: currentIndex * 50,
            height: 50,
            bottom: (currentIndex + 1) * 50,
            index: currentIndex
        };
    });
});
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