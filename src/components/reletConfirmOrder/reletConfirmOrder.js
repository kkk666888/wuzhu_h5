import htmlPannel from './../FeeItemSubView/HtmlPannel'
import { PopupHeader, Popup } from 'vux'
export default {
  name: 'reletConfirmOrder',
  components: {
    htmlPannel,
    PopupHeader,
    Popup
  },
  data() {
    return {
      showRentItems: false, // 展开|隐藏租期选项
      showMoneyDetail: false,
      showItemPlan: false, // 显示|隐藏每期费用明细
      potocolShow: false,
      potocolTitle: '',
      potocolUrl: '',
      orderInfo: {}, // 订单实体
      selectedTenancyTerm: null, // 当前选中的租期
      selectedPayType: '', // 选中的支付方式
      planMoneyModel: {} // 费用相关
    }
  },
  computed: {
    // 规格
    specContentList() {
      let list = []
      if (this.orderInfo && this.orderInfo.baseOrder && this.orderInfo.baseOrder.specContentList) {
        list = this.orderInfo.baseOrder.specContentList.split(',')
      }
      return list
    },
    // 支付方式-分期
    showStagePay() {
      let result = false
      if (this.selectedTenancyTerm) {
        if (this.selectedTenancyTerm.rentPayStyle.indexOf('0') >= 0) {
          result = true
        }
      }
      return result
    },
    // 支付方式-全额
    showTotalPay() {
      let result = false
      if (this.selectedTenancyTerm) {
        if (this.selectedTenancyTerm.rentPayStyle.indexOf('1') >= 0) {
          result = true
        }
      }
      return result
    }
  },
  methods: {
    handerSelectedTenancyItem() {
      if (this.selectedTenancyTerm && this.selectedTenancyTerm.listFeeInfo && this.selectedTenancyTerm.listFeeInfo.length > 0) {
        this.selectedTenancyTerm.listFeeInfo.forEach(item => {
          item._check = item.isCancelled === '0'
          item._fee = ''
          item._feeDay = ''
          if (item.feeAccessWayConfig) {
            let arr = item.feeAccessWayConfig.split(',')
            if (arr.length === 2) {
              item._fee = arr[1]
              item._feeDay = arr[0]
            }
          }
        })
      }
    },
    // 增值服务项单击事件
    feeItemClick(item) {
      if (item.isCancelled === '1') {
        item._check = !item._check
        this.getFeeDeteil()
      }
    },
    // 加载数据
    loadData() {
      let orderNo = this.$route.params.orderNo
      let url = '/wuzhu/renew/renewCommodity?orderNo=' + orderNo
      // this.$vux.loading.show({ text: 'Loading' })
      this.$http.get(url).then((res) => {
        this.$vux.loading.hide()
        if (res.code === '00' && res.data) {
          this.orderInfo = res.data
          if (this.orderInfo.productList && this.orderInfo.productList.length > 0) {
            this.orderInfo.productList.forEach(item => {
              item._id = item.productNo + '_' + item.totalDays
            })
            this.selectedTenancyTerm = this.orderInfo.productList[0]
            this.handerSelectedTenancyItem()
            this.setDefaultPayType()
            this.getFeeDeteil()
          }
        } else if (res.code === '001') {
          // 先结清当前订单所有应付租金再续租
          this.$vux.alert.show({
            content: res.msg,
            onHide() {
              history.back()
            }
          })
        } else {
          this.$vux.alert.show({ content: res.msg })
        }
      }).catch((err) => {
        this.$vux.loading.hide()
        console.log(err)
      })
    },
    // 选择默认支付方式
    setDefaultPayType() {
      if (this.selectedTenancyTerm) {
        let payList = this.selectedTenancyTerm.rentPayStyle.split(',')
        if (payList.length > 0) {
            this.selectedPayType = payList[0]
        }
      }
    },
    // 展开|隐藏租期选项
    showRentItem() {
      if (this.orderInfo.productList && this.orderInfo.productList.length > 1) {
        this.showRentItems = !this.showRentItems
      }
    },
    // 租期选择单击事件
    rentItemClick(item) {
      let isSameOne = this.selectedTenancyTerm && this.selectedTenancyTerm._id === item._id
      this.selectedTenancyTerm = item
      this.handerSelectedTenancyItem()
      this.setDefaultPayType()
      this.showRentItem()
      if (!isSameOne) {
        this.getFeeDeteil()
      }
    },
    // 显示支付明细
    moneyDetailClick() {
      this.showMoneyDetail = !this.showMoneyDetail
    },
    // 处理每期费用试算数据,返回新实体
    handerRentPeriodsFeeData(data, payType) {
      console.log('handerRentPeriodsFeeData data=' + JSON.stringify(data.planMoneyVOList) + ',payType=' + payType)
      let item = {}
      item.totalTerms = 0
      item.cashOffsetAmt = '' // 物主卡抵扣
      item.subAccount = '' // 账户抵扣
      item._actualPay = '' // 实际支付金额
      item._pay = '' // 订单总金额
      item.terms = []
      let model = {}
      for (let i in data.planMoneyVOList) {
        let planMoney = data.planMoneyVOList[i]
        if ((planMoney.oneTimePay && payType === '1') || (!planMoney.oneTimePay && payType === '0')) {
          // 一次性支付
          if (planMoney.oneTimePay && payType === '1') {
            item.totalTerms = 1
          } else {
            // 分期支付
            item.totalTerms = data.totalTerms
          }
          item.cashOffsetAmt = planMoney.cashOffsetAmt
          item.subAccount = planMoney.cashAmt
          item._actualPay = planMoney.needAmt
          item._pay = planMoney.totalAmt
          break
        }
      }
      console.log('item=' + JSON.stringify(item))
      if (payType === '0') {
        model = data.mapStage
      } else {
        model = data.mapOneOffPay
        item.totalTerms = 1
      }
      if (model) {
        for (var i in model) {
          let stage = model[i]
          let stageItem = this.common.deepCopy(stage[0])
          stageItem._showDetail = false
          stageItem._details = []
          stageItem._pay = 0
          stage.forEach(child => {
            stageItem._pay += parseFloat(child.payAmt)
            if (!child.feeName) {
              child.feeName = payType === '0' ? '当期租金' : '总租金'
            }
            stageItem._details.push(child)
          })
          item.terms.push(stageItem)
        }
      }
      // let cashOffsetAmt = parseFloat(data.cashOffsetAmt)
      // item.cashOffsetAmt = cashOffsetAmt
      // let subAccount = parseFloat(data.subAccount)
      // if (item.terms && item.terms.length > 0) {
      //   let term = item.terms[0]
      //   item._pay = term._pay
      //   item._actualPay = parseFloat(term._pay)
      //   if (subAccount > item._pay) {
      //     subAccount = item._pay
      //   }
      //   if (subAccount && parseFloat(subAccount) > 0) {
      //     item._actualPay = parseFloat(item._actualPay) - parseFloat(subAccount)
      //   }
      // }
      // item.subAccount = subAccount
      return item
    },
    // 获取费用信息,包括费用试算
    getFeeDeteil() {
      let url = '/wuzhu/renew/renewRepaymentPlan'
      let param = {
        isInvalid: this.orderInfo.isInvalid, // Y:下架   N：没有下架
        orderNo: this.orderInfo.baseOrder.orderNo, // 订单号：下架产品    该字段必须存在
        productNo: this.selectedTenancyTerm.productNo, // 金融产品编号   非下架产品  该字段必须存在
        totaldays: this.selectedTenancyTerm.totalDays, // 租期天数
        feeInfoList: [], // 费用列表  用户页面上处于选中状态的费用信息
        activeDate: this.orderInfo.activeDate, // 激活日
        discount: this.orderInfo.discount// 折扣数
      }
      if (this.selectedTenancyTerm.listFeeInfo && this.selectedTenancyTerm.listFeeInfo.length > 0) {
        this.selectedTenancyTerm.listFeeInfo.forEach(item => {
          if (item._check) {
            param.feeInfoList.push(item.feeNo)
          }
        })
      }
      // this.$vux.loading.show({ text: 'Loading' })
      this.$http.post(url, param).then((res) => {
        this.$vux.loading.hide()
        if (res.code === '00' && res.data) {
          this.repaymentPlanData = res.data
          this.initPlanMoneyModel()
        } else {
          this.$vux.alert.show({ content: res.msg })
        }
      }).catch(() => {
        this.$vux.loading.hide()
      })
    },
    initPlanMoneyModel() {
      if (this.repaymentPlanData) {
        this.planMoneyModel = this.handerRentPeriodsFeeData(this.repaymentPlanData, this.selectedPayType)
      }
    },
    // 显示每期费用试算明细弹窗
    showItemPlanClick() {
      this.initPlanMoneyModel()
      if (this.planMoneyModel && this.planMoneyModel.terms) {
        this.showItemPlan = true
      }
    },
    // 隐藏每期费用弹窗
    hideItemPlan() {
      this.showItemPlan = false
    },
    // 显示|隐藏每期费用明细
    showItemPlanDetailClick(item) {
      item._showDetail = !item._showDetail
    },
    // 支付方式单击事件
    payTypeClick(type) {
      this.selectedPayType = type
      this.initPlanMoneyModel()
    },
    // 查看协议
    protocolClick(type) {
      let currentPath = window.location.href.split('/dist')[0]
      switch (type) {
        case 1:
          this.potocolUrl = currentPath + '/doc/wx/user_lease_agreement.htm'
          break;
        case 2:
          this.potocolUrl = currentPath + '/doc/wx/user_lease_supplementary_agreement.htm'
          break;
      }
      this.potocolShow = true
    },
    potocolSureClick() {
      this.potocolShow = false
      this.potocolUrl = ''
    },
    // 去支付
    pay() {
      if (!this.selectedTenancyTerm) {
        this.showInfo('请选择租期')
        return
      }
      if (this.selectedPayType === '') {
        this.showInfo('请选择支付方式')
        return
      }
      if (this.planMoneyModel.terms && this.planMoneyModel.terms.length > 0) {
        this.$store.commit('payStyleMemory', { payStyle: '5' })
        this.$store.commit('updateOrderNo', { orderNo: this.orderInfo.baseOrder.orderNo })
        this.$store.commit('updatePayAmount', { payAmount: parseFloat(this.planMoneyModel._actualPay) })
        this.$store.commit('updateCashOffsetAmt', { cashOffsetAmt: parseFloat(this.planMoneyModel.cashOffsetAmt) }) // 物主卡抵扣金额
        this.$store.commit('updateDeductionAmount', { deductionAmount: parseFloat(this.planMoneyModel.subAccount) }) // 账户抵扣金额
        this.$store.commit('updateRouteSource', { routeSource: 'reletConfirmOrder' })
        // let term = this.planMoneyModel.terms[0]
        let param = {
          reletDay: this.selectedTenancyTerm.totalDays, // 续租天数
          monthlyPayStyle: this.selectedPayType, // （0分期，1 一次性）
          feeInfoList: []
        }
        let term = this.planMoneyModel.terms[0]
        if (term._details && term._details.length > 0) {
          term._details.forEach(m => {
            if (m.feeNo) {
              param.feeInfoList.push(m.feeNo)
            }
          })
        }
        this.$router.replace({name: 'WXPayCashing', params: param})
      } else {
        this.showInfo('数据错误，请刷新页面重试')
      }
    },
    showInfo(msg) {
      this.$vux.toast.text(msg, 'middle')
    }
  },
  mounted() {
    this.repaymentPlanData = null // 费用实体
    this.loadData()
  }
}
