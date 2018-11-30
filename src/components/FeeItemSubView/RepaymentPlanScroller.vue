<template>
  <div class="repaymentPlanScroller">
    <div class="overdue-section" v-show="overDueShow" @click="overDueClick">
      <div class="overdur-wrap">
        <div class="overdue-leftBox">您有账单已逾期，请尽快处理！</div>
        <div class="overdue-rightBox" v-if="!isAlipayLife"><i class="icon iconfont icon-zuo"></i></div>
      </div>
    </div>
    <swiper v-model="termIndex" dots-position="center" height="340px" style="background: white">
      <swiper-item v-for="(termItem, termIndex) in repaymentPlanList" :key="termIndex">
        <div>
          <div class="sectionBoxWrapper">
            <div class="sectionBox">
              <div class="flexBox top2line">
                <div class="leftBox">{{ billTitleShowDesc(termItem) }}</div>
                <div class="rightBox">{{ billPaymentStausDesc(termItem) }}</div>
              </div>
              <div class="flexBox top2line">
                <div class="leftBox">{{termItem.termStartDate}}-{{termItem.termEndDate}}</div>
                <div class="rightBox">{{ termItem.termDays }}天</div>
              </div>
              <div class="flexBox top2line" v-if="isAlipayLife">
                <div class="leftBox">支付方式</div>
                <div class="rightBox">支付宝预授权 <i class="icon iconfont icon-help1" style="color: #007AFF; font-size: 14px" @click="showAlipayFundTips"></i></div>
              </div>
              <div class="flexBox">
                <div class="leftBox" style="color:#333333; font-size: 16px">应付金额</div>
                <div class="rightBox" style="color:#FC2D43; font-size: 16px">￥{{ remain2DotStr(termItem.totalMoney) }}</div>
              </div>
              <div class="feeDetail" @click="readFeeDetailClick">
                <span>查看明细</span>
              </div>
              <div class="feePlane" v-show="showFeeDetial">
                <div class="feeTrialTable_Content_Cell" v-for="(feeItem, feeIndex) in termItem.Array" :key="feeIndex">
                  <span class="feeTrialTable_Content_Cell_Title">{{ getRepaymentFeeName(feeItem) }}</span>
                  <span class="feeTrialTable_Content_Cell_Value">￥{{ feeItem.payAmt }}</span>
                </div>
              </div>
              <div class="flexBox flexBoxLast3line bottom1pxline">
                <div class="leftBox flexBoxLeftLast3line">应付款日期</div>
                <div class="rightBox flexBoxRightLast3line">{{ termItem.payDate }}</div>
              </div>
              <div class="flexBox flexBoxLast3line bottom1pxline">
                <div class="leftBox flexBoxLeftLast3line">待支付金额</div>
                <div class="rightBox flexBoxRightLast3line">￥{{ remain2DotStr(termItem.OwingMonty) }}</div>
              </div>
              <div class="flexBox flexBoxLast3line">
                <div class="leftBox flexBoxLeftLast3line">付款时间</div>
                <div class="rightBox flexBoxRightLast3line">{{ termItem.settleDate }}</div>
              </div>
            </div>
          </div>
          <div class="paddingForDotter"></div>
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from 'vux';
import { isAlipayLife } from './../../util/utils';

const baseList = [
  {
    url: 'javascript:',
    img: 'https://static.vux.li/demo/1.jpg',
    title: '送你一朵fua'
  },
  {
    url: 'javascript:',
    img: 'https://static.vux.li/demo/2.jpg',
    title: '送你一辆车'
  },
  {
    url: 'javascript:',
    img: 'https://static.vux.li/demo/5.jpg',
    title: '送你一次旅行',
    fallbackImg: 'https://static.vux.li/demo/3.jpg'
  }
];

