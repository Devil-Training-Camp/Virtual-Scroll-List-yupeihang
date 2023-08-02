<script setup lang="ts">
import Virtual from './components/virtual-list/virtual-list.vue'
let arr = reactive<[]>([])
for( let j : number = 0; j < 10000; j++ ) {
  if (j%5 == 0) {
    arr.push({
      id: j,
      img: 'https://pic.616pic.com/photoone/00/03/87/618ce4a5a8d982608.jpg'
    })
  }
  if (j%5 == 1) {
    arr.push({
      id: j,
      img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201912%2F21%2F20191221135304_8HjQV.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1693558235&t=ad261027609e41945202358709d4c81d'
    })
  }
  if (j%5 == 2) {
    arr.push({
      id: j,
      img: 'https://www.ssfiction.com/wp-content/uploads/2020/08/20200731_5f248ffb18461.jpg'
    })
  }
  if (j%5 == 3) {
    arr.push({
      id: j,
      img: 'https://img0.baidu.com/it/u=1604010673,2427861166&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889'
    })
  }
  if (j%5 == 4) {
    arr.push({
      id: j,
      img: 'https://img0.baidu.com/it/u=3655762382,1202103861&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800'
    })
  }
}
console.error(arr)
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <Virtual :data="arr">
      <template #item="{ item }">
        <div>
          <div>{{ item.id }}</div>
          <div><img :src="item.img" alt=""></div>
        </div>
      </template>
    </Virtual>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
img {
  width: 50px;
}
</style>
