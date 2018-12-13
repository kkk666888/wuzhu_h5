<template>
    <div v-if="orderInfo.baseOrder" class="reletConfirmOrder">
      <div class="header">
        <div class="left">
          <img :src="orderInfo.baseOrder.listImg" class="img" />
        </div>
        <div class="right">
          <div class="name">{{orderInfo.baseOrder.fullName}}</div>
          <div class="mark">市场价：￥{{orderInfo.baseOrder.marketPrice|moneyFormat}}</div>
          <div class="property">
            <span v-for="item in specContentList" :key="item">{{item}}</span>
          </div>
        </div>
      </div>
      <!--租金-->
      <div class="rent">
        <div class="item-row">
          <div class="item-col">
            <div>日均租金</div>
          </div>
          <div class="item-col">
            <div class="text-right">￥{{orderInfo.sourceAvgRentAmt|moneyFormat}}</div>
          </div>
        </div>
        <div class="item-row" @click="showRentItem()">
          <div class="item-col">
            <div>续租租期</div>
          </div>
          <div class="item-col">
            <div v-if="orderInfo.productList && orderInfo.productList.length > 1" class="text-right">
              <span class="img-span" :class="{'img-down':!showRentItems,'img-up':showRentItems}" ></span>
            </div>
          </div>
        </div>
        <!--当前选中租期-->
        <template v-if="selectedTenancyTerm">
          <div class="rent-items" v-show="!showRentItems" @click="showRentItem()">
            <div class="item-row">
              <div class="item-col">
                <div>
                  <span class="tern-span">{{selectedTenancyTerm.totalDays}}天</span>
                  <template v-if="selectedTenancyTerm.costSavingAmt > 0">
                    <span class="img-shen"></span>
                    <span class="tern-money">￥{{selectedTenancyTerm.costSavingAmt|moneyFormat}}</span>
                  </template>
                </div>
              </div>
              <div class="item-col">
                <div class="text-right">￥{{selectedTenancyTerm.avgRentAmt|moneyFormat}}/天</div>
              </div>
            </div>
          </div>
        </template>
        <!--租期选项-->
        <template v-if="orderInfo.productList && orderInfo.productList.length > 1">
          <div v-show="showRentItems" class="rent-items">
            <div
              class="item-row"
              :class="{'rent-item-activity':item._id === selectedTenancyTerm._id}"
              v-for="item in orderInfo.productList"
              :key="item._id"
              @click="rentItemClick(item)">
              <div class="item-col">
                <div>
                  <span class="tern-span">{{item.totalDays}}天</span>
                  <template v-if="item.costSavingAmt > 0">
                    <span class="img-shen"></span>
                    <span class="tern-money">￥{{item.costSavingAmt|moneyFormat}}</span>
                  </template>
                </div>
              </div>
              <div class="item-col">
                <div class="text-right">￥{{item.avgRentAmt|moneyFormat}}/天</div>
              </div>
            </div>
          </div>
        </template>
        <div class="item-row"
          v-for="item in selectedTenancyTerm.listFeeInfo"
          :key="item.feeNo"
          @click="feeItemClick(item)">
          <div class="item-col">
            <div>
              <span v-show="!item._check" class="check-span uncheck-span"></span>
              <span v-show="item._check" class="check-span checked-span"></span>
              {{item.feeName}}<span v-show="item.isCancelled === '0'">(必选)</span>
            </div>
          </div>
          <div class="item-col item-col-100">
            <div class="text-right">
              {{ item.feeDesc }}
              <!-- ￥{{item._fee|moneyFormat}}/<span v-show="item._feeDay > 1">{{item._feeDay}}</span>天 -->
            </div>
          </div>
        </div>
        <div class="item-row">
          <div class="item-col">
            <div>每期费用试算（不含押金）</div>
          </div>
          <div class="item-col item-col-50">
            <div class="text-right">
              <span class="img-span img-question" @click="showItemPlanClick()"></span>
            </div>
          </div>
        </div>
      </div>
      <!--支付方式-->
      <div class="payType">
        <div class="header2">支付方式</div>
        <div class="payItem">
          <span v-if="showStagePay" :class="{'active':selectedPayType==='0'}" @click="payTypeClick('0')">按月支付</span>
          <span v-if="showTotalPay" :class="{'active':selectedPayType==='1'}" @click="payTypeClick('1')">全额支付</span>
        </div>
      </div>
      <!--支付金额-->
      <div v-if="planMoneyModel.terms && planMoneyModel.terms.length > 0" class="payMoney">
        <div class="item-row">
          <div class="item-col">
            <div class="money-label fnt-16">支付金额</div>
          </div>
          <div class="item-col">
            <div class="money-value">￥{{planMoneyModel._pay|moneyFormat}}</div>
          </div>
        </div>
        <div class="item-row">
          <div class="item-col"></div>
          <div class="item-col">
            <div class="view-detail" @click="moneyDetailClick()">查看明细</div>
          </div>
        </div>
        <!--明细-->
        <template v-if="planMoneyModel.terms[0]._details && planMoneyModel.terms[0]._details.length>0">
          <div v-show="showMoneyDetail" class="item-detail">
            <div class="item-row"
              v-for="detailItem in planMoneyModel.terms[0]._details" :key="detailItem.feeNo">
              <div class="item-col">{{detailItem.feeName}}</div>
              <div class="item-col text-right">￥{{detailItem.payAmt|moneyFormat}}</div>
            </div>
          </div>
        </template>
      </div>
      <!--账户抵扣 实际应付额-->
      <div class="payMoney">
        <div class="item-row">
          <div class="item-col">
            <div class="money-label">物主卡抵扣</div>
          </div>
          <div class="item-col">
            <div class="money-value-2">￥{{planMoneyModel.cashOffsetAmt|moneyFormat}}</div>
          </div>
        </div>
        <div class="item-row">
          <div class="item-col">
            <div class="money-label">账户抵扣</div>
          </div>
          <div class="item-col">
            <div class="money-value-2">￥{{planMoneyModel.subAccount|moneyFormat}}</div>
          </div>
        </div>
        <div class="item-row">
          <div class="item-col">
            <div class="money-label">实际应付额</div>
          </div>
          <div class="item-col">
            <div class="money-value">￥{{planMoneyModel._actualPay|moneyFormat}}</div>
          </div>
        </div>
      </div>

      <div class="protocol">
        <div class="item-row">
          <div class="item-col flex-checked">
            <span class="img-span img-checked"></span>
          </div>
          <div class="item-col">
            <span>点击支付订单即代表已同意</span>
            <span class="protocol-item" @click="protocolClick(1)">
              《用户租赁及服务协议》
            </span>
            <span class="protocol-item" @click="protocolClick(2)">
              《用户租赁及服务协议之补充协议》
            </span>
          </div>
        </div>
      </div>
      <div class="goPay" @click="pay()">去支付</div>
      <!--每期费用支付计划试算-->
      <!--此遮档层解决苹果7p遮档层档住内容问题-->
      <div v-show="showItemPlan" class="layout-div" @click="showItemPlan=false"></div>
      <popup class="itemPlanPopup" v-model="showItemPlan" :showMask="false">
        <popup-header class="vux-1px-b"
          title="每期费用支付计划试算"
          leftText=""
          :show-bottom-border="false"
          @on-click-left="hideItemPlan">
        </popup-header>
        <div class="itemPlanDiv">
          <div class="item vux-1px-b">
            <div class="item-row">
              <div class="item-col plan-col-periods">期数</div>
              <div class="item-col plan-col-tenancy">租期</div>
              <div class="item-col plan-col-days">天数</div>
              <div class="item-col plan-col-fee text-right">费用</div>
              <div class="item-col plan-col-img">&nbsp;</div>
            </div>
          </div>
          <div class="item-body">
            <div class="item vux-1px-b"
              v-for="(item,$index) in planMoneyModel.terms" :key="$index">
              <div class="item-row" @click="showItemPlanDetailClick(item)">
                <div class="item-col plan-col-periods">{{item.term}}/{{planMoneyModel.totalTerms}}</div>
                <div class="item-col plan-col-tenancy">{{item.termStartDay|dateFormat('yyyy/M/d')}}-{{item.termEndDay|dateFormat('yyyy/M/d')}}</div>
                <div class="item-col plan-col-days">{{item.termDays}}天</div>
                <div class="item-col plan-col-fee">{{item._pay|moneyFormat}}元</div>
                <div class="item-col plan-col-img">
                  <span v-show="!item._showDetail" class="img-span img-down"></span>
                  <span v-show="item._showDetail" class="img-span img-up"></span>
                </div>
              </div>
              <div v-show="item._showDetail" class="item-detail">
                <div v-for="detailItem in item._details" :key="detailItem.feeNo" class="item-row">
                  <div class="item-col">{{detailItem.feeName}}</div>
                  <div class="item-col text-right">￥{{detailItem.payAmt|moneyFormat}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </popup>
      <!--协议弹窗-->
      <html-pannel :showScrollBox="potocolShow" :protocolTitle="potocolTitle" :url="potocolUrl" @sureBtnClick="potocolSureClick"></html-pannel>
    </div>
</template>
<script>
  import vueJs from './reletConfirmOrder.js'
  export default vueJs
</script>
<style lang="less" scoped>
  @import './reletConfirmOrder.less';
</style>


