<template>
  <div class="OrderSubSuccessPage">
    <div class="iconClassDiv">
      <img class="success-icon" srcset="./Success@1x.png 1x, ./Success@1.5x.png 1.5x" />
    </div>
    <div class="textDescDiv">
      <div style="text-align: center; font-size: 18px; font-weight:500;font-family:'PingFangSC-Medium'; color: #111111; margin-bottom: 12px">您的租赁订单已预约成功</div>
      <div style="text-align: center; font-size: 14px; font-family:'PingFangSC-Medium'; color: #888888" v-html="resultTips"></div>
    </div>
    <!--按钮部分-->
    <div class="buttonsPlane" style="display: flex; justify-content: center">
      <div style="margin-right: 20px">
        <x-button @click.native="menuButtonClick('返回首页')">返回首页</x-button>
      </div>
      <div>
        <x-button @click.native="menuButtonClick('查看订单')">查看订单</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton, Msg, Flexbox, FlexboxItem } from 'vux';
import { isWzapp, goHome } from './../../util/utils';
export default {
  name: 'OrderSubSuccessPage',
  components: {
    XButton,
    Msg,
    Flexbox,
    FlexboxItem
  },
  data() {
    return {
      menuList: ['返回首页', '查看订单'],
      orderNo: '',
      processType: sessionStorage.getItem('processType'),
      resultTips: '',
      isWzapp: isWzapp()
    };
  },
  created() {
    let tempParam = this.$router.app._route.params;
    this.orderNo = tempParam.orderNo;
    console.log('传递过来的订单号为: ' + JSON.stringify(tempParam));
    this.resultTips = (this.processType !== '1') ? '请保持电话畅通，<br>15分钟内工作人员将来电（0755-2197450）确认<br>工作时间：09:00-18:00' : '工作人员确认中，<br>请耐心等待并留意确认结果及时进行支付';
    // 清除申请序列号
    this.$store.commit('updateApplySerialNo', { applySerialNo: '' });
  },
  // 路由部分的处理，离开页面和进入页面的处理
  beforeRouteLeave(to, from, next) {
    if (to.name === 'OrderSubmitPage' || to.name === 'OrderSubmitPageNew') {
      if (this.isWzapp) {
        this.jsBridge.closeWebView();
      } else {
        next({ name: 'HomePage' });
      }
    } else {
      next();
    }
  },
  methods: {
    menuButtonClick(menuTtem) {
      if (menuTtem === '返回首页') {
        goHome(this, true);
        // this.$router.push({ name: 'HomePage' });
      } else if (menuTtem === '查看订单') {
        let item = {
          orderNo: this.orderNo
        };
        this.$router.push({ name: 'OrderDetailNewPage', params: item });
      } else {
        // Do Nothine
      }
    }
  }
};
</script>

<style lang="less">
@import './../../common/less/index';
.OrderSubSuccessPage {
  .iconClassDiv {
    text-align: center;
    width: 100%;
    margin-top: 79px;
  }
  .textDescDiv {
    margin-top: 30px;
    margin-left: 18px;
    margin-right: 18px;
  }
  /*Xicon的图标样式*/
  .vux-x-icon {
    fill: #51c429;
  }
  .buttonsPlane {
    margin: 12px 68px 0px 68px;
    display: flex;
    justify-content: center;
    align-items: center;

    .weui-btn {
      padding: 0;
      width: 111px !important;
      height: 36px !important;
      background: #ffda29 !important;
      font-size: 14px !important;
      color: #111111 !important;
      text-align: center !important;
      border-radius: 6px !important;
    }
  }
  .success-icon {
    width: 80px;
    height: 80px;
  }
}
</style>
