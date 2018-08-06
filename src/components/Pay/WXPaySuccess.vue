<template>
  <div class="WXPaySuccess">

     <div class="box-paySuccess">
      <img style="width: 80px; height: 80px;" :srcset="payImg">
     </div>

     <div class="box-payDesc">{{ payResult }}</div>

     <div v-show="loaded" class="box-toOrder">
     	<x-button :link="{path: '/OrderList/OrderListPage'}" class="button-toOrder" text="查看订单" :gradients="['#FFDA29', '#FFDA29']"></x-button>
     </div>

  </div>
</template>

<script>
	import { XHeader, Msg, XButton } from 'vux'
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
         payTimeDelay: 10 * 1000,    // 延迟10s获取状态
         orderStatus: {
          bizStatusNo1: '1',    // 待确认、待还款
          bizStatusNo2: '2',    // 待支付
          bizStatusNo3: '3',    // 已支付、已还清
          bizStatusNo4: '4',    // 已取消、逾期
          bizStatusNo5: '5',    // 待发货
          bizStatusNo6: '6',    // 已发货
          bizStatusNo7: '7',    // 租赁中
          bizStatusNo8: '8',    // 即将到期
          bizStatusNo9: '99'    // 已完成
         }
      }
    },
    mounted() {
      console.log('mounted')
      this.getOrderDetailBefore()
    },
    methods: {
      getOrderDetailBefore() {
        let that = this
        if (that.$route.params && that.$route.params.code === '1') {
          console.log('全部使用积分抵扣，无需调起支付')
          that.loaded = true
          that.payResult = '支付成功'
          that.payImg = './static/images/Pay/success@1x.png'
        } else {
          this.$store.commit('updateLoadingStatus', { isLoading: true })
          setTimeout(function() {
            that.getPayResult()
          }, that.payTimeDelay)
        }
      },
      getPayResult() {
        let that = this
        console.log('getPayResult')
        let params = {
          'payChannel': this.$store.state.payChannel,
          'payNumer': this.$store.state.tradeNum
        }
        console.log('WXPaySuccess payChannel >>> ' + (this.$store.state.payChannel + 1))
        console.log('WXPaySuccess payNumer >>> ' + (this.$store.state.tradeNum))
        this.$http.post('/wuzhu/payment/getPayResult', params).then(res => {
        this.$store.commit('updateLoadingStatus', { isLoading: false })
          console.log('getPayResult success >>> ' + JSON.stringify(res))
          that.loaded = true
          if (res.data && res.data.msg === 'ok') {
            console.log('支付成功')
            that.payResult = '支付成功'
            that.payImg = './static/images/Pay/success@1x.png'
          } else {
            console.log('支付失败')
            that.payResult = '您的订单支付失败，为避免影响订单状态请尽快重新支付'
          }
        })
      }
    }
  }
</script>

<style lang="less">

.WXPaySuccess {
  background: #f5f5f5;
}

.vux-header{
background: #fff !important;
border-bottom: 1px solid #EEEEEE;
.vux-header-title{
	color: #3C3C5E !important;
}
.vux-header-left {
  a{
    color: #3C3C5E !important;
  }

  .left-arrow:before{
    border: 1px solid #64647E !important;
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
  font-size: 18px;
  text-align: center;
}

.box-toOrder {
	margin: 18px;
}

.button-toOrder {
	color: black !important;
  font-size: 18px !important;
}


</style>
