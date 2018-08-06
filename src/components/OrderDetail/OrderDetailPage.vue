<template>
  <div class="OrderDetailPage">
    <!--<x-header :left-options="{backText: ''}">订单详情</x-header>-->
    <!--商品详情部分模块-->
    <div class="OrderDetail_Status_Plane">
      <div class="OrderDetail_Status_Plane_Header OrderDetail_Shadow">
        <div class="OrderDetail_Status_Plane_Section">
          <div class="OrderDetail_Status_Plane_Section_Title">订单编号</div>
          <div class="OrderDetail_Status_Plane_Section_Value line-limit-length">{{ orderDetail.orderNo }}</div>
        </div>
        <div class="OrderDetail_Status_Plane_Section2">
          <div class="OrderDetail_Status_Plane_Section2_Header">
            <div class="OrderDetail_Status_Plane_Section2_Header_Title">{{ statusTitle }}</div>
            <div class="OrderDetail_Status_Plane_Section2_Header_desc">{{ statusDesc }}</div>
          </div>
        </div>
        <!--商品具体参数部分模块-->
        <div class="OrderDetail_Status_Plane_Section3" v-if="showGoodsDetail">
          <div class="OrderDetail_Status_Plane_Section3_Cell" v-for="(gooditem, index) in goodsDetailList" :key="index">
            <div class="OrderDetail_Status_Plane_Section3_Cell_title">{{ gooditem.itemName }}</div>
            <div class="OrderDetail_Status_Plane_Section3_Cell_value">{{ gooditem.itemValue }}</div>
          </div>
          <div class="OrderDetail_CannelButton" v-show="isInWaitForConfirmedStatus">
            <x-button type="primary" action-type="button" @click.native="cancelOrderClick">取消订单</x-button>
          </div>
        </div>
        <div class="OrderDetail_Status_Plane_Arrow" @click="showOrderGoodsClick">
          <i v-bind:class="arrowShowGoodsDetailClasssOject"></i>
        </div>
      </div>
      <div class="OrderDetailPage_Content" v-show="showBillDetailEnable">
        <!--Tab选择 包含 账单信息 + 租赁信息 -->
        <tab :line-width=3 custom-bar-width="60px"  active-color='#FFDA29' v-model="orderPlanIndex">
          <tab-item class="vux-center" :selected="orderPlanIndex === item" v-for="(item, index) in orderMenuList"
                    @click="orderPlaneDefault = item" :key="index">{{item}}
          </tab-item>
        </tab>
        <!--账单信息部分菜单-->
        <div v-show="orderPlanIndex===0">
          <div class="OrderDetailPage_Content_BillInfo OrderDetail_Content_Common OrderDetail_Shadow"
               v-show="isWaitForConfirmedStatus">
            <!--待确认和首期账单部分展示如下图-->
            <div class="OrderDetailPage_Content_BillInfo_Section">
              <div class="OrderDetailPage_Content_Cell" v-for="(billItem, billIndex) in waitForConfirmedList"
                   :key="billIndex">
                <span class="OrderDetailPage_Content_Cell_Title">{{ billItem.feeName }}</span>
                <span class="OrderDetailPage_Content_Cell_Value" v-html="billItem.feeValue"></span>
              </div>
            </div>


            <!--<div class="OrderDetailPage_Content_BillInfo_Section" v-show="!isInWaitForConfirmedStatus">-->
            <!--<div class="OrderDetailPage_Content_Plane_Title">账期1/12</div>-->
            <!--<div class="OrderDetailPage_Content_Plane_Time">2018.02.02-2018.03.02</div>-->
            <!--<div class="OrderDetailPage_Content_Plane_PayStatus">已支付</div>-->
            <!--</div>-->
            <!--<div class="OrderDetailPage_Content_Cell">-->
            <!--<apan class="OrderDetailPage_Content_Cell_Title">押金</apan>-->
            <!--<apan class="OrderDetailPage_Content_Cell_Value">￥2999.00</apan>-->
            <!--</div>-->
          </div>
          <!--显示账单还款部分的界面构建-->
          <div class="OrderDetailPage_BillInfo_repaymentPlan OrderDetail_Shadow" v-show="!isWaitForConfirmedStatus">
            <swiper height="275px" :show-dots="false" v-model="termIndex" @on-index-change="swiperChange">
              <swiper-item class="ScrollerImageItem" v-for="(termItem, termIndex) in repaymentPlanList" :key="termIndex">
                <!--<div class="OrderDetailPage_Content_Cell" v-for="(billItem, billIndex) in termItem.Array"-->
                <!--:key="billIndex">-->
                <!--<span class="OrderDetailPage_Content_Cell_Title">{{ billItem.feeName }}</span>-->
                <!--<span class="OrderDetailPage_Content_Cell_Value" v-html="billItem.payAmt"></span>-->
                <!--</div>-->
                <div class="OrderDetailPage_Content_Cell OrderDetail_Bottom_1px">
                  <div class="OrderDetailPage_Content_Cell_Title">{{ billTitleShowDesc(termItem) }}</div>
                  <div class="OrderDetailPage_Content_Cell_Value">{{ billPaymentStausDesc(termItem) }}</div>
                </div>
                <div class="OrderDetailPage_Content_Cell">
                  <div class="OrderDetailPage_Content_Cell_Title">租期</div>
                  <div class="OrderDetailPage_Content_Cell_Value">{{ termItem.termDays }}天</div>
                </div>
                <!--<div class="OrderDetailPage_Content_Cell">-->
                  <!--<span class="OrderDetailPage_Content_Cell_Title">应付款日期</span>-->
                  <!--<span class="OrderDetailPage_Content_Cell_Value">{{ termItem.termStartDate }}</span>-->
                <!--</div>-->
                <div class="OrderDetailPage_Content_Cell">
                  <div class="OrderDetailPage_Content_Cell_Title">待付款金额</div>
                  <div class="OrderDetailPage_Content_Cell_Value">￥{{ termItem.OwingMonty }}</div>
                </div>
                <div class="OrderDetailPage_Content_Cell OrderDetail_Bottom_1px">
                  <div class="OrderDetailPage_Content_Cell_Title">付款时间</div>
                  <div class="OrderDetailPage_Content_Cell_Value">{{ termItem.payDate }}</div>
                </div>
                <div class="OrderDetailPage_Content_Cell" @click="showBillFeeDetailClick(termItem)">
                  <div class="OrderDetailPage_Content_Cell_Title">应付款金额</div>
                  <div class="OrderDetailPage_Content_Cell_Value">￥{{ termItem.totalMoney }}<i v-bind:class="arrowShowBillFeeDetail"></i></div>
                </div>
              </swiper-item>
            </swiper>
            <div class="OrderDetailPage_OneBill_Detail" v-show="showBillFeeDetail">
              <div class="OrderDetailPage_OneBill_JDCoin" v-show="jdQuery">已享受京东小白信用免押</div>
              <div class="OrderDetailPage_Content_Cell" v-for="(feeItem, feeIndex) in oneBillList" :key="feeIndex">
                <div class="OrderDetailPage_Content_Cell_Title">{{ getRepaymentFeeName(feeItem) }}</div>
                <div class="OrderDetailPage_Content_Cell_Value" >
                  <span v-show="isInLeasingOrDueSoonStatus">￥</span>
                  <span v-html="feeItem.payAmt" style="margin-right: -6px"></span>
                </div>
              </div>
              <!--<div class="OrderDetailPage_OneBill_Desc">-->
                <!--<span>费用说明</span>-->
                <!--<i class="icon iconfont icon-help1"></i>-->
              <!--</div>-->
            </div>
          </div>
          <div class="OrderDetailPage_BillInfo_ServicePlan OrderDetail_Shadow" v-show="showTrailTableEnable">
            <div class="OrderDetailPage_BillInfo_ServicePlan_plane">
              <div class="OrderDetailPage_BillInfo_ServicePlan_Section" @click="showPlaneDetailClick()">
                <div>租金及服务费支付计划</div>
                <i v-bind:class="arrowShowPlanDetailClasssOject"></i>
              </div>
              <fee-trial-table :feeTrialList="feeTrialList" :curDate="curDate" :goodReturnDate="myDate" v-show="showPlanDetail"></fee-trial-table>
            </div>
          </div>
        </div>
        <!--租赁信息的详细信息部分-->
        <div class="OrderDetailPage_Content_LeaseInfo OrderDetail_Content_Common OrderDetail_Shadow"
             v-show="orderPlanIndex===1">
          <div class="OrderDetailPage_Content_Cell" v-for="(leaseTtem, leaseindex) in leaseInfoList" :key="leaseindex">
            <div class="OrderDetailPage_Content_Cell_Title">{{ leaseTtem.itemName }}</div>
            <div class="OrderDetailPage_Content_Cell_Value">{{ leaseTtem.itemValue }}</div>
          </div>
          <div class="OrderDetailPage_Content_LeaseInfo_ProtocolPlane">
            <div class="OrderDetailPage_Content_LeaseInfo_ProtocolPlane_Title">{{ protocolsList.groupName }}</div>
            <div class="OrderDetailPage_Content_LeaseInfo_ProtocolPlane_Array">
              <div class="OrderDetailPage_Content_LeaseInfo_ProtocolPlane_Array_Item"
                   v-for="(pItem, pIndex) in protocolsList.groupArray" :key="pIndex"
                   @click="protocolClick(pItem)">
                《{{ pItem.templateName }}》
              </div>
            </div>
          </div>
          <div class="OrderDetailPage_Content_LeaseInfo_Address">
            <div class="OrderDetailPage_Content_LeaseInfo_Address_Item" v-for="(userItem, userindex) in userInfoList"
                 :key="userindex">
              <div class="OrderDetailPage_Content_LeaseInfo_Address_Title">{{ userItem.itemName }}</div>
              <div class="OrderDetailPage_Content_LeaseInfo_Address_Value">{{ userItem.itemValue }}</div>
            </div>
          </div>
        </div>
        <!--根据不同的状态显示不同的按钮-->
        <div class="OrderDetailPage_ButtonPlane" v-show="!isInWaitForConfirmedStatus">
          <flexbox>
            <flexbox-item v-for="(menuTtem, menuIndex) in buttonList" :key="menuIndex">
              <x-button  @click.native="menuButtonClick(menuTtem)">{{ menuTtem }}<i class="icon iconfont icon-time" style="margin-left: 20px" v-show="isShowDiscount">{{ payDiscountBtnStr }}</i></x-button>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
      <toast v-model="showToast" type="text" width="20em">{{ toastContent }}</toast>
      <actionsheet v-model="cancelReasonShow" :menus="cancelReasonList" show-cancel
                   @on-click-menu="cancelReasonClick"></actionsheet>
    </div>
    <div class="OrderDetail_More_Suggest" v-show="!showBillDetailEnable">
      <!--// 一期不做，先隐藏 TODO 二期再打开-->
      <div class="OrderDetail_More_Suggest_Header" v-show="false">更多推荐</div>
      <grid :cols="2" class="popularGoodPlane">
        <grid-item v-for="(item, index) in suggestGoodsList" :key="index" class="popularGoodItem">
          <div class="popularGoodItemDiv" v-on:click="goodsClick(index, item)">
            <img :src="item.listImg" class="popularGoodItem-image" slot="icon" />
            <span class="phoneGoodItem-desc">iPhoneX 全新国行</span>
            <span class="phoneGoodItem-price">￥{{ item.leastRentDay }}/天起</span>
          </div>
        </grid-item>
      </grid>
    </div>
    <!--弹框出对应的协议,使用控件会阻塞线程-->
    <!--<html-pannel :protocolTitle="protocolTitle" :showScrollBox="protocolShow" :url="protocolUrl" @sureBtnClick="protocolPluginSureClick">-->
    <!--</html-pannel>-->
  </div>
