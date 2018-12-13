<template>
  <div class="credit">
    <StepDescBlock :stepDesc="stepDesc" :stepIndex="1">
    </StepDescBlock>
    <div class="creditArea">
      <tab :line-width=2 custom-bar-width="40px" active-color='#FFDA29' v-model="tabIndex">
        <tab-item class="vux-center" selected @click="tabIndex = 0">上班族</tab-item>
        <tab-item class="vux-center" @click="tabIndex = 1" >在校生</tab-item>
      </tab>
      <!--上班族-->
      <div class="creditBlock" v-show="tabIndex === 0">
        <!-- <group title="" class="slide auth" :class="showContent001 ? 'animate' : ''"> -->
          <x-input :max="50" type="text" v-model="employerName" placeholder="填写您的工作单位名称" @on-blur="setWindowSize"></x-input>
          <x-input :max="20" type="text" v-model="employerPhone" placeholder="填写您的工作单位联系电话" @on-blur="setWindowSize"></x-input>
        <!-- </group> -->
      </div>
      <!--在校生-->
      <div class="creditBlock" v-show="tabIndex === 1">
        <!-- <group title="" class="slide chsi" :class="showContent002 ? 'animate' : ''"> -->
          <x-input  :max="20" label-width="7.2em" :readonly="chsiVerified" class="chsi-input" :show-clear="false" type="number" v-model="Chsi" placeholder="填写您的学信网验证码" @on-blur="setWindowSize">
          </x-input>
          <span class="p_guide" slot="right" @click="showChsiDialog = !showChsiDialog">
            学信网验证码获取指引
          </span>
        <!-- </group> -->
      </div>
    </div>
    <!-- 基础认证 -->
    <!-- <section class="text-msg">
      <span class="text-msg-icon">!</span>以下基础认证请至少完成一项，即可
      <span class="emphasis">获得免押资格</span>;
    </section>
    <group title="">
      <cell @click.native="showContent001 = !showContent001" :arrow-direction="showContent001 ? 'up' : 'right'" class="cell_info" title="" is-link>
        <div class="cell_info">
          <div class="cellContent">
            <div class="imageDiv">
              <img class="imageDivImage" src="./workImg.png" srcset="./workImg.png 1x, ./workImg@2x.png 2x" />
            </div>
            <div class="infoPlane">
              <div class="infoPlaneDiv">
                <span class="creditName">工作单位信息填写</span>
                <span class="creditTips">优先推荐</span>
              </div>
              <div>
                <span class="creditDesc">上班族推荐</span>
              </div>
            </div>
            <div :class="(workVerify === '已认证'?'creditStatus': 'creditStatusWarnning')">
              {{workVerify}}
            </div>
          </div>
        </div>
      </cell>
      <template>
        <group title="" class="slide auth" :class="showContent001 ? 'animate' : ''">
          <x-input title="工作单位：" :max="50" type="text" v-model="employerName" placeholder="填写您工作单位的名称"></x-input>
          <x-input title="联系电话：" :max="20" type="text" v-model="employerPhone" placeholder="填写您工作单位的联系电话"></x-input>
        </group>
      </template>

      <cell @click.native="showContent002 = !showContent002" :arrow-direction="showContent002 ? 'up' : 'right'" class="cell_info" title="" is-link>
        <div class="cell_info">
          <div class="cellContent">
            <div class="imageDiv">
              <img class="imageDivImage" src="./chsiImg.png" srcset="./chsiImg.png 1x, ./chsiImg@2x.png 2x" />
            </div>
            <div class="infoPlane">
              <div class="infoPlaneDiv">
                <span class="creditName">学信网验证码</span>
                <span class="creditTips">高通过率</span>
              </div>
              <div>
                <span class="creditDesc">在校学生推荐</span>
              </div>
            </div>
            <div :class="(ChsiVerify === '已认证'?'creditStatus': 'creditStatusWarnning')">
              {{ChsiVerify}}
            </div>
          </div>
        </div>
      </cell>
      <template>
        <group title="" class="slide chsi" :class="showContent002 ? 'animate' : ''">
          <x-input title="学信网验证码：" :max="20" label-width="7.2em" :readonly="chsiVerified" class="chsi-input" :show-clear="false" type="number" v-model="Chsi" placeholder="在校生推荐">
            <span class="p_guide" slot="right" @click="showChsiDialog = !showChsiDialog">
              查看获取指引
            </span>
          </x-input>
        </group>
      </template>
    </group> -->
    <section>
      <div class="fs-dialog">
        <fee-desc-alert :dialogTitle="dialogTitle" :potocol-type="true" :showScrollBox="showChsiDialog" @sureBtnClick="showChsiDialog = !showChsiDialog">
          <div slot="htmlPocotol">
            <div style="text-align: left;text-indent: 1.5em;">学信网在线验证码仅用于验证您的身份信息，平台根据客户协议严格保密您的所有信息资料。</div>
            <ul style="text-align: left;text-indent: 1.5em;">
              <li>Step1 复制https://my.chsi.com.cn/archive/index.jsp并在手机浏览器中打开学信档案的登陆/注册页面；</li>
              <li>如已有账号选择登陆：如忘记用户名可找回用户名，忘记密码可选择忘记密码；</li>
              <li>如未有账号选择注册：按照相应步骤进行新用户的注册。</li>
              <li>Step2 登陆后，选择查看或申请学信网在线验证报告；</li>
              <li>Step3 未申请过学信网在线验证码客户申请中文版在线验证报告；</li>
              <li>已有学信网在线验证码客户：检查状态为“有效”则将该验证码填入，检查状态为“失效”则需要将在线验证码延期。</li>
              <li>Step4 将12位在有效期内的学信网在线验证码输入到物主。</li>
            </ul>
            <div style="text-align: left;text-indent: 1.5em;">如未有验证码则按照提示进行申请，如已有验证码请确保验证码状态为有效，如失效则申请延期。</div>
          </div>
        </fee-desc-alert>
      </div>
    </section>
    <!-- 进阶认证 -->
    <!-- <section class="text-msg">
      <span class="text-msg-icon">!</span>完成以下进阶认证，额度最高可提升至
      <span class="emphasis">￥20000</span>;
    </section>
    <group title="" class="mb15">
      <cell @click.native="bindJD" class="cell_info" title="" is-link>
        <div class="cell_info">
          <div class="cellContent">
            <div class="imageDiv">
              <img class="imageDivImage" src="./JDlogo.png" srcset="./JDlogo.png 1x, ./JDlogo@2x.png 2x" />
            </div>
            <div class="infoPlane">
              <div class="infoPlaneDiv">
                <span class="creditName">京东小白信用</span>
                <span class="creditTips">提升信用</span>
              </div>
              <div>
                <span class="creditDesc">已开通京东小白推荐</span>
              </div>
            </div>
            <div :class="(jdVerify === '已认证'?'creditStatus': 'creditStatusWarnning')">
              {{jdVerify}}
            </div>
          </div>
        </div>
      </cell>
      <cell @click.native="bindMX" class="cell_info" title="" is-link>
        <div class="cell_info">
          <div class="cellContent">
            <div class="imageDiv">
              <img class="imageDivImage" src="./MXlogo.png" srcset="./MXlogo.png 1x, ./MXlogo@2x.png 2x" />
            </div>
            <div class="infoPlane">
              <div class="infoPlaneDiv">
                <span class="creditName">手机运营商授权</span>
              </div>
              <div>
                <span class="creditDesc">新用户推荐</span>
              </div>
            </div>
            <div :class="(mxVerify === '已认证'?'creditStatus': 'creditStatusWarnning')">
              {{mxVerify}}
            </div>
          </div>
        </div>
      </cell>
    </group> -->
    <!-- 确认按钮 -->
    <x-button class="wz-btn" @click.native="goLivenessVerify">{{ btnName }}</x-button>
  </div>
