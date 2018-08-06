import store from '../store/store'
import Http from './http'

function getUrlName() {
  let $url = window.location.href
  let index = $url.match(/#/).index + 2
  return $url.slice(index).split('?')[0]
}
// 1. pagename 登录、身份信息验证（OCR）、确认预约
// 2. edittimes.type 登录页面验证码、确认预约页面紧急联系人姓名、电话、关系
/**
 * mounted
 * this.$reporter.init()
 * */

const Reporter = {
  sessionStore: {
    byno: ''
  },
  brisk: {},
  edittimes: [],
  leaveTime: function() {
    this.brisk.createdate = new Date().getTime()
    this.brisk.timecose = this.brisk.timecose - new Date().getTime()
  },
  /**
   * 离开页面时, 提交埋点数据
   * opt: object
   * @param:
   *     edittimes -- [] type and times
   *     notPageout -- 不去自动统计用户上报数据的时间; 默认统计, 传入 true 就不统计
   **/
  dataReport: function(opt) {
    let that = this
    if (opt) {
      if (opt.edittimes) {
        that.brisk.edittimes = opt.edittimes
      }
      if (!opt.notPageout) {
        that.brisk.pageout = new Date().getTime()
      }
    } else {
      that.brisk.pageout = new Date().getTime()
    }
    return new Promise(function(resolve, reject) {
      // {
      //   datagram: that.brisk
      // }
      Http.post('/wuzhu/page/pageDatagram', that.brisk).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  getSessionStore: function() {
    if (sessionStorage) {
      let _ReporterDataSE = sessionStorage.getItem('ReporterDataSE')
      if (_ReporterDataSE) {
        this.sessionStore = JSON.parse(_ReporterDataSE)
      }
    }
    return this.sessionStore
  },
  // 生成埋点唯一编号 sessionStorge 中（）
  createByno: function() {
    let _wxOpenID = String(store.state.othersOpenID).replace(/_/g, 'T') || 'noOpenID'
    let _byno = _wxOpenID + String(new Date().getTime())
    let ReporterDataSE = this.getSessionStore()
    ReporterDataSE.byno = _byno
    if (sessionStorage) {
      sessionStorage.setItem('ReporterDataSE', JSON.stringify(ReporterDataSE))
      this.getSessionStore() // 刷新 this.sessionStore 的值
    }
  },
  init: function(opt) {
    console.log(opt)
    if (!opt) {
      opt = {}
    }
    console.log(opt)
    let o = {
      // 客户标识，与进件信息中相同 - 后台获取
      userid: '', // 后台填
      byno: this.sessionStore.byno, // 埋点标识，与进件信息中相同
      // contractid: store.state.contractNO,
      ip: '', // ip地址 - 后台填
      osinfo: store.state.osinfo, // 用户设备信息 -- 安卓 or ios
      gpspos: { // gps
        lat: store.state.lat, // 纬度
        lng: store.state.lng // 经度
      },
      pagecnname: opt.pagecnname || document.title, // 该页面中文名称
      pagename: opt.pagename || getUrlName(),
      pagein: opt.pagein || (new Date().getTime()), // 进入页面时间 ms
      pageout: '', // 离开页面时间 -- 在 dataReport 时设置
      edittimes: [
        // {
        //   type: '', // 编辑控件名称 or 上传类型
        //   times: '' // 编辑次数 or 上传次数
        // }
      ]
    }
    this.brisk = o
    console.log(o)
  }
}

export default Reporter
