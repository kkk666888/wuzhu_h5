<template>
  <div class="LivenessVerify">
    <StepDescBlock :stepDesc="stepDesc" :stepIndex="3">
    </StepDescBlock>
    <section>
      <input v-if="clearInput" :disabled="!isClick" ref="uploadVideo" id="uploadVideo" name="uploadVideo" class="upload-input" type="file" accept="video/*" capture="camcorder">
      <div class="liveBlock">
        <div class="liveTitle">录制一段您自己的视频，并上传进行验证：</div>
          <div class="liveDesc">
            1、请使用<span class="red">前置摄像头</span><br>
            2、录制中需要您重复动作【<span class="red">{{livenessData.description}}</span>】<br>
            3、拍摄时长&lt;{{livenessData.fileTime}}秒<br>
            4、请正脸拍摄、人像清晰、光线均匀
          </div>
      </div>
    </section>
    <section>
      <div class="liveTips">视频仅用于物主平台检测，请确保当前操作是您本人</div>
    </section>
    <!-- <section>
      <div class="fs-liveness">
        <div class="liveness-header">
          根据要求拍摄视频，在视频中您需要：
        </div>
        <div class="liveness-img-box">
          <img :src="livenessData.imgSrc">
        </div>
        <div class="liveness-txt">
          {{livenessData.description}}
        </div>
        <input v-if="clearInput" :disabled="!isClick" ref="uploadVideo" id="uploadVideo" name="uploadVideo" class="upload-input" type="file" accept="video/*" capture="camcorder">
      </div>
    </section>
    <section>
      <div class="fs-attention">
        <div class="attention-txt">注意事项</div>
        <div class="attention-items">
          <div class="item">
            <div class="imgDiv">
              <img class="img-1" :src="icons.time" />
            </div>
            <div class="label">时长&lt;{{livenessData.fileTime}}秒</div>
          </div>
          <div class="item">
            <div class="imgDiv">
              <img class="img-2" :src="icons.scanning" />
            </div>
            <div class="label">正脸拍摄</div>
          </div>
          <div class="item">
            <div class="imgDiv">
              <img class="img-3" :src="icons.HD" />
            </div>
            <div class="label">人像清晰</div>
          </div>
          <div class="item">
            <div class="imgDiv">
              <img class="img-4" :src="icons.light" />
            </div>
            <div class="label">光线均匀</div>
          </div>
        </div>
      </div>
    </section> -->
    <section class="btn-section">
      <div class="fs-btn">
        <x-button class="button-toOrder" v-if='showSkipLiving' @click.native="goNext" text="跳过活体" :gradients="['#f1cd37', '#f1cd37']"></x-button>
      </div>
      <div class="fs-btn">
        <label for="uploadVideo" class="fs-label"></label>
        <x-button :class="isClick?'button-toOrder':'button-toOrder fs-gray'" text="开始录制" :gradients="['#f1cd37', '#f1cd37']"></x-button>
      </div>
    </section>
    <alert v-model="alertShow" :title="alertTitle" :content="alertContent"></alert>
  </div>
</template>

