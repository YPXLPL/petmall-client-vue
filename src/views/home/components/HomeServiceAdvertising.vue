<script setup>
import { getHomeServiceAdvertisingApi } from '@/api/other'
import { ref } from 'vue'
const homeServiceAdvertisingList = ref([])
const getHomeServiceAdvertising = async () => {
  const res = await getHomeServiceAdvertisingApi()
  homeServiceAdvertisingList.value = res.data
}
getHomeServiceAdvertising()

const setBackground = (index) => {
  switch (index) {
    case 0:
      return '#fcedda'
    case 1:
      return '#f2fbcb'
    case 2:
      return '#f7d8f9'
  }
}
</script>

<template>
  <div class="service-advertising">
    <div class="service-advertising-container container">
      <ul class="service-advertising-items">
        <li
          class="service-advertising-item"
          :style="{ backgroundColor: setBackground(index) }"
          v-for="(item, index) in homeServiceAdvertisingList"
          :key="item.id"
        >
          <div class="img">
            <el-image :src="item.logo"></el-image>
          </div>
          <div class="sa-title">
            <span>{{ item.title }}</span>
          </div>
          <div class="sa-sub-title">
            <span>{{ item.subTitle }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.service-advertising {
  background-color: #fff;
  padding: 100px 0;
  &-items {
    display: flex;
    justify-content: space-between;
  }

  &-item {
    padding: 30px 28px 25px;
    width: 370px;
    height: 175px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .sa-title {
      color: #4f4e4e;
      font-size: 16px;
      font-weight: bold;
      margin: 17px 0 7px;
      position: relative;
    }

    .sa-sub-title {
      color: #4f4e4e;
      font-size: 15px;
      margin: 0;
    }
  }

  &-item:hover .el-image {
    animation: 500ms ease-in-out 0s normal none 1 running tada;
  }
}

@keyframes tada {
  0% {
    transform: scale3d(1, 1, 1);
  }

  10%,
  20% {
    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
  }

  30%,
  50%,
  70%,
  90% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
  }

  40%,
  60%,
  80% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
  }

  100% {
    transform: scale3d(1, 1, 1);
  }
}
</style>
