<script setup>
import { useUserStore } from '@/stores'
import { computed, ref } from 'vue'
import { sendCode, updatePhoneApi, updateMemberPasswordApi } from '@/api/auth'
import { message } from '@/utils/resetMessage'
const userStore = useUserStore()
const isEdit = ref(false)
const formrRef = ref()
const phoneForm = ref({
  memberId: '',
  phone: '',
  code: ''
})
const phone = computed(() => {
  if (userStore.user.phone) {
    return userStore.user.phone
  } else {
    return '未填写'
  }
})
const passwordForm = ref({
  memberId: '',
  newPassword: '',
  reNewPassword: ''
})
const rules = ref({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'change' }
  ],
  code: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入验证码'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  newPassword: [{ min: 8, message: '密码不能少于8个字符', trigger: 'blur' }],
  reNewPassword: [
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('确认密码与新密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})
const editId = ref(0)
const changeToEdit = (id) => {
  isEdit.value = true
  if (id === 1) {
    editId.value = 1
    phoneForm.value = {
      phone: '',
      code: ''
    }
  } else if (id === 2) {
    editId.value = 2
    passwordForm.value = {
      oldPassword: '',
      newPassword: '',
      reNewPassword: ''
    }
  }
}
const sendSmsFlag = ref(false)
const smsTime = ref(0)
let time = 0
const sendCodeHandler = async () => {
  formrRef.value.validateField('phone', async (valid) => {
    if (valid) {
      const res = await sendCode(phoneForm.value.phone)
      message.success(res.msg)
      setTimeout(() => {
        sendSmsFlag.value = true
        smsTime.value = 60
        time = setInterval(() => {
          --smsTime.value
          if (smsTime.value == 0) {
            clearInterval(time)
            sendSmsFlag.value = false
          }
        }, 1000)
      }, 100)
    }
  })
}
const submit = () => {
  if (editId.value === 1) {
    formrRef.value.validate(async (valid) => {
      if (valid) {
        phoneForm.value.memberId = userStore.user.id
        const res = await updatePhoneApi(phoneForm.value)
        message.success(res.msg)
        isEdit.value = false
        editId.value = 0
        userStore.getUserInfo()
      }
    })
  } else if (editId.value === 2) {
    formrRef.value.validate(async (valid) => {
      if (valid) {
        passwordForm.value.memberId = userStore.user.id
        const res = await updateMemberPasswordApi(passwordForm.value)
        message.success(res.msg)
        isEdit.value = false
        editId.value = 0
        userStore.getUserInfo()
      }
    })
  }
}
</script>
<template>
  <div class="save-set">
    <div class="show-phone" v-if="!isEdit">
      <div class="my-phone">
        <div class="info-title">我的手机号：</div>
        <div class="info-content">{{ phone }}</div>
      </div>
      <div class="btns">
        <button class="btn" @click.prevent="changeToEdit(1)">修改手机号</button>
        <button class="btn" @click.prevent="changeToEdit(2)">修改密码</button>
      </div>
    </div>
    <div v-if="isEdit && editId === 1">
      <el-form ref="formrRef" :model="phoneForm" :rules="rules">
        <el-form-item class="form-item" prop="phone">
          <el-input v-model="phoneForm.phone" placeholder="请输入新手机号" clearable></el-input>
        </el-form-item>
        <el-form-item class="form-item" prop="phone">
          <div class="send-code">
            <el-input class="send-code-input" v-model="phoneForm.code" placeholder="验证码"> </el-input>
            <button :disabled="sendSmsFlag" class="send-code-btn" @click.prevent="sendCodeHandler">
              {{ smsTime > 0 ? `${smsTime}s后重新获取` : '发送验证码' }}
            </button>
          </div>
        </el-form-item>
        <el-form-item class="form-item">
          <div class="submit-btns">
            <button class="btn" @click.prevent="submit">确定</button>
            <button class="btn" @click.prevent="isEdit = false">取消</button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="isEdit && editId === 2">
      <el-form ref="formrRef" :model="passwordForm" :rules="rules" label-width="80">
        <el-form-item class="form-item" prop="newPassword" label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item class="form-item" prop="reNewPassword" label="确认密码">
          <el-input
            v-model="passwordForm.reNewPassword"
            type="password"
            show-password
            placeholder="请输入确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="form-item">
          <div class="submit-btns">
            <button class="btn" @click.prevent="submit">确定</button>
            <button class="btn" @click.prevent="isEdit = false">取消</button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.save-set {
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  .my-phone {
    display: flex;
    display: flex;
    margin: 10px 0;
    width: 400px;
    height: 32px;
    align-items: center;
    .info-title {
      font-family: 'dingding', sans-serif;
      width: 130px;
      font-size: 16px;
    }
    .info-content {
      width: 100%;
      font-size: 14px;
      padding: 0 11px;
    }
  }

  .btns {
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
      margin-left: 20px;
    }
  }
}

.form-item {
  width: 450px;
  .send-code {
    width: 400px;
    display: flex;

    &-input {
      width: 70%;
    }

    &-btn {
      width: 30%;
      margin-left: 20px;
      border-radius: 5px;
      cursor: pointer;
      background-color: $primaryColor;
      color: #fff;
      border: 0;
      transition: 0.3s all ease;
      border: 1px solid #ccc;
      &:hover {
        color: #fff;
        background-color: #000;
      }
    }

    &-btn[disabled] {
      cursor: not-allowed;
      background-color: #fff;
      color: #444;
    }
  }

  .submit-btns {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    .btn {
      font-family: 'dingding', sans-serif;
      font-size: 16px;
      letter-spacing: 3px;
      width: 40%;
      height: 35px;
      border-radius: 5px;
      cursor: pointer;
      background-color: $primaryColor;
      color: #fff;
      border: 0;
      transition: 0.3s all ease;

      &:hover {
        color: #fff;
        background-color: #000;
      }
    }
    .btn:last-child {
      background-color: #fff;
      color: #333;
      border: 1px solid #ccc;
      &:hover {
        color: #fff;
        background-color: $primaryColor;
      }
    }
  }
}
</style>
