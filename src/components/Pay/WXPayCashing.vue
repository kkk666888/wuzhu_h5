<template>
  <div class="wx-pay-cashing">
    <div class="d-content">
      <section>
        <div v-show="countTime.showCountTime" class="count-down">
          <div>
            <div class="box-pay-time">支付剩余时间</div>
            <div class="remaining-time">
              <span class="order-time-number">{{ orderDetail.restPayTime.charAt(0) }}</span>
              <span class="order-time-number">{{ orderDetail.restPayTime.charAt(1) }}</span>
              <span class="order-time-char">{{ orderDetail.restPayTime.charAt(2) }}</span>
              <span class="order-time-number">{{ orderDetail.restPayTime.charAt(3) }}</span>
              <span class="order-time-number">{{ orderDetail.restPayTime.charAt(4) }}</span>
              <span class="order-time-char">{{ orderDetail.restPayTime.charAt(5) }}</span>
              <span class="order-time-number">{{ orderDetail.restPayTime.charAt(6) }}</span>
              <span class="order-time-number">{{ orderDetail.restPayTime.charAt(7) }}</span>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div :class="{boxGoodsInfo: countTime.showCountTime}">
          <div class="goods-info">
            <div class="goods-img">
              <img :src="orderDetail.listImg">
            </div>
            <div class="goods-details">
              <div class="f15">
                <span v-for="(item,index) in orderDetail.shortName.split(',')" :key="index">
                  {{ item }}
                </span>
              </div>
              <div class="payment-amount">
                <span>支付金额：</span>
                <span class="payment-price">¥{{ orderDetail.payAmount }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section v-show="paymentChannelShow.showPaymentChannel">
        <div class="payment-mode" v-for="(item, index) in paymentChannel" :key="index">
          <div @click="clickRadio(index, item)">
            <div class="pay-left">
              <div class="pay-left-img">
                <img class="class-pay-icon" :srcset="item.channelIconUrl">
              </div>
              <div class="pay-left-info clearfix">
                <div>
                  <div class="info-head">{{ item.channelDesc }}</div>
                  <!-- 微信支付 -->
                  <div class="info-details f13">由{{ item.channelDesc }}提供服务</div>
                </div>
              </div>
            </div>
            <div class="pay-right">
              <div class="fs-checkbox-div" :key="index">
                <input class="fs-checkbox" type="radio" :id="index" :name="index" :value="index" v-model="payIndex">
                <label :for="index">
                  <span></span>
                </label>
              </div>
            </div>
          </div>

        </div>
      </section>
      <section>
        <div class="confirm-pay">
          <x-button @click.native="confirmPay" class="f16">
            确认支付
          </x-button>
        </div>
        <toast v-model="toastData.toastShow" type="text" width="20em">{{ toastData.toastInfoMessage }}</toast>
      </section>
    </div>
    <div class="form-jd">
      <form class="jdForm" name="jdForm" method="post" action="https://h5pay.jd.com/jdpay/saveOrder" id="jsBatchForm">
        <input name="version" id="version" v-bind:value="version" /><br />
        <input name="merchant" id="merchant" v-bind:value="merchant" /><br />
        <input name="tradeNum" id="tradeNum" v-bind:value="tradeNum" /><br />
        <input name="tradeName" id="tradeName" v-bind:value="tradeName" /><br />
        <input name="tradeTime" id="tradeTime" v-bind:value="tradeTime" /><br />
        <input name="amount" id="amount" v-bind:value="amount" /><br />
        <input name="currency" id="currency" v-bind:value="currency" /><br />
        <input name="callbackUrl" id="callbackUrl" v-bind:value="callbackUrl" /><br />
        <input name="notifyUrl" id="notifyUrl" v-bind:value="notifyUrl" /><br />
        <input name="ip" id="ip" v-bind:value="ip" /><br />
        <input name="userId" id="userId" v-bind:value="userId" /><br />
        <input name="orderType" id="orderType" v-bind:value="orderType" /><br />
        <input name="sign" id="sign" v-bind:value="sign" /><br />
        <input type="submit" class="sumbit" value="Submit" debounce="5000" v-on:click="submit()">
      </form>
    </div>

    <form class="jdForm2" action="https://h5pay.jd.com/jdpay/saveOrder" method="post" id="batchForm">
      <input type="hidden" name="version" value="V2.0"><br />
      <input type="hidden" name="merchant" value="22294531"><br />
      <input type="hidden" name="device" value="b6d677010345d509"><br />
      <input type="hidden" name="tradeNum" value="1ac2f87b5d8498245e38f02200456fcd83f3def4b2952113"><br />
      <input type="hidden" name="tradeName" value="e41941e6a89ae685150b2bc999c842a1"><br />
      <input type="hidden" name="tradeDesc" value="dd762e2dc91f21fb9398efd83243b1f6"><br />
      <input type="hidden" name="tradeTime" value="c33390d9b3d6d66934097539d48de0e30ebec249b25c0c97"><br />
      <input type="hidden" name="amount" value="e5a6c3761ab9ddaf"><br />
      <input type="hidden" name="currency" value="ac7132c57f10d3ce"><br />
      <input type="hidden" name="note" value="5b8119fe85e1f5ba93648010c439bcb6"><br />
      <input type="hidden" name="callbackUrl" value="71534b75767a05bd0ab7c5eabc46b814134634cb3dc1036447bebce43f4071c72fe8b358600d19ff"><br />
      <input type="hidden" name="notifyUrl" value="93265ab8dd34865b0ab7c5eabc46b814134634cb3dc103648f6c6a80b33425bd614b9bfe408b2c178a3e003acf4d952b"><br />
      <input type="hidden" name="ip" value="79e743fa2554aa335d67d8945150806e91f40c36ea9df504"><br />
      <input type="hidden" name="orderType" value="e5a6c3761ab9ddaf"><br />
      <input type="hidden" name="sign" value="pVyQewiCK4FBQAoc0DyHEs6eI8H06ftil7L+OkiPUFcyO8EmhCcet0MLkPDf7kw8tysyvNBD1Xhi
wRi1wXVhGWRV+KqmpwGMUKk2F4GNNp6Ja8oXj7xk8pQ/JvvCmN7MB+XmHi1JX2k8Jothnb6kkeZx
D3Hg82xaS0h7tYwUvJ8="><br />
      <input type="submit" class="sumbit" value="Submit2">
    </form>

    <!-- 微信h5支付回调弹窗 -->
    <actionsheet v-model="payBackVisible" :close-on-clicking-mask="false" :menus="payBackMenus" theme="android" @on-click-menu="payBackClick">
    </actionsheet>
  </div>
</template>

<script type="text/ecmascript-6">
import { XButton, Toast, Actionsheet } from 'vux';
import Config from './../../util/config';
import { isWeiXin, getRequest } from './../../util/utils';
export default {
  name: 'WXPayCashing',
  data() {
    return {
      payIndex: 0,
      cashOffsetAmt: '0', // 物主卡抵扣
      deductionAmount: '0', // 账户抵扣
      payStyle: this.$store.state.payStyle, // 支付首付或账单支付
      orderNo: '', // 订单号
      orderStatus: '', // 订单状态
      isOutOfTime: false,
      payDesc: '',
      price: '139.00',
      payType: '1', // 1:微信(默认值),2:京东
      remainingTime: '',
      version: 'V2.0',
      merchant: '22294531', // 测试商户号
      tradeNum: '',
      tradeName: '商品描述',
      tradeTime: '20180421101432',
      amount: '',
      currency: 'CNY', // 人民币
      callbackUrl: Config.jdUrl + '#/Pay/WXPaySuccess?',
      notifyUrl: '', // 通知后台
      ip: '',
      expireTime: '',
      orderType: '1',
      sign: '',
      cert: '',
      payMerchant: '',
      tradeType: '',
      riskInfo: '',
      userId: '',
      specCardNo: '',
      specId: '',
      specName: '',
      orderGoodsNum: '',
      vendorId: '',
      receiverInfo: '',
      termInfo: '',
      payChannel: '',
      goodsInfo: '',
      paymentChannel: [],
      paymentChannelJD: [
        {
          paymentChannelNo: '',
          channelMerchantNo: '',
          channelName: '',
          channelStatus: '',
          channelDesc: '',
          remark: '',
          createdTime: '',
          updatedTime: '',
          channelIconUrl: '',
          withholdChannelNo: '',
          limitAmtDesc: ''
        }
      ],
      orderDetail: {
        orderNo: '',
        restPayTime: '',
        listImg: 'static/images/loading.png',
        shortName: '',
        payAmount: ''
      },
      wxPayData: {
        nonce_str: '',
        code_url: '',
        appid: '',
        sign: '',
        trade_type: '',
        return_msg: '',
        result_code: '',
        mch_id: '',
        return_code: '',
        prepay_id: ''
      },
      toastData: {
        toastShow: false,
        toastInfoMessage: '支付超时'
      },
      signChannel: {
        jdWithholdChannelNo: 2, // 京东支付渠道
        wxWithholdChannelNo: 1 // 微信支付渠道
      },
      paymentChannelNo: {
        wxPaymentChannelNo: '1', // 微信支付
        jdPaymentChannelNo: '2' // 京东支付
      },
      wxFromWXSigned: {
        channelOK: false,
        orderDetailOK: false
      },
      countTime: {
        showCountTime: true
      },
      paymentChannelShow: {
        showPaymentChannel: true
      },
      payBackVisible: false, // h5支付完成确认弹窗
      payBackMenus: [
        {
          label: '请确认微信支付是否已完成',
          type: 'disabled',
          value: 1
        },
        {
          label: '已完成支付',
          type: 'warn',
          value: 2
        },
        {
          label: '支付遇到问题，重新支付',
          value: 3
        }
      ]
    };
  },
  created() {
    this.showCountTime();
    this.showPayChannel();
  },
  mounted() {
    console.log('mounted');
    // 微信h5支付完成跳回来
    const payType = getRequest('fromPayType');
    console.log('paytype', payType);
    if (payType === 'WXH5') {
      console.log('wxh5');
      this.payBackVisible = true;
    } else {
      this.initPayData();
    }
  },
  methods: {
    // 初始化数据
    initPayData() {
      this.orderDetail.orderNo = this.$store.state.orderNo;
      this.orderDetail.payAmount = parseInt(this.$store.state.payAmount * 100 + 0.5) / 100;
      this.amount = parseInt(this.$store.state.payAmount * 100 + 0.5) + ''; // 先将元转成分，在将分转成字串
      this.cashOffsetAmt = parseInt(this.$store.state.cashOffsetAmt * 100 + 0.5) + '';
      this.deductionAmount = parseInt(this.$store.state.deductionAmount * 100 + 0.5) + '';
      if (!this.checkIsFromSigned()) {
        // 代扣签约完成自动跳转支付
        this.$store.commit('updateLoadingStatus', { isLoading: true });
        console.log('not from JD');
        this.getPaymentChannels();
        this.getOrderDetail(this.orderDetail.orderNo);
      } else {
        console.log('from signed');
        this.payType = this.$store.state.payChannel;
        if (this.checkFromWXSign()) {
          switch (this.payType) {
            case this.paymentChannelNo.wxPaymentChannelNo:
              this.getPaymentChannels();
              this.getOrderDetail(this.orderDetail.orderNo);
              break;
            case this.paymentChannelNo.jdPaymentChannelNo:
              this.getPaymentChannels();
              break;
          }
          if (this.payType === this.paymentChannelNo.wxPaymentChannelNo) {
            // 微信支付
          } else if (this.payType === this.paymentChannelNo.jdPaymentChannelNo) {
            // 京东支付
            this.getPaymentChannels();
          }
        } else if (this.checkFromJDSign()) {
          this.getPaymentChannels();
        }
      }
    },
    showCountTime() {
      let routeSource = this.$store.state.routeSource;
      console.log('routeSource === ' + routeSource);
      if (routeSource === 'WXPayOverpaying' || routeSource === 'Buyout' || routeSource === 'reletConfirmOrder') {
        this.countTime.showCountTime = false;
      } else {
        this.countTime.showCountTime = true;
      }
      console.log('showCountTime >>> ' + this.countTime.showCountTime);
    },
    showPayChannel() {
      this.paymentChannelShow.showPaymentChannel = !(
        this.$store.state.routeSource === 'Buyout' && parseInt(this.$store.state.payAmount * 100 + 0.5) <= 0
      );
      console.log('showPayChannel >>> ' + this.paymentChannelShow.showPaymentChannel);
    },
    // 获取微信支付数据
    getWXPayData() {
      let params = {
        amount: this.amount,
        cashOffsetAmt: this.cashOffsetAmt,
        deduction_amount: this.deductionAmount,
        body: this.orderDetail.shortName,
        orderNo: this.orderDetail.orderNo,
        wechatOpenId: this.$store.state.wxOpenID,
        transNote: this.$store.state.routeSource === 'reletConfirmOrder' ? JSON.stringify(this.$route.params) : '', // 续租需要传订单相关字段到后台完成订单再创建
        payType: this.$store.state.payStyle
      };
      // 不是微信环境使用微信h5支付
      if (!isWeiXin()) {
        params['tradeType'] = 'MWEB';
      }

      this.$store.commit('updateLoadingStatus', { isLoading: true });
      this.$http.post('/wuzhu/payment/wxpay/doUnifiedOrder', params).then(res => {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        console.log('doUnifiedOrder success >>> ' + JSON.stringify(res));
        if (res.code === '00') {
          console.log('doUnifiedOrder success >>> ' + JSON.stringify(res));
          this.wxPayData = res.data;
          this.$store.commit('updateTradeNum', { tradeNum: res.data.paytradenum });
          if (!isWeiXin()) {
            // 使用微信h5支付
            this.WXPayWithH5();
          } else {
            // 使用微信公众号支付
            this.checkWXJSBridgeAndPay();
          }
        } else if (res.code === '1') {
          // 判断服务器返回特征数据，是否调起微信支付
          let params = {
            code: res.code
          };
          this.$router.replace({ name: 'WXPaySuccess', params: params });
        } else {
          if (res.msg) {
            this.$vux.alert.show({
              content: res.msg
            });
          }
        }
      });
    },
    getWXSignUrl() {
      let params = {
        buyer_info: '',
        order_no: this.orderDetail.orderNo,
        return_url: window.location.href.split('?')[0] + '#/Pay/WXPayCashing',
        platformCode: this.$store.state.platformCode
      };
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      this.$http.post('/wuzhu/payment/wxpay/getAgreementSignUrl', params).then(res => {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        if (res.code === '00') {
          console.log('getAgreementSignUrl success ===> ' + JSON.stringify(res));
          let signUrl = res.data;
          if (signUrl) {
            window.location.href = signUrl;
          } else {
            console.log('微信签约url为空');
          }
        } else {
          console.log('getAgreementSignUrl error ===> ' + JSON.stringify(res));
        }
      });
    },
    clickRadio(index, item) {
      this.payIndex = index;
      this.payType = item.paymentChannelNo;
      console.log('payType === ' + this.payType);
    },
    // 检测是否来源于JD签约
    checkFromJDSign() {
      console.log('checkFromJDSign');
      let url = location.href;
      let jdDataSignLabel = [
        '/Pay/WXPayCashing?',
        'signType',
        'requestDatetime',
        'outTradeNo',
        'signData',
        'agreementNo'
      ];
      let isFromJDSign = true;
      jdDataSignLabel.forEach(function(item) {
        if (url.indexOf(item) === -1) {
          isFromJDSign = false;
        }
      });
      return isFromJDSign;
    },
    checkFromWXSign() {
      console.log('checkFromWXSign');
      let url = location.href;
      let wxDataSignLabel = ['from_wxpay=1'];
      let isFromWXSign = true;
      wxDataSignLabel.forEach(function(item) {
        if (url.indexOf(item) === -1) {
          isFromWXSign = false;
        }
      });
      return isFromWXSign;
    },
    checkIsFromSigned() {
      if (this.checkFromJDSign() || this.checkFromWXSign()) {
        return true;
      } else {
        return false;
      }
    },
    getPaymentChannels() {
      let platform = this.$store.state.platformCode;
      console.log('getPaymentChannels platform === ' + platform);
      let params = {
        channelNo: this.$store.state.channelNo,
        platformCode: platform // 客户端平台
      };
      console.log('getPaymentChannels >>> channelNo === ' + this.$store.state.channelNo);
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      this.$http.get('/wuzhu/channel/getPaymentChannels', params).then(res => {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        if (res.code === '00' && res.data) {
          console.log('getPaymentChannels success');
          let channelNo = this.$store.state.channelNo;
          console.log('channelNo === ' + channelNo);
          this.paymentChannel = res.data;
          if (!this.checkIsFromSigned()) {
            this.payType = this.paymentChannel[0].paymentChannelNo;
          }
          for (let i = 0; i < this.paymentChannel.length; i++) {
            switch (this.paymentChannel[i].paymentChannelNo) {
              case '1':
                this.paymentChannel[i].channelIconUrl =
                  './static/images/Pay/wx_icon@1x.png 1x, ./static/images/Pay/wx_icon@1.5x.png 1.5x';
                console.log('weixin icon === ' + this.paymentChannel[i].channelIconUrl);
                break;
              case '2':
                this.paymentChannel[i].channelIconUrl =
                  './static/images/Pay/jd_icon@1x.png 1x, ./static/images/Pay/jd_icon@1.5x.png 1.5x';
                console.log('jd icon === ' + this.paymentChannel[i].channelIconUrl);
                break;
            }
          }
          // 签约完成调起支付流程
          if (this.checkFromJDSign()) {
            this.checkIsTrading();
          } else if (this.checkFromWXSign() && this.payType === this.paymentChannelNo.wxPaymentChannelNo) {
            this.wxFromWXSigned.channelOK = true;
            if (this.wxFromWXSigned.orderDetailOK) {
              this.checkIsTrading();
            }
          } else if (this.checkFromWXSign() && this.payType === this.paymentChannelNo.jdPaymentChannelNo) {
            this.checkIsTrading();
          }
        } else {
          console.log('getPaymentChannels failed');
        }
      });
    },
    getOrderDetail(orderNo) {
      console.log('getOrderDetail');
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      this.$http.get('/wuzhu/order/getOrderDetail?orderNo=' + orderNo).then(res => {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        if (res.code === '00') {
          console.log('getOrderDetail success');
          this.orderDetail.listImg = res.data.commodity.listImg;
          this.orderDetail.shortName = res.data.commodity.shortName;
          this.orderDetail.firstActualPay = res.data.firstActualPay;
          // 京东支付部分字段
          this.tradeName = this.orderDetail.shortName;
          this.tradeTime = this.getOrderTime(res.data.createDate);
          this.countDown(parseInt(res.data.restPayTime / 1000));
          if (this.checkFromWXSign()) {
            this.wxFromWXSigned.orderDetailOK = true;
            if (this.wxFromWXSigned.channelOK) {
              this.checkIsTrading();
            }
          }
        } else {
          console.log('getOrderDetail failed, code === ' + res.code + ', msg === ' + res.msg);
          alert(res.msg);
        }
      });
    },
    // 输入格式：2018-05-22 10:47:04
    // 输出格式：20180522104704
    getOrderTime(time) {
      let result = '20180522104704';
      if (time.length && time.length > 0) {
        result = '';
        let timeStrSub = time.split(' ');
        let timeDay = timeStrSub[0];
        let timeSecond = timeStrSub[1];
        let timeDaySub = timeDay.split('-');
        let timeSecondSub = timeSecond.split(':');
        for (let sub1 of timeDaySub) {
          result = result + sub1;
        }
        for (let sub2 of timeSecondSub) {
          result = result + sub2;
        }
      }
      return result;
    },
    postJD() {
      console.log('postJD');
      document.getElementById('jsBatchForm').submit();
    },
    autosubmit() {
      console.log('autosubmit');
      document.getElementById('jsBatchForm').submit();
    },
    // 确认支付
    confirmPay() {
      console.log('>>> confirmPay payType === ' + this.payType);
      console.log('paymentchannelno === ', this.paymentChannelNo);
      if (this.isOutOfTime && this.countTime.showCountTime) {
        this.toastData.toastShow = true;
        return;
      }
      this.$store.commit('updatePayChannel', { payChannel: this.payType });
      console.log('>>> confirmPay payStyle === ' + this.$store.state.payStyle);
      if (this.$store.state.payStyle === '4') {
        // 买断不需要签约
        switch (this.payType) {
          case this.paymentChannelNo.wxPaymentChannelNo:
            this.getWXPayData();
            break;
          case this.paymentChannelNo.jdPaymentChannelNo:
            this.jdPaySign();
            break;
        }
      } else {
        switch (this.payType) {
          case this.paymentChannelNo.wxPaymentChannelNo:
            this.goWXPay();
            break;
          case this.paymentChannelNo.jdPaymentChannelNo:
            this.goJDPay();
            break;
        }
      }
      // 测试微信签约
      // this.getWXSignUrl()
    },
    getChannelIndex() {
      for (let index = 0; index < this.paymentChannel.length; index++) {
        if (this.payType === this.paymentChannel[index].paymentChannelNo) {
          return index;
        }
      }
      return 0;
    },
    // 京东支付
    goJDPay() {
      console.log('京东支付');
      // 查看代扣渠道
      let index = this.getChannelIndex();
      if (this.paymentChannel[index].withholdChannelNo === this.signChannel.jdWithholdChannelNo) {
        console.log('京东支付 >>>已配置京东支付代扣渠道 >>>京东代扣渠道检查...');
        this.jdPayAgreementCheck();
      } else if (this.paymentChannel[index].withholdChannelNo === this.signChannel.wxWithholdChannelNo) {
        console.log('京东支付 >>>已配置微信支付代扣渠道 >>>微信代扣渠道检查...');
        this.wxPayAgreementCheck();
      } else {
        console.log('京东支付 >>>未配置代扣渠道 >>>调起京东支付...');
        this.jdPaySign();
      }
    },
    // 检查是否签约微信代扣,未签约走签约流程，已签约走支付流程
    wxPayAgreementCheck() {
      console.log('wxPayAgreementCheck');
      let that = this;
      let params = {
        out_trade_no: this.orderDetail.orderNo
      };
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      this.$http.post('/wuzhu/payment/weiXinPay/wxpayAgreementQuery', params).then(res => {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        if (res.code === '00' && res.data && res.data.agreement_status === 'YES') {
          console.log('已签约微信代扣');
          // 判断是否存在正在进行的支付交易
          that.checkIsTrading();
        } else {
          console.log('尚未签约微信代扣 >>>' + JSON.stringify(res));
          // 调起微信签约
          that.getWXSignUrl();
        }
      });
    },
    // 检查是否签约京东代扣,未签约走签约流程，已签约走支付流程
    jdPayAgreementCheck() {
      console.log('jdPayAgreementCheck');
      let that = this;
      let params = {
        out_trade_no: this.orderDetail.orderNo // 订单号
      };
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      this.$http.post('/wuzhu/payment/jdpay/jdpayAgreementQuery', params).then(res => {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        console.log('res === ' + JSON.stringify(res));
        if (res.data && res.data.agreement_status === 'FINI') {
          console.log('已签约京东代扣');
          // 判断是否存在正在进行的支付交易
          that.checkIsTrading();
        } else {
          console.log('尚未签约京东代扣 >>>' + JSON.stringify(res));
          this.getjdPayAgreementUrl();
        }
      });
    },
    // 检查是否有代扣中的交易或者状态未知的支付交易(签约之前)
    checkIsTrading() {
      this.wxFromWXSigned.channelOK = false;
      this.wxFromWXSigned.orderDetailOK = false;
      let index = this.getChannelIndex();
      let withholdChannelNo = this.paymentChannel[index].withholdChannelNo;
      let params = {
        channelNo: withholdChannelNo,
        login_mobile: this.$store.state.phone,
        orderNo: this.orderDetail.orderNo,
        wechatOpenId: this.$store.state.wxOpenID
      };
      let that = this;
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      this.$http.post('/wuzhu/payment/billPaymentQuery', params).then(res => {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        if (res.code === '00' && res.data && res.data.code === 'ok') {
          console.log('不存在正在进行的交易 >>> ' + JSON.stringify(res));
          console.log('payType === ' + that.payType);
          switch (that.payType) {
            case that.paymentChannelNo.wxPaymentChannelNo:
              that.getWXPayData();
              break;
            case that.paymentChannelNo.jdPaymentChannelNo:
              that.jdPaySign();
              break;
          }
        } else {
          console.log('存在正在进行的交易 >>> ' + JSON.stringify(res));
          that.$vux.alert.show({
            content: '您有处理中的支付，待系统处理后再试...'
          });
        }
      });
    },
    // 获取jd签约url
    getjdPayAgreementUrl() {
      console.log('getjdPayAgreementUrl');
      let returnUrl = Config.jdUrl + '#/Pay/WXPayCashing';
      console.log('returnUrl === ' + returnUrl);
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      this.$http
        .post('/wuzhu/payment/jdpay/getAgreementSignUrl', {
          order_no: this.orderDetail.orderNo,
          return_url: returnUrl
        })
        .then(res => {
          console.log('res === ' + JSON.stringify(res));
          this.$store.commit('updateLoadingStatus', { isLoading: false });
          if (res.code === '00') {
            console.log('获取签约url成功');
            this.jdPayAgreement(res.data);
          } else {
            console.log('获取签约url失败');
            // 调起签约
          }
        });
    },
    jdPayAgreement(url) {
      console.log('agreementUrl === ' + url);
      // window.open(url)
      window.location.href = url;
    },
    // 加密，签名并支付
    jdPaySign() {
      console.log('jdPaySign');
      // 订单相关信息
      let form = {
        amount: this.amount, // 支付金额（分）
        callbackUrl: this.callbackUrl, // 支付成功回调地址
        currency: this.currency, // 货币类型 （默认CNY,即人民币）
        ip: this.ip, // 付款ip地址
        notifyUrl: this.notifyUrl, // 支付成功通知地址，后台配置
        orderType: this.orderType, // 订单类型（1.实物，-1虚拟）
        tradeName: this.tradeName, // 商户提供的订单的标题/商品名称/关键字等
        tradeNum: this.orderDetail.orderNo, // 和姚哥约定，作为订单号传过去
        tradeTime: this.tradeTime, // 订单生成时间，格式为“yyyyMMddHHmmss”
        tradeType: this.$store.state.payStyle,
        transNote: this.$store.state.routeSource === 'reletConfirmOrder' ? JSON.stringify(this.$route.params) : '', // 续租需要传订单相关字段到后台完成订单再创建
        cashOffsetAmt: this.cashOffsetAmt,
        deduction_amount: this.deductionAmount
      };
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      this.$http.post('/wuzhu/payment/jdpay/makeTrade', form).then(res => {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        console.log('makeTrade success >>> ' + JSON.stringify(res));
        if (res.code === '00') {
          this.renderForm(res);
        } else if (res.code === '1') {
          let params = {
            code: res.code
          };
          this.$router.replace({ name: 'WXPaySuccess', params: params });
        } else {
          console.log('jdPaySigned failed');
          if (res.msg) {
            this.$vux.alert.show({
              content: res.msg
            });
          }
        }
      });
    },
    renderForm(res) {
      console.log('payTradeNum === ' + res.data.paytradenum);
      this.$store.commit('updateTradeNum', { tradeNum: res.data.paytradenum });
      this.merchant = res.data.merchant; // 不需要加密
      this.sign = res.data.sign;
      console.log('sign === ' + this.sign);
      this.tradeNum = res.data.tradeNum;
      console.log('tradeNum === ' + this.tradeNum);
      this.tradeName = res.data.tradeName;
      console.log('tradeName === ' + this.tradeName);
      this.tradeTime = res.data.tradeTime;
      console.log('tradeTime === ' + this.tradeTime);
      this.amount = res.data.amount;
      console.log('orderDetail payAmount === ' + this.amount);
      this.currency = res.data.currency;
      console.log('currency === ' + this.currency);
      this.callbackUrl = res.data.callbackUrl;
      console.log('callbackUrl === ' + this.callbackUrl);
      this.notifyUrl = res.data.notifyUrl;
      console.log('notifyUrl === ' + this.notifyUrl);
      this.ip = res.data.ip;
      console.log('ip === ' + this.ip);
      this.userId = res.data.userId;
      console.log('userId === ' + this.userId);
      this.orderType = res.data.orderType;
      console.log('orderType === ' + this.orderType);
      this.$store.commit('updateLoadingStatus', { isLoading: false });
      this.$nextTick(function() {
        console.log('sumbit');
        document.jdForm.submit();
      });
    },
    jdPay() {
      console.log('jdPay');
      let params2 = {
        version: 'V2.0',
        sign:
          'b2VNVnIK95SaZp9WbzsZFuxnhzpcFrCiF2ctTxRsjXqiTFaWZ1nyQ0k8bnoimF96kCpaumzkTKpLszY74kw+I4EsMmQ5l624slwpBjtAlRLPhzxjS1SansK2jel2oOpIEoKpHADotSxyTbH7HBbV7FsxwPsRH77v1gH3wDNu59A=',
        merchant: '22294531',
        tradeNum: 'e42c00fa75e9465e36907983ae37861ebc138aa8cb7e6053',
        vendorId: '',
        tradeName: 'e41941e6a89ae685150b2bc999c842a1',
        tradeTime: 'c33390d9b3d6d669dd4634d49ef76fb1cb8266a78b4a37ef',
        amount: 'e5a6c3761ab9ddaf',
        orderType: 'e5a6c3761ab9ddaf',
        callbackUrl: '71534b75767a05bd0ab7c5eabc46b814134634cb3dc1036447bebce43f4071c72fe8b358600d19ff',
        userId: '',
        note: '5b8119fe85e1f5ba93648010c439bcb6',
        tradeDesc: 'dd762e2dc91f21fb9398efd83243b1f6',
        industryCategoryCode: '',
        currency: 'ac7132c57f10d3ce',
        specId: '',
        specCardNo: '',
        orderGoodsNum: '',
        riskInfo: '',
        ip: '79e743fa2554aa335d67d8945150806e91f40c36ea9df504',
        expireTime: '',
        termInfo: '',
        specName: '',
        notifyUrl:
          '93265ab8dd34865b0ab7c5eabc46b814134634cb3dc103648f6c6a80b33425bd614b9bfe408b2c178a3e003acf4d952b178a3e003acf4d952b',
        payChannel: '',
        device: 'b6d677010345d509',
        goodsInfo: ''
      };
      console.log('finish post');
      this.formData(params2);
    },
    formData(params) {
      var formData = new FormData();
      formData.append('version', params.version);
      formData.append('sign', params.sign);
      formData.append('merchant', params.merchant);
      formData.append('tradeNum', params.tradeNum);
      formData.append('vendorId', params.vendorId);
      formData.append('tradeName', params.tradeName);
      formData.append('tradeTime', params.tradeTime);
      formData.append('amount', params.amount);
      formData.append('orderType', params.orderType);
      formData.append('callbackUrl', params.callbackUrl);
      formData.append('userId', params.userId);
      formData.append('note', params.note);
      formData.append('tradeDesc', params.tradeDesc);
      formData.append('industryCategoryCode', params.industryCategoryCode);
      formData.append('currency', params.currency);
      formData.append('specId', params.specId);
      formData.append('specCardNo', params.specCardNo);
      formData.append('orderGoodsNum', params.orderGoodsNum);
      formData.append('riskInfo', params.riskInfo);
      formData.append('ip', params.ip);
      formData.append('expireTime', params.expireTime);
      formData.append('termInfo', params.termInfo);
      formData.append('specName', params.specName);
      formData.append('notifyUrl', params.notifyUrl);
      formData.append('payChannel', params.payChannel);
      formData.append('device', params.device);
      formData.append('goodsInfo', params.goodsInfo);
      // JavaScript file-like 对象
      var content = '<a id="a"><b id="b">hey!</b></a>'; // 新文件的正文...
      var blob = new Blob([content], { type: 'text/xml' });
      formData.append('webmasterfile', blob);
      var request = new XMLHttpRequest();
      request.open('POST', 'https://wepay.jd.com/jdpay/saveOrder');
      request.send(formData);
    },
    // 倒计时 -- 参数 times 单位为: s
    countDown(times) {
      var that = this;
      if (times <= 0) {
        that.isOutOfTime = true;
      }
      // 每秒循环
      let timerCtrl = setInterval(function() {
        // 取消 setInterval() 循环
        if (times < 0) {
          console.log('pay timeout');
          clearInterval(timerCtrl);
          that.isOutOfTime = true;
        }
        let hour = 0;
        let minute = 0;
        let second = 0;
        if (times > 0) {
          hour = Math.floor(times / (60 * 60));
          minute = Math.floor(times / 60) - hour * 60;
          second = Math.floor(times) - hour * 60 * 60 - minute * 60;
        }
        if (hour < 10) {
          hour = '0' + hour;
        }
        if (minute < 10) {
          minute = '0' + minute;
        }
        if (second < 10) {
          second = '0' + second;
        }
        that.orderDetail.restPayTime = hour + ':' + minute + ':' + second;
        times--;
      }, 1000);
    },
    goWXPay() {
      /* eslint-disable */
      console.log('微信支付');
      let index = this.getChannelIndex();
      if (this.paymentChannel[index].withholdChannelNo === this.signChannel.jdWithholdChannelNo) {
        console.log('>>>微信支付 >>>已配置京东支付代扣渠道 >>>京东代扣渠道检查...');
        this.jdPayAgreementCheck();
      } else if (this.paymentChannel[index].withholdChannelNo === this.signChannel.wxWithholdChannelNo) {
        console.log('>>>微信支付 >>>已配置微信支付代扣渠道 >>>微信代扣渠道检查...');
        this.wxPayAgreementCheck();
      } else {
        // 执行微信支付
        console.log('>>>微信支付 >>>未配置代扣渠道 >>>调起微信支付...');
        this.getWXPayData();
      }
    },
    // 检查微信支付环境
    checkWXJSBridgeAndPay() {
      if (typeof WeixinJSBridge === 'undefined') {
        console.log('WeixinJSBridge undefined');
        if (document.addEventListener) {
          console.log('document.addEventListener');
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
          console.log('document.attachEvent');
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
        this.$store.commit('updateLoadingStatus', { isLoading: false });
      } else {
        console.log('onBridgeReady');
        this.onBridgeReady();
      }
    },
    // 调起微信公众号支付
    onBridgeReady() {
      let that = this;
      let timeStamp = parseInt(Date.parse(new Date()) / 1000) + '';
      console.log('appId === ' + this.wxPayData.appid);
      console.log('timeStamp === ' + timeStamp);
      let params = {
        appId: this.wxPayData.appid,
        timeStamp: timeStamp,
        nonceStr: this.wxPayData.nonce_str,
        package: 'prepay_id=' + this.wxPayData.prepay_id
      };
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      this.$http.post('/wuzhu/payment/wxpay/paySign', params).then(res => {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        if (res.code === '00' && res.data) {
          console.log('paySign success');
          WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            {
              appId: res.data.appId,
              timeStamp: timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType, // 微信签名方式
              paySign: res.data.paySign // 微信签名
            },
            function(res) {
              if (res.err_msg === 'get_brand_wcpay_request:ok') {
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                console.log('微信支付成功回调，但不保证绝对可靠, msg === ' + JSON.stringify(res));
                that.$router.replace({ name: 'WXPaySuccess' });
              } else {
                console.log('wxError === ' + JSON.stringify(res));
              }
            }
          );
        } else {
          console.log('paySign failed, msg === ' + JSON.stringify(res));
        }
      });
    },
    // 调起微信H5支付
    WXPayWithH5() {
      console.log('wxdata', this.wxPayData);

      const data = this.wxPayData;
      if (data.return_code === 'SUCCESS' && data.result_code === 'SUCCESS') {
        window.location.href = data.mweb_url;
      } else {
        this.$vux.alert.show({
          content: data.return_msg
        });
      }
    },
    // h5支付结束回调
    payBackClick(key, item) {
      console.log('paybackclick', item);
      if (item.value === 2) {
        this.$router.replace({ name: 'WXPaySuccess' });
      } else if (item.value === 3) {
        this.initPayData();
      }
    },
    /*
      ** randomWord 产生任意长度随机字母数字组合
      ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
      ** xuanfeng 2014-08-28
      */
    randomWord(randomFlag, min, max) {
      let str = '';
      let range = min;
      let arr = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ];
      // 随机产生
      if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
      }
      for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      return str;
    }
  },
  components: {
    XButton,
    Toast,
    Actionsheet
  }
};
</script>

