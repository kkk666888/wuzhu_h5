<template>
  <div class="WXPayAgreement">

    <div class="box-agreement">
      <iframe src="https://www.baidu.com" width="100%" height="100%"></iframe>
    </div>

    <div class="box-isAgree">
      <check-icon :value.sync="isAgree" class="check-agree">本人已阅读并同意签署《用户租赁及服务协议》</check-icon>
    </div>

    <div>
      <p class="agreement-tip">首付资金支付后，因个人原因拒绝签收租赁物品，自愿承担损失。</p>
    </div>

    <div class="box-button">
      <x-button :disabled="!isAgree" :link="{path:'/Pay/WXPaying'}" class="button-next" text="下一步" :gradients="['#f1cd37', '#f1cd37']"></x-button>
    </div>

  </div>
</template>

<script>
import { XHeader, CheckIcon, XButton } from 'vux';
export default {
  name: 'WXPayAgreement',
  components: {
    XHeader,
    CheckIcon,
    XButton
  },
  data() {
    return {
      isAgree: true
    };
  }
};
</script>

<style lang="less">
.WXPayAgreement {
  height: 100%;
  width: 100%;
  position: absolute;
}

.box-agreement {
  width: 100%;
  height: 60%;
}

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

.box-isAgree {
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 25px;
}

.agreement-tip {
  color: grey;
  font-size: 0.8em;
  margin-top: 5px;
  margin-left: 30px;
  margin-right: 25px;
}

.box-button {
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 10px;
}

.button-next {
  color: black !important;
}
</style>