<template>
  <div class="feeTrialTableNew">
    <div class="sl-dialog">
      <!--阴影部分-->
      <transition :name="maskTransition">
        <div class="sl-mask" @click="hide"></div>
      </transition>
      <transition :name="dialogTransition">
        <div class="sl-dialog-content">
          <div class="titleHeader">
            <i class="icon iconfont icon-zuo floatArrow" @click="hide"></i>
            <span>每期费用支付计划试算</span>
          </div>
          <div class="plan">
            <div class="planHeader">
              <div class="headerTitle">*以下试算基于假设收货日，如收货日变化则每期账单相应变化</div>
              <div class="date-plan">
                <div class="order-date">
                  <span>下单日</span>
                  <span>{{ getOrderDateStr }}</span>
                </div>
                <div class="assumption-date">
                  <span style="color:#262626">假设收货日</span>
                  <span style="color:#757575">{{ getGoodsDateStr }}</span>
                </div>
              </div>
            </div>
            <div class="contentPlane">
              <div class="contenPlane-title">
                <div class="flexBox">
                  <div class="term-num-row term-row">期数</div>
                  <div class="term-period-row term-row">租期</div>
                  <div class="term-days-row term-row">天数</div>
                  <div class="term-fee-row term-row">费用</div>
                </div>
              </div>
              <div class="contenPlane-detail" ref="contentPlane">
                <div class="section" v-for="(termItem, termIndex) in feeTrialList" :key="termIndex" @click="onClickTermItem(termItem)">
                  <div class="flexBox">
                    <div class="term-num-row term-row">{{ billTitleShowTitle(termItem) }}</div>
                    <div class="term-period-row term-row">{{ getRentTermStr(termItem) }}</div>
                    <div class="term-days-row term-row">{{ termItem.termDays }}天</div>
                    <div class="term-fee-row term-row">
                      <span>{{ termItem.totalMoney }}元</span>
                      <i v-bind:class="arrowClasssOject(termItem)"></i>
                    </div>
                  </div>
                  <div class="feeTrial-feePlane" v-show="isSelected(termItem)">
                    <div class="OrderDetailPage_OneBill_JDCoin" v-show="showJDCoinTitle">已享受京东小白信用免押</div>
                    <div class="feeTrialTable_Content_Cell" v-for="(feeItem, feeIndex) in termItem.Array" :key="feeIndex">
                      <span class="feeTrialTable_Content_Cell_Title">{{ feeItem.feeName }}</span>
                      <span class="feeTrialTable_Content_Cell_Value">￥{{ feeItem.payAmt }}</span>
                    </div>
                  </div>
                  <div style="height: 12px; width: 100%" v-show="isSelected(termItem)"></div>
                </div>
                <div style="width: 100%; height: 44px"></div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeeTrialTableNew',
  data() {
    return {
      selectedTermItem: {},
      maskTransition: 'vux-mask',
      dialogTransition: 'vux-dialog'
    };
  },
  created() {},
  mounted() {
    let height = document.body.clientHeight;
    let setHeight = height - 130 - 151 + 'px';
    let contentPlane = this.$refs.contentPlane;
    contentPlane.style['max-height'] = setHeight;
  },
  props: {
    feeTrialList: null,
    goodReturnDate: null,
    curDate: null,
    showJDCoinTitle: false
  },
  computed: {
    getOrderDateStr() {
      return this.curDate;
    },
    getGoodsDateStr() {
      return this.goodReturnDate;
    }
  },
  methods: {
    // 账单的头部
    billTitleShowTitle: function(termItem) {
      let tempStr = termItem.term + '/' + this.feeTrialList.length;
      return tempStr;
    },
    // 判断某一期是否当前是处于被选中的状态
    isSelected(termItem) {
      if (termItem.term === this.selectedTermItem.term) {
        return true;
      } else {
        return false;
      }
    },
    arrowClasssOject: function(termItem) {
      let choose = this.isSelected(termItem);
      return {
        'icon iconfont icon-xia': !choose,
        'icon iconfont icon-shang': choose
      };
    },
    onClickTermItem: function(termItem) {
      let choose = this.isSelected(termItem);
      // 如果当前是处于被选中的状态，那么久关闭
      if (choose) {
        this.selectedTermItem = {};
      } else {
        this.selectedTermItem = termItem;
      }
    },
    getRentTermStr: function(termItem) {
      return termItem.termStartDate + '-' + termItem.payDate;
    },
    hide() {
      this.$emit('hideClick');
    }
  }
};
</script>

<style lang="less">
@import './../../common/less/index';
.feeTrialTableNew {
  font-family: 'PingFang SC';
  .sl-dialog {
    .sl-mask {
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
    }
    .sl-dialog-content {
      position: fixed;
      z-index: 5000;
      width: 100%;
      bottom: 0;
      left: 50%;
      -webkit-transform: translate(-50%);
      transform: translate(-50%);
      background-color: #ffffff;
      text-align: center;
      border-radius: 3px;
      overflow: hidden;
      .titleHeader {
        top: 0;
        text-align: center;
        height: 44px;
        width: 100%;
        line-height: 44px;
        vertical-align: middle;
        font-size: 14px;
        .border-1px();

        .floatArrow {
          float: left;
          padding: 0px 22px;
        }
      }
      .plan {
        position: relative;
        .planHeader {
          margin-top: 12px;
          .headerTitle {
            margin-left: 18px;
            margin-right: 18px;
            color: #bbbbbb;
            font-size: 12px;
          }
          .date-plan {
            display: flex;
            justify-content: space-between;
            margin-left: 18px;
            margin-right: 18px;
            margin-top: 14px;
            padding-bottom: 14px;
            .border-1px();
            .order-date {
              color: #757575;
              font-size: 14px;
            }
            .assumption-date {
              color: #262626;
              font-size: 14px;
            }
          }
        }
        .contentPlane {
          .contenPlane-title {
            margin: 0 18px;
            height: 44px;
            line-height: 44px;
            .border-1px();
          }
          .contenPlane-detail {
            max-height: 340px;
            overflow-y: scroll;
            .section {
              margin: 0 18px;
              .border-1px();
              min-height: 44px;
              line-height: 44px;
              /*公用的表格布局*/
              .flexBox {
                display: flex;
                justify-content: space-between;
                color: #333333;
                font-size: 12px;
                .term-num-row {
                  width: 10%;
                }
                .term-period-row {
                  width: 55%;
                }
                .term-days-row {
                  width: 10%;
                }
                .term-fee-row {
                  width: 25%;
                }
              }
              .feeTrial-feePlane {
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
                    color: #000000;
                    letter-spacing: 0;
                    line-height: 24px;
                  }
                  .feeTrialTable_Content_Cell_Value {
                    font-size: 12px;
                    color: #000000;
                    letter-spacing: 0;
                    text-align: right;
                    line-height: 24px;
                  }
                }
              }
            }
          }
          /*公用的表格布局*/
          .flexBox {
            display: flex;
            justify-content: space-between;
            color: #333333;
            font-size: 12px;
            min-height: 44px;
            .term-num-row {
              width: 10%;
            }
            .term-period-row {
              width: 55%;
            }
            .term-days-row {
              width: 10%;
            }
            .term-fee-row {
              width: 25%;
            }
          }
        }
      }
    }
  }
}
</style>
