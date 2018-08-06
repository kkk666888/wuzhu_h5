// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './App'
import store from './store/store'
import Http from './util/http'
import Reporter from './util/reporter'
import VueLazyLoad from 'vue-lazyload'
import { ConfirmPlugin, AlertPlugin, ToastPlugin, LoadingPlugin } from 'vux'
import { getRequest } from './util/utils'
import enumService from './util/enum.js'
import common from './util/common.js'
import filters from './filters'
const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.config.productionTip = false
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.prototype.$http = Http
Vue.prototype.$reporter = Reporter
// 图片懒加载的部分
Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  error: 'static/images/loading.png',
  loading: 'static/images/loading.png',
  attempt: 1
})

// 更新 store.state.channelNo 渠道号
if (sessionStorage) {
  let _mainjsData = sessionStorage.getItem('mainjsData')
  if (_mainjsData) {
    let mainjsData = JSON.parse(_mainjsData)
    store.commit('updateChannelNo', { channelNo: mainjsData.channelNo })
    store.commit('updateAccessToken', { accessToken: mainjsData.accessToken })
  }
}
console.log(store.state)

function getWXOpenId(code) {
  console.log('>>> getWXOpenId')
  let _wxOpenID = store.state.othersOpenID
  // _wxOpenID = 'o9ijZ0YpQjAjg7iPYXNsUzQRpy0g'    // dragon的openId
  if (localStorage) {
  	let _tmpVuex = localStorage.getItem('vuex')
  	if (_tmpVuex) {
  		let tmpVuex = JSON.parse(_tmpVuex)
  		_wxOpenID = tmpVuex.othersOpenID
  	}
  }
  console.log(_wxOpenID)
  // store.commit('updateWXOpenID', { wxOpenID: _wxOpenID })    // dragon的openId
  Http.get('/wuzhu/user/getOpenId', {
    code: code
  }).then((res) => {
    if (res.code === '00' && res.data) {
      store.commit('updateWXOpenID', { othersOpenID: res.data })
      // 两个 othersOpenID 值不同
      if (_wxOpenID !== res.data) {
      	// 清空 token
        store.commit('tokenMemory', { token: null })
        // 生成埋点唯一编号 -- byno 与 OpenID 挂钩
        Reporter.createByno()
        if (localStorage) { // 清空 store
        	localStorage.setItem('vuex', JSON.stringify(store.state))
        }
      }
    } else {
      if (sessionStorage) {
        let _mainjsData = sessionStorage.getItem('mainjsData')
        if (_mainjsData) {
          _mainjsData = JSON.parse(_mainjsData)
          _mainjsData.openIDerr = res
          sessionStorage.setItem('mainjsData', JSON.stringify(_mainjsData))
        }
      }
    }
  }).catch((err) => {
    console.log(err)
  })
}
function getWXCodeNew() {
	let isGetOpenid = false
  let mainjsData = {}
  if (sessionStorage) {
    let _mainjsData = sessionStorage.getItem('mainjsData')
    if (_mainjsData) {
      mainjsData = JSON.parse(_mainjsData)
      isGetOpenid = mainjsData.isGetOpenid
    }
  }
  let wxCode = getRequest('code')
  // this.getWXOpenId(wxCode)
  if (!isGetOpenid && wxCode) {
    isGetOpenid = true // 控制只执行一次
    mainjsData.isGetOpenid = isGetOpenid
    if (sessionStorage) {
      sessionStorage.setItem('mainjsData', JSON.stringify(mainjsData))
    }
    // 获取 openid
    getWXOpenId(wxCode)
  }
}
Vue.prototype.enum = enumService
Vue.prototype.common = common
if (store.state.channelNo === '001') { // 微信公众号
  getWXCodeNew()
}
// 过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
