import { isWzapp, isAndroid } from './utils';
import Store from './../store/store';
function setupWebViewJavascriptBridge(callback) {
  console.log('setupWebViewJavascriptBridge ' + window.WebViewJavascriptBridge)
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  } else {
    document.addEventListener(
      'WebViewJavascriptBridgeReady', function() {
        callback(window.WebViewJavascriptBridge)
      },
      false
    );
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
  window.WVJBCallbacks = [callback]
  let WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'https://__bridge_loaded__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(() => {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}

function callhandler(name, data, callback) {
  console.log('callhandler isWzapp = ' + isWzapp())
  if (isWzapp()) {
    console.log('callhandler name = ' + name + ', data = ' + data)
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.callHandler(name, data, callback)
    })
  }
}

function registerhandler(name, callback) {
  console.log('registerhandler isWzapp = ' + isWzapp())
  if (isWzapp()) {
    console.log('registerhandler name = ' + name + ', callback = ' + callback)
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.registerHandler(name, function(data, responseCallback) {
        console.log('registerhandler data = ' + data + ', responseCallback = ' + responseCallback)
        callback(data, responseCallback)
      })
    })
  }
}

export default {
  // ---以下接口由H5调用
  // 获取设备信息
  getDeviceInfo() {
    let applist = '0' // 是否获取已安装应用列表，1-获取，0-不获取
    callhandler('getDeviceInfo', applist, function(data) {
      console.log('getDeviceInfo data = ' + data)
      if (data) {
        let jData = JSON.parse(data)
        if (jData && jData.deviceInfo) {
          Store.commit('deviceInfoMemory', { deviceInfo: JSON.stringify(jData.deviceInfo) })
          if (jData.deviceInfo.deviceId) {
            Store.commit('deviceIdMemory', { deviceId: jData.deviceInfo.deviceId })
          }
        }
      }
    })
  },
  // 获取指定数量的联系人
  getContactInfo(callback) {
    let contactCount = '0' // 获取联系人数目，0则为全部获取, -1为不获取，其他获取对应数目的联系人
    callhandler('getContactInfo', contactCount, callback)
  },
  // 选择一个联系人
  getOneContact(callback) {
    callhandler('getOneContact', '', callback)
  },
  // 获取gps
  getGps(callback) {
    callhandler('getGps', '', callback)
  },
  // 锤子手机调用摄像头设置参数MediaStore.EXTRA_VIDEO_QUALITY为1会报错，可能其他机型也有问题，在这里配置问题机型名单
  // smartisan
  setCameraBanList() {
    if (isAndroid()) {
      let jso = { 'banlist': [{ 'ban': 'smartisan' }, { 'ban': 'smartisan11231321' }] };
      callhandler('setCameraBanList', JSON.stringify(jso), function(data) {
        console.log('setCameraBanList data = ' + data)
      })
    }
  },
  // 登录后保存token到app
  setLoginToken(token) {
    console.log('setLoginToken token = ' + token);
    callhandler('setLoginToken', token, function(data) {
      console.log('setLoginToken data = ' + data)
    })
  },
  // 启动Alipay
  startAlipay(orderInfo, callback) {
    console.log('startAlipay orderInfo = ' + orderInfo);
    callhandler('startAlipay', orderInfo, function(data) {
      console.log('startAlipay data = ' + data);
      if (callback) {
        callback(data);
      }
    })
  },
  // 关闭webview
  closeWebView() {
    console.log('closeWebView start');
    callhandler('closeWebView', '', function(data) {
      console.log('closeWebView end data = ' + data)
    })
  },
  // ******************************************************* //
  // --- 以下接口提供给原生调用
  // 设置某个存储在H5中的值
  // {“key”: “value”}
  // key说明如下：
  // loginToken:登录的token；
  // nextPage: 登录后要跳转的页面，在打开登录页面之后调用。页面名称
  // -----OrderListPage // 订单列表
  // -----IDverify //身份信息
  // -----App // 返回App
  setStoreValueImpl(data, responseCallback) {
    console.log('setStoreValueImpl data = ' + data);
    let jData = JSON.parse(data);
    if (jData) {
      for (let key in jData) {
        let value = jData[key];
        console.log('jData key = ' + key + ', value = ' + value);
        switch (key) {
          case 'loginToken':
            if (!value) {
              Store.commit('tokenMemory', { token: '' });
            }
            break;
          case 'nextPage':
            Store.commit('loginNextPage', { loginNextPage: value });
            break;
          default:
            break;
        }
      }
    }
  },
  init() {
    registerhandler('setStoreValue', this.setStoreValueImpl);
  }
}