<style lang="less" rel="stylesheet/less">
.wx-pay-cashing {
  height: 100%;
  background: rgba(245, 245, 245, 1);
  .d-content {
    height: 100%;
    .count-down {
      background-color: white;
      position: relative;
      height: 105px;
      text-align: center;
      & > div {
        position: absolute;
        left: 0px;
        right: 0px;
        margin-top: 18px;
        .box-pay-time {
          font-size: 14px;
          color: black;
        }
        .remaining-time {
          margin-top: 10px;
          color: #5b9ae3;
          .order-time-number {
            display: inline-block;
            width: 21px;
            height: 21px;
            background: rgba(238, 238, 238, 1);
            text-align: center;
            border-radius: 3px;
            line-height: 21px;
            color: #333333;
            font-size: 16px;
          }
          .order-time-char {
            width: 21px;
            height: 21px;
            text-align: center;
            line-height: 21px;
            color: #333333;
            font-size: 16px;
          }
        }
      }
    }
    .boxGoodsInfo {
      margin-top: 18px;
    }
    .goods-info {
      display: flex;
      margin-bottom: 17px;
      background-color: white;
      height: 86px;
      padding: 20px 8px 20px 20px;
      .goods-img {
        // float: left;
        margin-right: 15px;
        display: inline-block;
        width: 85px;
        height: 85px;
        background: rgba(238, 238, 238, 1);
        vertical-align: top;
        img {
          width: 85px;
          height: 85px;
        }
      }
      .goods-details {
        margin-top: 5px;
        .payment-amount {
          font-size: 12px;
          color: #888888;
          span {
            line-height: 28px;
            vertical-align: middle;
          }
          .payment-price {
            color: #ff4754;
            font-size: 20px;
          }
        }
      }
    }
    .payment-mode {
      & > div {
        background-color: white;
        height: 81px;
        margin: 1px 0px;
        .pay-left {
          float: left;
          height: 100%;
          min-width: 86%;
          .pay-left-img {
            float: left;
            position: relative;
            width: 81px;
            height: 100%;
            img {
              width: 46px;
              height: 46px;
              border-radius: 8px;
              position: absolute;
              top: 40%;
              margin-top: -14px;
              left: 14px;
            }
          }
          .pay-left-info {
            float: left;
            position: relative;
            height: 100%;
            & > div {
              position: relative;
              top: 50%;
              transform: translateY(-50%);
            }
            .info-details {
              color: #a6a6a6;
              margin-top: -2px;
            }
          }
          .info-right {
            float: right;
            height: 100%;
            & > div {
              color: #a6a6a6;
              position: relative;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
        .pay-right {
          float: right;
          height: 100%;
          .fs-checkbox-div {
            // 点击选中 radio
            height: 100%;
          }
          .fs-checkbox {
            display: none;
            &:checked + label {
              border: 1px solid #ffda29;
              span {
                visibility: visible;
              }
            }
            & + label {
              margin-left: 10px;
              margin-right: 10px;
              margin-top: 10px;
              margin-bottom: 10px;
              top: 22px;
              position: relative;
              -webkit-appearance: none;
              border: 1px solid #dddddd;
              padding: 4px;
              border-radius: 50px;
              display: inline-block;
              span {
                display: block;
                border-radius: 50%;
                background: #ffc400;
                visibility: hidden;
                width: 11px;
                height: 11px;
              }
            }
          }
        }
      }
    }
    .confirm-pay {
      position: absolute;
      bottom: 20px;
      left: 3.5%;
      right: 3.5%;
      width: 93%;
      button {
        background-color: #f2cf1b;
        height: 48px;
        .btn-price {
          margin-left: -3px;
        }
      }
    }
  }
  @media screen and (max-width: 286px) {
    .d-content {
      .payment-mode {
        & > div {
          .pay-left {
            min-width: 83%;
          }
        }
      }
    }
  }
  .weui-skin_android .weui-actionsheet__cell {
    text-align: center;
  }
  .weui-skin_android .weui-actionsheet__cell:nth-child(2) {
    color: red;
  }
  .weui-skin_android .weui-actionsheet__cell:nth-child(3) {
    color: #999;
  }
}

.class-pay-icon {
  width: 46px;
  height: 46px;
}

.class-shortcut-pay {
  width: 34px;
  height: 34px;
}

.form-jd {
  width: 100%;
}

.jdForm {
  display: none;
}

.jdForm2 {
  display: none;
}
</style>
