<template>
  <div class="goodsCategoryPlane">
    <div class="sl-dialog">
      <!--阴影部分-->
      <transition :name="maskTransition">
        <div class="sl-mask" @click="hide"></div>
      </transition>
      <transition :name="dialogTransition">
        <div class="sl-dialog-content">
          <!--商品展示部分-->
          <div class="goodsInfo">
            <div class="goodsContent">
              <div class="imageDiv">
                <img class="goodsListImage" v-lazy="parseData.commodities.listImg"/>
              </div>
              <div class="infoPlane">
                <div>
                  <span class="dayPrice">￥{{leaseForOneDayPrice}}</span>
                  <span class="dayUnit">/天起</span>
                </div>
                <div>
                  <span class="grayLabel">月租金：</span>
                  <span class="blackLabel">￥{{leaseForOneMonthPrice}}</span>
                </div>
                <div>
                  <span class="grayLabel">押金：</span>
                  <span class="blackLabel">￥{{performanceBondPrice}}</span>
                </div>
              </div>
              <!--目前的需求先不做-->
              <!--<div>-->
              <!--申请免押-->
              <!--</div>-->
            </div>
          </div>
          <!--滑动部分的控制-->
          <div class="scrollerWrap" ref="scrollerWrap">
            <!--规格展示-->
            <div class="categoryPlane">
              <div class="sectionBox" v-for="(item, index) in parseData.categoryTable" :key="index">
                <div class="sectionTitle">
                  {{ item.specName }}
                </div>
                <div class="sectionContent">
                  <div class="categoryItem" v-for="(subItem, subIndex) in item.Array" :key="subIndex" v-bind:data-Item="subItem"
                       v-bind:class="{ 'categoryItemSel': categoryItemChooseClass(subItem, 2), 'categoryItem':(subItem.Status === 0),  'categoryItemDisable':(subItem.Status === 1)}"
                       @click="categoryItemClick(subItem)">
                    {{ subItem.specContent }}
                    <div class="categoryItemIcon" v-show="subItem.Status === 2"></div>
                  </div>
                </div>
              </div>
            </div>
            <!--租期部分展示-->
            <div class="rentDayPlane">
              <div class="sectionBox">
                <div class="sectionTitle">
                  租期
                </div>
                <div class="sectionContent">
                  <div class="categoryItem" v-for="(termItem, termIndex) in parseData.financeProductList" :key="termIndex"
                       v-bind:class="{ 'categoryItemSel': getFinalproductNoStatus(termItem, 2), 'categoryItem':(termItem.Status === 0),  'categoryItemDisable':(termItem.Status === 1)}"
                       @click="financialItemClick(termItem) ">
                    {{ termItem.totalDays }}天
                    <div class="categoryItemIcon" v-show="termItem.Status === 2"></div>
                  </div>
                </div>
              </div>
            </div>
            <!--增值服务-->
            <div class="feePlane">
              <div class="service-title">增值服务</div>
              <div class="feeSection" v-if="!isUserChooseFinancialProduct">
                <div class="feeSectionTop">
                  <div class="feeSection-left">
                    <div class="feeSelCir"></div>
                    <div class="">意外保障金（必选）</div>
                  </div>
                  <div class="feeSection-right">
                    <i class="icon iconfont icon-help1"></i>
                  </div>
                </div>
                <div class="feeSectionBottom">意外保障服务提供一次免费的意外内外屏损坏维修</div>
              </div>
              <div v-else>
                <div class="feeSection" v-for="(additionalItem, index) in additionalFeeList" :key="index">
                  <div class="feeSectionTop">
                    <div class="feeSection-left">
                      <div class="feeSelCir"></div>
                      <div class="">{{ feeItemNameDesc(additionalItem) }} (必选)</div>
                    </div>
                    <div class="feeSection-right" @click="feeDescItemClick(additionalItem)">
                      <i class="icon iconfont icon-help1"></i>
                    </div>
                  </div>
                  <div class="feeSectionBottom">意外保障服务提供一次免费的意外内外屏损坏维修</div>
                </div>
                <div class="feeSection" v-for="(feeItem, feeIndex) in optionalFeeList" :key="feeIndex">
                  <div class="feeSectionTop">
                    <div class="feeSection-left">
                      <div v-bind:class="feeListCircleClassObject(feeItem)"></div>
                      <div class="">{{ feeItemNameDesc(feeItem) }}</div>
                    </div>
                    <div class="feeSection-right" @click="feeDescItemClick(additionalItem)">
                      <i class="icon iconfont icon-help1"></i>
                    </div>
                  </div>
                  <div class="feeSectionBottom">意外保障服务提供一次免费的意外内外屏损坏维修</div>
                </div>
              </div>
            </div>
          </div>
          <!--按钮部分说明-->
          <div class="buttonPlane">
            <x-button @click.native="goNext">确定</x-button>
          </div>
          <!--费用说明和其它对应的痰喘-->
          <fee-desc-alert :showScrollBox="showScrollBox" :potocol-type="true" :dialogTitle="dialogTitle" :dialogContent="dialogContent" @sureBtnClick="feeDescItemClick()">
            <div  v-html="dialogContent" slot="htmlPocotol"></div>
          </fee-desc-alert>
          <toast v-model="reminderShow" type="text" width="20em">{{ reminderInfoMessage }}</toast>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import {
    XButton,
    Toast
  } from 'vux';
  import { getFeeDescStr } from './../../wuzhuUtil/wuzhuUtil';
  import feeDescAlert from './../FeeItemSubView/FeeDescAlert';
  // import { CategoryStatus, ParseData } from './GoodsCategoryTool'
  import { CategoryStatus, ParseData } from './GoodsCategoryTool';
  import rentalCacheTool from './../../cacheUtil/rentalCacheTool';
  import { GetLocation, isWeiXin } from './../../util/utils';

  export default {
    name: 'GoodsCategoryPlane',
    components: {
      XButton,
      feeDescAlert,
      Toast
    },
    data() {
      return {
        parseData: {
          commodities: {
            listImg: ''
          }
        },                                // http获取到原始数据处理后的类
        userChooseGood: {},               // 用户选择的商品
        userChooseCategoryList: [],       // 所有的规格列表
        userChooseFinancialProduct: {},   // 用户选择的金融产品列表
        wxReady: false,
        stockEmpty: false,
        parseStorageFlag: false,
        maskTransition: 'vux-mask',
        dialogTransition: 'vux-dialog',
        userChooseFeeList: [],             // 用户选择的费用列表
        additionalFeeList: [],
        optionalFeeList: [],
        // 展示对应的费用详情的说明
        showScrollBox: false,
        dialogTitle: '',
        dialogContent: '',
        // Toast部分
        reminderInfoMessage: '', // 错误的提示信息
        reminderShow: false,
        // 使用微信部分获取用户的地理位置信息
        localRequire: false, // 点击立即下单的时候回开始询问一次
        jsApiList: ['getLocation'],
        gpsLongitude: '', // 经纬度信息的缓存
        gpsLatitude: ''
      }
    },
    created() {
      // create 用于载入数据和进行对应网络请求来替代
      console.log('开始载入数据======================');
      this.categoryCode = this.$store.state.categoryCode;
      // // 开始调用ajax的请求 请求的URL
      let queryDetailUrl = '/wuzhu/homePageController/queryCommodityDetail';
      // 请求的参数
      let param = {
        openId: this.$store.state.othersOpenID,
        channelNo: this.$store.state.channelNo,
        categoryCode: this.categoryCode
      };
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      let that = this;
      that.$http.get(queryDetailUrl, param).then(res => {
        that.$store.commit('updateLoadingStatus', { isLoading: false });
        if (res.code === '00') {
          console.log('获取商品详细成功');
          // 开始解析数据
          var goodsData = res && res['data'];
          var parseData = new ParseData(goodsData);
          parseData.parseCategoryList();
          parseData.parseGoodsList();
          parseData.parseRentDayList();
          that.parseData = parseData;
        }
      });
    },
    mounted() {
      this.$nextTick(() => {
        let height = document.body.clientHeight
        let setHeight = (height - 110 - 89 - 147) + 'px'
        let scrollerWrap = this.$refs.scrollerWrap
        scrollerWrap.style['max-height'] = setHeight
      })
    },
    computed: {
      //  显示当前金融产品日租金的逻辑
      leaseForOneDayPrice: function() {
        let price = this.parseData && this.parseData.commodities && this.parseData.commodities['leastRentDay'];
        let avgRentAmt = this.userChooseFinancialProduct && this.userChooseFinancialProduct['avgRentAmt'];
        console.log('price \t' + price + 'avgRentAmt\t' + avgRentAmt);
        // console.log('this.userChooseFinancialProduct = ' + JSON.stringify(this.userChooseFinancialProduct))
        if (avgRentAmt !== undefined) {
          price = avgRentAmt;
        }
        return price;
      },
      //  显示当前金融产品日租金的逻辑
      leaseForOneMonthPrice: function() {
        let price = this.parseData && this.parseData.commodities && this.parseData.commodities['leastRentDay'];
        let avgRentAmt = this.userChooseFinancialProduct && this.userChooseFinancialProduct['avgRentAmt'];
        if (avgRentAmt !== undefined) {
          price = avgRentAmt;
        }
        return price * 30;
      },
      // 押金的展示逻辑
      performanceBondPrice: function() {
        let price = this.parseData && this.parseData.commodities && this.parseData.commodities['minPerformanceBond'];
        let avgRentAmt = this.userChooseGood && this.userChooseGood['performanceBond'];
        if (avgRentAmt !== undefined) {
          price = avgRentAmt;
        }
        return price;
      },
      //  用户是否选定了金融产品
      isUserChooseFinancialProduct: function() {
        let financialNo = this.userChooseFinancialProduct['productNo'];
        if (financialNo !== undefined) {
          return true;
        } else {
          return false;
        }
      }
    },
    methods: {
      // 组件隐藏
      hide() {
        this.$emit('hideClick')
      },
      // 获取对应规格的状态
      categoryItemChooseClass(subItem, statusNum) {
        subItem.getMyStatus(this.userChooseCategoryList);
        return subItem.Status === statusNum;
      },
      categoryItemClick(subItem) {
        console.log(subItem.specContent + '=== 被点击了');
        switch (subItem.Status) {
          case CategoryStatus.Disable: {
            // 无法被点击
            // 不能被点击，所以直接返回
            break;
          }
          case CategoryStatus.Normal: {
            // 正常的状态，选剔除同类，再取代<观察选择链表的变化，凑足3个刷新产品详情>
            let sameTypeIndex = subItem.findMyCategoryFamilyIndex(this.userChooseCategoryList);
            if (sameTypeIndex === -1) {
              this.userChooseCategoryList.push(subItem);
            } else {
              this.userChooseCategoryList.splice(sameTypeIndex, 1, subItem);
            }
            break;
          }
          case CategoryStatus.Selected: {
            //  当前处于选定状态，那么就直接剔除自己
            let sameTypeIndex = subItem.findMyCategoryFamilyIndex(this.userChooseCategoryList);
            if (sameTypeIndex !== -1) {
              this.userChooseCategoryList.splice(sameTypeIndex, 1);
            }
            break;
          }
          default: {
            console.log(subItem.specContent + '\t' + ' 点击处于异常状态，请注意！！！');
          }
        }
      },
      //  是否是当前选定的金融产品
      getFinalproductNoStatus: function(finalProductItem, stu) {
        // 先判断是否在选定商品的金融产品里面
        let listProduct = this.userChooseGood && this.userChooseGood['listProduct']
        if (listProduct !== undefined && listProduct instanceof Array) {
          let findResult = listProduct.findIndex(function(element, index, array) {
            return element.totalDays === finalProductItem.totalDays;
          });
          if (findResult === -1) {
            // 如果不存在添加到该列表中
            finalProductItem.Status = CategoryStatus.Disable;
          } else {
            if (finalProductItem.totalDays === this.userChooseFinancialProduct.totalDays) {
              finalProductItem.Status = CategoryStatus.Selected;
            } else {
              finalProductItem.Status = CategoryStatus.Normal;
            }
          }
        } else {
          finalProductItem.Status = CategoryStatus.Disable;
        }
        return finalProductItem.Status === stu;
      },
      //  用户选择金融产品的处理
      financialItemClick(financialItem) {
        let stu = financialItem.Status;
        if (stu === CategoryStatus.Selected) {
          this.userChooseFinancialProduct = {};
        } else {
          // 转化成当前费用列表中具体的费用
          let listProduct = this.userChooseGood && this.userChooseGood['listProduct'];
          if (listProduct !== undefined && listProduct instanceof Array) {
            let findResult = listProduct.findIndex(function(element, index, array) {
              return element.totalDays === financialItem.totalDays;
            });
            if (findResult !== -1) {
              this.userChooseFinancialProduct = listProduct[findResult];
            }
          }
        }
        // console.log(JSON.stringify(this.userChooseFinancialProduct));
      },
      // 费用的显示逻辑<支付方式，费用名称，费用计算基数>
      feeItemNameDesc(feeItem) {
        let feeName = feeItem && feeItem['feeName'];
        return feeName + '(' + getFeeDescStr(feeItem) + ')';
      },
      // 问号被点击出现对应的弹框进行费用说明
      feeDescItemClick(feeItem) {
        if (this.showScrollBox === true) {
          this.showScrollBox = false;
        } else {
          this.dialogTitle = feeItem.feeName + '说明';
          this.dialogContent = ' ';
          if (feeItem['feeDesc'] !== undefined) {
            this.dialogContent = feeItem['feeDesc'];
          }
          this.showScrollBox = true;
        }
      },
      // 判断某个费用是否在用户选择的费用列表里面<存在返回下标，不存在返回-1>
      IsInUserChooseFeeList: function(feeItem) {
        let tempIndex = -1;
        for (let i = 0; i < this.userChooseFeeList.length; i++) {
          let tempItem = this.userChooseFeeList[i];
          if (tempItem.feeNo === feeItem.feeNo) {
            tempIndex = i;
            break;
          }
        }
        return tempIndex;
      },
      // 根据用户选择圈圈部分的控制<判断该费用列表是否在用户的选择的费用列表里面>
      feeListCircleClassObject: function(feeItem) {
        let feeItemChoose = this.IsInUserChooseFeeList(feeItem) !== -1;
        return {
          'feeNorCir': !feeItemChoose,
          'feeSelCir': feeItemChoose
        };
      },
      // 查询商品的库存信息
      queryCommodityStoreNum(commodityNo) {
        let that = this;
        let queryStoreUrl = '/wuzhu/homePageController/queryAvaliCommodityStockQty';
        // 请求的参数
        // 查询库存的信息
        let param = {
          commodityNo: commodityNo
        };
        that.$http.get(queryStoreUrl, param).then(res => {
          if (res.code === '00') {
            let storeNum = res && res['data'];
            if (storeNum === 0) {
              // 说明库存为0
              // 判断是不是限量
              let isLimited = this.userChooseGood && this.userChooseGood['isLimited'];
              if (isLimited === '0') {
                // '0' 表示非限量
                this.stockEmpty = false;
              } else {
                // '1' 表示限量
                this.stockEmpty = true;
              }
            } else {
              this.stockEmpty = false;
            }
            console.log('接口返回的数据为: ' + JSON.stringify(res));
          } else {
            console.log('接口返回的数据为: ' + JSON.stringify(res));
          }
        });
      },
      // 提交订单部分的判断跳转
      checkInfoComplete() {
        if (JSON.stringify(this.userChooseGood) === '{}') {
          this.reminderInfoMessage = '请选择对应商品规格';
          this.reminderShow = true;
          return false;
        }
        if (JSON.stringify(this.userChooseFinancialProduct) === '{}') {
          this.reminderInfoMessage = '请选择您的租赁天数';
          this.reminderShow = true;
          return false;
        }
        return true;
      },
      goNext() {
        let that = this;
        // 如果是京东渠道且是android手机则不能下单
        // if (that.$store.state.channelNo === '003' && that.$store.state.osinfo === 'Android') {
        //   that.$vux.alert.show({
        //     content: '您的设备目前不支持完成该步骤，请更换设备再试',
        //     onHide() {
        //       that.$router.push({ name: 'HomePage' });
        //     }
        //   });
        //   return;
        // }
        let completeCheck = that.checkInfoComplete();
        if (completeCheck === false) {
          return;
        }
        // 开始检查库存
        // 如果是无货，直接返回，不能点击
        if (this.stockEmpty === true) {
          that.reminderInfoMessage = '您选的商品规格已售罄，换个试试'
          that.reminderShow = true
          return
        }
        if (that.localRequire === false) {
          // 保证只会执行一次
          that.getUserLocaltion();
        } else {
          that.orderEventSubmit(); // 如果已经出现过获取地理位置的弹框
        }
      },
      // 开始下单的HTTP 请求 continueFlag 0-检查押金 1-不检查
      orderEventSubmit(continueFlag = 0) {
        if (continueFlag === 0) {
          localStorage.removeItem('payFullDeposit');
        } else {
          // payFullDeposit 确认预约页面用到
          localStorage.setItem('payFullDeposit', 'true');
        }
        this.$store.commit('updateContinueFlag', { continueFlag: continueFlag });
        let that = this;
        // 模块的URL http://192.168.2.8:9093/wuzhu/swagger-ui.html
        // 毛总的URL http://192.168.2.8:9093/wuzhu/customerVerController/checkReserviationApp
        // let orderUrl = 'http://192.168.2.8:9093/wuzhu/customerVerController/checkReserviationApp'
        let orderUrl = '/wuzhu/customerVerController/checkReserviationApp';
        let param = {
          continueFlag: continueFlag, // 是否进行风控; 0要, 1不要
          fromFlag: 1,
          step: 'CRA',
          openId: this.$store.state.wxOpenID,
          channelNo: this.$store.state.channelNo,
          customerId: '001',
          // loginMobile: cslTestData.phoneNumber,
          gpsLongitude: that.gpsLongitude,
          gpsLatitude: that.gpsLatitude,
          gpsAddress: '',
          gpsProvince: '',
          gpsCity: '',
          gpsCountyDistrict: '',
          commodityJsonStr: that.getServerJsonStr()
        };
        that.$store.commit('updateLoadingStatus', { isLoading: true });
        that.$http.post(orderUrl, param).then(res => {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          let code = res && res.code;
          if (code === '00') {
            // 已经进行活体
            // 只要存在就直接存储到LocalStorage里面去
            that.jump2ViewArbitration(res);
          } else if (code === '1001') {
            // 用户还未开始登陆
            // 存储用户的登录页信息
            that.beforeJumpToLoginPage();
            that.$store.commit('prevPageMemory', { prevPage: 'GoodsDetailPage' });
            that.$router.push({ name: 'InitLogin' });
          } else if (code === '6032') {
            that.$vux.alert.show({
              content: res.msg,
              onHide() {
                that.$router.push({ name: 'HomePage' });
              }
            });
          } else if (code === '6031') {
            // 您当前暂未获得信用免押资格，是否选择全额支付押金进行租赁商品。
            that.$vux.confirm.show({
              content: res.msg,
              onConfirm() {
                that.orderEventSubmit(1);
              },
              onCancel() {
                that.$router.push({ name: 'HomePage' });
              }
            });
          } else {
            that.jump2ViewArbitration(res);
          }
        });
      },
      // 根据对应的返回的Step进行对应的逻辑跳转<处理> 理解下单之后的跳转逻辑
      jump2ViewArbitration(res) {
        let that = this;
        let data = res && res['data'];
        let step = data && data['step'];
        if (step !== undefined) {
          // 跳转到其他页面也一样需要存储
          let applySerialNo = data['applySerialNo'];
          that.$store.commit('updateApplySerialNo', { applySerialNo: applySerialNo });
          rentalCacheTool.saveApplyNo(applySerialNo);
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
            default:
              break;
          }
        } else {
          // 输出对应的错误信息
          let errorMsg = res['msg'] || '未知错误';
          that.reminderInfoMessage = errorMsg;
          that.reminderShow = true;
        }
      },
      // 开始跳转登录页面方面的处理逻辑
      beforeJumpToLoginPage() {
        // let currentUrl = window.location.origin
        // if (currentUrl.indexOf('com') === -1) {
        //   // 适配config里面的域名，都会包含dafyjk 直接改成 com
        //   // 如果找不到就说明本地环境<修改Store里面的openID>
        //   this.$store.commit('updateWXOpenID', { othersOpenID: 'wx9a12b852f16c0009' })
        // }
        let currentDataStr = this.getCacheJsonStr();
        rentalCacheTool.markGoodJump2LoginFlag(true);
        // 开启存储需要的信息
        rentalCacheTool.saveUserChooseInGoodsDetail(currentDataStr);
      },
      // 存储到服务器中需要的数据
      getServerJsonStr() {
        // 开始获取用户的选择规格参数
        let userChooseCategoryListTemp = [];
        // 增加日均租金字段
        for (let i = 0; i < this.userChooseCategoryList.length; i++) {
          let categoryItem = this.userChooseCategoryList[i];
          userChooseCategoryListTemp.push({
            categorySpecCode: categoryItem.categorySpecCode,
            specName: categoryItem.specName,
            specContent: categoryItem.specContent
          });
        }
        // 用户选择的产品
        let userChooseGoodTemp = {
          commodityNo: this.userChooseGood && this.userChooseGood.commodityNo,
          marketPrice: this.userChooseGood && this.userChooseGood.marketPrice,
          performanceBond: this.userChooseGood && this.userChooseGood.performanceBond
        };
        // 用户选择的金融产品
        let userChooseFinancialProductTemp = {
          productNo: this.userChooseFinancialProduct && this.userChooseFinancialProduct.productNo,
          totalDays: this.userChooseFinancialProduct && this.userChooseFinancialProduct.totalDays
        };
        // 用户选择的费用列表
        let userChooseFeeListTemp = [];
        for (let i = 0; i < this.userChooseFeeList.length; i++) {
          let feeItem = this.userChooseFeeList[i];
          userChooseFeeListTemp.push(feeItem.feeNo);
        }
        let userChooseFeeListTempStr = userChooseFeeListTemp.join(',');
        // 用户必选的费用列表
        // let additionalFeeListTemp = []
        // for (let i = 0; i < this.additionalFeeList.length; i++) {
        //   let feeItem = this.additionalFeeList[i]
        //   additionalFeeListTemp.push(
        //     feeItem.feeNo
        //   )
        // }
        // let additionalFeeListTempStr = additionalFeeListTemp.join(',')
        // 设置是否从跳转到登录页面
        var currentData = {
          leaseForOneDayPrice: this.leaseForOneDayPrice,
          localRequire: this.localRequire,
          gpsLongitude: this.gpsLongitude,
          gpsLatitude: this.gpsLatitude,
          fullName: this.parseData.commodities['fullName'],
          listImage: this.parseData.commodities['listImg'],
          userChooseGood: userChooseGoodTemp,
          userChooseCategoryList: userChooseCategoryListTemp,
          userChooseFinancialProduct: userChooseFinancialProductTemp,
          userChooseFeeInfo: userChooseFeeListTempStr,
          // additionFeeInfo: additionalFeeListTempStr
          productNo: this.userChooseFinancialProduct && this.userChooseFinancialProduct.productNo
        };
        return JSON.stringify(currentData);
      },
      // 需要缓存的数据以及对应的解析对应的数据
      getCacheJsonStr() {
        // 设置是否从跳转到登录页面
        var currentData = {
          localRequire: this.localRequire,
          gpsLongitude: this.gpsLongitude,
          gpsLatitude: this.gpsLatitude,
          fullName: this.parseData.commodities['fullName'],
          listImage: this.parseData.commodities['listImg'],
          userChooseGood: this.userChooseGood,
          userChooseCategoryList: this.userChooseCategoryList,
          userChooseFinancialProduct: this.userChooseFinancialProduct,
          userChooseFeeList: this.userChooseFeeList,
          additionalFeeList: this.additionalFeeList
        };
        return JSON.stringify(currentData);
      },
      // 解析Storage里面返回的数据
      parseJsonStrFromStorage(userChooseData) {
        // 开始配置用户测试数据
        this.parseStorageFlag = true
        this.userChooseCategoryList = userChooseData.userChooseCategoryList;
        this.userChooseGood = userChooseData.userChooseGood;
        // this.userChooseCategoryList = this.userChooseCategoryList.concat(userChooseData.userChooseCategoryList)
        this.userChooseFinancialProduct = userChooseData.userChooseFinancialProduct;
        this.userChooseFeeList = userChooseData.userChooseFeeList;
        this.additionalFeeList = userChooseData.additionalFeeList;
        this.localRequire = userChooseData.localRequire;
        this.gpsLongitude = userChooseData.gpsLongitude;
        this.gpsLatitude = userChooseData.gpsLatitude;
        // 开始清空对应Storage的存储
        rentalCacheTool.clearUserChooseInGoodsDetail();
        rentalCacheTool.clearGoodJump2LoginFlag();
      },
      // 获取地理位置
      // 调用微信的接口，获取对应的地理位置接口
      getUserLocaltion() {
        let that = this;
        that.localRequire = true; // 已经弹出过授权框了
        if (that.wxReady) {
          // 获取用户地理位置
          GetLocation({}, that)
            .then(position => {
              that.$store.commit('latMemory', { lat: position.coords.latitude });
              that.$store.commit('lngMemory', { lng: position.coords.longitude });

              that.gpsLatitude = position.coords.latitude;
              that.gpsLongitude = position.coords.longitude;
              that.orderEventSubmit();
            })
            .catch(error => {
              console.log('H5 getLocation API 错误代码:', error.code, ' 错误信息:', error.message);
              if (!isWeiXin()) {
              } else {
                // eslint-disable-next-line
                wx.getLocation({
                  type: 'wgs84', // gcj02
                  success: function(res) {
                    that.$store.commit('latMemory', { lat: res.latitude });
                    that.$store.commit('lngMemory', { lng: res.longitude });

                    that.gpsLatitude = res.latitude;
                    that.gpsLongitude = res.longitude;
                    that.orderEventSubmit();
                  },
                  cancel: function() {
                    // 用户取消情况，一样调用预约接口
                    that.orderEventSubmit();
                  },
                  fail: function(res) {
                    that.orderEventSubmit();
                  }
                });
              }
            });
        } else {
          // 没有强制要求用户授权地理位置，所以wx没有Ready的时候也一样跳转
          that.orderEventSubmit();
        }
      }
    },
    watch: {
      userChooseCategoryList(newval, oldval) {
        if (this.parseStorageFlag) {
          this.parseStorageFlag = false
          return
        }
        this.stockEmpty = false;
        this.userChooseGood = {};
        this.userChooseFinancialProduct = {};
        // 用户是否完成选择
        if (newval.length === this.parseData.categoryTable.length) {
          let cateGoryItem = newval[0];
          let productIndex = cateGoryItem.findGoodsIndexOfMyGoods(newval);
          if (productIndex !== -1) {
            let categoryChoose = cateGoryItem.MyGoods[productIndex];
            this.userChooseGood = this.parseData.commodities.listCommodity[categoryChoose.goodsIndex]
            // 开始查询当前商品的库存信息
            this.queryCommodityStoreNum(this.userChooseGood.commodityNo);
          } else {
            console.log('程序选择存在着 bug 请注意。。。。。');
          }
        } else {
          // this.stockEmpty = false;
          // this.userChooseGood = {};
          // this.userChooseFinancialProduct = {};
        }
      },
      userChooseFinancialProduct(newval, oldval) {
        let financialNo = newval['productNo'];
        if (financialNo !== undefined) {
          this.userChooseFeeList = [];
          // 判断是否存在着商品溢价，如果存在，就添加商品溢价，且为必选项目
          this.additionalFeeList = [];
          this.optionalFeeList = [];
          let feeList = this.userChooseFinancialProduct['listFeeInfo'];
          if (feeList !== undefined && feeList instanceof Array) {
            for (let i = 0; i < feeList.length; i++) {
              let feeItem = feeList[i];
              if (feeItem['isCancelled'] === '1') {
                this.optionalFeeList.push(feeItem);
              } else {
                this.additionalFeeList.push(feeItem);
              }
            }
          }
        } else {
        }
      },
      userChooseGood(newval, oldval) {
        // 先判断当前数值书否存在
      }
    }
  }