</template>
<script type="text/ecmascript-6">
import { Tab, TabItem, XInput, Group, XButton, Cell, XDialog } from 'vux';
import FeeDescAlert from './../FeeItemSubView/FeeDescAlert';
import Config from './../../util/config';
import { isPhoneAvailable, isTelePhoneAvailable } from './../../util/utils';
import StepDescBlock from '../../common/components/stepDescBlock/index.js';
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      getBaseInfoUrl: '/wuzhu/reservationController/checkBaseInfoEnter', // 获取认证状态url
      verifyWorkInfoUrl: '/wuzhu/customerVerController/createWork', // 认证工作信息url
      verifyChsiUrl: '/wuzhu/customerVerController/checkEducation',
      accountStatus: this.$store.state.accountStatus, // 是否身份信息认证
      JDaccessToken: localStorage.getItem('JDaccessToken') || '',
      jdIsCredited: false, // 京东小白是否已认证
      mxIsCredited: false, // 魔蝎是否已认证
      chsiVerified: false, // 学信是否已认证
      mxApplyUrl: '', // 魔蝎授权url
      showContent001: false, // 显示工作信息
      showContent002: false, // 显示学信信息
      employerName: sessionStorage.getItem('employerName'),
      employerPhone: sessionStorage.getItem('employerPhone'),
      Chsi: sessionStorage.getItem('Chsi'), // 学信网在线验证码
      showChsiDialog: false,
      dialogTitle: '学信网在线验证码获取指引',
      isCheckEducation: this.$store.state.ocrMsgCheck.isCheckEducation, // 客户学信信息校验
      routeName: '', // 过来页面名
      workVerify: '',
      ChsiVerify: '',
      jdVerify: '',
      mxVerify: '',
      stepDesc: '',
      tabIndex: 0
    };
  },
  computed: {
    btnName() {
      return this.routeName === 'MinePage' ? '保存' : '下一步';
    }
  },
  created() {
    this.checkJDXBCreditAndMOXStatus();
    this.stepDesc = '还差3步：填写资料提交订单，最高免押20000';
  },
  mounted() {
    this.routeName = this.$store.state.Verify.routeName;
  },
  watch: {
    employerName(newName, oldName) {
      sessionStorage.setItem('employerName', newName);
    },
    employerPhone(newName, oldName) {
      sessionStorage.setItem('employerPhone', newName);
    },
    Chsi(newName, oldName) {
      sessionStorage.setItem('Chsi', newName);
    }
  },
  methods: {
    ...mapMutations(['updateLoadingStatus', 'updateRouteName']),
    // 软键盘弹起还原
    setWindowSize() {
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 100);
    },
    verifyDesc(code) {
      let des = '';
      switch (code) {
        case 'SUCCESS':
          des = '已认证';
          break;
        case 'UNAUTHORIZED':
          des = '未认证';
          break;
        case 'LOSEEFFICACY':
          des = '已过期';
          break;
        case 'GRANTING':
          des = '认证中';
          break;
        case 'FAILTURE':
          des = '认证失败';
          break;
        default:
          des = '未知';
          break;
      }
      return des;
    },
    getBaseInfoEnter() {
      this.$http
        .get(this.getBaseInfoUrl)
        .then(res => {
          console.log(res);
          if (res.code === '00') {
            const resData = res.data;
            this.workVerify = this.verifyDesc(resData.work.status);
            this.ChsiVerify = this.verifyDesc(resData.education.status);
            this.jdVerify = this.verifyDesc(resData.jdxb.status);
            this.mxVerify = this.verifyDesc(resData.moxie.status);
            if (resData.education.check) {
              this.Chsi = resData.education.obj.chsiAuthCode;
              this.chsiVerified = true;
            }
            if (resData.work.check) {
              this.employerName = resData.work.obj.workAddress;
              this.employerPhone = resData.work.obj.workPhone;
            }
            if (resData.jdxb.check) {
              this.jdIsCredited = true;
            }
            if (resData.moxie.check) {
              this.mxIsCredited = true;
            }
          } else {
            this.$vux.toast.text(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    async goLivenessVerify() {
      if (this.checkInfo()) {
        let ChsiParam = {
          applySerialNo: this.$store.state.applySerialNo,
          chsiAuthCode: this.Chsi,
          fromFlag: this.routeName === 'MinePage' ? 2 : 1
        };
        let workParam = {
          workAddress: this.employerName,
          workPhone: this.employerPhone
        };
        try {
          let res = {};
          this.updateLoadingStatus({ isLoading: true });
          if (this.isCheckEducation) {
            // 学信认证过，只认证工作信息
            if (this.employerName && this.employerPhone) {
              res = await this.$http.post(this.verifyWorkInfoUrl, workParam);
              this.updateLoadingStatus({ isLoading: false });
              if (res.code === '00') {
                this.$vux.toast.text('认证成功!');
                this.goNext();
              } else {
                this.$vux.toast.text(res.msg);
              }
            } else {
              this.goNext();
            }
          } else {
            // 只认证学信
            if (this.Chsi && (!this.employerName || !this.employerPhone)) {
              res = await this.$http.post(this.verifyChsiUrl, ChsiParam);
              this.updateLoadingStatus({ isLoading: false });
              if (res.code === '00') {
                this.$vux.toast.text('认证成功!');
                this.goNext();
              } else {
                this.$vux.toast.text(res.msg);
              }
              // 只认证工作信息
            } else if (!this.Chsi && this.employerName && this.employerPhone) {
              res = await this.$http.post(this.verifyWorkInfoUrl, workParam);
              this.updateLoadingStatus({ isLoading: false });
              if (res.code === '00') {
                this.$vux.toast.text('认证成功!');
                this.goNext();
              } else {
                this.$vux.toast.text(res.msg);
              }
              // 学信、工作信息都认证
            } else if (this.Chsi && this.employerName && this.employerPhone) {
              const [chsiRes, workRes] = await Promise.all([
                this.$http.post(this.verifyChsiUrl, ChsiParam),
                this.$http.post(this.verifyWorkInfoUrl, workParam)
              ]);
              this.updateLoadingStatus({ isLoading: false });
              if (workRes.code === '00' && chsiRes.code === '00') {
                this.$vux.toast.text('认证成功!');
                this.goNext();
              } else {
                const msg = workRes.code !== '00' ? workRes.msg : chsiRes.msg;
                this.$vux.toast.text(msg);
              }
            }
          }
        } catch (error) {
          console.error(error);
          this.updateLoadingStatus({ isLoading: false });
        }
      }
    },
    // 验证认证信息
    checkInfo() {
      // 是否身份认证
      if (!Object.is(this.accountStatus, '正常')) {
        this.$vux.alert.show({
          content: `请先通过身份信息认证`,
          onHide() {
            this.$store.commit('ID_INFO_BTN_STATE', { IDInfoBtnState: 'save' });
            this.$router.push({ name: 'IDverify' });
          }
        });
        return false;
      }
      if ((!this.employerName || !this.employerPhone) && !this.Chsi) {
        this.$vux.alert.show({
          content: '基础认证请至少完成一项'
        });
        return false;
      }
      if (this.employerName) {
        if (this.employerName.length > 100) {
          this.$vux.alert.show({
            content: '工作单位名称过长'
          });
          return false;
        }
      }
      if (this.employerPhone) {
        return this.checkEmployerPhone(this.employerPhone);
      }
      if (this.Chsi) {
        return this.checkChsi(this.Chsi);
      }
      return true;
    },
    // 工作单位电话格式校验：手机号码或者区号+座机号码
    checkEmployerPhone(phone) {
      let result = isPhoneAvailable(phone);
      if (result === false) {
        result = isTelePhoneAvailable(phone);
        if (result === false) {
          this.$vux.alert.show({
            title: '工作单位电话输入错误',
            content: '请输入正确工作单位电话：<br>手机号码或者区号+座机号码'
          });
        }
      }
      return result;
    },
    // 学信网验证码格式校验
    checkChsi(Chsi) {
      let that = this;
      // 12位 数字+字母
      // let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{12}$/
      let reg = /^[A-Za-z0-9]{12}$/;
      let result = reg.test(Chsi);
      if (result === false) {
        that.$vux.alert.show({
          title: '学信网验证码错误',
          content: '请输入正确的学信网验证码'
        });
      }
      return result;
    },
    goNext() {
      if (this.routeName === 'GoodsDetailPage') {
        // this.$router.replace({ name: 'LivenessVerify' });
        // 迭代2.12.0 跳转到增加紧急联系人
        this.$router.replace({ name: 'AddContact' });
      } else {
        this.$router.push({ name: 'MinePage' });
      }
    },
    /**
     *  mxApplyUrl (string, optional): 魔蝎认证地址 ,
     */
    async checkJDXBCreditAndMOXStatus() {
      let that = this;
      let params = {
        channelNo: that.$store.state.channelNo,
        accessToken: that.JDaccessToken,
        handleType: '',
        remark: '',
        taskId: ''
      };
      try {
        this.updateLoadingStatus({ isLoading: true });
        const res = await this.$http.get('/wuzhu/reservationController/checkJDXBCreditAndMOXStatus', params);
        this.updateLoadingStatus({ isLoading: false });
        if (res && res.code === '00' && res.data) {
          let resData = res.data;
          this.mxApplyUrl = resData.mxApplyUrl;
          sessionStorage.setItem('JDOpenid', resData.openid);
          that.$store.commit('xiaobaiScoresMemory', { xiaobaiScores: resData.xbScore });
        } else {
          this.$vux.alert.show({
            content: res && res.msg
          });
        }
      } catch (error) {
        console.log(error);
        this.updateLoadingStatus({ isLoading: false });
      }
      that.getBaseInfoEnter();
    },
    bindJD() {
      let that = this;
      if (this.$store.state.channelNo !== '003') {
        if (that.jdIsCredited) {
          that.$router.push({ name: 'JDCredit' });
        } else {
          if (!Object.is(that.accountStatus, '正常')) {
            this.$vux.alert.show({
              content: `请先通过身份信息认证`,
              onHide() {
                that.$store.commit('ID_INFO_BTN_STATE', { IDInfoBtnState: 'save' });
                that.$router.push({ name: 'IDverify' });
              }
            });
          } else {
            window.sessionStorage.setItem('xiaobaiPageName', window.location.href);
            const _thisUrl = window.location.href;
            window.location.href = Config.xiaoBaiUrl + '&callBack=' + _thisUrl;
          }
        }
      } else {
        // 京东渠道从我的页面过来可查看小白信用
        if (this.jdIsCredited && this.routeName === 'MinePage') {
          this.$router.push({ name: 'JDCredit' });
        } else if (!this.jdIsCredited && this.routeName === 'MinePage') {
          window.sessionStorage.setItem('xiaobaiPageName', window.location.href);
          const _thisUrl = window.location.href;
          window.location.href = Config.xiaoBaiUrl + '&callBack=' + _thisUrl;
        }
      }
    },
    bindMX() {
      let that = this;
      if (that.mxIsCredited) {
        console.log('bindMX mxIsCredited');
      } else {
        if (!Object.is(that.accountStatus, '正常')) {
          this.$vux.alert.show({
            content: '请先通过身份信息认证',
            onHide() {
              that.$store.commit('ID_INFO_BTN_STATE', { IDInfoBtnState: 'save' });
              that.$router.push({ name: 'IDverify' });
            }
          });
        } else {
          try {
            if (that.mxApplyUrl) {
              // that.mxApplyUrl = 'https://api.51datakey.com/h5/importV3/index.html#/carrier?apiKey=7c91bb6f653d4fd885c14e69aefa0da8&userId=201805021244481&loginParams={"phone":"13689527870","idcard":"420322198306010033","name":"韩峰"}&showTitleBar=NO&quitOnLoginDone=YES&quitOnFail=YES&backUrl=http://10.35.40.167:8090/wuzhu/dist/#/Credit/Credit'
              window.location.href = that.mxApplyUrl;
            } else {
              this.$vux.alert.show({
                content: '获取运营商授权地址异常'
              });
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  },
  components: {
    Tab,
    TabItem,
    XInput,
    Group,
    XButton,
    Cell,
    XDialog,
    FeeDescAlert,
    StepDescBlock
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import '../../common/less/index.less';
.credit /deep/ .weui-cells {
  margin-top: 0 !important;
  .weui-cell {
    padding: 2px 15px;
  }
  .vux-x-input {
    padding: 16px 15px;
    &.chsi-input {
      padding-left: 10px;
    }
  }
  .weui-cell__ft {
    width: 100%;
  }
  .chsi-input {
    .weui-cell__ft {
      position: relative;
      right: -12px;
      width: 25%;
    }
  }
  .auth .weui-input {
    vertical-align: -4px;
  }
  .chsi .weui-input {
    vertical-align: -4px;
  }
  .weui-cell_access .weui-cell__ft:after {
    height: 9px;
    width: 9px;
    margin-top: -2px;
  }
  .vux-cell-arrow-transition.vux-cell-arrow-up:after {
    margin-top: 0;
  }
  .auth .weui-input {
    width: inherit;
  }
}
.credit {
  box-sizing: border-box;
  background: @bg;
  overflow: scroll;
  padding-bottom: 60px;
  .weui-cell {
    padding: 0 0 14px 0 !important;
    margin: 14px 0px 0 0px !important;
    border-bottom: 0.5px solid #DDDDDD !important;
  }
  .weui-cell:before {
    border: none !important;
  }
  .stepDescBlock {
    background-size: 25% 100% !important;
  }
  .text-msg {
    background-color: #fefbea;
    color: #222;
    padding: 14px 15px;
    font-size: 14px;
    line-height: 20px;
    .text-msg-icon {
      width: 14px;
      height: 14px;
      border: 1px solid #000;
      border-radius: 50%;
      background-color: #ffeb33;
      display: inline-block;
      text-align: center;
      line-height: 16px;
      margin-right: 5px;
    }
    .emphasis {
      color: #f5222d;
    }
  }
  .creditArea {
    background:rgba(255,255,255,1);
    margin-bottom: 156px;
    .creditBlock {
      //  height:195px;
       padding: 44px 15px;
    }
  }
  .p_guide {
    color: #007AFF;
    font-size: 12px;
    display: block;
    padding-top: 19px;
    padding-bottom: 17px;
    // text-align: center;
  }
  .slide {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
  }
  .animate {
    max-height: 9999px;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
  }
  .cell_info {
    font-size: 14px;
    .cellContent {
      width: 100%;
      text-align: left;
      padding: 15px 0px;
      display: flex;
      justify-content: flex-start;
      .imageDiv {
        margin-right: 15px;
        .imageDivImage {
          border-radius: 3px;
          width: 46px;
          height: 46px;
          vertical-align: middle;
        }
      }
      .infoPlane {
        .infoPlaneDiv {
          margin-bottom: 6px;
        }
        .creditName {
          font-size: 16px;
          font-weight: bold;
          font-family: PingFangSC-Medium;
          color: #222222;
          line-height: 22px;
        }
        .creditTips {
          color: #ff4754;
          font-size: 12px;
          height: 12px;
          padding: 1px;
          border-radius: 3px;
          border: 1px solid #ff4754;
        }
        .creditDesc {
          font-size: 12px;
          font-family: PingFangSC-Regular;
          color: #555555;
          line-height: 17px;
        }
        .creditDescRed {
          font-size: 12px;
          font-family: PingFangSC-Regular;
          color: #f5222d;
          line-height: 17px;
        }
      }
      .creditStatus {
        color: #888888;
        position: absolute;
        top: 50%;
        margin-top: -7px;
        right: 17px;
      }
      .creditStatusWarnning {
        color: #ff4754;
        position: absolute;
        top: 50%;
        margin-top: -7px;
        right: 17px;
      }
    }
  }
  .credit-loading {
    width: 281px !important;
    max-width: 281px !important;
    font-size: 14px;
    text-align: center;
    img {
      width: 80px;
      height: 80px;
      margin-top: 39px;
    }
    .loading-txt {
      margin-top: 30px;
      font-size: 20px;
      font-family: PingFangSC-Regular;
      color: #222222;
      line-height: 28px;
    }
    .loading-tips {
      text-align: left;
      margin: 16px 35px 38px 35px;
      font-family: PingFangSC-Regular;
      color: #888888;
      line-height: 20px;
    }
  }
}
</style>
<style>
</style>