<script>
import { XHeader, XButton, Alert } from 'vux';
import Config from './../../util/config';
import { ReportData } from './../../util/ReportData';
import StepDescBlock from '../../common/components/stepDescBlock/index.js';
export default {
  name: 'LivenessVerify',
  data() {
    return {
      serviceAgreet: null, // 埋点数据
      showSkipLiving: false, // 跳过活体按钮
      alertShow: false, // 通过alert的形式展示弹框
      alertTitle: '',
      alertContent: '',
      brisk: {
        // 埋点报文
        edittimes: [
          {
            type: 'uploads', // 活体页面 成功次数
            times: 0
          },
          {
            type: 'uploadf', // 活体页面 失败次数
            times: 0
          }
        ]
      },
      livenessData: {
        fileTime: 5,
        imgSrc: './static/images/LivenessUI/blink.gif',
        description: '眨眨眼睛',
        silentLiveness: false, // 静默还是非静默
        fileSize: 15 * 1024 * 1024,
        sizeText: '15M'
      },
      livenessAssets: {
        BLINK: {
          key: 'BLINK',
          gif: './static/images/LivenessUI/blink.gif',
          description: '眨眨眼睛'
        },
        MOUTH: {
          key: 'MOUTH',
          gif: './static/images/LivenessUI/mouth.gif',
          description: '张一张嘴'
        },
        YAW: {
          key: 'YAW',
          gif: './static/images/LivenessUI/yaw.gif',
          description: '摇一摇头'
        },
        NOD: {
          key: 'NOD',
          gif: './static/images/LivenessUI/nod.gif',
          description: '点一点头'
        }
      },
      icons: {
        time: './static/images/OrderSet/time@2x.png',
        scanning: './static/images/OrderSet/scanning@2x.png',
        HD: './static/images/OrderSet/HD@2x.png',
        light: './static/images/OrderSet/light@2x.png'
      },
      fsAction: 'BLINK',
      isFirstTime: true, // 首次进入
      liveness: null,
      intCtrl: 0, // 循环查询
      clearInput: true,
      isChangeEffect: false, // input change 事件是否有效
      isClick: false,
      stepDesc: ''
    };
  },
  watch: {
    fsAction(val) {
      this.switchImgSrc();
    }
  },
  created() {
    let that = this;
    let processType = sessionStorage.getItem('processType');
    let amountExemption = sessionStorage.getItem('amountExemption');
    that.stepDesc = (processType !== '1') ? '还差1步：填写资料提交订单，最高免押20000' : '还差1步：填写资料提交订单，本单可免押¥' + amountExemption;
  },
  mounted: function() {
    let that = this;
    that.serviceAgreet = new ReportData();
    that.$store.commit('updateLoadingText', { loadText: '正在检测' });
    that.$reporter.init(); // 埋点初始化
    that.isBeyondeLimit();
    that.skipLiving(); // 跳过活体 -- 测试环境
    that.$refs.uploadVideo.addEventListener('change', that.checkFile.bind(that), false);
    that.intCtrl = setInterval(function() {
      if (that.$refs.uploadVideo.files.length > 0) {
        // input file 有文件
        setTimeout(function() {
          that.checkChangeEffect();
        }, 1500);
      }
    }, 500);
  },
  destroyed() {
    // 销毁
    this.$store.commit('updateLoadingText', { loadText: '加载中' });
    // 清除 循环
    clearInterval(this.intCtrl);
  },
  methods: {
    // 检查 input change
    checkChangeEffect() {
      if (!this.isChangeEffect) {
        this.checkFileInterval();
      }
    },
    // 跳过活体 -- 测试环境
    skipLiving() {
      if (Config.active === 'dev' || Config.active === 'test') {
        this.showSkipLiving = true;
      }
    },
    goNext() {
      // this.$router.replace({ name: 'OrderSubmitPageNew' });
      this.confirmBook();
    },
    onSuccess(res) {
      let that = this;
      if (res.code === '00') {
        // 活体页面 成功次数
        that.brisk.edittimes[0].times++;
        // 埋点数据上报
        that.$reporter.dataReport(that.brisk);
        that.$vux.toast.show({
          text: '检测成功',
          isShowMask: true,
          onHide() {
            // that.$router.replace({ name: 'OrderSubmitPageNew' });
            that.confirmBook();
          }
        });
      } else {
        // 活体页面 失败次数
        that.brisk.edittimes[1].times++;
        that.$vux.alert.show({
          title: '检测失败',
          content: res.msg
        });
        that.isBeyondeLimit();
      }
    },
    // http 异常 或 ui 触发的异常
    onError(res) {
      let that = this;
      // 活体页面 失败次数
      that.brisk.edittimes[1].times++;

      that.isClick = true;
      if (res && res.code === 'fs3301') {
        that.$vux.alert.show({
          title: '检测失败',
          content: res.msg
        });
      } else {
        that.$vux.alert.show({
          content: '网络异常，请检查您的网络' // <br>' + res.message // '您提供的视频不满足拍摄要求，请按拍摄要求再次尝试'
        });
      }
    },
    // 在 setInterval 中触发的
    checkFileInterval() {
      let that = this;
      const file = that.$refs.uploadVideo.files[0];
      // 使用 v-if 达到清空 input file 作用(lenght 置为0); 避免循环请求后台
      that.clearInput = false;
      that.$nextTick(() => {
        that.clearInput = true;
      });
      if (file.size > that.livenessData.fileSize) {
        that.onError({ code: 'fs3301', msg: `视频过大，请减少拍摄时长` });
        return false;
      }
      if (!that.checkRealFile(file.lastModifiedDate)) {
        that.$vux.alert.show({
          content: '请直接录制视频，不可以使用本地视频哦～若无法录制视频，请使用京东APP且更新京东App至最新版本。'
        });
        that.isClick = true;
        return false;
      }
      const formData = new FormData();
      formData.append('motions', that.fsAction);
      formData.append('applySerialNo', that.$store.state.applySerialNo);
      formData.append('inputStream', file);
      that.inputUpload(formData);
    },
    checkFile(e) {
      let that = this;
      // 清除 循环
      clearInterval(that.intCtrl);
      // input change 事件有效
      that.isChangeEffect = true;
      that.isClick = false;
      const files = e.target.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.size > that.livenessData.fileSize) {
          that.onError({ code: 'fs3301', msg: `视频过大，请减少拍摄时长` });
          return false;
        }
        if (!that.checkRealFile(file.lastModifiedDate)) {
          that.$vux.alert.show({
            content: '请直接录制视频，不可以使用本地视频哦～若无法录制视频，请使用京东APP且更新京东App至最新版本。'
          });
          that.isClick = true;
          return false;
        }
        const formData = new FormData();
        formData.append('motions', that.fsAction);
        formData.append('applySerialNo', that.$store.state.applySerialNo);
        formData.append('inputStream', file);
        that.inputUpload(formData);
      } else {
        that.isClick = true;
      }
    },
    inputUpload(formData) {
      let that = this;
      that.$store.commit('updateLoadingStatus', { isLoading: true });
      that.$http
        .post('/wuzhu/liveness/checkLiveness', formData, {}, 600000)
        .then(res => {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          that.onSuccess(res);
        })
        .catch(err => {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          that.onError(err);
          console.log(err);
        });
    },
    // 随机动作 -- 改变 fsAction
    getLivenessEnum() {
      let that = this;
      let _random = Math.ceil(Math.random() * 3);
      if (_random === 1) {
        that.fsAction = 'BLINK';
      } else if (_random === 2) {
        that.fsAction = 'MOUTH';
      } else if (_random === 3) {
        that.fsAction = 'YAW';
      } else {
        that.fsAction = 'MOUTH';
      }
    },
    switchImgSrc() {
      let that = this;
      if (that.livenessData.silentLiveness) {
        that.livenessData.description = '保持不动';
        that.livenessData.imgSrc = './static/images/LivenessUI/silent.gif';
      } else if (that.fsAction === 'BLINK') {
        that.livenessData.description = that.livenessAssets.BLINK.description;
        that.livenessData.imgSrc = './static/images/LivenessUI/blink.gif';
      } else if (that.fsAction === 'MOUTH') {
        that.livenessData.description = that.livenessAssets.MOUTH.description;
        that.livenessData.imgSrc = './static/images/LivenessUI/mouth.gif';
      } else if (that.fsAction === 'YAW') {
        that.livenessData.description = that.livenessAssets.YAW.description;
        that.livenessData.imgSrc = './static/images/LivenessUI/yaw.gif';
      } else if (that.fsAction === 'NOD') {
        that.livenessData.description = that.livenessAssets.NOD.description;
        that.livenessData.imgSrc = './static/images/LivenessUI/nod.gif';
      } else {
        // fsAction 设置出错
        that.livenessData.description = that.livenessAssets.BLINK.description;
        that.livenessData.imgSrc = './static/images/LivenessUI/blink.gif';
      }
    },
    isBeyondeLimit() {
      let that = this;
      let param = {
        openId: that.$store.state.othersOpenID, // 微信的openId
        channelNo: that.$store.state.channelNo,
        applySerialNo: that.$store.state.applySerialNo
      };
      that.$http
        .get('/wuzhu/liveness/isBeyondeLimit', param)
        .then(res => {
          if (res.code === '00') {
            that.getLivenessEnum(); // 改变 fsAction 的值
            that.isClick = true;
          } else {
            that.isClick = false;
            that.$vux.alert.show({
              content: res.msg,
              onHide() {
                that.$router.replace({ name: 'HomePage' });
              }
            });
          }
        })
        .catch(err => {
          that.isClick = true;
          console.log(err);
        });
    },
    // 京东渠道，Android手机，通过file.lastModifiedDate判断是否是实时拍摄的视频，20秒内的视为有效视频
    checkRealFile(lastModifiedDate) {
      if (lastModifiedDate && this.$store.state.channelNo === '003' && this.$store.state.osinfo === 'Android') {
        let nowTime = new Date().getTime();
        let fileTime = lastModifiedDate.getTime();
        if (fileTime && fileTime <= nowTime && fileTime + 20000 >= nowTime) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    },
    // 发送HTTP确认预约的服务
    confirmBook() {
      let that = this;
      that.$store.commit('updateLoadingStatus', { isLoading: true });
      // 获取对应的商品详情页面 GET /reservationController/getCommodityFromSession
      let comfirmUrl = '/wuzhu/reservationController/confirmReservationApplication';
      let _brickSessionStore = that.serviceAgreet.getSessionStore();
      let byno = _brickSessionStore.byno; // 分控埋点的号码
      // console.log('确认预约前 byno === ' + byno);
      let platform = that.$store.state.platformCode;
      // console.log('确认预约前 platform === ' + platform);
      // 请求的参数
      let param = {
        continueFlag: that.$store.state.continueFlag,
        applySerialNo: that.$store.state.applySerialNo,
        recommCode: that.$store.state.recommeCode, // 邀请码 -// -
        byno: byno, // 风控埋点
        contactInfo: JSON.stringify(that.brisk.contactInfo),
        platformCode: platform // 客户端平台
      };
      that.$http.post(comfirmUrl, param).then(res => {
        if (res.code === '00') {
          // 先判断下是否获取了对应的订单号
          let orderNo = res && res.data;
          // 埋点数据上报
          that.$reporter.dataReport(that.brisk);
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          that.$router.replace({
            name: 'OrderSubSuccessPage',
            params: { orderNo: orderNo }
          });
          // let userChooseData = res['data']
          // let userChooseData = JSON.parse(data['commodityJsonStr'])
          // this.parseJsonStrFromSession(userChooseData)
        } else {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          // 错误信息的提示
          that.$vux.alert.show({
            content: res.msg,
            onHide() {
              that.$router.replace({ name: 'HomePage' });
            }
          });
        }
      });
    }
  },
  components: {
    XHeader,
    XButton,
    Alert,
    StepDescBlock
  }
};
</script>

