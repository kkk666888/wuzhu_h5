<template>
  <div class="GoodsReturn">
    <div class="return-content">
      <div class="return-info">
        <p class="address-title">请选择物流公司</p>
        <!-- <div class="cutline vux-1px-t"></div> -->
        <div class="choose-logistics" @click="chooseLogistics">
          <span class="logistics-button sf-logistics" data-companycode="2" id="sf">
            <img srcset="./icon_SF.png 1x, ./icon_SF@2x.png 2x" class="icon icon-normal" alt="sf">
            <img srcset="./icon_SF_active.png 1x, ./icon_SF_active@2x.png 2x" class="icon icon-active" alt="sf"> 顺丰物流
          </span>
          <span v-if="!isAlipayLife" class="logistics-button jd-logistics" data-companycode="1" id="jd">
            <img srcset="./icon_JD.png 1x, ./icon_JD@2x.png 2x" class="icon icon-normal" alt="jd">
            <img srcset="./icon_JD_active.png 1x, ./icon_JD_active@2x.png 2x" class="icon icon-active" alt="jd"> 京东物流
          </span>
          <span v-else class="logistics-button other-logistics" data-companycode="3" id="other">
            <img srcset="./icon_other.png 1x, ./icon_other@2x.png 2x" class="icon icon-normal" alt="other">
            <img srcset="./icon_other_active.png 1x, ./icon_other_active@2x.png 2x" class="icon icon-active" alt="other"> 其他物流
          </span>
        </div>
        <div class="logistics-number ">
          <!--添加group会出现线条-->
          <x-input title="物流单号" class="vux-1px-b" v-model="deliveryOrderNo" :is-type="logisticsNo" placeholder="请输入物流编号"></x-input>
        </div>
        <p class="return-tips" v-html="sendPostRemark"></p>
      </div>
      <div class="return-address">
        <h4>归还地址</h4>
        <p class="address-detail">{{supplierAddress}}<br>{{supplierContact}}</p>
      </div>
      <div class="attention clearfix" id="attention">
        <div class="return-attention">
          <h4>注意事项</h4>
          <p class="attention-list" v-html="noticeEmark"></p>
        </div>
      </div>
    </div>
    <div class="btnPlane">
      <x-button type="primary" :disabled="returnBtnDisabled" :show-loading="returnBtnDisabled" class="submitReturn-btn" action-type="button" @click.native="applyReturnNote">确认归还</x-button>
    </div>
  </div>
