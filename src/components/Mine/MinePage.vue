<template>
  <div class="MinePage">
    <section class="mine-content">
      <div class="user_title">
        <div class="d_userInfo">
          <p class="p_user_name" padding-left="150px;">
            <img class="i_user_icon" src="./user_icon_new.png" align="middle">
            <span class="user_span" v-if="!isLogin" @click="goLogin">请登录</span>
            <span class="user_span" v-else>
              <span class="user_span" v-if="userName">你好，{{userName}}</span>
              <span class="user_span" v-if="userPhone && !userName">你好，{{userPhone}}</span>
              <span class="user_span" v-if="!userPhone && !userName">你好，你已登录</span>
            </span>
          </p>
          <div v-show="!isAlipayLife" class="box-exempt">
            <div>
              <p class="p-exempt-title">{{ exempt.title }}</p>
              <span class="span-exempt">{{ exempt.subTitle }}</span>
            </div>
            <div v-show="exempt.showVerifyBtn" class="btn-obtain" @click="exemptPage">
              <span>立即领取</span>
            </div>
          </div>
        </div>
        <div class="d_order_rental">
          <p class="p_order_rental vux-1px-b">租赁订单</p>
          <flexbox class="flex_order_rental" orient="horizontal">
            <flexbox-item @click.native="goPage(0)">
              <div class="flex_order_running flex_order">
                <img class="order-icon p-r" src="./user_order_running.png" srcset="./user_order_running.png 1x, ./user_order_running@2x.png 2x">
                <span class="p-r vux-reddot count" v-show="this.repaymentingCount > 0"></span>
                <p>进行中</p>
              </div>
            </flexbox-item>
            <flexbox-item @click.native="goPage(1)">
              <div class="flex_order_finish flex_order">
                <img class="order-icon p-r" src="./user_order_finish.png" srcset="./user_order_finish.png 1x, ./user_order_finish@2x.png 2x">
                <span class="p-r vux-reddot count" v-show="this.repaymentSuccessCount > 0"></span>
                <p>已完成</p>
              </div>
            </flexbox-item>
            <flexbox-item @click.native="goPage(2)">
              <div class="flex-order_cancel flex_order">
                <img class="order-icon p-r" src="./user_order_cancel.png" srcset="./user_order_cancel.png 1x, ./user_order_cancel@2x.png 2x">
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
          <cell v-if="!isAlipayLife" @click.native="goPage(3)" class="cell_info" title="身份认证" is-link></cell>
          <!--<cell :link="{path:'/OrderList/OrderListPage'}" class="cell_info" title="地址管理" is-link></cell>-->
          <!-- <cell v-if="!isAlipayLife" @click.native="goPage(5)" class="cell_info" title="信用认证" is-link></cell> -->
          <cell v-if="!_isWzapp && !isAlipayLife" @click.native="goPage(4)" class="cell_info" title="邀请好友" is-link></cell>
          <cell v-if="!isAlipayLife" @click.native="goPage(7)" class="cell_info" title="关注物主公众号" is-link></cell>
          <cell @click.native="goPage(6)" class="cell_info" title="设置" is-link></cell>
        </group>
      </div>
    </section>
    <section>
      <main-page></main-page>
    </section>
  </div>
