<template>
  <div class="OrderDetailNewPage">
    <!--订单状态部分-->
    <div class="orderStatus">
      <div style="display: flex; justify-content: space-between">
        <div class="statusTitle">{{orderDetail.statusTitle}}</div>
        <!--canShowRemainTime-->
        <div style="color: #888888; font-size: 10px;" v-show="canShowRemainTime">剩余时间:<span style="color: #FF4754; font-size: 14px">{{ payDiscountBtnStr }}</span></div>
      </div>
      <div class="statusDesc" v-html="orderDetail.statusDesc"></div>
    </div>
    <!--买断的面板展示-->
    <div class="buyoutPlane" v-show="buyoutPlaneShow">
      <div class="buyoutTitle">买断信息</div>
      <div class="buyout-flexBox">
        <div class="buyout-flexleft">买断支付</div>
        <div class="buyout-flexright">￥{{ orderBuyOutRecord.actualPayAmt }}</div>
      </div>
      <div class="buyout-detail" @click="buyOutDetailClick">
        查看明细
      </div>
      <div class="buyout-detail-plane" v-show="buyoutDetailShow">
        <div class="detailwrap">
          <div class="detailflex">
            <div class="detailflex-left">买断价</div>
            <div class="detailflex-right">￥{{ orderBuyOutRecord.buyOutPrice }}</div>
          </div>
          <div class="detailflex">
            <div class="detailflex-left">已支付租金</div>
            <div class="detailflex-right">￥{{ orderBuyOutRecord.payRentAmt }}</div>
          </div>
          <div class="detailflex">
            <div class="detailflex-left">已支付押金</div>
            <div class="detailflex-right">￥{{ orderBuyOutRecord.payDepositAmt }}</div>
          </div>
          <div class="detailflex" v-show="orderBuyOutRecord.overdualAmt !== 0">
            <div class="detailflex-left">滞纳金</div>
            <div class="detailflex-right">￥{{ orderBuyOutRecord.overdualAmt }}</div>
          </div>
          <div class="detailflex" v-show="orderBuyOutRecord.breachAmt !== 0">
            <div class="detailflex-left">违约金</div>
            <div class="detailflex-right">￥{{ orderBuyOutRecord.breachAmt }}</div>
          </div>
          <div class="detailflex">
            <div class="detailflex-left">账户抵扣</div>
            <div class="detailflex-right">￥{{ orderBuyOutRecord.accoutDeductionAmt }}</div>
          </div>
          <div class="detailflex">
            <div class="detailflex-left">实际支付</div>
            <div class="detailflex-right">￥{{ orderBuyOutRecord.actualPayAmt }}</div>
          </div>
        </div>
      </div>
      <div class="buyout-flexBox">
        <div class="buyout-flexleft">支付日期</div>
        <div class="buyout-flexright">{{ orderBuyOutRecord.payTime }}</div>
      </div>
    </div>
    <!--订单商品详情部分信息-->
    <div class="orderGoodsPlane">
      <!--商品部分信息-->
      <div class="goodsDetail">
        <div>订单详情</div>
        <div class="order-flexBox">
          <div class="order-flexBox-left">订单编号</div>
          <div class="order-flexBox-right line-limit-length" ref="orderNo">{{ orderDetail.orderNo }}</div>
        </div>
        <div class="order-flexBox">
          <div class="order-flexBox-left">下单时间</div>
          <div class="order-flexBox-right line-limit-length">{{ goodsDetail.createDate }}</div>
        </div>
        <div class="order-flexBox">
          <div class="order-flexBox-left">商品</div>
          <div class="order-flexBox-right line-limit-length">{{ goodsDetail.fullName }}</div>
        </div>
        <!--可以通过箭头隐藏的部分-->
        <div v-show="showGoodsDetail">
          <div class="order-flexBox" >
            <div class="order-flexBox-left">规格</div>
            <div class="order-flexBox-right line-limit-length">{{ goodsDetail.specContentList }}</div>
          </div>
          <div class="order-flexBox">
            <div class="order-flexBox-left">租金</div>
            <div class="order-flexBox-right line-limit-length">{{ goodsDetail.getGoodsDetailLease }}</div>
          </div>
          <!--附加服务列表-->
          <div>
            <div class="order-flexBox" v-for="(serviceFeeItem, index) in goodsDetail.serviceFeeList" :key="index">
              <div class="order-flexBox-left">{{ serviceFeeItem.itemName }}</div>
              <div class="order-flexBox-right line-limit-length">{{ serviceFeeItem.itemValue }}</div>
            </div>
          </div>
          <div class="order-flexBox">
            <div class="order-flexBox-left">市场价值</div>
            <div class="order-flexBox-right line-limit-length">￥{{ goodsDetail.marketPrice }}</div>
          </div>
          <!--<div class="cancelButton" v-show="false">-->
            <!--<x-button type="primary" action-type="button" @click.native="cancelOrderClick">取消订单</x-button>-->
          <!--</div>-->
        </div>
      </div>
      <!--下面的箭头-->
      <div class="arrow" @click="showOrderGoodsClick">
        <span v-if="showGoodsDetail">收起全部<i v-bind:class="arrowShowGoodsDetailClasssOject"></i></span>
        <span v-else>查看更多<i v-bind:class="arrowShowGoodsDetailClasssOject"></i></span>
      </div>
    </div>
    <!--订单详情部分-->
    <div class="orderDetail" v-show="showBillDetailEnable">
      <!--Tab选择 包含 账单信息 + 租赁信息 -->
      <tab :line-width=3 custom-bar-width="60px"  active-color='#FFDA29' v-model="orderPlanIndex">
        <tab-item class="vux-center" :selected="orderPlanIndex === item" v-for="(item, index) in orderMenuList"
                  @click="orderPlaneDefault = item" :key="index">{{item}}
        </tab-item>
      </tab>
      <!--租赁信息-->
      <div class="orderInfo" v-show="orderPlanIndex===1">
        <div class="order-flexBox">
          <div class="order-flexBox-left">起租时间</div>
          <div class="order-flexBox-right line-limit-length">{{ orderDetail.rentStarTime }}</div>
        </div>
        <div class="order-flexBox">
          <div class="order-flexBox-left">到期时间</div>
          <div class="order-flexBox-right line-limit-length">{{ orderDetail.rentEndTime }}</div>
        </div>
        <div class="order-flexBox">
          <div class="order-flexBox-left">支付方式</div>
          <div class="order-flexBox-right line-limit-length">{{ orderDetail.payStyleStr }}</div>
        </div>
        <div class="order-flexBox">
          <div class="order-flexBox-left">租赁协议</div>
          <div class="order-flexBox-right line-limit-length">
            <div class="protocol" v-for="(protocolItem, protocolIndex) in orderDetail.ProtocolInfoList" @click="protocolClick(protocolItem)" :key="protocolIndex">《{{ protocolItem.templateName }}》</div>
          </div>
        </div>
        <div class="order-flexBox">
          <div class="order-flexBox-left">联系人</div>
          <div class="order-flexBox-right line-limit-length">{{orderDetail.receiverName}}</div>
        </div>
        <div class="order-flexBox">
          <div class="order-flexBox-left">联系电话</div>
          <div class="order-flexBox-right line-limit-length">{{orderDetail.receiverTel}}</div>
        </div>
        <div class="order-flexBox">
          <div class="order-flexBox-left">收货地址</div>
          <div class="order-flexBox-right" ref="address">
            <span>{{orderDetail.consigneeAddr}}</span>
          </div>
        </div>
      </div>
      <!--账单信息-->
      <div v-show="orderPlanIndex===0">
        <!--待确认部分-->
        <div class="orderBillInfo" v-show="canShowSureOrderView">
          <div class="topSection bottom1pxline">
            <div class="BillflexBox top2line">
              <div class="BillflexBoxleft">原商品押金</div>
              <div class="BillflexBoxright">￥{{waitForConfirmedObject.orderDepositAmt}}</div>
            </div>
            <div class="BillflexBox top2line">
              <div class="BillflexBoxleft">信用免押后</div>
              <div class="BillflexBoxright">等待审核</div>
            </div>
          </div>
          <div class="BillflexBox flexBoxLast3line bottom1pxline">
            <div class="BillflexBoxleft flexBoxLeftLast3line">租期</div>
            <div class="BillflexBoxright flexBoxRightLast3line">{{waitForConfirmedObject.totalDays}}</div>
          </div>
          <div class="BillflexBox flexBoxLast3line" @click="showPlaneDetailClick">
            <div class="BillflexBoxleft flexBoxLeftLast3line">每期费用支付计划试算<i style="font-size: 14px; color:#888888;">(不含押金)</i></div>
            <div class="BillflexBoxright flexBoxRightLast3line"><i class="icon iconfont icon-help1" style="color: #007AFF; font-size: 14px"></i></div>
          </div>
        </div>
        <!--首期账单的展示页面，待支付到租赁中页面之前会使用到-->
        <div class="orderFirstBillInfo" v-show="canShowFirstBillView">
          <div class="topSection bottom1pxline">
            <div class="BillflexBox top2line">
              <div class="BillflexBoxleft">首期账单</div>
              <div class="BillflexBoxright">{{ billPaymentStausDesc(firstBillInfo) }}</div>
            </div>
            <div class="BillflexBox top2line">
              <div class="BillflexBoxleft">租期</div>
              <div class="BillflexBoxright">{{ firstBillInfo.termDays }}天</div>
            </div>
          </div>
          <div class="BillflexBox flexBoxLast3line">
            <div class="BillflexBoxleft flexBoxLeftLast3line" style="color:#333333; font-size: 16px">应付金额<span style="font-size: 14px; color:#888888;">(不含押金)</span></div>
            <div class="BillflexBoxright flexBoxRightLast3line" style="color:#FC2D43; font-size: 16px">￥{{ firstBillInfo.totalMoney }}</div>
          </div>
          <div class="feeDetail" @click="firstBillShowDetailClick">
            <span>查看明细</span>
          </div>
          <div class="feePlane" v-show="showFirstBillFeeDetial">
            <!--<div class="OrderDetailPage_OneBill_JDCoin" v-show="showJDCoinTitle">已享受京东小白信用免押</div>-->
            <div class="feeTrialTable_Content_Cell" v-for="(feeItem, feeIndex) in firstBillInfo.Array" :key="feeIndex">
              <span class="feeTrialTable_Content_Cell_Title">{{ getRepaymentFeeName(feeItem) }}</span>
              <span class="feeTrialTable_Content_Cell_Value" v-html="feeItem.payAmt "></span>
            </div>
          </div>
          <!--首期账单不需要展示应付款日期-->
          <!--<div class="BillflexBox  flexBoxLast3line bottom1pxline">-->
            <!--<div class="leftBox flexBoxLeftLast3line">应付款日期</div>-->
            <!--<div class="rightBox flexBoxRightLast3line">{{ firstBillInfo.termStartDate }}</div>-->
          <!--</div>-->
          <div class="BillflexBox flexBoxLast3line bottom1pxline">
            <div class="leftBox flexBoxLeftLast3line">待支付金额</div>
            <div class="rightBox flexBoxRightLast3line">￥{{ firstBillInfo.OwingMonty }}</div>
          </div>
          <div class="BillflexBox  flexBoxLast3line bottom1pxline">
            <div class="leftBox flexBoxLeftLast3line">付款时间</div>
            <div class="rightBox flexBoxRightLast3line">{{ firstBillInfo.payDate }}</div>
          </div>
          <div class="BillflexBox  flexBoxLast3line" @click="showPlaneDetailClick">
            <div class="BillflexBoxleft flexBoxLeftLast3line">每期费用支付计划试算<span style="font-size: 14px; color:#888888;">(不含押金)</span></div>
            <div class="BillflexBoxright flexBoxRightLast3line"><i class="icon iconfont icon-help1" style="color: #007AFF; font-size: 14px"></i></div>
          </div>
        </div>
        <!--还款计划页面的展示-->
        <div v-show="canShowRepaymentPlanView">
          <repayment-plan-scroller :repaymentPlanList="repaymentPlanList" :overDueShow="overDueShow" @overDueClick="overDuePayClick"></repayment-plan-scroller>
        </div>
      </div>
      <!--续租详情-->
      <div v-if="reletPaySuccess" class="releted-detail">
        <div class="item-section bottom1pxline">
          <div class="item-row">
            <div class="item-col">
              <div class="rd-label-1">续租</div>
            </div>
            <div class="item-col text-right">
              <div class="rd-label-2">已支付</div>
            </div>
          </div>
          <div class="item-row">
            <div class="item-col">
              <div class="rd-label-3">租金</div>
            </div>
            <div class="item-col text-right">
              <div class="rd-label-4">
                <del class="del" >￥{{reletDetailedVO.oldReletRentAmt|moneyFormat}}</del>
                ￥{{reletDetailedVO.reletRentAmt|moneyFormat}}/天
              </div>
            </div>
          </div>
          <div class="item-row">
            <div class="item-col">
              <div class="rd-label-3">租期</div>
            </div>
            <div class="item-col text-right">
              <div class="rd-label-4">{{reletDetailedVO.reletDay}}天</div>
            </div>
          </div>
          <div class="item-row">
            <div class="item-col"></div>
            <div class="item-col text-right">
              <div class="rd-label-5" v-if="reletDetailedVO.saveRentAmt>0">已省 ￥{{reletDetailedVO.saveRentAmt|moneyFormat}}</div>
            </div>
          </div>
        </div>
        <div class="item-section bottom1pxline">
          <template v-if="reletDetailedVO.trialRentPaymentScheduleList && reletDetailedVO.trialRentPaymentScheduleList.length > 0">
            <div
              v-for="feeItem in reletDetailedVO.trialRentPaymentScheduleList"
              :key="feeItem.feeNo"
              v-if="feeItem.feeNo"
              class="item-row">
              <div class="item-col">
                <div class="rd-label-3">{{feeItem.feeName}}</div>
              </div>
              <div class="item-col text-right">
                <div class="rd-label-3">￥{{feeItem.payAmt|moneyFormat}}</div>
              </div>
            </div>
          </template>
          <div class="item-row" v-if="reletDetailedVO.monthlyPayStyle === '0'">
            <div class="item-col">
              <div class="rd-label-3" >首期账单</div>
            </div>
            <div class="item-col text-right">
              <div class="rd-label-3">￥{{reletDetailedVO.firstRentAmt|moneyFormat}}</div>
            </div>
          </div>
          <div class="item-row" v-if="reletDetailedVO.monthlyPayStyle === '1'">
            <div class="item-col">
              <div class="rd-label-3">总额账单</div>
            </div>
            <div class="item-col text-right">
              <div class="rd-label-3">￥{{reletDetailedVO.totalRentAmt|moneyFormat}}</div>
            </div>
          </div>
          <div class="item-row">
            <div class="item-col">
              <div class="rd-label-3">账户抵扣</div>
            </div>
            <div class="item-col text-right">
              <div class="rd-label-3">￥{{reletDetailedVO.firstPayDeductibleAmt|moneyFormat}}</div>
            </div>
          </div>
        </div>
        <div class="item-section">
          <div class="item-row">
            <div class="item-col">
              <div class="rd-label-1">实际支付金额</div>
            </div>
            <div class="item-col text-right">
              <div class="rd-label-1">￥{{reletDetailedVO.firstActualPayAmt|moneyFormat}}</div>
            </div>
          </div>
          <div class="item-row">
            <div class="item-col">
              <div class="rd-label-3">支付日期</div>
            </div>
            <div class="item-col text-right">
              <div class="rd-label-3">{{reletDetailedVO.payDate}}</div>
            </div>
          </div>
          <div class="item-row">
            <div class="item-col">
              <div class="rd-label-3">续租生效日期</div>
            </div>
            <div class="item-col text-right">
              <div class="rd-label-3">{{reletDetailedVO.actualBeeffectiveDate}}</div>
            </div>
          </div>
        </div>
      </div>
      <!--原订单信息 relationOrderNo-->
      <div v-if="canShowOriginOrderPlane" class="old-order-no" @click="goToOldOrder()">
        <group>
          <cell title="原订单信息" is-link></cell>
        </group>
      </div>
    </div>
    <!--更多推荐 一期先不做-->
    <div></div>
    <!--占位的DIV间隔底部84px-->
    <!--按钮部分 fixed布局-->
    <div class="menuPlane" v-show="showBillDetailEnable">
      <div class="buttonPlaneWarp">
        <div class="buttonPlane">
          <div class="buttonwarp"
               v-show="canShowButton('取消订单')">
            <x-button type="primary" @click.native="cancelOrderClick">取消订单</x-button>
          </div>
          <div class="buttonwarp" v-show="canShowButton('维修')">
            <x-button type="primary" @click.native="menuButtonClick('维修')">维修</x-button>
          </div>
          <div class="buttonwarp" v-show="canShowButton('查看物流')">
            <x-button @click.native="menuButtonClick('查看物流')">查看物流</x-button>
          </div>
          <div class="buttonwarp" v-show="canShowButton('归还')">
            <x-button @click.native="menuButtonClick('归还')">归还</x-button>
          </div>
          <div class="buttonwarp" v-show="canShowButton('买断')">
            <x-button @click.native="menuButtonClick('买断')">{{buyOutBtnStr}}</x-button>
          </div>
          <div class="buttonwarp" v-show="canShowButton('续租')">
            <x-button @click.native="menuButtonClick('续租')">续租</x-button>
          </div>
          <div class="buttonwarp" v-show="canShowButton('支付')">
            <x-button @click.native="menuButtonClick('支付')">支付</x-button>
          </div>
        </div>
      </div>
    </div>
    <!--提示的弹框等等部分信息-->
    <toast v-model="showToast" type="text" width="20em">{{ toastContent }}</toast>
    <actionsheet v-model="cancelReasonShow" :menus="cancelReasonList" show-cancel
                 @on-click-menu="cancelReasonClick"></actionsheet>
    <!--试算部分的弹框-->
    <fee-trial-table-new :feeTrialList="feeTrialList" :curDate="curDate" :goodReturnDate="myDate" v-show="showTrialPlanDetail" @hideClick="trialPlanHideClick"></fee-trial-table-new>
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
  import feeTrialTableNew from './../FeeItemSubView/FeeTrialTableNew'
  import repaymentPlanScroller from './../FeeItemSubView/RepaymentPlanScroller'
  import { getFeeDescStr, getTimerStr, getTimerDotStr, getTrailTableList, getPayStayleEnum, getTimerDotStrWithTimeStr } from './../../wuzhuUtil/wuzhuUtil'
  import htmlPannel from './../FeeItemSubView/HtmlPannel'

  // 常用状态的枚举
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
  orderStatus.BuyOuting = 10            // 买断中-买断中
  orderStatus.Recycleing = 9            // 回收-回收中
  orderStatus.ReturnGoods = 8           // 退货中-退货中

  let buyOutStatus = {}
  buyOutStatus.OverDueBuyOut = '0'      // 超过逾期天数强制买断
  buyOutStatus.NoReturnBuyOut = '1'     // 未归还强制买断
  buyOutStatus.PreBuyout = '2'          // 提前买断
  buyOutStatus.NormalBuyOut = '3'       // 到达最后一期,正常买断
  buyOutStatus.CanNotBuyOut = '4'       // 不能买断

  class OrderDetail {
    constructor(props) {  // 请传入对应服务器给定的json
      // 增加按钮部分的
      this.orderButtons = props && props['orderButtons']                                // 获取需要按钮展示的状态

      // 增加订单的大状态
      let detailStatus = props && props['status']                                       // 获取订单的大状态 7004
      this.detailStatus = detailStatus
      this.statusDesc = props && props['statusDesc']                                    // 后台的状态描述 <完结-买断完结>
      this.orderType = props && props['orderType']                                      // 订单的类型
      let commodity = props && props['commodity']
      this.fullName = commodity && commodity['fullName']
      this.shortName = commodity && commodity['shortName']                                // 商品名称
      this.specContentList = commodity && commodity['specContentList']                      // 商品规格列表<TODO> 多个规格用逗号隔开
      this.listImg = commodity && commodity['listImg']                                   // 商品图片列表
      this.marketPrice = commodity && commodity['marketPrice']         // 商品的市场价值
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
      this.payStyle = rentInfo && rentInfo['payStyle']       //  支付方式
      this.receiverName = rentInfo && rentInfo['receiverName']        // 收件人姓名
      this.receiverTel = rentInfo && rentInfo['receiverTel']          // 收件人手机号
      this.consigneeAddr = rentInfo && rentInfo['consigneeAddr']      // 收件人地址

      // 增加了对于归还部分的状态
      this.isGiveBack = props && props['isGiveBack']                 // (value="是否可以归还：Y是 N否")
      this.isGiveBackProcess = props && props['isGiveBackProcess']   // (value="归还处理中: Y是 N否")
      // 续租
      this.isRelet = props && props['isRelet']
      // 原订单号
      this.relationOrderNo = props && props['relationOrderNo']
      // 收件人相关的信息
      this.pdfFileList = props['pdfFileList']          // 租赁协议的列表  templateName url

      // 增加即将到底的状态写入
      this.comingDue = props && props['comingDue']               // 是否即将到期：Y=是；N=否 ,  "到期状态：Y=即将到期；N=未到期；E=到期"
      this.comingDueDays = props && props['comingDueDays']       // (integer, optional): 即将到期的天数

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
      let overDue = false
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
              if (parseInt(payStyle) === repaymentStatus.Overdue) {
                overDue = true
              }
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
            if (paymentStatus === repaymentStatus.Overdue) {
              overDue = true
            }
            // 将得到的时间转化为对应的需要的时间类型 2018.06.03
            let termStarDateLong = subTermItem['startDateLong'] && parseInt(subTermItem['startDateLong'])
            let termStarDate = getTimerDotStr(termStarDateLong)
            let termEndDateLong = subTermItem['endDateLong'] && parseInt(subTermItem['endDateLong'])
            let termEndDate = getTimerDotStr(termEndDateLong)
            let payDateLong = subTermItem['payDateLong'] && parseInt(subTermItem['payDateLong'])
            let payDate = getTimerDotStr(payDateLong)
            let settleDateLong = subTermItem['settleDateLong'] && parseInt(subTermItem['settleDateLong'])
            let settleDate = getTimerDotStr(settleDateLong)
            myPayPlanList.push({
              term: subTermItem.term,                     // 第几期
              termStartDate: termStarDate,               // 账单开始时间
              termEndDate: termEndDate,                  // 账单的结束时间
              payDate: payDate,                          // 应付款付款时间
              settleDate: settleDate,                    // 实际付款时间
              // delayPayDate: subTermItem.delayPayDate,    //  账单逾期时间
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
      return [overDue, sortPlanList]
    }

    // 获取具体的租赁方式 '0,1' 一次性支付还是分期支付，如果二者都存在那么表示分期或者一次性支付
    // 0 表示分期  1 表示一次性支出   2表示一次性支付或者分期支付 3 后台没有返回对应的字段
    getLeaseStyleDesc() {
      let payStyle = getPayStayleEnum(this.payStyle)
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

    // 等到订单的基本信息
    getOrderDetail() {
      let statusDesc = ''
      let staturTitle = ''
      switch (this.status) {
        case orderStatus.WaitForConfirmed: {
          staturTitle = '待确认'
          statusDesc = '您的租赁订单已预约成功，请耐心等待后台审核，审核结果会及时告知，请保持电话畅通'
          break
        }
        case orderStatus.WaitForPayment: {
          staturTitle = '待支付'
          statusDesc = '您的订单已审核通过，请尽快完成首付，逾期未付订单将失效。'
          break
        }
        case orderStatus.AlreadyPayment: {
          staturTitle = '已支付'
          statusDesc = '您的租赁订单已首付完成，平台将尽快为您安排发货，请您耐心等待，注意发货通知短信哦。若有疑问，请致电客服：400-839-6296'
          break
        }
        case orderStatus.WaitForConsignment: {
          staturTitle = '待发货'
          statusDesc = '您的租赁订单已首付完成，平台将尽快为您安排发货，请您耐心等待，注意发货通知短信哦。若有疑问，请致电客服：400-839-6296'
          break
        }
        case orderStatus.AlreadyConsignment: {
          staturTitle = '已发货'
          statusDesc = '您的租赁商品已出库，快递正在配送中；请您提前准备好身份证原件及学生证原件用于收货时身份核验，并保持电话畅通，谢谢！若有疑问，请致电客服：400-839-6296'
          break
        }
        case orderStatus.Leasing: {
          staturTitle = '租赁中'
          statusDesc = '您的商品已经收货完成，尽情享用吧！'
          if (this.comingDue === 'Y') {      // 说明是即将到期 是否即将到期：Y=是；N=否
            staturTitle = '即将到期'
            statusDesc = '您的订单还差' + '<span style="color: #FF4754">' + this.comingDueDays + '</span>' + '天就要到期了，请提前安排使用计划。'
          }
          break
        }
        case orderStatus.DueSoon: {
          staturTitle = '即将到期'
          statusDesc = '您的订单还差2天就要到期了，请提前安排机器的使用计划'
          break
        }
        case orderStatus.Completed: {
          staturTitle = '已完成'
          statusDesc = '您的租赁订单已完结'
          if (this.statusDesc !== null) {
            staturTitle = this.statusDesc
          }
          if (this.detailStatus === '99005') { // 如果是买断完成，增加买断完成展示的内容
            // staturTitle = '买断完结'
            statusDesc = '您的商品已经收货完成，尽情享用吧！'
          }
          break
        }
        case orderStatus.ReturnGoods: {
          staturTitle = '退货中'
          statusDesc = '您的商品已送回物主基地，请耐心等待检测结果，如有疑问可随时咨询客服。'
          break;
        }
        case orderStatus.Recycleing: {
          staturTitle = '回收中'
          statusDesc = ' 您的商品已送回物主基地，请耐心等待检测结果，如有疑问可随时咨询客服。'
          break;
        }
        case orderStatus.BuyOuting: {
          staturTitle = '买断中'
          statusDesc = '您的商品按照协议规定要卖身给小主，请尽快完成支付，如有疑问随时咨询客服。'
          break;
        }
        case orderStatus.Canneled: {
          staturTitle = '已取消'
          statusDesc = '您的租赁订单已取消，不妨看看还有没有其他心仪的商品～'
          break
        }
        default: {
          console.log('某一订单状态，处于一个未知状态，请注意===================')
          statusDesc = '您的订单已审核通过，请尽快完成支付，超过24小时未支付订单将失效'
        }
      }

      // 获取用户的租赁协议
      let ProtocolInfoList = this.getProtocolInfoList()
      // 支付方式文字描述
      let payStyleStr = this.getLeaseStyleDesc()
      // 增加状态判断
      // 如果是在租赁中的状态之前，那么就显示固定的起租时间和到期时间
      let rentStarTime = getTimerDotStrWithTimeStr(this.rentStarTime)
      let rentEndTime = getTimerDotStrWithTimeStr(this.rentEndTime)
      if (this.status < orderStatus.Leasing) {
        rentStarTime = '收货后次日'
        rentEndTime = '收货日+租期时间'
      }
      let orderDetail = {
        status: this.status,
        statusTitle: staturTitle,
        statusDesc: statusDesc,
        orderNo: this.orderNo,
        orderType: this.orderType,
        receiverName: this.receiverName,
        receiverTel: this.receiverTel,
        consigneeAddr: this.consigneeAddr,
        ProtocolInfoList: ProtocolInfoList,
        rentStarTime: rentStarTime,
        rentEndTime: rentEndTime,
        payStyleStr: payStyleStr,
        isGiveBack: this.isGiveBack,
        isGiveBackProcess: this.isGiveBackProcess,
        isRelet: this.isRelet,
        relationOrderNo: this.relationOrderNo,
        comingDue: this.comingDue,
        comingDueDays: this.comingDueDays
      }
      return orderDetail
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
          let payStyle = getPayStayleEnum(this.payStyle)
          if (payStyle === 0) {  // 如果是分期或者可以使分期或者一次性支付
            menuList.push('支付')
          }
          break
        }
        case orderStatus.DueSoon: {
          menuList.push('维修')
          let payStyle = getPayStayleEnum(this.payStyle)
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
    getGoodsDetail() {
      // 此处需要添加附加服务的列表
      let serviceFeeList = this.getServiceFeeList()
      let goodsDesc = {
        createDate: this.createDate,                        // 下单时间
        fullName: this.fullName,
        shortName: this.shortName,                          //  商品名称
        specContentList: this.specContentList,              // 商品规格
        getGoodsDetailLease: this.getGoodsDetailLeaseStr(),  // 商品租金
        serviceFeeList: serviceFeeList,                       // 附加服务列表
        marketPrice: this.marketPrice                         // 市场价值
      }
      return goodsDesc
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
    getWaitForConfirmedObject() {
      let waitForConfirmedObject = {
        orderDepositAmt: this.orderDepositAmt,   // 原商品押金
        totalDays: this.totalDays + '天'         // 租期
      }
      return waitForConfirmedObject
    }

    // 获取首期账单
    getFirBillDetail() {
      let that = this
      // 拼凑首期的还款计划
      let totalMoney = null
      let payStyle = getPayStayleEnum(this.payStyle)
      if (payStyle === 1) {  // 如果是分期或者可以使分期或者一次性支付
        totalMoney = this.onepayAmt
      } else {               // 一次性付款的总金额
        totalMoney = this.termFirstPayAmt
      }
      // 首期的费用列表
      let firstFeeList = that.firstFeeList
      let feeArray = []
      // 加入押金部分的展示
      let orderDepositAmt = this.orderDepositAmt
      feeArray.push({
        feeName: '原商品押金',
        payAmt: '<span style="text-decoration: line-through">' + '￥' + orderDepositAmt + '</span>'
      })
      let payDepositAmt = this.payDepositAmt
      feeArray.push({
        feeName: '信用免押后(到期返还)',
        payAmt: '￥' + payDepositAmt
      })
      if ((firstFeeList !== undefined) && (firstFeeList instanceof Array)) {
        for (let i = 0; i < firstFeeList.length; i++) {
          let subItem = firstFeeList[i]
          let payAmt = ''
          if (payStyle === 1) {  // 如果是分期或者可以使分期或者一次性支付
            payAmt = subItem && subItem['feeTotalAmt']
          } else {               // 一次性付款的总金额
            payAmt = subItem['firstTermFeeAmt']
          }
          if (payAmt === undefined || payAmt === null) {
            payAmt = ''
          }
          feeArray.push({
            feeName: subItem['feeName'],
            payAmt: '￥' + payAmt
          })
        }
      }
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
      let paypayDate = that.firstActualPayTime
      let billStatus = that.getFirstBillStatus()
      if (billStatus === repaymentStatus.WaitPayment) {   // 支付状态为未支付
        paypayDate = '--'
      }
      let firstBill = {
        termStartDate: that.payDay,                 // 应付款日期
        payDate: paypayDate,                        // 付款时间
        delayPayDate: ' ',                          //  逾期时间
        termDays: that.totalDays,                   //  改天的期数
        totalMoney: totalMoney,                     //  总金额
        OwingMonty: that.OwingMoney,                //  欠费的钱
        paymentStatus: billStatus,
        Array: feeArray
      }
      return firstBill
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
          let payStyle = getPayStayleEnum(this.payStyle)
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
            payAmt: '<span style="text-decoration: line-through">' + this.orderDepositAmt + '￥' + '</span>'
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
      return protocolList
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

  export default {
    name: 'OrderDetailNewPage',
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
      htmlPannel,
      feeTrialTableNew,
      repaymentPlanScroller
    },
    data() {
      return {
        orderNo: '',                    // 宏观的orderNo
        detailStatus: '',               // 订单的大状态， 7004 对应于http字段返回 status
        orderDetail: {
          orderType: '',    // '0' 正常的订单  '1' 续租的订单
          orderNo: '',      // 订单编号
          status: '',       // 上面的枚举类型
          statusTitle: '',  // 订单总状态的描述 待确认 待支付 等等
          statusDesc: '',    // 各种状态订单的描述
          rentStarTime: '',  // 起租时间
          rentEndTime: '',   //  到期时间
          payStyleStr: '',   // 支付方式
          receiverName: '',  // 联系人
          receiverTel: '',   // 联系电话
          consigneeAddr: '',    // 收货地址
          isGiveBack: '',         // (value="是否可以归还：Y是 N否")
          isGiveBackProcess: '',  // (value="归还处理中: Y是 N否")
          isRelet: '',            // 是否显示续租 Y-显示 N-不显示
          relationOrderNo: '',    // 关联订单号
          comingDue: '',          // 是否即将到期：Y=是；N=否
          comingDueDays: '',      // 即将到期的天数
          ProtocolInfoList: [
            {
              templateName: '',
              url: ''
            }
          ]
        },
        goodsDetail: {
          createDate: '',                  // 下单时间
          fullName: '',
          shortName: '',                  //  商品名称
          specContentList: '',            // 商品规格
          getGoodsDetailLease: '',        // 商品租金
          serviceFeeList: [
            {
              itemName: '',               // 费用名字
              itemValue: ''               // 费用价格
            }
          ],                                          // 附加服务列表
          marketPrice: ''                         // 市场价值
        },
        waitForConfirmedObject: {
          orderDepositAmt: '',   // 原商品押金
          totalDays: ''          // 租期
        },
        buyOutType: '',           // 买断的实际状态  0=超过逾期天数强制买断；1=未归还强制买断；2=提前买断；3=到达最后一期,正常买断；4=不能买断；
        buyOutBtnStr: '买断',
        // 买断相关的信息
        orderBuyOutRecord: {
          // actualBuyOutAmt: '',     // 本次实际需支付买断金
          actualPayAmt: '',         // 实际应付款金额，优惠券，账户抵扣之后需要支付的金额
          buyOutPrice: '',         // 买断价格
          payRentAmt: '',          // 已经支付租金
          payDepositAmt: '',       // 已支付押金
          overdualAmt: '',         // 滞纳金
          breachAmt: '',           // 违约金
          accoutDeductionAmt: '',   // 账户抵扣
          payTime: ''               // 买断的支付日期
        },
        feeTrialList: [],                //  试算列表里面的信息
        showTrialPlanDetail: false,
        trialTableGetAlready: false,     //  是否获取过获取对应的试算列表
        curDate: '',                     // 试算列表中当前时间 Date对象
        myDate: '',                       // 试算列表中的预计收货时间 Date对象
        // 首期账单部分
        firstBillInfo: {
          termStartDate: '',                  // 应付款日期
          payDate: '',                        // 付款时间
          delayPayDate: '',                   //  逾期时间
          termDays: '',                       //  改天的期数
          totalMoney: '',                     //  总金额
          OwingMonty: '',                     //  欠费的钱
          paymentStatus: '',
          Array: [
            {
              feeName: '',
              payAmt: ''
            }
          ]
        },
        // 增加按钮的显示状态
        orderButtons: [               // 需要展示的按钮，以及是否需要显示
          {
            'buttonName': '取消订单',
            'buttonValue': null,
            'isShow': 'N'
          },
          {
            'buttonName': '支付',
            'buttonValue': null,
            'isShow': 'N'
          },
          {
            'buttonName': '查看物流',
            'buttonValue': null,
            'isShow': 'N'
          },
          {
            'buttonName': '维修',
            'buttonValue': null,
            'isShow': 'N'
          },
          {
            'buttonName': '归还',
            'buttonValue': null,
            'isShow': 'N'
          },
          {
            'buttonName': '买断',
            'buttonValue': null,
            'isShow': 'N'
          },
          {
            'buttonName': '续租',
            'buttonValue': null,
            'isShow': 'N'
          }
        ],
        showFirstBillFeeDetial: false,
        // 还款计划
        repaymentPlanList: [],           //  租赁中还款计划
        overDueShow: false,              //  是否展示逾期条目
        // Tab 部分的菜单
        orderPlanIndex: 0,
        orderPlaneDefault: '账单信息',
        orderMenuList: ['账单信息', '租赁信息'],
        // 账单信息 根据不同订单来填写
        waitForConfirmedList: [],        //  待确认部分展示的列表信息
        // 对应的展示倒计时
        payDiscountBtnStr: '',
        cancelReasonShow: false,        //  取消订单按钮的状态
        // 租赁信息展示对应的列表部分
        leaseInfoList: [],               // 租赁信息列表
        showGoodsDetail: false,
        cancelReasonList: [],
        suggestGoodsList: [],
        toastContent: '',
        showToast: false,
        // 是否京东小白免押<是否享受京东小白免押>
        jdQuery: false,
        // 订单剩余的支付时间<展示的是ms数>
        restPayTime: '',
        // 定时器,展示为null
        timer: null,
        // 打开协议的标题
        protocolShow: false,
        protocolTitle: '',
        protocolUrl: '',
        // 滑动穿透
        htmlScrollTop: 0,
        // 续租信息
        reletPaySuccess: false,
        reletDetailedVO: {},
        // 是否是买断状态
        buyoutPlaneShow: false,
        buyoutDetailShow: false
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
      // let currentUrl = window.location.origin
      // if (currentUrl.indexOf('localhost') !== -1) {
      //   // 如果找不到就说明本地环境<修改Store里面的openID>  00120180518000000149408539 租赁中
      //   // 待支付 00120180525000000160086678  00120180525000000101022356 00120180528M000473167061  00120180711M000228173852
      //   that.orderNo = '00120180719M000161080955'   // 00120180709M000150555323   00120180706M000113848108 00120180710M000537551197
      //   that.$store.commit('updateOrderNo', {orderNo: that.orderNo})
      // }
      if (that.orderNo !== '') {
        this.getHttpOrderDetail(that.orderNo)
      } else {
        // 订单号为空，弹出提示
        that.toastContent = '异常情况，订单为空，请检查跳转逻辑'
        that.showToast = true
      }
    },
    // 路由部分的控制
    beforeRouteLeave(to, from, next) {
      let that = this
      console.log('订单详情 from.name = ' + from.name)
      console.log('订单详情 to.name = ' + to.name)
      let orderDetailM = that.$store.state.orderDetailPageManager
      console.log('this.$store.state.orderDetailPageManager = ' + JSON.stringify(orderDetailM))
      if (to.name === 'OrderDetailEmptyPage') {
        let [pushState, pushCount] = that.getOrderPageManagerDetail()
        if (pushCount === undefined) {
          pushCount = 0
        }
        console.log('订单详情 Before里面的 pushState方法 (' + pushState + ',' + pushCount + ')')
        if (pushState === true) {
          that.updateOrderPageManager(false, false)
          that.beforeLeavePage()
          next()
        } else {
          // 开始设置对应的pushState
          that.updateOrderPageManager(false, false, true)
          // 说明用户点击了返回按钮，那么直接返回
          that.$router.go(-pushCount)
          // next()
        }
        that.beforeLeavePage()
        next()
      } else {
        that.beforeLeavePage()
        next()
      }
    },
    // // 路由部分的处理，离开页面和进入页面的处理
    // beforeRouteLeave(to, from, next) {
    //   // 判断下当前的状态来隐藏试算中的类
    //   if (this.showTrialPlanDetail === true) {
    //     document.documentElement.classList.remove('alpha')
    //     this.showTrialPlanDetail = false
    //   }
    //   if (this.timer !== null) {
    //     // 清除对应的定时器
    //     window.clearInterval(this.timer)
    //     this.timer = null
    //     console.log('已经取消了订单--------------的定时器')
    //   }
    //   next()
    // },
    mounted() {
      // 对订单标号特殊处理
      let width = document.body.clientWidth
      let setWidth = (width - 80 - 36 - 28) + 'px'
      let contentPlane = this.$refs.orderNo
      contentPlane.style['max-width'] = setWidth

      console.log('this.$ref === Mounted === ' + JSON.stringify(this.$refs))

      // 针对收货地址设置最大宽度
      let addressLabel = this.$refs.address
      console.log('addressLabel === Mounted === ' + addressLabel)
      let addressLableMaxWidth = (width - 84 - 24 - 18) + 'px'
      addressLabel.style['max-width'] = addressLableMaxWidth
    },
    computed: {
      // 是否展示原订单详情的板块
      canShowOriginOrderPlane: function() {
        // 续租的的订单 而且存在着相关联的订单号
        if (this.orderDetail.orderType === '1' && this.orderDetail.relationOrderNo) {
          return true
        } else {
          return false
        }
      },
      // 显示商品详情部分的箭头
      arrowShowGoodsDetailClasssOject: function() {
        return {
          'icon iconfont icon-xia': !this.showGoodsDetail,
          'icon iconfont icon-shang': this.showGoodsDetail
        }
      },
      // 4个按钮是否需要展示的依据 取消  支付  查看物流  维修
      canShowCancelBtn: function() {
        // 待确认-审批中的订单不能取消
        if ((this.orderDetail.status === orderStatus.WaitForConfirmed) && (this.detailStatus !== '1002')) {
          return true
        } else {
          return false
        }
      },
      canShowPayBtn: function() {
        if (this.orderDetail.status === orderStatus.WaitForPayment) {
          return true
        } else {
          if (this.orderDetail.status === orderStatus.BuyOuting) {
            return true;
          }
          // 增加7007隐藏所有的支付按钮
          if (this.orderDetail.status === orderStatus.Leasing && this.detailStatus !== '7007') {
            if (this.orderDetail.payStyleStr === '按月分期') {  // 如果是分期或者可以使分期或者一次性支付
              // return true
              // 一期该功能未开发，所以隐藏支付按钮
              return true
            } else {
              return false
            }
          } else {
            return false
          }
        }
      },
      canShowLogisticsBtn: function() {
        if (this.orderDetail.status === orderStatus.AlreadyConsignment) {
          return true
        } else {
          return false
        }
      },
      canShowFixBtn: function() {
        // 增加7007隐藏所有的支付按钮
        if ((this.orderDetail.status === orderStatus.Leasing || this.orderDetail.status === orderStatus.DueSoon || this.orderDetail.status === orderStatus.BuyOuting) && (this.detailStatus !== '7007')) {
          return true
        } else {
          return false
        }
      },
      canShowReturnBackBtn: function() {
        if ((this.orderDetail.isGiveBack === 'Y') && (this.orderDetail.isGiveBackProcess === 'N')) {
          return true
        } else {
          return false
        }
      },
      canShowReletBtn: function() {
        if (this.orderDetail.isRelet === 'Y') {
          return true
        } else {
          return false
        }
      },
      // 买断按钮的展示逻辑
      canShowBuyOutBtn: function() {
        // 提前买断和买断的展示逻辑
        if (this.buyOutType === buyOutStatus.PreBuyout || this.buyOutType === buyOutStatus.NormalBuyOut) {
          return true
        } else {
          return false
        }
      },
      // 是否需要展示Tab下面的所有页面
      // 是否显示账单详细信息的面板
      showBillDetailEnable: function() {
        // 订单完成是一样展示租赁信息
        // if ((this.orderDetail.status === orderStatus.Completed) || (this.orderDetail.status === orderStatus.Canneled) || (this.detailStatus === '1002')) {
        if ((this.orderDetail.status === orderStatus.Canneled) || (this.detailStatus === '1002')) {
          return false
        } else {
          return true
        }
      },
      // 确认预约 首期账单  还款计划的展示
      canShowSureOrderView: function() {
        if (this.orderDetail.status === orderStatus.WaitForConfirmed) {
          return true
        } else {
          return false
        }
      },
      canShowFirstBillView: function() {
        if (this.orderDetail.status === orderStatus.WaitForPayment || this.orderDetail.status === orderStatus.AlreadyPayment || this.orderDetail.status === orderStatus.WaitForConsignment || this.orderDetail.status === orderStatus.AlreadyConsignment) {
          return true
        } else {
          return false
        }
      },
      canShowRepaymentPlanView: function() {
        if (this.orderDetail.status === orderStatus.Leasing || this.orderDetail.status === orderStatus.DueSoon) {
          return true
        } else {
          return false
        }
      },
      // 是否展示剩余时间
      canShowRemainTime: function() {
        if (this.orderDetail.status === orderStatus.WaitForPayment) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      // 是否展示按钮
      canShowButton: function(buttonName) {
        if (this.orderButtons !== undefined && this.orderButtons instanceof Array) {
          for (let i = 0; i < this.orderButtons.length; i++) {
            let button = this.orderButtons[i]
              if (button.buttonName === buttonName) {
              if (button['isShow'] === 'Y') {
                return true
              } else {
                return false
              }
            }
          }
          return false
        } else {
          return false
        }
      },
      // 用于返回和设置跳转的时候使用的函数
      // 入参pushState
      // @pushState 为true 将会设置为， 是否进行+2 处理
      // @increaseMent 是否增加统计层次为+2
      // @clear        是否清空为0, 后来居上的原则
      updateOrderPageManager: function(pushState, increaseMent, cleanCount) {
        // 每次+2 用于计算层数
        let originCount = this.$store.state.orderDetailPageManager && this.$store.state.orderDetailPageManager.orderDetailCount
        if (originCount === undefined) {
          originCount = 0
        }
        let pushCount = originCount
        if (increaseMent === true) {
          pushCount = originCount + 2
        }
        if (cleanCount === true) {
          pushCount = 0
        }
        console.log('pushMyPage里面的 pushState方法 (' + pushState + ',' + pushCount + ')')
        // this.$store.commit('orderDetailPageManagerMemory', {orderDetailPageManager: orderDetailPageManager})
        this.$store.commit('orderDetailPageManagerMemory', {
          orderDetailPageManager: {
            orderDetailPush: pushState,       // 说明是否是开发者主动push 到空页面
            orderDetailCount: pushCount       // 用于统计用户进入的页面层数，方便返回
          }
        })
      },
      // 获取当前Store中的 pushState 和 pushCount 通过元组的方式返回
      // [pushState pushCount]
      getOrderPageManagerDetail: function() {
        let pushState = this.$store.state.orderDetailPageManager && this.$store.state.orderDetailPageManager.orderDetailPush
        let pushCount = this.$store.state.orderDetailPageManager && this.$store.state.orderDetailPageManager.orderDetailCount
        if (pushCount === undefined) {
          pushCount = 0
        }
        return [pushState, pushCount]
      },
      // 准备离开该页面需要处理一些事情
      beforeLeavePage: function() {
        if (this.showTrialPlanDetail === true) {
          document.documentElement.classList.remove('alpha')
          this.showTrialPlanDetail = false
        }
        if (this.timer !== null) {
          // 清除对应的定时器
          window.clearInterval(this.timer)
          this.timer = null
          console.log('已经取消了订单--------------的定时器')
        }
      },
      // 买断的详细部分被点击
      buyOutDetailClick: function() {
        this.buyoutDetailShow = !this.buyoutDetailShow
      },
      // 跳转至原订单
      goToOldOrder() {
        let item = {
          orderNo: this.orderDetail.relationOrderNo
        }
        console.log('相关联的单号为: ' + JSON.stringify(item))
        this.$store.commit('updateOrderNo', {orderNo: this.orderDetail.relationOrderNo})
        this.updateOrderPageManager(true, true)
        // 开始跳转到空页面
        this.$router.push({ name: 'OrderDetailEmptyPage', params: item });
        // location.reload()
      },
      // 逾期支付的跳转
      overDuePayClick: function() {
        this.menuButtonClick('支付')
      },
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
      // 箭头打开和关闭商品详情的函数
      showOrderGoodsClick() {
        if (this.showGoodsDetail) {
          this.showGoodsDetail = false
        } else {
          this.showGoodsDetail = true
        }
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
        //  TODO 测试钱毅接口  http://10.35.40.160:9093/wuzhu/swagger-ui.html
        // let orderDetailUrl = 'http://10.35.40.160:9093/wuzhu/order/getOrderDetail'
        let orderDetailUrl = '/wuzhu/order/getOrderDetail'
        this.$store.commit('updateLoadingStatus', { isLoading: true })
        that.$http.get(orderDetailUrl, param).then((res) => {
          that.$store.commit('updateLoadingStatus', {isLoading: false})
          if (res.code === '00') {
            console.log('订单获取成功，订单详情为:' + res)
            let myOrderDetail = new OrderDetail(res.data)
            that.orderDetail = myOrderDetail.getOrderDetail()
            that.goodsDetail = myOrderDetail.getGoodsDetail()
            that.firstBillInfo = myOrderDetail.getFirBillDetail()
            that.waitForConfirmedObject = myOrderDetail.getWaitForConfirmedObject()
            let repaymentPlanInfo = myOrderDetail.dealWithPaymentPlanList()
            that.overDueShow = repaymentPlanInfo[0]
            that.repaymentPlanList = repaymentPlanInfo[1]
            that.cancelReasonList = myOrderDetail.getCancelReason()
            that.detailStatus = myOrderDetail.detailStatus
            that.orderButtons = myOrderDetail.orderButtons
            // 获取买断相关的信息<先判断下是否需要解析买断>
            let orderBuyOutRecord = res && res.data && res.data['orderBuyOutRecord']
            if (orderBuyOutRecord !== undefined && orderBuyOutRecord !== null) {
              that.orderBuyOutRecord = orderBuyOutRecord
            }
            let buyOutType = res && res.data && res.data['buyOutType']
            if (buyOutType) {
              that.buyOutType = buyOutType
              // 根据买断的状态来显示对应买断按钮的文字
              if (buyOutType === buyOutStatus.NormalBuyOut) {
                that.buyOutBtnStr = '买断'
              }
              if (buyOutType === buyOutStatus.PreBuyout) {
                that.buyOutBtnStr = '提前买断'
              }
            }
            // 判断下是否需要展示买断面板<买断中 或者处于 买断完结>
            if ((that.orderDetail.status === orderStatus.BuyOuting) || (that.detailStatus === '99005')) {
              that.buyoutPlaneShow = true
            }

            // 续租信息 修改已经完结的时候，不能展示续租面板
            if (res.data.reletDetailedVO && (that.orderDetail.status !== orderStatus.Completed)) {
              that.reletPaySuccess = true;
              that.reletDetailedVO = res.data.reletDetailedVO;
            }
            // that.statusTitle = myOrderDetail.getCurrentStatusDesc()
            // that.leaseInfoList = myOrderDetail.getLeaseInfoList()
            // that.protocolsList = myOrderDetail.getProtocolInfoList()
            // that.userInfoList = myOrderDetail.getUserInfoList()
            // that.statusDesc = myOrderDetail.statusDesc
            // that.waitForConfirmedList = myOrderDetail.getWaitForConfirmedList()
            // 试算部分变成由单独的接口提供
            // that.feeTrialList = myOrderDetail.getTrialPaymentList()
            // that.status = myOrderDetail.status
            // that.buttonList = myOrderDetail.getCurrentMenuList()
            let jdQuery = myOrderDetail && myOrderDetail.isQueryXiaobai
            let restPayTime = parseInt(myOrderDetail && myOrderDetail.restPayTime)      // 订单剩余的支付时间
            let restPayTimeInt = parseInt(restPayTime / 1000)
            that.restPayTime = restPayTime
            that.jdQuery = (jdQuery === '1')
            // 判断下是否处于待支付状态，如果处于待支付状态就开启倒计时
            if (that.orderDetail.status === orderStatus.WaitForPayment) {
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
      // 获取试算的接口
      showPlaneDetailClick() {
        let that = this
        if ((this.trialTableGetAlready === false) && (this.showTrialPlanDetail === false)) {
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
              this.showTrialPlanDetail = true
              that.htmlScrollTop = document.documentElement.scrollTop
              console.log('that.htmlScrollTop' + that.htmlScrollTop)
              document.documentElement.classList.add('alpha')
            } else {
              // 错误信息的提示
              let errormsg = res['msg']
              that.toastContent = errormsg
              that.showTrialPlanDetail = true
            }
          })
        } else {
          if (this.showTrialPlanDetail) {
            this.showTrialPlanDetail = false
            document.documentElement.scrollTop = that.htmlScrollTop
            document.documentElement.classList.remove('alpha')
          } else {
            this.showTrialPlanDetail = true
            that.htmlScrollTop = document.documentElement.scrollTop
            console.log('that.htmlScrollTop' + that.htmlScrollTop)
            document.documentElement.classList.add('alpha')
          }
        }
      },
      // 试算控件传回的hide事件处理
      trialPlanHideClick() {
        document.documentElement.scrollTop = this.htmlScrollTop
        document.documentElement.classList.remove('alpha')
        this.showTrialPlanDetail = false
      },
      // 根据订单的来展示对应的支付状态
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
      // 还款计划等地方展示费用详情
      getRepaymentFeeName(feeItem) {
        let feeName = feeItem && feeItem.feeName
        if (feeName === null) {
          feeName = '租金'
        }
        return feeName
      },
      // 首期账单查看明细按钮被点击
      firstBillShowDetailClick() {
        this.showFirstBillFeeDetial = !this.showFirstBillFeeDetial
      },
      // 取消订单被点击的时候
      // 取消订单单独一个函数来处理
      cancelOrderClick() {
        this.cancelReasonShow = true
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
          case '归还': {
            // 跳转到归还页面
            this.$router.push({name: 'InitiateGoodsReturn', params: { orderNo: this.orderNo }})
            break
          }
          case '续租': {
            let paramItem = {
              orderNo: this.orderDetail.orderNo,
              shortName: this.goodsDetail.shortName,
              specContentList: this.goodsDetail.specContentList
            }
            this.common.launchRelet(this, paramItem);
            break
          }
          case '买断': {
            this.$store.commit('updateOrderNo', {orderNo: this.orderNo})
            this.$router.push({name: 'Buyout'})
            break
          }
        }
        if (menuItem === '支付') {
          let item = {
            'orderNo': this.orderDetail.orderNo
          }
          this.$store.commit('updateOrderNo', { orderNo: this.orderDetail.orderNo })
          if (this.orderDetail.status === orderStatus.WaitForPayment) {
            // 待支付
            this.$router.push({name: 'WXPaying', params: item})
          } else if (this.orderDetail.status === orderStatus.Leasing) {
            // 租赁中
            this.$router.push({name: 'WXPayOverpaying', params: item})
          } else if (this.orderDetail.status === orderStatus.BuyOuting) {
            // 买断，买断中
            this.$router.push({name: 'WXPayOverpaying', params: item})
          }
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
  // 移动穿透类
  .alpha {
    height: 100%;
  }

  .alpha body #app{
    /*position: fixed;*/
    height: 100%;
    overflow: hidden;
  }

  .OrderDetailNewPage{
    background: @bg;
    font-family: 'PingFang SC';
    /*公共部分*/
    .line-limit-length{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;      //文本不换行，这样超出一行的部分被截取，显示...
    }
    .bottom1pxline{
      .border-1px();
    }
    /*协议部分的高亮显示*/
    .protocol{
      color: #007AFF;
    }
    /*头部订单状态*/
    .orderStatus{
      padding: 12px 18px 12px 18px;
      background: #FEFBEA;
      margin-bottom: 18px;
      .statusTitle{
        font-size:18px;
        font-family:PingFangSC-Medium;
        color:rgba(0,0,0,1);
        line-height:20px;
        margin-bottom: 9px;
      }
      .statusDesc{
        font-size:12px;
        font-family:PingFangSC-Regular;
        color:rgba(136,136,136,1);
        line-height:16.5px;
      }
    }
    /*中间部分商品详细信息*/
    .orderGoodsPlane{
      background: white;
      margin-bottom: 18px;
      .goodsDetail{
        padding: 12px 0px 12px 0px;
        margin: 0px 18px 0px 18px;
        .border-1px();
        .order-flexBox{
          color: #888888;
          font-family:PingFangSC-Regular;
          line-height:28px;
          min-height: 28px;
          font-size: 14px;
          display: flex;
          .order-flexBox-left{
            width: 86px;
            flex: 0 0 86px;
          }
          .order-flexBox-right{
            margin-left: 18px;
            max-width: 70%;
            overflow: hidden;
            flex: 1;
          }
        }
        .cancelButton {
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
      .arrow{
        height: 45px;
        line-height: 45px;
        text-align: center;
        font-size: 14px;
        color: #5C99F4;
      }
    }
    /*买断部分面板*/
    .buyoutPlane{
      background: white;
      padding: 12px 15px 12px 15px;
      margin-bottom: 18px;
      .buyoutTitle{
        font-size:16px;
        font-family:PingFangSC-Regular;
        color:#111111;
        line-height:22px;
      }
      .buyout-flexBox{
        margin-top: 12px;
        display: flex;
        justify-content: space-between;
        .buyout-flexleft{
          font-size:14px;
          font-family:PingFangSC-Regular;
          color:#888888;
          line-height:20px;
        }
        .buyout-flexright{
          font-size:14px;
          font-family:PingFangSC-Regular;
          color:#888888;
          line-height:20px;
        }
      }
      .buyout-detail{
        height:17px;
        font-size:12px;
        font-family:PingFangSC-Regular;
        color:#5C99F4;
        line-height:17px;
        text-align: right;
        margin-top: 8px;
      }
      .buyout-detail-plane{
        margin-top: 11px;
        background: #F5F5F5;
        border-radius:4px;
        .detailwrap{
          padding: 12px 15px;
          .detailflex{
            display: flex;
            justify-content: space-between;
            .detailflex-left{
              font-size:14px;
              font-family:PingFangSC-Regular;
              color:#888888;
              line-height:28px;
            }
            .detailflex-right{
              font-size:14px;
              font-family:PingFangSC-Regular;
              color:#888888;
              line-height:28px;
            }
          }
        }
      }
    }
    /*订单详情部分*/
    .orderDetail{
      padding-bottom: 84px;
      background: @bg;
      /*去掉Tab的阴影*/
      .vux-tab-warp{
        box-shadow: 0 0px 0px 0 #DADADA !important;
      }
      /*租赁的具体信息*/
      .orderInfo{
        background: white;
        padding: 12px 18px 39px 18px;
        margin-bottom: 18px;
        .order-flexBox{
          color: #888888;
          font-family:PingFangSC-Regular;
          line-height:28px;
          min-height: 28px;
          font-size: 14px;
          display: flex;
          .order-flexBox-left{
            width: 86px;
          }
          .order-flexBox-right{
            margin-left: 18px;
            max-width: 70%;
            overflow: hidden;
          }
        }
      }
      /*待确认页面和首期账单页面公用部分*/
      .topSection{
        padding-bottom: 12px;
        .border-1px();
      }
      .top2line{
        margin-bottom: 6px;
        color: #757575;
        font-size: 14px;
      }
      .BillflexBox{
        display: flex;
        justify-content: space-between;
      }
      .flexBoxLast3line{
        min-height: 57px;
        .flexBoxLeftLast3line{
          font-size: 16px;
          line-height: 57px;
          color: #000000
        }
        .flexBoxRightLast3line{
          font-size: 16px;
          line-height: 57px;
          color: #888888;
        }
      }

      /*账单信息，待确认页面*/
      .orderBillInfo{
        background: white;
        margin-bottom: 18px;
        padding: 12px 18px 0px 18px;
      }
      /*首期账单的页面，待支付之前会用到*/
      .orderFirstBillInfo{
        background: white;
        padding: 12px 18px 0px 18px;
        margin-bottom: 18px;
        .feePlane{
          margin-top: 7px;
          background:rgba(245,245,245,1);
          padding: 12px 18px;
          // 公用的部分的Cell部分
          .feeTrialTable_Content_Cell {
            /*margin-left: 5px;*/
            /*margin-right: 10px;*/
            height: 24px;
            line-height: 24px;
            position: relative;
            display: flex;
            justify-content: space-between;
            .feeTrialTable_Content_Cell_Title {
              font-size: 12px;
              color: #888888;
              letter-spacing: 0;
              line-height: 24px;
            }
            .feeTrialTable_Content_Cell_Value {
              font-size: 12px;
              color: #888888;
              letter-spacing: 0;
              text-align: right;
              line-height: 24px;
            }
          }
        }
        .feeDetail{
          color: #5C99F4;
          font-size: 12px;
          text-align: right;
          margin-top: 3px;
          margin-bottom: 12px;
        }
      }

      /*续租详情*/
      .releted-detail{
        background-color: white;
        padding: 10px 18px;
        font-size: 16px;
        .text-right{
          text-align: right;
        }
        .item-section{
          padding-bottom: 4px;
          margin-bottom: 10px;
          &:last-child{
            margin-bottom: 0;
            padding-bottom: 0;
          }
        }
        .item-row{
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          .item-col{
            flex:1;
          }
        }

        .rd-label-1{
          color: #111;
        }
        .rd-label-2{
          color: #FFC400;
        }
        .rd-label-3{
          color: #888;
          font-size: 14px;
        }
        .del{
          color: #888;
          font-size: 12px;
        }
        .rd-label-4{
          color: #111;
          font-size: 14px;
        }
        .rd-label-5{
          color: #5C99F4;
          font-size: 12px;
        }
      }
    }
    .old-order-no{
      .weui-cells{
        font-size: 16px;
        color: #111;
        .weui-cell{
          padding: 16px 15px;
        }
      }
    }
    /*底部分菜单和按钮*/
    .menuPlane{
      background: white;
      position: fixed;
      min-height: 48px;
      width: 100%;
      bottom: 0;
      left: 0;
      .buttonPlaneWarp{
        .border-1px-top();
        .buttonPlane{
          display: flex;
          justify-content: flex-end;
          vertical-align: middle;
          margin-right: 22px;
          .buttonwarp{
            margin-top: 10px;
            margin-bottom: 10px;
            margin-left: 13px;
          }
        }
        /*对于X-button重定向*/
        .weui-btn_default {
          color: #000000 !important;
          background-color: #FFDA29;
        }
        .weui-btn{
          font-size: 12px!important;
          border-radius: 3px!important;
        }
        .weui-btn_primary {
          border: 1px solid #DDDDDD;
          border-radius: 100px;
          background: white;
        }
      }
    }
  }
</style>
