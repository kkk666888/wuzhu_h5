// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import router from './router';
import App from './App';
import store from './store/store';
import Http from './util/http';
import Reporter from './util/reporter';
import VueLazyLoad from 'vue-lazyload';
import { ConfirmPlugin, AlertPlugin, ToastPlugin, LoadingPlugin } from 'vux';
import { getRequest, isIOS } from './util/utils';
import enumService from './util/enum.js';
import common from './util/common.js';
import filters from './filters';
import jsBridge from './util/jsBridge.js';

const FastClick = require('fastclick');
FastClick.prototype.needsClick = function(target) {
  if (target.parentNode.parentNode['className'].indexOf('needsClick') !== -1) {
    return true;
  }
  if (target['className'].indexOf('weui-input') !== -1) {
    return true;
  }
};
FastClick.prototype.focus = function(targetElement) {
  var length;
  // 兼容处理:在iOS7中，有一些元素（如date、datetime、month等）在setSelectionRange会出现TypeError
  // 这是因为这些元素并没有selectionStart和selectionEnd的整型数字属性，所以一旦引用就会报错，因此排除这些属性才使用setSelectionRange方法
  if (isIOS() && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month' && targetElement.type !== 'email') {
      length = targetElement.value.length;
      targetElement.setSelectionRange(length, length);
      // 修复bug ios 11.3不弹出键盘，这里加上聚焦代码，让其强制聚焦弹出键盘
      targetElement.focus();
  } else {
      targetElement.focus();
  }
};
FastClick.attach(document.body);

Vue.config.productionTip = false;
Vue.use(ConfirmPlugin);
Vue.use(AlertPlugin);
Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);
Vue.prototype.$http = Http;
Vue.prototype.$reporter = Reporter;
// 图片懒加载的部分
Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  error: 'static/images/loading.png',
  loading: 'static/images/loading.png',
  attempt: 1
});

// 更新 store.state.channelNo 渠道号
if (sessionStorage) {
  let _mainjsData = sessionStorage.getItem('mainjsData');
  if (_mainjsData) {
    let mainjsData = JSON.parse(_mainjsData);
    // 2018-8-20 added by hanfeng 如果本地存储的channelNo与session中的不同，则清空登录token
    let sessionChannelNo = mainjsData.channelNo;
    let storeChannelNo = store.state.channelNo;
    // console.log('main.js sessionChannelNo=' + sessionChannelNo + ',storeChannelNo=' + storeChannelNo)
    // this.$vux.alert.show('main.js sessionChannelNo=' + sessionChannelNo + ',storeChannelNo=' + storeChannelNo)
    if (sessionChannelNo !== storeChannelNo) {
      store.commit('tokenMemory', { token: null });
    }
    store.commit('updateChannelNo', { channelNo: mainjsData.channelNo });
    store.commit('updateAccessToken', { accessToken: mainjsData.accessToken });
  }
}
// console.log(store.state)

function getWXOpenId(code) {
  // console.log('>>> getWXOpenId')
  // 此处是微信的openID，要取store中的wxOpenID
  let _wxOpenID = store.state.wxOpenID;
  // _wxOpenID = 'o9ijZ0YpQjAjg7iPYXNsUzQRpy0g'    // dragon的openId
  // if (localStorage) {
  // 	let _tmpVuex = localStorage.getItem('vuex')
  // 	if (_tmpVuex) {
  // 		let tmpVuex = JSON.parse(_tmpVuex)
  // 		_wxOpenID = tmpVuex.othersOpenID
  // 	}
  // }
  // console.log('getWXOpenId _wxOpenID=' + _wxOpenID)
  // store.commit('updateOthersOpenID', { wxOpenID: _wxOpenID })    // dragon的openId
  Http.get('/wuzhu/user/getOpenId', {
    code: code
  })
    .then(res => {
      if (res.code === '00' && res.data) {
        // 如果渠道是微信001，则同时保存到othersOpenID，如果渠道是003且是微信环境，只保存到wxOpenID
        if (store.state.channelNo === '001') {
          store.commit('updateOthersOpenID', { othersOpenID: res.data });
        }
        // 保存微信的openID
        store.commit('updateWXOpenID', { wxOpenID: res.data });
        // 两个 othersOpenID 值不同
        if (_wxOpenID && _wxOpenID !== res.data) {
          // console.log('getWXOpenId _wxOpenID !== res.data')
          // 清空 token
          store.commit('tokenMemory', { token: null });
          // 生成埋点唯一编号 -- byno 与 OpenID 挂钩
          Reporter.createByno();
          if (localStorage) {
            // 清空 store
            localStorage.setItem('vuex', JSON.stringify(store.state));
          }
        }
      } else {
        if (sessionStorage) {
          let _mainjsData = sessionStorage.getItem('mainjsData');
          if (_mainjsData) {
            _mainjsData = JSON.parse(_mainjsData);
            _mainjsData.openIDerr = res;
            sessionStorage.setItem('mainjsData', JSON.stringify(_mainjsData));
          }
        }
      }
    })
    .catch(err => {
      console.log(err);
    });
}
function getWXCodeNew() {
  let isGetOpenid = false;
  let mainjsData = {};
  if (sessionStorage) {
    let _mainjsData = sessionStorage.getItem('mainjsData');
    if (_mainjsData) {
      mainjsData = JSON.parse(_mainjsData);
      isGetOpenid = mainjsData.isGetOpenid;
    }
  }
  let wxCode = getRequest('code');
  // this.getWXOpenId(wxCode)
  if (!isGetOpenid && wxCode) {
    isGetOpenid = true; // 控制只执行一次
    mainjsData.isGetOpenid = isGetOpenid;
    if (sessionStorage) {
      sessionStorage.setItem('mainjsData', JSON.stringify(mainjsData));
    }
    // 获取 openid
    getWXOpenId(wxCode);
  }
}
Vue.prototype.enum = enumService;
Vue.prototype.common = common;
Vue.prototype.jsBridge = jsBridge;
// 2018-10-31 modified by hanfeng 只有微信渠道才进行微信授权
// 微信公众号或京东-微信-发现渠道
if (store.state.channelNo === '001') {
  getWXCodeNew();
}
// 过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box');