export default {
  name: 'RepaymentPlanScroller',
  components: {
    Swiper,
    SwiperItem
  },
  data() {
    return {
      demo01_list: baseList,
      termIndex: 0,
      showFeeDetial: false,
      isAlipayLife: isAlipayLife() // 当前是否支付宝生活号渠道
    };
  },
  props: {
    overDueShow: false,
    repaymentPlanList: null
    // repaymentPlanList: [
    //   {
    //     term: Number,                  // 第几期
    //     termStartDate: String,        // 应付款日期
    //     payDate: String,              // 付款时间
    //     delayPayDate: String,
    //     termDays: String,             //  改天的期数
    //     totalMoney: Number,           //  总金额
    //     OwingMonty: Number,           //  欠费的钱
    //     paymentStatus: Number,        // 中文的待还款
    //     Array: [
    //       {
    //         feeName: String,
    //         payAmt: Number
    //       }
    //     ]
    //   }
    // ]
  },
  methods: {
    // 逾期条目被点击
    overDueClick() {
      this.$emit('overDueClick');
    },
    // 展示费用详情被点击
    readFeeDetailClick(feeItem) {
      this.showFeeDetial = !this.showFeeDetial;
    },
    // 每一期账单的抬头
    billTitleShowDesc: function(termItem) {
      if (termItem.term === '首期账单') {
        return '首期账单';
      } else {
        if (this.repaymentPlanList.length !== 0) {
          return termItem.term + '/' + this.repaymentPlanList.length + ' 账单';
        } else {
          return '首期账单';
        }
      }
    },
    // 还款计划等地方展示费用详情
    getRepaymentFeeName: function(feeItem) {
      let feeName = feeItem && feeItem.feeName;
      if (feeName === null) {
        feeName = '租金';
      }
      return feeName;
    },
    // 根据订单的来展示对应的支付状态
    // 根据对应的支付状态来展示对应的文字
    //   repaymentStatus.WaitPayment = 1         // 待还款
    //   repaymentStatus.AlreadyPayment = 3      // 已还清
    //   repaymentStatus.Overdue = 4             // 逾期
    billPaymentStausDesc(termItem) {
      if (termItem.paymentStatus === 3) {
        return '已支付';
      } else if (termItem.paymentStatus === 4) {
        return '已逾期';
      } else if (termItem.paymentStatus === 1) {
        return '待支付';
      } else {
        return '';
      }
    },
    // 只保留两位小数进行展示
    remain2DotStr(amt) {
      return amt.toFixed(2);
    },
    showAlipayFundTips() {
      this.$vux.alert.show({
        title: '支付宝预授权',
        content: '租金将每月定期从您支付宝账户中自动代扣。优先从已冻结资金中扣款。第一期租金将在您收货后次日代扣。',
        onShow() {},
        onHide() {}
      });
    }
  }
};
</script>

<style lang="less">
@import './../../common/less/index';
.repaymentPlanScroller {
  font-family: 'PingFang SC';
  background: @bg;
  .overdue-section {
    padding: 0px 18px 0px 18px;
    background: white;
    .overdur-wrap {
      display: flex;
      justify-content: space-between;
      padding: 17px 0px 17px 0px;
      .border-1px();
      .overdue-leftBox {
        font-size: 16px;
        color: rgba(255, 71, 84, 1);
        line-height: 22.5px;
      }
      .overdue-rightBox {
        line-height: 22.5px;
        transform: rotate(180deg);
        color: #d8d8d8;
      }
    }
  }
  .sectionBoxWrapper {
    height: 302px;
    overflow-y: scroll;
    .sectionBox {
      margin: 12px 18px 0px 18px;
      .flexBox {
        display: flex;
        justify-content: space-between;
      }
      .top2line {
        margin-bottom: 6px;
        color: #757575;
        font-size: 14px;
      }
      .bottom1pxline {
        .border-1px();
      }
      .flexBoxLast3line {
        min-height: 57px;
        .flexBoxLeftLast3line {
          font-size: 16px;
          line-height: 57px;
          color: #000000;
        }
        .flexBoxRightLast3line {
          font-size: 16px;
          line-height: 57px;
          color: #888888;
        }
      }
      .feeDetail {
        color: #5c99f4;
        font-size: 12px;
        text-align: right;
        margin-top: 3px;
        margin-bottom: 12px;
      }
      .graysmall {
        font-size: 14px;
        color: #757575;
      }
      /*费用面板*/
      .feePlane {
        margin-top: 7px;
        background: rgba(245, 245, 245, 1);
        padding: 12px 18px;
        // 公用的部分的Cell部分
        .feeTrialTable_Content_Cell {
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
    }
  }
  .paddingForDotter {
    width: 100%;
    height: 40px;
    background: #f5f5f5;
  }
  /*用于解决换行的问题*/
  .vux-slider > .vux-indicator-center {
    display: flex;
  }
  .vux-slider > .vux-indicator > a > .vux-icon-dot.active,
  .vux-slider .vux-indicator-right > a > .vux-icon-dot.active {
    background-color: #ffda29 !important;
  }
  .vux-slider > .vux-indicator > a > .vux-icon-dot,
  .vux-slider .vux-indicator-right > a > .vux-icon-dot {
    width: 9px !important;
    height: 9px !important;
    border-radius: 4.5px !important;
  }
}
</style>
