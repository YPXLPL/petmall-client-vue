<script setup>
import { useRoute } from 'vue-router'
import { SemiSelect } from '@element-plus/icons-vue'
import { ref } from 'vue'
const route = useRoute()
const routePathList = ref(route.matched)
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>
<template>
  <div class="breadcrumb-area">
    <div class="container">
      <div class="breadcrumb-area-title">
        <h2>{{ title }}</h2>
      </div>
      <div>
        <el-breadcrumb :separator-icon="SemiSelect" class="breadcrumb-area-items">
          <el-breadcrumb-item
            class="breadcrumb-area-item"
            v-for="item in routePathList"
            :key="item.path"
            :to="item.path"
            >{{ item.meta.name }}</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.breadcrumb-area {
  background-image: url('@/assets/img/details-banner.jpg');
  height: 200px;
  background-position: center center;
  background-size: cover;
  display: flex;
  align-items: center;
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &-title {
    h2 {
      font-family: 'dingding', sans-serif;
      color: #fff;
      font-size: 45px;
      margin: 0;
    }
    margin-bottom: 12px;
  }
}

.el-breadcrumb ::v-deep .el-breadcrumb__inner {
  font-size: 16px;
  font-weight: bold !important;
  color: #fff !important;
}
.el-breadcrumb ::v-deep .el-breadcrumb__inner:hover {
  color: #ddd !important;
}

.el-breadcrumb ::v-deep .el-icon {
  color: #fff !important;
}
</style>
