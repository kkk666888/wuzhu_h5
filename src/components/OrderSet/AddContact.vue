<template>
  <div class="OrderSubmitPage">
    <!--订单详情信息-->
    <div class="orderInfoPlane OrderDetail_Shadow">
      <div class="OrderInputPlane">
        <StepDescBlock :stepDesc="stepDesc" :stepIndex="2">
        </StepDescBlock>
        <!-- <div class="stepDescBlock">
          <div class="left">还差2步：填写资料提交订单，最高免押20000
          </div>
          <div class="right">2<span class="gray">/4</span>
          </div>
        </div> -->
        <div class="orderdetail-tips">请填写真实有效联系人信息</div>
        <!-- app -->
        <section v-if="isWzapp" class="mt15">
          <group class="group-2">
            <x-input class="padding-address" :max="40" title="重要联系人" type="text" readonly :show-clear="false" placeholder="请选择联系人" text-align="left" v-model="emergencyApp1" @on-blur="inputNameChange" @on-change="inputChangeEvent">
              <span slot="right" class="add-contact" @click="addContact(1)">添加</span>
            </x-input>
            <popup-picker ref="emergency1" class="padding-address" title="所属关系" :showName="true" :data="shipData" v-model="emergencyShip" :placeholder="placeholder" value-text-align="right" @on-hide="inputShipChange"></popup-picker>
          </group>
          <group class="group-2 contact2">
            <x-input class="padding-address" :max="40" title="其他联系人" type="text" readonly :show-clear="false" placeholder="请选择联系人" text-align="left" v-model="emergencyApp2" @on-blur="inputNameChange" @on-change="inputChangeEvent">
              <span slot="right" class="add-contact" @click="addContact(2)">添加</span>
            </x-input>
            <popup-picker ref="emergency2" class="padding-address" title="所属关系" :showName="true" :data="shipData" v-model="emergencyShip2" :placeholder="placeholder" value-text-align="right" @on-hide="inputShipChange"></popup-picker>
          </group>
        </section>
        <!-- h5 -->
        <section v-else class="">
          <group class="group-2">
            <x-input class="padding-address" :max="20" title="紧急联系人1" type="text" :show-clear="false" placeholder="请填写紧急联系人" text-align="left" v-model="emergencyName" @on-blur="inputNameChange" @on-change="inputChangeEvent"></x-input>
            <x-input class="padding-address" :max="20" title="联系人电话" type="tel" :show-clear="false" placeholder="请填写紧急联系人电话" text-align="left" v-model="emergencyPhone" keyboard="number" is-type="china-mobile" @on-blur="inputPhoneChange" @on-change="inputChangeEvent"></x-input>
            <popup-picker ref="emergency1" class="padding-address" title="所属关系" :showName="true" :data="shipData" v-model="emergencyShip" :placeholder="placeholder" value-text-align="right" @on-hide="inputShipChange"></popup-picker>
          </group>
          <group class="group-2 contact2">
            <x-input class="padding-address" :max="20" title="紧急联系人2" type="text" :show-clear="false" placeholder="请填写紧急联系人" text-align="left" v-model="emergencyName2" @on-blur="inputNameChange" @on-change="inputChangeEvent"></x-input>
            <x-input class="padding-address" :max="20" title="联系人电话" type="tel" :show-clear="false" placeholder="请填写紧急联系人电话" text-align="left" v-model="emergencyPhone2" keyboard="number" is-type="china-mobile" @on-blur="inputPhoneChange" @on-change="inputChangeEvent"></x-input>
            <popup-picker ref="emergency2" class="padding-address" title="所属关系" :showName="true" :data="shipData" v-model="emergencyShip2" :placeholder="placeholder" value-text-align="right" @on-hide="inputShipChange"></popup-picker>
          </group>
        </section>
      </div>
    </div>
    <!--用户点击提交按钮部分-->
    <div class="submitPlane">
      <x-button @click.native="gotoNext">下一步</x-button>
    </div>
    <!--Toast展示对应的结果-->
    <toast v-model="showToast" type="text" width="20em">{{ toastContent }}</toast>
  </div>
</template>

<script>
import {
  Group,
  Cell,
  XButton,
  Flexbox,
  FlexboxItem,
  Actionsheet,
  Grid,
  GridItem,
  XInput,
  ChinaAddressV4Data,
  XTextarea,
  PopupPicker,
  Value2nameFilter as value2name,
  Toast,
  Alert
} from 'vux';
import './../../util/category.js';
import {
  isWzapp,
  isPhoneAvailable
} from './../../util/utils';
import StepDescBlock from '../../common/components/stepDescBlock/index.js';
import { mapMutations } from 'vuex';

