const Config = {
  active: 'test',
  test: {
    // 测试环境，对应公众号appid：wx261437e4488ec0ab（小主UAT）-- wuzhuRelease
    appid: 'wx261437e4488ec0ab',
    jdUrl: 'https://wuzhusle.woozhu.cn/dist/', // 58.250.80.57 --  测试
    xiaoBaiUrl: 'https://opencredit-yf.jd.com/oauth2/bind?merchantCode=74871465',
    jdMiddlePage: 'https://opencredit-yf.jd.com/resources/html/oauth2/user/app/index.html?merchantCode=74871465', // 京东接入的中间页地址
    alipaylifeAuthUrl: 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2018040502508557&scope=auth_user&redirect_uri=https%3A%2F%2Fwuzhusle.woozhu.cn%2Fdist%2F%3FchannelNo%3D004%26type%3Dcredit', // 支付宝生活号授权地址
    _hoststr: 'https://wuzhusle.woozhu.cn',
    active: 'test'
  },
  dev: {
    // 开发环境，对应公众号appid：wxa0cdc288acfa5d63（小主DEV）-- dev
    appid: 'wxa0cdc288acfa5d63',
    jdUrl: 'https://dev.woozhu.net/dist/', // 39.107.82.143
    // _hoststr: 'http://39.107.82.143:9093', // 阿里云
    // _hoststr: 'http://192.168.0.107:9093', // zqy
    _hoststr: 'http://192.168.1.37:9093', // mhb
    // _hoststr: 'http://10.35.40.142:9093', // yubing
    // _hoststr: 'http://192.168.1.28:9093', // qy
    // _hoststr: 'http://qianyi.s1.natapp.cc', // 钱毅
    xiaoBaiUrl: 'https://opencredit-yf.jd.com/oauth2/bind?merchantCode=74871465',
    jdMiddlePage: 'https://opencredit-yf.jd.com/resources/html/oauth2/user/app/index.html?merchantCode=74871465', // 京东接入的中间页地址
    alipaylifeAuthUrl: 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2018040502508557&scope=auth_user&redirect_uri=https%3A%2F%2Fwuzhusle.woozhu.cn%2Fdist%2F%3FchannelNo%3D004%26type%3Dcredit', // 支付宝生活号授权地址
    active: 'dev'
  },
  product: {
    // 生产环境，对应公众号appid：wx65cbb2ec17a732ad（物主）-- wuzhuProduct
    appid: 'wx65cbb2ec17a732ad',
    jdUrl: 'https://wuzhu.woozhu.cn/dist/', // 47.106.92.122
    xiaoBaiUrl: 'https://opencredit.jd.com/oauth2/bind?merchantCode=74871465',
    jdMiddlePage: 'https://opencredit.jd.com/resources/html/oauth2/user/app/index.html?merchantCode=74871465', // 京东接入的中间页地址
    alipaylifeAuthUrl: 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2018110261973355&scope=auth_user&redirect_uri=https%3A%2F%2Fwuzhu.woozhu.cn%2Fdist%2F%3FchannelNo%3D004%26type%3Dcredit', // 支付宝生活号授权地址
    _hoststr: 'https://wuzhu.woozhu.cn',
    active: 'product'
  }
};

export default Config[Config.active];
