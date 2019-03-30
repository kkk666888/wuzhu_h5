<template>
  <div id="buyout">
    <div class="buyout-content" v-show="commodityInfo">
      <div class="header bg-white">
        <img class="header-img" :src="buyoutProductInfo.commodityUrl" alt="">
        <div class="header-right">
          <div class="header-title">{{buyoutProductInfo.commodityShortName}}</div>
          <div class="header-des f12 gray">市场价：￥{{commodityInfo.marketPrice | moneyFormat}}</div>
          <div class="header-tag f12" >
            <span class="tag gb-gray" v-for="(item, index) in commodityCategory" :key="index">{{item}}</span>
          </div>
        </div>
      </div>
      <section class="mt18 bg-white">
        <div class="item lh22 f14 gray">
          <span class="item-left">买断价</span>
          <span class="item-right">￥{{commodityInfo.buyOutPrice | moneyFormat}}</span>
        </div>
        <div class="item lh22 mt10 f14 gray pb15">
          <span class="item-left">累计支付租金</span>
          <span class="item-right">￥{{commodityInfo.paidRentAmt | moneyFormat}} </span>
        </div>
        <div class="item lh22 f16 pb15 bbt">
          <span class="item-left mt10">需补交买断金</span>
          <span class="item-right mt10">￥{{commodityInfo.buyoutAmt | moneyFormat}}</span>
        </div>
        <!-- <div class="item lh28 gray pt8">
          <span class="item-left">本款买断系数</span>
          <span class="item-right">{{commodityInfo.buyOutRadio}}%</span>
        </div>
        <div class="item lh28 gray pb15">
          <span class="item-left">买断价格说明</span>
          <span class="item-right">{{commodityInfo.buyOutDescrpition}}</span>
        </div> -->
      </section>
      <section class="mt18 bg-white pt12" v-show="commodityInfo.buyoutFeeInfoList && commodityInfo.buyoutFeeInfoList.length > 0">
        <div v-for="(item, index) in commodityInfo.buyoutFeeInfoList" :key="index">
          <div class="item lh28 gray f14">
            <span class="item-left">{{item.feeName}}</span>
            <span class="item-right">￥{{item.feeAmt | moneyFormat}}</span>
          </div>
        </div>
        <!-- <div class="item lh28 gray pb8 bb1">
          <span class="item-left">违约金</span>
          <span class="item-right">￥{{commodityInfo.breachAmt | moneyFormat}}</span>
        </div> -->
        <div class="item h48 bbt">
          <span class="item-left f16 l-h48">小计</span>
          <span class="item-right f16 l-h48">￥{{commodityInfo.totalFeeInfoAmt | moneyFormat}}</span>
        </div>
      </section>
      <!-- <section class="mt18 bg-white pt12">
        <div class="item lh28 gray pb12">
          <span class="item-left">商品原押金</span>
          <span class="item-right">￥{{commodityInfo.productDepositAmt | moneyFormat}}</span>
        </div>
        <div class="item lh28 gray pb12">
          <span class="item-left">信用免押</span>
          <span class="item-right">￥{{commodityInfo.creditDepositAmt | moneyFormat}}</span>
        </div>
        <div class="item lh22 f16 pb15">
          <span class="item-left">已支付押金</span>
          <span class="item-right">￥{{commodityInfo.actualPayDepositAmt | moneyFormat}}</span>
        </div>
      </section> -->
      <section class="mt18 bg-white">
        <div class="item mt10 f14 l-h22 gray" v-if="commodityInfo.cashDeductionAmt">
          <span class="item-left">个人账户抵扣</span>
          <span class="item-right gray">-￥{{commodityInfo.cashDeductionAmt | moneyFormat}}</span>
        </div>
        <div class="item mt10 f14 l-h22 gray" v-if="commodityInfo.cashOffsetAmt">
          <span class="item-left">物主卡抵扣</span>
          <span class="item-right gray">-￥{{commodityInfo.cashOffsetAmt | moneyFormat}}</span>
        </div>
        <div class="item mt10 f14 l-h22 gray" v-if="commodityInfo.depositDeductionAmt">
          <span class="item-left">押金抵扣</span>
          <span class="item-right gray">-￥{{commodityInfo.depositDeductionAmt | moneyFormat}}</span>
        </div>
        <div :class="finalAmtClass">
          <span class="item-left f16 mt10">实际应付</span>
          <span class="item-right red f16 mt10">￥{{commodityInfo.finalActualPayAmt | moneyFormat}}</span>
        </div>
      </section>
    </div>
    <div class="ml15 mt20 mr15 btn-wrapper p-r">
      <img class="icon-checked" src="./icon_xuanze@3x.png" alt="" width="18" height="18">
      <div class=" protocol-checked">点击支付订单即代表已同意<span @click="protocolClick" class="blue">《用户租赁及服务协议之买断协议》</span></div>
      <div class="btn mt20 pb15">
        <x-button type="primary" @click.native="goNext">去支付</x-button>
      </div>
    </div>
    <html-pannel :showScrollBox="potocolShow" :protocolTitle="potocolTitle" :url="potocolUrl" @sureBtnClick="potocolSureClick"></html-pannel>
  </div>
