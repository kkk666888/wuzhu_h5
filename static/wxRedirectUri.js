/**
 * @file wxRedirectUri.js 微信网页授权
 * @detail 重定向到微信网页授权, 获取 code
 *
 * **/
(function() {
  function _getRequest(name) {
    // 去除 ?号 eg: name=Tony&id=1234
    // var urlSearch = window.location.search.substr(1) // 在 vue-router 中获取不到值
    var urlSearch = window.location.href.split('?')[1]; // 根据 ? 分割
    if (urlSearch) {
      urlSearch = urlSearch.split('#')[0];
    }
    var results = new RegExp('(^|&)' + name + '=([^&]*)').exec(urlSearch);
    if (results) {
      return results[2];
    } else {
      return false;
    }
  }
  // 从url中获取categoryCode，场景：如公众号软文中点击商品图片跳转到对应的商品详情 (该需求关联多个文件，关键字url_goto_goodsdetail)
  function getCategoryCode() {
    var _categoryCode = _getRequest('categoryCode');
    var _from = _getRequest('from');
    // console.log('_categoryCode = ' + _categoryCode + ', _from = ' + _from)
    if (sessionStorage) {
      if (_categoryCode) {
        sessionStorage.setItem('_categoryCode', _categoryCode);
      }
      if (_from) {
        sessionStorage.setItem('_from', _from);
      }
    }
  }
  // 从url中获取platformCode，场景：Android App和iOS App启动H5首页时，会将platformCode传入,wzappandroid,wzappios
  function getPlatformCode() {
    var platformCode = _getRequest('platformCode');
    // console.log('platformCode = ' + platformCode)
    if (sessionStorage) {
      if (platformCode) {
        sessionStorage.setItem('platformCode', platformCode);
      }
    }
  }
  function isWeiXin() {
    var ua = navigator.userAgent.toLowerCase();
    var _MicroMessenger = ua.match(/MicroMessenger/i);
    if (_MicroMessenger && _MicroMessenger[0] === 'micromessenger') {
      return true;
    } else {
      return false;
    }
  }
  function isAlipayClient() {
    var ua = navigator.userAgent.toLowerCase();
    var _MicroMessenger = ua.match(/AlipayClient/i);
    if (_MicroMessenger && _MicroMessenger[0] === 'alipayclient') {
      return true;
    } else {
      return false;
    }
  }
  var _isGetCode = false;
  var mainjsData = {};
  if (sessionStorage) {
    var _mainjsData = sessionStorage.getItem('mainjsData');
    if (_mainjsData) {
      mainjsData = JSON.parse(_mainjsData);
      _isGetCode = mainjsData.isGetCode;
    }
  }

  // 存储recommCode到localStorage
  if (localStorage) {
    var recommCode = _getRequest('recommCode');
    // console.log('recommCode index = ' + recommCode)
    if (recommCode) {
      recommCode = recommCode.split('#')[0];
      // console.log('recommCode sessionStorage = ' + recommCode)
      localStorage.setItem('recommCode', recommCode);
    }
  }

  var wxCode = _getRequest('code');
  var aliCode = _getRequest('auth_code');
  var _channelNo = '001'; // 默认为微信的渠道号
  if (mainjsData.channelNo) {
    _channelNo = mainjsData.channelNo;
  } else {
    _channelNo = _getRequest('channelNo');
  }
  console.info('>>> channelNo: ', _channelNo);
  getCategoryCode();
  getPlatformCode();
  // 某些情况下会出现进入支付宝生活号获取不到channelNo的问题，判断当前ua是否AlipayClient且_channelNo不是004，是则修改_channelNo为004
  var isAlipay = isAlipayClient();
  console.info('>>> isAlipay: ', isAlipay);
  if (isAlipay && (_channelNo !== '004')) {
    console.log('isAlipay _channelNo = '+ _channelNo);
    _channelNo = '004'
  }
  var _isWeixin = isWeiXin();
  // console.info('>>> _isWeixin: ', _isWeixin);
  if (_channelNo === '003') {
    // 京东
    mainjsData.channelNo = _channelNo;
    if (_getRequest('accessToken')) {
      mainjsData.accessToken = _getRequest('accessToken');
    }
    if (sessionStorage) {
      sessionStorage.setItem('mainjsData', JSON.stringify(mainjsData));
    }
  } else if (_channelNo === '004') {
    // 生活号
    mainjsData.channelNo = _channelNo;

    if (_getRequest('auth_code')) {
      mainjsData.accessToken = _getRequest('auth_code');
    }
    if (sessionStorage) {
      sessionStorage.setItem('mainjsData', JSON.stringify(mainjsData));
    }
  } else {
    // 非京东 -- 全部为 微信公众号
    mainjsData.channelNo = '001';
    mainjsData.accessToken = null;
  }
  // 2018-10-31 modified by hanfeng 只有微信渠道才进行微信授权
  // 2018-8-15 added by hanfeng
  // 进行微信授权，获取用户openId。目前微信公众号、京东的微信渠道需要进行授权
  if (_isWeixin && _channelNo === '001') {
    var _url = window.location.href.split('/dist')[0] + '/dist';
    try {
      _url = encodeURIComponent(_url);
    } catch (err) {
      console.error(err);
    }
    var wxRedirectUri =
      'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
      'fs.Config.appid' +
      '&redirect_uri=' +
      _url +
      '&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect';
    mainjsData.wxRedirectUri = wxRedirectUri;
    // 获取 页面授权的 code -- 只能重定向回首页
    if (!_isGetCode && !wxCode) {
      // 每次进来都获取
      // for test 存储当前页面地址和mainjsData
      // localStorage.setItem('mainjsData', JSON.stringify(mainjsData));
      // localStorage.setItem('currentUrl', window.location.href);
      // scope=snsapi_base  snsapi_userinfo
      window.location.href = wxRedirectUri;
    } else if (!_isGetCode && wxCode) {
      // 如果有 wxCode
      _isGetCode = true; // 控制只执行一次
      mainjsData.isGetCode = _isGetCode;
      if (sessionStorage) {
        sessionStorage.setItem('mainjsData', JSON.stringify(mainjsData));
      }
    }
  } else if (_channelNo === '004') {
    var _url = 'fs.Config.alipaylifeAuthUrl';
    console.log('004 _url = ' + _url);
    mainjsData.aliRedirectUri = _url;
    if (!_isGetCode && !aliCode) {
      window.location.href = _url;
    } else if (!_isGetCode && aliCode) {
      _isGetCode = true;
      mainjsData.isGetCode = _isGetCode;
      if (sessionStorage) {
        sessionStorage.setItem('mainjsData', JSON.stringify(mainjsData));
      }
    }
  } else {
    if (sessionStorage) {
      sessionStorage.setItem('mainjsData', JSON.stringify(mainjsData));
    }
  }
})();
