import store from '../store/store'
import Http from './http'

function getUrlName() {
  let $url = window.location.href
  let index = $url.match(/#/).index + 2
  return $url.slice(index).split('?')[0]
}

export class ReportData {
  constructor() {
  	let opt = arguments[0] || {}
  	console.log(opt)
  	this.sessionStore = this.getSessionStore()
  	this.brisk = {
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
      edittimes: []
    }
  }

  getSessionStore() {
  	if (sessionStorage) {
      let _ReporterDataSE = sessionStorage.getItem('ReporterDataSE')
      if (_ReporterDataSE) {
        this.sessionStore = JSON.parse(_ReporterDataSE)
      }
    }
    return this.sessionStore
  }

  refreshPagein() {
  	this.brisk.pagein = new Date().getTime()
  }

  // get pageout() {
  //   return this.brisk.pageout
  // }
  getPageout() {
    return this.brisk.pageout
  }

  getPagein() {
    return this.brisk.pagein
  }

  refreshPageout() {
  	this.brisk.pageout = new Date().getTime()
  }

  // 生成埋点唯一编号 sessionStorge 中（）
  createByno() {
  	let _wxOpenID = String(store.state.othersOpenID).replace(/_/g, 'T') || 'noOpenID'
    let _byno = _wxOpenID + String(new Date().getTime())
    let ReporterDataSE = this.getSessionStore()
    ReporterDataSE.byno = _byno
    if (sessionStorage) {
      sessionStorage.setItem('ReporterDataSE', JSON.stringify(ReporterDataSE))
      this.getSessionStore() // 刷新 this.sessionStore 的值
    }
  }

  /**
   * 离开页面时, 提交埋点数据
   * opt: object
   * @param:
   *     edittimes -- [] type and times
   *     notPageout -- 不去自动统计用户上报数据的时间; 默认统计, 传入 true 就不统计
   **/
  dataReport() {
  	let that = this
  	let opt = arguments[0] || {}
    if (opt.edittimes) {
      that.brisk.edittimes = opt.edittimes
    }
    if (!opt.notPageout) {
      that.brisk.pageout = new Date().getTime()
    }
    return new Promise(function(resolve, reject) {
      Http.post('/wuzhu/page/pageDatagram', that.brisk).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
