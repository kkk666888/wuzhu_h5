<template>
  <div class="FeeTrialTable">
    <!--<div>*以下是基于假设收货日进行试算，如收货日变化则支付日与每期的租金及服务费相应变化</div>-->
    <div class="FeeTrialTable_BillInfo_TableHeader">
      <div class="FeeTrialTable_BillInfo_TableHeader_Item">下单日 {{ getOrderDateStr }}</div>
      <div class="FeeTrialTable_BillInfo_TableHeader_Item">假设收货日 {{ getGoodsDateStr }}</div>
    </div>
    <!--需要展示的费用详情页面-->
    <div v-for="(termItem, termIndex) in feeTrialList" :key="termIndex" @click="onClickTermItem(termItem)">
      <x-table  class="OrderDetailPage_BillInfo_ServicePlan_Table" :cell-bordered="false">
        <thead>
        <tr v-if="termIndex===0">
          <th v-for="(menu, index) in setionList" :key="index">{{ menu }}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class="tabledata1">{{ billTitleShowTitle(termItem) }}</td>
          <td class="tabledata2">{{ getRentTermStr(termItem) }}</td>
          <td class="tabledata3">{{ termItem.termDays }}天</td>
          <td class="tabledata4">
            <span>￥{{ termItem.totalMoney }}</span>
            <i v-bind:class="arrowClasssOject(termItem)"></i>
          </td>
        </tr>
        </tbody>
      </x-table>
      <div class="OrderDetailPage_OneBill_Detail" v-show="isSelected(termItem)">
        <div class="OrderDetailPage_OneBill_JDCoin" v-show="showJDCoinTitle">已享受京东小白信用免押</div>
        <div class="feeTrialTable_Content_Cell" v-for="(feeItem, feeIndex) in termItem.Array" :key="feeIndex">
          <span class="feeTrialTable_Content_Cell_Title">{{ feeItem.feeName }}</span>
          <span class="feeTrialTable_Content_Cell_Value">￥{{ feeItem.payAmt }}</span>
        </div>
        <!--<div class="OrderDetailPage_OneBill_Desc">-->
          <!--<span>费用说明</span>-->
          <!--<i class="icon iconfont icon-help1"></i>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import {XTable} from 'vux'
  import './../../util/category.js'
    export default {
      name: 'fee-trial-table',
      data() {
        return {
          selectedTermItem: {}
        }
      },
      props: {
        feeTrialList: null,
        goodReturnDate: null,
        curDate: null,
        showJDCoinTitle: false
      },
      computed: {
        getOrderDateStr() {
          return this.curDate
        },
        getGoodsDateStr() {
          return this.goodReturnDate
        }
      },
      components: {
        XTable
      },
      methods: {
        // 账单的头部
        billTitleShowTitle: function(termItem) {
          let tempStr = termItem.term + '/' + this.feeTrialList.length
          return tempStr
        },
        // 判断某一期是否当前是处于被选中的状态
        isSelected(termItem) {
            if (termItem.term === this.selectedTermItem.term) {
              return true
            } else {
              return false
            }
        },
        arrowClasssOject: function(termItem) {
          console.log(termItem.selected + '******************8')
          let choose = this.isSelected(termItem)
          return {
            'icon iconfont icon-xia': !choose,
            'icon iconfont icon-shang': choose
          }
        },
        onClickTermItem: function(termItem) {
          let choose = this.isSelected(termItem)
          // 如果当前是处于被选中的状态，那么久关闭
          if (choose) {
            this.selectedTermItem = {}
          } else {
            this.selectedTermItem = termItem
          }
        },
        getRentTermStr: function(termItem) {
          // let starStr = this.getTimerStr(termItem.termStartDate)
          // let endStr = this.getTimerStr(termItem.payDate)
          return termItem.termStartDate + '-' + termItem.payDate
        }
        // // 获取对应的时间字符串
        // getTimerStr(date) {
        //   let year = date.getFullYear()
        //   let mouth = date.getMonth() + 1
        //   let day = date.getUTCDate()
        //   let tempStr = year + '/' + mouth + '/' + day
        //   return tempStr
        // }
      }
    }
</script>

<style lang="less">
  @import "./../../common/less/index";
  .FeeTrialTable {
    .FeeTrialTable_BillInfo_TableHeader {
      line-height: 30px;
      display: flex;
      justify-content: space-between;
      .FeeTrialTable_BillInfo_TableHeader_Item {
        display: inline-block;
        font-size: 14px;
        color: #000000;
        letter-spacing: 0;
      }
    }
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
      // 公用的部分的Cell部分
      .feeTrialTable_Content_Cell {
        margin-left: 5px;
        margin-right: 10px;
        height: 30px;
        line-height: 30px;
        position: relative;
        display: flex;
        justify-content: space-between;
        .feeTrialTable_Content_Cell_Title {
          font-size: 13px;
          color: #000000;
          letter-spacing: 0;
          line-height: 30px;
        }
        .feeTrialTable_Content_Cell_Value {
          font-size: 13px;
          color: #000000;
          letter-spacing: 0;
          text-align: right;
          line-height: 30px;
        }
      }
    }
    .OrderDetailPage_BillInfo_ServicePlan_Table {
      font-size: 13px;
      .tabledata1{
        width: 35px;
      }
      .tabledata4{
        width: 74px;
      }
    }
  }
</style>