</template>
<script>
import { XButton, XInput } from 'vux';
import { mapMutations } from 'vuex';
import { isAlipayLife } from './../../util/utils';
export default {
  name: 'GoodsReturn',
  components: {
    XButton,
    XInput
  },
  data() {
    return {
      sendPostRemark: '', // 邮寄备注
      noticeEmark: '', // 注意事项
      supplierAddress: '', // 供应商地址
      supplierContact: '', // 供应商联系人
      returnApplyNoteUrl: 'wuzhu/returnApplyNote/createReturnApplyNote',
      getAddressInfoUrl: '/wuzhu/vendor/getVendorReciveAddress',
      returnBtnDisabled: false,
      expressCompanyCode: '', // 物流公司编号 1、京东，2、顺丰
      deliveryOrderNo: '', //  物流单号
      returnReasonStyle: '0', // 归还原因 0、完结归还，1、维修归还，2、退货归还
      applyReturnDate: null, // 上门归还预约时间
      returnStationOid: '', // 回收站点Oid
      returnStyle: '0', // 归还方式 0、自寄，1、逆向物流，2、上门归还，3、上门维修
      logisticsNo(value) {
        let reg = /^[a-z0-9]+$/i;
        return {
          valid: reg.test(value),
          msg: '请输入正确物流单号'
        };
      },
      isAlipayLife: false // 当前是否支付宝生活号渠道
    };
  },
  props: {},
  computed: {},
  created() {
    if (!Object.is(this.$route.params.orderNo, undefined)) {
      this.$store.commit('goodsReturnOrderNo', { goodsReturnOrderNo: this.$route.params.orderNo });
    }
    this.isAlipayLife = isAlipayLife();
    // for test
    // this.goodsReturnOrderNo({ goodsReturnOrderNo: '00120181008M000112497841' });
  },
  mounted() {
    this.getAddressInfo();
  },
  methods: {
    ...mapMutations(['updateLoadingStatus', 'goodsReturnOrderNo']),
    // 填充底部颜色
    // addFooterColor() {
    //   this.$nextTick(() => {
    //     let body = document.body.offsetHeight;
    //     let current = document.querySelector('.GoodsReturn').offsetHeight;
    //     if (body > current) {
    //       let bottom = body - current;
    //       document.querySelector('#attention').style.paddingBottom = bottom + 'px';
    //     } else {
    //       document.querySelector('#attention').style.paddingBottom = '20px';
    //     }
    //   });
    // },
    // 获取供应商地址信息
    async getAddressInfo() {
      let param = {
        orderNo: this.$store.state.goodsReturnOrderNo
      };
      try {
        this.$store.commit('updateLoadingStatus', { isLoading: true });
        const res = await this.$http.get(this.getAddressInfoUrl, param);
        this.$store.commit('updateLoadingStatus', { isLoading: false });

        if (res.code === '00') {
          let data = res.data;
          this.returnStationOid = data.returnStationOid;
          this.supplierAddress = `${data.province}${data.city}${data.area}${data.location}`;
          this.supplierContact = `${data.contract}  ${data.contractPhone}`;
          this.sendPostRemark = data.sendPostRemark.replace(/\r\n|\n/g, '<br>');
          this.noticeEmark = data.noticeEmark.replace(/\r\n|\n/g, '<br>');
          // this.addFooterColor();
        } else {
          this.$vux.alert.show(res.msg);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 切换物流样式，获取编号
    chooseLogistics(e) {
      let target = e.target;
      let isTarget = e.target.classList.contains('logistics-button');
      let eleActive = document.querySelector('.choose-logistics .active');
      if (isTarget) {
        if (eleActive) {
          eleActive.classList.remove('active');
        }
        target.classList.add('active');
        this.expressCompanyCode = target.dataset.companycode;
      }
    },
    // 申请归还
    async applyReturnNote() {
      let formPass = this.validateForm();
      if (formPass) {
        this.returnBtnDisabled = true;
        try {
          this.$store.commit('updateLoadingStatus', { isLoading: true });
          let returnUrl = this.returnApplyNoteUrl;
          // 申请归还参数
          let params = {
            orderNo: this.$store.state.goodsReturnOrderNo,
            expressCompanyCode: this.expressCompanyCode,
            deliveryOrderNo: this.deliveryOrderNo,
            returnReasonStyle: this.returnReasonStyle,
            applyReturnDate: this.applyReturnDate,
            returnStationOid: this.returnStationOid,
            returnStyle: this.returnStyle
          };
          let res = await this.$http.post(returnUrl, params);
          this.returnBtnDisabled = false;
          this.$store.commit('updateLoadingStatus', { isLoading: false });
          if (res.code === '00') {
            this.$vux.toast.show('归还申请成功');
            this.$router.replace({ name: 'OrderListPage' });
          } else {
            this.$vux.alert.show(res.msg);
          }
        } catch (error) {
          this.$store.commit('updateLoadingStatus', { isLoading: false });
          this.returnBtnDisabled = false;
          this.$vux.alert.show(error.message);
        }
      }
    },
    // 表单验证
    validateForm() {
      let isPass = true;
      if (this.expressCompanyCode === '') {
        this.$vux.alert.show('请选择物流公司');
        return false;
      }
      if (this.deliveryOrderNo === '') {
        this.$vux.alert.show('请填写物流单号');
        return false;
      }
      if (!this.logisticsNo(this.deliveryOrderNo).valid) {
        this.$vux.alert.show('请填写正确物流单号');
        return false;
      }
      return isPass;
    }
  }
};
</script>
<style lang="less" scoped>
@import '../../common/less/index.less';
@color-h: #111;
@color-white: #fff;
@lh-20: 20px;
@fontsize-p: 14px;
.GoodsReturn {
  height: 100%;
  overflow: hidden;
  display: flex;
  .return-content {
    overflow: scroll;
    padding-bottom: 50px;
  }
  .address-title {
    font-size: 16px;
    color: @color-h;
    padding: 15px 15px;
    line-height: 22px;
  }
  .cutline {
    border-color: #ddd;
  }
  .return-info {
    margin-top: 18px;
    background-color: @color-white;
    .choose-logistics {
      padding: 28px 0;
      .logistics-button {
        .f14;
        margin-left: 15px;
        padding: 12px 17px;
        color: @gray-8;
        line-height: @lh-20;
        display: inline-block;
        border-radius: 4px;
        .icon-active {
          display: none;
        }
      }
      .logistics-button.active {
        background: @bg-orange;
        border-color: @orange;
        color: #333;
        .icon-active {
          display: inline-block;
        }
        .icon-normal {
          display: none;
        }
      }
      .jd-logistics {
        background-image: url('./imgs/JD_bg.png');
        background-size: 100% 100%;
      }
      .jd-logistics.active {
        background-size: 100% 100%;
        background-image: url('./imgs/JD_bg_active.png');
      }
      .sf-logistics {
        background-image: url('./imgs/SF_bg.png');
        background-size: 100% 100%;
      }
      .sf-logistics.active {
        background-image: url('./imgs/SF_bg_active.png');
        background-size: 100% 100%;
      }
      .other-logistics {
        background-image: url('./imgs/other_bg.png');
        background-size: 100% 100%;
      }
      .other-logistics.active {
        background-size: 100% 100%;
        background-image: url('./imgs/other_bg_active.png');
      }
    }
    .icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      vertical-align: -4px;
    }
    .logistics-number {
      margin-top: 7px;
      ::-webkit-input-placeholder {
        color: #e5e5e5;
      }
      .vux-x-input {
        line-height: 22px;
        padding: 12px 0;
        margin-left: 15px;
      }
    }
  }
  .return-tips {
    color: #ff4754;
    font-size: 12px;
    line-height: 19px;
    padding: 15px;
  }
  .return-address {
    h4 {
      font-weight: normal;
      color: @color-h;
    }
    .address-detail {
      font-size: 14px;
      color: @gray-8;
      margin-top: 10px;
    }
    padding: 15px;
    margin: 15px 0;
    background-color: #fff;
  }
  .attention {
    width: 100%;
    background-color: @color-white;
    font-size: 0;
    vertical-align: -4px;
    .return-attention {
      font-size: 16px;
      line-height: 22px;
      padding: 15px;
      h4 {
        font-weight: normal;
        color: @color-h;
      }
      .attention-list {
        font-size: 14px;
        color: @gray-8;
        margin-top: 10px;
      }
    }
  }
  .btnPlane {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    .submitReturn-btn {
      background-color: @orange;
    }
    .weui-btn_loading.submitReturn-btn {
      background-color: @bg-orange;
      color: @gray-8 !important;
    }
  }
}
</style>


