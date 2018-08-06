<template>
	<!-- <div v-bind:class="{WXPaying1: isShow, WXPaying2: !isShow}"> -->
  <!-- <div v-bind:class="[{'WXPaying1': isShow}, {'WXPaying2': !isShow}]"> -->
  <div class="WXPaying">

		<div class="box-goods">
		  <div class="box-goodsImg">
        <img class="goods-img" v-bind:src="dataOrderFirstPayInfo.listImg">
		  </div>

      <div class="box-goodsDetail">
        <p class="goods-name">{{ dataOrderFirstPayInfo.shortName }}</p>

      	<p class="goods-price">商品价值：<span>{{ dataOrderFirstPayInfo.marketPrice }}</span>元</p>
      	<p class="goods-labels">
        <span class="label" v-for="item in dataOrderFirstPayInfo.specContentList.split(',')">
          {{ item }}
        </span>
        </p>
      </div>
		</div>

    <div class="box-userInfo clearFix">
      <div class="box-user-label">
        <p>收货信息</p>
      </div>
      <div class="box-user-name box-user">
        <span class="box-user-name-key box-user-key">姓名</span>
        <span class="box-user-name-value box-user-value">{{ dataOrderFirstPayInfo.receiverName }}</span>
      </div>
      <div class="box-user-phone box-user">
        <span class="box-user-phone-key box-user-key">手机号</span>
        <span class="box-user-phone-value box-user-value">{{ dataOrderFirstPayInfo.receiverTel }}</span>
      </div>
      <div class="box-user-address box-user">
        <span class="box-user-address-key box-user-key">收货地址</span>
        <span class="box-user-address-value box-user-value">{{ dataOrderFirstPayInfo.consigneeAddr }}</span>
      </div>
		</div>

    <div class="box-pay-type clearFix">
      <div class="box-pay-label">支付方式</div>
      <div class="box-pay-type-value">
        <span v-if="dataOrderFirstPayInfo.monthlyPayStyle.indexOf('0') !== -1" v-bind:class="['pay-type-span', {'pay-type-span-selected': dataLogic.isTerm}]" @click="!dataLogic.isTerm && paySelected(0)">按月支付</span>
        <span v-if="dataOrderFirstPayInfo.monthlyPayStyle.indexOf('1') !== -1" v-bind:class="['pay-type-span', {'pay-type-span-selected': !dataLogic.isTerm}]" @click="dataLogic.isTerm && paySelected(1)">一次支付</span>
      </div>
    </div>

    <div class="divider-1px"></div>

    <div class="box-pay-detail">
      <div class="box-pay-amount">
        <span class="pay-amount-key">支付金额</span>
        <span class="pay-amount-value">¥{{ dataLogic.isTerm ? dataOrderFirstPayInfo.termFirstPayAmt : dataOrderFirstPayInfo.firstAllPayAmt }}</span>
      </div>
      <div class="box-pay-detail-toggle" @click="toggleForm">查看明细</div>
    </div>


    <!-- <div class="box-payType" v-if="dataOrderFirstPayInfo.monthlyPayStyle === '0' || dataOrderFirstPayInfo.monthlyPayStyle === '1'">
      <div v-show="dataOrderFirstPayInfo.monthlyPayStyle === '0'" class="box-pay-type-item">
      <p class="pay-type-text">分期支付</p></div>
      <div v-show="dataOrderFirstPayInfo.monthlyPayStyle !== '0'" class="box-pay-type-item">
      <p class="pay-type-text">一次支付</p></div>
    </div> -->

    <!-- <div class="box-payType" v-if="dataOrderFirstPayInfo.monthlyPayStyle === '0,1'">
    <div class="box-term clearFix" @click="!dataLogic.isTerm && paySelected(0)">
      <p ref="refTerm" v-bind:class="['box-term-text', 'box-paystyle-tips', {'box-paystyle-selected': dataLogic.isTerm}]">按期支付</p>
    </div>

    <div class="divider-hor"></div>

    <div class="box-once clearFix" @click="dataLogic.isTerm && paySelected(1)">
      <p ref="refOnce" v-bind:class="['box-term-text', 'box-paystyle-tips', {'box-paystyle-selected': !dataLogic.isTerm}]">一次支付</p>
    </div>
    </div> -->

    <!-- <div class="divider-ver"></div> -->
    <!-- <div class="box-pay-first-amount">
      <div class="box-pay-first">
      <div ref="updatePayText">{{ dataLogic.monthlyPayText }}</div>
      </div>
      <div class="box-pay-amount">
        <div>
        {{ ((dataOrderFirstPayInfo.monthlyPayStyle === '0') || (dataOrderFirstPayInfo.monthlyPayStyle === '0,1' && dataLogic.isTerm)) ? dataOrderFirstPayInfo.termFirstPayAmt : dataOrderFirstPayInfo.firstAllPayAmt }}
        <span v-show="isShow" class="icon iconfont icon-xia" v-on:click="toggleForm"></span>
        <span v-show="!isShow" class="icon iconfont icon-shang" v-on:click="toggleForm"></span>
        </div>
      </div>
    </div> -->

    <div v-show="!isShow" class="boxFormGoodsInfo">
      <div class="box-form-item clearFix">
      <s>
      <div class="box-form-item-label box-linethrough">
        <p>原商品押金</p>
      </div>
      <div class="box-form-item-value box-linethrough">
        <p>{{ dataOrderFirstPayInfo.orderDepositAmt }}</p>
      </div>
      </s>
      </div>


      <div class="box-form-item clearFix">
      <div class="box-form-item-label">
        <p>信用免押后（到期返还）</p>
      </div>
      <div class="box-form-item-value">
        <p>{{ dataOrderFirstPayInfo.payDepositAmt }}</p>
      </div>
      </div>

      <div class="box-form-item clearFix">
      <div class="box-form-item-label">
        <p>当期租金</p>
      </div>
      <div class="box-form-item-value">
        <p>{{ dataLogic.isTerm ? dataOrderFirstPayInfo.firstRentAmt : dataOrderFirstPayInfo.orderRentAmt }}</p>
      </div>
      </div>

      <!-- 按期支付 -->
      <div v-show="(dataOrderFirstPayInfo.monthlyPayStyle === '0') || (dataOrderFirstPayInfo.monthlyPayStyle === '0,1' && dataLogic.isTerm)" v-for="(item, index) in dataOrderFirstPayInfo.firstFeeList" class="box-form-item clearFix">
      <div v-if="item.feeName.indexOf('违约金') === -1 && item.feeName.indexOf('滞纳金') === -1">
      <div class="box-form-item-label">
        <div>{{ item.feeName }}</div>
      </div>
      <div class="box-form-item-value">
        <div>{{ item.firstTermFeeAmt }}</div>
      </div>
      </div>
      </div>

      <!-- 订单支付 -->
      <div v-show="(dataOrderFirstPayInfo.monthlyPayStyle === '1') || (dataOrderFirstPayInfo.monthlyPayStyle === '0,1' && !dataLogic.isTerm)" v-for="item in dataOrderFirstPayInfo.oneAllPayFeeList" class="box-form-item clearFix">
      <div v-if="item.feeName.indexOf('违约金') === -1 && item.feeName.indexOf('滞纳金') === -1">
      <div class="box-form-item-label">
        <div>{{ item.feeName }}</div>
      </div>
      <div class="box-form-item-value">
        <div>{{ item.feeTotalAmt }}</div>
      </div>
      </div>
      </div>

      <div v-if="dataOrderFirstPayInfo.isQueryXiaobai === 1" class="box-form-item-xiaobai clearFix">
      <div>
        <p>已享受京东小白信用助力免押</p>
      </div>
      </div>
    </div>

    <div class="box-isAgree">
      <p class="input-tips" @click="agreementRadioClick">
      <input class="fs-checkbox" type="radio" name="agreementRadio" value="true" v-model="isAgree">
        <label for="agreementRadio">
          <span></span>
        </label>
        <span class="span-agreement">本人已阅读并同意签署</span>
        <span v-for="(item,index) in dataOrderFirstPayInfo.pdfFileList" :class="['rent-agreement', 'rent-agreement' + index]">《{{ item.templateName }}》</span>
        <!-- <span class="rent-agreement">《用户租赁及服务协议》</span> -->
        <!-- <span class="rent-addition-agreement">《用户租赁及服务协议之补充协议》</span> -->
        </p>
        <!-- 更新为html-pannel -->
    <!-- <fee-desc-alert :dialogTitle="dataAgreement.dialogTitle" :potocol-type="true" :dialogContent="dataAgreement.dialogContent" :showScrollBox="dataAgreement.showScrollBox" @sureBtnClick="agreementToggle()">
      <user-lease-service-agreements v-show="dataAgreement.index === 0 && dataAgreement.showScrollBox" slot="htmlPocotol"></user-lease-service-agreements>
      <user-lease-service-additional-agree v-show="dataAgreement.index === 1 && dataAgreement.showScrollBox" slot="htmlPocotol"></user-lease-service-additional-agree>
    </fee-desc-alert> -->

    <!--弹框出对应的协议,使用控件会阻塞线程-->
    <!-- 取消html-pannel加载协议,解决CORS问题 -->
    <!-- <html-pannel :protocolTitle="dataAgreement.dialogTitle" :showScrollBox="dataAgreement.showScrollBox" :url="dataAgreement.protocolUrl" @sureBtnClick="agreementToggle">
    </html-pannel> -->
    </div>

    <div>
      <p class="agreement-tip">首付资金支付后，因个人原因拒绝签收租赁物品，自愿承担损失。</p>
    </div>

		<div class="box-toPay">
			<x-button class="button-toPay" text="下一步" :gradients="['#f1cd37', '#f1cd37']" @click.native="toPayCash"></x-button>
		</div>

	</div>
