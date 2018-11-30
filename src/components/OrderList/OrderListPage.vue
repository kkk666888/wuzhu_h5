<template>
  <div class="OrderListPage">
    <section>
      <tab active-color='#FFDA29' custom-bar-width="40px" v-model="index">
        <tab-item class="fs-tab-item" :selected="defaultItem === item" v-for="(item, index) in tabList" @click.native="onItemClick(index)" :key="index">{{item}}
        </tab-item>
      </tab>
    </section>
    <div id="ListContent" ref="ListContent" class="list-content">
      <div v-show="!showOrder" class="list-none" style="margin-top: 40px; text-align: center;">
        暂无数据～
      </div>
      <div class="list-wrapper" v-show="showOrder" v-for="(item, index) in orderInfos" :key="index">
        <div class="list-items">
          <div class="items-header" @click.stop="goDetail(index, item)">
            <div class="f-gray">
              <span class="items-icon"></span>
              <span class="order-num">订单编号：</span>
              <span class="num">{{ item.orderNo }}</span>
            </div>
            <span class="items-status">{{ item.statusStr | transformStatusStr }}</span>
          </div>
          <div class="items-content" @click.stop="goDetail(index, item)" :class="{'vux-1px-b': item.hasBtn}">
            <img class="items-img vux-1px" :src="item.listImg">
            <div class="items-des">
              <h3>{{ item.shortName }}</h3>
              <p class="spec-content-list mt20">
                规格：{{item.specContentList}}
              </p>
              <p class="spec-content-list mt2">
                下单时间:{{ item.createDate }}
              </p>
            </div>
            <!--已续租标记-->
            <div v-if="item.isAlreadyRelet && item.isAlreadyRelet === 'Y'" class="releted-mark"></div>
          </div>
          <div class="items-footer" :class="{'no-margin': !item.hasBtn}">
            <div class="btn-wrapper">
              <button v-if="item.showBTN&&(item.showBTN.indexOf('1')!='-1')" class="btn-gray" @click.stop="GoToPage(1, item)">取消订单</button>
              <button v-if="item.showBTN&&(item.showBTN.indexOf('2')!='-1')" class="btn-yellow" @click.stop="GoToPage(2, item)">支付</button>
              <button v-if="item.showBTN&&(item.showBTN.indexOf('3')!='-1')" class="btn-yellow" @click.stop="GoToPage(3, item)">查看物流</button>
              <button v-if="item.showBTN&&(item.showBTN.indexOf('4')!='-1')" class="btn-black" @click.stop="GoToPage(4, item)">维修</button>
              <button v-if="item.showBTN&&(item.showBTN.indexOf('5')!='-1')" class="btn-black" @click.stop="GoToPage(5, item)">归还</button>
              <button v-if="item.showBTN&&(item.showBTN.indexOf('6')!='-1')" class="btn-yellow" @click.stop="GoToPage(6, item)">续租</button>
              <button v-if="item.showBTN&&(item.showBTN.indexOf('7')!='-1')" class="btn-yellow" @click.stop="GoToPage(7, item)">买断</button>
              <button v-if="item.showBTN&&(item.showBTN.indexOf('8')!='-1')" class="btn-yellow" @click.stop="GoToPage(8, item)">提前买断</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section>
      <actionsheet v-model="cancelReasonShow" :menus="cancelReasonList" show-cancel @on-click-menu="cancelReasonClick"></actionsheet>
    </section>
  </div>
