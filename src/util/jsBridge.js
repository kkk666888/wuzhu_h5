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

// function registerhandler(name, callback) {
//   console.log('registerhandler isWzapp = ' + isWzapp())
//   if (isWzapp()) {
//     console.log('registerhandler name = ' + name + ', callback = ' + callback)
//     setupWebViewJavascriptBridge(function(bridge) {
//       bridge.registerHandler(name, function(data, responseCallback) {
//         console.log('registerhandler data = ' + data + ', responseCallback = ' + responseCallback)
//         callback(data, responseCallback)
//       })
//     })
//   }
// }

export default {
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
  getContactInfo(callback) {
    let contactCount = '0' // 获取联系人数目，0则为全部获取, -1为不获取，其他获取对应数目的联系人
    callhandler('getContactInfo', contactCount, callback)
  },
  getOneContact(callback) {
    callhandler('getOneContact', '', callback)
  },
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
  }
}
