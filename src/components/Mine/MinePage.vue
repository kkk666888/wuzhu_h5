<template>
  <div class="MinePage">
    <div class="user_title">
    <div class="d_userInfo">
      <p class="p_user_name" padding-left="150px;">
        <img class="i_user_icon" srcset="./user_icon@1x.png 1x, ./user_icon@1.5x.png 1.5x" align="middle">
        <span class="user_span" v-if="userName">你好，{{userName}}</span>
        <span class="user_span" v-if="userPhone && !userName">{{userPhone}}</span>
        <span class="user_span" v-show="!userName && !userPhone" @click="goLogin">请登录</span>
        <!--<span class="color-space"></span>-->
      </p>
      <div class="box-exempt">
        <p class="p-exempt-title">{{ exempt.show }}</p>
        <span class="span-exempt">{{ exempt.step1 }}<img v-show="exempt.icon" src="./exempt.png" style="margin-left: 2px; width: 14px; height: 14px;"/></span>
        <span class="span-exempt span-exempt-label2">{{ exempt.step2 }}</span>
        <div v-show="exempt.position === '1.11' || exempt.position === '1.12'" class="btn-obtain" @click="exemptPage">
          <span>立即领取</span>
        </div>
      </div>
    </div>
      <div class="d_order_rental">
      <p class="p_order_rental">租赁订单</p>
      <flexbox class="flex_order_rental" orient="horizontal">
        <flexbox-item @click.native="goPage(0)">
          <div class="flex_order_running flex_order">
            <img class="order-icon p-r"
                 src="./user_order_running.png"
                 srcset="./user_order_running.png 1x, ./user_order_running@2x.png 2x">
            <span class="p-r vux-reddot count" v-show="this.repaymentingCount > 0"></span>
            <p>进行中</p>
          </div>
        </flexbox-item>
        <flexbox-item @click.native="goPage(1)">
          <div class="flex_order_finish flex_order">
          <img class="order-icon p-r"
               src="./user_order_finish.png"
               srcset="./user_order_finish.png 1x, ./user_order_finish@2x.png 2x">
            <span class="p-r vux-reddot count" v-show="this.repaymentSuccessCount > 0"></span>
            <p>已完成</p>
          </div>
        </flexbox-item>
        <flexbox-item @click.native="goPage(2)">
          <div class="flex-order_cancel flex_order">
          <img class="order-icon p-r"
               src="./user_order_cancel.png"
               srcset="./user_order_cancel.png 1x, ./user_order_cancel@2x.png 2x">
            <span class="p-r vux-reddot count" v-show="this.cancleCount > 0"></span>
            <p>已取消</p>
          </div>
        </flexbox-item>
      </flexbox>
    </div>
    </div>
      <div class="d_user_manager">
   	  <group>
        <!--<cell @click.native="goPage(8)" class="cell_info" title="我的账户" is-link></cell>-->
   	  	<cell @click.native="goPage(3)" class="cell_info" title="身份信息" is-link></cell>
   	  	<!--<cell :link="{path:'/OrderList/OrderListPage'}" class="cell_info" title="地址管理" is-link></cell>-->
   	  	<cell @click.native="goPage(5)" class="cell_info" title="信用授权"
              is-link></cell>
   	  	<cell @click.native="goPage(4)" class="cell_info" title="邀请好友" is-link></cell>
        <cell @click.native="goPage(7)" class="cell_info" title="关注物主公众号" is-link></cell>
   	  	<cell @click.native="goPage(6)" class="cell_info" title="设置" is-link></cell>
       </group>
    </div>
    <section>
      <main-page></main-page>
    </section>
  </div>
