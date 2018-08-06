<template>
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
          <div class="markPrice">商品价值:{{ markPrice }}元</div>
          <div class="categoryList">
            <span class="categoryListItem" v-for="(specItem, specIndex) in listCommoditySpec" :key="specIndex">{{ specItem.specContent }}</span>
          </div>
        </div>
      </div>
      <div class="feePlane">
        <div class="feeCell">
          <div class="feeName">原商品押金</div>
          <div class="feeValue">￥{{ deposit }}</div>
        </div>
        <div class="feeCell">
          <div class="feeName">信用免押后</div>
          <div class="feeValue">申请中</div>
        </div>
        <div class="feeCell">
          <div class="feeName">日均租金</div>
          <div class="feeValue">￥{{ rentForOneDay }}/天</div>
        </div>
        <div class="feeCell" v-for="(feeItem, feeIndex) in feeList" :key="feeIndex">
          <div class="feeName">

            {{ feeItem['feeName'] }}
          </div>
          <div class="feeValue">{{ feeItemItemDesc(feeItem) }}</div>
        </div>
      </div>
      <div class="termDayPlane">
        <div class="feeCell">
          <div class="feeName" style="color: #111111">租期</div>
          <div class="feeValue" style="color: #888888">{{ tenancyTerm }}天</div>
        </div>
      </div>
      <div class="feePlaneTrail">
        <div class="feeCell" @click="showOrderTrailClick">
          <div class="feeName" style="color: #000000">每期费用支付计划试算<i style="font-size: 14px; color:#888888;font-style: normal;">(不含押金)</i></div>
          <div class="feeValue" style="margin-right: 5px;"><i class="icon iconfont icon-help1" style="color: #007AFF; font-size: 14px"></i></div>
        </div>
        <!--<fee-trial-table :feeTrialList="feeTrialList" :curDate="curDate" :goodReturnDate="myDate" v-show="showTrailDetail" style="margin: 0 15px"></fee-trial-table>-->
      </div>
    </div>
    <!--展示试算信息-->
    <!--<div class="trialTable OrderDetail_Shadow"></div>-->
    <!--订单详情信息-->
    <div class="orderInfoPlane OrderDetail_Shadow">
      <div class="orderInfoBase">
        <div class="feeCell xiaobai-row" style="font-size:16px; padding: 12px 15px 12px 0; margin: 0; margin-left: 18px;">
          <div class="feeName" style="color:#000000">京东小白信用已授权</div>
          <div class="feeValue xiaobai">信用: {{ JDCoin }}</div>
        </div>
        <div class="orderSubmit-flexBox bb1">
          <div class="flexBox-left">姓名</div>
          <div class="flexBox-right">{{ userName }}</div>
        </div>
        <div class="orderSubmit-flexBox bb1">
          <div class="flexBox-left">手机号</div>
          <div class="flexBox-right">{{ phoneNum }}</div>
        </div>
      </div>
      <div class="OrderInputPlane">
        <group>
          <x-address class="padding-address" title="省/市/区" :placeholder="placeholder"  v-model="addressArea" raw-value :list="addressData" @on-hide="inputAddrChange"></x-address>
          <!--<x-input :placeholder="addressPlaceHolder" :show-clear="false" v-model="addressDetail" @on-blur="inputAddrDetailChange" @on-change="inputChangeEvent"></x-input>-->
          <x-textarea :placeholder="addressPlaceHolder" :show-counter="false" :rows="2" v-model="addressDetail" @on-blur="inputAddrDetailChange" autosize></x-textarea>
        </group>
        <group class="group-2">
          <x-input class="padding-address" title="紧急联系人" type="text" :show-clear="false" placeholder="请填写紧急联系人" text-align="left" v-model="emergencyName" @on-blur="inputNameChange" @on-change="inputChangeEvent"></x-input>
          <x-input class="padding-address" title="联系人电话" type="tel" :show-clear="false" placeholder="请填写紧急联系人电话" text-align="left" v-model="emergencyPhone" keyboard="number" is-type="china-mobile" @on-blur="inputPhoneChange" @on-change="inputChangeEvent"></x-input>
          <popup-picker class="padding-address" title="所属关系" :showName="true" :data="shipData" v-model="emergencyShip" :placeholder="placeholder"  value-text-align="right" @on-hide="inputShipChange"></popup-picker>
        </group>
      </div>
    </div>
    <!--用户协议部分-->
    <div class="protocolPlane">
      <p>
        <span class="protocolPlane_normal">点击确认代表已同意</span>
        <span class="protocolPlane_protocol" v-for="(protocolItem, protocolIndex) in pdfFileList" :key="protocolIndex" @click="protocolClick(protocolIndex, protocolItem)">{{ protocolItem }}</span>
      </p>
    </div>
    <!--用户点击提交按钮部分-->
    <div class="submitPlane">
      <!-- <x-button @click.native="testtest">测试测试</x-button> -->
      <x-button @click.native="subOrderClick">确认预约下单</x-button>
    </div>
    <!--<fee-desc-alert  :showScrollBox="potocolShow" :dialogTitle="potocolTitle" :dialogContent="potocolContent" :potocol-type="true" @sureBtnClick="potocolSureClick">-->
      <!--<user-lease-service-agreements slot="htmlPocotol" v-show="potocolChooseIndex===0"/>-->
      <!--<user-lease-service-additional-agree slot="htmlPocotol" v-show="potocolChooseIndex===1"/>-->
    <!--</fee-desc-alert>-->
    <!--用来显示协议部分插件-->
    <!--<html-pannel :showScrollBox="potocolShow" :protocolTitle="potocolTitle" :url.sync="potocolUrl" @sureBtnClick="potocolSureClick"></html-pannel>-->
    <html-pannel :showScrollBox="potocolShow" :protocolTitle="potocolTitle" :url="potocolUrl" @sureBtnClick="potocolSureClick"></html-pannel>
    <!--Toast展示对应的结果-->
    <alert v-model="alertShow" :title="alertTitle" :content="alertContent"></alert>
    <toast v-model="showToast" type="text" width="20em">{{ toastContent }}</toast>
    <fee-trial-table-new :feeTrialList="feeTrialList" :curDate="curDate" :goodReturnDate="myDate" v-show="showTrailDetail" @hideClick="trailHideClick"></fee-trial-table-new>
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
// import rentalCacheTool from './../../cacheUtil/rentalCacheTool';
// import cslTestData from './../../TempData/slTest'
import './../../util/category.js';
import { GetLocation, GetWXLocation, GetBaiduGps } from './../../util/utils';
import userLeaseServiceAgreements from './../Potocol/UserLeaseServiceAgreements';
import feeDescAlert from './../FeeItemSubView/FeeDescAlert';
import userLeaseServiceAdditionalAgree from './../Potocol/UserLeaseServiceAdditionalAgree';
import { ReportData } from './../../util/ReportData';
import { getFeeDescStr, getTimerStr, getTrailTableList } from './../../wuzhuUtil/wuzhuUtil';
import htmlPannel from './../FeeItemSubView/HtmlPannel';
import feeTrialTableNew from './../FeeItemSubView/FeeTrialTableNew';

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
      // placeHolder
      placeholder: '请选择',
      // 日均租金
      rentForOneDay: '',
      // 用于传递用户的选择信息，从服务器缓存中获取
      applySerialNo: '', // 预约申请号
      // 用于标记input的change事件
      inputChangeFlag: false,
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
          },
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
        ]
      },
      serviceAgreet: null, // 埋点数据
      additionalAgreet: null,
      userChooseFinancialProduct: {}, // 用户选择的金融产品
      userChooseGood: {}, // 用户选择的具体商品
      userChooseFeeList: {}, // 用户选择的费用列表
      additionalFeeList: {}, // 用户必选的费用列表
      // 当前商品的详细信息
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
      phoneNum: '',
      emergencyName: '',
      emergencyPhone: '',
      addressArea: [],
      detailAddress: '',
      emergencyShip: [],
      addressData: ChinaAddressV4Data,
      addressPlaceHolder: '请输入收货详细地址，审核后不可修改',
      addressDetail: '',
      // 根据产品和风控需求，紧急联系人如下,其中微信公众号渠道隐藏2、3、10，但对应的code不能变
      // 1.父母、2.子女、3.配偶、4.兄弟姐妹、5. 非直系亲属、6.朋友、7.同学、8. 室友、9.情侣、 10. 同事、11.其他
      shipData: [],
      // pdfFileList: ['《用户租赁及服务协议》', '《个人信息查询和使用授权书》', '《个 信 报告查询授权书》', '《芝麻服务议》', '《xx消费  融-xx信 贷协议》', '《xx 融-还款计划》'],
      pdfFileList: ['《 用户租赁及服务协议》', '《用户租赁及服务协议之补充协议》'],
      // 是否显示协议说明
      potocolTitle: '用户租赁及服务协议',
      potocolContent: '',
      potocolShow: false,
      potocolUrl: '',
      potocolChooseIndex: -1,
      showToast: false,
      toastContent: '',
      // 通过alert的形式展示弹框
      alertShow: false,
      alertTitle: '',
      alertContent: '',
      trialTableGetAlready: false, // 用来标记是否已经获取过试算列表
      htmlScrollTop: 0, // 标准流滚动的距离
      curDate: '', // 试算列表中当前时间 Date对象
      myDate: '', // 试算列表中的预计收货时间 Date对象
      // 使用微信部分获取用户的地理位置信息
      getLocationAlready: false, // 必须要获取用户的地理位置信息才能确认预约
      wxReady: false, //  后续需要将该状态默认改成 flase 这样强制让用户获取地理位置信息
      jsApiList: ['getLocation'],
      gpsLongitude: '', // 经纬度信息的缓存
      gpsLatitude: ''
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
    let that = this
    console.log('channelNo=' + that.$store.state.channelNo)
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
    // 开始绑定时间wx的事件
    // 尝试的获取一次地理位置信息
    // this.getUserLocaltion(false);
  },
  mounted: function() {
    this.openCityArr = [] // 保存开业城市
    this.getOpenCities()
    this.$reporter.init() // 埋点初始化
    // 强制将 vux-popup-picker-select 里面的对齐方式改成左对齐
    let addressElList = document.getElementsByClassName('vux-popup-picker-select');
    for (let i = 0; i < addressElList.length; i++) {
      let ele = addressElList[i];
      console.log('ele = ' + ele);
      ele.style['text-align'] = 'left';
    }
    this.getCacheData(() => {
        this.getShipData()
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
    // 从后台获取订单相关数据
    getCacheData(callback) {
      let that = this;
      let _brickSessionStore = that.serviceAgreet.getSessionStore();
      console.log('byno = ' + _brickSessionStore.byno);
      // 获取对应的商品详情页面 GET /reservationController/getCommodityFromSession  http://192.168.2.8:9093
      let getDoodsDetailFromSessionUrl = '/wuzhu/reservationController/getCachData';
      // 从localStorage里面拿到对应的applyNo
      let applySerialNo = that.$store.state.applySerialNo;
      that.applySerialNo = applySerialNo;
      if (applySerialNo === null) {
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
          console.log(res)
          that.$vux.confirm.show({
            content: res.msg
          });
        }
        if (callback && callback instanceof Function) {
          callback()
        }
      });
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
    testtest() {
      this.$reporter.dataReport(this.brisk);
    },
    inputShipChange(res) {
      console.log('>>> inputShipChange', res);
      if (res) {
        this.brisk.edittimes[4].times++;
      }
    },
    // 紧急联系人电话修改次数
    inputPhoneChange() {
      if (this.inputChangeFlag) {
        this.brisk.edittimes[3].times++;
        this.inputChangeFlag = false;
      }
    },
    // 紧急联系人修改次数
    inputNameChange() {
      if (this.inputChangeFlag) {
        this.brisk.edittimes[2].times++;
        this.inputChangeFlag = false;
      }
    },
    // 收货地址详细地址修改次数
    inputAddrDetailChange() {
      if (this.inputChangeFlag) {
        this.brisk.edittimes[1].times++;
        this.inputChangeFlag = false;
      }
    },
    // 收货地址省市区修改次数
    // res 点击 “完成” 为 true, "取消" 为 false
    inputAddrChange(res) {
      // 分析下当前城市是否满足开业城市要求
      console.log('>>> inputAddrChange', res);
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
        // let citys = '';
        // this.openCityArr.forEach(item => {
          //   citys += item.openCityName + '、';
        // });
        // if (citys) {
          //   citys = citys.substring(0, citys.length - 1);
        // }
        // this.alertContent = ' 目前开业的城市：' + citys + ',请选择以上城市作为收货地址';
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
      console.log('parseJsonStrFromSession data = ' + data);
      // 开始配置用户测试数据
      let userChooseJsonStr = data && data.commodityJsonStr;
      let userChooseData = JSON.parse(userChooseJsonStr);
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
      this.userName = data && data['customerName'];
      this.phoneNum = data && data['phoneNumber'];
      // 用户选择的费用列表
      // let additionFeeInfoListStr = userChooseData && userChooseData['additionFeeInfo']
      // let userChooseFeeInfoListStr = userChooseData && userChooseData['userChooseFeeInfo']
      // 这里会包含所有的该金融产品的费用列表
      let additionFeeInfoList = data && data['additionFeeInfo'];
      let tempFeeList = [];
      // 判断下是否是属于字符串
      if (additionFeeInfoList !== undefined && additionFeeInfoList instanceof Array) {
        for (let i = 0; i < additionFeeInfoList.length; i++) {
          let feeItem = additionFeeInfoList[i];
          tempFeeList.push(feeItem); // 根据用户的选择加入
        }
      }
      // 这里会包含所有的该金融产品的费用列表
      let userChooseFeeInfoList = data && data['userChooseFeeInfo'];
      if (userChooseFeeInfoList !== undefined && userChooseFeeInfoList instanceof Array) {
        for (let i = 0; i < userChooseFeeInfoList.length; i++) {
          let feeItem = userChooseFeeInfoList[i];
          tempFeeList.push(feeItem); // 根据用户的选择加入
        }
      }
      this.feeList = tempFeeList;
      this.userChooseFeeList = userChooseFeeInfoList;
      // 紧急联系人相关信息 phoneRepertoryVO
      let phoneRepertoryVO = data && data['phoneRepertoryVO'];
      if (phoneRepertoryVO) {
        this.emergencyName = phoneRepertoryVO.customerName
        this.emergencyPhone = phoneRepertoryVO.phoneNo
        if (phoneRepertoryVO.relationship >= 1) {
          this.emergencyShip = [];
          this.emergencyShip.push(String(phoneRepertoryVO.relationship))
        }
      }
      // 收货地址信息 consigneeAddress
      let consigneeAddress = data && data['consigneeAddress'];
      if (consigneeAddress) {
        this.addressArea = [consigneeAddress.province, consigneeAddress.city, consigneeAddress.county];
        this.addressDetail = consigneeAddress.detailAddr;
      }
    },
    // 箭头打开和关闭商品详情的函数
    showOrderTrailClick() {
      let that = this;
      if (this.trialTableGetAlready === false && this.showTrailDetail === false) {
        let feeInfoList = that.getHttpFeeList();
        // 判断下是否获取了对应商品详情等信息
        var curDate = new Date(); // 当前时间
        var myDate = new Date(curDate.getTime() + 24 * 4 * 60 * 60 * 1000);
        var myDateStr = myDate.Format('yyyy-MM-dd');
        that.curDate = getTimerStr(curDate);
        that.myDate = getTimerStr(myDate);
        let param = {
          feeInfoList: feeInfoList,
          openId: that.$store.state.othersOpenID,
          channelNo: that.$store.state.channelNo,
          applySerialNo: this.applySerialNo,
          // loginMobile: cslTestData.phoneNumber,
          startDay: myDateStr,
          commodityNo: that.userChooseGood.commodityNo,
          productNo: that.userChooseFinancialProduct.productNo
        };
        let getPayRentPlanUrl = '/wuzhu/reservationController/payRentPlan';
        that.$store.commit('updateLoadingStatus', { isLoading: true });
        that.$http.post(getPayRentPlanUrl, param).then(res => {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          if (res.code === '00') {
            // 开始获取试算的信息
            let data = res['data'];
            // 获取的对应的试算，并且进行数组转换
            let mapData = data['map'];
            that.feeTrialList = getTrailTableList(mapData);
            that.trialTableGetAlready = true;
            // 开始获取当前html上的
            that.htmlScrollTop = document.documentElement.scrollTop;
            console.log('that.htmlScrollTop' + that.htmlScrollTop);
            document.documentElement.classList.add('alpha');
            this.showTrailDetail = true;
          } else {
            // 错误信息的提示
            let errormsg = res['msg'];
            that.toastContent = errormsg;
            that.showToast = true;
          }
        });
      } else {
        if (this.showTrailDetail) {
          this.showTrailDetail = false;
          document.documentElement.scrollTop = that.htmlScrollTop;
          document.documentElement.classList.remove('alpha');
        } else {
          this.showTrailDetail = true;
          // 开始获取当前html上的
          that.htmlScrollTop = document.documentElement.scrollTop;
          console.log('that.htmlScrollTop' + that.htmlScrollTop);
          document.documentElement.classList.add('alpha');
        }
      }
      // if (this.showTrailDetail) {
      //   this.showTrailDetail = false
      // } else {
      //   this.showTrailDetail = true
      // }
    },
    // 当展示隐藏试算的时候
    trailHideClick() {
      this.showTrailDetail = false;
      document.documentElement.scrollTop = this.htmlScrollTop;
      document.documentElement.classList.remove('alpha');
    },
    // 判断下是否需要弹框 如果信息不完善弹出对应的提示
    // 返回是否OK  OK 就直接返回  true
    checkInfo() {
      let that = this;
      function showToastWithMessage(content) {
        that.toastContent = content;
        that.showToast = true;
      }
      if (this.addressArea.length === 0) {
        showToastWithMessage('请选择您居住地的省市区信息');
        return false;
      }
      if (this.addressDetail.length === 0) {
        showToastWithMessage('请输入您居住地的详细地址');
        return false;
      }
      if (this.emergencyName.length === 0) {
        showToastWithMessage('请输入您的紧急联系人信息');
        return false;
      } else {
        // 紧急联系人姓名仅包含汉字和·
        let reg = /^[\u4e00-\u9fa5·]{2,12}$/i;
        if (!reg.test(this.emergencyName)) {
          showToastWithMessage('请输入正确的姓名，仅包含汉字和·');
          return false;
        }
        // 紧急联系人姓名不能与本人相同
        if (this.emergencyName === this.userName) {
          showToastWithMessage('紧急联系人不能填写本人姓名');
          return false;
        }
      }
      if (this.checkAddressAvailable() === false) {
        return false;
      }
      var myreg = /^(13[0-9]{9}|14[5,7][0-9]{8}|15[0-9]{9}|16[0-9]{9}|17[2-9][0-9]{8}|18[0-9]{9}|19[0-9]{9})$/;
      if (!myreg.test(this.emergencyPhone)) {
        showToastWithMessage('请输入正确的手机号码');
        return false;
      } else {
        // 紧急联系人手机不能与本人相同
        if (this.emergencyPhone === this.phoneNum) {
          showToastWithMessage('紧急联系人不能填写本人手机号');
          return false;
        }
      }
      let shipValue = -1
      if (this.emergencyShip.length > 0) {
        shipValue = parseInt(this.emergencyShip[0])
      }
      if (shipValue <= 0) {
        showToastWithMessage('请选择您和紧急联系人的关系');
        return false;
      }
      return true;
    },
    // 获取费用列表
    getHttpFeeList() {
      // 将对应的费用列表进行处理
      let tempFeeList = [];
      if (this.userChooseFeeList !== undefined && this.userChooseFeeList instanceof Array) {
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
          console.log(latitude);
          console.log(longitude);
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
              console.log(res);
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
    // 提交订单按钮点击事件
    subOrderClick() {
      let stu = this.checkInfo();
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
      let that = this;
      // 获取对应的商品详情页面 GET /reservationController/getCommodityFromSession
      let comfirmUrl = '/wuzhu/reservationController/confirmReservationApplication';
      let address = this.getAddressArray(this.addressArea);
      let addressArray = address.split(' ');
      let provice = addressArray[0];
      let city = addressArray[1];
      let county = addressArray[2];
      // 将对应的费用列表进行处理
      let tempFeeList = that.getHttpFeeList();
      // 获取联系人关系
      let emergencyShipIndex = parseInt(this.emergencyShip[0])
      let _brickSessionStore = that.serviceAgreet.getSessionStore()
      let byno = _brickSessionStore.byno; // 分控埋点的号码
      console.log('确认预约前 byno === ' + byno);
      // 请求的参数
      let param = {
        continueFlag: that.$store.state.continueFlag,
        applySerialNo: this.applySerialNo,
        channelNo: that.$store.state.channelNo,
        commodityNo: this.userChooseGood.commodityNo,
        consigneeDetailAddr: that.addressDetail,
        emergencyContact: that.emergencyName,
        emergencyContactNo: that.emergencyPhone,
        emergencyContactRelation: emergencyShipIndex,
        feeList: tempFeeList,
        gpsLatitude: that.gpsLatitude,
        gpsLongitude: that.gpsLongitude,
        // loginMobile: cslTestData.phoneNumber,
        name: that.userName,
        openId: that.$store.state.othersOpenID,
        provice: provice,
        city: city,
        county: county,
        productNo: this.userChooseFinancialProduct.productNo,
        recommCode: that.$store.state.recommeCode, // 邀请码 -// -
        byno: byno // 分控埋点
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
          that.$router.push({
            name: 'OrderSubSuccessPage',
            params: { orderNo: orderNo }
          });
          // let userChooseData = res['data']
          // let userChooseData = JSON.parse(data['commodityJsonStr'])
          // this.parseJsonStrFromSession(userChooseData)
        } else {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          // 错误信息的提示
          let errormsg = res['msg'];
          that.toastContent = errormsg;
          that.showToast = true;
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
      console.log(protocolIndex);
      console.log(protocolItem);
      console.log('>>> 点击对应的协议列表的展示');
      this.potocolShow = true;
      this.potocolTitle = protocolItem;
      this.potocolChooseIndex = protocolIndex;
      let currentPath = window.location.href.split('/dist')[0];
      if (protocolIndex === 0) {
        // this.potocolUrl = 'https://wuzhutes.woozhu.cn/doc/wx/user_lease_agreement.htm';
        // this.potocolUrl = currentPath + '/static/protocolHtml/用户租赁及服务协议（金达主体）.htm';
        this.potocolUrl = currentPath + '/doc/wx/user_lease_agreement.htm';
        this.serviceAgreet.refreshPagein();
      } else if (protocolIndex === 1) {
        // this.potocolUrl = 'https://wuzhutes.woozhu.cn/doc/wx/user_lease_supplementary_agreement.htm';
        // this.potocolUrl = currentPath + '/static/protocolHtml/用户租赁及服务协议之补充协议（金达主体）.htm';
        this.potocolUrl = currentPath + '/doc/wx/user_lease_supplementary_agreement.htm';
        this.additionalAgreet.refreshPagein();
      }
    },
    // 确认协议的按钮被点击
    potocolSureClick() {
      console.log('>>> 确认协议的按钮被点击');
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
      this.$vux.loading.show({ text: 'Loading' });
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
    },
    // 获取联系人关系数据
    getShipData() {
      this.$http.get('/wuzhu/common/queryRelationshipListByChannel', {channelNo: this.$store.state.channelNo}).then(res => {
        if (res.code === '00') {
          if (res.data && res.data.length > 0) {
            this.shipData = []
            let data = []
            res.data.forEach(item => {
              data.push({name: item.relationShipName, value: String(item.relationShipCode)})
            })
            this.shipData.push(data);
            // 判断是否存在(getCacheData方法里有对this.emergencyShip赋值)
            if (this.emergencyShip.length > 0) {
              let isExist = false
              let shipValue = this.emergencyShip[0]
              for (var i in res.data) {
                if (String(res.data[i].relationShipCode) === shipValue) {
                  isExist = true
                  break;
                }
              }
              if (!isExist) {
                this.emergencyShip = []
              }
            }
          }
        }
      });
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
  /*position: fixed;*/
  height: 100%;
  overflow: hidden;
}

.OrderSubmitPage {
  background: @bg;
  font-family: 'PingFang SC';
  position: relative;
  overflow: scroll;
  /*// 公用部分*/
  /*阴影部分的统一方式设置*/
  .OrderDetail_Shadow {
  }

  /*// 里面的公用部分*/
  /*// Cell样式的统一处理*/
  .feeCell {
    margin: 15px 18px 16px 18px;
    display: flex;
    justify-content: space-between;
    .feeName {
    }
    .feeValue {
    }
    .xiaobai {
      color: rgba(255, 196, 0, 1);
    }
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
    margin-top: 15px;
    .goodsDetial {
      display: flex;
      justify-content: flex-start;
      background: #fff;
      padding: 18px;
      margin-bottom: 15px;
      .goodsImgDiv {
        .goodsImage {
          /*border:1px solid #DDDDDD;*/
          width: 90px;
          height: 90px;
        }
      }
      .goodsInfoPlane {
        margin-left: 10px;
        .fullName {
          font-size: 14px;
          color: #000000;
          letter-spacing: 0;
          line-height: 15px;
          margin-bottom: 5px;
        }
        .markPrice {
          font-size: 11px;
          color: #000000;
          letter-spacing: 0;
          line-height: 20px;
          margin-bottom: 2px;
        }
        .categoryList {
          .categoryListItem {
            padding: 0 6px;
            font-size: 10px;
            color: #000000;
            letter-spacing: 0;
            margin-right: 5px;
            background: #fef7b3;
            border: 1px solid #ffda29;
            border-radius: 2px;
          }
        }
      }
    }
    .feePlane {
      .border-1px();
      &:after {
        left: 18px;
      }
      background: #fff;
      overflow: hidden;

      font-size: 14px;
      letter-spacing: 0;
      color: #888888;
    }
    .termDayPlane {
      .border-1px();
      &:after {
        left: 18px;
      }
      background: #fff;
      overflow: hidden;

      font-size: 16px;
      color: #000000;
      letter-spacing: 0;
    }
    .feePlaneTrail {
      background: #fff;
      overflow: hidden;
      margin-bottom: 30px;

      font-size: 16px;
      color: #000000;
      letter-spacing: 0;
    }
    /*// 展示试算信息*/
    .trialTable {
    }
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
      .flexBox-right {
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
        margin-top: 15px;
      }
      .weui-label {
        font-size: 16px;
        color: #000000;
        letter-spacing: 0;
      }
      textarea {
        font-size: 16px;
        color: #000000;
        letter-spacing: 0;
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
  /*// 用户协议部分*/
  .protocolPlane {
    margin: 10px 15px 0 15px;
    p {
      margin: 0 auto;
      line-height: 15px;
      padding: 2px;
    }
    .protocolPlane_normal {
      font-size: 12px;
      color: #000000;
      letter-spacing: 0;
    }
    .protocolPlane_protocol {
      font-size: 12px;
      color: #2878fe;
      letter-spacing: 0;
    }
  }
  /*用户点击提交按钮部分*/
  .submitPlane {
    margin: 18px 15px 39px 15px;
    /*padding-bottom: 39px;*/
    overflow: auto;
    .weui-btn_primary {
      border: 1px solid #9b9b9b;
      border-radius: 100px;
      background: white;
      margin-right: 10px;
    }
    .weui-btn {
      background: #ffda29 !important;
      font-size: 17px !important;
      text-align: center !important;
    }
    .weui-btn:after {
      border: none;
    }
  }
}
</style>
