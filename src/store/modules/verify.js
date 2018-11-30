/**
 * 进件认证相关，包括：OCR，认证(工作信息，学信， )，活体
 **/
export default {
  namespaced: false,
  state: {
    continueFlag: 0, // 是否进行风控; 0要, 1不要
    ocrMsg: {
      name: '',
      number: '', // 身份证号码
      Chsi: ''
    },
    // ocrMsgCheck: {
    //   isCheckCustomer: false, // 客户身份信息校验
    //   isCheckEducation: false // 客户学信信息校验
    // },
    routeName: '' // 过去信用认证的页面名，目前只设置 GoodsDetailPage、MinePage
  },
  getters: {},
  actions: {},
  mutations: {
    updateContinueFlag(state, payload) {
      state.continueFlag = payload.continueFlag;
    },
    // updateOcrMsgCheck(state, payload) {
    //   // OCR 检查信息
    //   state.ocrMsgCheck = payload.ocrMsgCheck;
    // },
    updateOcrMsg(state, payload) {
      // OCR 信息
      state.ocrMsg = payload.ocrMsg;
    },
    updateRouteName(state, payload) {
      state.routeName = payload.routeName;
    }
  }
};
