<script setup>
import icon1 from '@/assets/img/footerIcon1.png'
import icon2 from '@/assets/img/footerIcon2.png'
import icon3 from '@/assets/img/footerIcon3.png'
import icon4 from '@/assets/img/footerIcon4.png'
import icon5 from '@/assets/img/footerIcon5.png'
import { ref } from 'vue'

const footerTitleList = ref([
  {
    id: 1,
    img: icon1,
    title: '正品保障'
  },
  {
    id: 2,
    img: icon2,
    title: '品类丰富'
  },
  {
    id: 3,
    img: icon3,
    title: '优质服务'
  },
  {
    id: 4,
    img: icon4,
    title: '科学养宠'
  },
  {
    id: 5,
    img: icon5,
    title: 'I宠公益'
  }
])
</script>

<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-top container">
        <ul class="footer-top-items">
          <li v-for="item in footerTitleList" :key="item.id">
            <RouterLink to="" class="footer-top-item">
              <el-image class="img" :src="item.img"></el-image>
              <span class="item-title">{{ item.title }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>
      <div class="line"></div>
      <div class="service container">
        <div class="service-help">
          <dl>
            <dt>购物指南</dt>
            <dd><RouterLink to="">新人优惠</RouterLink></dd>
            <dd><RouterLink to="">购物问题</RouterLink></dd>
            <dd><RouterLink to="">支付问题</RouterLink></dd>
          </dl>
          <dl>
            <dt>售后服务</dt>
            <dd><RouterLink to="">退换货政策</RouterLink></dd>
            <dd><RouterLink to="">退货说明</RouterLink></dd>
            <dd><RouterLink to="">售后问题</RouterLink></dd>
          </dl>
        </div>
        <div class="hot-line"></div>
        <div class="service-qrcode-container">
          <div class="qrcode">
            <div>扫描下载APP</div>
            <small>下单更优惠</small>
            <img src="@/assets/img/img-code.png" />
          </div>
          <div class="qrcode">
            <div>扫描关注I宠</div>
            <small>微信商城</small>
            <img src="@/assets/img/img-code.png" />
          </div>
        </div>
        <div class="hot-line"></div>
        <div class="service-live-container">
          <div class="customer-service">客户服务</div>
          <div class="items">
            <RouterLink to="">
              <div class="item"><i class="iconfont icon-icon-kefuzhongxin"></i> 在线客服</div>
            </RouterLink>
            <RouterLink to="">
              <div class="item"><i class="iconfont icon-icon_question"></i> 问题反馈</div>
            </RouterLink>
          </div>
        </div>
        <div class="hot-line"></div>
        <div class="service-contact-container">
          <div class="service-hotline">服务热线</div>
          <div class="phone-number">
            <div>4008889120</div>
            <small>[免长途费]</small>
          </div>
          <div class="phone-number">
            <div>020-68877881</div>
            <small>周一至周日 08:00-19:00</small>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="extra">
        <ul class="extra-copyright">
          <li><RouterLink to="">关于我们</RouterLink></li>
          <li><RouterLink to="">帮助中心</RouterLink></li>
          <li><RouterLink to="">售后服务</RouterLink></li>
          <li><RouterLink to="">配送与验收</RouterLink></li>
          <li><RouterLink to="">商务合作</RouterLink></li>
          <li><RouterLink to="">搜索推荐</RouterLink></li>
          <li><RouterLink to="">友情链接</RouterLink></li>
        </ul>
        <div class="copyright-auth">Copyright @ I宠购物商城</div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  &-container {
    border-top: 1px solid rgba(202, 202, 202, 0.7);
    width: 100%;
    margin: 0 auto;
  }
}
.line {
  height: 1px;
  width: 100%;
  background-color: rgba(202, 202, 202, 0.7);
}
.footer-top {
  &-items {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-item {
    display: flex;
    align-items: center;
    .img {
      width: 40px;
      margin-right: 7px;
    }
    .item-title {
      font-size: 20px;
    }
  }
}

.service {
  display: flex;
  align-items: center;
  height: 240px;
  &-help {
    width: 310px;
    display: flex;
    justify-content: left;
    align-items: center;
    dl:last-child {
      margin-left: 130px;
    }
    dt {
      font-size: 16px;
    }
    dd:first-of-type {
      margin-top: 30px;
    }
    dd {
      margin-top: 20px;
      a {
        transition: 0.3s all ease;
      }
      a:hover {
        color: $primaryColor;
      }
    }
  }
  .hot-line {
    width: 1px;
    height: 200px;
    margin: 0 10px;
    background-color: rgba(202, 202, 202, 0.7);
  }
  &-qrcode-container {
    width: 320px;
    height: 160px;
    display: flex;
    align-items: center;
    .qrcode {
      height: 155px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      img {
        width: 100px;
      }
    }
  }

  &-live-container {
    width: 280px;
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .customer-service {
      font-size: 18px;
    }
    .items {
      margin-top: 20px;
      display: flex;
    }
    .item {
      margin: 0 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 90px;
      height: 90px;
      border: 1px solid rgba(202, 202, 202, 0.7);
      transition: 0.3s all ease;
      .iconfont {
        font-size: 36px;
        display: block;
        color: #666;
      }
      &:hover {
        color: $primaryColor;
        .iconfont {
          color: $primaryColor;
        }
        border: 1px solid $primaryColor;
      }
    }
  }
  &-contact-container {
    height: 150px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    .service-hotline {
      font-size: 18px;
    }
    .phone-number {
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      div {
        font-size: 20px;
      }
    }
  }
}

.extra {
  background-color: #e0e0e0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100px;
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
