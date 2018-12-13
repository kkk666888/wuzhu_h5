<template>
<!-- 改版后的订单提交页面，适用于微信、京东、App渠道，支付宝生活号渠道还是OrderSubmitPage.vue -->
  <div class="OrderSubmitPage">
    <!--头部信息-->
    <div class="header OrderDetail_Shadow">
      <!--商品详情的信息-->
      <div class="goodsDetial">
        <div class="goodsImgDiv">
          <img class="goodsImage" :src="goodListImage" />
        </div>
        <div class="goodsInfoPlane">
          <div class="fullName">{{ fullName }}</div>
          <!-- <div class="markPrice">商品价值:{{ markPrice }}元</div> -->
          <div class="categoryList">
            <span class="categoryListItem" v-for="(specItem, specIndex) in listCommoditySpec" :key="specIndex">{{ specItem.specContent }}
              <span v-if="specIndex < listCommoditySpec.length-1">/</span>
            </span>
          </div>
        </div>
      </div>
      <div class="feePlane">
        <div class="feeCell">
          <div class="feeName">租金</div>
          <div class="feeValue">￥{{ rentForOneDay }}/天    *{{ tenancyTerm }}天</div>
        </div>
        <div class="feeTips">*租金支持<span class="feeTipsBold">按月支付</span>或<span class="feeTipsBold">一次性支付</span>
        </div>
        <div class="feeCell gray" v-for="(feeItem, feeIndex) in feeList" :key="feeIndex">
          <div class="feeName">{{ feeItem['feeName'] }}
          </div>
          <div class="feeValue">{{ feeItemItemDesc(feeItem) }}</div>
        </div>
      </div>

      <div class="depositBlock">
        <div class="feeCell">
          <div class="feeName">押金
            <!-- <span class="depositBlue">可退</span> -->
          </div>
          <div class="feeValue gray">￥{{ deposit | moneyFormat }}</div>
        </div>
        <!-- <div class="feeCell">
          <div class="feeName">押金支付方式</div>
        </div> -->
        <div class="depositDetail">
          <div class="depositTitle">{{ depositPayName }}</div>
          <div class="depositDesc">{{ depositPayDesc }}</div>
        </div>
      </div>
    </div>
    <!-- 收货信息-->
    <div class="orderInfoPlane OrderDetail_Shadow">
      <div class="orderInfoBase">
      <div class="orderSubmit-flexBox bb1">请确认收货地址</div>
        <div class="orderSubmit-flexBox bb1">
          <div class="flexBox-left">姓名</div>
          <group class="customer-info">
            <x-input :max="20" class="info-input needsclick" :readonly="hasUserName" type="text" :show-clear="false" v-model="userName" ref="input01" @on-blur="setWindowSize" placeholder="请输入" @on-focus="focusName" @on-change="changeUserName"></x-input>
          </group>
        </div>
        <div class="orderSubmit-flexBox bb1">
          <div class="flexBox-left">手机号</div>
          <group class="customer-info">
            <x-input :max="20" title="" class="info-input needsclick" type="text" v-model="phoneNum" :show-clear="false" :readonly="hasPhoneNum" @on-blur="setWindowSize" placeholder="请输入" keyboard="number" is-type="china-mobile"></x-input>
          </group>
        </div>
        <!-- <div class="orderSubmit-flexBox bb1" v-if="isAlipayLife">
          <div class="flexBox-left">身份证号</div>
          <group class="customer-info">
            <x-input title="" class="info-input needsclick" type="text" v-model="certId" :readonly="hasCertId" :show-clear="false" @on-blur="setWindowSize" placeholder="请输入"></x-input>
          </group>
        </div> -->
      </div>
      <div class="OrderInputPlane">
        <group>
          <x-address class="padding-address" title="省/市/区" :placeholder="placeholder" v-model="addressArea" raw-value :list="addressData" @on-hide="inputAddrChange"></x-address>
          <x-textarea class="needsclick" :max="100" :placeholder="addressPlaceHolder" :show-counter="false" :rows="2" v-model="addressDetail" @on-blur="inputAddrDetailChange" autosize></x-textarea>
        </group>
        <!-- <div class="orderdetail-tips">添加紧急联系人（紧急联系人仅用于意外失联情况，请填写真实有效的联系人信息）</div>
        <section v-if="isWzapp" class="mt15">
          <group class="group-2">
            <x-input class="padding-address" title="重要联系人" type="text" readonly :show-clear="false" placeholder="请选择联系人" text-align="left" v-model="emergencyApp1" @on-blur="inputNameChange" @on-change="inputChangeEvent">
              <span slot="right" class="add-contact" @click="addContact(1)">添加</span>
            </x-input>
            <popup-picker ref="emergency1" class="padding-address" title="所属关系" :showName="true" :data="shipData" v-model="emergencyShip" :placeholder="placeholder" value-text-align="right" @on-hide="inputShipChange"></popup-picker>
          </group>
          <group class="group-2 contact2">
            <x-input class="padding-address" title="其他联系人" type="text" readonly :show-clear="false" placeholder="请选择联系人" text-align="left" v-model="emergencyApp2" @on-blur="inputNameChange" @on-change="inputChangeEvent">
              <span slot="right" class="add-contact" @click="addContact(2)">添加</span>
            </x-input>
            <popup-picker ref="emergency2" class="padding-address" title="所属关系" :showName="true" :data="shipData" v-model="emergencyShip2" :placeholder="placeholder" value-text-align="right" @on-hide="inputShipChange"></popup-picker>
          </group>
        </section>
        <section v-else-if="isAlipayLife" class="mt15">
          <group class="group-2">
            <x-input class="padding-address" title="紧急联系人" type="text" readonly :show-clear="false" placeholder="请选择联系人" text-align="left" v-model="emergencyApp1" @on-blur="inputNameChange" @on-change="inputChangeEvent">
              <span slot="right" class="add-contact" @click="addContact(3)">添加</span>
            </x-input>
          </group>
        </section>
        <section v-else class="">
          <group class="group-2">
            <x-input class="padding-address" title="重要联系人" type="text" :show-clear="false" placeholder="请填写重要联系人(必填)" text-align="left" v-model="emergencyName" @on-blur="inputNameChange" @on-change="inputChangeEvent"></x-input>
            <x-input class="padding-address" title="联系人电话" type="tel" :show-clear="false" placeholder="请填写重要联系人电话" text-align="left" v-model="emergencyPhone" keyboard="number" is-type="china-mobile" @on-blur="inputPhoneChange" @on-change="inputChangeEvent"></x-input>
            <popup-picker ref="emergency1" class="padding-address" title="所属关系" :showName="true" :data="shipData" v-model="emergencyShip" :placeholder="placeholder" value-text-align="right" @on-hide="inputShipChange"></popup-picker>
          </group>
          <group class="group-2 contact2">
            <x-input class="padding-address" title="其他联系人" type="text" :show-clear="false" placeholder="请填写联系人(必填)" text-align="left" v-model="emergencyName2" @on-blur="inputNameChange" @on-change="inputChangeEvent"></x-input>
            <x-input class="padding-address" title="联系人电话" type="tel" :show-clear="false" placeholder="请填写联系人电话" text-align="left" v-model="emergencyPhone2" keyboard="number" is-type="china-mobile" @on-blur="inputPhoneChange" @on-change="inputChangeEvent"></x-input>
            <popup-picker ref="emergency2" class="padding-address" title="所属关系" :showName="true" :data="shipData" v-model="emergencyShip2" :placeholder="placeholder" value-text-align="right" @on-hide="inputShipChange"></popup-picker>
          </group>
        </section> -->
      </div>
    </div>

    <!-- <div class="messageBoard">
      <div class="feeCell mb13">
        <div class="feeName">留言板</div>
      </div>
      <div class="messageDetail">
        <x-textarea class="needsclick messageText" :max="100" :placeholder="messageHolder" :show-counter="false" v-model="leaveMessage" @on-blur="inputMessageChange" autosize></x-textarea>
      </div>
    </div> -->

    <!--用户协议部分-->
    <div class="protocolPlane">
      <div v-bind:class="agreementClass" @click="agreementClick"></div>
      <p>
        <span class="protocolPlane_normal">我已阅读并同意</span>
        <span class="protocolPlane_protocol" v-for="(protocolItem, protocolIndex) in pdfFileList" :key="protocolIndex" @click="protocolClick(protocolIndex, protocolItem)">{{ protocolItem }}</span>
      </p>
    </div>
    <!--用户点击提交按钮部分-->
    <!-- <div class="submitPlane">
      <x-button @click.native="subOrderClick">提交资料</x-button>
    </div> -->

    <div class="bottomBlock">
      <div class="leftBlock">
        <div class="bottomDeposit">商品押金：
          <div class="bottomDepositAmt">￥{{ deposit | moneyFormat}}
          </div>
        </div>
        <div class="bottomTips">{{ bottomTips }}</div>
      </div>
      <div class="rightBlock" @click="submitClick"> {{ processType === '1' ? '提交订单' : '提交资料'}}</div>
    </div>
    <!--用来显示协议部分插件-->
    <html-pannel :showScrollBox="potocolShow" :protocolTitle="potocolTitle" :url="potocolUrl" @sureBtnClick="potocolSureClick"></html-pannel>
    <!--Toast展示对应的结果-->
    <alert v-model="alertShow" :title="alertTitle" :content="alertContent"></alert>
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
  XAddress,
  XTextarea,
  PopupPicker,
  Value2nameFilter as value2name,
  Toast,
  Alert
} from 'vux';
import feeTrialTable from './../FeeItemSubView/FeeTrialTable';
import './../../util/category.js';
import {
  GetLocation,
  GetWXLocation,
  GetBaiduGps,
  isWzapp,
  isPhoneAvailable,
  // AliLifeLogin,
  isAlipayLife,
  piwikTrackEvent,
  unionLogin
} from './../../util/utils';
import userLeaseServiceAgreements from './../Potocol/UserLeaseServiceAgreements';
import feeDescAlert from './../FeeItemSubView/FeeDescAlert';
import userLeaseServiceAdditionalAgree from './../Potocol/UserLeaseServiceAdditionalAgree';
import { ReportData } from './../../util/ReportData';
import { getFeeDescStr } from './../../wuzhuUtil/wuzhuUtil';
import htmlPannel from './../FeeItemSubView/HtmlPannel';
import feeTrialTableNew from './../FeeItemSubView/FeeTrialTableNew';
import { mapMutations } from 'vuex';