</template>

<script>
	import { XHeader, Group, Cell, Tab, TabItem, XButton, CheckIcon, Flexbox, FlexboxItem, FormPreview } from 'vux'
  import feeDescAlert from './../FeeItemSubView/FeeDescAlert'
  import userLeaseServiceAgreements from './../Potocol/UserLeaseServiceAgreements'
  import userLeaseServiceAdditionalAgree from '../Potocol/UserLeaseServiceAdditionalAgree'
  import htmlPannel from './../FeeItemSubView/HtmlPannel'
	export default {
		name: 'WXPaying',
		components: {
			XHeader,
			Group,
			Cell,
			Tab,
			TabItem,
			XButton,
      CheckIcon,
      Flexbox,
      FlexboxItem,
      FormPreview,
      feeDescAlert,
      userLeaseServiceAgreements,
      userLeaseServiceAdditionalAgree,
      htmlPannel
		},
    data() {
      return {
        // No: 18059302938,
        isAgree: true,
        isShow: true,
        // 从服务器获取到的支付详情数据（宇明）
        dataOrderFirstPayInfo: {
          orderNo: '',    // 订单编码
          createDate: '',    // 订单创建时间(2018-05-09 12:45:48)
          monthlyPayStyle: '',    // 租金支付方式（0:按期支付，1:一次支付，或两者均有)
          marketPrice: '',    // 市场价
          signPrice: '',    // 商品签约价
          firstRentAmt: '',    // 首期租金
          orderRentAmt: '',    // 订单全部租金金额
          orderDepositAmt: '',    // 订单押金金额
          // orderCreditAmt: '',    // 订单授信金额
          payDepositAmt: '',    // 订单需支付押金金额
          isQueryXiaobai: '',    // 是否已查询小白(1)
          termFirstPayAmt: '',    // 分期支付首期支付金额
          firstAllPayAmt: '',    // 一次性支付金额
          // totalTerm: '',    // 租借期数
          // totalDays: '',    // 租借天数
          commodityNo: '',    // 商品编号
          categoryCode: '',    // 商品品类编号
          shortName: '',    // 商品品类短名称
          // premium: '',    // 商品溢价
          listImg: '',    // 商品品类列表图片编号
          categorySpecCodeList: '',    // 品类规格编号列表
          specContentList: '',    // 商品规格内容列表
          receiverName: '',    // 收货人姓名
          receiverTel: '',    // 收货人手机号
          consigneeAddr: '',    // 收货地址
          firstFeeList: [{       // 首期费用
            feeNo: '',     // 费用编码
            feeName: '',    // 费用名称(附加服务(按天,按期))
            feeTotalAmt: '',     // 费用总金额(240)
            firstTermFeeAmt: '',    // 首期费用金额(40)
            feeNature: ''     // 费用性质:01:费用，02:附加服务(02)
          }],
          oneAllPayFeeList: [{   // 一次性支付费用
            feeNo: '',    // 费用编码(FJFW02)
            feeName: '',    // 费用名称(附加服务(按天,按期))
            feeTotalAmt: '',   // 费用总金额(240)
            firstTermFeeAmt: '',    // 首期费用金额(40)
            feeNature: ''     // 费用性质:01:费用，02:附加服务(02)
          }]
          },
        // OrderListPage传过来的订单数据（卢强）
        dataOrderListPage: {
          orderNo: '',    // 从后台拿
          status: '',    // 订单状态
          bizStatus: '',    // 订单状态前缀code
          statusStr: '', // 订单状态
          createDate: '',  // 订单创建日期
          expireDate: '',  // 订单截止日期
          commodityNo: '', // 商品编号（后台获取）
          categoryCode: '',  // 商品编号（后台获取）
          shortName: '',  // 后台获取
          listImg: '',  // 后台获取
          specContentList: ''  // 后台获取
        },
        // OrderDetailPage传过来的数据（霜林）
        dataNewOrderDetailData: {
        },
        dataLogic: {
          isTerm: true,
          monthlyPayText: '首付应付'
        },
        dataAgreement: {
          dialogTitle: '',    // 《用户租赁及服务协议》 《用户租赁及服务协议之补充协议》
          dialogContent: '',
          showScrollBox: false,
          protocolUrl: '',
          index: ''
        }
      }
    },
    created() {
      // this.dataOrderListPage = this.$route.params
      // this.initData(this.$route.params)
    },
    mounted() {
      this.$store.commit('updateLoadingStatus', { isLoading: true })
      this.initData()
      this.getOrderDetail(this.dataOrderFirstPayInfo.orderNo)
    },
    methods: {
      initData() {
        // this.dataOrderFirstPayInfo.orderNo = params.orderNo
           this.dataOrderFirstPayInfo.orderNo = this.$store.state.orderNo
           // this.dataOrderFirstPayInfo.orderNo = '0012018052800111565854'
        // this.dataOrderFirstPayInfo.monthlyPayStyle = '0,1'    // 测试，可选择支付方式
        // this.dataOrderFirstPayInfo.orderNo = '0012018052200329225436'    // 测试订单，待支付状态
            // this.dataOrderFirstPayInfo.orderNo = '0012018052800111565854'
            // this.dataOrderFirstPayInfo.orderNo = '00120180526000000114416855'
            // this.dataOrderFirstPayInfo.orderNo = '00120180531M003491899608'
        // this.initPayCheck()
        console.log('orderNo === ' + this.dataOrderFirstPayInfo.orderNo)
      },
      agreementRadioClick(event) {
        console.log('>>> agreementRadioClick')
        let specClass = event.target.className.split(' ')[1]
        console.log('click === ' + specClass)
        if (event.target.className.split(' ')[0] !== 'rent-agreement') {
          this.isAgree = !this.isAgree
        } else {
          // switch (specClass.charAt(specClass.length - 1)) {
            // case '0':
              // this.dataAgreement.index = 0

              // break
            // case '1':
              // this.dataAgreement.index = 1
              // break
            let index = specClass.charAt(specClass.length - 1)
            this.dataAgreement.dialogTitle = this.dataOrderFirstPayInfo.pdfFileList[parseInt(index)].templateName
            this.dataAgreement.protocolUrl = this.dataOrderFirstPayInfo.pdfFileList[parseInt(index)].url
            if (this.dataAgreement.protocolUrl !== null && this.dataAgreement.protocolUrl.length !== 0) {
                this.agreementToggle(this.dataAgreement.protocolUrl)
            } else {
              this.$vux.alert.show({
                content: '协议url为空'
              })
            }
        }
      },
      agreementToggle(url) {
        // this.dataAgreement.showScrollBox = !this.dataAgreement.showScrollBox
        // 解决弹框跨域无法打开协议问题
        console.log('open Url === ' + url)
        window.open(url)
      },
      paySelected(index) {
        console.log('>>> paySelected')
        console.log('index === ' + index)
        if (index === 0) {
          this.dataLogic.isTerm = true
          // this.$refs.refTerm.style.color = '#f1cd37'
          // this.$refs.refOnce.style.color = '#333333'
          // this.dataLogic.monthlyPayText = '首期应付'
        } else {
          this.dataLogic.isTerm = false
          // this.$refs.refTerm.style.color = '#333333'
          // this.$refs.refOnce.style.color = '#f1cd37'
          // this.dataLogic.monthlyPayText = '总计应付'
        }
      },
      // initPayCheck() {
      //   let that = this
      //   alert('initPayCheck')
      //   alert('initPayCheck' + that.dataOrderFirstPayInfo.monthlyPayStyle)
      //   if (that.dataOrderFirstPayInfo.monthlyPayStyle === '0') {
      //     that.dataLogic.monthlyPayText = '首期应付'
      //     alert('initPayCheck' + that.dataLogic.monthlyPayText)
      //      // return '首期应付'
      //   } else if (that.dataOrderFirstPayInfo.monthlyPayStyle === '1') {
      //     this.dataLogic.monthlyPayText = '总计应付'
      //     alert('initPayCheck' + that.dataLogic.monthlyPayText)
      //      // return '总计应付'
      //   } else if (that.dataOrderFirstPayInfo.monthlyPayStyle === '0,1') {
      //      // return this.dataLogic.isTerm?'首期应付':'总计应付'
      //      that.dataLogic.monthlyPayText = that.dataLogic.isTerm ? '首期应付' : '总计应付'
      //      alert('initPayCheck' + that.dataLogic.monthlyPayText)
      //   }
      // },
      toPayCash() {
      console.log('toPayCash')
      if (this.isAgree) {
        // 支付方式划分：按期支付(term)，一次支付(once)
        let payStyleSelected = this.dataLogic.isTerm ? '0' : '1'
        this.$store.commit('payStyleMemory', { payStyle: payStyleSelected })
        let payAmount = 0
        if (this.dataOrderFirstPayInfo.monthlyPayStyle === '0' || (this.dataOrderFirstPayInfo.monthlyPayStyle === '0,1' && this.dataLogic.isTerm)) {
            payAmount = this.dataOrderFirstPayInfo.termFirstPayAmt
        } else {
            payAmount = this.dataOrderFirstPayInfo.firstAllPayAmt
        }
        let item = {
          'orderNo': this.dataOrderFirstPayInfo.orderNo,
          'payAmount': payAmount
        }
        this.$store.commit('updateOrderNo', { orderNo: this.dataOrderFirstPayInfo.orderNo })
        this.$store.commit('updatePayAmount', { payAmount: payAmount })
        this.$store.commit('updateDeductionAmount', { deductionAmount: 0 })
        this.$store.commit('updateRouteSource', { routeSource: 'WXPaying' })
        this.$router.push({name: 'WXPayCashing', params: item})
      } else {
        this.$vux.alert.show({
          content: '请先阅读并同意相关租赁协议'
        })
      }
    },
      toggleForm() {
        this.isShow = !this.isShow
      },
      getOrderDetail(orderNo) {
        // 从 yaog 接口 调取到yuming 的接口
        console.log('getOrderDetail & orderNo === ' + orderNo)
        this.$http.get('/wuzhu/order/getOrderFirstPayInfo?orderNo=' + orderNo).then(res => {
          this.$store.commit('updateLoadingStatus', { isLoading: false })
          if (res.code === '00') {
            // this.data = res.data
          console.log('getOrderFirstPayInfo success')
          // 暂无数据
          this.dataOrderFirstPayInfo = res.data
          if (this.dataOrderFirstPayInfo.monthlyPayStyle === '1') {
            this.dataLogic.monthlyPayText = '总计应付'
            this.dataLogic.isTerm = false
          }
        } else if (res.code === '1001') {
          // console.log('code === ' + res.code + ',getOrderPayInfo failed')
          this.$vux.alert.show({
            content: res.msg
          })
        } else {
          console.log('code === ' + res.code + ',getOrderPayInfo failed')
        }
        })
      }
    }
	}
