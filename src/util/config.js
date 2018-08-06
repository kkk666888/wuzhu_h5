const Config = {
  active: 'dev',
  test: { // 测试环境，对应公众号appid：wx261437e4488ec0ab（小主UAT）-- wuzhuRelease
    appid: 'wx261437e4488ec0ab',
    jdUrl: 'https://wuzhutes.woozhu.cn/dist/', // 58.250.80.57 -- 测试
    xiaoBaiUrl: 'https://opencredit-yf.jd.com/oauth2/bind?merchantCode=74871465',
    jdMiddlePage: 'https://opencredit-yf.jd.com/resources/html/oauth2/user/app/index.html?merchantCode=74871465',  // 京东接入的中间页地址
    _hoststr: 'https://wuzhutes.woozhu.cn',
    active: 'test'
  },
  dev: { // 开发环境，对应公众号appid：wxa0cdc288acfa5d63（小主DEV）-- dev
    appid: 'wxa0cdc288acfa5d63',
    jdUrl: 'https://dev.woozhu.cn/dist/', // 39.107.82.143
    // _hoststr: 'http://192.168.2.8:9093', // mhb
    // _hoststr: 'http://10.35.90.51:9093', // xiazong
    // _hoststr: 'http://10.35.90.17:9093', // Thruman
    // _hoststr: 'http://10.35.90.24:9093', // lym
    // _hoststr: 'http://39.107.82.143:9093', // 阿里云
    // _hoststr: window.location.host,
    // _hoststr: 'https://jindatest.dafyjk.com',
    // _hoststr: window.location.href.split('/dist')[0] + ':9093',
    // _hoststr: 'http://45093fe1.nat123.cc:59090', // 外网
    // _hoststr: 'http://10.35.90.16:9093', // yaoge
    // _hoststr: 'http://10.35.60.191:9093', // mhb
    // _hoststr: 'http://10.35.40.142:9093', // yubing
    xiaoBaiUrl: 'https://opencredit-yf.jd.com/oauth2/bind?merchantCode=74871465',
    jdMiddlePage: 'https://opencredit-yf.jd.com/resources/html/oauth2/user/app/index.html?merchantCode=74871465',  // 京东接入的中间页地址
    _hoststr: 'https://dev.woozhu.cn',
    // _hoststr: 'http://10.35.90.195:9093',
    active: 'dev'
  },
  product: {// 生产环境，对应公众号appid：wx65cbb2ec17a732ad（物主）-- wuzhuProduct
    appid: 'wx65cbb2ec17a732ad',
    jdUrl: 'https://wuzhu.dafyjk.com/dist/', // 47.106.92.122
    xiaoBaiUrl: 'https://opencredit.jd.com/oauth2/bind?merchantCode=74871465',
    jdMiddlePage: 'https://opencredit.jd.com/resources/html/oauth2/user/app/index.html?merchantCode=74871465',  // 京东接入的中间页地址
    _hoststr: 'https://wuzhu.dafyjk.com',
    active: 'product'
  }
}

export default Config[Config.active]
