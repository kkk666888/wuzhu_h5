import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import * as type from './types.js'
import moduleGoodsList from './modules/goodsList.js'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  filter: function(mutation) {
    // 过滤掉用户敏感信息, 不存在本地
    if (mutation.type === 'updateOcrMsg') {
      return false
    }
    return true
  }
})
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    moduleGoodsList
  },
  state: {
    token: null,
    // token: 'tk20180424141',
    typeNo: '', // 选择商品的type number 001手机， 002电脑
    goodsCheckNo: {key: '0', value: '全选'}, // 选择商品的checkBox
    osinfo: '', // 用户设备 信息
    channelNo: '001', // 微信入口001,京东入口003
    othersOpenID: '', // 线上环境 微信OpenID不要设置默认值
    phone: '', // 用户手机号码
    continueFlag: 0, // 是否进行风控; 0要, 1不要
    ocrMsg: { // OCR 信息
      name: '',
      number: '', // 身份证号码
      Chsi: ''
    },
    ocrMsgCheck: {
      isCheckCustomer: false, // 客户身份信息校验
      isCheckEducation: false // 客户学信信息校验
    },
    accessToken: null, // 京东 app
    JDaccessToken: null,
    applySerialNo: '', // 申请系列号
    orderNo: '',       // 当前选定的订单号
    recommeCode: '', // 推荐码，邀请码
    xiaobaiScores: '', // 小白分
    accountStatus: '', // 用户是否认证
    categoryCode: '', // 商品相关
    logisticsNo: '', // 物流单号
    isLoading: false,
    userID: '', // reporter相关
    contractNO: '', // reporter相关
    lat: '', // reporter相关
    lng: '', // reporter相关
    orderState: 0,
    selectedIndex: 0,
    prevPage: '', // 记录上一次存的路径
    IDInfoBtnState: 'save',
    categoryState: 'phone',
    payStyle: '0',    // 保存支付模式['0.首付按期支付','1.首付一次支付', '2.账单支付','4.买断']
    payChannel: '1',    // 支付渠道ID［'1':'微信支付', '2':'京东支付'］,默认是'1'
    tradeNum: '',
    routeSource: '',
    payAmount: '',    // 支付金额
    deductionAmount: '',    // 积分抵扣金额
    loadText: '加载中',
    goodsReturnOrderNo: '',  // 归还商品订单号
    orderDetailPageManager: {    // 为了搞定订单详情页面附用而引入
      orderDetailPush: false,   // 说明是否是开发者主动push 到空页面
      orderDetailCount: 0       // 用于统计用户进入的页面层数，方便返回
    }
  },
  getters: {
    selectedIndex: state => {
      return state.selectedIndex // watch路由
    }
  },
  mutations: {
    goodsReturnOrderNo(state, payload) {
      state.goodsReturnOrderNo = payload.goodsReturnOrderNo;
    },
    updateContinueFlag(state, payload) {
      state.continueFlag = payload.continueFlag
    },
    updateChannelNo(state, payload) { // 渠道号
      state.channelNo = payload.channelNo
    },
    updateAccessToken(state, payload) {
      state.accessToken = payload.accessToken
    },
    updateRecommeCode(state, payload) { // 推荐码，邀请码
      state.recommeCode = payload.recommeCode
    },
    updateApplySerialNo(state, payload) { // 申请系列号
      state.applySerialNo = payload.applySerialNo
    },
    updateOrderNo(state, payload) { // 订单号
      state.orderNo = payload.orderNo
    },
    updateTradeNum(state, payload) {
      state.tradeNum = payload.tradeNum
    },
    updatePayAmount(state, payload) {
      state.payAmount = payload.payAmount
    },
    updateDeductionAmount(state, payload) {
      state.deductionAmount = payload.deductionAmount
    },
    updatePayChannel(state, payload) {
      state.payChannel = payload.payChannel
    },
    updateRouteSource(state, payload) {
      state.routeSource = payload.routeSource
    },
    updateOsinfo(state, payload) {
      state.osinfo = payload.osinfo
    },
    updateWXOpenID(state, payload) { // 微信 openID
      state.othersOpenID = payload.othersOpenID
    },
    updateLoadingStatus(state, payload) { // 加载中
      state.isLoading = payload.isLoading
    },
    updateLoadingText(state, payload) { // 加载中
      state.loadText = payload.loadText
    },
    updatePhone(state, payload) { // 用户手机号码
      state.phone = payload.phone
    },
    updateOcrMsgCheck(state, payload) { // OCR 检查信息
      state.ocrMsgCheck = payload.ocrMsgCheck
    },
    updateOcrMsg(state, payload) { // OCR 信息
      state.ocrMsg = payload.ocrMsg
    },
    tokenMemory(state, payload) { // 用户 token
      state.token = payload.token
    },
    accountStatusMemory(state, payload) { // 个人信息认证状态
      state.accountStatus = payload.accountStatus
    },
    typeNoMemory(state, payload) { // 商品列表的选项number
      state.typeNo = payload.typeNo
    },
    goodsCheckNoMemory(state, payload) { // 商品列表的checkBoxNo
      state.goodsCheckNo = payload.goodsCheckNo
    },
    categoryCodeMemory(state, payload) { // 商品code
      state.categoryCode = payload.categoryCode
    },
    logisticsNoMemory(state, payload) { // 物流号
      state.logisticsNo = payload.logisticsNo
    },
    JDaccessTokenMemory(state, payload) { // JD accessToken
      state.JDaccessToken = payload.JDaccessToken
    },
    xiaobaiScoresMemory(state, payload) { // 小白分
      state.xiaobaiScores = payload.xiaobaiScores
    },
    prevPageMemory(state, payload) { // 记录上一次存的路径
      state.prevPage = payload.prevPage
    },
    userIDMemory(state, payload) { // reporter相关
      state.userID = payload.userID
    },
    contractNOMemory(state, payload) { // reporter相关
      state.contractNO = payload.contractNO
    },
    latMemory(state, payload) { // reporter相关
      state.lat = payload.lat
    },
    lngMemory(state, payload) { // reporter相关
      state.lng = payload.lng
    },
    payStyleMemory(state, payload) { // 支付分类： 支付首付，账单支付
      state.payStyle = payload.payStyle
    },
    orderDetailPageManagerMemory(state, payload) {
      state.orderDetailPageManager = payload.orderDetailPageManager
    },
    [type.ORDER_STATE](state, payload) { // 订单状态： 0 进行中，1 已完成，2 已取消
      state.orderState = payload.orderState
    },
    [type.SELECTED_INDEX](state, payload) { // 主页Tab状态： 0 首页，1 分类，2 我的
      state.selectedIndex = payload.selectedIndex
    },
    [type.ID_INFO_BTN_STATE](state, payload) { // 身份信息页面btn显示，save：保存， next: 下一步
      state.IDInfoBtnState = payload.IDInfoBtnState
    },
    [type.CATEGORY_STATE](state, payload) { // 分类： phone, computer
      state.categoryState = payload.categoryState
    }
  },
  plugins: [vuexLocal.plugin]
})

export default store