</template>
<script type="text/ecmascript-6">
import { Tab, TabItem, Actionsheet } from 'vux';
import { GetDirection } from './../../util/utils';
import { mapMutations } from 'vuex';
export default {
  name: 'OrderListPage', // 订单列表
  data() {
    return {
      touchs: {
        startx: 0,
        starty: 0,
        endx: 0,
        endy: 0
      },
      index: this.$store.state.orderState, // 订单状态 -- 进行中、已完成
      cancelReasonShow: false,
      // 取消订单的理由
      cancelReasonList: [
        {
          label:
            '您确定要取消该订单吗?<br/><span style="color:#666;font-size:12px;">请选择取消订单的理由,以完成取消</span>',
          type: 'info'
        },
        {
          label: '我不想租了',
          type: 'Primary'
        },
        {
          label: '商品规格写错了',
          type: 'Primary'
        },
        {
          label: '收货地址写错了',
          type: 'Primary'
        },
        {
          label: '支付有问题',
          type: 'Primary'
        },
        {
          label: '收货地址有问题',
          type: 'Primary'
        },
        {
          label: '我要重新下单',
          type: 'Primary'
        },
        {
          label: '其他',
          type: 'Primary'
        }
      ],
      tmpItem: {}, // 临时数据
      defaultItem: '',
      tabList: ['进行中', '已完成', '已取消'],
      showOrder: true, // 是否有订单数据
      underway: [], // 进行中
      completed: [], // 已完成
      canceled: [], // 已取消
      orderInfos: []
    };
  },
  created() {
    this.getOrderList();
  },
  mounted: function() {
    this.$refs.ListContent.addEventListener('touchstart', this.fsTouchstart.bind(this));
    this.$refs.ListContent.addEventListener('touchend', this.fsTouchend.bind(this));
  },
  beforeDestroy() {
    // 销毁
    this.$refs.ListContent.removeEventListener('touchstart', this.fsTouchstart);
    this.$refs.ListContent.removeEventListener('touchend', this.fsTouchend);
  },
  methods: {
    ...mapMutations(['updateLoadingStatus']),
    fsTouchstart(e) {
      this.touchs.startx = e.touches[0].pageX;
      this.touchs.starty = e.touches[0].pageY;
    },
    fsTouchend(e) {
      let that = this;
      that.touchs.endx = e.changedTouches[0].pageX;
      that.touchs.endy = e.changedTouches[0].pageY;
      let direction = GetDirection(that.touchs);
      // console.log('>>> direction', direction);
      // 返回值: 0, 1 上 2 下 3 左 4 右
      if (direction.code === 3) {
        // that.index-- 左
        if (that.index === 0) {
          that.index = 2;
        } else {
          that.index--;
        }
        that.onItemClick(that.index);
      } else if (direction.code === 4) {
        // that.index++ 右
        if (that.index === 2) {
          that.index = 0;
        } else {
          that.index++;
        }
        that.onItemClick(that.index);
      }
    },
    // 数据分组 -- 按钮显示
    dataPacket(lists) {
      let that = this;
      lists.map(function(item, index, array) {
        item.specContentList = String(item.specContentList.replace(/,/g, '/'));
        item.showBTN = that.getButtonsListStrWithItem(item.orderButtons);
        // 老的代码逻辑
        switch (parseInt(item.bizStatus)) {
          case 1: // 待确认
            that.underway.push(item); // 进行中
            break;
          case 2: // 待支付
            that.underway.push(item); // 进行中
            break;
          case 3: // 已支付
            that.underway.push(item); // 进行中
            break;
          case 4: // 取消订单
            that.canceled.push(item); // 已取消
            break;
          case 5: // 待发货
          case 6: // 待发货
          case 8: // 退货中
          case 9: // 回收中
            that.underway.push(item); // 进行中
            break;
          case 7: // 租赁中
            that.underway.push(item); // 进行中
            break;
          case 10: // 买断中
            that.underway.push(item); // 进行中
            break;
          case 99: // 完结
            that.completed.push(item); // 已完成
            break;
          default:
            that.underway.push(item); // 进行中
        }
        // 新的按钮展示逻辑
        if (item.showBTN.length) {
          that.$set(item, 'hasBtn', true);
        } else {
          that.$set(item, 'hasBtn', false);
        }
      });
    },
    // 根据返回的item数据返回对应的按钮需要展示的链表
    getButtonsListStrWithItem(orderButtons) {
      let buttonListStr = '';
      if (orderButtons !== undefined && orderButtons instanceof Array) {
        for (let i = 0; i < orderButtons.length; i++) {
          let button = orderButtons[i];
          switch (button.buttonName) {
            case '取消订单': {
              if (button['isShow'] === 'Y') {
                buttonListStr = buttonListStr + '1 ';
              }
              break;
            }
            case '支付': {
              if (button['isShow'] === 'Y') {
                buttonListStr = buttonListStr + '2 ';
              }
              break;
            }
            case '查看物流': {
              if (button['isShow'] === 'Y') {
                buttonListStr = buttonListStr + '3 ';
              }
              break;
            }
            case '维修': {
              if (button['isShow'] === 'Y') {
                buttonListStr = buttonListStr + '4 ';
              }
              break;
            }
            case '归还': {
              if (button['isShow'] === 'Y') {
                buttonListStr = buttonListStr + '5 ';
              }
              break;
            }
            case '买断': {
              if (button['isShow'] === 'Y') {
                buttonListStr = buttonListStr + '7 ';
              }
              break;
            }
            case '续租': {
              if (button['isShow'] === 'Y') {
                buttonListStr = buttonListStr + '6 ';
              }
              break;
            }
            default:
              break;
          }
        }
      }
      return buttonListStr;
    },
    getOrderList() {
      let that = this;
      this.updateLoadingStatus({ isLoading: true });
      that.$http
        .get('/wuzhu/order/getMyOrders', {
          // .get('/src/components/OrderList/副本/OrderListPage.json', {
          bizStatus: '',
          status: ''
        })
        .then(res => {
          this.updateLoadingStatus({ isLoading: false });
          if (res.code === '00' && res.data) {
            that.dataPacket(res.data); // 数据分组
            if (that.index === 0) {
              that.orderInfos = that.underway;
            } else if (that.index === 1) {
              that.orderInfos = that.completed;
            } else if (that.index === 2) {
              that.orderInfos = that.canceled;
            } else {
              that.orderInfos = that.underway;
            }
          } else {
            that.$vux.alert.show({
              content: res.msg
            });
          }
        })
        .catch(err => {
          this.updateLoadingStatus({ isLoading: false });

          console.log(err);
        });
    },
    onItemClick(index) {
      let that = this;
      that.index = index;
      that.$store.commit('ORDER_STATE', { orderState: index });
      if (index === 0) {
        that.orderInfos = that.underway;
      } else if (index === 1) {
        that.orderInfos = that.completed;
      } else {
        that.orderInfos = that.canceled;
      }
    },
    GoToPage(order, item) {
      let that = this;
      that.tmpItem = item;
      if (order === 1) {
        // 取消订单
        that.cancelReasonShow = true;
      } else if (order === 2) {
        // 支付
        if (item.bizStatus === '7') {
          that.$store.commit('updateOrderNo', { orderNo: item.orderNo });
          that.$router.push({ name: 'WXPayOverpaying', params: item });
        } else if (item.buyOutType === '0' || item.buyOutType === '1' || item.buyOutType === '5') {
          // 强制买断走账单支付
          that.$store.commit('updateOrderNo', { orderNo: item.orderNo });
          that.$router.push({ name: 'WXPayOverpaying', params: item });
        } else {
          that.$store.commit('updateOrderNo', { orderNo: item.orderNo });
          that.$router.push({ name: 'WXPaying', params: item });
        }
      } else if (order === 3) {
        // 查看物流
        that.$store.commit('updateOrderNo', { orderNo: item.orderNo });
        that.$router.push({ name: 'LogisticsDetail' });
      } else if (order === 4) {
        // console.log('>> 维修');
        that.$router.push({ name: 'Service' });
      } else if (order === 5) {
        // console.log('>> 归还');
        that.$router.push({ name: 'GoodsReturn', params: item });
      } else if (order === 6) {
        that.common.launchRelet(that, item);
      } else if (order === 7) {
        // console.log('>> 买断');
        that.$store.commit('updateOrderNo', { orderNo: item.orderNo });
        that.$router.push({ name: 'Buyout', params: item });
      } else if (order === 8) {
        // console.log('>> 提前买断');
        that.$store.commit('updateOrderNo', { orderNo: item.orderNo });
        that.$router.push({ name: 'Buyout', params: item });
      }
    },
    // 取消订单
    canceledOrder(item, cancelReason) {
      let that = this;
      that.$http
        .post('/wuzhu/order/cancleOrder', {
          orderNo: item.orderNo,
          reason: cancelReason.label
        })
        .then(res => {
          if (res.code === '00') {
            that.$vux.alert.show({
              content: '取消订单成功'
            });
            // 刷新页面 -- 重新请求后台
            that.underway = [];
            that.completed = [];
            that.canceled = [];
            that.getOrderList();
            // 刷新页面 -- 本地修改状态
          } else {
            that.$vux.alert.show({
              content: res.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    goDetail(index, item) {
      // OrderDetailNewPage - OrderDetailPage
      this.$router.push({ name: 'OrderDetailNewPage', params: item });
    },
    // 选择取消理由弹框点击
    cancelReasonClick(key, item) {
      // 点了 取消 按钮; key 为 cancel
      if (key !== 'cancel') {
        this.canceledOrder(this.tmpItem, item);
      }
    }
  },
  filters: {
    transformStatusStr: value => {
      // console.log(value)
      if (value) {
        return value.split('-')[0];
      } else {
        return value;
      }
    }
  },
  components: {
    Tab,
    Actionsheet,
    TabItem
  }
};
</script>
<style lang="less" rel="stylesheet/less">
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/center.less';
@import '../../common/less/index.less';
.list-content {
  font-family: PingFangSC-Regular;
  padding-top: 18px;
  min-height: 400px;
  .list-wrapper {
    background: #ffffff;
    margin-bottom: 18px;
    .items-header {
      position: relative;
      padding: 0 15px;
      padding-left: 0px;
      height: 48px;
      line-height: 48px;
      margin-left: 15px;
      .border-1px();
      .items-icon {
        display: inline-block;
        width: 3px;
        height: 12px;
        vertical-align: middle;
      }
      .order-num {
        float: left;
        // display: inline-block;
      }
      .f-gray {
        display: inline-block;
        font-size: 14px;
        color: #9b9b9b;
        letter-spacing: 0;
        height: 100%;
      }
      .num {
        font-size: 14px;
        color: #000000;
        letter-spacing: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 170px;
        display: inline-block;
      }
      .items-status {
        position: absolute;
        text-align: right;
        font-size: 14px;
        color: #ffc400;
        right: 0px;
        padding-right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 75px;
      }
    }
    .items-content {
      display: flex;
      margin: 14px 15px;
      padding-bottom: 14px;
      vertical-align: bottom;
      position: relative;
      margin-right: 0;
      padding-right: 15px;
      margin-bottom: 9px;
      .items-img {
        flex: 0 0 60px;
        width: 80px;
        height: 80px;
        margin-right: 10px;
      }
      .items-des {
        width: 100%;
        overflow: hidden;
        flex: 1;
        h3,
        p {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-family: PingFangSC-Regular;
        }
        h3 {
          font-size: 14px;
          color: #1a2a3e;
          letter-spacing: 0;
          line-height: 20px;
        }
        p {
          font-size: 11px;
          color: #9b9b9b;
          line-height: 20px;
        }
        .spec-content-list {
          margin-top: 3px;
          &.mt20 {
            margin-top: 20px;
          }
          &.mt2 {
            margin-top: 2px;
          }
          span {
            margin-right: 8px;
          }
        }
        .create-date {
          text-align: right;
          position: absolute;
          right: 1px;
          bottom: 4px;
        }
      }

      .releted-mark {
        position: absolute;
        left: 0;
        top: 0;
        width: 38px;
        height: 22px;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url('./img/reletedMark.png');
      }
    }
    .items-footer {
      margin: 10px 15px;
      display: flex;
      padding-bottom: 10px;
      &.no-margin {
        margin: 0;
      }
      .first-pay {
        flex: 0 0 150px;
        font-family: PingFangSC-Medium;
        font-weight: 700;
        font-size: 13px;
        color: #000000;
        letter-spacing: 0;
      }
      .btn-wrapper {
        flex: 1;
        text-align: right;
      }
      button {
        width: 75px;
        box-sizing: border-box;
        line-height: 25px;
        border: 0;
        border-radius: 3px;
        outline: none;
        margin-left: 6px;
        font-size: 12px;
      }
      .btn-black {
        color: #111111;
        .border-1px-all(#ddd);
        background: #fff;
        border-color: #dddddd;
      }
      .btn-gray {
        color: #9b9b9b;
        background: #fff;
        .border-1px-all(#ddd);
        border-color: #ddd;
      }
      .btn-yellow {
        color: #4a4a4a;
        background: @orange;
      }
    }
  }
  @media screen and (max-width: 374px) {
    .list-wrapper {
      .items-header {
        .items-icon {
          width: 3px;
          margin-right: 7px;
        }
        .num {
          max-width: 130px;
        }
        .items-status {
          max-width: 75px;
        }
      }
      .items-footer {
        .first-pay {
          flex: 0 0 140px;
        }
        button {
          padding: 0 8px;
          margin-left: 0px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