export default {
  name: 'OrderSubmitPage',
  components: {
    Group,
    Cell,
    XButton,
    Flexbox,
    FlexboxItem,
    Actionsheet,
    Grid,
    GridItem,
    XInput,
    XTextarea,
    PopupPicker,
    Toast,
    Alert,
    StepDescBlock
  },
  data() {
    return {
      placeholder: '请选择',
      applySerialNo: '', // 预约申请号
      inputChangeFlag: false, // 用于标记input的change事件
      brisk: {
        // 埋点报文
        edittimes: [
          {
            type: 'contactname', // 紧急联系人修改次数
            times: 0
          },
          {
            type: 'contactphone', // 紧急联系人电话修改次数
            times: 0
          },
          {
            type: 'contactrelationship', // 紧急联系人关系修改次数
            times: 0
          }
        ],
        contactInfo: [] // 通讯录
      },
      userName: '',
      emergencyName: '', // 紧急联系人姓名
      emergencyPhone: '', // 紧急联系人电话
      emergencyName2: '', // 紧急联系人2姓名
      emergencyPhone2: '', // 紧急联系人2电话
      emergencyApp1: '', // 紧急联系人姓名+电话，只做显示。先赋值给emergencyName和emergencyPhone
      emergencyApp2: '', // 紧急联系人姓名+电话，只做显示。先赋值给emergencyName2和emergencyPhone2
      emergencyShip: [], // 紧急联系人关系
      emergencyShip2: [], // 紧急联系人2关系

      shipData: [], // 根据产品和风控需求，紧急联系人如下,其中微信公众号渠道隐藏2、3、10，但对应的code不能变，1.父母、2.子女、3.配偶、4.兄弟姐妹、5. 非直系亲属、6.朋友、7.同学、8. 室友、9.情侣、 10. 同事、11.其他
      needShipData: ['父母', '子女', '配偶', '兄弟姐妹'],
      showToast: false,
      toastContent: '',
      stepDesc: '',
      platformCode: this.$store.state.platformCode, // 平台号
      isWzapp: isWzapp()
    };
  },
  computed: {
    arrowShowTrailDetailClasssOject: function() {
      return {
        'icon iconfont icon-xia': !this.showTrailDetail,
        'icon iconfont icon-shang': this.showTrailDetail
      };
    }
  },
  created() {
    let that = this;
    console.log('channelNo=' + that.$store.state.channelNo);
    that.stepDesc = '还差2步：填写资料提交订单，最高免押20000';
    // that.stepDesc = (this.processType === '1') ? '还差2步：填写资料提交订单，最高免押20000' : '还差2步：填写资料提交订单，本单可免押599';
  },
  mounted: function() {
    this.$reporter.init(); // 埋点初始化
    // 强制将 vux-popup-picker-select 里面的对齐方式改成左对齐
    let addressElList = document.getElementsByClassName('vux-popup-picker-select');
    for (let i = 0; i < addressElList.length; i++) {
      let ele = addressElList[i];
      ele.style['text-align'] = 'left';
    }
    this.getShipData();
  },
  // 路由部分的处理，离开页面和进入页面的处理
  beforeRouteLeave(to, from, next) {
    // 判断下当前的状态来隐藏试算中的类
    if (this.showTrailDetail === true) {
      document.documentElement.classList.remove('alpha');
      this.showTrailDetail = false;
    }
    next();
  },
  methods: {
    ...mapMutations(['updateLoadingStatus', 'updateOrderNo']),
    // 软键盘弹起还原
    setWindowSize() {
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 100);
    },
    inputShipChange(res) {
      if (res) {
        this.brisk.edittimes[2].times++;
      }
    },
    // 紧急联系人电话修改次数
    inputPhoneChange() {
      if (this.inputChangeFlag) {
        this.brisk.edittimes[1].times++;
        this.inputChangeFlag = false;
      }
      this.setWindowSize();
    },
    // 紧急联系人修改次数
    inputNameChange() {
      if (this.inputChangeFlag) {
        this.brisk.edittimes[0].times++;
        this.inputChangeFlag = false;
      }
      this.setWindowSize();
    },
    // 获取地理位置信息，通过选定的数值改成对应的省市区
    getAddressArray(addressValue) {
      return value2name(addressValue, ChinaAddressV4Data);
    },
    // 添加联系人
    addContact(type) {
      if (type === 3) {
        // eslint-disable-next-line
        ap.choosePhoneContact(res => {
          console.log('choosePhoneContact res = ' + JSON.stringify(res));
          if (res.errorMessage) {
            this.showToastWithMessage(res.errorMessage);
          }
          this.emergencyName = res.name || '';
          this.emergencyPhone = res.mobile ? res.mobile.replace(/\s|-/g, '') : '';
          this.emergencyApp1 = `${this.emergencyName} ${this.emergencyPhone}`;
        });
      } else {
        let that = this;
        that.jsBridge.getOneContact(function(data) {
          console.log('getOneContact data = ' + data);
          if (data) {
            let jData = JSON.parse(data);
            if (jData) {
              that.getAllContact();
              if (type === 1) {
                that.emergencyName = jData.name;
                that.emergencyPhone = jData.phone;
                that.emergencyApp1 = that.emergencyName + ' ' + that.emergencyPhone;
              } else {
                that.emergencyName2 = jData.name;
                that.emergencyPhone2 = jData.phone;
                that.emergencyApp2 = that.emergencyName2 + ' ' + that.emergencyPhone2;
              }
            }
          }
        });
      }
    },
    // 获取通讯录
    getAllContact() {
      let that = this;
      if (!that.brisk.contactInfo || that.brisk.contactInfo.length === 0) {
        that.jsBridge.getContactInfo(function(data) {
          console.log('getContactInfo data = ' + data);
          if (data) {
            that.brisk.contactInfo = JSON.parse(data);
          }
        });
      }
    },
    // 弹窗
    showToastWithMessage(content) {
      this.toastContent = content;
      this.showToast = true;
    },
    // 判断下是否需要弹框 如果信息不完善弹出对应的提示
    // 返回是否OK  OK 就直接返回  true
    checkInfo() {
      // let that = this;

      // 紧急联系人1
      if (!this.checkName(this.emergencyName)) {
        return false;
      }
      if (!this.checkPhone(this.emergencyPhone)) {
        return false;
      }

      if (!this.emergencyShip.length) {
        this.showToastWithMessage('请选择您和紧急联系人的关系');
        return false;
      }

      // 紧急联系人2
      if (!this.checkName(this.emergencyName2)) {
        return false;
      }
      if (!this.checkPhone(this.emergencyPhone2)) {
        return false;
      }
      // 不能两个联系人选同一人
      if (this.emergencyPhone === this.emergencyPhone2) {
        this.showToastWithMessage('请勿添加相同的紧急联系人');
        return false;
      }
      if (!this.emergencyShip2.length) {
        this.showToastWithMessage('请选择您和紧急联系人的关系');
        return false;
      }

      // let name1 = this.$refs.emergency1.getNameValues();

      // if (this.needShipData.indexOf(name1) === -1) {
      //   this.showToastWithMessage('紧急联系人中必须是父母/子女/配偶/兄弟姐妹中的一个');
      //   return false;
      // }

      return true;
    },
    checkName(name) {
      console.log('checkName name = ' + name);
      if (!name) {
        this.showToastWithMessage('请输入您的联系人信息');
        return false;
      } else {
        // 紧急联系人姓名仅包含汉字和·
        let reg = /^[\u4e00-\u9fa5·]{2,12}$/i;
        if (!reg.test(name)) {
          this.showToastWithMessage('请输入正确的姓名，仅包含汉字和·，长度至少为2位');
          return false;
        }
        // 紧急联系人姓名不能与本人相同
        if (name === this.userName) {
          this.showToastWithMessage('联系人不能填写本人姓名');
          return false;
        }
      }
      return true;
    },
    checkPhone(phone) {
      if (!phone) {
        this.showToastWithMessage('请添加紧急联系人');
        return false;
      }
      if (!isPhoneAvailable(phone)) {
        this.showToastWithMessage('联系人手机号码格式错误(仅11位数字)或为不支持的号段，请检查');
        return false;
      } else {
        // 紧急联系人手机不能与本人相同
        if (phone === this.phoneNum) {
          this.showToastWithMessage('紧急联系人不能填写本人手机号');
          return false;
        }
      }
      return true;
    },
    // 测试onChange事件
    inputChangeEvent(event) {
      this.inputChangeFlag = true;
    },
    // 获取联系人关系数据
    getShipData() {
      this.$http
        .get('/wuzhu/common/queryRelationshipListByChannel', { channelNo: this.$store.state.channelNo })
        .then(res => {
          if (res.code === '00') {
            if (res.data && res.data.length > 0) {
              this.shipData = [];
              let data = [];
              res.data.forEach(item => {
                data.push({ name: item.relationShipName, value: String(item.relationShipCode) });
              });
              this.shipData.push(data);
              // 判断是否存在(getCacheData方法里有对this.emergencyShip赋值)
              if (this.emergencyShip.length > 0) {
                let isExist = false;
                let shipValue = this.emergencyShip[0];
                for (var i in res.data) {
                  if (String(res.data[i].relationShipCode) === shipValue) {
                    isExist = true;
                    break;
                  }
                }
                if (!isExist) {
                  this.emergencyShip = [];
                }
              }
              if (this.emergencyShip2.length > 0) {
                let isExist = false;
                let shipValue = this.emergencyShip2[0];
                for (var j in res.data) {
                  if (String(res.data[j].relationShipCode) === shipValue) {
                    isExist = true;
                    break;
                  }
                }
                if (!isExist) {
                  this.emergencyShip2 = [];
                }
              }
            }
          }
        });
    },
    createPhoneRepertory() {
      let that = this;
      that.$store.commit('updateLoadingStatus', { isLoading: true });
      let url = '/wuzhu/customerVerController/createPhoneRepertory';
      // 获取联系人关系
      let emergencyShipIndex = parseInt(this.emergencyShip[0]);
      let emergencyShipIndex2 = parseInt(this.emergencyShip2[0]);
      // 请求的参数
      let param = {
        listphoneReper: [
          {
            emergencyContact: that.emergencyName,
            emergencyContactNo: that.emergencyPhone,
            emergencyContactRelation: emergencyShipIndex
          },
          {
            emergencyContact: that.emergencyName2,
            emergencyContactNo: that.emergencyPhone2,
            emergencyContactRelation: emergencyShipIndex2
          }
        ],
        contacts: JSON.stringify(that.brisk.contactInfo)
      };
      that.$http.post(url, param).then(res => {
        if (res.code === '00') {
          that.$router.replace({ name: 'LivenessVerify' });
        } else {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          that.$vux.toast.text(res.msg);
        }
      });
    },
    gotoNext() {
      // 迭代2.12.0 跳转到活体检测
      if (this.checkInfo()) {
        this.createPhoneRepertory();
      }
    }
  }
};
</script>

