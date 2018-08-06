export default {
  // 发起续租
  launchRelet(vm, item) {
    let spec = ''
    let type = Object.prototype.toString.call(item.specContentList)
    switch (type) {
      case '[object Array]':
        spec = item.specContentList.join('、')
        break
      case '[object String]':
        spec = item.specContentList.replace(/,/g, '、')
        break
    }
    let htmlContent = '<div style="text-align: left;color:#888font-size: 14px;padding: 10px;line-height: 22px;">您续租的商品为：'
    htmlContent += '<span style="color:#333">' + item.shortName + '、' + spec + '</span>'
    htmlContent += '<div style="margin-top: 10px;">续租时仅能续租原商品，不支持换货，续租时维持原押金，无需重新支付押金。押金将在租赁订单完结时进行结算。</div></div>'
    let url = '/wuzhu/renew/renewCommodity?orderNo=' + item.orderNo
    vm.$vux.loading.show({ text: 'Loading' })
    vm.$http.get(url).then((res) => {
      vm.$vux.loading.hide()
      if (res.code === '00' && res.data) {
        vm.$vux.confirm.show({
          title: '发起续租',
          content: htmlContent,
          onConfirm() {
            vm.$router.push({ name: 'reletConfirmOrder', params: {orderNo: item.orderNo} });
          }
        })
      } else {
        vm.$vux.alert.show({
          content: res.msg
        })
      }
    }).catch(err => {
      vm.$vux.loading.hide()
      console.log(err)
    })
  },
  // 金额格式化
  moneyFormat(str) {
    if (!str) return '0.00'
    let num = parseFloat(str).toFixed(2)
    return num && num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
      return $1 + ','
    })
  },
  // 时间格式化
  dateFormat(str, fmt = 'yyyy-MM-dd') {
    try {
      if (!str) {
        return ''
      }
      // 兼容苹果浏览器 date的格式为2018-01-01 10:00:00 || 2018/01/01 10:00:00
      let arr = str.split(/[- : /]/)
      let date = null
      if (arr.length === 3) {
          date = new Date(arr[0], arr[1] - 1, arr[2])
      } else if (arr.length === 6) {
          date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
      } else {
          return str
      }
      let o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    } catch (e) {
      return ''
    }
  },
  // 生成唯一标识
  generateUniqueValue() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
  },
  // 深复制
  deepCopy(obj) {
    let type = Object.prototype.toString.call(obj);
    if (type === '[object Object]') {
        let newobj = {};
        for (var attr in obj) {
          newobj[attr] = this.deepCopy(obj[attr]);
        }
        return newobj;
    } else if (type === '[object Array]') {
        let newArr = [];
        for (var attr2 in obj) {
            newArr.push(this.deepCopy(obj[attr2]))
        }
        return newArr;
    } else {
        return obj;
    }
  }
}