</template>
<script>
import { Flexbox, FlexboxItem, Group, Cell } from 'vux';
import { isWzapp, isAlipayLife, unionLogin } from './../../util/utils';
import MainPage from './../Main/MainPage';
import { mapMutations } from 'vuex';
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
        title: '',
        subTitle: '',
        showVerifyBtn: false
      },
      _isWzapp: false, // 当前是否wzapp环境
      isAlipayLife: false // 当前是否支付宝生活号渠道
    };
  },
  created() {
    // 当前如果是wzapp环境，则隐藏邀请好友页面  1000902
    this._isWzapp = isWzapp();
    this.isAlipayLife = isAlipayLife();
    this.$store.commit('updateLoadingStatus', { isLoading: true });
    // 从些去身份信息为save
    this.$store.commit('ID_INFO_BTN_STATE', { IDInfoBtnState: 'save' });
    localStorage.setItem('origin', 'MinePage');
    this.getUserInfo();
    // let isJDLogin = false;
    // if (sessionStorage.getItem('JDLoginStatus') === 'true') {
    //   isJDLogin = true;
    // }
    // if (this.$store.state.channelNo === '003' && !isJDLogin) {
    // let that = this;
    // queryJDInfoAndLogin(that)
    //   .then(res => {
    //     that.getUserInfo();
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    // } else {
    //   this.getUserInfo();
    // }
  },
  mounted() {
    this.updateRouteName({ routeName: 'MinePage' });
  },
  methods: {
    ...mapMutations(['updateRouteName']),
    goLogin() {
      // this.$router.push({ name: 'InitLogin' });
      unionLogin(this, this.loginSucc);
    },
    loginSucc() {
      this.isLogin = true;
      this.getUserInfo();
    },
    goPage(index) {
      // 订单选项
      let that = this;
      if (!this.isLogin && index !== 6 && index !== 7) {
        this.$vux.alert.show({
          content: `未登录，请先登录`,
          onHide() {
            that.$store.commit('prevPageMemory', { prevPage: 'MinePage' });
            that.goLogin();
          }
        });
      } else {
        that.goNext(index);
      }
    },
    goNext(index) {
      let that = this;
      switch (index) {
        case 3:
          that.$router.push({ name: 'IDverify' });
          break;
        case 4:
          that.$router.push({ name: 'InviteFriends' });
          break;
        case 5:
          that.checkUserStatue();
          break;
        case 6:
          that.$router.push({ name: 'Settings' });
          break;
        case 7:
          // 下面的链接如果从微信聊天界面跳转是可以正常关注的，如果从我们H5内部跳转，有时无法关注，暂不知原因，改为跳转页面识别二维码的方式
          // window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzUzNzc2OTA5Mw==#wechat_redirect'
          that.$router.push({ name: 'Follow' });
          break;
        case 8:
          that.$router.push({ name: 'Account' });
          break;
        default:
          this.$store.commit('ORDER_STATE', { orderState: parseInt(index) });
          this.$router.push({ name: 'OrderListPage', params: { orderState: parseInt(index) } });
      }
    },
    checkUserStatue() {
      if (this.accountStatus !== '正常') {
        this.$vux.alert.show({
          content: `请先通过身份信息认证`,
          onHide() {
            this.$store.commit('ID_INFO_BTN_STATE', { IDInfoBtnState: 'save' });
            this.$router.push({ name: 'IDverify' });
          }
        });
      } else {
        this.$store.commit('accountStatusMemory', { accountStatus: this.accountStatus });
        this.$router.push({ name: 'Credit' });
      }
    },
    getUserInfo() {
      this.$http
        .get('/wuzhu/user/getCustomrtInfo')
        .then(res => {
          if (res.code === '00' && res.data) {
            this.isLogin = true;
            this.userName = res.data.name;
            this.userPhone = res.data.mebile;
            this.accountStatus = res.data.accountStatus;
            this.cancleCount = res.data.cancleCount;
            this.repaymentSuccessCount = res.data.repaymentSuccessCount;
            this.repaymentingCount = res.data.repaymentingCount;
            this.checkCustomerInfo();
          } else if (res.code === '1001') {
            this.isLogin = false;
            this.accountStatus = res.msg;

            this.exempt.showVerifyBtn = true;
            this.exempt.title = '2步获取免押资格';
            this.exempt.subTitle = '获取免押资格，最高可免￥20000.00押金';
          }
          this.$store.commit('updateLoadingStatus', { isLoading: false });
        })
        .catch(err => {
          console.log(err);
          this.$store.commit('updateLoadingStatus', { isLoading: false });
        });
    },
    checkCustomerInfo() {
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      this.$http.get('/wuzhu/customerVerController/queryCustomerInfoAndEd').then(res => {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        console.log('checkCustomerInfo >>> queryCustomerInfoAndEd >>> ', res);
        if (res.code === '00' && res.data) {
          this.$store.commit('updateOcrMsgCheck', {
            ocrMsgCheck: {
              isCheckCustomer: res.data.isCheckCustomer, // 客户身份信息校验
              isCheckEducation: res.data.isCheckEducation // 客户学信信息校验
            }
          });
          this.exempt = { ...res.data };
          if (!res.data.isNotOcrDeal && !res.data.isCheckCustomer) {
            this.exempt.position = 'IDverify';
            this.exempt.showVerifyBtn = true;
          }
          if (
            (res.data.isNotOcrDeal || res.data.isCheckCustomer) &&
            (!res.data.isCheckEducation && !res.data.isCheckWork)
          ) {
            this.exempt.position = 'Credit';
            this.exempt.showVerifyBtn = true;
          }
        }
      });
    },
    exemptPage() {
      if (!this.isLogin) {
        this.goLogin();
      } else if (this.exempt.position === 'IDverify') {
        this.$router.push({ name: 'IDverify' });
      } else if (this.exempt.position === 'Credit') {
        this.$store.commit('accountStatusMemory', { accountStatus: '正常' });
        this.$router.push({ name: 'Credit' });
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
};
</script>

<style lang="less">
@import '../../common/less/index.less';
.MinePage {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  display: flex;
  height: 100%;
  background-color: @bg;
  .mine-content {
    width: 100%;
    overflow: scroll;
    padding-bottom: 15px;
  }
  .d_title {
    text-align: center;
    font-size: 20px;
    color: #222222;
    margin-top: 15px;
  }

  .user_title {
    background: white;
    padding-top: 15px;
  }

  .d_userInfo {
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    // height: 146px;
    background: white;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.09);
    border-radius: 4px;
    .p_user_name {
      position: relative;
      color: #1a2a3e;
      font-size: 25px;
      vertical-align: bottom;
      .user_span {
        line-height: 60px;
        font-family: PingFangSC-Medium;
        color: #222222;
      }
      .i_user_icon {
        margin: 15px 15px 0 15px;
        width: 56px;
        height: 56px;
        vertical-align: bottom;
      }
      .color-space {
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
    .vux-1px-b:after {
      border-bottom-color: #ddd;
    }
    .p_order_rental {
      height: 55px;
      line-height: 55px;
      margin-left: 15px;
      color: #000000;
      font-size: 16px;
    }
    .flex_order_rental {
      margin-top: 15px;
      .flex_order {
        text-align: center;
        font-size: 12px;
        p {
          line-height: 25px;
          margin-top: -4px;
          margin-bottom: 10px;
        }
      }
    }
  }

  .d_user_manager {
    margin-bottom: 48px;
    .weui-cells:before {
      display: none;
    }
    .weui-cells:after {
      display: none;
    }
    .cell_info {
      padding: 7px 15px;
      height: 35px;
      font-size: 16px;
      color: #000000;
    }
  }
  .box-exempt {
    padding: 0 5px 0 10px;
    display: flex;
    align-items: center;
    margin-top: 15px;
  }
  .p-exempt-title {
    font-size: 16px;
    font-family: PingFangSC-Medium;
    color: #222222;
  }
  .span-exempt {
    margin-top: 4px;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: #888888;
  }
  .span-exempt-label2 {
    margin-left: 10px;
  }

  .btn-obtain {
    margin: auto;
    width: 68px;
    height: 32px;
    background: #fadb14;
    border-radius: 4px;
    color: #222222;
    font-family: PingFangSC-Regular;
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
.p-r {
  position: relative;
}
.p-a {
  position: absolute;
}
.count {
  top: -20px;
}
</style>
