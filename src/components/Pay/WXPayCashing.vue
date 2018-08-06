<template>
  <div class="wx-pay-cashing">
    <div class="d-content">
    	<section>
    		<div v-show="countTime.showCountTime" class="count-down">
    			<div>
    				<div class="box-pay-time">支付剩余时间</div>
    				<div class="remaining-time">
                    <!-- {{ orderDetail.restPayTime }} -->
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
                      <span v-for="item in orderDetail.shortName.split(',')">
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
                <!-- class="wechat-pay" -->
    				<div class="pay-left">
    					<div class="pay-left-img">
    						<!-- <img class="class-wx-icon" srcset="./wx_icon@1x.png 1x, ./wx_icon@1.5x.png 1.5x"> -->
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
    					<!-- <div class="fs-checkbox-div" @click="chkRadio(1, $event)"> -->
                        <div class="fs-checkbox-div" :key="index">
	              <!-- <input class="fs-checkbox" type="radio" id="1" name="1" value="1" v-model="payCheckedNames"> -->
                  <input class="fs-checkbox" type="radio" :id="index" :name="index" :value="index" v-model="payIndex">
                  <!-- v-on:click="(payType !== index+1) && chkRadio(index+1, $event)" -->
	              <label :for="index">
	              	<span></span>
	              </label>
	            </div>
    				</div>
    			</div>

    			<!-- <div class="shortcut-pay">
    				<div class="pay-left">
    					<div class="pay-left-img">
    					</div>
    					<div class="pay-left-info">
    						<div>
    							<div class="f15">快捷支付</div>
    						</div>
    					</div>
    					<div class="info-right">
	    					<div class="f13">京东支付</div>
	    				</div>
    				</div>
    				<div class="pay-right">
    					<div class="fs-checkbox-div" @click="chkRadio(2, $event)">
	              <input class="fs-checkbox" type="radio" id="2" name="2" value="2" v-model="payCheckedNames">
	              <label for="2">
	              	<span></span>
	              </label>
	            </div>
    				</div>
    			</div> -->
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
<!-- onload="autosubmit()" -->
	<form class="jdForm" name="jdForm" method="post" action="https://h5pay.jd.com/jdpay/saveOrder" id="jsBatchForm">
		<input name="version"  id="version" v-bind:value="version"/><br/>
		<input name="merchant"  id="merchant" v-bind:value="merchant" /><br/>
		<!-- <input name="device"  id="device" v-bind:value="device" /><br/> -->
		<input name="tradeNum"  id="tradeNum" v-bind:value="tradeNum" /><br/>
		<input name="tradeName"  id="tradeName" v-bind:value="tradeName" /><br/>
		<!-- <input name="tradeDesc"  id="tradeDesc" v-bind:value="tradeDesc" /><br/> -->
		<input name="tradeTime"  id="tradeTime" v-bind:value="tradeTime" /><br/>
		<input name="amount"  id="amount" v-bind:value="amount" /><br/>
		<input name="currency"  id="currency" v-bind:value="currency" /><br/>
		<!-- <input name="note"  id="note" v-bind:value="note" /><br/> -->
		<input name="callbackUrl"  id="callbackUrl" v-bind:value="callbackUrl"/><br/>
		<input name="notifyUrl" id="notifyUrl" v-bind:value="notifyUrl"/><br/>
		<input name="ip"  id="ip" v-bind:value="ip"/><br/>
		<!-- <input name="userType"  id="userType" v-bind:value="userType" /><br/> -->
		<input name="userId"  id="userId" v-bind:value="userId" /><br/>
		<!-- <input name="expireTime"  id="expireTime" v-bind:value="expireTime" /><br/> -->
		<input name="orderType"  id="orderType" v-bind:value="orderType"/><br/>
		<!-- <input name="industryCategoryCode" id="industryCategoryCode" /><br/> -->
		<!-- <input name="specCardNo"  id="specCardNo" /><br/> -->
		<!-- <input name="specId"  id="specId" /><br/> -->
		<!-- <input name="specName"  id="specName" /><br/> -->
		<!-- <input  name="goodsInfo" v-bind:value="goodsInfo"/> -->
		<!-- <input  name="riskInfo " v-bind:value="riskInfo"/> -->
		<input name="sign"  id="sign" v-bind:value="sign" /><br/>
		<input type="submit" class="sumbit" value="Submit" debounce="5000" v-on:click="submit()">
        <!-- v-on:click="submit() -->
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
        <!-- <input type="hidden" name="expireTime" value=""><br />  -->
        <input type="hidden" name="orderType" value="e5a6c3761ab9ddaf"><br />
        <!-- <input type="hidden" name="industryCategoryCode" value=""><br />  -->
        <input type="hidden" name="sign" value="pVyQewiCK4FBQAoc0DyHEs6eI8H06ftil7L+OkiPUFcyO8EmhCcet0MLkPDf7kw8tysyvNBD1Xhi
wRi1wXVhGWRV+KqmpwGMUKk2F4GNNp6Ja8oXj7xk8pQ/JvvCmN7MB+XmHi1JX2k8Jothnb6kkeZx
D3Hg82xaS0h7tYwUvJ8="><br />
        <!-- <input type="hidden" name="cert" value=""><br />
        <input type="hidden" name="payMerchant" value=""><br />
        <input type="hidden" name="tradeType" value=""><br />
        <input type="hidden" name="riskInfo" value=""><br /> -->
        <input type="submit" class="sumbit" value="Submit2">
    </form>
  </div>
</template>

