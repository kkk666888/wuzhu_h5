<template>
  <div class="InitiateGoodsReturn">
    <!--商品详情的信息-->
    <goods-header :goodListImage="goodListImage" :fullName="fullName" :marketPrice="marketPrice" :listCommoditySpec="listCommoditySpec"></goods-header>
    <!-- 寄回信息 -->
    <div class="return-info">
      <div class="return-address">
        <p class="address-title">请将商品寄回以下地址</p>
        <div class="cutline vux-1px-t"></div>
        <div class="address-item">
          <span class="name">地址</span>
          <p class="detail">{{supplierAddress}}</p>
        </div>
        <div class="address-item2">
          <p class="name">联系人</p>
          <p class="detail">{{ supplierContact }}</p>
        </div>
      </div>
      <div class="cutline vux-1px-t"></div>
      <div class="logistics">
        <p class="address-title">寄回商品时，请务必选择</p>
        <div class="cutline vux-1px-t"></div>
        <ul class="logistics-attention">
          <li>京东/顺丰物流</li>
          <li>购买保价</li>
        </ul>
      </div>
    </div>
    <div class="attention clearfix">
      <p class="address-title">注意事项</p>
      <div class="cutline vux-1px-t"></div>
      <ul>
        <li>1、若您租赁的商品为iphone/ipad/mac，归还商品前，请务必关闭寻找功能，并提前注销icloud中的Apple ID。</li>
        <li>2、归还商品时，请将配件一同归还，若发生遗失或损坏，将按配件签约价赔偿。</li>
        <li>3、请在租赁到期后1天内寄出商品，否则将视为归还逾期。</li>
      </ul>
      <!-- 填写物流按钮 -->
      <x-button type="primary" class="go-writelogistics" action-type="button" @click.native="goWriteLogisticsInfo">填写物流信息</x-button>
    </div>
  </div>
</template>
<script>
import { XButton } from 'vux';
import GoodsHeader from './GoodsDetailHeader.vue';
export default {
  name: 'InitiateGoodsReturn',
  components: {
    XButton,
    GoodsHeader
  },
  data() {
    return {
      getGoodsInfoUrl: '/wuzhu/vendor/getVendorReciveAddress',
      getOrderDetailUrl: '/wuzhu/order/getOrderDetail',
      supplierAddress: '', // 供应商地址
      supplierContact: '', // 供应商联系人
      listCommoditySpec: [],
      goodListImage: '',
      fullName: '',
      marketPrice: null
    };
  },
  props: {},
  computed: {},
  created() {
    if (!Object.is(this.$route.params.orderNo, undefined)) {
      this.$store.commit('goodsReturnOrderNo', { goodsReturnOrderNo: this.$route.params.orderNo });
    }
  },
  mounted() {
    this.getGoodsInfo();
    this.addFooterColor();
  },
  methods: {
    // 填充底部颜色
    addFooterColor() {
      this.$nextTick(() => {
        let body = document.body.offsetHeight;
        let current = document.querySelector('.InitiateGoodsReturn').offsetHeight;
        if (body > current) {
          let bottom = body - current;
          document.querySelector('.attention').style.paddingBottom = bottom + 'px';
        } else {
          document.querySelector('.attention').style.paddingBottom = '20px';
        }
      });
    },
    // 获取商品详情及供应商地址信息
    async getGoodsInfo() {
      let param = {
        orderNo: this.$store.state.goodsReturnOrderNo
        // orderNo: '00120180627M004848130770'
      };
      try {
        this.$store.commit('updateLoadingStatus', { isLoading: true });
        let [goodsRes, addressRes] = await Promise.all([
          this.$http.get(this.getOrderDetailUrl, param),
          this.$http.get(this.getGoodsInfoUrl, param)
        ]);
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        if (goodsRes.code === '00') {
          let data = goodsRes.data.commodity;

          this.fullName = data.fullName;
          this.marketPrice = data.marketPrice;
          this.goodListImage = data.listImg;
          this.listCommoditySpec = data.specContentList.split(',');
        } else {
          this.$vux.alert.show(goodsRes.msg);
        }

        if (addressRes.code === '00') {
          let res = addressRes.data;
          this.supplierAddress = `${res.province}${res.city}${res.area}${res.location}`;
          this.supplierContact = `${res.contract}(${res.contractPhone})`;
        } else {
          this.$vux.alert.show(addressRes.msg);
        }
      } catch (error) {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        this.$vux.alert.show(error.message);
        console.log(error);
      }
    },
    goWriteLogisticsInfo() {
      let params = {};
      this.$router.push({ name: 'WriteLogisticsInfo', params: params });
    }
  }
};
</script>
<style lang="less" scoped>
@import '../../common/less/index.less';
@color-h: #111;
@color-white: #fff;
@lineheight-p: 20px;
@fontsize-p: 14px;
.InitiateGoodsReturn {
  .address-title {
    font-size: 16px;
    color: @color-h;
    padding: 10px 15px;
    line-height: 22px;
  }
  .cutline {
    border-color: #ddd;
  }
  .return-info {
    margin: 10px 0;
    background-color: @color-white;
    .address-item {
      display: flex;
      padding: 15px 8px 0 15px;
    }
    .address-item2 {
      display: flex;
      padding: 20px 8px 20px 15px;
    }
    .name {
      flex: 1;
      display: inline-block;
      font-size: @fontsize-p;
      color: #474747;
      text-align: left;
    }
    .detail {
      .f14;
      flex: 5;
      vertical-align: top;
      display: inline-block;
      word-break: break-all;
      margin-left: -3px;
      color: @gray-8;
    }
    .logistics {
      .logistics-attention {
        padding: 9px 20px 15px 15px;
        font-size: @fontsize-p;
        line-height: 20px;
        color: @gray-8;
      }
      li {
        list-style-type: disc;
        padding: 5px 10px 5px 0;
        margin-left: 18px;
      }
    }
  }
  .attention {
    background-color: @color-white;
    font-size: 0;
    vertical-align: -4px;
    ul {
      margin: 15px;
      color: @gray-8;
      font-size: @fontsize-p;
    }
    .go-writelogistics {
      width: 94%;
      height: 44px;
      background-color: @orange;
      border-radius: 4px;
      font-size: 18px;
      color: #333;
      margin-top: 15px;
      margin-bottom: 20px;
    }
  }
}
</style>


