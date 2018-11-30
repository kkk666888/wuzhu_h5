<template>
  <div class="InitLogin" ref="InitLogin">
    <div class="login_icon">
      <div class="login-icon-img"></div>
    </div>
    <div class="login_input">
      <group class="group_input">
        <x-input class="input_login needsclick" placeholder="请输入手机号" v-model="phoneNum" title="手机号" type="tel" @on-blur="inputPhoneChange"></x-input>
        <!-- placeholder-align="right" -->
        <x-input class="input_login xinput_verify needsclick" placeholder="请输入验证码" v-model="authCode" title="验证码" type="tel" @on-blur="inputCodeChange">
          <span ref="getCodeCtrl" :class="['get-code', flag ? 'active' : '']" slot="right" v-on:click="flag && getVerificationCode()">获取验证码</span>
        </x-input>
      </group>
      <p class="input_tips" @click="protocolRadioClick">
        <input class="fs-checkbox" type="radio" id="protocolRadio" name="protocolRadio" value="1" v-model="payCheckedNames">
        <span class="fs-checkbox-label">
          <div class="label-div"></div>
          <label for="protocolRadio">
            <span></span>
          </label>
        </span>
        <span>登录即同意物主平台</span>
        <span class="regist-protocol" @click="registProtocol">《{{ dialogTitle }}》</span>
      </p>
    </div>
    <div class="login_submit">
      <!-- <x-button @click.native="testtest" class="xb_login" text="测试"></x-button> -->
      <x-button @click.native="loginBtn" :class="btnActive?'xb_login':'xb_login wuzhu-btn-gray'" text="登录"></x-button>
    </div>
    <div class="login_small_icon">
      <div class="login-small-icon"></div>
    </div>
    <fee-desc-alert :dialogTitle="dialogTitle" :potocol-type="true" :dialogContent="dialogContent" :showScrollBox="showScrollBox" @sureBtnClick="registProtocol">
      <user-registration-agreement slot="htmlPocotol"></user-registration-agreement>
    </fee-desc-alert>
  </div>
</template>

