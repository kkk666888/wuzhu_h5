<template>
  <div class="Account">
    <div class="box-account">
      <p class="p-show">当前账户余额：</p>
      <p class="p-amount">￥{{ amount }}</p>
      <p class="p-tips">本账户仅限于平台内支付租金使用</p>
    </div>
    <div>
      <p class="p-trade-show">账户交易记录：</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Account',
    data() {
      return {
        amount: 0
      }
    },
    mounted() {
      // this.amount = this.$route.params.amount
    }
  }
</script>

<style lang="less">
  .Account {
    background: #F5F5F5;
    .box-account {
      background: white;
      padding-left: 15px;
      height: 142px;
      .p-show {
        padding-top: 30px;
        font-size: 14px;
        color: rgba(0,0,0,0.45);
        line-height: 20px;
      }
      .p-amount {
        margin-top: 6px;
        color: rgba(0,0,0,0.85);
        line-height: 36px;
        font-size: 25px;
      }
      .p-tips {
        margin-top: 3px;
        line-height: 17px;
        color: rgba(245,34,45,1);
        font-size: 12px;
      }
    }

    .p-trade-show {
      padding-left: 15px;
      padding-top: 15px;
      font-size: 14px;
      color: rgba(0,0,0,0.45);
      line-height:21px;
    }
  }
</style>