</script>

<style lang="less">

	.WXPaying2 {
    // width: 100%;
    height: 100%;
    position: absolute;
    background-color: #f5f5f5
	}

  .WXPaying1 {
    // width: 100%;
    height: 100%;
    position: absolute;
    // position: relative;
    background-color: #f5f5f5
  }

  .WXPaying {
    // height: 100%;
    // position: absolute;
    width: 100%;
     background-color: #f5f5f5;
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



  // .box-goodsDetail {
  // 	height: 200px;
  // 	width: 200px;
  // 	float: right;
  // }

  // .goods-img {
  //   float: right;
  // }

  // .goods-name {
  // 	float: right;
  // }
}

.goods-img {
  width: 90px;
  height: 90px;
  // border: 1px solid #F5F5F5;
}

.box-divider {
  	height: 1px;
  	background-color: grey;
  }

  .box-goodsImg {
    padding: 15px 12px 15px 18px;
    width: 85px;
    height: 85px;
    float: left;
    // display: inline-block;
    // vertical-align: top;
  }

  .goods-img {
    width: 85px;
    height: 85px;
  }

  .box-goodsDetail {
    // display: inline-block;
    // float: left;
     padding: 15px 18px 20px 0
  }

  .box-goods {
  	background-color: white;
    margin-top: 18px;
    height: 126px;
  //	padding-bottom: 18px;
  }

  .goods-name {
  	color: black;
  	font-size: 14px;
  }

  .goods-price {
    color: #999999;
    font-size: 0.8em;
    display: none
  }

  .goods-labels {
    margin-top: 20px;
  }

  .label {
  	color: black;
  	background-color: #F5F5F5;
  	font-size: 12px;
  	margin-right: 9px;
    padding: 2px 6px 2px 6px;
    border-radius: 3px;
  }

  .box-divider2 {
  	margin-top: 15px;
  	background-color: #EEEEEE;
  	height: 15px;
  }

  .divider-hor {
  	width: 1px;
  	background-color: #999999;
  	margin-top: 3px;
  	margin-bottom: 3px;
    // height: 100%;
    height: 34px;
    float: left;
    margin-left: 60px
  }

  .divider-ver {
    height: 1px;
    background-color: #999999
  }

  .box-toPay {
  	padding: 30px 15px;
    // height: 100%
  }

  .button-toPay {
    color: black!important;
    border-radius: 25px
  }

  .box-isAgree {
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 25px;
  font-size: 14px
}