</template>

<script>
  import {
    XHeader,
    Group,
    Cell,
    Tab,
    TabItem,
    XButton,
    Flexbox,
    FlexboxItem,
    XTable,
    Swiper,
    SwiperItem,
    Actionsheet,
    Grid,
    GridItem,
    Toast
  } from 'vux'
  import feeTrialTable from './../FeeItemSubView/FeeTrialTable'
  import { getFeeDescStr, getTimerStr, getTrailTableList, getPayStayleEnum } from './../../wuzhuUtil/wuzhuUtil'
  import htmlPannel from './../FeeItemSubView/HtmlPannel'

  // 还款计划的枚举
  let repaymentStatus = {}
  repaymentStatus.WaitPayment = 1         // 待还款
  repaymentStatus.AlreadyPayment = 3      // 已还清
  repaymentStatus.Overdue = 4             // 逾期

  // 对当前的订单类型进行枚举
  let orderStatus = {}
  orderStatus.WaitForConfirmed = 1       // 待确认
  orderStatus.WaitForPayment = 2        // 待支付
  orderStatus.AlreadyPayment = 3        // 已支付
  orderStatus.WaitForConsignment = 5    // 待发货
  orderStatus.AlreadyConsignment = 6    // 已经发货
  orderStatus.Leasing = 7               // 租赁中
  orderStatus.DueSoon = 8               // 即将到期
  orderStatus.Completed = 99            // 已完成
  orderStatus.Canneled = 4              // 已取消

  class OrderDetail {
    constructor(props) {  // 请传入对应服务器给定的json
      let commodity = props && props['commodity']
      this.shortName = commodity && commodity['fullName']                                // 商品名称
      this.specContentList = commodity && commodity['specContentList']                      // 商品规格列表<TODO> 多个规格用逗号隔开
      this.listImg = commodity && commodity['listImg']                                   // 商品图片列表
      this.signPrice = commodity && commodity['marketPrice']         // 商品的市场价值
      this.serviceFeeList = props && props['serviceFeeList']         // 附加服务列表，此处费用显示逻辑和商品详情部分一致
      this.isQueryXiaobai = props && props['isQueryXiaobai']         // 是否京东小白免押
      this.restPayTime = props && props['restPayTime']               // 订单剩余的支付时间
      // this.premium = props['premium']               // 商品溢价
      let billInfo = props && props['billInfo']        // 账单信息
      this.orderDepositAmt = billInfo && billInfo['orderDepositAmt']   // 押金金额
      this.orderCreditAmt = billInfo && billInfo['orderCreditAmt']     // 授信金额
      this.payDepositAmt = billInfo && billInfo['payDepositAmt']       // 需要支付的押金金额
      // 首期相关的部分
      this.firstRentAmt = billInfo && billInfo['firstRentAmt']          // 首期租金
      this.orderRentAmt = billInfo && billInfo['orderRentAmt']           // 全部租金金额
      this.feeAmt = billInfo && billInfo['feeAmt']                      // 租金金额<订单全部租金 orderRentAmt> //订单费用总金额， 需要根据费用表计算出来
      // 首期费用总金额和一次应该支付的总金额
      this.termFirstPayAmt = billInfo && billInfo['termFirstPayAmt']    // 分期需要支付的总金额
      this.onepayAmt = billInfo && billInfo['onepayAmt']                //  一次性付款需要支付的总金额
      // 时间支付时间
      this.OwingMoney = billInfo && billInfo['waitPayAmt']              // 未支付金额= 首期费用-首期实际支付金额
      this.payDay = billInfo && billInfo['actualPayTime']               // 付款时间 = 首期支付时间
      this.totalDays = billInfo && billInfo['totalDays']                // 租赁的总天数
      // 首期的支付时间
      this.firstActualPayTime = props && props['firstActualPayTime']    // 首期的支付时间
      // 首期部分的时间和日期
      this.firstFeeList = props['firstFeeList']       // 首期的费用列表   feeName firstTermFeeAmt

      this.isQueryXiaobai = props && props['isQueryXiaobai']                    // 京东小白分 是否查询了小白分
      this.orderNo = props && props['orderNo']               // 订单编号
      this.createDate = props['createDate']                  // 订单生成时间
      this.expireDate = props['expireDate']                  // 订单到期时间
      let statusStr = props['bizStatus']                     // 当前订单的装填
      this.status = parseInt(statusStr)
      // 日均租金 从订单产品表中获取
      this.dayAvgRentAmt = props && props['dayAvgRentAmt']   // 每日的租金
      this.restPayTime = props['restPayTime']                // 订单剩余支付时间
      //  ===============
      this.overdualAount = props['overdualAount']     // 逾期欠款
      this.totalTerm = props['totalTerm']             // 租赁期数
      this.repaymentPlanList = props['repaymentPlanList']   // 还款计划
      this.serviceFeeList = props['serviceFeeList']    // 附加服务列表
      this.monthlyPayDay = props['monthlyPayDay']      // 每月支付日
      // 租赁信息部分
      let rentInfo = props && props['rentInfo']
      this.rentStarTime = rentInfo && rentInfo['rentStartDate']         // 起租时间
      this.rentEndTime = rentInfo && rentInfo['expireDate']            // 到期时间
      this.actualRentPayStyle = rentInfo && rentInfo['payStyle']       //  支付方式
      this.receiverName = rentInfo && rentInfo['receiverName']        // 收件人姓名
      this.receiverTel = rentInfo && rentInfo['receiverTel']          // 收件人手机号
      this.consigneeAddr = rentInfo && rentInfo['consigneeAddr']      // 收件人地址
      // 收件人相关的信息
      this.pdfFileList = props['pdfFileList']          // 租赁协议的列表  templateName url
      // 推荐的商品列表<一期先不做> props['listCommodityCategory']
      this.listCommodityCategory = []
    }
    // 检测该账单是否已经归还<1表示已经还款，而表示还未还款>
    // 用于检测是否还款情况
    //   repaymentStatus.WaitPayment = 1         // 待还款
    //   repaymentStatus.AlreadyPayment = 3      // 已还清
    //   repaymentStatus.Overdue = 4             // 逾期
    isPaymentNormal(feeItem) {
      let feePaymentStatus = feeItem && feeItem['paymentStatus']
      if (parseInt(feePaymentStatus) === repaymentStatus.AlreadyPayment) {
        return true
      } else {
        return false
      }
    }
    // 根据还款期数进行排序的函数
    // 根据对应的推荐细数来指定对应的排序内容
    sortPaymentPlanList(originList) {
      let sortList = originList
      if ((originList !== undefined) && (originList instanceof Array)) {
        // 决定最终的比较顺序
        function sortMethod(item0, item1) {  // eslint-disable-line
          let re0 = parseInt(item0.term)
          let re1 = parseInt(item1.term)
          if (re0 > re1) {
            return 1
          }
          if (re0 < re1) {
            return -1
          }
          return 0
        }
        sortList = originList.sort(sortMethod)
      }
      return sortList
    }
    // 判断一个订单中是否存在着逾期，以及
    // 对当前的还款计划进行统一封装处理,给定一个 list 进行处理成需要的格式
    dealWithPaymentPlanList() {
      let repaymentPlanList = this.repaymentPlanList
      let myPayPlanList = []
      if ((repaymentPlanList !== undefined) && (repaymentPlanList instanceof Array)) {
        for (let i = 0; i < repaymentPlanList.length; i++) {
          let subTermItem = repaymentPlanList[i]
          let exist = false
          for (let j = 0; j < myPayPlanList.length; j++) {
            let termItem = myPayPlanList[j]
            if (subTermItem.term === termItem.term) {
              termItem.Array.push(subTermItem)
              termItem.totalMoney += parseFloat(subTermItem['payAmt'])
              let payStyle = subTermItem && parseInt(subTermItem['paymentStatus'])
              termItem.OwingMonty += parseFloat(subTermItem['principalBalanceAmt'])
              termItem.paymentStatus = parseInt(payStyle)
              exist = true
              break
            }
          }
          if (exist === false) {
            let sunArray = []
            sunArray.push(subTermItem)
            let totalMoney = parseFloat(subTermItem['payAmt'])
            let OwingMonty = 0
            OwingMonty = parseFloat(subTermItem['principalBalanceAmt'])
            let payStyle = subTermItem && parseInt(subTermItem['paymentStatus'])
            let paymentStatus = parseInt(payStyle)
            myPayPlanList.push({
              term: subTermItem.term,                     // 第几期
              termStartDate: subTermItem.termStartDate,   // 应付款日期
              payDate: subTermItem.payDate,              // 付款时间
              delayPayDate: subTermItem.delayPayDate,
              termDays: subTermItem.termDays,             //  改天的期数
              totalMoney: totalMoney,                     //  总金额
              OwingMonty: OwingMonty,                     //  欠费的钱
              paymentStatus: paymentStatus,               // 中文的待还款
              Array: sunArray
            })
          }
        }
      }
      // 进行排序之后再导出来你
      let sortPlanList = this.sortPaymentPlanList(myPayPlanList)
      return sortPlanList
    }

    // 根据当前的状态返回对应的状态信息
    getCurrentStatusDesc() {
      let statusDesc = null
      switch (this.status) {
        case orderStatus.WaitForConfirmed: {
          statusDesc = '待确认'
          this.statusDesc = '您的租赁订单已经预约成功，请耐心等待后台审核，审核结果会及时告知，请保持电话畅通'
          break
        }
        case orderStatus.WaitForPayment: {
          statusDesc = '待支付'
          this.statusDesc = '您的订单已审核通过，请尽快完成支付，超过24小时未支付订单将失效'
          break
        }
        case orderStatus.AlreadyPayment: {
          statusDesc = '已支付'
          this.statusDesc = '您的租赁订单已经首付完成，平台将尽快为您安排发货，请耐心等待，注意发货通知短信哦，若有疑问，请致电客服：400-839-6296'
          break
        }
        case orderStatus.WaitForConsignment: {
          statusDesc = '待发货'
          this.statusDesc = '您的租赁订单已经首付完成，平台将尽快为您安排发货，请耐心等待，注意发货通知短信哦，若有疑问，请致电客服：400-839-6296'
          break
        }
        case orderStatus.AlreadyConsignment: {
          statusDesc = '已发货'
          this.statusDesc = '您租赁的商品已经出库，快递正在派送'
          break
        }
        case orderStatus.Leasing: {
          statusDesc = '租赁中'
          this.statusDesc = '您的商品已经收货完成，尽情享用吧！'
          break
        }
        case orderStatus.DueSoon: {
          statusDesc = '即将到期'
          this.statusDesc = '您的订单还差2天就要到期了，请提前安排机器的使用计划'
          break
        }
        case orderStatus.Completed: {
          statusDesc = '已完成'
          this.statusDesc = '您的订单已审核通过，请尽快完成支付，超过24小时未支付订单将失效'
          break
        }
        case orderStatus.Canneled: {
          statusDesc = '已取消'
          this.statusDesc = '您的租赁订单已取消，不妨看看还有没有其他心仪的产品'
          break
        }
        default: {
          console.log('某一订单状态，处于一个未知状态，请注意===================')
          this.statusDesc = '您的订单已审核通过，请尽快完成支付，超过24小时未支付订单将失效'
        }
      }
      return statusDesc
    }

    // 根据当前的状态获取对应按钮的列表
    getCurrentMenuList() {
      let menuList = []
      switch (this.status) {
        case orderStatus.WaitForConfirmed: {
          menuList.push('取消订单')
          break
        }
        case orderStatus.WaitForPayment: {
          menuList.push('支付')
          break
        }
        case orderStatus.AlreadyConsignment: {
          menuList.push('查看物流')
          break
        }
        case orderStatus.Leasing: {
          menuList.push('维修')
          let payStyle = getPayStayleEnum(this.actualRentPayStyle)
          if (payStyle === 0) {  // 如果是分期或者可以使分期或者一次性支付
            menuList.push('支付')
          }
          break
        }
        case orderStatus.DueSoon: {
          menuList.push('维修')
          let payStyle = getPayStayleEnum(this.actualRentPayStyle)
          if (payStyle === 0) {  // 如果是分期或者可以使分期或者一次性支付
            menuList.push('支付')
          }
          break
        }
        case orderStatus.Canneled: {
          // menuList.push('更多推荐')
          break
        }
        default: {
          break
        }
      }
      return menuList
    }

    // 得到租金的字符串
    getGoodsDetailLeaseStr() {
      let leasePrice = '日均￥' + this.dayAvgRentAmt + ' * ' + this.totalDays
      return leasePrice
    }

    // 得到意外保障对应字符串（目前是写死的，TODO）
    getAccidentPromiseStr() {
      let promise = '日均￥1.1 * 360天'
      return promise
    }
    // 获取该商品的附加服务列表
    getServiceFeeList() {
      let serviceFeeList = []
      if ((this.serviceFeeList !== undefined) && (this.serviceFeeList instanceof Array)) {
        for (let i = 0; i < this.serviceFeeList.length; i++) {
          let feeItem = this.serviceFeeList[i]
          let feeDesc = getFeeDescStr(feeItem)
          serviceFeeList.push({
            itemName: feeItem.feeName,
            itemValue: feeDesc
          })
        }
      }
      return serviceFeeList
    }

    // 商品详情的列表呈现
    getGoodsDetailList() {
      let goodsDescList = [
        {
          itemName: '下单时间',
          itemValue: this.createDate
        },
        {
          itemName: '商品',
          itemValue: this.shortName
        },
        {
          itemName: '规格',
          itemValue: this.specContentList
        },
        {
          itemName: '租金',
          itemValue: this.getGoodsDetailLeaseStr()
        },
        {
          itemName: '市场价值',
          itemValue: '￥' + this.signPrice
        }
      ]
      // 此处需要添加附加服务的列表
      let serviceFeeList = this.getServiceFeeList()
      if (serviceFeeList.length) {
        for (let i = 0; i < serviceFeeList.length; i++) {
          goodsDescList.push(serviceFeeList[i])
        }
      }
      return goodsDescList
    }

    // 获取对应的菜单展示
    getDisplayMenuList() {
      return ['账单信息', '租赁信息']
    }

    // 是否存在着溢价
    isPremiumOK() {
      if (this.premium !== undefined) {
        return true
      } else {
        return false
      }
    }

    // 得到首期账单的支付状态文字
    //   repaymentStatus.WaitPayment = 1         // 待还款
    //   repaymentStatus.AlreadyPayment = 3      // 已还清
    //   repaymentStatus.Overdue = 4             // 逾期
    getFirstBillStatus() {
      if (this.status === orderStatus.WaitForPayment) {
        return repaymentStatus.WaitPayment       // 待还款
      } else {
        return repaymentStatus.AlreadyPayment    // 已支付
      }
    }

    // 获取首期账单的列表
    getWaitForConfirmedList() {
      let firBillList = []
      switch (this.status) {
        case orderStatus.WaitForConfirmed: {
          firBillList.push({
            feeName: '原商品押金',
            feeValue: '<span style="text-decoration: line-through">' + '￥' + this.orderDepositAmt + '</span>'
          })
          firBillList.push({
            feeName: '信用免押后',
            feeValue: '<span style="color:red">' + '等待审核' + '</span>'
          })
          firBillList.push({
            feeName: '租期',
            feeValue: this.totalDays + '天'
          })
          break
        }
        case orderStatus.WaitForPayment:      // 待支付，到 租赁前展示的页面是一致的
        case orderStatus.WaitForConsignment:
        case orderStatus.AlreadyConsignment:
        case orderStatus.Leasing:
        case orderStatus.DueSoon:
        case orderStatus.Canneled:
        default:
          break
      }
      return firBillList
    }

    // 获取还款计划
    getPaymentList() {
      let that = this
      let payMentPlanList = []
      switch (this.status) {
        case orderStatus.WaitForConfirmed: {
          break
        }
        case orderStatus.WaitForPayment:      // 待支付，到 租赁前展示的页面是一致的
        case orderStatus.AlreadyPayment:      // 已经支付
        case orderStatus.WaitForConsignment:
        case orderStatus.AlreadyConsignment: {
          // 拼凑首期的还款计划
          let totalMoney = null
          let payStyle = getPayStayleEnum(this.actualRentPayStyle)
          if (payStyle === 1) {  // 如果是分期或者可以使分期或者一次性支付
            totalMoney = this.onepayAmt
          } else {               // 一次性付款的总金额
            totalMoney = this.termFirstPayAmt
          }
          let firstFeeList = that.firstFeeList
          let feeArray = []
          // 开始压入对应的 押金， 实际支付的押金  当前租金
          feeArray.push({
            feeName: '原商品押金',
            payAmt: '<span style="text-decoration: line-through">' + '￥' + this.orderDepositAmt + '</span>'
          })
          feeArray.push({
            feeName: '信用免押后(到期返还)',
            payAmt: '￥' + this.payDepositAmt
          })
          // 当前租金和总租金 如果是一次性支出
          if (payStyle === 1) {
            feeArray.push({
              feeName: '当期租金',
              payAmt: '￥' + this.orderRentAmt
            })
          } else {   // 如果是分期支付
            feeArray.push({
              feeName: '当期租金',
              payAmt: '￥' + this.firstRentAmt
            })
          }
          if ((firstFeeList !== undefined) && (firstFeeList instanceof Array)) {
            for (let i = 0; i < firstFeeList.length; i++) {
              let subItem = firstFeeList[i]
              feeArray.push({
                feeName: subItem['feeName'],
                payAmt: '￥' + subItem['firstTermFeeAmt']
              })
            }
          }
          let paypayDate = that.firstActualPayTime
          let billStatus = that.getFirstBillStatus()
          if (billStatus === repaymentStatus.WaitPayment) {   // 支付状态为未支付
            paypayDate = '--'
          }
          let termObj = {
            term: '首期账单',                             // 第几期
            termStartDate: that.payDay,                 // 应付款日期
            payDate: paypayDate,                        // 付款时间
            delayPayDate: ' ',                          //  逾期时间
            termDays: that.totalDays,                   //  改天的期数
            totalMoney: totalMoney,                     //  总金额
            OwingMonty: that.OwingMoney,                //  欠费的钱
            paymentStatus: billStatus,
            Array: feeArray
          }
          payMentPlanList.push(termObj)
          break
        }
        case orderStatus.Leasing:
        case orderStatus.DueSoon: {
          // 租赁中和即将过期是一致
          payMentPlanList = this.dealWithPaymentPlanList()
          break
        }
        case orderStatus.Canneled:  // 返回为空
        default:
          break
      }
      return payMentPlanList
    }
    // 得到试算的列表
    getTrialPaymentList() {
      return this.dealWithPaymentPlanList()
    }

    // 取消订单的弹框内容写死部分<根据actionSheeet改写>
    getCancelReason() {
      let reasonList = ['我不想租了', '商品规格写错了', '收货地址写错了', '支付有问题', '收货地址有问题', '我要重新下单', '其他']
      let sheetList = []
      let headerTitle = '您确定要取消该订单吗?<br/><span style="color:#666;font-size:12px;">请选择取消订单的理由,以完成取消</span>'
      sheetList.push({
        label: headerTitle,
        type: 'info'
      })
      for (let i = 0; i < reasonList.length; i++) {
        let label = reasonList[i]
        sheetList.push({
          label: label,
          type: 'Primary'
        })
      }
      return sheetList
    }

    // 获取具体的租赁方式 '0,1' 一次性支付还是分期支付，如果二者都存在那么表示分期或者一次性支付
    // 0 表示分期  1 表示一次性支出   2表示一次性支付或者分期支付 3 后台没有返回对应的字段
    getLeaseStyleDesc() {
      let payStyle = getPayStayleEnum(this.actualRentPayStyle)
      let payDesc = ''
      switch (payStyle) {
        case 0:  // 0 表示分期
        {
          payDesc = '按月分期'
          break
        }
        case 1:  // 1 表示一次性支出
        {
          payDesc = '一次性支付'
          break
        }
        case 2: //  2表示一次性支付或者分期支付
        {
          payDesc = '按月分期或一次性支付'
          break
        }
        default: break
      }
      return payDesc
    }

    // 获取租赁信息的列表
    getLeaseInfoList() {
      let rentStarTime = this.rentStarTime
      let rentEndTime = this.rentEndTime
      // 如果是在租赁中的状态之前，那么就显示固定的起租时间和到期时间
      if (this.status < orderStatus.Leasing) {
        rentStarTime = '收货后次日'
        rentEndTime = '收货日+租期时间'
      }
      let leaseInfoList = [
        {
          itemName: '起租时间',
          itemValue: rentStarTime
        },
        {
          itemName: '到期时间',
          itemValue: rentEndTime
        },
        {
          itemName: '支付方式',
          itemValue: this.getLeaseStyleDesc()
        }
      ]
      return leaseInfoList
    }

    // 获取租赁中具体的服务协议
    getProtocolInfoList() {
      // 根据当前的订单状态栏返回
      let protocolList = []
      if (this.status === orderStatus.WaitForConfirmed) {
        let currentPath = window.location.href.split('/dist')[0] + '/dist'
        protocolList.push({
          templateName: '用户租赁及服务协议',
          url: currentPath + '/static/protocolHtml/用户租赁及服务协议（金达主体）.htm'
        })
        protocolList.push({
          templateName: '用户租赁及服务协议之补充协议',
          url: currentPath + '/static/protocolHtml/用户租赁及服务协议之补充协议（金达主体）.htm'
        })
      } else {
        protocolList = this.pdfFileList
      }
      let ProtocolInfoList = {
        groupName: '租赁协议',
        groupArray: protocolList
      }
      return ProtocolInfoList
    }

    // 获取用户的基本信息列表
    getUserInfoList() {
      let userInfoList = [
        {
          itemName: '联系人',
          itemValue: this.receiverName
        },
        {
          itemName: '联系电话',
          itemValue: this.receiverTel
        },
        {
          itemName: '收货地址',
          itemValue: this.consigneeAddr
        }
      ]
      return userInfoList
    }
  }

  // ========================= 常量数据部分 ======================================
  export default {
    name: 'OrderDetailPage',
    components: {
      XHeader,
      Group,
      Tab,
      TabItem,
      Cell,
      XButton,
      Flexbox,
      FlexboxItem,
      XTable,
      Swiper,
      SwiperItem,
      Actionsheet,
      feeTrialTable,
      Grid,
      GridItem,
      Toast,
      htmlPannel
    },
    data() {
      return {
        orderNo: '',           // 订单编号
        orderDetail: {},
        statusTitle: '',
        status: 0,
        statusDesc: '',
        orderPlanIndex: 0,
        orderPlaneDefault: '账单信息',
        // 对应于菜单选项 其实就是 账单信息 + 租赁信息
        orderMenuList: [],
        // 账单信息 根据不同订单来填写
        waitForConfirmedList: [],        //  待确认部分展示的列表信息
        repaymentPlanList: [],           //  租赁中以前显示的试算
        feeTrialList: [],                //  试算列表里面的信息
        trialTableGetAlready: false,     //  是否获取过获取对应的试算列表
        curDate: '',                     // 试算列表中当前时间 Date对象
        myDate: '',                       // 试算列表中的预计收货时间 Date对象
        oneBillList: [],                 //  具体某一期的账单详情
        // 对应的展示倒计时
        payDiscountBtnStr: '',
        // 租赁信息展示对应的列表部分
        leaseInfoList: [],               // 租赁信息列表
        protocolsList: {},               // 协议列表
        userInfoList: [],                // 用户详细信息的列表
        showGoodsDetail: false,
        showBillFeeDetail: false,        // 是否展示具体哪一区费用详情
        goodsDetailList: [],
        showPlanDetail: false,
        termIndex: 0,
        cancelReasonShow: false,
        buttonList: [],                  // 根据订单的状态来，展示对应的按钮
        cancelReasonList: [],
        suggestGoodsList: [],
        toastContent: '',
        showToast: false,
        // 是否京东小白免押<是否享受京东小白免押>
        jdQuery: false,
        // 订单剩余的支付时间
        restPayTime: '',
        // 定时器,展示为null
        timer: null,
        // 打开协议的标题
        protocolShow: false,
        protocolTitle: '',
        protocolUrl: ''
      }
    },
    created() {
      let that = this
      // 首先获取其他页面传递过来的订单编号
      let tempParam = this.$router.app._route.params

      console.log('传递过来的参数为: ' + JSON.stringify(tempParam))
      // 传递回来的订单号为空，那么不执行获取订单详情内容
      if (JSON.stringify(tempParam) === '{}') {
        that.orderNo = ''
        // 从Store里面获取
        that.orderNo = that.$store.state.orderNo
      } else {
        // 存储到Store里面
        that.orderNo = tempParam.orderNo
        that.$store.commit('updateOrderNo', {orderNo: that.orderNo})
      }
      // TODO 正式测试的时候，必须将该行注释 为了方便调试
      // that.orderNo = 'OR2018050360'
      let currentUrl = window.location.origin
      if (currentUrl.indexOf('192.168.2.2') !== -1) {
        // 如果找不到就说明本地环境<修改Store里面的openID>
        that.orderNo = '00120180518000000149408539'
      }
      if (that.orderNo !== '') {
        this.getHttpOrderDetail(that.orderNo)
      } else {
        // 订单号为空，弹出提示
        that.toastContent = '异常情况，订单为空，请检查跳转逻辑'
        that.showToast = true
      }
    },
    // 路由部分的处理，离开页面和进入页面的处理
    beforeRouteLeave(to, from, next) {
      if (this.timer !== null) {
        // 清除对应的定时器
        window.clearInterval(this.timer)
        this.timer = null
        console.log('已经取消了订单--------------的定时器')
      }
      next()
    },
    computed: {
      // 是否展示对应的倒计时
      isShowDiscount() {
        if (this.status === orderStatus.WaitForPayment) {
          return true
        } else {
          return false
        }
      },
      isInWaitForConfirmedStatus() {
        if (this.orderDetail.status === orderStatus.WaitForConfirmed) {
          return true
        } else {
          return false
        }
      },
      // 是否需要显示试算的列表
      showTrailTableEnable: function() {
        if (this.status < orderStatus.Leasing) {
          return true
        } else {
          return false
        }
      },
      // 是否显示账单详细信息的面板
      showBillDetailEnable: function() {
        if ((this.status === orderStatus.Completed) || (this.status === orderStatus.Canneled)) {
          return false
        } else {
          return true
        }
      },
      arrowShowGoodsDetailClasssOject: function() {
        return {
          'icon iconfont icon-xia': !this.showGoodsDetail,
          'icon iconfont icon-shang': this.showGoodsDetail
        }
      },
      arrowShowPlanDetailClasssOject: function() {
        return {
          'icon iconfont icon-xia': !this.showPlanDetail,
          'icon iconfont icon-shang': this.showPlanDetail
        }
      },
      arrowShowBillFeeDetail: function() {
        return {
          'icon iconfont icon-xia': !this.showBillFeeDetail,
          'icon iconfont icon-shang': this.showBillFeeDetail
        }
      },
      // 是否需要展示对应的首期账单
      isWaitForConfirmedStatus: function() {
        if (this.status === orderStatus.WaitForConfirmed) {
          return true
        } else {
          return false
        }
      },
      // 是否展示后面的单位，针对还款计划，也就是租赁中和即将到期
      // orderStatus.Leasing = 7               // 租赁中
      // orderStatus.DueSoon = 8               // 即将到期
      isInLeasingOrDueSoonStatus: function() {
        if (this.status === orderStatus.Leasing || this.status === orderStatus.DueSoon) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      // 协议部分被点击
      protocolClick: function(pItem) {
        console.log('====== 正在打开协议' + JSON.stringify(pItem))
        let url = pItem && pItem['url']
        if ((url !== null) && (url !== undefined)) {
          window.open(url)
        } else {
          this.toastContent = '后台返回的协议链接为空，无法打开该协议'
          this.showToast = true
          // 测试性的打开一个链接
          // let aurl = 'https://openapi.bestsign.info/openapi/v2/dist_v3/index.html#/donePage?developerId=1965831777222132321&data=FZiLywyKAh9Xywiiydj6jIf5mIv4nYf3mYDZnIjWnYjYnIfJkdiIA250DNeICfKLjIPJnsvZmInXpcnZmcbWncbXncbWjJXJCNKKC1q5DhvJpJiXDNu2Bxu3jJXJywGXBwiKrwrJpJjWmsj2psv3ncD5jJXJygaOjIPJnszXjJXJD2KMANuZjIPJDgK5zxO1ALbWmInVz29SjJXJDwuGAhK0Ftj6jIfXndi9'
          // window.open(aurl)
        }
      },
      // 还款计划等地方展示费用详情
      getRepaymentFeeName: function(feeItem) {
        let feeName = feeItem && feeItem.feeName
        if (feeName === null) {
          feeName = '租金'
        }
        return feeName
      },
      // 获取订单详情的内容
      getHttpOrderDetail: function(orderNo) {
        let that = this
        let param = {
          orderNo: orderNo   // 订单的编号
        }
        // let localUrl = '/src/TempData/OrderDetailData.json'
        // GET /order/getOrderDetail
        // let localUrl = '/src/TempData/newOrderDetailData.json'
        let orderDetailUrl = '/wuzhu/order/getOrderDetail'
        this.$store.commit('updateLoadingStatus', { isLoading: true })
        that.$http.get(orderDetailUrl, param).then((res) => {
          that.$store.commit('updateLoadingStatus', {isLoading: false})
          if (res.code === '00') {
            console.log('订单获取成功，订单详情为:' + res)
            let myOrderDetail = new OrderDetail(res.data)
            that.orderDetail = myOrderDetail
            that.orderMenuList = myOrderDetail.getDisplayMenuList()
            that.goodsDetailList = myOrderDetail.getGoodsDetailList()
            that.cancelReasonList = myOrderDetail.getCancelReason()
            that.statusTitle = myOrderDetail.getCurrentStatusDesc()
            that.leaseInfoList = myOrderDetail.getLeaseInfoList()
            that.protocolsList = myOrderDetail.getProtocolInfoList()
            that.userInfoList = myOrderDetail.getUserInfoList()
            that.statusDesc = myOrderDetail.statusDesc
            that.waitForConfirmedList = myOrderDetail.getWaitForConfirmedList()
            that.repaymentPlanList = myOrderDetail.getPaymentList()
            // 试算部分变成由单独的接口提供
            // that.feeTrialList = myOrderDetail.getTrialPaymentList()
            that.status = myOrderDetail.status
            that.buttonList = myOrderDetail.getCurrentMenuList()
            let jdQuery = myOrderDetail && myOrderDetail.isQueryXiaobai
            let restPayTime = parseInt(myOrderDetail && myOrderDetail.restPayTime)      // 订单剩余的支付时间
            let restPayTimeInt = parseInt(restPayTime / 1000)
            that.restPayTime = restPayTime
            that.jdQuery = (jdQuery === '1')
            // 判断下是否处于待支付状态，如果处于待支付状态就开启倒计时
            if (that.status === orderStatus.WaitForPayment) {
              if (!isNaN(restPayTimeInt)) {
                that.resetTime(restPayTimeInt)
              }
            }
            that.suggestGoodsList = myOrderDetail['listCommodityCategory']
          } else {
            let msg = res && res['msg']
            that.toastContent = msg
            that.showToast = true
            console.log('获取订单详情失败 ' + res)
          }
        })
      },
      // 每一期账单的抬头
      billTitleShowDesc: function(termItem) {
        if (termItem.term === '首期账单') {
          return '首期账单'
        } else {
          if (this.repaymentPlanList.length !== 0) {
            return termItem.term + '/' + this.repaymentPlanList.length + ' 账单'
          } else {
            return '首期账单'
          }
        }
      },
      // 根据对应的支付状态来展示对应的文字
      //   repaymentStatus.WaitPayment = 1         // 待还款
      //   repaymentStatus.AlreadyPayment = 3      // 已还清
      //   repaymentStatus.Overdue = 4             // 逾期
      billPaymentStausDesc(termItem) {
        if (termItem.paymentStatus === repaymentStatus.AlreadyPayment) {
          return '已支付'
        } else if (termItem.paymentStatus === repaymentStatus.Overdue) {
          return '已逾期'
        } else if (termItem.paymentStatus === repaymentStatus.WaitPayment) {
          return '待支付'
        } else {
          return ''
        }
      },
      // 箭头打开和关闭商品详情的函数
      showOrderGoodsClick() {
        if (this.showGoodsDetail) {
          this.showGoodsDetail = false
        } else {
          this.showGoodsDetail = true
        }
      },
      showPlaneDetailClick() {
        let that = this
        if ((this.trialTableGetAlready === false) && (this.showPlanDetail === false)) {
          // let feeInfoList = that.getHttpFeeList()
          // 判断下是否获取了对应商品详情等信息
          var curDate = new Date()         // 当前时间
          var myDate = new Date(curDate.getTime() + 24 * 4 * 60 * 60 * 1000)
          var myDateStr = myDate.Format('yyyy-MM-dd')
          that.curDate = getTimerStr(curDate)
          that.myDate = getTimerStr(myDate)
          let param = {
            startDay: myDateStr,
            orderNo: that.orderNo
          }
          let getPayRentPlanUrl = '/wuzhu/reservationController/getPayPlanForOrderDetail'
          that.$store.commit('updateLoadingStatus', { isLoading: true })
          that.$http.get(getPayRentPlanUrl, param).then((res) => {
            that.$store.commit('updateLoadingStatus', { isLoading: false })
            if (res.code === '00') {
              // 开始获取试算的信息
              let data = res['data']
              // 获取的对应的试算，并且进行数组转换
              that.feeTrialList = getTrailTableList(data)
              that.trialTableGetAlready = true
              this.showPlanDetail = true
            } else {
              // 错误信息的提示
              let errormsg = res['msg']
              that.toastContent = errormsg
              that.showPlanDetail = true
            }
          })
        } else {
          if (this.showPlanDetail) {
            this.showPlanDetail = false
          } else {
            this.showPlanDetail = true
          }
        }
      },
      // 点击具体查看每一期的费用详情
      showBillFeeDetailClick(termItem) {
        if (this.showBillFeeDetail) {
          this.showBillFeeDetail = false
          this.oneBillList = []
        } else {
          this.showBillFeeDetail = true
          this.oneBillList = termItem.Array
        }
      },
      // 按钮点击操作的处理<最下面>
      menuButtonClick(menuItem) {
        console.log('点击了==========' + menuItem)
        switch (menuItem) {
          // case '支付': {
          //   this.$router.push({name: 'WXPaying'})
          //   break
          // }
          case '维修': {
            this.$router.push({name: 'Service'})
            break
          }
          case '查看物流': {
            // 将订单详情存储到store里面
            this.$store.commit('updateOrderNo', {orderNo: this.orderNo})
            this.$router.push({name: 'LogisticsDetail'})
            break
          }
        }
        if (menuItem === '支付') {
          let item = {
              'orderNo': this.orderDetail.orderNo
            }
            this.$store.commit('updateOrderNo', { orderNo: this.orderDetail.orderNo })
          if (this.status === orderStatus.WaitForPayment) {
            // 待支付
            this.$router.push({name: 'WXPaying', params: item})
          } else if (this.status === orderStatus.Leasing) {
            // 租赁中
            // this.$router.push({name: 'WXPayOverpaying', params: item})
            console.log('暂不支持')
          }
        }
      },
      swiperChange() {
        this.showBillFeeDetail = false
      },
      // 取消订单单独一个函数来处理
      cancelOrderClick() {
        this.cancelReasonShow = true
      },
      // 选择取消理由弹框点击
      cancelReasonClick(key, item) {
        console.log(key, item)
        // 说明取消按钮被点击
        if (key === 'cancel' || item === undefined) {
          return
        }
        // 取消的理由不需要
        let that = this
        let param = {
          orderNo: that.orderNo,  // 订单的编号
          reason: item.label      //  取消的理由
        }
        // let localUrl = '/src/TempData/OrderDetailData.json'
        // GET /order/getOrderDetail
        // let localUrl = '/src/TempData/newOrderDetailData.json'
        let cancelOrderUrl = '/wuzhu/order/cancleOrder'
        this.$store.commit('updateLoadingStatus', { isLoading: true })
        that.$http.post(cancelOrderUrl, param).then((res) => {
          this.$store.commit('updateLoadingStatus', { isLoading: false })
          if (res.code === '00') {
            console.log('订单取消成功。。。。。。', res)
            // 开始获取对应的订单详情
            that.getHttpOrderDetail(that.orderNo)
          } else {
            let errorMsg = res && res['msg']
            that.toastContent = errorMsg
            that.showToast = true
          }
        })
      },
      // 拦截支付按钮的显示内容，此处只是针对支付按钮做处理
      buttonDisplayCheck(menuItem) {
        if ((menuItem === '支付') && (this.status === 1)) {
           return this.payBtnStr
        } else {
          return menuItem
        }
      },
      // 单纯分钟和秒倒计时
      resetTime(time) {
        let that = this
        that.timer = null
        var t = time
        function timeValueStr(timeValue) {
          let timeValueStr = ''
          if ((timeValue < 10) && (timeValue >= 0)) {
            timeValueStr = '0' + timeValue.toString()
          } else {
            timeValueStr = timeValue.toString()
          }
          return timeValueStr
        }
        function timelong2Str(timeLong) {
          let h = Math.floor(timeLong / 3600)
          let m = Math.floor(timeLong % 3600 / 60)
          // let s = Math.floor(timeLong % 60)
          let hStr = timeValueStr(h)
          let mStr = timeValueStr(m)
          // let sStr = timeValueStr(s)
          // return hStr + ':' + mStr + ':' + sStr
          return hStr + ':' + mStr
        }
        function countDown() {
          console.log('t === ' + t)
          if (t >= 0) {
            t = t - 60
            that.payDiscountBtnStr = timelong2Str(t)
          } else {
            window.clearInterval(that.timer)
          }
      }
        that.payDiscountBtnStr = timelong2Str(t)
        that.timer = window.setInterval(countDown, 60000)
    }
    }
  }
</script>

<style lang="less">
  @import "./../../common/less/index";
  .OrderDetailPage {
    background: white;
    font-family: 'PingFang SC';
    position: relative;

    // 阴影部分的统一方式设置
    .OrderDetail_Shadow {
      box-shadow: 0 2px 6px 0 #DADADA;
      border: 1px solid #EEEEEE;
    }
    // 公用的部分
    .OrderDetail_Content_Common {
      margin-top: 15px;
      /*margin-left: 15px;*/
      /*margin-right: 15px;*/
    }
    // 公用部分 增加对应的下滑线
    .OrderDetail_Bottom_1px{
      .border-1px();
    }

    .line-limit-length{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;      //文本不换行，这样超出一行的部分被截取，显示...
    }

    .vux-header {
      top: 0px !important;
      background-color: #FFFFFF !important;
      position: fixed !important;
      z-index: 100 !important;
      width: 100% !important;
    }
    .vux-header .vux-header-title {
      color: #222222 !important;
      font-size: 19px !important;
      font-family: 'PingFangSC-Regular' !important;
      background: white !important;
    }
    .OrderDetail_Status_Plane {
      position: relative;
      /*top: 40px;*/
      margin-left: 15px;
      margin-top: 15px;
      margin-right: 15px;
      margin-bottom: 15px;
      background: white;

      .OrderDetail_Status_Plane_Header {
        background: #FFFFFF;

        .OrderDetail_Status_Plane_Section {
          .border-1px();
          /*min-height: 50px;*/
          line-height: 50px;
          .OrderDetail_Status_Plane_Section_Title {
            margin-left: 15px;
            font-size: 14px;
            color: #9B9B9B;
            letter-spacing: 0;
            line-height: 20px;
            vertical-align: middle;
            display: inline-block;
          }
          .OrderDetail_Status_Plane_Section_Value {
            margin-left: 15px;
            font-size: 14px;
            color: #000000;
            letter-spacing: 0;
            line-height: 20px;
            vertical-align: middle;
            display: inline-block;
            max-width: 70%;
          }
        }
        .OrderDetail_Status_Plane_Section2 {
          .OrderDetail_Status_Plane_Section2_Header {
            margin-left: 15px;
            margin-right: 15px;

            .OrderDetail_Status_Plane_Section2_Header_Title {
              margin-top: 16px;
              font-size: 16px;
              color: #222222;
              letter-spacing: 0;
              line-height: 20px;
              margin-bottom: 15px;
            }
            .OrderDetail_Status_Plane_Section2_Header_desc {
              font-size: 13px;
              color: #4A4A4A;
              letter-spacing: 0;
              line-height: 20px;
              padding-bottom: 15px;
              .border-1px();
            }
          }
        }
        .OrderDetail_Status_Plane_Arrow {
          text-align: center;
          height: 50px;
          line-height: 50px;
          img {
            width: 30px;
            height: 16.4px;
            background: green;
          }
        }
        .OrderDetail_Status_Plane_Section3 {
          .OrderDetail_Status_Plane_Section3_Cell {
            min-height: 30px;
            line-height: 30px;
            .border-1px();
            position: relative;
            display: flex;
            .OrderDetail_Status_Plane_Section3_Cell_title {
              width: 80px;
              margin-right: 20px;
              font-size: 13px;
              color: #4A4A4A;
              letter-spacing: 0;
              margin-left: 15px;
            }
            .OrderDetail_Status_Plane_Section3_Cell_value {
              font-size: 13px;
              color: #4A4A4A;
              letter-spacing: 0;
              /*left: 100px;*/
            }
          }
        }
      }

      .OrderDetail_CannelButton {
        margin: 15px;
        .weui-btn_primary {
          border: 1px solid #9B9B9B;
          border-radius: 100px;
          background: white;
        }
        .weui-btn {
          color: #9B9B9B !important;
          font-size: 17px !important;
          text-align: center !important;
        }
      }

    }
    .OrderDetailPage_Content {
      margin-top: 15px;

      .OrderDetailPage_Content_BillInfo {
        position: relative;
        .OrderDetailPage_Content_BillInfo_Section {
          .OrderDetailPage_Content_Plane_Title {
            font-size: 16px;
            color: #000000;
            letter-spacing: 0;
            line-height: 20px;
            margin-left: 15px;
            margin-top: 10px;
          }
          .OrderDetailPage_Content_Plane_Time {
            margin-left: 15px;
            margin-top: 10px;
            margin-bottom: 10px;
          }
          .OrderDetailPage_Content_Plane_PayStatus {
            top: 50%;
            position: absolute;
            right: 15px;
            transform: translateY(-50%);
            font-size: 13px;
            color: #5C99F4;
            letter-spacing: 0;
            text-align: right;
            line-height: 15px;
          }
        }
      }

      // 公用的部分的Cell部分
      .OrderDetailPage_Content_Cell {
        display: flex;
        justify-content: space-between;
        margin-left: 15px;
        margin-right: 15px;
        min-height: 55px;
        line-height: 55px;
        font-size: 16px;
        color: #000000;
        /*position: relative;*/
        .OrderDetailPage_Content_Cell_Title {
          display: inline-block;
        }
        .OrderDetailPage_Content_Cell_Value {
          display: inline-block;
        }
      }

      .OrderDetailPage_Content_LeaseInfo {
        background: white;
        .OrderDetailPage_Content_LeaseInfo_ProtocolPlane {
          display: flex;
          justify-content: space-between;

          /*background: yellow;*/
          .OrderDetailPage_Content_LeaseInfo_ProtocolPlane_Title {
            font-size: 16px;
            color: #000000;
            letter-spacing: 0;
            line-height: 20px;
            padding-left: 15px;
          }
          .OrderDetailPage_Content_LeaseInfo_ProtocolPlane_Array {
            /*background: red;*/
            margin-left: 20px;
            margin-right: 15px;
            text-align: right;
            right: 15px;
            .OrderDetailPage_Content_LeaseInfo_ProtocolPlane_Array_Item {
              font-size: 14px;
              color: #5C99F4;
              letter-spacing: 0;
              line-height: 20px;
              margin-bottom: 10px;
            }
          }
          .vux-label {
            font-size: 14px !important;
            color: #5C99F4 !important;
            letter-spacing: 0 !important;
            line-height: 20px !important;
          }
        }
        .OrderDetailPage_Content_LeaseInfo_Address {
          margin-left: 15px;
          margin-right: 15px;
          margin-bottom: 15px;
          .OrderDetailPage_Content_LeaseInfo_Address_Item {
            margin-top: 17px;
            display: flex;
            justify-content: space-between;
            .OrderDetailPage_Content_LeaseInfo_Address_Title {
              min-width: 100px;
              font-size: 16px;
              color: #000000;
              letter-spacing: 0;
              line-height: 20px;
            }
            .OrderDetailPage_Content_LeaseInfo_Address_Value {
              right: 15px;
              top: 17px;
              font-size: 16px;
              color: #000000;
              letter-spacing: 0;
              line-height: 20px;
            }
          }
        }
      }

      .OrderDetailPage_BillInfo_repaymentPlan {
        margin-top: 15px;
        .OrderDetailPage_OneBill_Detail{
          .OrderDetailPage_OneBill_JDCoin{
            height: 55px;
            line-height: 55px;
            margin-left: 15px;
            font-size: 16px;
            color: #000000;
            letter-spacing: 0;
          }
          .OrderDetailPage_OneBill_Desc{
            height: 55px;
            line-height: 55px;
            text-align: right;
            margin-right: 15px;
            font-size: 16px;
            color: #000000;
          }
        }
      }

      .OrderDetailPage_BillInfo_ServicePlan {
        margin-top: 15px;
        .OrderDetailPage_BillInfo_ServicePlan_plane {
          margin-left: 15px;
          margin-right: 15px;

          .OrderDetailPage_BillInfo_ServicePlan_Section {
            height: 55px;
            line-height: 55px;
            text-align: center;
            display: flex;
            justify-content: space-between;
            div {
              text-align: center;
              height: 50px;
              line-height: 50px;
              font-size: 16px;
              color: #000000;
              letter-spacing: 0;
            }
            img {
              margin-top: 10px;
              width: 30px;
              height: 30px;
              background: green;
            }
          }
          .OrderDetailPage_BillInfo_ServicePlan_Table {
            font-size: 12px;
            color: #000;
            letter-spacing: 0;
            font-family: "PingFang SC";
          }
          .OrderDetailPage_BillInfo_TableHeader {
            height: 55px;
            line-height: 55px;
            text-align: center;
            display: flex;
            justify-content: space-between;
            .OrderDetailPage_BillInfo_TableHeader_Item {
              display: inline-block;
              font-size: 14px;
              color: #000000;
              letter-spacing: 0;
            }

          }

        }
      }

      .OrderDetailPage_ButtonPlane {
        margin-top: 30px;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .OrderDetailPage_ButtonPlane_Item {

        }

        .weui-btn_primary {
          border: 1px solid #9B9B9B;
          border-radius: 100px;
          background: white;
          margin-right: 10px;
        }
        .weui-btn {
          background: #FFDA29 !important;
          font-size: 17px !important;
          text-align: center !important;
          border-radius: 100px !important;
        }
      }
    }

    // 更多推荐部分
    .OrderDetail_More_Suggest{
      margin-top: 15px;
      .OrderDetail_More_Suggest_Header{
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: @orange;
      }
      .popularGoodPlane{
        .popularGoodItem{
          .popularGoodItemDiv{
            text-align: center;
            .popularGoodItem-image{
              width: 150px;
              height: 150px;
            }
            .phoneGoodItem-desc{
              font-size: 16px;
              color: #696D6F;
              letter-spacing: 0.5px;
              line-height: 20px;
            }
            .phoneGoodItem-price{
              font-size: 16px;
              color: #061927;
              letter-spacing: 0.34px;
              line-height: 18px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
</style>
