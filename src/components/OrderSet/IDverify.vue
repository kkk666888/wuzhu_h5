<template>
  <div class="IDverify">
    <StepDescBlock :stepDesc="stepDesc" :stepIndex="0">
    </StepDescBlock>
    <div class="d_id_box">
      <p class="p_img_info">请拍摄您本人身份证原件，确保照片清晰</p>
      <flexbox class="fb_box" :gutter="0">
        <flexbox-item>
          <div class="f_item f_item-1">
            <img class="id-img" :src="imgUrl0.localId">
            <label for="uploadImage" class="upload-input"></label>
            <input :disabled="isCheckCustomer" ref="uploadImage" id="uploadImage" name="uploadImage" type="file" accept="image/*" style="display: none;">
            <p class="img_tips">身份证人像面</p>
          </div>
        </flexbox-item>
        <flexbox-item>
          <div class="f_item f_item-2">
            <img class="id-img" :src="imgUrl1.localId">
            <label for="uploadImage2" class="upload-input"></label>
            <input :disabled="isCheckCustomer" ref="uploadImage2" id="uploadImage2" name="uploadImage2" type="file" accept="image/*" style="display: none;">
            <p class="img_tips">身份证国徽面</p>
          </div>
        </flexbox-item>
      </flexbox>
    </div>
    <div class="padding-line"></div>
    <div class="id_info">
      <group class="id_group" label-width="8em" label-margin-right="2em" label-align="right">
        <x-input :max="20" v-if="!isCheckCustomer" class="xi_info" title="姓名" placeholder="请输入" v-model="ocrMsg.name" @on-blur="inputNameChange"></x-input>
        <x-input :max="20" v-else class="xi_info" title="姓名" placeholder="请输入" :disabled="true" v-model="ocrMsgShow.name"></x-input>
        <x-input :max="30" v-if="!isCheckCustomer" class="xi_info" title="身份证号" placeholder="请输入" v-model="ocrMsg.number" @on-blur="inputMsgChange"></x-input>
        <x-input :max="30" v-else class="xi_info" title="身份证号" placeholder="请输入" :disabled="true" v-model="ocrMsgShow.number"></x-input>
      </group>
    </div>
    <div class="fs-box-next">
      <div class="idverify-tips">请检查姓名及身份证号是否读取正确，<br /> 资料将严格保密，仅用于物主平台认证。</div>
      <x-button v-show="btnState === 'next'" @click.native="goNext" class="">下一步</x-button>
      <x-button v-show="btnState === 'save'" :class="(isCheckCustomer )?'fs-gray fs-display-none':''" :disabled="(isCheckCustomer)" @click.native="saveID">认 证</x-button>
    </div>
  </div>
</template>