<script type="text/ecmascript-6">
import { XInput, Group, XButton } from 'vux';
import feeDescAlert from './../FeeItemSubView/FeeDescAlert';
import { RegainOpenid, GetLocation, isWeiXin, isWzapp, isPhoneAvailable } from './../../util/utils';
import { ReportData } from './../../util/ReportData';
import userRegistrationAgreement from './../Potocol/UserRegistrationAgreement';
export default {
  name: 'InitLogin',
  data() {
    return {
      payCheckedNames: '',
      wxReady: false,
      btnActive: true, // 登录 按钮是否可点击
      agrReporter: null, // 注册协议埋点
      brisk: {
        // 埋点报文
        edittimes: [
          {
            type: 'code', // 编辑控件名称 or 上传类型
            times: 0 // 编辑次数 or 上传次数
          },
          {
            type: 'phone', // 编辑控件名称 or 上传类型
            times: 0 // 编辑次数 or 上传次数
          }
        ]
      },
      userLocation: {
        latitude: this.$store.state.lat,
        longitude: this.$store.state.lng
      },
      nextPage: 'MinePage', // 默认跳个人中心
      phoneNum: '',
      authCode: '', // 验证码
      seqNo: '',
      waitTime: 60,
      flag: false, // 获取验证码 按钮是否可点击
      dialogTitle: '物主平台用户注册协议',
      dialogContent: '',
      showScrollBox: false
    };
  },

  watch: {
    phoneNum: function(val, oldval) {
      let that = this;
      if (String(val).length > 10) {
        if (isPhoneAvailable(val)) {
          that.flag = true;
        } else {
          that.flag = false;
        }
      } else {
        that.flag = false;
      }
    }
  },
  created() {
    this.agrReporter = new ReportData({
      pagein: 'null',
      pagecnname: '物主平台用户注册协议',
      pagename: 'agreement'
    });
  },
  mounted: function() {
    let that = this;
    // position: absoblute 当输入框可能被软键盘压到时，在一部分安卓下却出了问题
    that.$refs.InitLogin.style.height = that.$refs.InitLogin.clientHeight + 'px';
    this.$reporter.init();
  },
  methods: {
    testtest() {
      this.$reporter.dataReport(this.brisk);
    },
    inputPhoneChange() {
      this.brisk.edittimes[1].times++;
    },
    inputCodeChange() {
      this.brisk.edittimes[0].times++;
    },
    protocolRadioClick(event) {
      if (this.payCheckedNames === '1' && event.target.className !== 'regist-protocol') {
        this.payCheckedNames = '';
      } else {
        this.payCheckedNames = '1';
      }
    },
    // 获取用户位置信息
    getLocation() {
      let that = this;
      if (that.wxReady) {
        GetLocation({}, that)
          .then(res => {
            that.userLocation.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            that.userLocation.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180
          })
          .catch(error => {
            console.log(error);
            if (!isWeiXin()) {
            } else {
              // eslint-disable-next-line
              wx.getLocation({
                type: 'wgs84', // gcj02
                success: function(res) {
                  that.userLocation.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                  that.userLocation.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180
                },
                cancel: function() {},
                fail: function(res) {}
              });
            }
          });
      }
    },
    // 注册协议 按钮 和 弹出框确认 按钮
    registProtocol() {
      let that = this;
      that.showScrollBox = !that.showScrollBox;
      if (that.showScrollBox) {
        that.agrReporter.refreshPagein();
      } else {
        that.agrReporter.refreshPageout();
      }
    },
    loginBtn() {
      let that = this;
      if (!that.btnActive) {
        return false;
      }
      that.$store.commit('ID_INFO_BTN_STATE', { IDInfoBtnState: 'next' });
      if (!isPhoneAvailable(that.phoneNum)) {
        that.$vux.alert.show({
          content: '请输入正确的手机号'
        });
        return false;
      }
      if (!that.authCode) {
        that.$vux.alert.show({
          content: '请输入正确的验证码'
        });
        return false;
      }
      if (that.payCheckedNames !== '1') {
        that.$vux.alert.show({
          content: '请勾选用户注册协议'
        });
        return false;
      }
      that.btnActive = false; // 按钮不可以点击, 请求结束后再激活
      that.reqLogin();
    },
    fsCountDown() {
      let that = this;
      setTimeout(function() {
        if (that.waitTime > 0) {
          if (that.$refs.getCodeCtrl) {
            that.$refs.getCodeCtrl.innerHTML = that.waitTime + 's';
          }
          that.waitTime = that.waitTime - 1;
          that.fsCountDown();
        } else {
          that.waitTime = 60;
          if (that.$refs.getCodeCtrl) {
            that.$refs.getCodeCtrl.innerHTML = '重新发送';
          }
          that.flag = true; // 使按钮能够被点击
        }
      }, 1000);
    },
    getVerificationCode() {
      let that = this;
      // 获取 经纬度 信息
      that.getLocation();
      if (isPhoneAvailable(that.phoneNum)) {
        // 倒计时
        that.fsCountDown();
        that.flag = false;
        that.getSendMsg(); // 发送验证码
      } else {
        that.$vux.alert.show({
          content: '请输入正确的手机号'
        });
      }
    },
    // 验证码
    getSendMsg() {
      let that = this;
      that.$http
        .post('/wuzhu/pub/sendMsg', {
          mobile: that.phoneNum, // 手机
          bussinessName: 'verifycode', // 短信序列号
          bizNode: 123, // 业务号
          channelNo: that.$store.state.channelNo // 渠道号
        })
        .then(res => {
          if (res.code === '00' && res.data) {
            that.seqNo = res.data;
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
    // 请求 登录
    reqLogin() {
      let that = this;
      // smsCode 验证码 seqNo 短信序列号 mobile 手机
      let urlParam = '?smsCode=' + that.authCode + '&seqNo=' + that.seqNo + '&mobile=' + that.phoneNum;
      let platform = that.$store.state.platformCode;
      console.log('login platform === ' + platform);
      if (isWzapp()) {
        that.$store.commit('updateOthersOpenID', { othersOpenID: 'app' + that.phoneNum });
      }
      let _logDO = {
        logNo: '',
        memebershipNo: '',
        loginDate: '',
        loginChannel: '',
        loginIp: '',
        deviceName: '', // 登录设备名称
        deviceId: that.$store.state.deviceId, // 登录设备 ID
        gpsLongitude: that.userLocation.longitude, // 经度
        gpsLatitude: that.userLocation.latitude, // 纬度
        gpsAddress: '', // 经纬度 地址
        gpsProvince: '', // 经纬度 省份
        gpsCity: '', // 经纬度 城市
        gpsCounty: '', // 经纬度 区县
        platformCode: platform, // 客户端平台
        loginData: that.$store.state.deviceInfo // 登录信息，目前主要是设备信息 2018-9-20
      };
      that.$http
        .post('/wuzhu/user/login' + urlParam, {
          channelNo: that.$store.state.channelNo, // 渠道号
          bizNode: 123, // 业务号 --
          recommCode: that.$store.state.recommeCode, // 邀请码 --
          openId: that.$store.state.othersOpenID, // 第三方的openId
          // openId: 'o70v-0qujxSEcBfbqSCIExLEkwJY', // hcg的openId
          strMembershipLoginLogDO: JSON.stringify(_logDO)
        })
        .then(res => {
          if (res.code === '00' && res.data) {
            that.waitTime = 0; // 跳转下一步时,停止倒计时
            that.$store.commit('tokenMemory', { token: res.data.Token });
            that.$store.commit('updatePhone', { phone: res.data.moblile });
            // 此处是自己的邀请码，不保存到store中，以免与通过别人的邀请二维码进入时保存的邀请码冲突
            // that.$store.commit('updateRecommeCode', {phone: res.data.recommeCode})
            // 埋点数据上报
            let _Pagein = that.agrReporter.getPagein();
            if (_Pagein && _Pagein !== 'null') {
              // 用户点开后才上传协议埋点
              that.agrReporter.dataReport({
                notPageout: true
              });
            }
            that.$reporter.dataReport(that.brisk);
            // 跳转下一步`
            that.$router.replace({ name: that.nextPage });
          } else if (res.code === '804') {
            // 804 openid 为空
            that.$vux.confirm.show({
              content: res.msg,
              // content: '微信授权出现问题，点击确认重新授权',
              onConfirm() {
                RegainOpenid(); // 重新授权获取 code 值
              }
            });
            that.btnActive = true; // 按钮可以点击
          } else {
            that.$vux.alert.show({
              content: res.msg
            });
            that.btnActive = true; // 按钮可以点击
          }
        })
        .catch(err => {
          that.btnActive = true; // 按钮可以点击
          console.error(err);
        });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.nextPage = from.name;
      localStorage.setItem('origin', from.name);
    });
  },
  components: {
    XInput,
    Group,
    feeDescAlert,
    userRegistrationAgreement,
    XButton
  }
};
</script>

<style lang="less" rel="stylesheet/less">
@import './../../common/less/index';
.InitLogin {
  position: relative;
  background-color: #ffffff;
  height: 100%;
  width: 100%;
  font-family: PingFangSC-Regular;
  .login_icon {
    padding-top: 75px;
    text-align: center;
    .login-icon-img {
      width: 100px;
      height: 100px;
      margin: auto;
      .bg('~./login_logo');
    }
  }
  .login_input {
    margin-top: 70px;
    .group_input {
      margin-left: 15px;
      margin-right: 15px;
      .input_login {
        height: 50px;
        background-color: #fcfcfc;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #000000;
        border: 0.5px solid #eaeaea;
        padding-left: 10px;
      }
      .xinput_verify {
        margin-top: 12px;
        padding-right: 10px;
      }
      .weui-cells {
        .weui-cell {
          padding: 0px 15px;
          .weui-cell__bd {
            height: 100%;
            .weui-input {
              height: 100%;
            }
          }
          .weui-cell__ft {
            .get-code {
              height: 100%;
              line-height: 50px;
              font-size: 14px;
              &.active {
                color: #ffc400;
              }
            }
          }
        }
      }
    }
    .input_tips {
      padding-top: 10px;
      padding-left: 22px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #000000;
      line-height: 16px;
      .regist-protocol {
        color: #007aff;
      }
      .fs-checkbox {
        display: none;
        &:checked + .fs-checkbox-label {
          label {
            span {
              visibility: visible;
            }
          }
        }

        & + .fs-checkbox-label {
          position: relative;
          .label-div {
            position: absolute;
            width: 100%;
            height: 100%;
            padding: 4px;
            left: -3px;
            z-index: 100;
          }
          label {
            top: 3px;
            position: relative;
            -webkit-appearance: none;
            border: 1px solid #4a90e2;
            padding: 2px;
            border-radius: 50px;
            display: inline-block;
            span {
              display: block;
              border-radius: 50%;
              background: #4a90e2;
              visibility: hidden;
              width: 10px;
              height: 10px;
            }
          }
        }
      }
    }
  }
  .login_submit {
    margin-top: 40px;
    width: 100%;
    .xb_login {
      width: 90%;
      margin: auto;
      background-color: #ffda29;
      color: #262628;
      height: 46px;
      border-radius: 6px;
      font-size: 17px;
    }
    .p_login {
      width: 105px;
      height: 17px;
      font-size: 8px;
      text-align: center;
      vertical-align: middle;
      background-color: #ffda29;
      border-radius: 25px;
    }
  }
  .login_small_icon {
    position: absolute;
    bottom: 5px;
    width: 100%;
    .login-small-icon {
      width: 45px;
      height: 25px;
      margin: auto;
      .bg('~./login_small_icon');
    }
  }
  @media screen and (max-width: 320px) {
    .login_input {
      margin-top: 60px;
    }
  }
}
</style>
