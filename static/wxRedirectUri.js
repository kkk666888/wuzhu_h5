/**
 * @file wxRedirectUri.js 微信网页授权
 * @detail 重定向到微信网页授权, 获取 code
 *
 * **/
(function() {
  function _getRequest(name) {
    // 去除 ?号 eg: name=Tony&id=1234
    // var urlSearch = window.location.search.substr(1) // 在 vue-router 中获取不到值
    var urlSearch = window.location.href.split('?')[1] // 根据 ? 分割
    if (urlSearch) {
      urlSearch = urlSearch.split('#')[0]
    }
    var results = new RegExp('(^|&)' + name + '=([^&]*)').exec(urlSearch)
    if (results) {
      return results[2]
    } else {
      return false
    }
  }
  // 从url中获取categoryCode，场景：如公众号软文中点击商品图片跳转到对应的商品详情 (该需求关联多个文件，关键字url_goto_goodsdetail)
  function getCategoryCode() {
    var _categoryCode = _getRequest('categoryCode')
    var _from = _getRequest('from')
    console.log('_categoryCode = ' + _categoryCode + ', _from = ' + _from)
    if (sessionStorage) {
      if (_categoryCode) {
        sessionStorage.setItem('_categoryCode', _categoryCode)
      }
      if (_from) {
        sessionStorage.setItem('_from', _from)
      }
    }
  }
  var _isGetCode = false
  var mainjsData = {}
  if (sessionStorage) {
    var _mainjsData = sessionStorage.getItem('mainjsData')
    if (_mainjsData) {
      mainjsData = JSON.parse(_mainjsData)
      _isGetCode = mainjsData.isGetCode
    }
  }

  // 存储recommCode到localStorage
  if (localStorage) {
    var recommCode = _getRequest('recommCode')
    console.log('recommCode index = ' + recommCode)
    if (recommCode) {
      recommCode = recommCode.split('#')[0]
      console.log('recommCode sessionStorage = ' + recommCode)
      localStorage.setItem('recommCode', recommCode)
    }
  }

  var wxCode = _getRequest('code');
  var _channelNo = '001'; // 默认为微信的渠道号
  if (mainjsData.channelNo) {
    _channelNo = mainjsData.channelNo;
  } else {
    _channelNo = _getRequest('channelNo');
  }
  console.info('>>> channelNo: ', _channelNo);
  getCategoryCode();
  if (_channelNo === '003') { // 京东
    mainjsData.channelNo = _channelNo;
    mainjsData.accessToken = _getRequest('accessToken');
    if (sessionStorage) {
      sessionStorage.setItem('mainjsData', JSON.stringify(mainjsData))
    }
  } else { // 非京东 -- 全部为 微信公众号
    mainjsData.channelNo = '001';
    mainjsData.accessToken = null;
    var _url = window.location.href.split('/dist')[0] + '/dist'
    try {
      _url = encodeURIComponent(_url)
    } catch (err) {
      console.error(err)
    }
    var wxRedirectUri = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + 'fs.Config.appid' + '&redirect_uri=' + _url + '&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect'
    mainjsData.wxRedirectUri = wxRedirectUri
    // 获取 页面授权的 code -- 只能重定向回首页
    if (!_isGetCode && !wxCode) { // 每次进来都获取
      // scope=snsapi_base  snsapi_userinfo
      window.location.href = wxRedirectUri
    } else if (!_isGetCode && wxCode) { // 如果有 wxCode
      _isGetCode = true // 控制只执行一次
      mainjsData.isGetCode = _isGetCode
      if (sessionStorage) {
        sessionStorage.setItem('mainjsData', JSON.stringify(mainjsData))
      }
    }
  }
})()
