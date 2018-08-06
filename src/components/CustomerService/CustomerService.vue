<template>
  <div class="GoodsDetailPage_cs" @click="customerServiceClick">
    <!--<i class="icon iconfont icon-iconfontfuwushichang"></i>-->
    <!--<div class="GoodsDetailPage_CS_Title">客服</div>-->
    <img srcset="./CS@1x.png 1x, ./CS@1.5x.png 2x"/>
  </div>
</template>

<script>
    export default {
      name: 'customer-service',
      methods: {
        customerServiceClick: function() {
          console.log('联系客服，请拨号:1872377323')
        }
      }
    }
</script>

<style lang="less">
  .GoodsDetailPage_cs {
    position: fixed;
    margin: 0 auto;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    font-size: 15px;
    img {
      width: 50px;
      height: 50px;
    }
  }
</style>
