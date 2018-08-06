<template>
  <div class="OrderSubSuccessPage">
    <!--图文展示成功-->
    <!-- <x-icon type="ios-plus-outline" size="30"></x-icon>-->
    <div class="iconClassDiv">
      <!-- <x-icon type="ios-checkmark-outline" size="80"></x-icon> -->
      <img class="success-icon" srcset="./Success@1x.png 1x, ./Success@1.5x.png 1.5x"/>
    </div>
    <div class="textDescDiv">
      <div style="text-align: center; font-size: 18px; font-family:'PingFangSC-Medium'; color: #333333; margin-bottom: 12px">您的租赁订单已预约成功</div>
      <div style="text-align: center; font-size: 14px; font-family:'PingFangSC-Medium'; color: #888888">请耐心等待后台审核，审核结果会及时告知， <br>请保持电话畅通</div>
    </div>
    <!--<div class="successShowPlane">-->
      <!--<msg class="msg" description="您的租赁订单已预约成功，请耐心等待后台审核，审核结果会及时告知，请保持电话畅通"></msg>-->
    <!--</div>-->
    <!--按钮部分-->
    <div class="buttonsPlane" style="display: flex; justify-content: center">
      <div style="margin-right: 20px">
        <x-button  @click.native="menuButtonClick('返回首页')">返回首页</x-button>
      </div>
      <div>
        <x-button  @click.native="menuButtonClick('查看订单')">查看订单</x-button>
      </div>
      <!--<flexbox>-->
        <!--<flexbox-item v-for="(menuTtem, menuIndex) in menuList" :key="menuIndex">-->
          <!--<x-button  @click.native="menuButtonClick(menuTtem)">{{ menuTtem }}</x-button>-->
        <!--</flexbox-item>-->
      <!--</flexbox>-->
    </div>
  </div>
</template>

<script>
  import {XButton, Msg, Flexbox, FlexboxItem} from 'vux'
  // import config from './../../util/config'
  export default {
    name: 'OrderSubSuccessPage',
    components: {
      XButton,
      Msg,
      Flexbox,
      FlexboxItem
    },
    data() {
      return {
        menuList: ['返回首页', '查看订单'],
        orderNo: ''
      }
    },
    created() {
      let tempParam = this.$router.app._route.params
      this.orderNo = tempParam.orderNo
      console.log('传递过来的订单号为: ' + JSON.stringify(tempParam))
    },
    // 路由部分的处理，离开页面和进入页面的处理
    beforeRouteLeave(to, from, next) {
      console.log('to.name = ' + to.name)
      if (to.name === 'OrderSubmitPage') {
        // var numberOfEntries = window.history.length;
        // console.log('即将返回首页 当前层级为' + numberOfEntries);
        // let number = -(numberOfEntries - 1)
        // console.log('number ==== ' + number);
        // // this.$router.go(number);
        // this.$router.go(number);
        next({name: 'HomePage'})
      } else {
        next()
      }
    },
    methods: {
      menuButtonClick(menuTtem) {
        if (menuTtem === '返回首页') {
          this.$router.push({name: 'HomePage'})
          // var numberOfEntries = window.history.length;
          // console.log('即将返回首页 当前层级为' + numberOfEntries);
          // let number = -(numberOfEntries - 1)
          // this.$router.go(number);
        } else if (menuTtem === '查看订单') {
          // 构造数据
          // let tempParam = this.$router.params.item
          // that.orderNo = tempParam.orderNo
          let item = {
            orderNo: this.orderNo
          }
          this.$router.push({name: 'OrderDetailNewPage', params: item})
        } else {
          // Do Nothine
        }
      }
    }
  }
</script>

<style lang="less">
  @import "./../../common/less/index";
  .OrderSubSuccessPage{
    .iconClassDiv{
      text-align: center;
      width: 100%;
      margin-top: 79px;
    }
    .textDescDiv{
      margin-top: 30px;
      margin-left: 18px;
      margin-right: 18px;
    }
    /*Xicon的图标样式*/
    .vux-x-icon {
      fill: #51C429;
    }
    .successShowPlane{

    }
    .buttonsPlane {
      margin: 12px 68px 0px 68px;
      display: flex;
      justify-content: center;
      align-items: center;

      .weui-btn {
        padding: 0;
        width: 111px!important;
        height: 36px!important;
        background: #FFDA29 !important;
        font-size: 17px !important;
        text-align: center !important;
        border-radius: 6px !important;
      }
    }
    .success-icon {
      width: 80px;
      height: 80px;
    }
  }
</style>