.agreement-tip {
  color:rgba(136,136,136,1);
  font-size:14px;
  margin-top: 5px;
  margin-left: 40px;
  margin-right: 18px;
}

// 收货信息
.box-userInfo {
  height: 113px;
  margin-top: 18px;
  padding: 13px 18px 9px 18px;
  background-color: white;
  .box-user-label {
    width:64px;
    height:22px;
    font-size:16px;
    font-family:PingFangSC-Regular;
    color:black;
    line-height:22px;
  }
  .box-user {
    margin-top: 6px;
    color:rgba(136,136,136,1);
    white-space: nowrap;
    // font-size:0;
    .box-user-key {
      line-height: 14px;
      font-size: 14px;
      display: inline-block;
      width: 86px;
    }
    .box-user-value {
      line-height: 14px;
      font-size: 14px;
      display: inline-block;
    }
    .box-user-address-key {
       vertical-align: text-bottom;
    }
    .box-user-address-value {
       overflow: hidden;
       text-overflow: ellipsis;
       width: 240px;
       vertical-align: text-bottom;
    }
  }
}

// 支付方式
.box-pay-type {
  background-color: white;
  height: 80px;
  margin-top: 18px;
  padding-top: 15px;
  padding-left: 18px;
}
.box-pay-label {
  display: block;
  font-size: 16px;
  line-height: 22px;
  height: 22px;
  color: black;
}