<script>
import { XImg, Flexbox, FlexboxItem, XHeader, Group, XInput, XButton } from 'vux';
import { compressImg } from './../../util/utils';
import StepDescBlock from '../../common/components/stepDescBlock/index.js';
export default {
  name: 'IDverify',
  data() {
    return {
      stepDesc: '',
      flatBtnCtrl: true,
      brisk: {
        // 埋点报文
        edittimes: [
          {
            type: 'uploads', // OCR正面成功次数
            times: 0
          },
          {
            type: 'uploadf', // OCR正面失败次数
            times: 0
          },
          {
            type: 'upload2s', // OCR反面成功次数
            times: 0
          },
          {
            type: 'upload2f', // OCR反面失败次数
            times: 0
          },
          {
            type: 'name', // 姓名修改次数
            times: 0
          },
          {
            type: 'no', // 身份证号码修改次数
            times: 0
          }
        ]
      },
      showScrollBox: false,
      dialogContent: '',
      nextPage: 'HomePage', // 在 beforeRouteEnter 中赋值
      resEducation: {}, // 查询到的信息
      resCustomer: {}, // 查询到的信息
      frontDatas: {},
      backDatas: {},
      imgOrder: 0, // 0 身份证正面，1
      isNotOcrDeal: false,
      ocrMsg: {
        name: '',
        number: '' // 身份证号码
      },
      ocrMsgShow: {
        name: '',
        number: ''
      },
      applySerialNo: '',
      accountStatus: '', // OK 代表校验通过
      jsApiList: ['checkJsApi', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage'],
      btnState: this.$store.state.IDInfoBtnState,
      imgUrl0: {
        localId: './static/images/OrderSet/IDCard_front@1.5x.png',
        imageName: '',
        serverId: ''
      },
      imgUrl1: {
        localId: './static/images/OrderSet/IDCard_back@1.5x.png',
        imageName: '',
        serverId: ''
      },
      isCheckCustomer: this.$store.state.ocrMsgCheck.isCheckCustomer // 客户身份信息校验
    };
  },
  watch: {
    'ocrMsg.number': function(val, oldval) {
      val = String(val);
      let newVal = '';
      if (val.length > 8) {
        newVal += val.substr(0, 4);
        newVal += ' **** **** ';
        newVal += val.substr(val.length - 4, val.length - 1);
        this.ocrMsgShow.number = newVal;
      }
      return val;
    },
    'ocrMsg.name': function(val, oldval) {
      val = String(val);
      let newVal = '';
      if (val) {
        val.split('').map(function(item, index, array) {
          if (index === 0) {
            newVal += item;
          } else {
            newVal += '*';
          }
        });
        this.ocrMsgShow.name = newVal;
      }
      return val;
    }
  },
  created() {
    let processType = sessionStorage.getItem('processType');
    let amountExemption = sessionStorage.getItem('amountExemption');
    this.stepDesc = (processType !== '1') ? '还差4步：填写资料提交订单，最高免押20000' : '还差4步：填写资料提交订单，本单可免押¥' + amountExemption;
    this.$store.commit('updateLoadingStatus', { isLoading: true });
    this.queryCustomerInfoAndEd();
  },
  mounted: function() {
    let that = this;
    this.$reporter.init(); // 埋点初始化
    that.$refs.uploadImage.addEventListener(
      'change',
      function(e) {
        that.imgOrder = 0;
        that.inputUpload(e, 0);
      },
      false
    );
    that.$refs.uploadImage2.addEventListener(
      'change',
      function(e) {
        that.imgOrder = 1;
        that.inputUpload(e, 1);
      },
      false
    );
  },
  methods: {
    testtest() {
      this.$reporter.dataReport(this.brisk);
    },
    inputNameChange() {
      this.brisk.edittimes[4].times++;
    },
    inputMsgChange() {
      this.brisk.edittimes[5].times++;
    },
    // 检查 身份证名字 -- 没有做全角半角校验
    checkIDCardName(name) {
      let that = this;
      let reg = /^[\u2E80-\uFE4F·]{2,12}$/i;
      let result = reg.test(name);
      if (!result) {
        that.$vux.alert.show({
          title: '身份信息错误',
          content: '请输入正确的姓名与身份证号码'
        });
      }
      return result;
    },
    // 检查 身份证
    checkIDCard(card) {
      let that = this;
      // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      let result = reg.test(card);
      if (result === false) {
        that.$vux.alert.show({
          title: '身份信息错误',
          content: '请输入正确的姓名与身份证号码'
        });
      }
      return result;
    },
    // OCR 识别
    checkOCRIDCard(side, opt) {
      let that = this;
      that.$http
        .get('/wuzhu/reservationController/checkOCRIDCard', {
          applySerialNo: that.$store.state.applySerialNo, // 后台定义
          filePath: opt.filePath,
          imageName: opt.imageName,
          photoType: opt.photoType,
          side: side || 'front' // front or back
        })
        .then(res => {
          if (res.code === '00') {
            if (side === 'front') {
              // OCR 正面成功次数
              that.brisk.edittimes[0].times++;
              that.ocrMsg.name = res.data.name;
              that.ocrMsg.number = res.data.number; // 身份证
              that.frontDatas = res.data;
              that.imgUrl0.serverId = '图片已经上传';
            } else {
              // OCR 反面成功次数
              that.brisk.edittimes[2].times++;
              that.backDatas = res.data;
              that.imgUrl1.serverId = '图片已经上传';
            }
          } else {
            if (side === 'front') {
              // OCR 正面失败次数
              that.brisk.edittimes[1].times++;
              that.imgUrl0.localId = './static/images/OrderSet/IDCard_front@1.5x.png';
              that.imgUrl0.imageName = '';
              that.imgUrl0.serverId = '';
            } else {
              // OCR 反面失败次数
              that.brisk.edittimes[3].times++;
              that.imgUrl1.localId = './static/images/OrderSet/IDCard_back@1.5x.png';
              that.imgUrl1.imageName = '';
              that.imgUrl1.serverId = '';
            }
            that.$vux.alert.show({
              title: '身份证照片识别错误',
              content: res.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    inputUpload(e, order) {
      let that = this;
      const files = e.target.files;
      if (files.length > 0) {
        const file = files[0];
        // if (!that.checkRealFile(file.lastModifiedDate)) {
        //   that.$vux.alert.show({
        //     content: '请直接拍摄照片，不可以使用本地照片哦～若无法拍摄照片，请使用京东APP且更新京东App至最新版本。'
        //   });
        //   return;
        // }
        // 照片类型，摄像头拍摄为1，否则为2
        let photoType = (that.checkPhotoType(file.lastModifiedDate)) ? '1' : '2';
        // 加载 loading
        that.$store.state.isLoading = true;
        // 压缩图片
        compressImg(file).then(
          function(resBlob) {
            const formData = new FormData();
            formData.append('file', resBlob, file.name);
            that.$http
              .post('/wuzhu/common/uploadFile', formData, {}, 300000)
              .then(res => {
                that.$store.state.isLoading = false;
                that.dealUploadRes(order, res, photoType); // 处理上传后的 结果
              })
              .catch(err => {
                console.log('uploadFile err=' + JSON.stringify(err));
                that.$store.state.isLoading = false;
                if (!err.response || err.message === 'Network Error') {
                  that.$vux.alert.show({
                    title: '上传失败',
                    content: '网络异常，请检查您的网络连接'
                  });
                }
                console.log(err);
              });
          },
          function(error) {
            // 报错的话 上传原图
            console.log(error);
            const formData = new FormData();
            formData.append('file', file);
            that.$http
              .post('/wuzhu/common/uploadFile', formData, {}, 300000)
              .then(res => {
                that.$store.state.isLoading = false;
                that.dealUploadRes(order, res, photoType);
              })
              .catch(err => {
                console.log('uploadFile err=' + JSON.stringify(err));
                that.$store.state.isLoading = false;
                if (!err.response || err.message === 'Network Error') {
                  that.$vux.alert.show({
                    title: '上传失败',
                    content: '网络异常，请检查您的网络连接'
                  });
                }
                console.log(err);
              });
          }
        );
      }
    },
    // 处理上传后的 结果
    dealUploadRes(order, res, photoType) {
      let that = this;
      that.$store.state.isLoading = false;
      if (res.code === '00' && res.data) {
        if (order === 0) {
          // 正面
          that.imgUrl0.localId = res.data.filePath;
          that.imgUrl0.imageName = res.data.imageName;
          that.checkOCRIDCard('front', { filePath: res.data.filePath, imageName: res.data.imageName, photoType: photoType });
        } else {
          // 返面
          that.imgUrl1.localId = res.data.filePath;
          that.imgUrl1.imageName = res.data.imageName;
          that.checkOCRIDCard('back', { filePath: res.data.filePath, imageName: res.data.imageName, photoType: photoType });
        }
      } else {
        that.$vux.alert.show({
          content: res.msg
        });
      }
    },
    // 向后台 查询数据
    queryCustomerInfoAndEd() {
      let that = this;
      that.$http
        .get('/wuzhu/customerVerController/queryCustomerInfoAndEd', {})
        .then(res => {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          if (res.code === '00' && res.data) {
            that.resEducation = res.data.education || {};
            that.resCustomer = res.data.customer || {};
            that.isCheckCustomer = res.data.isCheckCustomer;
            that.ocrMsg.name = that.resCustomer.customerName;
            that.ocrMsg.number = that.resCustomer.certId;
            // 身份证验证通过
            if (res.data.isCheckCustomer) {
              that.imgUrl0.localId = './static/images/OrderSet/ID_badge@2x.png';
              that.imgUrl1.localId = './static/images/OrderSet/ID_badge@2x.png';
            }
            that.isNotOcrDeal = res.data.isNotOcrDeal;
            // "isNotOcrDeal", false);//是否不需要重新进行ocr扫描
            if (that.isNotOcrDeal) {
              // true 不需要重新扫描
              that.imgUrl0.serverId = '图片已经上传';
              that.imgUrl1.serverId = '图片已经上传';
            } else {
              that.imgUrl0.serverId = '';
              that.imgUrl1.serverId = '';
            }
            that.$store.commit('updateOcrMsg', {
              ocrMsg: {
                name: that.ocrMsg.name,
                number: that.ocrMsg.number // 身份证号码
              }
            });
            that.$store.commit('updateOcrMsgCheck', {
              ocrMsgCheck: {
                isCheckCustomer: that.isCheckCustomer // 客户身份信息校验
              }
            });
          } else {
            that.$vux.alert.show({
              content: res.msg
            });
          }
        })
        .catch(err => {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          console.log(err);
        });
    },
    checkIdentityVerification(isNext) {
      let that = this;
      if (!that.imgUrl0.serverId) {
        that.$vux.alert.show({
          content: '请上传正确的身份证人像面照片'
        });
        that.flatBtnCtrl = true;
        return false;
      }
      if (!that.imgUrl1.serverId) {
        that.$vux.alert.show({
          content: '请上传正确的身份证国徽面照片'
        });
        that.flatBtnCtrl = true;
        return false;
      }
      let resOCRName = that.checkIDCardName(that.ocrMsg.name);
      if (!resOCRName) {
        // 检测 ocr 名字
        that.flatBtnCtrl = true;
        return false;
      }
      let resOCRNum = that.checkIDCard(that.ocrMsg.number);
      if (!resOCRNum) {
        that.flatBtnCtrl = true;
        return false;
      }
      let _birthday = [];
      if (that.resCustomer.birthday) {
        _birthday = that.resCustomer.birthday.split('-');
      }
      that.$store.commit('updateLoadingStatus', { isLoading: true });
      that.$http
        .get('/wuzhu/customerVerController/checkIdentityVerification', {
          openId: that.$store.state.othersOpenID || that.resCustomer.wechatOpenId,
          channelNo: that.$store.state.channelNo,
          applySerialNo: that.$store.state.applySerialNo || that.resEducation.applySerialNo, // 后台定义
          customerId: that.$store.state.userID || that.resEducation.customerId,
          loginMobile: 'serverId',
          name: that.ocrMsg.name,
          certId: that.ocrMsg.number,
          sex: that.frontDatas.sex || that.resCustomer.sex,
          nation: that.frontDatas.nation || that.resCustomer.nation,
          year: that.frontDatas.year || _birthday[0],
          month: that.frontDatas.month || _birthday[1],
          day: that.frontDatas.day || _birthday[2],
          address: that.frontDatas.address || that.resCustomer.permanentAddr,
          idImgFront: that.imgUrl0.imageName || that.resCustomer.idImgFront,
          idImgBack: that.imgUrl1.imageName || that.resCustomer.idImgBackend,
          authority: that.backDatas.authority || that.resCustomer.signAuthority,
          certDueDate: that.backDatas.timelimit || that.resCustomer.certDueDate, // 到期日
          recommCode: that.$store.state.recommeCode, // 邀请码 --
          // isNext false 保存 2 入口是个人中心; 1 入口是确认预约
          fromFlag: isNext ? 1 : 2 // 是否校验 applySerialNo
        })
        .then(res => {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          if (res.code === '00' && res.data) {
            that.applySerialNo = res.data.applySerialNo;
            that.accountStatus = res.data.accountStatus;
            that.isCheckCustomer = res.data.isCheckCustomer;
            // private boolean isCheckCustomer; // 客户身份信息校验
            if (that.accountStatus === 'OK') {
              that.$store.commit('accountStatusMemory', { accountStatus: '正常' });
            }
            that.$store.commit('updateOcrMsg', {
              ocrMsg: {
                name: that.ocrMsg.name,
                number: that.ocrMsg.number // 身份证号码
              }
            });
            that.$store.commit('updateOcrMsgCheck', {
              ocrMsgCheck: {
                isCheckCustomer: that.isCheckCustomer // 客户身份信息校验
              }
            });
            // 埋点数据上报
            that.$reporter.dataReport(that.brisk);
            if (isNext) {
              // 跳下一步
              that.$vux.toast.show({
                text: '验证成功',
                isShowMask: true,
                onHide() {
                  that.$router.replace({ name: 'Credit' }); // 下一步 跳小白
                }
              });
            } else {
              // 保存成功后，返回原页面
              that.$router.replace({ name: that.nextPage });
            }
          } else if (res.code === '6022') {
            that.$vux.alert.show({
              title: '提示',
              content: res.msg,
              onHide() {
                let channelNo = that.$store.state.channelNo;
                // 非京东渠道重新登陆
                if (channelNo === '001') {
                  that.$store.commit('tokenMemory', { token: '' });
                  that.$router.push({ name: 'InitLogin' });
                }
                that.flatBtnCtrl = true;
              }
            });
          } else {
            that.$vux.alert.show({
              content: res.msg
            });
            that.flatBtnCtrl = true;
          }
        })
        .catch(err => {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          that.flatBtnCtrl = true;
          if (!err.response || err.message === 'Network Error') {
            that.$vux.alert.show({
              title: '认证失败',
              content: '网络异常，请检查您的网络连接'
            });
          } else {
            that.$vux.alert.show({
              content: '身份验证异常，请稍后再试'
            });
          }
          console.log(err);
        });
    },
    goNext() {
      // 如果已经校验通过了, 直接跳到 小白
      if (this.isCheckCustomer) {
        this.$router.replace({ name: 'Credit' }); // 下一步 跳小白
        return false;
      }
      // 把信息上传后台 -- 控制只让 用户点一次
      if (this.flatBtnCtrl) {
        this.flatBtnCtrl = false;
        this.checkIdentityVerification(true);
      }
    },
    saveID() {
      if (this.flatBtnCtrl) {
        this.flatBtnCtrl = false;
        this.checkIdentityVerification(false);
      }
    },
    // 京东渠道，Android手机，通过file.lastModifiedDate判断是否是实时拍摄的照片，15秒内的视为有效照片
    checkRealFile(lastModifiedDate) {
      if (lastModifiedDate && this.$store.state.channelNo === '003' && this.$store.state.osinfo === 'Android') {
        let nowTime = new Date().getTime();
        let fileTime = lastModifiedDate.getTime();
        if (fileTime && fileTime <= nowTime && fileTime + 15000 >= nowTime) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    },
    // 判断照片是通过摄像头拍摄还是从相册中选择（通过file.lastModifiedDate判断是否是实时拍摄的照片，30秒内的视为有效照片）
    checkPhotoType(lastModifiedDate) {
      if (lastModifiedDate) {
        let nowTime = new Date().getTime();
        let fileTime = lastModifiedDate.getTime();
        if (fileTime && fileTime <= nowTime && fileTime + 30000 >= nowTime) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.nextPage = from.name;
      localStorage.setItem('origin', from.name);
    });
  },
  components: {
    XImg,
    XButton,
    Flexbox,
    FlexboxItem,
    XHeader,
    Group,
    XInput,
    StepDescBlock
  }
};
</script>

<style lang="less">
@import './../../common/less/index';
.IDverify {
  height: 100%;
  background: #f5f5f5;
  font-family: PingFangSC-Medium;
  .stepDescBlock {
    background-size: 5% 100% !important;
  }
  .d_title {
    margin-top: 14px;
    .i_back {
      float: left;
      margin-left: 15px;
    }
    .d_title_info {
      position: absolute;
      width: 100%;
      text-align: center;
      float: left;
      .p_title {
        font-size: 19px;
        color: #222222;
      }
    }
  }
  .d_id_box {
    padding: 0 18px;
    background: #fff;
    .p_img_info {
      font-size: 16px;
      color: #222222;
      letter-spacing: 0;
      padding: 16px 8px;
      font-weight:500;
      // font-weight: bold;
    }
    .fb_box {
      .f_item {
        position: relative;
        &.f_item-1 {
          text-align: right;
          margin-right: 4px;
        }
        &.f_item-2 {
          text-align: left;
          margin-left: 4px;
        }
        .img-mask {
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: 9999;
        }
        .upload-input {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 998;
          left: 0px;
          top: 0px;
        }
        .id-img {
          border-radius: 8px;
          width: 100%;
          height: 100px;
        }
        .img_tips {
          margin: 12px 0px 15px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #333333;
          letter-spacing: 0;
          text-align: center;
          line-height: 20px;
        }
      }
    }
  }
  .padding-line {
    height: 20px;
    width: 100%;
  }
  .id_info {
    background: #fff;
    .id_group {
      .vux-no-group-title {
        margin-top: 0 !important;
        &::before {
          border-top: 0;
        }
        &:last-child {
          &:after {
            border-bottom: 0;
          }
        }
      }
      .xi_info {
        height: 30px;
        font-size: 14px;
        .weui-cell__hd {
          .weui-label {
            word-wrap: unset;
            word-break: unset;
            white-space: nowrap;
            margin-right: 0em !important;
            text-align: left !important;
          }
        }
        .weui-cell__bd {
          margin-right: 5px;
        }
        .weui-cell__ft {
          .p_guide {
            margin-right: 5px;
            font-size: 13px;
            color: #ffc400;
          }
          i.weui-icon {
            position: absolute;
            right: 0px;
            top: 50%;
            margin-top: -8px;
          }
        }
      }
    }
  }
  .box_next {
    margin-top: 45px;
    margin-left: 22px;
    margin-right: 22px;
    height: 45px;
    background: #ffda29;
    border-radius: 50px;
    text-align: center;
  }
  .fs-display-none {
    display: none;
  }
  .fs-box-next {
    margin-top: 12px;
    height: 48px;
    padding: 0 18px;
    .weui-btn_default {
      background: #ffda29;
      color: #222222;
      &:after {
        border: 0;
      }
    }
    .warming-txt {
      color: #c9302c;
      font-size: 14px;
    }
  }
  .weui-cell:before {
    border-top: 1px solid #ddd;
  }
  .idverify-tips {
    font-size: 12px;
    color: #888;
    line-height: 17px;
    margin-bottom: 40px;
  }

  @media screen and (max-width: 320px) {
    .d_id_box {
      padding: 0 5px;
      padding-top: 36px;
      .fb_box {
        .f_item {
          .id-img {
            width: 165px;
          }
          &.f_item-1 {
            margin-right: 2px;
          }
          &.f_item-2 {
            margin-left: 2px;
          }
        }
      }
    }
  }
  // 大于 400px
  @media screen and (min-width: 400px) {
    .d_id_box {
      .fb_box {
        .f_item {
          &.f_item-1 {
            text-align: center;
            margin-right: 8px;
          }
          &.f_item-2 {
            text-align: center;
            margin-left: 8px;
          }
        }
      }
    }
  }
}
</style>