<script type="text/ecmascript-6">
	import { XButton, Toast } from 'vux'
	// import qs from 'qs'
	// import axios from 'axios'
    import Config from './../../util/config'
	export default {
		name: 'WXPayCashing',
		data() {
			return {
                payIndex: 0,
                deductionAmount: '0',
                payStyle: this.$store.state.payStyle,  // 支付首付或账单支付
                orderNo: '',    // 订单号
                orderStatus: '',    // 订单状态
				// 23331465  商户测试账号
				isOutOfTime: false,
                payDesc: '',
				price: '139.00',
				// payCheckedNames: '0', // 提前还清, 选中的 -- 单选
                // payType: parseInt(this.payCheckedNames) + 1,    // 默认选择已签约代扣
                payType: '1',    // 1:微信(默认值),2:京东
				remainingTime: '',
        version: 'V2.0',
        merchant: '22294531',    // 测试商户号
        // merchant: '110966959',    // 正式商户号
        // device: '',
        tradeNum: '',
        tradeName: '商品描述',
        // tradeDesc: '交易描述',
        // tradeTime: '20180421101432',
        tradeTime: '20180421101432',
        amount: '',
        currency: 'CNY',    // 人民币
        // userId: '',
        // note: '',
        // callbackUrl: 'http://10.13.81.116:63917/SuccessForm1.aspx',
        // callbackUrl: 'http://jdpaydemo.jd.com/success.htm',
        // callbackUrl: location.href.split('#')[0] + '#' + '/Pay/WXPaySuccess',
        // callbackUrl: 'http://192.168.2.4:8080/Pay/WXPaySuccess',
        // callbackUrl: window.location.href.split('?')[0] + '#/Pay/WXPaySuccess?',
        callbackUrl: Config.jdUrl + '#/Pay/WXPaySuccess?',
        // notifyUrl: 'http://10.13.81.116:63917/AsynNotifyHandler.ashx',
        notifyUrl: '',    // 通知后台
        ip: '',
        // ip: ipSohu,
        expireTime: '',
        orderType: '1',
        // industryCategoryCode: '',
        // sign: 'amount=1&callbackUrl=http://jdpaydemo.jd.com/success.htm&currency=CNY&device=111&expireTime=1000&ip=10.45.251.153&merchant=22294531&notifyUrl=http://jdpaydemo.jd.com/asynNotify.htm&orderType=1&tradeDesc=交易描述&tradeName=商品1111&tradeNum=15242107747521&tradeTime=20180417204742&userId=123456&version=V2.0',
        sign: '',
        cert: '',
        payMerchant: '',
        tradeType: '',
        riskInfo: '',
        userId: '',
        // userType: '',
        specCardNo: '',
        specId: '',
        specName: '',
        // goodsInfo: '[{"id":"12345","name":"iphone5","cat1":"abc","type":"GT01","price":"510000","num":"1"},{"id":"23456","name":"iphone6","cat1":"abc","type":"GT01","price":"600000","num":"1"}]',
        // riskInfo: '{“omId”:”123456”,”omName”:”必胜客**路店”,“omRt”:”486094410000”,”omType”:"004001","omAdd","北京市朝阳区**路**号"}',
        // sign: 'V29xd6eK8vkTx9zLDLEWGxvshsNBJCkamEhCbV8VisXUKCWlVZp0P3MFjm40l8fSO2xlaykYNCwEc478k1GWCvOlBEcHGpFZSpP1J9aLNx8MloVKTIQgNDWMEHDy/Z1gUDyLhvfVpeWTpwGhOmYVM+ec+Za0GTKKAAoOAFLD/Jw=',
        orderGoodsNum: '',
        vendorId: '',
        receiverInfo: '',
        termInfo: '',
        payChannel: '',
        goodsInfo: '',
        paymentChannel: [],
        paymentChannelJD: [{
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
        }],
        orderDetail: {
            orderNo: '',
            restPayTime: '',
            listImg: '',
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
            jdWithholdChannelNo: 11,    // 京东支付渠道
            wxWithholdChannelNo: 12     // 微信支付渠道
        },
        paymentChannelNo: {
           wxPaymentChannelNo: '1',    // 微信支付
           jdPaymentChannelNo: '2'     // 京东支付
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
        }
		}
		},
        created() {
          this.showCountTime()
          this.showPayChannel()
        },
		mounted() {
            console.log('mounted')
            console.log('merchant === ' + this.merchant)
            console.log('from url === ' + location.href)
            console.log('callbackUrl === ' + this.callbackUrl)
            // console.log('callbackUrl === ' + this.callbackUrl)
            // alert('callbackUrl === ' + this.callbackUrl)
            console.log('store orderNo', 'orderNo === ' + this.$store.state.orderNo)
            console.log('store amount', 'amount === ' + this.$store.state.payAmount)
          if (!this.checkIsFromSigned()) {    // 代扣签约完成自动跳转支付
            this.$store.commit('updateLoadingStatus', { isLoading: true })
            console.log('not from JD')
            this.orderDetail.orderNo = this.$store.state.orderNo
            // this.orderDetail.payAmount = this.$store.state.payAmount
            this.orderDetail.payAmount = parseInt(this.$store.state.payAmount * 100 + 0.5) / 100
            this.amount = parseInt(this.$store.state.payAmount * 100 + 0.5) + ''    // 先将元转成分，在将分转成字串
            this.deductionAmount = parseInt(this.$store.state.deductionAmount * 100 + 0.5) + ''
            console.log('amount === ' + this.amount)
            console.log('deductionAmount === ' + this.deductionAmount)
            console.log('mounted orderNo === ' + this.orderDetail.orderNo)
            this.getPaymentChannels()
            this.getOrderDetail(this.orderDetail.orderNo)
          } else {
            console.log('from signed')
            // 根据条件判断是走京东支付还是微信支付
            // if (this.payType === PAY_CHANNEL_WX) {
            //   this.checkWXJSBridgeAndPay()
            // } else if (this.payType === PAY_CHANNEL_JD) {
            //   this.jdPaySign()
            // }
            // 检查是否存在正在进行的支付交易
            // this.payType = this.store.state.payChannel
            // if (this.payType === 0) {
            //   // 微信支付
            //   this.orderDetail.orderNo = this.$store.state.orderNo
            //   this.orderDetail.payAmount = this.$store.state.payAmount
            //   this.amount = parseInt(this.$store.state.payAmount * 100 + 0.5) + ''
            //   this.deductionAmount = parseInt(this.$store.state.deductionAmount * 100 + 0.5) + ''
            //   this.getPaymentChannels()
            //   this.getOrderDetail(this.orderDetail.orderNo)
            // } else if (this.payType === 1) {
            //   // 京东支付
            //   this.getPaymentChannels()
            // }
            this.payType = this.$store.state.payChannel
            this.orderDetail.orderNo = this.$store.state.orderNo
            // this.orderDetail.payAmount = this.$store.state.payAmount
            this.orderDetail.payAmount = parseInt(this.$store.state.payAmount * 100 + 0.5) / 100
            this.amount = parseInt(this.$store.state.payAmount * 100 + 0.5) + ''
            this.deductionAmount = parseInt(this.$store.state.deductionAmount * 100 + 0.5) + ''
            if (this.checkFromWXSign()) {
              // 丢失数据，重新请求数据
              // this.$store.commit('updateLoadingStatus', { isLoading: true })
              // this.getPaymentChannels()
              // this.getOrderDetail(this.orderDetail.orderNo)
                switch (this.payType) {
                  case this.paymentChannelNo.wxPaymentChannelNo:
                    this.getPaymentChannels()
                    this.getOrderDetail(this.orderDetail.orderNo)
                    break
                  case this.paymentChannelNo.jdPaymentChannelNo:
                    this.getPaymentChannels()
                    break
                }
                if (this.payType === this.paymentChannelNo.wxPaymentChannelNo) {
                    // 微信支付
                } else if (this.payType === this.paymentChannelNo.jdPaymentChannelNo) {
                    // 京东支付
                    this.getPaymentChannels()
                }
            } else if (this.checkFromJDSign()) {
              this.getPaymentChannels()
            }
          }
		},
		methods: {
           showCountTime() {
            let routeSource = this.$store.state.routeSource
            console.log('routeSource === ' + routeSource)
            if (routeSource === 'WXPayOverpaying' || routeSource === 'Buyout' || routeSource === 'reletConfirmOrder') {
                this.countTime.showCountTime = false
            } else {
                this.countTime.showCountTime = true
            }
            console.log('showCountTime >>> ' + this.countTime.showCountTime)
           },
           showPayChannel() {
             this.paymentChannelShow.showPaymentChannel = !(this.$store.state.routeSource === 'Buyout' && parseInt(this.$store.state.payAmount * 100 + 0.5) <= 0)
             console.log('showPayChannel >>> ' + this.paymentChannelShow.showPaymentChannel)
           },
           getWXPayData() {
            let params = {
               'amount': this.amount,
               'deduction_amount': this.deductionAmount,
               'body': this.orderDetail.shortName,
               'orderNo': this.orderDetail.orderNo,
               'wechatOpenId': this.$store.state.othersOpenID,
               'transNote': this.$store.state.routeSource === 'reletConfirmOrder' ? JSON.stringify(this.$route.params) : '',    // 续租需要传订单相关字段到后台完成订单再创建
               'payType': this.$store.state.payStyle
            }
            this.$store.commit('updateLoadingStatus', { isLoading: true })
            this.$http.post('/wuzhu/payment/wxpay/doUnifiedOrder', params).then(res => {
                this.$store.commit('updateLoadingStatus', { isLoading: false })
                console.log('doUnifiedOrder success >>> ' + JSON.stringify(res))
                if (res.code === '00') {
                    console.log('doUnifiedOrder success >>> ' + JSON.stringify(res))
                    this.wxPayData = res.data
                    this.$store.commit('updateTradeNum', { tradeNum: res.data.paytradenum })
                    this.checkWXJSBridgeAndPay()
                } else if (res.code === '1') {
                    // 判断服务器返回特征数据，是否调起微信支付
                  let params = {
                      'code': res.code
                      }
                  this.$router.push({name: 'WXPaySuccess', params: params})
                } else {
                    if (res.msg) {
                      this.$vux.alert.show({
                      content: res.msg
                      })
                    }
                }
            })
           },
           getWXSignUrl() {
             let params = {
                'buyer_info': '',
                'order_no': this.orderDetail.orderNo,
                'return_url': window.location.href.split('?')[0] + '#/Pay/WXPayCashing'
             }
             this.$store.commit('updateLoadingStatus', { isLoading: true })
             this.$http.post('/wuzhu/payment/wxpay/getAgreementSignUrl', params).then(res => {
                this.$store.commit('updateLoadingStatus', { isLoading: false })
                if (res.code === '00') {
                  console.log('getAgreementSignUrl success ===> ' + JSON.stringify(res))
                  let signUrl = res.data
                  if (signUrl) {
                    window.location.href = signUrl
                  } else {
                    console.log('微信签约url为空')
                  }
                } else {
                  console.log('getAgreementSignUrl error ===> ' + JSON.stringify(res))
                }
             })
           },
           clickRadio(index, item) {
            this.payIndex = index
            this.payType = item.paymentChannelNo
            console.log('payType === ' + this.payType)
           },
            // 检测是否来源于JD签约
          checkFromJDSign() {
            console.log('checkFromJDSign')
            let url = location.href
            let jdDataSignLabel = ['/Pay/WXPayCashing?', 'signType', 'requestDatetime', 'outTradeNo', 'signData', 'agreementNo']
            let isFromJDSign = true
            jdDataSignLabel.forEach(function(item) {
                if (url.indexOf(item) === -1) {
                    isFromJDSign = false
                }
            })
            return isFromJDSign
          },
          checkFromWXSign() {
            console.log('checkFromWXSign')
            let url = location.href
            let wxDataSignLabel = ['from_wxpay=1']
            let isFromWXSign = true
            wxDataSignLabel.forEach(function(item) {
              if (url.indexOf(item) === -1) {
                isFromWXSign = false
              }
            })
            return isFromWXSign
          },
          checkIsFromSigned() {
            if (this.checkFromJDSign() || this.checkFromWXSign()) {
                return true
            } else {
                return false
            }
          },
          getPaymentChannels() {
            let params = {
              'channelNo': this.$store.state.channelNo
            }
            console.log('getPaymentChannels >>> channelNo === ' + this.$store.state.channelNo)
            this.$store.commit('updateLoadingStatus', { isLoading: true })
            this.$http.get('/wuzhu/channel/getPaymentChannels', params).then(res => {
                this.$store.commit('updateLoadingStatus', { isLoading: false })
                if (res.code === '00' && res.data) {
                console.log('getPaymentChannels success')
                // 根据渠道号判断，如果是京东app不能使用微信代扣与微信支付
                let channelNo = this.$store.state.channelNo
                console.log('channelNo === ' + channelNo)
                this.paymentChannel = res.data
                if (!this.checkIsFromSigned()) {
                  this.payType = this.paymentChannel[0].paymentChannelNo
                }
                for (let i = 0; i < this.paymentChannel.length; i++) {
                switch (this.paymentChannel[i].paymentChannelNo) {
                  case '1':
                    this.paymentChannel[i].channelIconUrl = './static/images/Pay/wx_icon@1x.png 1x, ./static/images/Pay/wx_icon@1.5x.png 1.5x'
                    console.log('weixin icon === ' + this.paymentChannel[i].channelIconUrl)
                    break
                  case '2':
                    this.paymentChannel[i].channelIconUrl = './static/images/Pay/jd_icon@1x.png 1x, ./static/images/Pay/jd_icon@1.5x.png 1.5x'
                    console.log('jd icon === ' + this.paymentChannel[i].channelIconUrl)
                    break
                }
                }
                // 签约完成调起支付流程
                if (this.checkFromJDSign()) {
                    this.checkIsTrading()
                } else if (this.checkFromWXSign() && this.payType === this.paymentChannelNo.wxPaymentChannelNo) {
                  this.wxFromWXSigned.channelOK = true
                  if (this.wxFromWXSigned.orderDetailOK) {
                    this.checkIsTrading()
                  }
                } else if (this.checkFromWXSign() && this.payType === this.paymentChannelNo.jdPaymentChannelNo) {
                    this.checkIsTrading()
                }
            } else {
                    console.log('getPaymentChannels failed')
                }
            })
          },
            getOrderDetail(orderNo) {
                console.log('getOrderDetail')
                this.$store.commit('updateLoadingStatus', { isLoading: true })
                this.$http.get('/wuzhu/order/getOrderDetail?orderNo=' + orderNo).then(res => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false })
                    if (res.code === '00') {
                        console.log('getOrderDetail success')
                        // this.orderDetail.restPayTime = res.data.restPayTime
                        this.orderDetail.listImg = res.data.commodity.listImg
                        this.orderDetail.shortName = res.data.commodity.shortName
                        this.orderDetail.firstActualPay = res.data.firstActualPay
                        // 京东支付部分字段
                        this.tradeName = this.orderDetail.shortName
                        this.tradeTime = this.getOrderTime(res.data.createDate)
                        // this.formatTime(this.orderDetail.restPayTime)
                        this.countDown(parseInt(res.data.restPayTime / 1000))
                        // 获取微信支付数据信息
                        // 测试环境没有appId
                        // if (Config.active !== 'dev') {
                        //   this.getWXPayData()
                        // } else if (this.checkFromSign()) {
                        //   this.checkIsTrading()
                        // }
                        if (this.checkFromWXSign()) {
                            this.wxFromWXSigned.orderDetailOK = true
                          if (this.wxFromWXSigned.channelOK) {
                            this.checkIsTrading()
                          }
                        }
                    } else {
                        console.log('getOrderDetail failed, code === ' + res.code + ', msg === ' + res.msg)
                        alert(res.msg)
                    }
                })
            },
            // 输入格式：2018-05-22 10:47:04
            // 输出格式：20180522104704
            getOrderTime(time) {
              let result = '20180522104704'
              if (time.length && time.length > 0) {
                result = ''
                let timeStrSub = time.split(' ')
                let timeDay = timeStrSub[0]
                let timeSecond = timeStrSub[1]
                let timeDaySub = timeDay.split('-')
                let timeSecondSub = timeSecond.split(':')
                for (let sub1 of timeDaySub) {
                    result = result + sub1
                }
                for (let sub2 of timeSecondSub) {
                    result = result + sub2
                }
              }
              return result
            },
            // formatTime(timeMilis) {
            //     let hour = parseInt(timeMilis / 1000 / 3600)    // 小时向下取整
            //     let minutes = parseInt((timeMilis / 1000 / 60) - hour * 60) // 分钟向下取整
            //     let seconds = parseInt(timeMilis / 1000 - hour * 3600 - minute * 60)  // 秒向下取整
            // },
            postJD() {
                console.log('postJD')
                document.getElementById('jsBatchForm').submit()
            },
            autosubmit() {
                console.log('autosubmit')
              document.getElementById('jsBatchForm').submit()
            },
			// chkRadio(payChannel) {
                // console.log('paymentChannel')
				// console.log('payType is ' + this.payType)
                // console.log('payCheckedNames is ' + this.payCheckedNames)
				// this.payType = payChannel
                // this.payDesc = payDesc
			// },
            // 确认支付
			confirmPay() {
                console.log('>>> confirmPay payType === ' + this.payType)
                console.log('callbackUrl === ' + this.callbackUrl)
                if (this.isOutOfTime && this.countTime.showCountTime) {
                    this.toastData.toastShow = true
                    return
                }
                this.$store.commit('updatePayChannel', { payChannel: this.payType })
                console.log('>>> confirmPay payStyle === ' + this.$store.state.payStyle)
                if (this.$store.state.payStyle === '4') {    // 买断不需要签约
                  switch (this.payType) {
                    case this.paymentChannelNo.wxPaymentChannelNo:
                      this.getWXPayData()
                      break
                    case this.paymentChannelNo.jdPaymentChannelNo:
                      this.jdPaySign()
                      break
                  }
                } else {
                  switch (this.payType) {
                    case this.paymentChannelNo.wxPaymentChannelNo:
                      this.goWXPay()
                      break
                    case this.paymentChannelNo.jdPaymentChannelNo:
                      this.goJDPay()
                      break
                  }
                }
                // 测试微信签约
                // this.getWXSignUrl()
		    },
            getChannelIndex() {
              for (let index = 0; index < this.paymentChannel.length; index++) {
                if (this.payType === this.paymentChannel[index].paymentChannelNo) {
                    return index
                }
              }
              return 0
            },
            // 京东支付
            goJDPay() {
              console.log('京东支付')
              // 查看代扣渠道
                  let index = this.getChannelIndex()
                  if (this.paymentChannel[index].withholdChannelNo === this.signChannel.jdWithholdChannelNo) {
                    console.log('京东支付 >>>已配置京东支付代扣渠道 >>>京东代扣渠道检查...')
                    this.jdPayAgreementCheck()
                  } else if (this.paymentChannel[index].withholdChannelNo === this.signChannel.wxWithholdChannelNo) {
                    console.log('京东支付 >>>已配置微信支付代扣渠道 >>>微信代扣渠道检查...')
                    this.wxPayAgreementCheck()
                  } else {
                    console.log('京东支付 >>>未配置代扣渠道 >>>调起京东支付...')
                    this.jdPaySign()
                  }
            },
            // 检查是否签约微信代扣,未签约走签约流程，已签约走支付流程
            wxPayAgreementCheck() {
              console.log('wxPayAgreementCheck')
              let that = this
              let params = {
                'out_trade_no': this.orderDetail.orderNo
              }
              this.$store.commit('updateLoadingStatus', { isLoading: true })
              this.$http.post('/wuzhu/payment/weiXinPay/wxpayAgreementQuery', params).then(res => {
                this.$store.commit('updateLoadingStatus', { isLoading: false })
                if (res.code === '00' && res.data && res.data.agreement_status === 'YES') {
                  console.log('已签约微信代扣')
                  // 根据用户所选支付渠道选择支付方式
                  // switch (that.payType) {
                  //   case 0:
                  //     that.checkWXJSBridgeAndPay()
                  //     break
                  //   case 1:
                  //     that.jdPaySign()
                  //     break
                  // }
                  // 判断是否存在正在进行的支付交易
                  that.checkIsTrading()
                } else {
                  console.log('尚未签约微信代扣 >>>' + JSON.stringify(res))
                  // 调起微信签约
                  that.getWXSignUrl()
                }
              })
            },
            // 检查是否签约京东代扣,未签约走签约流程，已签约走支付流程
			jdPayAgreementCheck() {
                console.log('jdPayAgreementCheck')
                let that = this
				let params = {
					// 'customer_no': '112234555',    // 后台自我提供
                    'out_trade_no': this.orderDetail.orderNo    // 订单号
                    // 'agreement_no': '111111'    // 协议编号
				}
                this.$store.commit('updateLoadingStatus', { isLoading: true })
       this.$http.post('/wuzhu/payment/jdpay/jdpayAgreementQuery', params).then(
       	res => {
            this.$store.commit('updateLoadingStatus', { isLoading: false })
        	console.log('res === ' + JSON.stringify(res))
            if (res.data && res.data.agreement_status === 'FINI') {
              console.log('已签约京东代扣')
              // 根据用户所选支付渠道选择支付方式
              // switch (that.payType) {
              //   case 0:
              //     that.checkWXJSBridgeAndPay()
              //     break
              //   case 1:
              //     that.jdPaySign()
              //     break
              // 判断是否存在正在进行的支付交易
              that.checkIsTrading()
              // 根据代扣指令查询
              // this.$vux.confirm.show({
              //   content: '您有代扣中的还款,此次支付可能会造成重复扣款, 确认是否继续支付?',
              //   onConfirm() {
              //       console.log('confirm')
              //       that.jdPaySign()
              //   },
              //   onCancel() {
              //       console.log('cancel')
              //   }
              // })
        } else {
            console.log('尚未签约京东代扣 >>>' + JSON.stringify(res))
            this.getjdPayAgreementUrl()
        }
        })
		},
        // 检查是否有代扣中的交易或者状态未知的支付交易(签约之前)
        checkIsTrading() {
          this.wxFromWXSigned.channelOK = false
          this.wxFromWXSigned.orderDetailOK = false
          let index = this.getChannelIndex()
          let withholdChannelNo = this.paymentChannel[index].withholdChannelNo
          let params = {
            'channelNo': withholdChannelNo,
            'login_mobile': this.$store.state.phone,
            'orderNo': this.orderDetail.orderNo,
            'wechatOpenId': this.$store.state.othersOpenID
          }
          let that = this
          this.$store.commit('updateLoadingStatus', { isLoading: true })
          this.$http.post('/wuzhu/payment/billPaymentQuery', params).then(res => {
            this.$store.commit('updateLoadingStatus', { isLoading: false })
            if (res.code === '00' && res.data && res.data.code === 'ok') {
              console.log('不存在正在进行的交易 >>> ' + JSON.stringify(res))
              console.log('payType === ' + that.payType)
                  switch (that.payType) {
                    case that.paymentChannelNo.wxPaymentChannelNo:
                      that.getWXPayData()
                      break
                    case that.paymentChannelNo.jdPaymentChannelNo:
                      that.jdPaySign()
                      break
                  }
            } else {
              console.log('存在正在进行的交易 >>> ' + JSON.stringify(res))
              that.$vux.alert.show({
                content: '您有处理中的支付，待系统处理后再试...'
              })
            }
          })
        },
        // 获取jd签约url
		getjdPayAgreementUrl() {
         console.log('getjdPayAgreementUrl')
         // let locationUrl = window.location.href
         // console.log('locationUrl === ' + locationUrl)
         // let returnUrl = locationUrl.split('?')[0] + '#/Pay/WXPayCashing'
         let returnUrl = Config.jdUrl + '#/Pay/WXPayCashing'
         console.log('returnUrl === ' + returnUrl)
         this.$store.commit('updateLoadingStatus', { isLoading: true })
         this.$http.post('/wuzhu/payment/jdpay/getAgreementSignUrl', {
            'order_no': this.orderDetail.orderNo,
            'return_url': returnUrl
         }).then(res => {
        	console.log('res === ' + JSON.stringify(res))
            this.$store.commit('updateLoadingStatus', { isLoading: false })
        	if (res.code === '00') {
        		console.log('获取签约url成功')
        		this.jdPayAgreement(res.data)
        } else {
        	console.log('获取签约url失败')
        	// 调起签约
        }
        })
		},
			jdPayAgreement(url) {
				console.log('agreementUrl === ' + url)
				// window.open(url)
                window.location.href = url
			},
            // 加密，签名并支付
		jdPaySign() {
        console.log('jdPaySign')
        // 订单相关信息
        let form = {
          // 'version': this.version,    // 版本号（不传）
          'amount': this.amount,    // 支付金额（分）
          'callbackUrl': this.callbackUrl,    // 支付成功回调地址
          // 'cert': this.cert,
          'currency': this.currency,    // 货币类型 （默认CNY,即人民币）
          // 'device': this.device,    // 门店号 (可不填)
          // 'expireTime': this.expireTime,
          // 'goodsInfo': this.goodsInfo,
          // 'industryCategoryCode': this.industryCategoryCode,
          'ip': this.ip,    // 付款ip地址
          // 'merchant': this.merchant,
          // 'note': this.note,    // 商户备注(可不填)
          'notifyUrl': this.notifyUrl,    // 支付成功通知地址，后台配置
          // 'orderGoodsNum': this.orderGoodsNum,
          'orderType': this.orderType,    // 订单类型（1.实物，-1虚拟）
          // 'payChannel': this.payChannel,
          // 'payMerchant': this.payMerchant,
          // 'receiverInfo': this.receiverInfo,
          // 'riskInfo': this.riskInfo, //   有中文
          // 'sign': this.sign,
          // 'specCardNo': 'specCardNo',
          // 'specId': 'specId',
          // 'specName': 'specName',
          // 'termInfo': this.termInfo,
          // 'tradeDesc': this.tradeDesc,  // 商户提供的订单的具体描述信息（可不填）
          'tradeName': this.tradeName,    // 商户提供的订单的标题/商品名称/关键字等
          'tradeNum': this.orderDetail.orderNo, // 和姚哥约定，作为订单号传过去
          'tradeTime': this.tradeTime,    // 订单生成时间，格式为“yyyyMMddHHmmss”
          'tradeType': this.$store.state.payStyle,
          'transNote': this.$store.state.routeSource === 'reletConfirmOrder' ? JSON.stringify(this.$route.params) : '',    // 续租需要传订单相关字段到后台完成订单再创建
          'deduction_amount': this.deductionAmount
          // 'userId': this.userId,
          // 'userType': this.userType,
          // 'vendorId': this.vendorId
          // 'version': this.version
          // 'payType': this.$store.state.payStyle
        }
        // console.log('thisip === ' + this.ip)
         // receiverInfo
          // kjInfo
          // settleCurrency
        this.$store.commit('updateLoadingStatus', { isLoading: true })
        this.$http.post('/wuzhu/payment/jdpay/makeTrade', form).then(res => {
            this.$store.commit('updateLoadingStatus', { isLoading: false })
            console.log('makeTrade success >>> ' + JSON.stringify(res))
        	if (res.code === '00') {
        	  this.renderForm(res)
            } else if (res.code === '1') {
              let params = {
                'code': res.code
              }
             this.$router.push({name: 'WXPaySuccess', params: params})
            } else {
        	  console.log('jdPaySigned failed')
              if (res.msg) {
               this.$vux.alert.show({
                 content: res.msg
               })
              }
            }
        })
		},
		renderForm(res) {
        console.log('payTradeNum === ' + res.data.paytradenum)
        this.$store.commit('updateTradeNum', { tradeNum: res.data.paytradenum })
        // this.version = res.version    // 不需要加密
        this.merchant = res.data.merchant    // 不需要加密
        // this.sign = res.sign    // 不需要加密
        // console.log('sign === ' + this.sign)
        this.sign = res.data.sign
        console.log('sign === ' + this.sign)
        // this.device = res.data.device
        // console.log('device === ' + this.device)
        this.tradeNum = res.data.tradeNum
        console.log('tradeNum === ' + this.tradeNum)
        this.tradeName = res.data.tradeName
        console.log('tradeName === ' + this.tradeName)
        // this.tradeDesc = res.data.tradeDesc
        // console.log('tradeDesc === ' + this.tradeDesc)
        this.tradeTime = res.data.tradeTime
        console.log('tradeTime === ' + this.tradeTime)
        // this.amount = res.data.amount
        this.amount = res.data.amount
        console.log('orderDetail payAmount === ' + this.amount)
        this.currency = res.data.currency
        console.log('currency === ' + this.currency)
        // this.note = res.data.note
        // console.log('note === ' + this.note)
        this.callbackUrl = res.data.callbackUrl
        console.log('callbackUrl === ' + this.callbackUrl)
        this.notifyUrl = res.data.notifyUrl
        console.log('notifyUrl === ' + this.notifyUrl)
        this.ip = res.data.ip
        console.log('ip === ' + this.ip)
        // this.userType = res.data.userType
        this.userId = res.data.userId
        console.log('userId === ' + this.userId)
        this.orderType = res.data.orderType
        console.log('orderType === ' + this.orderType)
        this.$store.commit('updateLoadingStatus', { isLoading: false })
        this.$nextTick(function() {
          console.log('sumbit')
          document.jdForm.submit()
        })
                // setTimeout(function() {
                //     document.jdForm.submit()
                // }, 100)
			},
			jdPay() {
				console.log('jdPay')
				// let params = {
    //      'version': 'V2.0',
    //      'sign': 'sign',
    //      'merchant': 'merchant',
    //      'tradeNum': res.tradeNum,
    //      'tradeName': res.tradeName,
    //      'tradeTime': res.tradeTime,
    //      'amount': res.amount,
    //      'orderType': res.orderType,
    //      'currency': res.currency,
    //      'callbackUrl': res.callbackUrl,
    //      'notifyUrl': res.notifyUrl,
    //      'userId': res.userId
				// }
           let params2 = {
         'version': 'V2.0',
         'sign': 'b2VNVnIK95SaZp9WbzsZFuxnhzpcFrCiF2ctTxRsjXqiTFaWZ1nyQ0k8bnoimF96kCpaumzkTKpLszY74kw+I4EsMmQ5l624slwpBjtAlRLPhzxjS1SansK2jel2oOpIEoKpHADotSxyTbH7HBbV7FsxwPsRH77v1gH3wDNu59A=',
         'merchant': '22294531',
         'tradeNum': 'e42c00fa75e9465e36907983ae37861ebc138aa8cb7e6053',
         'vendorId': '',
         'tradeName': 'e41941e6a89ae685150b2bc999c842a1',
         'tradeTime': 'c33390d9b3d6d669dd4634d49ef76fb1cb8266a78b4a37ef',
         'amount': 'e5a6c3761ab9ddaf',
         'orderType': 'e5a6c3761ab9ddaf',
         'callbackUrl': '71534b75767a05bd0ab7c5eabc46b814134634cb3dc1036447bebce43f4071c72fe8b358600d19ff',
         'userId': '',
         'note': '5b8119fe85e1f5ba93648010c439bcb6',
         'tradeDesc': 'dd762e2dc91f21fb9398efd83243b1f6',
         'industryCategoryCode': '',
         'currency': 'ac7132c57f10d3ce',
         'specId': '',
         'specCardNo': '',
         'orderGoodsNum': '',
         'riskInfo': '',
         'ip': '79e743fa2554aa335d67d8945150806e91f40c36ea9df504',
         'expireTime': '',
         'termInfo': '',
         'specName': '',
         'notifyUrl': '93265ab8dd34865b0ab7c5eabc46b814134634cb3dc103648f6c6a80b33425bd614b9bfe408b2c178a3e003acf4d952b178a3e003acf4d952b',
         'payChannel': '',
         'device': 'b6d677010345d509',
         'goodsInfo': ''
         // 'userType': null,
         // 'payMerchant': null
         }
         // 'tradeType': null
         // cert: null
				// let header = {
    //     	'Access-Control-Allow-Origin': '*'
    //     }
    // {'Content-Type': 'multipart/form-data'}
        // this.$http.post('https://h5pay.jd.com/jdpay/saveOrder', qs.stringify(params2), {
        // 	headers: {
        // 		'Access-Control-Allow-Origin': '*'
        // 	}
        // }).then(res => {
        // 	console.log('jdPay res === ' + res)
        // })
   // axios.post('https://wepay.jd.com/jdpay/saveOrder', this.$http.qs(params2), {
   //                    headers: {
   //                          'Content-Type': 'application/x-www-form-urlencoded'
   //                    }
   //                })
   //                .then(function(response) {
   //                  console.log(response)
   //                })
   //                .catch(function(error) {
   //                  console.log(error)
   //                })
   console.log('finish post')
     this.formData(params2)
			},
			formData(params) {
        var formData = new FormData()
        formData.append('version', params.version)
        formData.append('sign', params.sign)
        formData.append('merchant', params.merchant)
        formData.append('tradeNum', params.tradeNum)
        formData.append('vendorId', params.vendorId)
        formData.append('tradeName', params.tradeName)
        formData.append('tradeTime', params.tradeTime)
        formData.append('amount', params.amount)
        formData.append('orderType', params.orderType)
        formData.append('callbackUrl', params.callbackUrl)
        formData.append('userId', params.userId)
        formData.append('note', params.note)
        formData.append('tradeDesc', params.tradeDesc)
        formData.append('industryCategoryCode', params.industryCategoryCode)
        formData.append('currency', params.currency)
        formData.append('specId', params.specId)
        formData.append('specCardNo', params.specCardNo)
        formData.append('orderGoodsNum', params.orderGoodsNum)
        formData.append('riskInfo', params.riskInfo)
        formData.append('ip', params.ip)
        formData.append('expireTime', params.expireTime)
        formData.append('termInfo', params.termInfo)
        formData.append('specName', params.specName)
        formData.append('notifyUrl', params.notifyUrl)
        formData.append('payChannel', params.payChannel)
        formData.append('device', params.device)
        formData.append('goodsInfo', params.goodsInfo)
// JavaScript file-like 对象
var content = '<a id="a"><b id="b">hey!</b></a>' // 新文件的正文...
var blob = new Blob([content], {type: 'text/xml'})
formData.append('webmasterfile', blob)
var request = new XMLHttpRequest()
request.open('POST', 'https://wepay.jd.com/jdpay/saveOrder')
request.send(formData)
			},
			// 倒计时 -- 参数 times 单位为: s
			countDown(times) {
				var that = this
                if (times <= 0) {
                    that.isOutOfTime = true
                }
				// 每秒循环
			  let timerCtrl = setInterval(function() {
          // 取消 setInterval() 循环
			  if (times < 0) {
			  	console.log('pay timeout')
			    clearInterval(timerCtrl)
			    that.isOutOfTime = true
			  }
			    let hour = 0
			    let minute = 0
			    let second = 0
			    if (times > 0) {
			      hour = Math.floor(times / (60 * 60))
			      minute = Math.floor(times / 60) - (hour * 60)
			      second = Math.floor(times) - (hour * 60 * 60) - (minute * 60)
			    }
			    if (hour < 10) { hour = '0' + hour }
			    if (minute < 10) { minute = '0' + minute }
			    if (second < 10) { second = '0' + second }
			    // that.remainingTime = hour + ':' + minute + ':' + second
                that.orderDetail.restPayTime = hour + ':' + minute + ':' + second
			    times--
			  }, 1000)
			  // 取消 setInterval() 循环
			  // if (times <= 0) {
			  // 	console.log('timeout')
			  // 	alert('timeout')
			  //   clearInterval(timerCtrl)
			  // }
			},
            goWXPay() { /* eslint-disable */
                // wx.chooseWXPay({
                // timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                // nonceStr: '', // 支付签名随机串，不长于 32 位
                // package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                // signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                // paySign: '', // 支付签名
                // success: function (res) {
                // // 支付成功后的回调函数
                // alert('微信支付成功')
                // }
                // });
                console.log('微信支付')
                let index = this.getChannelIndex()
                if (this.paymentChannel[index].withholdChannelNo === this.signChannel.jdWithholdChannelNo) {
                console.log('>>>微信支付 >>>已配置京东支付代扣渠道 >>>京东代扣渠道检查...')
                this.jdPayAgreementCheck()
              } else if (this.paymentChannel[index].withholdChannelNo === this.signChannel.wxWithholdChannelNo) {
                console.log('>>>微信支付 >>>已配置微信支付代扣渠道 >>>微信代扣渠道检查...')
                 this.wxPayAgreementCheck()
              } else {
                // 执行微信支付
                console.log('>>>微信支付 >>>未配置代扣渠道 >>>调起微信支付...')
                // this.checkWXJSBridgeAndPay()
                this.getWXPayData()
              }
            },
            checkWXJSBridgeAndPay() {
              if (typeof WeixinJSBridge === 'undefined') {
                 console.log('WeixinJSBridge undefined')
                 if (document.addEventListener) {
                 console.log('document.addEventListener')
                 document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
                 } else if (document.attachEvent) {
                 console.log('document.attachEvent')
                 document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
                 document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
                 }
                 this.$store.commit('updateLoadingStatus', { isLoading: false })
              } else {
                console.log('onBridgeReady')
                this.onBridgeReady()
              }
            },
            onBridgeReady() {
              let that = this
              let timeStamp = parseInt(Date.parse(new Date()) / 1000) + ''
              console.log('appId === ' + this.wxPayData.appid)
              console.log('timeStamp === ' + timeStamp)
              let params = {
                'appId': this.wxPayData.appid,
                'timeStamp': timeStamp,
                'nonceStr': this.wxPayData.nonce_str,
                'package': 'prepay_id=' + this.wxPayData.prepay_id
              }
              this.$store.commit('updateLoadingStatus', { isLoading: true })
              this.$http.post('/wuzhu/payment/wxpay/paySign', params).then(res => {
              this.$store.commit('updateLoadingStatus', { isLoading: false })
                if (res.code === '00' && res.data) {
                    console.log('paySign success')
                    WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                     // 'appId': 'wx2421b1c4370ec43b',     // 公众号名称，由商户传入
                    'appId': res.data.appId,
                    // 'timeStamp': '1395712654',         // 时间戳，自1970年以来的秒数
                    'timeStamp': timeStamp,
                    // 'nonceStr': 'e61463f8efa94090b1f366cccfbbb444', // 随机串
                    'nonceStr': res.data.nonceStr,
                    'package': res.data.package,
                    'signType': res.data.signType,         // 微信签名方式
                    'paySign': res.data.paySign // 微信签名
              },
                function(res) {
                  if (res.err_msg === 'get_brand_wcpay_request:ok') { // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                    console.log('微信支付成功回调，但不保证绝对可靠, msg === ' + JSON.stringify(res))
                    that.$router.push({name: 'WXPaySuccess'})
                  } else {
                    console.log('wxError === ' + JSON.stringify(res))
                    // that.toastData.toastInfoMessage = JSON.stringify(res)
                    // that.toastData.toastShow = true
                  }
                }
              )
            } else {
                console.log('paySign failed, msg === ' + JSON.stringify(res))
                // that.toastData.toastInfoMessage = JSON.stringify(res)
                // that.toastData.toastShow = true
            }
            })
            },
            /*
            ** randomWord 产生任意长度随机字母数字组合
            ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
            ** xuanfeng 2014-08-28
            */
            randomWord(randomFlag, min, max) {
              let str = ''
              let range = min
              let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
              // 随机产生
              if (randomFlag) {
                range = Math.round(Math.random() * (max - min)) + min
              }
             for (let i = 0; i < range; i++) {
                let pos = Math.round(Math.random() * (arr.length - 1))
                str += arr[pos]
              }
             return str
            }
		    },
		components: {
			XButton,
            Toast
		}
	}