.pay-type-span {
  margin-top: 12px;
  display: inline-block;
  width: 106px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #111111;
  font-size: 12px;
  border: 1px solid #dddddd;
  border-radius: 6px;
}

.pay-type-span-selected {
  margin-top: 12px;
  display: inline-block;
  width: 106px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #111111;
  font-size: 12px;
  border: 1px solid #FFDA29;
  border-radius: 6px;
  background-color: #FEF7B3;
}

// 分割线
.divider-1px {
  background-color: white;
  height: 1px;
  width: 18px;
}

// 支付金额与明细查询

.box-pay-detail {
  position: relative;
  background-color: white;
  height: 54px;
  padding-top: 16px;
  padding-left: 18px;
}

.box-pay-amount {
  height: 22px;
}

.pay-amount-key {
  height: 22px;
  line-height:22px;
  color: black;
  font-size: 16px;
}

.pay-amount-value {
  position: absolute;
  right: 18px;
  height: 22px;
  line-height:22px;
  color:rgba(255,71,84,1);
  font-size: 16px;
}

.box-pay-detail-toggle {
  margin-top: 3px;
  position: absolute;
  right: 18px;
  font-size:12px;
  color:rgba(92,153,244,1);
}

.box-pay-type-item {
  font-size: 14px;
  padding-top: 15px;
  padding-left: 150px
}

