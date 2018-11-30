<template>
  <div class="GoodsDetailPage">
    <div class="GoodsDetailPage_MainContent">
      <!--商品的Banner图-->
      <div class="GoodsDetailPageScrollerDiv">
        <swiper height="375px" v-model="banner_index" :show-dots="true" dots-position="center">
          <swiper-item class="GoodSDetailImageItem" v-for="(item, swiperIndex) in parseData.bannerList" :key="swiperIndex" @click.native="bannerClickIndex(swiperIndex, item)">
            <div class="GoodSDetailImage_div">
              <img class="GoodSDetailImage_img" v-lazy="item.img" />
            </div>
          </swiper-item>
        </swiper>
        <img v-if="isAlipayLife" class="alipay_hb_slogan" src="./alipay_hb_slogan.png" srcset="./alipay_hb_slogan.png 1x, ./alipay_hb_slogan@2x.png 2x">
      </div>
      <!--商品具体的名字，租金，以及商品价值的展示-->
      <div class="GoodsCategoryPlane">
        <!--商品详情部分-->
        <div class="GoodsConfigDetailPlane">
          <span class="GoodsConfigDetailPlane_info">{{ commodities.fullName }}</span>
          <span v-bind:class="stockBtnClass">{{ isStockNumEmpty }}</span>
        </div>
        <div class="Goods_least_sign_price">
          <span class="Goods_rent_price_value">日均租金:<em> ￥{{ leastRentDay }}</em> </span>
          <span class="Goods_rent_price_unit">/天起</span>
        </div>
        <div class="Good_sign_Price_Plane">
          <div class="Good_Sign_Price_Value">
            <div class="sign-price-content">
              <p>市场价: ￥{{ minMarketPrice }} 起</p>
              <p class="buyout-price">买断金：￥{{ defaultBuyOutPrice }}起<i class="icon iconfont icon-help1 color-blue" @click="showBuyOutDetail"></i></p>
            </div>
          </div>
        </div>
        <div class="safeguardMark" v-if="isAlipayLife">
          <img src="./safeguardMark_sf.png" srcset="./safeguardMark_sf.png 1x, ./safeguardMark_sf@2x.png 2x" />
        </div>
        <div class="safeguardMark" v-else>
          <img src="./safeguardMark_jd.png" srcset="./safeguardMark_jd.png 1x, ./safeguardMark_jd@2x.png 2x" />
        </div>

        <!-- <div class="safeguard" v-if="isAlipayLife">
          顺丰配送 · 品质保障 · 隐私保护 · 售后无忧
        </div>
        <div class="safeguard" v-else>
          京东配送 · 品质保障 · 隐私保护 · 售后无忧
        </div> -->
        <!-- <div class="buy-out-tip vux-1px-t">
          <span>机器到期买断价=商品价值*买断系数-已付租金</span>
        <span class="vux-1px">买断系数: {{ buyOutRatio }}%</span>
        </div> -->
      </div>
      <div class="padding-line"></div>
      <!--租机必看 和 租赁说明的展示框-->
      <div class="GoodsDetailTabDeclarePlane">
        <tab :line-width=3 custom-bar-width="60px" active-color='#FFDA29' v-model="declarePlaneIndex">
          <tab-item class="vux-center" :selected="declarePlaneDefault === item" v-for="(item, declareIndex) in declareList" @click="declarePlaneDefault = item" :key="declareIndex">{{item}}</tab-item>
        </tab>
        <!--商品详情的租机必看-->
        <div class="GoodsDetailTabDeclarePlane_Plane" v-show="declarePlaneIndex === 0">
          <img class="GoodsDetailTabDeclarePlane_Plane_img" v-for="(detailImageItem, detailImageIndex) in detailImageTextList" :key="detailImageIndex" v-lazy="detailImageItem" />
        </div>
        <!--租赁说明-->
        <div v-show="declarePlaneIndex === 1">
          <div class="GoodsDetailTabDeclarePlane_Plane" v-show="showRentHttpDesc">
            <img class="GoodsDetailTabDeclarePlane_Plane_img" v-for="(rentImageItem, rentImageIndex) in detailImgUrlsList" :key="rentImageIndex" v-lazy="rentImageItem" />
          </div>
          <div class="GoodsDetailTabDeclarePlane_Plane" v-show="!showRentHttpDesc">
            <lease-description :adv-title="leaseDescShorName" :left-day="leaseDescRentDay" :left-price="leaseDescRentTotal" :right-price="leaseDescMarketPrice" :isShowAdvantage="leaseShowCompare"></lease-description>
          </div>
        </div>
        <!-- 常见问题 -->
        <div v-show="declarePlaneIndex === 2">
          <Collapse :listData="QAData">
          </Collapse>
        </div>
      </div>
      <div class="marginBottom70px"></div>
    </div>
    <div class="GoodsDetail_Bottom_fixed vux-1px-t">
      <div class="GoodsDetail_Bottom_fixed_Content">
        <div class="leftSection">
          <span class="GoodsDetail_Bottom_fixed_Content_left GoodsDetail_Bottom_fixed_Content_txt1">日均租金</span>
          <span class="GoodsDetail_Bottom_fixed_Content_left GoodsDetail_Bottom_fixed_Content_txt2"><em> ￥{{ leastRentDay }}</em></span>
          <span class="GoodsDetail_Bottom_fixed_Content_left GoodsDetail_Bottom_fixed_Content_txt3">/天起</span>
        </div>
        <div @click="showCategoryPlanClick" v-bind:class="submitOrderBtnClass">立即下单</div>
      </div>
    </div>
    <!--移植弹窗部分的代码-->
    <div class="goodsCategoryPlane" v-show="categoryPlaneShow">
      <div class="sl-dialog">
        <!--阴影部分-->
        <transition :name="maskTransition">
          <div class="sl-mask" @click="planeHideClick"></div>
        </transition>
        <transition :name="dialogTransition">
          <div class="sl-dialog-content">
            <!--商品展示部分-->
            <div class="goodsInfo">
              <div class="goodsContent">
                <div class="imageDiv">
                  <img class="goodsListImage" v-lazy="parseData.commodities.listImg" />
                </div>
                <div class="infoPlane">
                  <div>
                    <span class="dayPrice">￥{{leaseForOneDayPrice}}</span>
                    <span class="dayUnit">/天起</span>
                  </div>
                  <div class="mt5">
                    <p class="grayLabel">月租金：￥{{leaseForOneMonthPrice}}</p>
                  </div>
                  <div class="Good_Sign_Price_Value">
                    <p class="goods-fee-item" v-if="!isUserChooseGoods">市场价：￥{{ minMarketPrice }} 起</p>
                    <p class="goods-fee-item" v-else>市场价: ￥{{ goodssignPrice || 0 }}</p>
                    <p class="buyout-price sign-price-content goods-fee-item"><span>买断金：￥{{ buyOutPrice }}</span><i class="icon iconfont icon-help1 color-blue" @click="showBuyOutDetail"></i></p>
                  </div>
                </div>
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
                    <div class="categoryItem" v-for="(subItem, subIndex) in item.Array" :key="subIndex" v-bind:data-Item="subItem" v-bind:class="{ 'categoryItemSel': categoryItemChooseClass(subItem, 2), 'categoryItem':(subItem.Status === 0),  'categoryItemDisable':(subItem.Status === 1)}" @click="categoryItemClick(subItem)">
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
                    租赁方式
                  </div>
                  <div class="sectionContent">
                    <div class="categoryItem" v-for="(rentItem, rentIndex) in parseData.rentStyleArray" :key="rentIndex" v-bind:class="{ 'categoryItemSel': getRentStyleItemStatus(rentItem, 2, true), 'categoryItem':(rentItem.Status === 0),  'categoryItemDisable':(rentItem.Status === 1)}" @click="rentItemClick(rentItem, true) ">
                      {{ rentItem.rentSolutionName }}
                      <div class="categoryItemIcon" v-show="rentItem.Status === 2"></div>
                    </div>
                  </div>
                </div>
                <div class="sectionBox">
                  <div class="sectionTitle">
                    租期
                  </div>
                  <div class="sectionContent">
                    <div class="categoryItem" v-for="(termItem, termIndex) in parseData.financeProductList" :key="termIndex" v-bind:class="{ 'categoryItemSel': getFinalproductNoStatus(termItem, 2), 'categoryItem':(termItem.Status === 0),  'categoryItemDisable':(termItem.Status === 1)}" @click="financialItemClick(termItem) ">
                      {{ termItem.termShortDes ? termItem.termShortDes : termItem.totalDays + '天' }}
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
                    <div class="feeSection-right" @click="feeDescItemClick">
                      <i class="icon iconfont icon-help1"></i>
                    </div>
                  </div>
                  <div class="feeSectionBottom">用机无忧，物主平台提供的意外保障服务</div>
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
                    <div class="feeSectionBottom">{{additionalItem.feeShortDesc}}</div>
                  </div>
                  <div class="feeSection" v-for="(feeItem, feeIndex) in optionalFeeList" :key="feeIndex">
                    <div class="feeSectionTop">
                      <div class="feeSection-left">
                        <div v-bind:class="feeListCircleClassObject(feeItem)" class="mr10" @click="feeListItemClick(feeItem)"></div>
                        <div class="">{{ feeItemNameDesc(feeItem) }}</div>
                      </div>
                      <div class="feeSection-right" @click="feeDescItemClick(feeItem)">
                        <i class="icon iconfont icon-help1"></i>
                      </div>
                    </div>
                    <div class="feeSectionBottom">{{feeItem.feeShortDesc}}</div>
                  </div>
                </div>
              </div>
            </div>
            <!--按钮部分说明-->
            <div class="buttonPlane">
              <x-button @click.native="goNext">确定</x-button>
            </div>
            <!--费用说明和其它对应的说明-->
            <fee-desc-alert :showScrollBox="showScrollBox" :potocol-type="true" :dialogTitle="dialogTitle" :dialogContent="dialogContent" @sureBtnClick="feeDescItemClick()">
              <div v-html="dialogContent" slot="htmlPocotol"></div>
            </fee-desc-alert>
            <toast v-model="reminderShow" type="text" width="20em">{{ reminderInfoMessage }}</toast>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Swiper,
  SwiperItem,
  XHeader,
  CheckIcon,
  Tab,
  TabItem,
  Flexbox,
  FlexboxItem,
  XDialog,
  TransferDomDirective as TransferDom,
  Toast,
  XButton
} from 'vux';
import LeaseDescription from './LeaseDescription';
import feeDescAlert from './../FeeItemSubView/FeeDescAlert';
import rentalCacheTool from './../../cacheUtil/rentalCacheTool';
import { GetLocation, isWeiXin, isAlipayLife, unionLogin } from './../../util/utils';
import { mapMutations } from 'vuex';
import { CategoryStatus, ParseData } from './GoodsCategoryTool';
// import GoodsCategoryPlane from './GoodsCategoryPlane';
import Collapse from '../../common/components/collapse/index.js';
import QAData from './QA_data.json'; // 常见问题数据