</template>
<script>
  import { Flexbox, FlexboxItem, Group, Cell } from 'vux'
  import MainPage from './../Main/MainPage'
  import Vue from 'vue'
    export default {
      name: 'MinePage',
      data() {
        return {
          userName: '',
          userPhone: '',
          isLogin: false,
          accountStatus: null, // 是否认证身份证信息
          cancleCount: 0, // 已取消, 0,不显示， 大于0显示红点
          repaymentSuccessCount: 0, // 完成
          repaymentingCount: 0, // 进行中
          exempt: {
            position: '',
            show: '',
            step1: '',
            step2: '',
            icon: false
          }
        }
      },
      created() {
        this.$store.commit('updateLoadingStatus', {isLoading: true})
        // 从些去身份信息为save
        this.$store.commit('ID_INFO_BTN_STATE', {IDInfoBtnState: 'save'})
        localStorage.setItem('origin', 'MinePage')
        this.getUserInfo()
      },
      methods: {
        goLogin() {
          this.$router.push({name: 'InitLogin'})
        },
        goPage(index) { // 订单选项
          let that = this
          if (!this.isLogin && index !== 6 && index !== 7) {
            Vue.$vux.alert.show({
              content: `未登录，请先登录`,
              onHide() {
                // that.checkPage(index)
                that.$store.commit('prevPageMemory', {prevPage: 'MinePage'})
                that.$router.push({name: 'InitLogin'})
              }
            })
          } else {
            that.goNext(index)
          }
        },
        goNext(index) {
          let that = this
          switch (index) {
            case 3:
              that.$router.push({name: 'IDverify'})
              break
            case 4:
              that.$router.push({name: 'InviteFriends'})
              break
            case 5:
              that.checkUserStatue()
              break
            case 6:
              that.$router.push({name: 'Settings'})
              break
            case 7:
              // 下面的链接如果从微信聊天界面跳转是可以正常关注的，如果从我们H5内部跳转，有时无法关注，暂不知原因，改为跳转页面识别二维码的方式
              // window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzUzNzc2OTA5Mw==#wechat_redirect'
              that.$router.push({name: 'Follow'})
              break
            case 8:
              that.$router.push({name: 'Account'})
              break
            default:
              this.$store.commit('ORDER_STATE', {orderState: parseInt(index)})
              this.$router.push({ name: 'OrderListPage', params: { orderState: parseInt(index) } })
              console.log(index)
          }
        },
        checkUserStatue() {
          this.$store.commit('accountStatusMemory', {accountStatus: this.accountStatus})
          this.$router.push({name: 'Credit'})
        },
        getUserInfo() {
          this.$http.get('/wuzhu/user/getCustomrtInfo').then(res => {
            if (res.code === '00' && res.data) {
              this.isLogin = true
              this.userName = res.data.name
              this.userPhone = res.data.mebile
              this.accountStatus = res.data.accountStatus
              this.cancleCount = res.data.cancleCount
              this.repaymentSuccessCount = res.data.repaymentSuccessCount
              this.repaymentingCount = res.data.repaymentingCount
              this.checkCustomerInfo()
            } else if (res.code === '1001') {
              this.isLogin = false
              this.accountStatus = res.msg
              this.updateExempt('1.11')
            }
            this.$store.commit('updateLoadingStatus', {isLoading: false})
          })
        },
        checkCustomerInfo() {
          this.$store.commit('updateLoadingStatus', {isLoading: true})
          this.$http.get('/wuzhu/customerVerController/queryCustomerInfoAndEd').then(res => {
            this.$store.commit('updateLoadingStatus', {isLoading: false})
            console.log('checkCustomerInfo >>> queryCustomerInfoAndEd >>> ' + JSON.stringify(res))
            if (res.code === '00' && res.data) {
              if (res.data.isNotOcrDeal && res.data.isCheckCustomer && res.data.isCheckEducation) {
                // 已身份验证
                this.checkCredit()
              } else {
                this.updateExempt('1.11')
              }
            }
          })
        },
        checkCredit() {
          let params = {
            'loginMobile': this.$store.state.phone
          }
          this.$store.commit('updateLoadingStatus', {isLoading: true})
          this.$http.get('/wuzhu/reservationController/checkJDXBCreditAndMOXStatus', params).then(res => {
            this.$store.commit('updateLoadingStatus', {isLoading: false})
            console.log('checkCredit >>> checkJDXBCreditAndMOXStatus >>> ' + JSON.stringify(res))
            if (res.code === '00' && res.data) {
              if ((this.$store.state.channelNo === '001' && (res.data.jdStatus === 'Y' || res.data.mxStatus === 'Y')) ||
                (this.$store.state.channelNo === '003' && (res.data.jdStatus === 'Y' && res.data.mxStatus === 'Y'))) {
                // 已信用授权
                this.checkCreditAccount()
              } else {
                this.updateExempt('1.12')
              }
            }
          })
        },
        checkCreditAccount() {
          this.$store.commit('updateLoadingStatus', {isLoading: true})
          this.$http.get('/wuzhu/user/credit/amount').then(res => {
            this.$store.commit('updateLoadingStatus', {isLoading: false})
            console.log('checkCreditAccount >>> amount >>> ' + JSON.stringify(res))
            if (res.code === '00' && res.data) {
              if (res.data.accountStatus === '0') { // 0:正常,1:锁定,2,删除,3:未实名认证
                this.updateExempt('1.32', res.data.accountAmt, res.data.totalQuotaAmt)
              } else {
                this.updateExempt('1.4')
              }
            } else {
              this.updateExempt('1.2')
            }
          })
        },
        exemptPage() {
          if (!this.isLogin) {
            this.goLogin()
          } else if (this.exempt.position === '1.11') {
            this.$router.push({name: 'IDverify'})
          } else if (this.exempt.position === '1.12') {
            this.$store.commit('accountStatusMemory', {accountStatus: '正常'})
            this.$router.push({name: 'Credit'})
          }
        },
        updateExempt(position, accountAmt, totalQuotaAmt) {
          console.log('updateExempt position === ' + position)
          this.exempt.position = position
          switch (position) {
            case '1.11':
              this.exempt.show = '2步领取免押资格'
              this.exempt.step1 = '1.身份认证信息'
              this.exempt.icon = false
              this.exempt.step2 = '2.信用授权'
              break
            case '1.12':
              this.exempt.show = '还差1步领取免押资格'
              this.exempt.step1 = '1.身份认证信息'
              this.exempt.icon = true
              this.exempt.step2 = '2.信用授权'
              break
            case '1.2':
              this.exempt.show = '已获得免押租赁资格'
              this.exempt.step1 = '快去下个订单看看吧!'
              this.exempt.icon = false
              this.exempt.step2 = ''
              break
            case '1.32':
              this.exempt.show = '￥' + accountAmt + '元以下商品可享免押租赁'
              this.exempt.step1 = '已使用￥' + parseInt((accountAmt - totalQuotaAmt) * 100 + 0.5) / 100 + '免押金额，当前剩余可用￥' + totalQuotaAmt
              this.exempt.icon = false
              this.exempt.step2 = ''
              break
            case '1.4':
              this.exempt.show = '当前暂未获得免押租赁资格'
              this.exempt.step1 = '请一个月之后再来试试吧'
              this.exempt.icon = false
              this.exempt.step2 = ''
              break
          }
        }
      },
      components: {
        MainPage,
        Flexbox,
        FlexboxItem,
        Group,
        Cell
      }
    }