<style lang="less">
@import './../../common/less/index';
.LivenessVerify {
  .stepDescBlock {
    background-size: 75% 100% !important;
  }
  font-family: PingFangSC-Regular;
  background-color: #f5f5f5;
  height: 100%;
  .fs-liveness {
    text-align: center;
    width: 100%;
    background-color: white;
    .liveness-header {
      font-family: PingFangSC;
      color: #333;
      font-size: 18px;
      padding: 18px;
      font-weight: bold;
      text-align: left;
    }

    .liveness-img {
      width: 182px;
      height: 182px;
      margin: auto;
      .bg('~./Rectangle2');
    }
    .liveness-img-box {
      border: 1px dashed #888;
      width: 182px;
      height: 182px;
      margin: auto;
      background-color: #f5f5f5;
      position: relative;
      .bg('~./Rectangle2_box');
      img {
        position: absolute;
        margin: auto;
        width: 170px;
        height: 170px;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
      }
    }
    .liveness-txt {
      background-color: #fff5bd;
      display: inline-block;
      margin: 14px auto;
      padding: 2px 12px;
      color: #111;
      font-size: 18px;
      font-weight: bold;
    }
  }
  .upload-input {
    display: none;
  }
  .fs-attention {
    .attention-txt {
      padding: 15px 15px;
      background-color: #f7f5f5;
      color: #999999;
      font-size: 14px;
    }
    .attention-items {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px 0;
      background-color: #fff;

      .item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .imgDiv {
        width: 40px;
        height: 38px;
        text-align: center;
      }
      .img-1 {
        width: 36px;
        height: 36px;
      }
      .img-2 {
        width: 32px;
        height: 36px;
      }
      .img-3 {
        width: 30px;
        height: 28px;
        margin-left: 4px;
      }
      .img-4 {
        width: 36px;
        height: 36px;
      }

      .label {
        color: #111;
        font-size: 12px;
      }
    }
  }

  .btn-section {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 20px;
    max-width: 600px;
    margin: auto;
  }

  .fs-btn {
    position: relative;
    width: 90%;
    margin: auto;
    .fs-label {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0px;
      top: 0px;
      z-index: 998;
    }
  }
  .box-liveness {
    padding-top: 20%;
    margin-top: 20%;
    text-align: center;
  }
  .liveness-tips {
    font-family: PingFangSC-Regular;
    font-size: 17px;
    line-height: 20px;
    padding-top: 13px;
    height: 20px;
    color: #9b9b9b;
  }
  .box-toOrder {
    margin: 30% 15px;
  }
  .button-toOrder {
    color: black !important;
  }
  .fs-gray {
    background: #f8f8f8 !important;
    color: #ccc !important;
  }
  // 新UI
  .liveBlock {
    padding: 30px 15px;
    background: #fff;
    .liveTitle {
      font-size:16px;
      font-weight: bold;
      color:#222222;
      line-height:20px;
      margin-bottom: 30px;
    }
    .liveDesc {
      background:rgba(254,247,179,0.3);
      border-radius:3px;
      border:0.5px solid rgba(151,151,151,0.3);
      padding: 15px;
      z-index: 999;
      font-size:14px;
      line-height:36px;
      color: #222222;
    }
    .red {
      color: #F5222D;
    }
  }
  .liveTips {
    padding: 12px 15px;
    font-size:12px;
    color: #888888;
    line-height:17px;
  }
}
@media screen and (max-height: 568px) {
  .LivenessVerify {
    padding-bottom: 85px;
  }
}
</style>
