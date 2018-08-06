<template>
  <div class="WriteLogisticsInfo">
    <!-- <div> -->
    <goods-header :goodListImage="goodListImage" :fullName="fullName" :marketPrice="marketPrice" :listCommoditySpec="listCommoditySpec"></goods-header>
    <!-- 寄回信息 -->
    <div class="return-info">
      <p class="address-title">请选择物流公司</p>
      <div class="cutline vux-1px-t"></div>
      <div class="choose-logistics" @click="chooseLogistics">
        <span class="logistics-button" data-companycode="1" id="jd">
          <img src="./icon_JD.png" class="icon icon-normal" alt="jd">
          <img src="./icon_JD-hover.png" class="icon icon-active" alt="jd"> 京东物流
        </span>
        <span class="logistics-button" data-companycode="2" id="sf">
          <img src="./icon_SF.png" class="icon icon-normal" alt="sf">
          <img src="./icon_SF-hover.png" class="icon icon-active" alt="sf"> 顺丰物流
        </span>
      </div>
      <div class="logistics-number vux-1px-t vux-1px-b">
        <!--添加group会出现线条-->
        <!--<group>-->
        <x-input title="物流单号" v-model="deliveryOrderNo" :is-type="logisticsNo" placeholder="请输入物流编号"></x-input>
        <!--</group>-->
      </div>
      <div class="btnPlane">
        <x-button type="primary" :disabled="returnBtnDisabled" :show-loading="returnBtnDisabled" class="submitReturn-btn" action-type="button" @click.native="applyReturnNote">提交</x-button>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>
<script>
import { XButton, XInput, Group } from 'vux';
import GoodsHeader from './GoodsDetailHeader';
export default {
  name: 'WriteLogisticsInfo',
  data() {
    return {
      returnApplyNoteUrl: 'wuzhu/returnApplyNote/createReturnApplyNote',
      getGoodsInfoUrl: '/wuzhu/vendor/getVendorReciveAddress',
      getOrderDetailUrl: '/wuzhu/order/getOrderDetail',
      returnBtnDisabled: false,
      listCommoditySpec: [],
      goodListImage: '',
      fullName: '',
      marketPrice: null,
      expressCompanyCode: '', // 物流公司编号 1、京东，2、顺丰
      deliveryOrderNo: '', //  物流单号
      returnReasonStyle: '0', // 归还原因 0、完结归还，1、维修归还，2、退货归还
      applyReturnDate: null, // 上门归还预约时间
      returnStationOid: '', // 回收站点Oid
      returnStyle: '0', // 归还方式 0、自寄，1、逆向物流，2、上门归还，3、上门维修
      logisticsNo: function(value) {
        let reg = /^[a-z0-9]+$/i;
        return {
          valid: reg.test(value),
          msg: '请输入正确物流单号'
        };
      }
    };
  },
  components: {
    XButton,
    XInput,
    GoodsHeader,
    Group
  },
  props: {},
  computed: {},
  created() {},
  mounted() {
    this.getGoodsInfo();
    this.addFooterColor();
  },
  methods: {
    // 填充底部颜色
    addFooterColor() {
      this.$nextTick(() => {
        let body = document.body.offsetHeight;
        let current = document.querySelector('.WriteLogisticsInfo').offsetHeight;
        if (body > current) {
          let bottom = body - current - 40;
          document.querySelector('.return-info').style.paddingBottom = 40 + 'px';
          document.querySelector('.submitReturn-btn').style.marginTop = bottom + 'px';
        } else {
          document.querySelector('.return-info').style.paddingBottom = 40 + 'px';
        }
      });
    },
    // 获取商品信息和供应商地址信息
    async getGoodsInfo() {
      let param = {
        orderNo: this.$store.state.goodsReturnOrderNo
      };
      try {
        this.$store.commit('updateLoadingStatus', { isLoading: true });
        let [goodsRes, addressRes] = await Promise.all([
          this.$http.get(this.getOrderDetailUrl, param),
          this.$http.get(this.getGoodsInfoUrl, param)
        ]);
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        if (goodsRes.code === '00') {
          let data = goodsRes.data.commodity;

          this.fullName = data.fullName;
          this.marketPrice = data.marketPrice;
          this.goodListImage = data.listImg;
          this.listCommoditySpec = data.specContentList.split(',');
        } else {
          this.$vux.alert.show(goodsRes.msg);
        }

        if (addressRes.code === '00') {
          let res = addressRes.data;
          this.returnStationOid = res.returnStationOid;
        } else {
          this.$vux.alert.show(addressRes.msg);
        }
      } catch (error) {
        this.$vux.alert.show(error.message);
        console.log(error);
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
            this.$vux.toast.show('提交成功');
            this.$router.push({ name: 'OrderListPage' });
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
.WriteLogisticsInfo {
  .whiteWrap {
    background: white;
  }

  background: #f5f5f5;
  .return-wrap {
    background-color: #f5f5f5;
  }
  .address-title {
    font-size: 16px;
    color: @color-h;
    padding: 10px 15px;
    line-height: 22px;
  }
  .cutline {
    border-color: #ddd;
  }
  .return-info {
    margin-top: 10px;
    background-color: @color-white;
    .choose-logistics {
      padding: 40px 0;
      .logistics-button {
        .f14;
        margin-left: 15px;
        padding: 7px;
        color: @gray-8;
        line-height: @lh-20;
        display: inline-block;
        border: 1px solid #ddd;
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
    }
    .icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      vertical-align: -4px;
    }
    .logistics-number {
      padding: 3px 0;
      ::-webkit-input-placeholder {
        color: #e5e5e5;
      }
    }
    .btnPlane {
      padding: 100px 15px 0 15px;
    }
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
<style>