.box-pay-type-one {
  float: left;
  margin-left: 65px;
}

.box-payType {
  margin-top: 15px;
  background-color: #ffffff;
  // height: 50px;
  height: 40px;
  color: #666666;
  }

.box-pay-type-two {
  float: right;
  margin-right: 65px;
}

.box-pay-divider {
  float: left;
  width: 1px;
  margin-left: 65px;
  margin-top: 2px;
  // margin-bottom: 2px;
  background-color: #666666;
  height: 46px;
}

.box-pay-first-amount {
  background-color: white;
  // margin-top: 1px;
  font-size: 14px;
  height: 40px;
}

.box-pay-first {
  float: left;
  padding-top: 8px;
  color: #333333;
  padding-left: 15px;
}

// .box-pay-amount {
//  float: right;
//  color: #333333;
//  padding-top: 8px;
//  padding-right: 10px;
// }

.box-form-item {
  font-size: 14px;
  color: #666666;
}

.box-form-item-label {
  float: left;
  padding-left: 15px;
}

.box-form-item-value {
  font-size: 14px;
  float: right;
  padding-right: 15px;
}

.box-form-item-xiaobai {
  padding-left: 15px;
  font-size: 12px;
  color: #999999
}

.boxFormGoodsInfo {
  box-shadow: 0 2px 6px 0 #DADADA;
  border: 1px solid #EEEEEE;
}

.box-term {
  float: left;
  padding-left: 60px
}

.box-once {
  float: left;
  padding-left: 60px
}

.box-paystyle-tips {
  color: #333333;
  font-size: 12px;
  padding-top: 10px
}

.span-agreement {
  color:rgba(136,136,136,1);
  font-size:14px;
}

.rent-agreement {
  color: #5C99F4
}

.rent-addition-agreement {
  color: #5C99F4
}

.box-paystyle-selected {
  color: #f1cd37
}

.box-linethrough {
  text-decoration: line-through;
}

.fs-checkbox{
  display: none;
  &:checked+label{
    border: 1px solid #FFDA29;
    span{
      visibility: visible;
    }
  }
  &+label{
    top: 3px;
    position: relative;
    -webkit-appearance: none;
    // background-color: #fafafa;
    // border: 1px solid #4a90e2;
    border: 1px solid #DDDDDD;
    // box-shadow: 0 1px 2px rgba(0,0,0,0.05), inset 0px -15px 10px -12px rgba(0,0,0,0.05);
    padding: 2px;
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

.clearFix:after{clear:both;content:'.';height:0;display:block;visibility:hidden}

</style>