</template>
<script type="text/ecmascript-6">
  import { XButton } from 'vux'
  import htmlPannel from './../FeeItemSubView/HtmlPannel'
  export default {
    data() {
      return {
        orderNo: this.$store.state.orderNo,
        potocolTitle: '用户租赁及服务协议之买断协议',
        potocolContent: '',
        potocolShow: false, // 显示协议
        potocolUrl: '',
        commodityInfo: {},
        buyoutProductInfo: {},
        commodityCategory: [],
        isFinish: false,
        finalAmtClass: 'item l-h22 pb15'
      }
    },
    created() {
      let currentPath = window.location.href.split('/dist')[0];
      this.potocolUrl = currentPath + '/doc/wx/user_lease_buy_out_agreement.htm';
//      this.potocolUrl = 'https://wuzhutes.woozhu.cn/doc/wx/user_lease_buy_out_agreement.htm';
      this.getOrderInfo()
    },
    methods: {
      getOrderInfo() {
        let that = this
        let params = {
          orderNo: this.orderNo
        }
        that.$http.get('/wuzhu/order/buyOut/calculate/V2', params).then(res => {
          if (res.code === '00') {
            that.commodityInfo = res.data
            if (that.commodityInfo &&
              (that.commodityInfo.cashDeductionAmt ||
                that.commodityInfo.cashOffsetAmt ||
                that.commodityInfo.depositDeductionAmt)) {
              that.finalAmtClass = 'item l-h22 pb15 mt10 bbt';
            }
            that.buyoutProductInfo = res.data.buyoutProductInfo
            that.commodityCategory = that.buyoutProductInfo && that.buyoutProductInfo.commodityCategory.split(',')
            if (res.data.isFinish === 'Y') {
              that.isFinish = true // 去支付成功页面
            } else {
              that.isFinish = false
            }
          } else {
            that.$vux.alert.show({
              title: '',
              content: res.msg
            });
          }
        })
      },
      goNext() {
        this.$store.commit('updateLoadingStatus', { isLoading: true });
        if (this.isFinish) { // 支付金额为0,调用主动买断
          this.goBuyOut()
        } else {
          this.goPay()
        }
      },
      goBuyOut() {
        let that = this
        let params = {
          orderNo: this.orderNo,
          buyOutType: this.buyoutProductInfo.buyOutType
        }
        that.$http.post('/wuzhu/order/buyOut/settlte', params).then(res => {
          this.$store.commit('updateLoadingStatus', { isLoading: false });
          if (res.code === '00') {
            this.goSussussPay()
          } else {
            that.$vux.alert.show({
              title: '',
              content: res.msg
            });
          }
        })
      },
      goSussussPay() {
        let params = {
          'code': '1'
        }
        this.$router.push({name: 'WXPaySuccess', params: params})
      },
      goPay() {
        // this.$store.commit('updateOrderNo', {orderNo: this.orderNo})
        this.$store.commit('payStyleMemory', { payStyle: '4' })
        this.$store.commit('updatePayAmount', { payAmount: this.commodityInfo.finalActualPayAmt })
        this.$store.commit('updateCashOffsetAmt', {cashOffsetAmt: this.commodityInfo.cashOffsetAmt})
        this.$store.commit('updateDeductionAmount', {deductionAmount: this.commodityInfo.cashDeductionAmt})
        this.$store.commit('updateRouteSource', {routeSource: 'Buyout'})
        this.$router.push({name: 'WXPayCashing'})
      },
      protocolClick() {
        location.href = this.potocolUrl;
        // this.potocolShow = true;
      },
      potocolSureClick() {
        console.log('>>> 确认协议的按钮被点击');
        this.potocolShow = false;
      }
    },
    components: {
      XButton,
      htmlPannel
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import './../../common/less/index';
  #buyout{
    height:100%;
    color: #111;
    font-size: 14px;
    section{
      padding: 15px 0 0 15px;
      .bb1{
        .border-1px(#ddd);
        }
        .item{
          display: flex;
          justify-content: space-between;
        .item-right{
          margin-right: 15px;
        }
      }
    }
    .weui-btn_primary{
      background-color: #FFDA29;
    }
    .f12{
      font-size: 12px;
    }
    .f16{
      font-size: 16px;
    }
    .lh22{
      line-height: 22px;
    }
    .lh28{
      line-height: 28px;
    }
    .mt18{
      margin-top: 18px;
    }
    .mt10{
      margin-top: 10px;
    }
    .ml15{
      margin-left: 15px;
    }
    .mt20{
      margin-top: 20px;
    }
    .mr15{
      margin-right: 15px;
    }
    .pt8{
      padding-top: 8px;
    }
    .pt12{
      padding-top: 12px;
    }
    .pb8{
      padding-bottom: 8px;
    }
    .pb12{
      padding-bottom: 12px;
    }
    .pb15{
      padding-bottom: 15px;
    }
    .h48{
      height: 48px;
    }
    .l-h22{
      line-height: 22px;
    }
    .l-h48{
      line-height: 48px;
    }
    .gray{
      color: #888;
    }
    .red{
      color: #FF4854;
    }
    .blue{
      color:#299AEB;
    }
    .bg-white{
      background: #fff;
    }
    .p-r{
      position: relative;
    }
    .bbt{
      border-top: 1px solid #dddddd;
    }
    .header{
      display: flex;
      padding: 15px;
      .header-img{
        flex: 0 0 90px;
        display: inline-block;
        width:90px;
        height:90px;
        /*border: 1px solid #ddd;*/
      }
      .header-right{
        flex: 1;
        line-height: 20px;
        margin-left: 12px;
        .header-title{
          min-height: 40px;
        }
        .header-des{
          line-height: 17px;
        }
        .header-tag{
          height: 28px;
          overflow: hidden;
        }
        .gb-gray{
          display: inline-block;
          padding: 0 13px;
          line-height: 22px;
          margin-right: 8px;
          margin-top: 6px;
          border-radius: 4px;
          background: #F5F5F5;
        }
      }
    }
    .btn-wrapper{
      .protocol-checked{
        display: inline-block;
        vertical-align: bottom;
        line-height: 20px;
        margin-left: 25px;
        font-size: 14px;
      }
      .icon-checked{
        position: absolute;
        top: 2px;
        display: inline-block;
        content: '';
        background-image: url('./icon_xuanze@3x.png');
        background-size: contain;
        background-repeat: no-repeat;
      }
    }
  }
</style>
