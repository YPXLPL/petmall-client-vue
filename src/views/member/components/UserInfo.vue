<script setup>
import AvatarUpload from '@/components/AvatarUpload.vue'
import { nextTick, ref } from 'vue'
import ProvinceCascader from '@/views/common/ProvinceCascader.vue'
import { useUserStore } from '@/stores'
import { updateMemberInfoApi, getMemberInfoApi } from '@/api/member'
import { updateAvatarApi } from '@/api/auth'
import { message } from '@/utils/resetMessage'
import { ElMessageBox } from 'element-plus'
const userStore = useUserStore()
const userInfo = userStore.user
const avatar = ref('')
const userFormData = ref({
  nickName: '',
  city: '',
  introduce: '',
  gender: 1,
  birthday: ''
})
const getMemberInfo = async () => {
  const res = await getMemberInfoApi()
  userFormData.value = res.data
  userFormData.value.nickName = userInfo.nickName
  avatar.value = userInfo.avatar
}
getMemberInfo()
const updateAvatarUrl = async (newUrl) => {
  avatar.value = newUrl
  const res = await updateAvatarApi(newUrl)
  message.success(res.msg)
}
const provinceCascaderRef = ref()
const isEdit = ref(false)
const changeToEdit = () => {
  isEdit.value = true
  nextTick(() => {
    provinceCascaderRef.value.selectCategory(userFormData.value.city.split('/'))
  })
}
const changeProvince = (val) => {
  if (val) {
    userFormData.value.city = val.join('/')
  } else {
    userFormData.value.city = null
  }
}
const submitUserInfo = () => {
  ElMessageBox.confirm('你确认修改个人信息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const res = await updateMemberInfoApi(userFormData.value)
      message.success(res.msg)
      isEdit.value = false
      userStore.getUserInfo()
      getMemberInfo()
    })
    .catch(() => {})
}
</script>
<template>
  <div class="user-info">
    <div class="avatar">
      <AvatarUpload :url="avatar" @input="updateAvatarUrl"></AvatarUpload>
    </div>
    <div class="favor">
      <div class="follow"><span>关注</span>：{{ userFormData.follow ? userFormData.follow : 0 }}</div>
      <div class="fans"><span>粉丝</span>：{{ userFormData.fans ? userFormData.fans : 0 }}</div>
    </div>
    <div class="user-info-box">
      <div class="info-title">用户名：</div>
      <div class="info-content">{{ userInfo.username }}</div>
    </div>
    <div class="user-info-box">
      <div class="info-title">昵称：</div>
      <div class="info-content" v-if="!isEdit">{{ userFormData.nickName ? userFormData.nickName : '未填写' }}</div>
      <div class="info-content edit" v-if="isEdit">
        <el-input v-model="userFormData.nickName"></el-input>
      </div>
    </div>
    <div class="user-info-box">
      <div class="info-title">性别：</div>
      <div class="info-content" v-if="!isEdit">
        {{ userFormData.gender ? (userFormData.gender === 2 ? '女' : '男') : '未填写' }}
      </div>
      <div class="info-content edit" v-if="isEdit">
        <el-radio-group v-model="userFormData.gender">
          <el-radio :label="1" size="large">男</el-radio>
          <el-radio :label="2" size="large">女</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="user-info-box">
      <div class="info-title">生日：</div>
      <div class="info-content" v-if="!isEdit">{{ userFormData.birthday ? userFormData.birthday : '未填写' }}</div>
      <div class="info-content edit" v-if="isEdit">
        <el-date-picker v-model="userFormData.birthday" type="date" placeholder="选择生日" />
      </div>
    </div>
    <div class="user-info-box">
      <div class="info-title">所在城市：</div>
      <div class="info-content" v-if="!isEdit">{{ userFormData.city ? userFormData.city : '未填写' }}</div>
      <div class="info-content edit" v-if="isEdit">
        <ProvinceCascader ref="provinceCascaderRef" @change="changeProvince"></ProvinceCascader>
      </div>
    </div>
    <div class="user-info-box last">
      <div class="info-title">个人介绍：</div>
      <div class="info-content" v-if="!isEdit">
        <div class="text-info" v-if="userFormData.introduce">{{ userFormData.introduce }}</div>
        <div class="empty-text-info" v-if="!userFormData.introduce">暂无内容</div>
      </div>
      <div class="info-content edit" v-if="isEdit">
        <el-input
          v-model="userFormData.introduce"
          maxlength="60"
          placeholder="个人介绍"
          show-word-limit
          type="textarea"
        />
      </div>
    </div>
    <div class="edit-btn-box" v-if="!isEdit">
      <button class="btn" @click.prevent="changeToEdit">修改个人信息</button>
    </div>
    <div v-else class="submit-btn-box">
      <button class="btn" @click.prevent="submitUserInfo">提交</button>
      <button class="btn" @click.prevent="isEdit = false">取消</button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.user-info {
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .avatar {
    margin-bottom: 30px;
  }
}

.favor {
  margin: 10px 0;
  display: flex;
  font-size: 18px;
  .follow {
    span {
      border-bottom: 2px solid transparent;
      cursor: pointer;
      color: $primaryColor;
      font-family: 'dingding', sans-serif;
      transition: 0.3s all ease;
      &:hover {
        border-bottom: 2px solid $primaryColor;
      }
    }
  }
  .fans {
    span {
      cursor: pointer;
      color: #9c0b0b;
      font-family: 'dingding', sans-serif;
      border-bottom: 2px solid transparent;
      transition: 0.3s all ease;
      &:hover {
        border-bottom: 2px solid #9c0b0b;
      }
    }
    margin-left: 30px;
  }
}
.user-info-box {
  display: flex;
  margin: 10px 0;
  width: 400px;
  height: 32px;
  align-items: center;
  .info-title {
    font-family: 'dingding', sans-serif;
    width: 120px;
    font-size: 16px;
  }
  .info-content {
    width: 100%;
    font-size: 14px;
    padding: 0 11px;
  }
  .info-content.edit {
    padding: 0;
  }
}
.last {
  height: 100%;
  flex-wrap: wrap;
  .info-content {
    margin-top: 5px;
    height: 54px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0;
    .text-info {
      padding: 5px 11px;
    }
    .empty-text-info {
      text-align: center;
      padding-top: 13px;
    }
  }
}

.submit-btn-box {
  margin-top: 30px;
  .btn {
    color: #fff;
    background-color: $primaryColor;
    border: 0;
    width: 150px;
    height: 40px;
    border-radius: 10px;
    font-family: 'dingding', sans-serif;
    letter-spacing: 3px;
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s all ease;
    &:hover {
      background-color: #333;
    }
  }
  .btn:last-child {
    margin-left: 30px;
    border: 1px solid #b3aeae;
    color: #333;
    background-color: #fff;
    &:hover {
      color: #fff;
      background-color: $primaryColor;
    }
  }
}
.edit-btn-box {
  margin-top: 30px;
  .btn {
    color: #fff;
    background-color: $primaryColor;
    border: 0;
    width: 200px;
    height: 40px;
    border-radius: 10px;
    font-family: 'dingding', sans-serif;
    letter-spacing: 3px;
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s all ease;
    &:hover {
      background-color: #333;
    }
  }
}
</style>
