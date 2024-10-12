<script setup>
import logo from '@/assets/img/logo2.png'
import { ref } from 'vue'
import { authTokenApi, sendCode } from '@/api/auth'
import { registerApi } from '@/api/member'
import { useUserStore } from '@/stores/index.js'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { message } from '@/utils/resetMessage'
const userStore = useUserStore()
const router = useRouter()
const loginFormRef = ref()
const registerFormRef = ref()
const loginForm = ref({
  client_id: 'petmall-client-auth',
  client_secret: 'petmall-web-auth-server',
  grant_type: 'password',
  username: '',
  phone: '',
  password: '',
  code: ''
})
const registerForm = ref({
  phone: '',
  registerPassword: '',
  reRegisterPassword: ''
})
const rules = ref({
  username: [{ required: true, message: '请输入用户名/手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
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
  registerPassword: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    {
      pattern: /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{5,}$/,
      message: '密码必须由字母、数字、特殊字符，任意2种组成，5位以上',
      trigger: 'change'
    }
  ],
  reRegisterPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.value.registerPassword) {
          callback(new Error('与密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})
const isLogin = ref(true)
const isPassword = ref(true)
const sendSmsFlag = ref(false)
const smsTime = ref(0)
const changeToLoginHandler = () => {
  isLogin.value = true
}
const changeToRegisterHandler = () => {
  isLogin.value = false
}
const changeLoginWay = () => {
  isPassword.value = !isPassword.value
  if (isPassword.value) {
    loginForm.value.grant_type = 'password'
  } else {
    loginForm.value.grant_type = 'sms_code'
  }
}

const sendCodeHandler = async () => {
  let flag = true
  if (isLogin.value) {
    loginFormRef.value.validateField('phone', async (valid) => {
      if (!valid) {
        flag = false
      } else {
        sendCode(loginForm.value.phone)
          .then((res) => {
            message.success(res.msg)
          })
          .catch(() => {
            flag = false
          })
      }
    })
  } else {
    registerFormRef.value.validateField('phone', async (valid) => {
      if (!valid) {
        flag = false
      } else {
        sendCode(registerForm.value.phone)
          .then((res) => {
            message.success(res.msg)
          })
          .catch(() => {
            flag = false
          })
      }
    })
  }

  setTimeout(() => {
    if (flag) {
      sendSmsFlag.value = true
      smsTime.value = 60
      let time = setInterval(() => {
        --smsTime.value
        if (smsTime.value == 0) {
          clearInterval(time)
          sendSmsFlag.value = false
        }
      }, 1000)
    }
  }, 100)
}
const login = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      if (isPassword.value) {
        loginForm.value.grant_type = 'password'
        loginForm.value.phone = ''
        loginForm.value.code = ''
      } else {
        loginForm.value.grant_type = 'sms_code'
        loginForm.value.username = ''
        loginForm.value.password = ''
      }
      const res = await authTokenApi(loginForm.value)
      userStore.setToken(res.data.token_type + ' ' + res.data.access_token)
      userStore.setRefreshToken(res.data.refresh_token)
      ElNotification({
        title: '登录成功',
        type: 'success'
      })
      router.replace('/')
    }
  })
}
const register = () => {
  registerFormRef.value.validate(async (valid) => {
    if (valid) {
      const res = await registerApi(registerForm.value)
      message.success(res.msg)
      isLogin.value = true
    }
  })
}
const baseURL = 'http://petmall-project.natapp1.cc'
const backURL = 'http://localhost:8991/login'
const redirectUrl = encodeURIComponent(backURL)
const alipayLoginUrl = `${baseURL}/thirdparty/open/oauth2/alipay/login?redirect=${redirectUrl}`
const route = useRoute()
if (route.query.auth) {
  const auth = JSON.parse(route.query.auth)
  userStore.setToken(auth.token_type + ' ' + auth.access_token)
  userStore.setRefreshToken(auth.refresh_token)
  ElNotification({
    title: '登录成功',
    type: 'success'
  })
  router.replace('/')
}
</script>
<template>
  <div class="login">
    <div class="login-header container">
      <div class="logo">
        <RouterLink to="/home"> <el-image fit="contain" :src="logo" class="logo"></el-image></RouterLink>
      </div>
      <h1 class="content">欢迎您登录</h1>
    </div>
    <div class="login-main">
      <div class="login-container">
        <div class="form-box">
          <div class="main-nav">
            <h4 class="to-login" @click="changeToLoginHandler" :class="{ active: isLogin }">登录</h4>
            <h4 class="to-register" @click="changeToRegisterHandler" :class="{ active: !isLogin }">注册</h4>
          </div>
          <div class="form-content" v-if="isLogin">
            <el-form
              ref="loginFormRef"
              style="width: 400px; margin: 0 auto"
              :model="loginForm"
              :rules="rules"
              size="large"
              autocomplete="off"
            >
              <el-form-item v-if="isPassword" class="form-item" prop="username">
                <el-input v-model="loginForm.username" placeholder="用户名/手机号" clearable></el-input>
              </el-form-item>
              <el-form-item v-else class="form-item" prop="phone">
                <el-input v-model="loginForm.phone" placeholder="手机号" clearable></el-input>
              </el-form-item>
              <el-form-item v-if="isPassword" class="form-item" prop="password">
                <el-input
                  v-model="loginForm.password"
                  placeholder="密码"
                  type="password"
                  show-password
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item v-else class="form-item" prop="code">
                <div class="send-code">
                  <el-input class="send-code-input" v-model="loginForm.code" placeholder="验证码"> </el-input>
                  <button :disabled="sendSmsFlag" class="send-code-btn" @click.prevent="sendCodeHandler">
                    {{ smsTime > 0 ? `${smsTime}s后重新获取` : '发送验证码' }}
                  </button>
                </div>
              </el-form-item>
              <el-form-item class="form-item">
                <div class="sms-forget">
                  <div class="sms-active" @click="changeLoginWay">{{ isPassword ? '短信一键登录' : '密码登录' }}</div>
                  <div class="forget-active">忘记密码</div>
                </div>
              </el-form-item>
              <el-form-item>
                <button class="login-btn" @click.prevent="login">登录</button>
              </el-form-item>
            </el-form>
          </div>
          <div v-else class="form-content" style="margin-top: 5px">
            <el-form
              ref="registerFormRef"
              style="width: 400px; margin: 0 auto; padding-top: 20px"
              :model="registerForm"
              :rules="rules"
              size="large"
              autocomplete="off"
            >
              <el-form-item class="form-item" prop="phone">
                <el-input v-model="registerForm.phone" placeholder="手机号" clearable></el-input>
              </el-form-item>
              <el-form-item class="form-item" prop="registerPassword">
                <el-input
                  type="password"
                  show-password
                  placeholder="请输入密码"
                  v-model="registerForm.registerPassword"
                ></el-input>
              </el-form-item>
              <el-form-item class="form-item" prop="reRegisterPassword">
                <el-input
                  type="password"
                  show-password
                  placeholder="请输入确认密码"
                  v-model="registerForm.reRegisterPassword"
                ></el-input>
              </el-form-item>
              <el-form-item class="form-item" prop="code">
                <div class="send-code">
                  <el-input class="send-code-input" v-model="registerForm.code" placeholder="验证码"> </el-input>
                  <button :disabled="sendSmsFlag" class="send-code-btn" @click.prevent="sendCodeHandler">
                    {{ smsTime > 0 ? `${smsTime}s后重新获取` : '发送验证码' }}
                  </button>
                </div>
              </el-form-item>
              <el-form-item>
                <button class="login-btn" @click.prevent="register">注册</button>
              </el-form-item>
            </el-form>
          </div>
          <div v-if="isLogin" class="other-login">
            <a class="alipay" :href="alipayLoginUrl">
              <i class="iconfont icon-zhifubao"></i>
              <span>支付宝</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="extra">
      <ul class="extra-copyright">
        <li>
          <RouterLink to="">关于我们</RouterLink>
        </li>
        <li>
          <RouterLink to="">帮助中心</RouterLink>
        </li>
        <li>
          <RouterLink to="">售后服务</RouterLink>
        </li>
        <li>
          <RouterLink to="">配送与验收</RouterLink>
        </li>
        <li>
          <RouterLink to="">商务合作</RouterLink>
        </li>
        <li>
          <RouterLink to="">搜索推荐</RouterLink>
        </li>
        <li>
          <RouterLink to="">友情链接</RouterLink>
        </li>
      </ul>
      <div class="copyright-auth">Copyright @ I宠购物商城</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.login {
  background-color: #fff;

  .login-header {
    display: flex;
    align-items: center;

    .logo {
      width: 200px;
    }

    .content {
      font-family: 'dingding', sans-serif;
      font-size: 40px;
    }
  }

  .login-main {
    height: 580px;
    background-image: url('@/assets/img/details-banner.jpg');
    background-position: center center;
    background-size: cover;
    display: flex;
    align-items: center;

    .login-container {
      width: 1240px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 500px;
    }

    .form-box {
      width: 600px;
      height: 450px;
      background-color: rgba($color: #fff, $alpha: 0.8);
      border-radius: 30px;
      color: #444;
    }

    .main-nav {
      margin-top: 40px;
      display: flex;
      justify-content: center;

      h4 {
        font-family: 'dingding', sans-serif;
        letter-spacing: 5px;
        color: #444;
        font-size: 30px;
        transition: all 0.3s ease 0s;
      }

      h4:hover {
        color: $primaryColor;
      }

      .to-login::before {
        background-color: #444;
        bottom: 5px;
        content: '';
        height: 30px;
        margin: 0 auto;
        position: absolute;
        right: -2px;
        transition: all 0.4s ease 0s;
        width: 1px;
      }

      .to-login {
        cursor: pointer;
        padding: 0 20px;
        position: relative;
      }

      .to-register {
        cursor: pointer;
        padding: 0 20px;
      }

      .active {
        color: $primaryColor;
      }
    }

    .form-content {
      margin-top: 30px;

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

      .form-item {
        width: 400px;

        .sms-forget {
          width: 400px;
          display: flex;
          justify-content: space-between;

          .sms-active {
            cursor: pointer;
            transition: 0.3s all linear;

            &:hover {
              color: $primaryColor;
            }
          }

          .forget-active {
            cursor: pointer;
            color: #646262;
            transition: 0.3s all linear;

            &:hover {
              color: $primaryColor;
            }
          }
        }
      }

      .login-btn {
        font-family: 'dingding', sans-serif;
        letter-spacing: 10px;
        font-size: 20px;
        cursor: pointer;
        width: 100%;
        background-color: $primaryColor;
        color: #fff;
        border: 0;
        height: 40px;
        border-radius: 10px;
        transition: 0.3s all ease;

        &:hover {
          background-color: #000;
        }
      }
    }

    .other-login {
      display: flex;
      width: 420px;
      margin: 0 auto;

      .alipay {
        cursor: pointer;
        display: flex;
        align-items: center;

        .iconfont {
          margin-right: 5px;
          color: rgb(6, 171, 241);
          font-size: 25px;
        }

        span {
          transition: 0.3s all ease;
          color: #444;
        }

        &:hover {
          span {
            color: $primaryColor;
          }
        }
      }
    }
  }
}

.el-input ::v-deep .el-input__inner::placeholder {
  color: #626262;
}

.el-input ::v-deep .el-input__suffix .el-input__suffix-inner {
  border: 0 !important;
}

.extra {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 110px;
  align-items: center;

  &-copyright {
    margin-top: 10px;
    display: flex;
    justify-content: center;

    li:not(:last-child)::after {
      content: '|';
      color: $hotLineColor;
      margin: 0 10px;
    }
  }
}
</style>
