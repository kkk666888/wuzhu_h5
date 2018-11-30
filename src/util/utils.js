import Http from './http';
import Config from './config';
import Store from './../store/store';

export function getWeChatSign(url) {
  return new Promise(function(resolve, reject) {
    Http.post('/wuzhu/payment/weiXinPay/SignUrl', {
      url: url
    })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * @detail 微信 jssdk 配置
 * @param opt -- Object
 *    key -- localStorage.setItem(key) 弃用
 *    url -- 签名的 url
 *    jsApiList -- [] 需要使用的JS接口列表
 **/
export function configWX(that, opt) {
  console.log('configWX start');
  let count = 0;
  let isError = false;
  opt.key = 'WeChatJSSDKInfo';
  let tmpURLSign = {};
  if (localStorage) {
    // 本地存 url签名信息
    let _tmpURLSign = localStorage.getItem(opt.key);
    if (_tmpURLSign) {
      tmpURLSign = JSON.parse(_tmpURLSign);
    }
  }
  console.log('configWX config start');
  // eslint-disable-next-line
  wx.config({
    debug: false,
    appId: Config.appid || 'wx9a12b852f16c0009',
    timestamp: tmpURLSign.timestamp || 1524539213,
    nonceStr: tmpURLSign.nonceStr || 'BQ4IZa2bd7uAlBg',
    signature: tmpURLSign.signature || 'faaf6964fdc629a861f0ed7bba13507e441d54dd',
    jsApiList: opt.jsApiList
  });
  console.log('configWX ready start');
  // eslint-disable-next-line
  wx.ready(function() {
    if (!isError) {
      that.wxReady = true;
      that.$emit('fs-wx-ready', isError);
    }
  });
  console.log('configWX error start');
  // config信息验证失败会执行error函数
  // eslint-disable-next-line
  wx.error(function(res) {
    isError = true;
    if (count < 2) {
      // 控制只请求3次 -- 2次
      getWeChatSign(opt.url).then(
        function(res) {
          count++;
          if (res.code === '00') {
            if (!res.data) {
              that.$vux.alert.show({
                content: '微信签名信息为空！'
              });
            }
            if (localStorage) {
              // 本地存 url签名信息
              localStorage.setItem(opt.key, JSON.stringify(res.data));
            }
            // 备注: 重新签名的时候不会触发 wx.ready
            // eslint-disable-next-line
            wx.config({
              debug: false,
              appId: Config.appid,
              timestamp: res.data.timestamp,
              nonceStr: res.data.nonceStr,
              signature: res.data.signature,
              jsApiList: opt.jsApiList
            });
            // eslint-disable-next-line
            wx.ready(function() {
              that.wxReady = true;
              that.$emit('fs-wx-ready', isError);
            });
            that.$emit('fs-wx-error');
          } else {
            that.$vux.alert.show({
              content: res.msg
            });
          }
        },
        function(error) {
          console.log(error);
        }
      );
    }
  });
  console.log('configWX end');
}

/**
 *  {getRequest -- 获取 url 搜索部分键所对应的值}
 *  @param name 需要获取所对应值的键
 *  @return     匹配键所得到的值
 * **/
export function getRequest(name) {
  // 去除 ?号 eg: name=Tony&id=1234
  // let urlSearch = window.location.search.substr(1) // 在 vue-router 中获取不到值
  let urlSearch = window.location.href.split('?')[1]; // 根据 ? 分割
  if (urlSearch) {
    urlSearch = urlSearch.split('#')[0];
  }
  let results = new RegExp('(^|&)' + name + '=([^&]*)').exec(urlSearch);
  if (results) {
    return results[2];
  } else {
    return '';
  }
}

// 更改 url, 加 ?
export function directRightUrl() {
  let { href, protocol, host, search, hash } = window.location;
  const pathname = '/dist/';
  search = search || '?';
  hash = hash || '#/';
  let newHref = `${protocol}//${host}${pathname}${search}${hash}`;
  if (newHref !== href) {
    window.location.replace(newHref);
  }
}

// 客户端系统检查 -- 检测 ios
export function isIOS() {
  return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
}

// 检测是否是 安卓
export function isAndroid() {
  // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // 参考android终端
  return /(Android|Adr)/i.test(navigator.userAgent);
}

// 客户端系统检查 -- 微信
export function isWeiXin() {
  let ua = navigator.userAgent.toLowerCase();
  let _MicroMessenger = ua.match(/MicroMessenger/i);
  if (_MicroMessenger && _MicroMessenger[0] === 'micromessenger') {
    let _MicVersion = ua.match(/MicroMessenger\/6.6.6/i);
    let _version = _MicVersion && _MicVersion[0];
    let version = _version && _version.split('/')[1];
    return {
      isWeiXin: true,
      version: version,
      match: _version
    };
  } else {
    return false;
  }
}

// 客户端系统检查 -- QQ MQQBrowser
export function isQQ() {
  let ua = navigator.userAgent.toLowerCase();
  let _match = ua.match(/\sqq/i);
  if (_match && _match[0] === ' qq') {
    return true;
  } else {
    return false;
  }
}

// 客户端系统检查 -- 京东App
export function isJDApp() {
  var ua = window.navigator.userAgent.toLowerCase();
  let _match = ua.match(/jdapp/i);
  if (_match && _match[0] === 'jdapp') {
    return true;
  } else {
    return false;
  }
}

// 客户端系统检查 -- 京东金融App
export function isJDJRApp() {
  var ua = window.navigator.userAgent.toLowerCase();
  let _match = ua.match(/jdjr-app/i);
  if (_match && _match[0] === 'jdjr-app') {
    return true;
  } else {
    return false;
  }
}

// 客户端系统检查 -- 支付宝App
export function isAlipayClient() {
  var ua = window.navigator.userAgent.toLowerCase();
  let _match = ua.match(/AlipayClient/i);
  if (_match && _match[0] === 'alipayclient') {
    return true;
  } else {
    return false;
  }
}
// web-view下的页面内
// function ready() {
//   console.log(window.__wxjs_environment === 'miniprogram') // true
// }
// if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
//   document.addEventListener('WeixinJSBridgeReady', ready, false)
// } else {
//   ready()
// }

export function getPlatformCode() {
  // 从session中取platformCode，保存到store中
  let _platformCode = sessionStorage.getItem('platformCode');
  if (_platformCode) {
    Store.commit('platformCodeMemory', {
      platformCode: _platformCode
    });
  } else {
    let platform = '';
    if (isWeiXin()) {
      platform = 'wechat';
    } else if (isQQ()) {
      platform = 'qq';
    } else if (isJDApp()) {
      platform = 'jdapp';
    } else if (isJDJRApp()) {
      platform = 'jdjrapp';
    } else if (isAlipayClient()) {
      platform = 'alipaylife';
    } else {
      platform = 'unknown';
    }
    console.log('getPlatform platform === ' + platform);
    Store.commit('platformCodeMemory', {
      platformCode: platform
    });
  }
}

// 压缩图片
export function compressImg(file) {
  return new Promise(function(resolve, reject) {
    // FileReader API IE10 才兼容
    if (typeof FileReader === 'undefined') {
      reject(new Error('该浏览器不兼容 FileReader API'));
      return false;
    }
    // 判断选择的文件是否是图片 type: 'image/jpeg'
    if (file.type.indexOf('image') !== -1) {
      try {
        let reader = new FileReader();
        let img = new Image();
        reader.readAsDataURL(file);
        // 文件base64化，以便获知图片原始尺寸
        reader.onload = function(e) {
          img.src = e.target.result;
        };
        // base64地址图片加载完毕后
        img.onload = function(e) {
          // 图片原始尺寸
          let originWidth = this.width;
          let originHeight = this.height;
          // 最大尺寸限制
          let maxWidth = 1920;
          let maxHeight = 1080;
          // 缩放图片需要的canvas
          let canvas = document.createElement('canvas');
          let context = canvas.getContext('2d');
          // 目标尺寸
          let targetWidth = originWidth;
          let targetHeight = originHeight;
          // 图片尺寸 超过 400x400 的限制 -- 否则 用原图尺寸
          if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
              // 计算宽度, 按照宽度 限定尺寸
              targetWidth = maxWidth;
              targetHeight = Math.round(maxWidth * (originHeight / originWidth));
            } else {
              targetHeight = maxHeight;
              targetWidth = Math.round(maxHeight * (originWidth / originHeight));
            }
          }
          // canvas 对图片进行缩放
          canvas.width = targetWidth + 200;
          canvas.height = targetHeight + 200;
          // 清除画布
          context.clearRect(0, 0, targetWidth, targetHeight);
          // 图片压缩 -- 传入 Image 对象 img
          context.drawImage(img, 0, 0, targetWidth, targetHeight);
          try {
            // canvas 转为 blob (二进制流)
            canvas.toBlob(
              function(blob) {
                resolve(blob);
              },
              file.type || 'image/png',
              0.95
            );
          } catch (err) {
            reject(err);
          }
          // canvas 转为 base64 格式信息; qualityArgument 默认值是0.92，是一个比较合理的图片质量输出参数
          // let base64Datas = canvas.toDataURL(file.type || 'image/png', 0.92)
          // resolve(base64Datas)
        };
      } catch (err) {
        reject(err);
      }
    } else {
      reject(new Error('该处理的文件类型不对，请上传 image 类型的文件'));
    }
  });
}

// H5接口获取用户地理位置
export function GetLocation(opt, instance) {
  opt = opt || {};
  let that = instance;
  let options = {
    enableHightAccuracy: opt.enableHightAccuracy || true, // 获取高精度位置
    maximumAge: opt.maximumAge || 30000, // 30s 过期时间
    timeout: opt.timeout || 15000 // ms 15000
  };

  return new Promise(function(resolve, reject) {
    // geolocation 在 IE9之后 才支持
    if (typeof navigator.geolocation === 'undefined') {
      reject(new Error('该浏览器不兼容 geolocation API'));
      return false;
    }
    navigator.geolocation.getCurrentPosition(
      function(position) {
        that.$store.commit('latMemory', {
          lat: position.coords.latitude
        });
        that.$store.commit('lngMemory', {
          lng: position.coords.longitude
        });
        resolve(position);
      },
      function(err) {
        reject(err);
      },
      options
    );
  });
}

// 微信接口获取用户地理位置,不判断wx是否ready
export function GetWXLocation(instance) {
  let that = instance;
  return new Promise(function(resolve, reject) {
    try {
      if (!isWeiXin()) {
        reject(new Error('isNotWeixin'));
        console.log('GetWXLocation is not weixin');
        return false;
      }
      // eslint-disable-next-line
      wx.getLocation({
        type: 'wgs84', // gcj02
        success: function(res) {
          that.$store.commit('latMemory', {
            lat: res.latitude
          });
          that.$store.commit('lngMemory', {
            lng: res.longitude
          });
          resolve(res);
        },
        fail: function(res) {
          console.log('location err', res);
          reject(new Error('getLocationFailed'));
        },
        cancel: function() {
          reject(new Error('cancelGetLocation'));
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

// 百度接口获取地理位置
export function GetBaiduGps() {
  return new Promise((resolve, reject) => {
    // 百度地图API功能
    // eslint-disable-next-line
    let geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(
      function(r) {
        // eslint-disable-next-line
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          console.log('您的位置：' + r.point.lng + ',' + r.point.lat);
          resolve(r.point);
        } else {
          console.log('baidufailed' + this.getStatus());
          reject(new Error('getLocationFailed'));
        }
      },
      {
        enableHighAccuracy: true
      }
    );
    // 关于状态码
    // BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
    // BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
    // BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
    // BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
    // BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
    // BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
    // BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
    // BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
    // BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)
  });
}

// 返回从 x 轴到点 (x, y) 之间的角度
export function GetAngle(x, y) {
  return Math.atan2(y, x) * 180 / Math.PI;
}

// 返回值: 0, 1 上 2 下 3 左 4 右 -- 可能由于浏览器,而无法判断向下划
export function GetDirection(touchs) {
  let res = {
    code: 0
  };
  if (!touchs) {
    return res;
  }
  let x = touchs.endx - touchs.startx;
  // y 的值 上小下大 -- 对其取相反数
  let y = -(touchs.endy - touchs.starty);
  res.distance = {
    x: x,
    y: y
  };
  if (Math.abs(x) < 2 && Math.abs(y) < 2) {
    return res;
  }
  let angle = GetAngle(x, y);
  if (angle > 45 && angle < 135) {
    // 45< angle <= 135 -- 1 上
    res.code = 1;
  } else if (angle < -45 && angle > -135) {
    // -135< angle <= -45 -- 2 下
    res.code = 2;
  } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle <= -135)) {
    //  135< angle < 180 || -180< angle < -135 左
    res.code = 3;
  } else if (angle >= -45 && angle <= 45) {
    // -45< angle <45 右
    res.code = 4;
  }
  return res;
}

// 重新获取 openid
export function RegainOpenid() {
  if (isWeiXin()) {
    let mainjsData = {};
    if (sessionStorage) {
      let _mainjsData = sessionStorage.getItem('mainjsData');
      if (_mainjsData) {
        mainjsData = JSON.parse(_mainjsData);
        mainjsData.isGetOpenid = false; // 重定向回来后让 main.js 重新获取 openid
        sessionStorage.setItem('mainjsData', JSON.stringify(mainjsData));
      }
    }
    let _url = window.location.href.split('/dist')[0] + '/dist';
    window.location.href =
      'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
      Config.appid +
      '&redirect_uri=' +
      _url +
      '&response_type=code&scope=snsapi_userinfo&state=wechat_redirect_InitLogin&connect_redirect=1#wechat_redirect';
  }
}
// 深拷贝
export function deepCopy(p, c = {}) {
  for (let i in p) {
    if (typeof p[i] === 'object') {
      c[i] = p[i].constructor === Array ? [] : {};
      deepCopy(p[i], c[i]);
    } else {
      c[i] = p[i];
    }
  }
  return c;
}
// 京东渠道静默登录
export function queryJDInfoAndLogin(that) {
  return new Promise(function(resolve, reject) {
    let JDtoken = that.$store.state.accessToken;
    // alert('queryJDInfoAndLogin JDtoken = ' + JDtoken);
    if (JDtoken) {
      that.$store.commit('updateLoadingStatus', {
        isLoading: true
      });
      Http.get('/wuzhu/jDEntryController/queryJDXBFromJDChannel', {
        accessToken: JDtoken,
        channelNo: that.$store.state.channelNo,
        recommCode: that.$store.state.recommeCode // 邀请码 --
      })
        .then(res => {
          that.$store.commit('updateLoadingStatus', {
            isLoading: false
          });
          if (res.code === '00' && res.data) {
            // 用户有两个京东号, 其 openId 不同, 不同的账号是否需要清空本地缓存的数据
            // if (this.$store.state.othersOpenID !== res.data.openId) {
            // }
            that.$store.commit('tokenMemory', {
              token: res.data.Token
            });
            that.$store.commit('updatePhone', {
              phone: res.data.moblile
            });
            that.$store.commit('updateOthersOpenID', {
              othersOpenID: res.data.openId
            });
            sessionStorage.setItem('JDLoginStatus', 'true');
            resolve(res);
          } else {
            that.$vux.alert.show({
              title: '提示',
              content: res.err || res.msg
            });
            reject(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    } else {
      that.$vux.alert.show({
        title: '提示',
        content: '获取登陆accessToken失败，请退出页面后重试'
      });
    }
  });
}
// 判断当前是否Alipay环境
export function isAlipayLife() {
  let channelNo = Store.state.channelNo;
  let platformCode = Store.state.platformCode;
  if (channelNo === '004' && platformCode === 'alipaylife') {
    return true;
  } else {
    return false;
  }
}
// 判断当前是否wzapp环境
export function isWzapp() {
  let channelNo = Store.state.channelNo;
  let platformCode = Store.state.platformCode;
  if (channelNo === '001' && (platformCode === 'wzappandroid' || platformCode === 'wzappios')) {
    return true;
  } else {
    return false;
  }
}
// 判断手机号码格式是否正确以及是否是支持的号段
export function isPhoneAvailable(param) {
  // let regex = /^[1][3,5,6,7,8,9][0-9]{9}$/
  // 支持13、14（仅145、147）、15、16、17（除170、171）、18、19的号段
  let regex = /^(13[0-9]{9}|14[5,7][0-9]{8}|15[0-9]{9}|16[0-9]{9}|17[2-9][0-9]{8}|18[0-9]{9}|19[0-9]{9})$/;
  return regex.test(param);
}
// 判断电话号码格式是否正确：区号+号码，区号以0开头，3位或4位，号码由7位或8位数字组成，区号与号码之间可以无连接符，也可以“-”连接
export function isTelePhoneAvailable(param) {
  let regex = /^0\d{2,3}-?\d{7,8}$/;
  return regex.test(param);
}

// 支付宝生活号登陆
export const AliLifeLogin = that => {
  return new Promise((resolve, reject) => {
    let token = that.$store.state.accessToken;
    let _logDO = {
      logNo: '12',
      memebershipNo: '12',
      loginDate: '12',
      loginChannel: '12',
      loginIp: '12',
      deviceName: '12', // 登录设备名称
      deviceId: '12', // 登录设备 ID
      gpsLongitude: that.$store.state.lng, // 经度
      gpsLatitude: that.$store.state.lat, // 纬度
      gpsAddress: '12', // 经纬度 地址
      gpsProvince: '12', // 经纬度 省份
      gpsCity: '12', // 经纬度 城市
      gpsCounty: '12' // 经纬度 区县
    };
    let params = {
      authCode: token,
      channelNo: that.$store.state.channelNo,
      recommCode: that.$store.state.recommeCode,
      strMembershipLoginLogDO: JSON.stringify(_logDO)
    };
    that.$store.commit('updateLoadingStatus', {
      isLoading: true
    });
    Http.post('/wuzhu/user/aliLogin', params)
      .then(res => {
        that.$store.commit('updateLoadingStatus', {
          isLoading: false
        });

        if (res.code === '00' && res.data) {
          console.warn('aliLife Token = ' + res.data.Token);
          console.log('aliLife rememberMobile = ' + res.data.rememberMobile);
          that.$store.commit('tokenMemory', {
            token: res.data.Token
          });
          that.$store.commit('updateOthersOpenID', {
            othersOpenID: res.data.openId
          });
          sessionStorage.setItem('AliLifeLoginStatus', 'true');
          sessionStorage.setItem('rememberMobile', res.data.rememberMobile);
          resolve(res);
        } else {
          console.log('AliLifeLogin code = ' + res.code);
          that.$vux.alert.show({
            title: '提示',
            content: res.msg
          });
          reject(res);
        }
      })
      .catch(err => {
        that.$store.commit('updateLoadingStatus', {
          isLoading: false
        });
        console.error(err);
        reject(err);
      });
  });
};

// piwik event
export function piwikTrackEvent(action, name, value) {
  let _paq = window._paq;
  if (_paq) {
    _paq.push(['trackEvent', action + '', name + '', value + '']);
  }
}

// 统一各渠道的登录方法
export function unionLogin(that, resolve, reject) {
  let channelNo = Store.state.channelNo;
  console.log('unionLogin channelNo = ' + channelNo);
  switch (channelNo) {
    case '001':
      that.$router.push({ name: 'InitLogin' });
      break;
    case '003':
      let isJDLogin = sessionStorage.getItem('JDLoginStatus');
      if (isJDLogin !== 'true') {
        queryJDInfoAndLogin(that)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      }
      break;
    case '004':
      let isAliLifeLogin = sessionStorage.getItem('AliLifeLoginStatus');
      if (isAliLifeLogin !== 'true') {
        // AliLifeLogin(that, resolve, reject);
        AliLifeLogin(that)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      }
      break;
    default:
      break;
  }
}
