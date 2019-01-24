<template>
  <div class="WXPayOverpaying">
    <div class="box-goods">
      <div class="box-ticket-number">
        <p class="ticket-number-text">
          订单编号:
          <span>{{ dataOrderBillPayInfos.orderNo }}</span>
        </p>
      </div>
      <div class="divider"></div>

      <div class="box-goods-more">
        <div class="box-goodsImg">
          <img class="goods-img" :src="dataOrderBillPayInfos.listImg">
        </div>

        <div class="box-goodsDetail">
          <p class="goods-name">{{ dataOrderBillPayInfos.shortName }}</p>
          <p class="goods-labels">
            <span
              class="label"
              v-for="(item,index) in dataOrderBillPayInfos.specContentList.split(',')"
              :key="index"
            >{{ item }}</span>
          </p>
        </div>
      </div>
    </div>

    <ul class="clearFix">
      <li v-for="(item,index) in dataOrderBillPayInfos.rentBillList" :key="index">
        <div class="box-ticket">
          <div class="box-pay-ticket box-ticket-one-line clearFix">
            <div class="box-pay-first">
              <p class="box-pay-first-p">{{ item.term }}/{{ dataOrderBillPayInfos.totalTerm }}账单</p>
            </div>
            <div class="box-pay-amount">
              <p
                class="box-pay-amount-p-right"
              >{{ item.startDate ? item.startDate.split(' ')[0].replace(/-/g, '.') : '' }}－{{ item.endDate ? item.endDate.split(' ')[0].replace(/-/g, '.') : '' }}</p>
            </div>
          </div>

          <div class="divider clearFix"></div>

          <div class="box-pay-first-amount box-ticket-two-line">
            <div class="box-pay-first">
              <p class="box-pay-first-p2">支付金额</p>
            </div>
            <div class="box-pay-amount">
              <p class="box-pay-amount-p2">
                ¥{{ Number(item.totalPayAmt).toFixed(2) }}
                <!-- <span v-show="!item.isDown" class="icon iconfont icon-xia" @click="downTicket(index)"></span> -->
                <!-- <span v-show="item.isDown" class="icon iconfont icon-shang" @click="downTicket(index)"></span>  -->
              </p>
            </div>
            <div class="box-detail-show" @click="downTicket(index)">查看明细</div>
          </div>

          <div v-show="item.isDown" :class="['box-pay-ticket', 'box-ticket-down']">
            <div v-for="(itemSub,index) in item.billDetailList" :key="index">
              <div class="clearFix">
                <div class="box-fee-name">
                  <p>{{ itemSub.feeName }}</p>
                </div>
                <div class="box-fee-value">
                  <p>￥{{ Number(itemSub.payAmt).toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- 第一期不上 -->
    <!-- <div>
		<group label-align="left" label-width="6em">
			<cell title="使用优惠劵" is-link></cell>
			<cell title="提前支付优惠" value="-60.00"></cell>
		</group>
    </div>-->
    <div>
      <group gutter="18px">
        <cell class="amount-descount" title="物主卡抵扣" :value="cashOffsetIntegralAmtChar"></cell>
        <cell class="amount-descount" title="账户抵扣" :value="cashIntegralAmtChar"></cell>
        <cell class="amount-title" title="实际应付款" :value="dataOrderBillPayInfos.sumAmtChar"></cell>
      </group>
    </div>

    <div class="box-button">
      <x-button
        class="button-toPay"
        :text="payButton"
        :gradients="['#FFDA29', '#FFDA29']"
        @click.native="toPayCash"
      ></x-button>
    </div>
  </div>
</template>

<script>
import {
  XHeader,
  Group,
  Cell,
  Radio,
  PopupRadio,
  Scroller,
  XButton
} from 'vux';
export default {
  name: 'WXPayOverpaying',
  components: {
    XHeader,
    Group,
    Cell,
    Radio,
    PopupRadio,
    Scroller,
    XButton
  },
  data() {
    return {
      isDown: false,
      No: '', // 18059302938
      payCheckedNames: '', // 1
      payType: '', // ['京东支付', '微信支付']
      order: {
        img: '',
        desc: '', // Dell27英寸显示器 视无边界
        label: '' // ['27英寸', '2017年款']
      },
      tickets: [
        {
          isDisdown: '', // true
          ticket: '', // 1/12账单
          time: '', // 2018.06.04-2018.07.03
          amountTitle: '', // 应付
          amount: '' // ¥443.20
        },
        {
          isDisdown: true,
          ticket: '', // 2/12账单
          time: '', // 2018.06.04-2018.07.03
          amountTitle: '', // 应付
          amount: '' // ¥443.20
        }
      ],
      payAmount: '', // 340.00
      payButton: '下一步', // 确认支付 340.00元
      dataOrderBillPayInfos: {
        orderNo: '',
        createDate: '',
        categoryCode: '',
        shortName: '',
        listImg: 'static/images/loading.png', // www.haorooms.com
        specContentList: '',
        totalTerm: '',
        sumAmt: '',
        sumAmtChar: '',
        cashIntegralAmt: '',
        billList: [
          {
            isDown: false, // 需要插入数据
            // billListData: {
            delayPayDate: '', // 2018-04-30T07:28:22.300Z
            feeDesc: '', // string
            feeName: '', // string
            feeTypeCode: '', // string
            payAmt: '', // 0
            payDate: '', // 2018-04-30T07:28:22.300Z
            paymentStatus: '', // string
            principalBalanceAmt: '', // 0
            term: '', // string
            termDays: '', // 0
            termStartDate: '', // 2018-04-30T07:28:22.300Z
            startDate: '',
            endDate: ''
            // }
          }
          // {
          //   isDisdown: true,
          //   term: '3',
          //   feeTypeCode: '1',
          //   feeName: '滞纳金',
          //   payAmt: '1000',
          //   termStartDate: '2018/7/1',
          //   payDate: '2018/7/2',
          //   termDays: '15',
          //   paymentStatus: '1',
          //   delayPayDate: 35,
          //   principalBalanceAmt: '100',
          //   termEndDate: '',
          //   feeDesc: '费用说明'
          // }, {
          //   isDisdown: true,
          //   term: '3',
          //   feeTypeCode: '1',
          //   feeName: '滞纳金',
          //   payAmt: '1000',
          //   termStartDate: '2018/7/2',
          //   payDate: '2018/7/2',
          //   termDays: '18',
          //   paymentStatus: '1',
          //   delayPayDate: 36,
          //   principalBalanceAmt: '100',
          //   feeDesc: '费用说明'
          // }
        ],
        rentBillList: [
          {
            term: '1',
            termStartDate: '', // null
            termStartDateLong: '', // null
            payDate: '', // 2018-05-22 00:00:00
            payDateLong: '', // 1526918400
            termDays: '', // null
            paymentStatus: '', // 3
            delayPayDate: '', // null
            delayPayDateLong: '', // null
            principalBalanceAmt: '', // null
            startDate: '', // null
            startDateLong: '', // null
            endDate: '', // null
            endDateLong: '', // null
            settleDate: '', // null
            settleDateLong: '', // 1526918400
            totalPayAmt: '', // 402.40
            billDetailList: [
              {
                feeTypeCode: '', // 'FWFYYWBZ'
                feeName: '', // 意外保障198元
                payAmt: '', // 198.00
                feeDesc: '' // null
              },
              {
                feeTypeCode: '', // null
                feeName: '', // 租金
                payAmt: '', // 204.40
                feeDesc: '' // null
              }
            ]
          }
        ],
        feeList: [
          {
            feeName: '', // string
            feeNature: '', // string
            feeNo: '', // string
            feeTotalAmt: '', // 0
            firstTermFeeAmt: '' // 0
          }
        ],
        payChannelList: [
          {
            channelDesc: '', // string
            channelMerchantNo: '', // string
            channelName: '', // string
            limitAmtDesc: '', // string
            priority: '' // string
          }
        ]
      },
      billListItem: {
        term: '',
        feeTypeCode: '',
        feeName: '',
        payAmt: '',
        termStartDate: '',
        payDate: '',
        termDays: '',
        paymentStatus: '',
        delayPayDate: '',
        principalBalanceAmt: '',
        feeDesc: ''
      },
      feeListItem: {
        feeNo: '',
        feeName: '',
        feeTotalAmt: '',
        firstTermFeeAmt: ''
      },
      payChannelListItem: {
        channelMerchantNo: '',
        channelName: '',
        channelDesc: '',
        priority: '',
        limitAmtDesc: ''
      },
      cashIntegralAmtChar: '', // 账户抵扣显示字符
      cashOffsetIntegralAmtChar: '' // 物主卡抵扣显示字符
    };
  },
  methods: {
    getBillEndDate(startDate, delayDate) {
      let dateStart = new Date(startDate);
      console.log('month === ' + dateStart.getMonth());
      let date = dateStart.getDate() + delayDate;
      dateStart.setDate(date);
      return (
        dateStart.getFullYear() +
        '/' +
        (dateStart.getMonth() + 1) +
        '/' +
        dateStart.getDate()
      );
    },
    toPayCash() {
      console.log('toPayCash');
      this.$store.commit('payStyleMemory', { payStyle: '2' });
      this.$store.commit('updateOrderNo', {
        orderNo: this.dataOrderBillPayInfos.orderNo
      });
      this.$store.commit('updatePayAmount', {
        payAmount: this.dataOrderBillPayInfos.sumAmt
      });
      this.$store.commit('updateCashOffsetAmt', {
        cashOffsetAmt: this.dataOrderBillPayInfos.cashOffsetIntegralAmt
      });
      this.$store.commit('updateDeductionAmount', {
        deductionAmount: this.dataOrderBillPayInfos.cashIntegralAmt
      });
      this.$store.commit('updateRouteSource', {
        routeSource: 'WXPayOverpaying'
      });
      this.$router.replace({ name: 'WXPayCashing' });
    },
    downTicket(index) {
      console.log('downTicket');
      let itemCopy = this.dataOrderBillPayInfos.rentBillList[index];
      itemCopy.isDown = !itemCopy.isDown;
      this.dataOrderBillPayInfos.rentBillList.splice(index, 1, itemCopy);
    },
    getOrderBillPayInfos(orderNo) {
      console.log('getOrderBillPayInfos');
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      // let fuben = '/src/components/Pay/bill.json';
      // this.$http.get(fuben).then(res => {
      this.$http
        .get('/wuzhu/order/getOrderBillPayInfos?orderNo=' + orderNo)
        .then(res => {
          console.log('res ===> ' + JSON.stringify(res));
          this.$store.commit('updateLoadingStatus', { isLoading: false });
          if (res.code === '00') {
            console.log('getOrderPayInfo success');
            this.dataOrderBillPayInfos = res.data; // 增加是否展开箭头自断,不能直接赋值
            this.dataOrderBillPayInfos.sumAmtChar = `￥${Number(
              this.dataOrderBillPayInfos.sumAmt
            ).toFixed(2)}`;
            this.cashIntegralAmtChar = `￥${Number(
              this.dataOrderBillPayInfos.cashIntegralAmt
            ).toFixed(2)}`;
            this.cashOffsetIntegralAmtChar = `￥${Number(
              this.dataOrderBillPayInfos.cashOffsetIntegralAmt
            ).toFixed(2)}`;
            if (this.dataOrderBillPayInfos.rentBillList) {
              // 为账单插入是否展开字段
              this.dataOrderBillPayInfos.rentBillList.forEach(function(item) {
                item.isDown = false;
              });
              console.log('this.dataOrderBillPayInfos.rentBillList ok');
              // 账期排序
              this.dataOrderBillPayInfos.rentBillList.sort(function(el1, el2) {
                return parseInt(el1.term) - parseInt(el2.term); // 升序
              });
            } else {
              console.log('this.dataOrderBillPayInfos.rentBillList failed');
            }
          } else if (res.code === '1001') {
            this.$vux.alert.show({
              content: res.msg
            });
          } else {
            console.log('code === ' + res.code + ',getOrderPayInfo failed');
            this.$vux.alert.show({
              content: res.msg
            });
          }
        });
    }
  },
  mounted() {
    console.log('mounted');
    // let orderNo = this.$route.params.orderNo
    // orderNo = '00120180522000003568003628'    // 测试订单
    let orderNo = this.$store.state.orderNo;
    console.log('orderNo === ' + orderNo);
    this.getOrderBillPayInfos(orderNo);
  }
};
</script>

<style lang="less" rel="stylesheet/less">
.WXPayOverpaying {
  background: rgba(245, 245, 245, 1);

  .vux-header {
    background: #fff !important;
    border-bottom: 1px solid #eeeeee;
    .vux-header-title {
      color: #3c3c5e !important;
    }
    .vux-header-left {
      a {
        color: #3c3c5e !important;
      }

      .left-arrow:before {
        border: 1px solid #64647e !important;
        border-width: 2px 0 0 2px !important;
        -webkit-transform: rotate(315deg);
        transform: rotate(315deg);
        top: 8px;
        left: 7px;
      }
    }
  }

  .box-divider {
    height: 1px;
    background-color: grey;
  }

  .box-goodsImg {
    // float: left;
    width: 90px;
    height: 90px;
    margin-right: 12px;
    .goods-img {
      height: 90px;
      width: 90px;
    }
  }

  .box-goods {
    background-color: white;
    margin-top: 16px;
    // height: 175px;
  }

  .box-goods-more {
    overflow: hidden;
    display: flex;
    padding: 18px;
  }

  .goods-name {
    color: #111111;
    font-size: 14px;
  }

  .goods-price {
    color: grey;
    font-size: 0.8em;
  }

  .goods-labels {
    margin-top: 20px;
  }

  .label {
    display: inline-block;
    height: 21px;
    background-color: #f5f5f5;
    margin-right: 9px;
    border-radius: 3px;
    padding-left: 6px;
    padding-right: 6px;
    color: black;
    font-size: 12px;
    line-height: 21px;
    text-align: center;
  }

  .radio-left {
    float: left;
    width: 20%;
  }

  .box-wx-radio {
    width: 100%;
  }

  .box-button {
    margin-top: 18px;
    margin-left: 18px;
    margin-right: 18px;
    margin-bottom: 50px;
  }

  .button-toPay {
    color: #333333 !important;
    border-radius: 6px;
  }

  .MainPageTabBar {
    display: none;
  }

  .amount-title {
    .weui-cell__ft {
      color: #ff4754;
      font-size: 16px;
    }
  }

  .amount-descount {
    .weui-cell__ft {
      color: #888888;
      font-size: 16px;
    }
  }

  .pay-title {
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .box-pay-wx-left {
    margin-left: 10px;
    float: left;
  }

  .box-pay-server {
    color: #999999;
    font-size: 14px;
  }

  .box-pay-wx {
    background-color: white;
  }

  .box-pay-wx-middle {
    margin-left: 10px;
    float: left;
  }

  .box-pay-wx-right {
    margin-right: 10px;
    float: right;
  }

  .class-wx-icon {
    width: 46px;
    height: 46px;
  }

  .class-pay-select {
    width: 20px;
    height: 20px;
  }

  .box-ticket-number {
    padding-top: 14px;
    margin-left: 9px;
    margin-bottom: 14px;
  }

  .ticket-number-text {
    font-size: 14px;
    color: #888888;
    span {
      color: black;
    }
  }

  .divider {
    height: 1px;
    width: auto;
    margin-left: 9px;
    background-color: #f5f5f5;
  }

  .box-pay-first {
    float: left;
    padding-left: 18px;
    .box-pay-first-p {
      line-height: 54px;
      text-align: center;
      font-size: 16px;
      color: black;
    }
    .box-pay-first-p2 {
      line-height: 54px;
      text-align: center;
      font-size: 16px;
    }
  }

  .box-pay-amount {
    position: relative;
    margin-left: 146px;
    .box-pay-amount-p {
      display: inline-block;
      line-height: 54px;
      text-align: center;
      font-size: 16px;
      color: #888888;
      font-family: PingFangSC-Regular;
    }

    .box-pay-amount-p2 {
      position: absolute;
      right: 18px;
      line-height: 54px;
      text-align: center;
      font-size: 16px;
      color: #ff4754;
    }

    .box-pay-amount-p-right {
      position: absolute;
      right: 18px;
      display: inline-block;
      line-height: 54px;
      text-align: center;
      font-size: 16px;
      color: #888888;
      font-family: PingFangSC-Regular;
    }

    .icon-more {
      display: inline-block;
      position: absolute;
      margin-left: 12px;
      margin-top: 12px;
    }
  }

  .box-ticket {
    background-color: white;
    margin-top: 18px;
    padding-bottom: 18px;
  }

  // 账单
  .box-ticket-one-line {
    height: 54px;
  }

  .box-ticket-two-line {
    position: relative;
    height: 58px;
    .box-detail-show {
      position: absolute;
      right: 18px;
      bottom: 0;
      color: #5c99f4;
      font-size: 12px;
    }
  }

  .box-fee-name {
    float: left;
    padding-left: 18px;
    line-height: 24px;
  }

  .box-fee-value {
    position: absolute;
    right: 18px;
    line-height: 24px;
  }

  .payment-mode {
    & > div {
      background-color: white;
      height: 50px;
      margin: 10px 0px;
      .pay-left {
        float: left;
        height: 100%;
        min-width: 86%;
        .pay-left-img {
          float: left;
          position: relative;
          width: 55px;
          height: 100%;
          img {
            width: 28px;
            height: 28px;
            border-radius: 8px;
            position: absolute;
            top: 50%;
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
          height: 100%;
        }
        .fs-checkbox {
          display: none;
          &:checked + label {
            span {
              visibility: visible;
            }
          }
          & + label {
            margin-left: 10px;
            margin-right: 10px;
            margin-top: 10px;
            margin-bottom: 10px;
            top: 5px;
            position: relative;
            -webkit-appearance: none;
            border: 1px solid #4a90e2;
            padding: 4px;
            border-radius: 50px;
            display: inline-block;
            span {
              display: block;
              border-radius: 50%;
              background: #4a90e2;
              visibility: hidden;
              width: 10px;
              height: 10px;
            }
          }
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

  .box-ticket-down {
    position: relative;
    background-color: #f5f5f5;
    font-size: 12px;
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 18px;
    padding: 12px 0;
    color: #888888;
  }

  .boxPayTicketDown {
    display: none;
  }

  .iconfont {
    font-size: 15px;
  }

  .clearFix:after {
    clear: both;
    content: ".";
    height: 0;
    display: block;
    visibility: hidden;
  }
}
</style>