</script>

<style lang="less" rel="stylesheet/less">
	.wx-pay-cashing{
		height: 100%;
        background:rgba(245,245,245,1);
		.d-content{
			height: 100%;
			.count-down{
                background-color: white;
				position: relative;
				height: 105px;
				text-align: center;
				&>div{
					position: absolute;
				//	top: 50%;
			    left: 0px;
			    right: 0px;
			   // margin-top: -25px;
                margin-top: 18px;
                .box-pay-time {
                    font-size: 14px;
                    color: black;
                }
			    .remaining-time{
                    margin-top: 10px;
			    	color: #5b9ae3;
                    .order-time-number {
                      display: inline-block;
                      width:21px;
                      height:21px;
                      background:rgba(238,238,238,1);
                      text-align: center;
                      border-radius: 3px;
                      line-height: 21px;
                      color: #333333;
                      font-size: 16px;
                    }
                    .order-time-char {
                      width:21px;
                      height:21px;
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
			.goods-info{
                margin-bottom: 17px;
				background-color: white;
				height: 86px;
                padding: 20px 8px 20px 20px;
				.goods-img{
					float: left;
                    margin-right: 15px;
					// position: relative;
                    display: inline-block;
					width: 85px;
                    height: 85px;
                    background:rgba(238,238,238,1);
                    vertical-align: top;
					// margin-right: 15px;
					img{
					//	width: 57px;
				    // height: 57px;
				    // border-radius: 50%;
				    // position: absolute;
				    // top: 50%;
				    // margin-top: -29px;
				    // left: 14px;
                      width: 85px;
                      height: 85px;
					}
				}
				.goods-details{
                    margin-top: 5px;
                    // margin-right: 18px;
                    // display: inline-block;
                    // float: right;
					.payment-amount{
                        font-size: 12px;
						color: #888888;
                        span {
                           line-height: 28px;
                           vertical-align:middle;
                        }
                        .payment-price {
                            color: #FF4754;
                            font-size: 20px;
                        }
					}
				}
			}
			.payment-mode{
				&>div{
					background-color: white;
					height: 81px;
					margin: 1px 0px;
					.pay-left{
						float: left;
						height: 100%;
						min-width: 86%;
						.pay-left-img{
							float: left;
							position: relative;
							width: 81px;
							height: 100%;
							img{
							//  width: 28px;
						    //  height: 28px;
                              width: 46px;
                              height: 46px;
						      border-radius: 8px;
						      position: absolute;
						      // top: 50%;
                              top: 40%;
						      margin-top: -14px;
						      left: 14px;
							}
						}
						.pay-left-info{
							float: left;
							position: relative;
							height: 100%;
							&>div{
								position: relative;
					      top: 50%;
					      transform: translateY(-50%);
							}
							.info-details{
								color: #a6a6a6;
    						margin-top: -2px;
							}
						}
						.info-right{
							float: right;
							height: 100%;
							&>div{
								color: #a6a6a6;
								position: relative;
					      top: 50%;
					      transform: translateY(-50%);
							}
						}
					}
					.pay-right{
						float: right;
						height: 100%;
						.fs-checkbox-div{ // 点击选中 radio
							height: 100%;
						}
						.fs-checkbox{
				      display: none;
				      &:checked+label{
				        // border: 1px solid #cacece00;
                        border: 1px solid #FFDA29;
				        // .bg("~./gouxuan_selected");
				        span{
							    visibility: visible;
				        }
				      }
				      &+label{
				        margin-left: 10px;
				        margin-right: 10px;
				        margin-top: 10px;
				        margin-bottom: 10px;
				        // top: 5px;
                        top: 22px;
				        position: relative;
				        -webkit-appearance: none;
				        // background-color: #fafafa;
				        // border: 1px solid #4a90e2;
                        border: 1px solid #DDDDDD;
				        // box-shadow: 0 1px 2px rgba(0,0,0,0.05), inset 0px -15px 10px -12px rgba(0,0,0,0.05);
				        padding: 4px;
				        border-radius: 50px;
				        display: inline-block;
				        span{
				        	display: block;
				        	border-radius: 50%;
							// background: #4a90e2;
                            background: #FFC400;
				        	visibility: hidden;
				        	width: 11px;
							height: 11px;
				        }
				      }
				    }
					}
				}
			}
			.confirm-pay{
        position: absolute;
        bottom: 20px;
        left: 3.5%;
        right: 3.5%;
				width: 93%;
				button{
					background-color: #f2cf1b;
          height: 48px;
					.btn-price{
						margin-left: -3px;
					}
				}
			}
		}
		@media screen and (max-width: 286px) {
			.d-content{
				.payment-mode{
					&>div{
						.pay-left{
							min-width: 83%;
						}
					}
				}
			}
		}
	}

	// .class-wx-icon {
	// 	width: 46px;
	// 	height: 46px;
	// }

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