<style lang="less">
@import './../../common/less/index';
/*为了解决移动端滑动穿透而引入*/
// 移动穿透类
.alpha {
  height: 100%;
}

.alpha body #app {
  height: 100%;
  overflow: hidden;
}

.OrderSubmitPage {
  background: @bg;
  font-family: 'PingFang SC';
  position: relative;
  overflow: scroll;

  /*修改地址栏部分的样式*/
  .weui-cell {
    padding: 0 15px !important;
  }
  .padding-address .weui-cell__hd {
    width: 95px;
    height: 54px;
    margin-right: 10px;
    line-height: 54px;
  }

  .orderdetail-tips {
    font-size: 14px;
    color: #888888;
    background:#F1F1F1;
    padding: 10px 15px;
    line-height: 20px;
  }
  /*// 需要用户确认的表单信息*/
  .orderInfoPlane {
    background: #fff;
    .orderSubmit-flexBox {
      display: flex;
      font-size: 16px;
      color: #000000;
      .flexBox-left {
        width: 95px;
        margin-right: 10px;
      }
      .customer-info {
        .weui-cell {
          padding: 0;
        }
        .weui-cells:after {
          border-bottom: 0;
        }
      }
    }
    .weui-cells {
      margin-top: 0;
      padding: 0px !important;
    }
    .weui-cells:before {
      border-top: none;
    }
    .orderInfoBase {
      .bb1 {
        border-bottom: 1px solid rgba(217, 217, 217, 0.56);
        padding: 12px 15px 12px 0;
        margin: 0;
        margin-left: 18px;
      }
    }
    .OrderInputPlane {
      .stepDescBlock {
        background-size: 50% 100% !important;
      }
      background: @bg;
      .weui-cells {
        &:after {
          border-bottom: none;
        }
      }
      // 请选择文字的设置
      .vux-popup-picker-placeholder {
        color: #bbbbbb;
        font-size: 16px;
      }
      .group-2 {
        margin-bottom: 15px;
        &:nth-child(odd) {
          margin-top: 1px;
        }
        .add-contact {
          font-size: 16px;
          color: #1890ff;
        }
        &.contact2 {
          margin-top: 2px;
        }
      }
      .weui-label {
        font-size: 16px;
        color: #222222;
        letter-spacing: 0;
      }
      textarea {
        font-size: 16px;
        color: #222222;
        letter-spacing: 0;
      }
      textarea::-webkit-input-placeholder {
        font-size: 16px;
        letter-spacing: 0;
        color: #bbbbbb;
      }
      input {
        font-size: 16px;
        color: #222222;
        letter-spacing: 0;
      }
      input::-webkit-input-placeholder {
        font-size: 16px;
        letter-spacing: 0;
        color: #888888;
      }
      .vux-cell-value {
        font-size: 16px;
        color: #222222;
        letter-spacing: 0;
      }
    }
  }
  /*用户点击提交按钮部分*/
  .submitPlane {
    margin: 26px 18px auto 18px;
    overflow: auto;
    .weui-btn_primary {
      border: 1px solid #9b9b9b;
      border-radius: 100px;
      background: white;
      margin-right: 10px;
    }
    .weui-btn {
      background: #ffda29 !important;
      color: #222222;
      height: 48px;
      border-radius:6px;
      font-size: 18px !important;
      text-align: center !important;
    }
    .weui-btn:after {
      border: none;
    }
  }
}
</style>