export default {
  name: 'OrderSubmitPage',
  components: {
    userLeaseServiceAgreements,
    userLeaseServiceAdditionalAgree,
    Group,
    Cell,
    XButton,
    Flexbox,
    FlexboxItem,
    Actionsheet,
    Grid,
    GridItem,
    feeTrialTable,
    XInput,
    ChinaAddressV4Data,
    XAddress,
    XTextarea,
    PopupPicker,
    Toast,
    Alert,
    feeDescAlert,
    htmlPannel,
    feeTrialTableNew
  },
  data() {
    return {
      placeholder: '请选择',
      rentForOneDay: '', // 日均租金
      applySerialNo: '', // 预约申请号
      depositPayName: '', // 押金支付方式名称,后续会有多种
      depositPayDesc: '', // 押金支付方式描述,后续会有多种
      processType: '',
      bottomTips: '',
      inputChangeFlag: false, // 用于标记input的change事件
      brisk: {
        // 埋点报文
        edittimes: [
          {
            type: 'delivery_area', // 收货地址省市区修改次数
            times: 0
          },
          {
            type: 'delivery', // 收货地址详细地址修改次数
            times: 0
          }
        ],
        contactInfo: [] // 通讯录
      },
      serviceAgreet: null, // 埋点数据
      additionalAgreet: null,
      userChooseFinancialProduct: {}, // 用户选择的金融产品
      userChooseGood: {}, // 用户选择的具体商品
      userChooseFeeList: {}, // 用户选择的费用列表
      additionalFeeList: {}, // 用户必选的费用列表

      fullName: '',
      markPrice: '', // 市场价格
      listCommoditySpec: [], // 用户选择的列表
      tenancyTerm: '', // 租期
      finicalSpec: '',
      deposit: '', // 押金
      feeList: [], // 费用列表
      JDCoin: '', // 京东小白分
      goodListImage: '',
      showTrailDetail: false,
      feeTrialList: [],
      userName: '',
      hasUserName: false,
      phoneNum: '',
      hasPhoneNum: false,
      certId: '',
      hasCertId: '',
      emergencyName: '', // 紧急联系人姓名
      emergencyPhone: '', // 紧急联系人电话
      emergencyName2: '', // 紧急联系人2姓名
      emergencyPhone2: '', // 紧急联系人2电话
      emergencyApp1: '', // 紧急联系人姓名+电话，只做显示。先赋值给emergencyName和emergencyPhone
      emergencyApp2: '', // 紧急联系人姓名+电话，只做显示。先赋值给emergencyName2和emergencyPhone2
      addressArea: [],
      detailAddress: '',
      emergencyShip: [], // 紧急联系人关系
      emergencyShip2: [], // 紧急联系人2关系
      addressData: ChinaAddressV4Data,
      addressPlaceHolder: '请输入收货详细地址，审核通过后不可修改',
      addressDetail: '',
      messageHolder: '还有什么要交代我的吗？尽管留言好啦...',
      shipData: [], // 根据产品和风控需求，紧急联系人如下,其中微信公众号渠道隐藏2、3、10，但对应的code不能变，1.父母、2.子女、3.配偶、4.兄弟姐妹、5. 非直系亲属、6.朋友、7.同学、8. 室友、9.情侣、 10. 同事、11.其他
      needShipData: ['父母', '子女', '配偶', '兄弟姐妹'],
      pdfFileList: ['《 用户租赁及服务协议》', '《用户租赁及服务协议之补充协议》'],
      potocolTitle: '用户租赁及服务协议',
      potocolContent: '',
      potocolShow: false,
      potocolUrl: '',
      potocolChooseIndex: -1,
      showToast: false,
      toastContent: '',

      alertShow: false, // 通过alert的形式展示弹框
      alertTitle: '',
      alertContent: '',
      trialTableGetAlready: false, // 用来标记是否已经获取过试算列表
      htmlScrollTop: 0, // 标准流滚动的距离
      curDate: '', // 试算列表中当前时间 Date对象
      myDate: '', // 试算列表中的预计收货时间 Date对象
      getLocationAlready: false, // 必须要获取用户的地理位置信息才能确认预约
      wxReady: false, //  后续需要将该状态默认改成 flase 这样强制让用户获取地理位置信息
      jsApiList: ['getLocation'],
      gpsLongitude: '', // 经纬度信息的缓存
      gpsLatitude: '',
      platformCode: this.$store.state.platformCode, // 平台号
      isWzapp: isWzapp(),
      isAlipayLife: isAlipayLife(),
      leaveMessage: '',
      agreementChoose: true
    };
  },
  computed: {
    agreementClass: function() {
      let agreementChoose = this.agreementChoose;
      return {
        'feeNorCir': !agreementChoose,
        'feeSelCir': agreementChoose
      };
    }
  },
  created() {
    let that = this;
    console.log('channelNo=' + that.$store.state.channelNo);
    that.serviceAgreet = new ReportData({
      pagein: 'null',
      pagecnname: '用户租赁及服务协议',
      pagename: 'agreement'
    });
    that.additionalAgreet = new ReportData({
      pagein: 'null',
      pagecnname: '用户租赁及服务协议之补充协议',
      pagename: 'agreement'
    });
  },
  mounted: function() {
    this.openCityArr = []; // 保存开业城市
    this.getOpenCities();
    this.$reporter.init(); // 埋点初始化
    // 强制将 vux-popup-picker-select 里面的对齐方式改成左对齐
    let addressElList = document.getElementsByClassName('vux-popup-picker-select');
    if (addressElList) {
      for (let i = 0; i < addressElList.length; i++) {
        let ele = addressElList[i];
        ele.style['text-align'] = 'left';
      }
    }
    this.getCacheData(() => {
      // this.getShipData();
      if (this.isAlipayLife) {
        this.emergencyName = '';
        this.emergencyPhone = '';
      }
    });
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
      console.log('name', this.userName);
      if (!this.userName) {
        this.userName = this.$refs.input01.$refs.input.value;
      }
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 100);
    },
    focusName(val) {
      console.log('focus', val);
      console.log(this.$refs.input01.$refs.input.value);
    },
    changeUserName(val) {
      if (!this.userName) {
        this.userName = this.$refs.input01.$refs.input.value;
      }
      console.log('change', val, this.userName);
    },
    // 从后台获取订单相关数据
    getCacheData(callback) {
      let that = this;
      let _brickSessionStore = that.serviceAgreet.getSessionStore();
      console.log('byno = ' + _brickSessionStore.byno);
      // 获取对应的商品详情页面 GET /reservationController/getCommodityFromSession  http://192.168.2.8:9093
      let getDoodsDetailFromSessionUrl = '/wuzhu/reservationController/getCachData';
      // 从localStorage里面拿到对应的applyNo
      let applySerialNo = that.$store.state.applySerialNo;
      // TODO 测试
      // that.$store.commit('tokenMemory', { token: 'Token_395d5c5d17434ef1b58b6d69b09b6225' });
      // applySerialNo = '00320181211142011734867942';

      console.log('applySerialNo = ' + applySerialNo);
      that.applySerialNo = applySerialNo;
      if (!applySerialNo) {
        return;
      }
      // 请求的参数
      let param = {
        applySerialNo: applySerialNo
      };
      that.$store.commit('updateLoadingStatus', { isLoading: true });
      that.$http.get(getDoodsDetailFromSessionUrl, param).then(res => {
        that.$store.commit('updateLoadingStatus', { isLoading: false });
        if (res.code === '00') {
          let data = res['data'];
          that.parseJsonStrFromSession(data);
        } else {
          that.$vux.confirm.show({
            content: res.msg
            // onConfirm() {
            //   that.$router.replace({ name: 'HomePage' });
            // },
            // onCancel() {
            //   that.$router.replace({ name: 'HomePage' });
            // }
          });
        }
        if (callback && callback instanceof Function) {
          callback();
        }
      });
    },
    // 弹窗提示
    showDetail(type) {
      switch (type) {
        case 1:
          this.$vux.alert.show({
            title: '信用免押',
            content: '根据您的芝麻信用，可获取相应额度的免押服务。<br> 点击页面下方“免押授权”按钮，查看免押额度。'
          });
          break;
        case 2:
          this.$vux.alert.show({
            title: '花呗冻结押金',
            content: '使用花呗额度冻结押金，订单完结后，额度将自动解冻。'
          });
          break;
        case 3:
          this.$vux.alert.show({
            title: '支付宝授权',
            content: '租金将每月定期从您支付宝账户中自动代扣。优先从已冻结押金中扣款。'
          });
          break;
        default:
          break;
      }
    },
    // 当失败的时候从store中获取地理位置信息
    getLocationFromStore() {
      let that = this;
      // 判断下当前的app是否已经拿到了地理位置
      let lng = that.$store.state.lng;
      let lat = that.$store.state.lat;
      if (lng !== '' && lat !== '') {
        that.longitude = lng;
        that.latitude = lat;
        that.getLocationAlready = true;
      }
    },
    // 收货地址详细地址修改次数
    inputAddrDetailChange() {
      if (this.inputChangeFlag) {
        this.brisk.edittimes[1].times++;
        this.inputChangeFlag = false;
      }
      this.setWindowSize();
    },
    // 留言板修改次数
    inputMessageChange() {
      this.setWindowSize();
    },
    // 收货地址省市区修改次数
    // res 点击 “完成” 为 true, "取消" 为 false
    inputAddrChange(res) {
      // 分析下当前城市是否满足开业城市要求
      // console.log('>>> inputAddrChange', res);
      if (res) {
        this.checkAddressAvailable();
      }
      if (res) {
        this.brisk.edittimes[0].times++;
      }
    },
    //  是否是开业城市检查
    //  目前开业的城市：郑州市、武汉市、南京市、合肥市、太原市、济南市、上海市、长沙市
    //  提示客户只可以选择 以上五个开业城市的作为收货地址。
    checkAddressAvailable() {
      let address = this.getAddressArray(this.addressArea);
      let addressArray = address.split(' ');
      let provice = addressArray[0];
      let city = addressArray[1];
      let realCity = city;
      if (city === '市辖区') {
        // 说明是直辖市
        realCity = provice;
      }

      let result = this.checkCity(realCity);

      if (result) {
        return true;
      } else {
        this.alertTitle = '温馨提示';
        // 修改提示为未开放城市
        this.alertContent = '目前暂未开放：' + realCity + ',请选择其他城市作为收货地址';
        this.alertShow = true;
        return false;
      }
    },
    // 获取地理位置信息，通过选定的数值改成对应的省市区
    getAddressArray(addressValue) {
      return value2name(addressValue, ChinaAddressV4Data);
    },
    // 解析Storage里面返回的数据
    parseJsonStrFromSession(data) {
      console.log('parseJsonStrFromSession data = ', data);
      // 解析押金支付方式
      // 授信流程或支用流程
      let processType = '';
      let amountExemption = '';
      if (data && data.recivingInfo) {
        let listStyle = data.recivingInfo.listStyle;
        if (listStyle && listStyle.length > 0) {
          for (let index = 0; index < listStyle.length; index++) {
            const element = listStyle[index];
            // 001-免押授信申请
            if (element && element.styleCode === '001') {
              // Y表示支用流程
              if (element.isDisburse === 'Y') {
                amountExemption = element.amountExemption
                processType = '1';
              } else {
              }
              // 押金支付方式名称及描述
              this.depositPayName = element.styleDesc;
              this.depositPayDesc = element.explain;
            }
          }
        }
        this.leaveMessage = data.recivingInfo.leaveMessage;
        this.userName = data.recivingInfo.reciveName;
        this.hasUserName = !!this.userName;
      }
      if (processType === '1') {
        this.bottomTips = '本单可免押¥' + parseFloat(amountExemption).toFixed(2);
      } else {
        this.bottomTips = '提交资料，可减免押金';
      }
      sessionStorage.setItem('processType', processType);
      sessionStorage.setItem('amountExemption', amountExemption);
      this.processType = processType;

      // 开始配置用户测试数据
      let userChooseJsonStr = data && data.commodityJsonStr;
      let userChooseData = JSON.parse(userChooseJsonStr);
      // let userChooseData = JSON.parse(userChooseJson.commodityStr);
      console.log('parseJsonStrFromSession userChooseData = ' + JSON.stringify(userChooseData));
      // 用户选择的配置信息
      this.fullName = userChooseData && userChooseData.fullName;
      this.rentForOneDay = userChooseData && userChooseData['leaseForOneDayPrice'];
      this.goodListImage = userChooseData.listImage;
      this.listCommoditySpec = userChooseData.userChooseCategoryList;
      this.userChooseFinancialProduct = userChooseData.userChooseFinancialProduct;
      this.userChooseGood = userChooseData.userChooseGood;
      this.markPrice = this.userChooseGood['marketPrice'];
      this.deposit = this.userChooseGood['performanceBond'];
      this.tenancyTerm = this.userChooseFinancialProduct['totalDays'];
      this.JDCoin = data && data['jdscore'];
      if (!this.userName) {
        this.userName = data && data['customerName'];
        this.hasUserName = !!this.userName;
      }
      this.phoneNum = data && data['phoneNumber'];
      this.hasPhoneNum = !!data['phoneNumber'];
      this.certId = data && data['certId'];
      this.hasCertId = !!data['certId'];
      // 用户选择的费用列表
      // let additionFeeInfoListStr = userChooseData && userChooseData['additionFeeInfo']
      // let userChooseFeeInfoListStr = userChooseData && userChooseData['userChooseFeeInfo']
      // 这里会包含所有的该金融产品的费用列表
      let additionFeeInfoList = data && data['additionFeeInfo'];
      let tempFeeList = [];
      // 判断下是否是属于字符串
      if (additionFeeInfoList && additionFeeInfoList instanceof Array) {
        for (let i = 0; i < additionFeeInfoList.length; i++) {
          let feeItem = additionFeeInfoList[i];
          tempFeeList.push(feeItem); // 根据用户的选择加入
        }
      }
      // 这里会包含所有的该金融产品的费用列表
      let userChooseFeeInfoList = data && data['userChooseFeeInfo'];
      if (userChooseFeeInfoList && userChooseFeeInfoList instanceof Array) {
        for (let i = 0; i < userChooseFeeInfoList.length; i++) {
          let feeItem = userChooseFeeInfoList[i];
          tempFeeList.push(feeItem); // 根据用户的选择加入
        }
      }
      this.feeList = tempFeeList;
      this.userChooseFeeList = userChooseFeeInfoList;
      // 紧急联系人相关信息 phoneRepertoryVO
      // 如果是app环境，则不回填联系人信息，每次都要选择  tapd:1000886
      if (!isWzapp(this)) {
        let phoneRepertoryVO = data && data['phoneRepertoryVO'];
        if (phoneRepertoryVO) {
          if (phoneRepertoryVO[0]) {
            let tmp = phoneRepertoryVO[0];
            this.emergencyName = tmp.customerName;
            this.emergencyPhone = tmp.phoneNo;
            if (tmp.relationship >= 1) {
              this.emergencyShip = [];
              this.emergencyShip.push(String(tmp.relationship));
            }
          }
          if (phoneRepertoryVO[1]) {
            let tmp = phoneRepertoryVO[1];
            this.emergencyName2 = tmp.customerName;
            this.emergencyPhone2 = tmp.phoneNo;
            if (tmp.relationship >= 1) {
              this.emergencyShip2 = [];
              this.emergencyShip2.push(String(tmp.relationship));
            }
          }
        }
      }
      // 收货地址信息 consigneeAddress
      let consigneeAddress = data && data['consigneeAddress'];
      if (consigneeAddress) {
        this.addressArea = [consigneeAddress.province, consigneeAddress.city, consigneeAddress.county];
        this.addressDetail = consigneeAddress.detailAddr;
      }
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
    // 协议是否被点击勾选
    agreementClick() {
      this.agreementChoose = !this.agreementChoose;
    },
    // 判断下是否需要弹框 如果信息不完善弹出对应的提示
    // 返回是否OK  OK 就直接返回  true
    checkInfo() {
      // 姓名
      if (!this.hasUserName && !this.checkName(this.userName)) {
        return false;
      }
      if (this.addressArea && this.addressArea.length === 0) {
        this.showToastWithMessage('请选择您收货的省市区信息');
        return false;
      }
      if (!this.addressDetail || this.addressDetail.length === 0) {
        this.showToastWithMessage('请输入您的收货详细地址');
        return false;
      }
      if (this.checkAddressAvailable() === false) {
        return false;
      }
      if (!this.agreementChoose) {
        this.showToastWithMessage('请先阅读并同意协议');
        return false;
      }
      return true;
    },
    checkName(name) {
      console.log('checkName name = ' + name);
      if (!name) {
        this.showToastWithMessage('请输入您的姓名');
        return false;
      } else {
        // 姓名仅包含汉字和·
        let reg = /^[\u4e00-\u9fa5·]{2,12}$/i;
        if (!reg.test(name)) {
          this.showToastWithMessage('请输入正确的姓名，仅包含汉字和·，长度至少为2位');
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
    // 获取费用列表
    getHttpFeeList() {
      // 将对应的费用列表进行处理
      let tempFeeList = [];
      if (this.userChooseFeeList && this.userChooseFeeList instanceof Array) {
        for (let i = 0; i < this.userChooseFeeList.length; i++) {
          let feeItem = this.userChooseFeeList[i];
          tempFeeList.push(feeItem.feeNo);
        }
      }
      return tempFeeList;
    },
    // 获取地理位置信息,确认跳转
    // @jump true 请求确认预约  否则仅仅是获取一次地理位置
    getUserLocaltion(jump) {
      let that = this;
      // 失败后调 H5 API
      GetLocation({}, that).then(
        function(res) {
          var latitude = res.coords.latitude; // 纬度，浮点数，范围为90 ~ -90
          var longitude = res.coords.longitude; // 经度，浮点数，范围为180 ~ -180
          // console.log(latitude);
          // console.log(longitude);
          that.gpsLatitude = latitude;
          that.gpsLongitude = longitude;
          // 先去掉，正式的时候请打开
          that.getLocationAlready = true;
          if (jump === true) {
            that.confirmBook();
          }
        },
        function(error) {
          console.log('H5 getLocation API 错误代码: ', error.code, '错误信息: ', error.message);
          GetWXLocation(that)
            .then(res => {
              // console.log(res);
              var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180
              that.gpsLatitude = latitude;
              that.gpsLongitude = longitude;
              // 先去掉，正式的时候请打开
              that.getLocationAlready = true;
              // 获取地理位置成功之后，直接调用确认预约的接口
              if (jump === true) {
                that.confirmBook();
              }
            })
            .catch(err => {
              console.log(err);
              GetBaiduGps()
                .then(res => {
                  var latitude = res.lat;
                  var longitude = res.lng;
                  that.gpsLatitude = latitude;
                  that.gpsLongitude = longitude;
                  that.$store.commit('latMemory', { lat: res.lat });
                  that.$store.commit('lngMemory', { lng: res.lng });

                  // 先去掉，正式的时候请打开
                  that.getLocationAlready = true;
                  // 获取地理位置成功之后，直接调用确认预约的接口
                  if (jump === true) {
                    that.confirmBook();
                  }
                })
                .catch(err => {
                  that.$store.commit('updateLoadingStatus', { isLoading: false });
                  let errMsg = '';
                  switch (err.message) {
                    case 'isNotWeixin':
                      errMsg = '当前环境无法获取您的位置授权，请确保您已打开设置中的位置服务授权或检查定位功能是否正常';
                      break;
                    case 'getLocationFailed':
                      errMsg = '定位获取失败，请确保您已打开设置中的位置服务授权或检查定位功能是否正常';
                      break;
                    case 'cancelGetLocation':
                      errMsg = '为了给您提供更好的服务，请打开GPS允许获取位置授权';
                      break;
                    default:
                      break;
                  }
                  that.$vux.alert.show({
                    title: '温馨提示',
                    content: errMsg
                  });
                });
            });
        }
      );
    },
    // 迭代2.12.0 提交资料&提交订单按钮点击
    submitClick() {
      if (!this.checkInfo()) {
        return;
      }

      this.checkCustomerBaseInfo();
    },
    checkCustomerBaseInfo() {
      // 开始进行转圈圈
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      piwikTrackEvent('checkCustomerBaseInfo', 'type', 'start');
      let that = this;
      let url = '/wuzhu/customerVerController/checkCustomerBaseInfo';
      let address = this.getAddressArray(this.addressArea);
      let addressArray = address.split(' ');
      let provice = addressArray[0];
      let city = addressArray[1];
      let county = addressArray[2];
      let platform = that.$store.state.platformCode;
      let recivingInfo = {};
      recivingInfo.province = provice;
      recivingInfo.city = city;
      recivingInfo.county = county;
      recivingInfo.consigneeDetailAddr = that.addressDetail;
      recivingInfo.gpsLatitude = that.gpsLatitude;
      recivingInfo.gpsLongitude = that.gpsLongitude;
      recivingInfo.leaveMessage = that.leaveMessage;
      recivingInfo.payDepositAmtStyle = '001';
      recivingInfo.reciveMobile = that.phoneNum;
      recivingInfo.reciveName = that.userName;

      // 请求的参数
      let param = {
        applySerialNo: this.applySerialNo,
        continueFlag: that.$store.state.continueFlag,
        fromFlag: '1', // 获取入口 1:入口是确认预约  2：入口是个人中心
        step: '', // 如果为空就从第一步开始
        platformCode: platform, // 客户端平台
        checkIDCardRequest: {},
        recivingInfo: recivingInfo
      };
      that.$http.post(url, param).then(res => {
        piwikTrackEvent('checkCustomerBaseInfo', 'type', res.code);
        if (res.code === '00') {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          // that.$router.replace({
          //   name: 'OrderSubSuccessPage',
          //   params: { orderNo: orderNo }
          // });
          that.gotoNext(res);
        } else if (res.code === '1001') {
          unionLogin(this, this.aliOrderSubmit);
        } else {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          that.gotoNext(res);
        }
      });
    },
    // 根据对应的返回的Step进行对应的逻辑跳转<处理> 理解下单之后的跳转逻辑
    gotoNext(res) {
      let that = this;
      let data = res && res['data'];
      let step = data && data['step'];
      if (step) {
        switch (step) {
          case 'CRA': {
            // 预约申请检查
            // 弹窗提示对应的错误
            that.reminderInfoMessage = res['msg'];
            that.reminderShow = true;
            break;
          }
          case 'QIV': {
            // 身份验证-身份查询
            break;
          }
          case 'CID': {
            // 身份验证
            // console.log('身份验证已经验证通过了')
            that.$store.commit('ID_INFO_BTN_STATE', { IDInfoBtnState: 'next' });
            that.$router.push({ name: 'IDverify' });
            break;
          }
          case 'CJDXB': {
            // 京东小白分
            // 直接跳转到京东小白分页面后，说明身份验证已经通过，需要将状态修改为正常，防止在小白页面提示未通过身份验证
            that.$store.commit('accountStatusMemory', { accountStatus: '正常' });
            localStorage.setItem('origin', 'GoodsDetailPage');
            that.$router.push({ name: 'Credit' });
            break;
          }
          case 'LIVE': {
            // 活体检测页面
            that.$router.push({ name: 'LivenessVerify' });
            break;
          }
          case 'LIFENUM':
            // 支付宝生活号如果没有校验过手机号码则需要先校验手机号码
            if (this.$store.state.channelNo === '004') {
              let rememberMobile = sessionStorage.getItem('rememberMobile');
              console.log('orderEventSubmit rememberMobile = ' + rememberMobile);
              if (!rememberMobile || rememberMobile === 'null') {
                this.$router.push({ name: 'CheckMobile' });
              } else {
                this.$router.push({ name: 'OrderSubmitPage' });
              }
            } else {
              this.$router.push({ name: 'OrderSubmitPage' });
            }
            break;
          case 'EMERGENCY':
            // 增加紧急联系人
            that.$router.push({ name: 'AddContact' });
            break;
          case 'SUBMIT':
            // 确认下单
            that.confirmBook();
            break;
          default:
            break;
        }
      } else {
        // 错误信息的提示
        let errormsg = res['msg'] || '未知错误';
        that.alertShow = true;
        that.alertTitle = '提示';
        that.alertContent = errormsg;
        // // 输出对应的错误信息
        // let errorMsg = res['msg'] || '未知错误';
        // that.reminderInfoMessage = errorMsg;
        // that.reminderShow = true;
      }
    },
    // 提交订单按钮点击事件
    subOrderClick() {
      let stu = false;
      if (this.isAlipayLife) {
        stu = this.checkAliInfo();
      } else {
        stu = this.checkInfo();
      }
      if (stu === false) {
        return;
      }
      // 开始进行转圈圈
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      // 获取当前的LocalHost来决定环境
      let currentUrl = window.location.origin;
      if (currentUrl.indexOf('192.168.2.2') !== -1) {
        // 如果找不到就说明本地环境
        this.confirmBook();
      } else {
        // 开始获取用户的地理位置信息
        if (this.getLocationAlready === true) {
          this.confirmBook();
        } else {
          // 如果能正确获取地理位置信息，那么久正常跳过
          this.getUserLocaltion(true);
        }
      }
    },
    // 发送HTTP确认预约的服务
    confirmBook() {
      if (this.isAlipayLife) {
        this.aliOrderSubmit();
        return;
      }
      let that = this;
      // 获取对应的商品详情页面 GET /reservationController/getCommodityFromSession
      let comfirmUrl = '/wuzhu/reservationController/confirmReservationApplication';
      // let address = this.getAddressArray(this.addressArea);
      // let addressArray = address.split(' ');
      // let provice = addressArray[0];
      // let city = addressArray[1];
      // let county = addressArray[2];
      // // 将对应的费用列表进行处理
      // let tempFeeList = that.getHttpFeeList();
      // // 获取联系人关系
      // let emergencyShipIndex = parseInt(this.emergencyShip[0]);
      // let emergencyShipIndex2 = parseInt(this.emergencyShip2[0]);
      let _brickSessionStore = that.serviceAgreet.getSessionStore();
      let byno = _brickSessionStore.byno; // 分控埋点的号码
      // console.log('确认预约前 byno === ' + byno);
      let platform = that.$store.state.platformCode;
      // console.log('确认预约前 platform === ' + platform);
      // 请求的参数
      let param = {
        continueFlag: that.$store.state.continueFlag,
        applySerialNo: this.applySerialNo,
        // channelNo: that.$store.state.channelNo,
        // commodityNo: this.userChooseGood.commodityNo,
        // consigneeDetailAddr: that.addressDetail,
        // listPhoneReper: [
        //   {
        //     emergencyContact: that.emergencyName,
        //     emergencyContactNo: that.emergencyPhone,
        //     emergencyContactRelation: emergencyShipIndex
        //   },
        //   {
        //     emergencyContact: that.emergencyName2,
        //     emergencyContactNo: that.emergencyPhone2,
        //     emergencyContactRelation: emergencyShipIndex2
        //   }
        // ],
        // feeList: tempFeeList,
        // gpsLatitude: that.gpsLatitude,
        // gpsLongitude: that.gpsLongitude,
        // loginMobile: cslTestData.phoneNumber,
        // name: that.userName,
        // openId: that.$store.state.othersOpenID,
        // provice: provice,
        // city: city,
        // county: county,
        // productNo: this.userChooseFinancialProduct.productNo,
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
          let _PageinServiceAgreet = that.serviceAgreet.getPagein();
          if (_PageinServiceAgreet && _PageinServiceAgreet !== 'null') {
            // 用户点开后才上传协议埋点
            that.serviceAgreet.dataReport({
              notPageout: true
            });
          }
          let _Pagein = that.additionalAgreet.getPagein();
          if (_Pagein && _Pagein !== 'null') {
            // 用户点开后才上传协议埋点
            that.additionalAgreet.dataReport({
              notPageout: true
            });
          }
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
    },
    // 费用详情部分的页面
    // 费用的显示逻辑<支付方式，费用名称，费用计算基数>
    feeItemItemDesc(feeItem) {
      let ItemName = getFeeDescStr(feeItem);
      return ItemName;
    },
    // 点击对应的协议列表的展示
    protocolClick(protocolIndex, protocolItem) {
      // console.log(protocolIndex);
      // console.log(protocolItem);
      // console.log('>>> 点击对应的协议列表的展示');
      this.potocolShow = true;
      this.potocolTitle = protocolItem;
      this.potocolChooseIndex = protocolIndex;
      let currentPath = window.location.href.split('/dist')[0];
      let nowDate = new Date().getDate();
      if (protocolIndex === 0) {
        if (this.isAlipayLife) {
          this.potocolUrl = currentPath + '/doc/alipaylife/user_lease_agreement.htm' + '?t=' + nowDate;
        } else {
          this.potocolUrl = currentPath + '/doc/wx/user_lease_agreement.htm' + '?t=' + nowDate;
        }
        this.serviceAgreet.refreshPagein();
      } else if (protocolIndex === 1) {
        if (this.isAlipayLife) {
          this.potocolUrl = currentPath + '/doc/alipaylife/user_lease_supplementary_agreement.htm' + '?t=' + nowDate;
        } else {
          this.potocolUrl = currentPath + '/doc/wx/user_lease_supplementary_agreement.htm' + '?t=' + nowDate;
        }
        this.additionalAgreet.refreshPagein();
      }
    },
    // 确认协议的按钮被点击
    potocolSureClick() {
      // console.log('>>> 确认协议的按钮被点击');
      if (this.potocolChooseIndex === 0) {
        this.serviceAgreet.refreshPageout();
      } else if (this.potocolChooseIndex === 1) {
        this.additionalAgreet.refreshPageout();
      }
      this.potocolShow = false;
      this.potocolUrl = '';
      this.potocolChooseIndex = -1;
    },
    // 测试onChange事件
    inputChangeEvent(event) {
      this.inputChangeFlag = true;
    },
    // 获取开业城市
    getOpenCities() {
      // this.$vux.loading.show({ text: 'Loading' });
      this.$http
        .get('/wuzhu/channel/getOpenCities', { channelNo: this.$store.state.channelNo })
        .then(res => {
          this.$vux.loading.hide();
          if (res.code === '00') {
            this.openCityArr = res.data || [];
          }
        })
        .catch(e => {
          this.$vux.loading.hide();
        });
    },
    // 判断用户选择的城市是否存在开业城市里
    checkCity(cityName) {
      let result = false;
      for (var i in this.openCityArr) {
        if (this.openCityArr[i].openCityName === cityName) {
          result = true;
          break;
        }
      }
      return result;
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
  overflow-x: hidden;
  .feeCell {
    font-size: 16px;
    color: #222222;
    margin: 15px 0px;
    display: flex;
    justify-content: space-between;
    .xiaobai {
      color: rgba(255, 196, 0, 1);
    }
  }
  .gray {
    color: #888888;
  }
  .xiaobai-row {
    .border-1px();
  }

  /*修改地址栏部分的样式*/
  .padding-address .weui-cell__hd {
    width: 95px;
    margin-right: 10px;
  }

  /*// 头部信息*/
  .header {
    // margin-top: 15px;
    .goodsDetial {
      display: flex;
      justify-content: flex-start;
      background: #fff;
      padding: 15px 15px 5px 15px;
      // margin-bottom: 15px;
      .goodsImgDiv {
        width: 90px;
        flex: 0 0 90px;
        .goodsImage {
          width: 90px;
          height: 90px;
        }
      }
      .goodsInfoPlane {
        flex: 1;
        margin-left: 10px;
        .fullName {
          font-size: 16px;
          color: #222222;
          letter-spacing: 0;
          line-height: 22px;
          margin-bottom: 10px;
        }
        .markPrice {
          font-size: 11px;
          color: #888;
          letter-spacing: 0;
          line-height: 20px;
          margin-bottom: 2px;
        }
        .categoryList {
          line-height: 17px;
          .categoryListItem {
            // padding: 0 6px;
            font-size: 12px;
            color: #888888;
            letter-spacing: 0;
            margin-right: 5px;
            // background: #fef7b3;
            // border: 1px solid #ffda29;
            // border-radius: 2px;
            white-space: nowrap; /*强制span不换行*/
            display: inline-block; /*将span当做块级元素对待*/
          }
        }
      }
    }
    .feePlane {
      // .border-1px();
      padding: 0 15px 0px 15px;
      &:after {
        left: 18px;
        border-bottom: 1px solid #ddd;
      }
      background: #fff;
      overflow: hidden;

      font-size: 14px;
      letter-spacing: 0;
      color: #888888;
      .feeTips {
        font-size: 12px;
        color: #888888;
      }
      .feeTipsBold {
        font-size: 12px;
        color: #222222;
      }
    }

    .depositBlock {
      margin-top: 15px;
      padding: 0 15px 15px;
      // .border-1px();
      &:after {
        left: 18px;
        border-bottom: 1px solid #ddd;
      }
      background: #fff;
      overflow: hidden;

      font-size: 14px;
      letter-spacing: 0;
      color: #888888;
      .depositBlue {
        margin-left: 5px;
        padding: 1px 8px;
        width:40px;
        height:19px;
        border-radius:3px;
        border:1px solid rgba(0,122,255,1);
        font-size:12px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(0,122,255,1);
        line-height:17px;
      }
      .depositDetail {
        background:rgba(245,245,245,1);
        border-radius:3px;
        padding: 15px;
        .depositTitle {
          font-size:14px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(34,34,34,1);
          line-height:20px;
        }
      }
      .depositDesc {
        font-size:12px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(136,136,136,1);
        line-height:17px;
      }
    }
  }
  .orderdetail-tips {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    margin: 15px auto 7px 15px;
  }
  /*// 需要用户确认的表单信息*/
  .orderInfoPlane {
    background: #fff;
    margin-top: 15px;
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
        margin-left: 15px;
      }
    }
    .OrderInputPlane {
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
        color: #000000;
        letter-spacing: 0;
      }
      textarea {
        font-size: 16px;
        color: #888888;
        letter-spacing: 0;
        height: 71px !important;
      }
      textarea::-webkit-input-placeholder {
        font-size: 16px;
        letter-spacing: 0;
        color: #bbbbbb;
      }
      input {
        font-size: 16px;
        color: #000000;
        letter-spacing: 0;
      }
      input::-webkit-input-placeholder {
        font-size: 16px;
        letter-spacing: 0;
        color: #bbbbbb;
      }
      .vux-cell-value {
        font-size: 16px;
        color: #000000;
        letter-spacing: 0;
      }
    }
  }
  // 留言板
  .messageBoard {
    margin-top: 15px;
    padding: 0px 15px 15px 15px;
    // .border-1px();
    // &:after {
    //   left: 18px;
    //   border-bottom: 1px solid #ddd;
    // }
    background: #fff;
    overflow: hidden;

    font-size: 14px;
    letter-spacing: 0;
    color: #888888;
    .mb13 {
      margin-bottom: 13px !important;
    }
    .messageDetail {
      background:rgba(245,245,245,1);
      border-radius:3px;
      // padding: 15px;
      textarea {
        font-size: 14px;
        background-color: #F5F5F5;
        color: #888888;
        letter-spacing: 0;
        height: 50px !important;
      }
      .messageText {
        padding-top: 15px !important;
      }
      // textarea::-webkit-input-placeholder {
      //   font-size: 14px;
      //   letter-spacing: 0;
      //   color: #888888;
      // }
    }
  }

  /*// 用户协议部分*/
  .protocolPlane {
    margin: 20px 18px 58px 18px;
    display:-webkit-box;
    p {
      margin: 0 15px 0 5px;
      line-height: 20px;
      // padding: 2px;
    }
    .protocolPlane_normal {
      font-size: 14px;
      color: #111111;
      // letter-spacing: 0;
    }
    .protocolPlane_protocol {
      font-size: 14px;
      color: #2878fe;
      // letter-spacing: 0;
    }
  }
  .feeSelCir {
    width: 18px;
    height: 18px;
    margin-right: 2px;
    .bg('./../components/Goods/Check-on');
  }
  .feeNorCir {
    width: 18px;
    height: 18px;
    margin-right: 2px;
    .bg('./../components/Goods/Check-off');
  }

  .bottomBlock {
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    width:100%;
    height:48px;
    background:rgba(255,255,255,1);
    box-shadow:0px 1px 0px 0px rgba(221,221,221,1);
    .leftBlock {
      width:55%;
      padding: 8px 15px;
      .bottomDeposit {
        display: flex;
        height:20px;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(34,34,34,1);
        line-height:20px;
        .bottomDepositAmt {
          color:#FF4754;
        }
      }
      .bottomTips {
        height:14px;
        font-size:10px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(155,155,155,1);
        line-height:14px;
      }
    }
    .rightBlock {
      width:45%;
      text-align: center;
      height:48px;
      background:rgba(255,218,41,1);
      font-size:16px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(17,17,17,1);
      line-height:48px;
    }
  }
  /*用户点击提交按钮部分*/
  .submitPlane {
    margin: 18px 15px 39px 15px;
    overflow: auto;
    .weui-btn_primary {
      border: 1px solid #9b9b9b;
      border-radius: 100px;
      background: white;
      margin-right: 10px;
    }
    .weui-btn {
      background: #ffda29 !important;
      font-size: 16px !important;
      text-align: center !important;
      color: #111111;
    }
    .weui-btn:after {
      border: none;
    }
  }
}
</style>