export default {
  name: 'GoodsDetailPage',
  directives: {
    TransferDom
  },
  components: {
    Swiper,
    SwiperItem,
    XHeader,
    CheckIcon,
    Tab,
    TabItem,
    Flexbox,
    FlexboxItem,
    XDialog,
    LeaseDescription,
    feeDescAlert,
    Toast,
    // GoodsCategoryPlane,
    XButton,
    Collapse
  },
  data() {
    return {
      maskTransition: 'vux-mask',
      dialogTransition: 'vux-dialog',

      parseData: {
        commodities: {
          listImg: ''
        }
      },
      commodities: {
        // 品类的详情
        fullName: '',
        detailImg: ''
      },
      banner_list: [],
      banner_index: 0,
      chooseFinancialProduct: {},
      userChooseGood: {},
      userChooseCategoryList: [],
      userChooseFinancialProduct: {},
      userChooseFeeList: [],
      additionalFeeList: [],
      optionalFeeList: [],
      demo: true,
      // 是否通过缓存的数据刷新了页面
      parseStorageFlag: false,
      // 是否有库存
      stockEmpty: false, //  是否无货  库存量为0  且限量才展示为无货
      // 图文详情展示
      detailImageTextList: [],
      // 租赁说明展示
      detailImgUrlsList: [], // 租赁说明的图文详情
      declareList: ['租机必看', '租赁说明', '常见问题'],
      declarePlaneIndex: 0,
      declarePlaneDefault: '租机必看',
      showRentHttpDesc: false, // 服务器上是否配置了租赁说明，如果配置了，那么轻设置为ture
      showScrollBox: false,
      dialogTitle: '',
      dialogContent: '',
      reminderInfoMessage: '', // 错误的提示信息
      reminderShow: false,
      categoryCode: '',
      // 使用微信部分获取用户的地理位置信息
      localRequire: false, // 点击立即下单的时候回开始询问一次
      wxReady: false,
      jsApiList: ['getLocation'],
      gpsLongitude: '', // 经纬度信息的缓存
      gpsLatitude: '',
      minMarketPrice: 0, // 最低市场价
      categoryPlaneShow: false,
      // 租赁说明部分的变量
      leaseDescShorName: '', // 该商品品类短名称
      leaseDescRentDay: 0, // 该商品品类下，最长最长租赁天数
      leaseDescRentTotal: 0, // 商品品类所有产品中的最低租金*最长的租赁天数
      leaseDescMarketPrice: 0, // 显示该商品品类中最小的价格
      leaseShowCompare: true, // 是否展示比较优势
      // 增加租赁方式的选定的金融产品列表
      userChooseRentProductList: [],
      userChooseRentItem: {},
      QAData: QAData.data, // 常见问题
      defaultBuyOutPrice: '', // 默认买断金
      buyOutPrice: '', // 买断金
      leastRentDay: '', // 商品详情日租金
      isAlipayLife: false // 当前是否支付宝生活号渠道
    };
  },
  mounted: function() {
    // 清除当前的滚动
    // window.scroll(0, 0);
    this.$nextTick(() => {
      let height = document.body.clientHeight;
      let setHeight = height - 110 - 89 - 100 + 'px';
      let scrollerWrap = this.$refs.scrollerWrap;
      scrollerWrap.style['max-height'] = setHeight;
    });
    this.updateRouteName({ routeName: 'GoodsDetailPage' }); // 设置过去信用认证路由
  },
  created() {
    // create 用于载入数据和进行对应网络请求来替代
    this.isAlipayLife = isAlipayLife();
    this.categoryCode = this.$store.state.categoryCode;
    // 设置_categoryCode,lastCategoryCode (该需求关联多个文件，关键字url_goto_goodsdetail)
    sessionStorage.setItem('_categoryCode', '');
    sessionStorage.setItem('lastCategoryCode', this.categoryCode);
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
        console.log('获取商品详细成功', res);
        // 最低市场价
        this.minMarketPrice = this.getMinMarketPrict(res.data.listCommodity);
        // 开始解析数据
        var goodsData = res && res['data'];
        var parseData = new ParseData(goodsData);

        this.leastRentDay = goodsData.leastRentDay;
        parseData.parseCategoryList();
        parseData.parseGoodsList();
        parseData.parseRentDayList();
        that.parseData = parseData;
        that.commodities = parseData.commodities;
        that.banner_list = parseData.bannerList;
        that.setupLeaseDescValue();
        that.detailImageTextList = parseData.getImageTxtList();
        that.detailImgUrlsList = parseData.getRentImageList();
        if (that.detailImgUrlsList.length) {
          that.showRentHttpDesc = true;
        } else {
          that.showRentHttpDesc = false;
        }
        // 开始判断下是否需要从storage上获取
        let choose = rentalCacheTool.isRequiredGetUserChoose();
        if (choose) {
          // 从Storage中获取
          let userChooseData = JSON.parse(rentalCacheTool.getUserChooseInGoodsDetail());
          that.parseJsonStrFromStorage(userChooseData);
        } else {
          // DO Nothing
        }
      } else {
        that.$vux.toast.show({
          text: res && res.msg
        });
      }
    });
  },
  computed: {
    // 根据当前的库存数量来展示对应的 立即下单按钮 以及 有货和无货的状态
    //  <!--stock_status_normal stock_status_empty -->
    stockBtnClass: function() {
      // if (this.stockEmpty === true) {
      //   return 'stock_status_empty';
      // } else {
      //   return 'stock_status_normal';
      // }
      return 'stock_status_normal';
    },
    // <!--submitOrderBtn_disable submitOrderBtn_normal -->
    submitOrderBtnClass: function() {
      // if (this.stockEmpty === true) {
      //   return 'submitOrderBtn_disable';
      // } else {
      //   return 'submitOrderBtn_normal';
      // }
      return 'submitOrderBtn_normal';
    },
    //  显示当前金融产品日租金的逻辑
    leaseForOneDayPrice: function() {
      let price = this.parseData && this.parseData.commodities && this.parseData.commodities['leastRentDay'];
      let avgRentAmt = this.userChooseFinancialProduct && this.userChooseFinancialProduct['avgRentAmt'];
      // console.log('price \t' + price + 'avgRentAmt\t' + avgRentAmt);
      if (avgRentAmt !== undefined) {
        price = avgRentAmt;
      }
      return price;
    },
    //  显示当前金融产品月租金的逻辑
    leaseForOneMonthPrice: function() {
      let price = this.parseData && this.parseData.commodities && this.parseData.commodities['leastRentDay'];
      let avgRentAmt = this.userChooseFinancialProduct && this.userChooseFinancialProduct['avgRentAmt'];
      if (avgRentAmt !== undefined) {
        price = avgRentAmt;
      }
      return parseInt(price * 30 + 0.5);
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
    },
    // 选定商品之后就能确定商品价值了
    goodssignPrice: function() {
      let price = this.commodities && this.commodities['leastSignPrice'];
      let signPrice = this.userChooseGood && this.userChooseGood['marketPrice'];
      if (signPrice !== undefined) {
        price = signPrice;
      }
      return price;
    },
    // 新增买断细数的展示
    buyOutRatio: function() {
      let radio = this.commodities && this.commodities['buyoutRatio'];
      if (radio === undefined) {
        radio = '';
      }
      return radio;
    },
    // 用户是否选定了商品
    isUserChooseGoods: function() {
      let commodityNo = this.userChooseGood['commodityNo'];
      if (commodityNo !== undefined) {
        return true;
      } else {
        return false;
      }
    },
    //  显示有货和没货的逻辑
    isStockNumEmpty: function() {
      // if (this.stockEmpty) {
      //   return '无货';
      // } else {
      //   return '有货';
      // }
      return '有货';
    }
  },
  watch: {
    goodssignPrice(newVal, oldVal) {
      this.getBuyoutPrice();
    },
    declarePlaneIndex(newval, oldval) {
      console.log('newval === ' + newval);
      this.outputScrollerTop();
    },
    userChooseCategoryList(newval, oldval) {
      if (this.parseStorageFlag) {
        this.parseStorageFlag = false;
        return;
      }
      this.stockEmpty = false;
      this.userChooseGood = {};
      this.userChooseFinancialProduct = {};
      this.userChooseRentProductList = [];
      this.userChooseRentItem = {};
      // 用户是否完成选择
      if (newval.length === this.parseData.categoryTable.length) {
        let cateGoryItem = newval[0];
        let productIndex = cateGoryItem.findGoodsIndexOfMyGoods(newval);
        if (productIndex !== -1) {
          let categoryChoose = cateGoryItem.MyGoods[productIndex];
          this.userChooseGood = this.parseData.commodities.listCommodity[categoryChoose.goodsIndex];
          // 开始查询当前商品的库存信息
          this.queryCommodityStoreNum(this.userChooseGood.commodityNo);
          // 看下当前的租赁方式是否只有一种
          // let listProduct = this.userChooseGood && this.userChooseGood['listProduct']
          // if (listProduct !== undefined && listProduct instanceof Array) {
          //   if (listProduct.length === 1) {
          //     this.userChooseRentItem = listProduct[0];
          //     this.userChooseRentProductList = listProduct;
          //   }
          // }
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
  },
  // beforeRouteLeave(to, from, next) {
  //   window.getSelection().removeAllRanges()
  //   next()
  // },
  methods: {
    ...mapMutations(['updateLoadingStatus', 'updateRouteName']),
    // 买断金说明
    showBuyOutDetail() {
      this.$vux.alert.show({
        title: '买断金',
        content: '买断金是指该款机器到期买断所需款项，如需提前买断以发起买断时页面展示支付金额为准。',
        onShow() {},
        onHide() {}
      });
    },
    getDefaultBuyoutPrice(radio) {
      let price = Math.ceil(this.minMarketPrice * this.buyOutRatio / 100 - this.leastRentDay * this.leaseDescRentDay);
      this.defaultBuyOutPrice = price;
    },
    getBuyoutPrice() {
      // 买断金计算公式是：“该商品的市场价(或最小市场价)*买断系数 - 商品的每日租金*选中的租期（如果没选中，默认是最大租期）”

      let buyoutPrice = Math.ceil(
        (this.goodssignPrice || this.minMarketPrice) * this.buyOutRatio / 100 -
          this.leaseForOneDayPrice * (this.userChooseFinancialProduct.totalDays || this.leaseDescRentDay)
      );
      this.buyOutPrice = buyoutPrice;
    },
    // 用于测试滚动的问题
    outputScrollerTop: function() {
      let a = document.getElementById('app').scrollTop;
      console.log('滑动距离为：', a);
      let height = document.getElementsByTagName('body')[0].clientHeight;
      console.log('当前客户端高度为：', height);
    },
    // 初始化租赁说明里面的内容
    setupLeaseDescValue: function() {
      this.leaseDescShorName = this.parseData && this.parseData.commodities && this.parseData.commodities.shortName;
      this.leaseDescRentDay = this.parseData && this.parseData.commodities && this.parseData.commodities.maxRentalDays;
      let tempDayPrice = this.parseData && this.parseData.commodities && this.parseData.commodities.leastRentDay;
      // this.leaseDescRentTotal = (((tempDayPrice * 100) * this.leaseDescRentDay) / 100).toFixed(2);
      // this.leaseDescRentTotal = mul2Num(tempDayPrice, this.leaseDescRentDay);
      // this.leaseDescRentTotal = parseInt(((tempDayPrice * 100) * this.leaseDescRentDay) / 100);
      this.leaseDescRentTotal = parseInt(tempDayPrice * this.leaseDescRentDay + 0.5);
      // this.leaseDescRentTotal = (((tempDayPrice * 100) * this.leaseDescRentDay) / 100).toLocaleString();
      // this.leaseDescRentTotal = ((parseInt(tempDayPrice * 100) * this.leaseDescRentDay) / 100).toLocaleString();
      this.leaseDescMarketPrice = this.minMarketPrice;

      this.getDefaultBuyoutPrice();

      // 租金大于市场价80%不显示租赁优势 不展示优势
      if (this.leaseDescRentTotal >= this.leaseDescMarketPrice * 0.8) {
        this.leaseShowCompare = false;
      } else {
        this.leaseShowCompare = true;
      }
    },
    // 用于控制隐藏选择规格面板
    planeHideClick() {
      this.categoryPlaneShow = false;
    },
    //  获取对应的租赁方式的状态
    getRentStyleItemStatus: function(rentItem, stu) {
      // 先判断是否在选定商品的金融产品里面
      let listProduct = this.userChooseGood && this.userChooseGood['listProduct'];
      if (listProduct !== undefined && listProduct instanceof Array) {
        let findResult = listProduct.findIndex(function(element, index, array) {
          return element.rentSolution === rentItem.rentSolution;
        });
        if (findResult === -1) {
          // 如果不存在添加到该列表中
          rentItem.Status = CategoryStatus.Disable;
        } else {
          if (rentItem.rentSolution === this.userChooseRentItem.rentSolution) {
            rentItem.Status = CategoryStatus.Selected;
          } else {
            rentItem.Status = CategoryStatus.Normal;
          }
        }
      } else {
        rentItem.Status = CategoryStatus.Disable;
      }
      return rentItem.Status === stu;
    },
    //  是否是当前选定的金融产品
    getFinalproductNoStatus: function(finalProductItem, stu) {
      // 先判断是否在选定商品的金融产品里面
      let listProduct = this.userChooseRentProductList;
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
    // 获取最低市场价
    getMinMarketPrict(listCommodity) {
      let price = 0;
      if (listCommodity && listCommodity.length > 0) {
        listCommodity.forEach((item, index) => {
          if (index > 0) {
            if (item.marketPrice < price) {
              price = item.marketPrice;
            }
          } else {
            price = item.marketPrice;
          }
        });
      }
      return price;
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
      this.parseStorageFlag = true;
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
    // 提交订单部分的判断跳转
    checkInfoComplete() {
      if (JSON.stringify(this.userChooseGood) === '{}') {
        this.reminderInfoMessage = '请选择对应商品规格';
        this.reminderShow = true;
        return false;
      }
      // 增加对于租赁方式的判定
      if (JSON.stringify(this.userChooseRentItem) === '{}') {
        this.reminderInfoMessage = '请选择您的租赁方式';
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
    },
    // 立即下单被点击
    showCategoryPlanClick() {
      this.categoryPlaneShow = true;
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
        that.reminderInfoMessage = '您选的商品规格已售罄，换个试试';
        that.reminderShow = true;
        return;
      }
      if (that.localRequire === false) {
        // 保证只会执行一次
        that.getUserLocaltion();
      } else {
        that.orderEventSubmit(); // 如果已经出现过获取地理位置的弹框
      }
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
      let orderUrl = '/wuzhu/customerVerController/checkReserviationApp';
      let param = {
        continueFlag: continueFlag, // 是否进行风控; 0要, 1不要
        fromFlag: 1,
        step: 'CRA',
        openId: this.$store.state.othersOpenID,
        channelNo: this.$store.state.channelNo,
        customerId: '001',
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
          if (res.data && res.data.continueFlag != null) {
            this.$store.commit('updateContinueFlag', { continueFlag: res.data.continueFlag });
          }
          // 已经进行活体
          // 只要存在就直接存储到LocalStorage里面去
          that.jump2ViewArbitration(res);
        } else if (code === '1001') {
          // 用户还未开始登陆
          // 存储用户的登录页信息
          that.beforeJumpToLoginPage();
          unionLogin(that).then(res => {
            that.orderEventSubmit();
          });
          // if (this.$store.state.channelNo === '004') {
          //   let isAliLifeLogin = sessionStorage.getItem('AliLifeLoginStatus');
          //   if (isAliLifeLogin !== 'true') {
          //     AliLifeLogin(this)
          //       .then(res => {
          //         this.orderEventSubmit();
          //       })
          //       .catch(err => {
          //         console.log(err);
          //       });
          //   }
          // } else {
          //   this.$router.push({ name: 'InitLogin' });
          // }
        } else if (code === '6031') {
          that.$vux.alert.show({
            content: res.msg,
            onHide() {
              that.$router.push({ name: 'HomePage' });
            }
          });
        } else if (code === '6032') {
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
    // 如果没有登录的话，这里开始存储对应的状态，以及标记到LocalStorage方便回来的时候验证和保留用户状态
    beforeJumpToLoginPage() {
      let currentDataStr = this.getCacheJsonStr();
      rentalCacheTool.markGoodJump2LoginFlag(true);
      // 开启存储需要的信息
      rentalCacheTool.saveUserChooseInGoodsDetail(currentDataStr);
    },
    // 问号被点击出现对应的弹框进行费用说明
    feeDescItemClick(feeItem) {
      if (this.showScrollBox === true) {
        this.showScrollBox = false;
      } else {
        this.dialogTitle = feeItem.feeName || '意外保障';
        this.dialogContent = ' ';
        if (feeItem['feeDesc'] !== undefined) {
          this.dialogContent = feeItem['feeDesc'];
        }
        this.showScrollBox = true;
      }
    },
    categoryItemChooseClass(subItem, statusNum) {
      subItem.getMyStatus(this.userChooseCategoryList);
      return subItem.Status === statusNum;
    },
    // 跳转到详情大图的轮播图
    bannerClickIndex: function(index, item) {
      // 存储用户的信息，进行和登录一样的操作<目前跳转到详情页面采用和登录页面一样的操作>
      let currentDataStr = this.getCacheJsonStr();
      rentalCacheTool.markGoodJump2LoginFlag(true);
      // 开启存储需要的信息
      rentalCacheTool.saveUserChooseInGoodsDetail(currentDataStr);
      this.$router.push({
        name: 'ImageDetailScrollerPage',
        params: { selectedIndex: index, banner_list: this.banner_list }
      });
    },
    //  是否是当前选定的金融产品
    finalproductNoIsSelected: function(finalProductItem) {
      if (finalProductItem.productNo === this.userChooseFinancialProduct.productNo) {
        return true;
      } else {
        return false;
      }
    },
    //  用户选择对应的租赁方式
    rentItemClick(rentItem) {
      let stu = rentItem.Status;
      if (stu === CategoryStatus.Selected) {
        this.userChooseRentItem = {};
        this.userChooseRentProductList = [];
        this.userChooseFinancialProduct = {};
      } else {
        // 转化成当前费用列表中具体的费用
        this.userChooseRentItem = rentItem;
        // 开始筛选对应的金融产品列表
        this.userChooseRentProductList = [];
        let listProduct = this.userChooseGood && this.userChooseGood['listProduct'];
        if (listProduct !== undefined && listProduct instanceof Array) {
          for (let i = 0; i < listProduct.length; i++) {
            let product = listProduct[i];
            if (product.rentSolution === rentItem.rentSolution) {
              this.userChooseRentProductList.push(product);
            }
          }
          // 增加开始判断的逻辑，如果只有一个租期符合要求那么久默认选定
          if (this.userChooseRentProductList.length === 1) {
            this.userChooseFinancialProduct = this.userChooseRentProductList[0];
          }
        }
      }
    },
    //  用户选择金融产品的处理
    financialItemClick(financialItem) {
      // console.log(financialItem);
      let stu = financialItem.Status;
      if (stu === CategoryStatus.Selected) {
        this.userChooseFinancialProduct = {};
        this.getBuyoutPrice();
      } else {
        // 转化成当前费用列表中具体的费用
        // let listProduct = this.userChooseGood && this.userChooseGood['listProduct'];
        let listProduct = this.userChooseRentProductList;
        if (listProduct !== undefined && listProduct instanceof Array) {
          let findResult = listProduct.findIndex(function(element, index, array) {
            return element.totalDays === financialItem.totalDays;
          });
          if (findResult !== -1) {
            this.userChooseFinancialProduct = listProduct[findResult];
            this.getBuyoutPrice();
          }
        }
      }
    },
    categoryItemClick(subItem) {
      // console.log(subItem.specContent + '=== 被点击了');
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
        'icon iconfont icon-yuanxingweixuanzhong': !feeItemChoose,
        'icon iconfont feeSelCir': feeItemChoose
      };
    },
    // 费用列表被点击选择
    feeListItemClick(feeItem) {
      let feeItemIndex = this.IsInUserChooseFeeList(feeItem);
      if (feeItemIndex === -1) {
        // 增加该选项
        this.userChooseFeeList.push(feeItem);
      } else {
        // 删除该选项
        this.userChooseFeeList.splice(feeItemIndex, 1);
      }
    },
    // 费用的显示逻辑<支付方式，费用名称，费用计算基数>
    feeItemNameDesc(feeItem) {
      let feeName = feeItem && feeItem['feeName'];
      return feeName;
    }
  }
};
</script>

<style lang="less">
@import './../../common/less/index';
.GoodsDetailPage {
  background: white;
  font-family: 'PingFang SC';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow-y: hidden;
  display: flex;

  .vux-header {
    background-color: #ffffff !important;
    position: fixed !important;
    z-index: 100 !important;
    width: 100% !important;
  }
  .vux-header .vux-header-title {
    color: #222222 !important;
    font-size: 19px !important;
    font-family: 'PingFangSC-Regular' !important;
    background: white !important;
  }
  .GoodsDetailPage_MainContent {
    width: 100%;
    position: relative;
    overflow-y: scroll;
    .GoodsDetailPageScrollerDiv {
      .vux-icon-dot.active {
        background-color: @orange;
      }
      .alipay_hb_slogan {
        width: 100%;
      }
    }
    .GoodSDetailIndexLabel {
      position: absolute;
      top: 20px;
      right: 20px;
      text-align: center;
      .IndicatePlaneBg {
        background: @gray-8;
        border-radius: 100px;
        padding: 0px 8px;
        .IndicatePlane_currentIndex {
          font-size: 13px;
          color: #000000;
          letter-spacing: 0;
          text-align: right;
        }
        .IndicatePlaneBg_TotalIndex {
          font-size: 10px;
          color: #000000;
          letter-spacing: 0;
          text-align: left;
        }
      }
    }

    .GoodSDetailImageItem {
      .GoodSDetailImage_div {
        text-align: center;
        .GoodSDetailImage_img {
          width: 100%;
        }
      }
    }

    .GoodsCategoryPlane {
      margin-left: 15px;
      margin-right: 15px;
      margin-bottom: 15px;
      margin-top: 13px;
      .GoodsConfigDetailPlane_info {
        font-size: 16px;
        font-weight: bold;
        letter-spacing: 0;
        line-height: 20px;
      }
      .stock_status_normal {
        white-space: nowrap;
        font-size: 10px;
        color: #ffffff;
        letter-spacing: 0;
        background: @orange;
        padding: 1px 2.5px;
        border-radius: 4px;
        line-height: 18px;
      }
      .stock_status_empty {
        white-space: nowrap;
        font-size: 10px;
        color: #ffffff;
        letter-spacing: 0;
        background: #ff3333;
        padding: 1px 2.5px;
        border-radius: 4px;
        line-height: 18px;
      }
      .Goods_least_sign_price {
        margin-top: 12px;
      }
    }
    .Goods_least_sign_price {
      .Goods_rent_price_value {
        font-size: 14px;
        font-weight: bold;
        color: #222222;
        letter-spacing: 0;
        line-height: 20px;
        em {
          font-style: normal;
          font-size: 16px;
          font-weight: bold;
          color: #ff4754;
        }
      }
      .Goods_rent_price_unit {
        font-size: 10px;
        color: @gray-8;
        letter-spacing: 0;
        line-height: 10px;
      }
    }
    .Good_sign_Price_Plane {
      position: relative;
      padding-bottom: 15px;
      margin-bottom: 12px;
      border-bottom: 1px solid #ddd;
      .rentButton {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        border: 2px solid #262628;
        border-radius: 100px;
        width: 70px;
        height: 25px;
        background: white;
      }
    }

    .safeguardMark {
      // padding: 0 8px;
      img {
        width: 100%;
      }
    }
    .safeguard {
      // width:330px;
      width: 100%;
      height: 17px;
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 17px;
      text-align: justify;
    }
    .safeguard:after {
      display: inline-block;
      width: 100%;
      content: '';
    }
    .buy-out-tip {
      font-size: 11px;
      margin: 14px 0;
      color: @gray-8;
      padding-top: 14px;
      > span {
        &:first-child {
          color: rgba(255, 71, 84, 1);
          padding: 1px 6px;
          &::before {
            border-color: #ff505d;
          }
        }
        &:last-child {
          margin-left: 7px;
        }
      }
    }
    .padding-line {
      height: 15px;
      background: @bg;
      width: 100%;
    }
    .GoodsDetailPadding {
      background: #f4f4f4;
      width: 100%;
      height: 2px;
    }
    .GoodsDetailTabDeclarePlane {
      /*!*margin-bottom: 70px;*!  手机中会被忽略*/
      .vux-tab .vux-tab-item.vux-tab-selected {
        color: #222 !important;
        border-bottom: 3px solid @orange;
      }
      /*去掉Tab的阴影*/
      .vux-tab-warp {
        box-shadow: 0 0px 0px 0 #dadada !important;
      }
      .GoodsDetailTabDeclarePlane_GoodsDetail {
        .GoodsDetailTabDeclarePlane_GoodsDetail_img {
          width: 100%;
          height: 200px;
        }
      }
      .GoodsDetailTabDeclarePlane_txtDetail {
        line-height: 300px;
        text-align: center;
      }
      .GoodDetailTabDeclarePlane_hidden {
        display: none;
      }
      .GoodsDetailTabDeclarePlane_Plane {
        width: 100%;
        min-height: 300px;
        font-size: 0; // 用于去掉图片之间的多余的间距
        padding-bottom: 20px; // 最后面间距一点点空隙
        .GoodsDetailTabDeclarePlane_Plane_img {
          width: 100%;
        }
        .GoodsDetailTabDeclarePlane_Plane_headline {
          font-size: 18px;
          padding-bottom: 10px;
          font-weight: bold;
        }
      }

      .QA {
        .weui-cells {
          margin-top: -1px;
        }
      }
    }
    .marginBottom70px {
      width: 100%;
      height: 70px;
      background: @bg;
    }
  }
  .GoodsDetail_Bottom_fixed {
    position: absolute;
    width: 100%;
    height: 48px;
    opacity: 0.91;
    background: #fbfbfb;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 2.5;
    .GoodsDetail_Bottom_fixed_Content {
      display: flex;
      justify-content: space-between;
      .leftSection {
        margin-left: 15px;
        margin-right: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .GoodsDetail_Bottom_fixed_Content_left {
          display: inline-block;
        }
        .GoodsDetail_Bottom_fixed_Content_txt1 {
          font-size: 12px;
          letter-spacing: -0.2px;
        }
        .GoodsDetail_Bottom_fixed_Content_txt2 {
          font-size: 20px;
          color: #000000;
          letter-spacing: -0.2px;
          em {
            color: @red;
            font-style: normal;
            font-weight: bold;
          }
        }
        .GoodsDetail_Bottom_fixed_Content_txt3 {
          font-size: 12px;
          color: #000000;
          letter-spacing: -0.2px;
        }
      }
      .submitOrderBtn_normal {
        height: 100%;
        min-width: 120px;
        display: inline-block;
        font-size: 17px;
        color: #222222;
        text-align: center;
        background: @orange;
        line-height: 3;
      }
      .submitOrderBtn_disable {
        height: 100%;
        min-width: 120px;
        display: inline-block;
        font-size: 17px;
        color: #ffffff;
        text-align: center;
        background: #dddddd;
        line-height: 3;
      }
    }
  }
  .sign-price-content {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    line-height: 25px;
    color: #888;
    .color-blue {
      color: #007aff;
    }
  }
  .buyout-price {
    font-size: 12px;
    .icon-help1 {
      vertical-align: -2px;
      margin-left: 8px;
    }
  }
  .mr10 {
    margin-right: 10px;
  }
}
.dialog-demo {
  font-size: 16px;
  .showScrollBox_hd {
    padding: 1.3em 1.6em 0.5em;
    .showScrollBox_hd_title {
      font-weight: 400;
      font-size: 18px;
    }
  }
  .showScrollBox_bd {
    padding: 2px;
    min-height: 40px;
    font-size: 15px;
    line-height: 1.3;
    word-wrap: break-word;
    word-break: break-all;
    color: #999999;
  }
  .showScrollBox-dialog__ft {
    position: relative;
    line-height: 48px;
    font-size: 18px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    .border-1px-top();
    .showScrollBox-dialog__btn {
      display: block;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      color: #3cc51f;
      text-decoration: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      position: relative;
    }
    .showScrollBox-dialog__btn_primary {
      color: @orange;
    }
  }
}

/*弹窗选择规格部分的代码*/
.goodsCategoryPlane {
  font-family: 'PingFangSC-Medium';
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
      background-color: #ffffff;
      border-radius: 3px;
    }
  }
  .goodsInfo {
    margin: 0px 15px;
    .border-1px();
    .goodsContent {
      padding: 15px 0px;
      display: flex;
      justify-content: flex-start;
      .imageDiv {
        margin-right: 15px;
        .goodsListImage {
          width: 80px;
          height: 80px;
        }
      }
      .infoPlane {
        width: 100%;
        .dayPrice {
          font-size: 18px;
          font-family: PingFangSC-Medium;
          color: rgba(255, 71, 84, 1);
          line-height: 25px;
        }
        .dayUnit {
          font-size: 14px;
          font-family: PingFangSC-Regular;
          color: rgba(136, 136, 136, 1);
          line-height: 20px;
        }
        .grayLabel {
          font-size: 12px;
          font-family: PingFangSC-Regular;
          color: rgba(136, 136, 136, 1);
          line-height: 17px;
        }
        .blackLabel {
          font-size: 12px;
          font-family: PingFangSC-Regular;
          color: rgba(17, 17, 17, 1);
          line-height: 17px;
        }
      }
    }
  }
  .scrollerWrap {
    max-height: 340px;
    overflow-y: scroll;
  }
  /*公共部分*/
  .sectionBox {
    margin: 7px 0px;
    .sectionTitle {
      font-family: PingFangSC-Regular;
      color: #111111;
      line-height: 20px;
      font-size: 14px;
    }
    .sectionContent {
      margin-top: 10px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .categoryItem {
        margin-bottom: 10px;
        position: relative;
        font-size: 12px;
        font-family: 'PingFangSC-Regular';
        color: rgba(0, 0, 0, 1);
        line-height: 15px;
        margin-right: 14px;
        background: rgba(245, 245, 245, 1);
        border-radius: 4px;
        padding: 7px 15px 7px 15px;
        min-height: 16px;
        min-width: 36px;
        text-align: center;
        border: 1px solid rgba(245, 245, 245, 1);
      }
      .categoryItemSel {
        background: rgba(255, 218, 41, 0.4);
        border-radius: 4px;
        border: 1px solid rgba(255, 218, 41, 1);
        border: 1px solid #ffda29;
      }
      .categoryItemDisable {
        color: #bbbbbb;
        background: rgba(245, 245, 245, 1);
        border-radius: 4px;
        border: 1px solid rgba(245, 245, 245, 1);
      }
      .categoryItemIcon {
        position: absolute;
        width: 15px;
        height: 15px;
        bottom: 0;
        right: 0;
        .bg('~./Fill');
      }
    }
  }
  .categoryPlane {
    padding: 0 15px;
  }
  .rentDayPlane {
    padding: 0 15px;
  }
  .feePlane {
    padding: 0 15px;
    margin-top: 7px;
    .service-title {
      font-size: 14px;
      font-family: PingFangSC-Regular;
      color: rgba(17, 17, 17, 1);
      line-height: 20px;
    }
    .feeSection {
      margin-top: 15px;
    }
    .feeSectionTop {
      display: flex;
      justify-content: space-between;
    }
    .feeSection-left {
      display: flex;
      justify-content: flex-start;
      font-size: 14px;
      font-family: 'PingFangSC-Regular';
      color: rgba(17, 17, 17, 1);
      line-height: 20px;
      .feeSelCir {
        width: 18px;
        height: 18px;
        margin-right: 8px;
        .bg('~./Check-on');
      }
      .feeNorCir {
        width: 18px;
        height: 18px;
        margin-right: 8px;
        .bg('~./Check-off');
      }
    }
    .feeSection-right {
      height: 20px;
      padding: 0px 0px 0px 20px;
      line-height: 20px;
      color: rgba(0, 122, 255, 1);
    }
    .feeSectionBottom {
      font-size: 12px;
      font-family: 'PingFangSC-Regular';
      color: rgba(136, 136, 136, 1);
      line-height: 17px;
      margin-top: 6px;
    }
  }
  .buttonPlane {
    margin-top: 30px;
    .weui-btn {
      background: #ffda29 !important;
      font-size: 17px !important;
      text-align: center !important;
      border-radius: 0px !important;
    }
  }
  .Good_Sign_Price_Value {
    font-size: 12px;
    color: @gray-8;
    letter-spacing: 0;
  }
  .goods-fee-item {
    line-height: 17px;
    margin-top: 3px;
  }
}
</style>
