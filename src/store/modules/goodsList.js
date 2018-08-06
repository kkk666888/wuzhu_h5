/**
 * 每项商品需要存储:
 * {
 *  curBrand,
 *  prevBrand,
 *  curSort,
 *  prevSort,
 *  curFilter,
 *  prevFilter
 * }
 * */

const state = {
  typeObj: {},
  typeObjTpl: {
    brand: {
      brandList: [], // 品牌列表
      brandCheckItems: [''], // 已生效
      curBrandCheckItems: [''], // 当前
      brandText: '全部品牌', // 品牌显示文字
      brandNum: 1,
      isSelected: false // 是否选择过
    },
    sort: {
      sortList: [], // 列表
      sortCheckItems: '', // 已生效
      cursSortCheckItems: '', // 当前
      isSelected: false // 是否选择过
    },
    filter: {
      filterList: [], // 列表
      filterCheckItems: {value: '', name: '全部'}, // 已生效
      curFilterItems: {value: '', name: '全部'}, // 当前
      isSelected: false // 是否选择过
    }
  }
}
// vm.$store.commit('goodsTypeChange', {goodsType: ['cc', 'aa']})
const getters = {
  changeGoodsType: state => {
    return state.goodsType
  }
}
const actions = {}
const mutations = {
  goodsTypeChange(state, payload, rootState) {
    state.goodsType = payload.goodsType
  },
  setTypeObj(state, payload, rootState) {
    state.typeObj = payload.typeObj
  },
  setTypeObjTpl(state, payload, rootState) {
    state.typeObjTpl = payload.typeObjTpl
  }
}

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}
