<template>
  <div class="GoodsDetailHeader">
    <!--商品详情的头部信息-->
    <div class="goodsDetial">
      <div class="goodsImgDiv">
        <img class="goodsImage" :src="goodListImage" />
      </div>
      <div class="goodsInfoPlane">
        <div class="fullName">{{ fullName }}</div>
        <div class="markPrice">市场价:&nbsp;￥{{ marketPrice }}元</div>
        <div class="categoryList">
          <span class="categoryListItem" v-for="(specItem, specIndex) in listCommoditySpec" :key="specIndex">{{ specItem }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GoodsDetailHeader',
  data() {
    return {};
  },
  component: {},
  props: {
    goodListImage: {
      type: String,
      default: '/static/images/loading.png'
    },
    fullName: '',
    marketPrice: '',
    listCommoditySpec: {
      type: Array,
      default: () => []
    }
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang="less" scoped>
@import '../../common/less/index.less';
@color-h: #111;
@color-white: #fff;
@lineheight-p: 20px;
@fontsize-p: 14px;
.GoodsDetailHeader {
  .goodsDetial {
    display: flex;
    justify-content: flex-start;
    background: @color-white;
    padding: 20px 15px;
    margin-bottom: 15px;
    .goodsImgDiv {
      font-size: 0;
      .goodsImage {
        width: 80px;
        height: 80px;
      }
    }
    .goodsInfoPlane {
      margin-left: 10px;
      .fullName {
        font-size: @fontsize-p;
        color: #1a2a3e;
        letter-spacing: 0;
        line-height: 15px;
        margin-bottom: 5px;
        letter-spacing: 0.1em;
      }
      .markPrice {
        font-size: 12px;
        color: @gray-8;
        letter-spacing: 0;
        line-height: 20px;
        margin-bottom: 2px;
        margin-top: 21px;
      }
      .categoryList {
        .categoryListItem {
          padding: 3px 13px;
          font-size: 12px;
          color: #000000;
          letter-spacing: 0;
          margin-right: 5px;
          background: rgba(245, 245, 245, 1);
          border-radius: 4px;
        }
      }
    }
  }
}
</style>


