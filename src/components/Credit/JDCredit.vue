<template>
  <div class="credit" :class="{'bg-white': showLogin}">
    <!-- <div class="login" v-show="showLogin">
      <img src="./5-130H2191322-52.gif">
    </div> -->
    <section class="text-msg" :class="{'bg-white': !showNoToken}">
      <div class="score">
        <div class="avatar-left">
          <img src="./JDlogo.png" srcset="./JDlogo.png 1x, ./JDlogo@2x.png 2x"/>
          京东小白信用
        </div>
        <span class="font-orange avatar-right">{{this.score}}</span>
      </div>
      绑定账号授权信用查询有助于您的信用免押评估，对您的资料根据授权协议严格保密。
    </section>
    <p style="margin-top: 20px;"  class="btn-orange">
      <x-button type="primary" @click.native="goBack">返回首页</x-button>
    </p>
    <p style="margin-top: 20px;"  class="btn-orange">
      <x-button type="default" @click.native="check">取消授权</x-button>
    </p>
  </div>
</template>
<script type="text/ecmascript-6">
  import { XInput, Group, XButton, Cell } from 'vux'
  import Vue from 'vue'
  export default {
    data() {
      return {
        showLogin: false,
        iconType: '',
        showNoToken: true,
        openid: sessionStorage.getItem('JDOpenid') || '',
        score: this.$store.state.xiaobaiScores,
        pageName: '',
        checkStatus: false, // 是否显示取消授权BTN
        accountStatus: this.$store.state.accountStatus,
        JDaccessToken: localStorage.getItem('JDaccessToken') || ''
      }
    },
    methods: {
      goBack() {
        this.$router.push({name: 'HomePage'})
      },
      check() {
        let that = this
        that.$vux.confirm.show({
          content: '解绑小白信用授权将影响信用免押的评估，请慎重考虑。',
          onCancel() {
            console.log('plugin cancel')
          },
          onConfirm() {
            that.unBindJD()
          }
        })
      },
      goNext() {
        this.$router.push({name: 'LivenessVerify'})
      },
      unBindJD() {
        let that = this
        let params = {
          openId: that.openid,
          merchantCode: ''
        }
        this.$store.commit('updateLoadingStatus', {isLoading: true})
        that.$http.get('/wuzhu/reservationController/unbindJDXBCredit', params).then(res => {
          this.$store.commit('updateLoadingStatus', {isLoading: false})
          if (res.code === '00') {
            window.localStorage.setItem('JDaccessToken', '')
            that.JDaccessToken = ''
            that.showNoToken = true
            Vue.$vux.alert.show({
              content: `${res.msg}`,
              onHide() {
                that.$router.push({name: 'MinePage'})
              }
            })
          } else {
            Vue.$vux.alert.show({
              content: `${res.msg}`
            })
          }
        })
      }
    },
    components: {
      XInput,
      Group,
      XButton,
      Cell
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import '../../common/less/index.less';
  .credit{
    height: 100%;
    box-sizing: border-box;
    background: @bg;
    .login{
      padding-top: 40px;
      img{
        display: block;
        margin: 0 auto;
      }
    }
    .text-msg{
      font-size: 12px;
      line-height: 20px;
      padding: 20px;
      color: #bbb;
      .score{
        display: flex;
        margin-bottom: 15px;
      }
      .avatar-left{
        flex: 1;
        font-size: 16px;
        color: #333;
        img{
          border-radius: 3px;
          width: 45px;
          height: 45px;
          vertical-align: middle;
        }
      }
      avatar-right{
        flex: 0 0 50px;
        width: 50px;

      }
      .font-orange{
        color: #FFC400;
        font-size: 16px;
      }
    }
    .weui-btn_default{
      width: 90%;
      margin: 0 auto;
    }
    .weui-btn_primary{
      width: 90%;
      margin: 0 auto;
      background-color: #FFDA29;
    }
  }
  .bg-white{
    background: white;
  }
</style>