</script>

<style lang="less">
  @import './../../common/less/index';
  .goodsCategoryPlane{
    font-family: "PingFangSC-Medium";
    background: white;
    .sl-dialog {
      .sl-mask {
        position: fixed;
        z-index: 800;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
      }
      .sl-dialog-content {
        position: fixed;
        z-index: 900;
        width: 100%;
        bottom: 0;
        left: 50%;
        -webkit-transform: translate(-50%);
        transform: translate(-50%);
        background-color: #FFFFFF;
        /*text-align: center;*/
        border-radius: 3px;
        /*overflow: hidden;*/
      }
    }
    .goodsInfo{
      margin: 0px 15px;
      .border-1px();
      .goodsContent{
        padding: 15px 0px;
        display: flex;
        justify-content: flex-start;
        .imageDiv{
          margin-right: 15px;
          .goodsListImage{
            width: 80px;
            height: 80px;
          }
        }
        .infoPlane{
          .dayPrice{
            font-size:18px;
            font-family:PingFangSC-Medium;
            color:rgba(255,71,84,1);
            line-height:25px;
          }
          .dayUnit{
            font-size:14px;
            font-family:PingFangSC-Regular;
            color:rgba(136,136,136,1);
            line-height:20px;
          }
          .grayLabel{
            font-size:12px;
            font-family:PingFangSC-Regular;
            color:rgba(136,136,136,1);
            line-height:17px;
          }
          .blackLabel{
            font-size:12px;
            font-family:PingFangSC-Regular;
            color:rgba(17,17,17,1);
            line-height:17px;
          }
        }
      }
    }
    .scrollerWrap{
      max-height: 340px;
      overflow-y:scroll;
    }
    /*公共部分*/
    .sectionBox{
      margin: 15px 0px;
      .sectionTitle{
        font-family:PingFangSC-Regular;
        color:#111111;
        line-height:20px;
        font-size: 14px;
      }
      .sectionContent{
        margin-top: 15px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .categoryItem{
          margin-bottom: 10px;
          position: relative;
          font-size:12px;
          font-family:'PingFangSC-Regular';
          color:rgba(0,0,0,1);
          line-height:17px;
          margin-right: 15px;
          background:rgba(245,245,245,1);
          border-radius:4px;
          padding: 7px 15px 7px 15px;
          min-height: 18px;
          min-width: 36px;
          text-align: center;
        }
        .categoryItemSel{
          background:rgba(255,218,41,0.4);
          border-radius:4px;
          border:1px solid rgba(255,218,41,1)
        }
        .categoryItemDisable{
          color: #BBBBBB;
          background:rgba(245,245,245,1);
          border-radius:4px;
        }
        .categoryItemIcon{
          position: absolute;
          width: 15px;
          height: 15px;
          background: yellow;
          bottom: 0;
          right: 0;
          .bg('~./Fill');
        }
      }
    }
    .categoryPlane{
      padding: 0 15px;
    }
    .rentDayPlane{
      padding: 0 15px;
    }
    .feePlane{
      padding: 0 15px;
      margin-top: 15px;
      .service-title{
        font-size:14px;
        font-family:PingFangSC-Regular;
        color:rgba(17,17,17,1);
        line-height:20px;
      }
      .feeSection{
        margin-top: 15px;
      }
      .feeSectionTop{
        display: flex;
        justify-content: space-between;
      }
      .feeSection-left{
        display: flex;
        justify-content: flex-start;
        font-size:14px;
        font-family:'PingFangSC-Regular';
        color:rgba(17,17,17,1);
        line-height:20px;
        .feeSelCir{
           width: 18px;
           height: 18px;
           margin-right: 8px;
           .bg('~./Check-on')
         }
        .feeNorCir{
          width: 18px;
          height: 18px;
          margin-right: 8px;
          .bg('~./Check-off')
        }
      }
      .feeSection-right{
        height: 20px;
        padding: 0px 0px 0px 20px;
        line-height: 20px;
        color:rgba(0,122,255,1);
      }
      .feeSectionBottom{
        font-size:12px;
        font-family:'PingFangSC-Regular';
        color:rgba(136,136,136,1);
        line-height:17px;
        margin-top: 6px;
      }
    }
    .buttonPlane{
      margin-top: 30px;
      padding: 0px 15px 15px 15px;
      .weui-btn {
        background: #FFDA29 !important;
        font-size: 17px !important;
        text-align: center !important;
        border-radius: 100px !important;
      }
    }
  }
</style>
