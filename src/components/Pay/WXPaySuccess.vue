<template>
  <div class="WXPaySuccess">

    <div class="box-paySuccess">
      <img style="width: 80px; height: 80px;" :srcset="payImg">
    </div>

    <div class="box-payDesc">{{ payResult }}</div>

    <div v-show="loaded" class="box-toOrder">
      <x-button @click.native="menuButtonClick('返回首页')" class="button-toOrder" text="返回首页" :gradients="['#FFDA29', '#FFDA29']"></x-button>
      <x-button @click.native="menuButtonClick('查看订单')" class="button-toOrder" text="查看订单" :gradients="['#FFDA29', '#FFDA29']"></x-button>
    </div>

  </div>
</template>

<script>
import { XHeader, Msg, XButton } from 'vux';
import { mapMutations } from 'vuex';
import { isWzapp, isAlipayLife, goHome } from './../../util/utils';
export default {
  name: 'WXPaySuccess',
  components: {
    XHeader,
    Msg,
    XButton
  },
  data() {
    return {
      loaded: false,
      payResult: '正在获取支付结果...',
      payImg: './static/images/Pay/warning@1x.png',
      payTimeDelay: 10 * 1000, // 延迟10s获取状态
      orderStatus: {
        bizStatusNo1: '1', // 待确认、待还款
        bizStatusNo2: '2', // 待支付
        bizStatusNo3: '3', // 已支付、已还清
        bizStatusNo4: '4', // 已取消、逾期
        bizStatusNo5: '5', // 待发货
        bizStatusNo6: '6', // 已发货
        bizStatusNo7: '7', // 租赁中
        bizStatusNo8: '8', // 即将到期
        bizStatusNo9: '99' // 已完成
      },
      aliPayCount: 3,
      isAliFund: (isWzapp() || isAlipayLife())  // 是否支付宝预授权流程
    };
  },
  mounted() {
    console.log('mounted');
    if (this.isAliFund) {
      this.queryAliPayResult();
      if (this.$route.params.failCode) {
        this.reportPayFail(this.$route.params);
      }
    } else {
      this.getOrderDetailBefore();
    }
  },
  methods: {
    ...mapMutations(['updateLoadingStatus']),
    reportPayFail(obj) {
      let url = 'wuzhu/order/alipay/payFail';
      let param = obj;
      param['orderNo'] = this.$store.state.orderNo;
      this.$http
        .post(url, param)
        .then(res => {
          if (res.code === '00') {
            console.log('report success');
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    queryAliPayResult() {
      let url = 'wuzhu/order/fundAuth/query';
      let param = {
        orderNo: this.$store.state.orderNo
      };
      this.aliPayCount--;
      this.updateLoadingStatus({ isLoading: true });
      console.log('count', this.aliPayCount);
      this.$http
        .get(url, param)
        .then(res => {
          if (res.code === '00') {
            this.loaded = true;
            this.updateLoadingStatus({ isLoading: false });
            this.payResult = '恭喜客官下单成功，我们将在24小时内发货';
            this.payImg = './static/images/Pay/success@1x.png';
          } else {
            this.continueQueryAlipay();
          }
        })
        .catch(err => {
          console.error(err);
          this.continueQueryAlipay();
        });
    },
    continueQueryAlipay() {
      if (this.aliPayCount <= 0) {
        this.updateLoadingStatus({ isLoading: false });
        this.payResult = '订单支付失败，请稍后重试';
      } else {
        setTimeout(() => {
          this.queryAliPayResult();
        }, 3000);
      }
    },
    getOrderDetailBefore() {
      let that = this;
      if (that.$route.params && that.$route.params.code === '1') {
        console.log('全部使用积分抵扣，无需调起支付');
        that.loaded = true;
        that.payResult = '支付成功';
        that.payImg = './static/images/Pay/success@1x.png';
      } else {
        this.$store.commit('updateLoadingStatus', { isLoading: true });
        setTimeout(function() {
          that.getPayResult();
        }, that.payTimeDelay);
      }
    },
    getPayResult() {
      let that = this;
      console.log('getPayResult');
      let params = {
        payChannel: this.$store.state.payChannel,
        payNumer: this.$store.state.tradeNum
      };
      console.log('WXPaySuccess payChannel >>> ' + (this.$store.state.payChannel + 1));
      console.log('WXPaySuccess payNumer >>> ' + this.$store.state.tradeNum);
      this.$http.post('/wuzhu/payment/getPayResult', params).then(res => {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        console.log('getPayResult success >>> ' + JSON.stringify(res));
        that.loaded = true;
        if (res.data && res.data.msg === 'ok') {
          console.log('支付成功');
          that.payResult = '支付成功';
          that.payImg = './static/images/Pay/success@1x.png';
        } else {
          console.log('支付失败');
          that.payResult = '您的订单支付失败，为避免影响订单状态请尽快重新支付';
        }
      });
    },
    menuButtonClick(menuTtem) {
      if (menuTtem === '返回首页') {
        goHome(this);
        // this.$router.replace({name: 'HomePage'})
      } else if (menuTtem === '查看订单') {
        this.$router.replace({name: 'OrderListPage'})
      } else {
        // Do Nothing
      }
    }
  }
};
</script>

<style lang="less">
.WXPaySuccess {
  background: #f5f5f5;
}

.vux-header {
  background: #fff !important;
  border-bottom: 1px solid #eeeeee;
  .vux-header-title {
    color: #3c3c5e !important;
  }
  .vux-header-left {
    a {
      color: #3c3c5e !important;
    }

    .left-arrow:before {
      border: 1px solid #64647e !important;
      border-width: 2px 0 0 2px !important;
      -webkit-transform: rotate(315deg);
      transform: rotate(315deg);
      top: 8px;
      left: 7px;
    }
  }
}

.box-paySuccess {
  margin-top: 105px;
  text-align: center;
}

.box-payDesc {
  margin-top: 30px;
  margin-left: 18px;
  margin-right: 18px;
  color: #333333;
  font-size: 14px;
  text-align: center;
}

.box-toOrder {
  margin: 18px;
  display: flex;
  .weui-btn + .weui-btn {
    margin-top: 0;
  }
  button.weui-btn {
    width: 40%;
  }
}

.button-toOrder {
  color: black !important;
  font-size: 18px !important;
}
</style>