</script>

<style lang="less">
  @import '../../common/less/index.less';
   .MinePage {
    // position: absolute;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    padding-bottom: 50px;
    background-color: @bg;
   	.d_title {
      text-align: center;
      font-size: 20px;
      color: #222222;
      margin-top: 15px;
   	}

     .user_title {
       background: white;
     }

   	.d_userInfo {
      margin-left: 15px;
      margin-right: 15px;
      margin-bottom: 15px;
      padding-bottom: 15px;
      height:146px;
   		// padding-left: 14px;
      background: white;
      box-shadow:0px 4px 8px 0px rgba(0,0,0,0.09);
      border-radius:4px;
      .p_user_name {
        position: relative;
      	color: #1A2A3E;
      	font-size: 25px;
        vertical-align: bottom;
        .user_span {
          line-height: 60px;
        }
        .i_user_icon {
          margin: 15px 15px 0 15px;
          width: 60px;
          height: 60px;
          vertical-align: bottom;
        }
        .color-space{
          display: inline-block;
          position: absolute;
          right: 0;
          width: 28px;
          height: 100%;
          background: @orange;
        }
      }
   	}

   	.d_order_rental {
      background: white;
   		.p_order_rental {
   			height: 55px;
   			line-height: 55px;
   			margin-left: 15px;
   			color: #000000;
   			font-size: 16px;
        border-bottom: 1px solid #D9D9D9;
   		}
   		.flex_order_rental {
   			margin-top: 20px;
        .flex_order{
          text-align: center;
          font-size: 12px;
          p{
            line-height: 25px;
          }
        }
   		}
   	}

   	.d_user_manager {
       margin-bottom: 48px;
   		.cell_info {
        padding: 7px 15px;
   			height: 35px;
   			font-size: 16px;
   			color: #000000;
   		}
   		}
     .box-exempt {
       position: relative;
       margin-left: 15px;
       margin-top: 15px;
     }
     .p-exempt-title {
       font-size: 16px;
       color: #222222;
     }
     .span-exempt {
       margin-top: 4px;
       font-size: 14px;
       line-height:20px;
       text-align: center;
       color: #888888;
     }
     .span-exempt-label2 {
       margin-left: 10px;
     }

     .btn-obtain {
       position: absolute;
       bottom: 6px;
       right: 13px;
       width: 68px;
       height: 32px;
       background: #FADB14;
       border-radius:4px;
       color: #222222;
       font-family:PingFangSC-Regular;
       text-align: center;
       span {
         font-size: 14px;
         line-height: 32px;
       }
     }
   }
   .order-icon {
    width: 30px;
    height: 30px;
   }
   .p-r{
     position: relative;
   }
   .p-a{
     position: absolute;
   }
  .count{
    top: -20px;
  }
</style>
