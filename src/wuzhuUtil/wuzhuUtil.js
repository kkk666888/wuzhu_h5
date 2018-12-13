// 该部分主要是针对关于费用展示，以及时间展示逻辑进行抽取便于统一管理
// 获取费用统一的描述，针对费用详情
export function getFeeDescStr(feeItem) {
  let feeAccessWay = feeItem['feeAccessWay'];
  let feeName = feeItem['feeName'];
  let feeCalcRadices = feeItem['feeCalcRadices'];
  let feeAccessWayConfig = feeItem['feeAccessWayConfig'];
  let ItemName = feeName;
  switch (feeAccessWay) {
    case '001': {
      // 固定金额
      ItemName = '￥' + feeAccessWayConfig;
      break;
    }
    case '002': {
      // 按天计算
      let strs = [];
      strs = feeAccessWayConfig.split(',');
      if (strs.length < 2) {
        ItemName = '￥' + strs[0] + '/' + '天';
      } else {
        ItemName = '￥' + strs[1] + '/' + strs[0] + '天';
      }
      break;
    }
    case '003': {
      // 固定比率
      ItemName = feeAccessWayConfig + '% * ' + '(' + feeCalcRadices + ')';
      break;
    }
    default: {
      break;
    }
  }
  return ItemName;
}

// 入参： 传入的是date 返回格式为 2018/5/18 格式的日期
export function getTimerStr(date) {
  let year = date.getFullYear();
  let mouth = date.getMonth() + 1;
  let day = date.getDate();
  if (year < 10) {
    year = '0' + year;
  }
  if (mouth < 10) {
    mouth = '0' + mouth;
  }
  if (day < 10) {
    day = '0' + day;
  }
  let tempStr = year + '/' + mouth + '/' + day;
  return tempStr;
}

// 入参： 传入的是 long类型 s数 返回格式为 2018.5.18 00:00:00 格式的日期
export function getTimerDotStrWithTimeStr(timeStr) {
  // 注意当timeStr为null的时候，所以注意先后顺序
  if (timeStr === undefined || timeStr === null || timeStr.length === 0) {
    return '--';
  }
  // 搞定safari里面问题，将-替换成/再转换 / 表示正则 /g 表示全部
  let newTimeStr = timeStr.replace(/-/g, '/');
  // 注意date的单位需要转化成ms数进行计算
  let date = new Date(newTimeStr);
  let year = date.getFullYear();
  let mouth = date.getMonth() + 1;
  let day = date.getDate();
  if (year < 10) {
    year = '0' + year;
  }
  if (mouth < 10) {
    mouth = '0' + mouth;
  }
  if (day < 10) {
    day = '0' + day;
  }
  let tempStr = year + '.' + mouth + '.' + day;
  return tempStr;
}

// 入参： 传入的是 long类型 s数 返回格式为 2018.5.18 格式的日期
export function getTimerDotStr(slong) {
  if (slong === 0 || slong === null) {
    return '--';
  }
  // 注意date的单位需要转化成ms数进行计算
  let date = new Date(slong * 1000);
  let year = date.getFullYear();
  let mouth = date.getMonth() + 1;
  let day = date.getDate();
  if (year < 10) {
    year = '0' + year;
  }
  if (mouth < 10) {
    mouth = '0' + mouth;
  }
  if (day < 10) {
    day = '0' + day;
  }
  let tempStr = year + '.' + mouth + '.' + day;
  return tempStr;
}

// 将后台返回的试算转成需要的试算列表
// 入参:后台返回的试算数据
export function getTrailTableList(mapData) {
  let table = [];
  if (mapData !== undefined && mapData instanceof Object) {
    for (let x in mapData) {
      let tempArray = mapData[x];
      let totalMoney = 0;
      let OwingMonty = 0;
      let subTermItem = tempArray[0];
      for (let j = 0; j < tempArray.length; j++) {
        let tempItem = tempArray[j];
        // 判断下费用类型是否为空，为空就展示成租金
        let feeTypeCode = tempItem && tempItem['feeTypeCode'];
        if (feeTypeCode === null) {
          tempItem['feeName'] = '租金';
        }
        totalMoney = totalMoney + tempItem['payAmt'];
      }
      // let starDate = new Date(subTermItem['termStartDayLong'])
      // let termDays = parseInt(subTermItem['termDays'])
      // // let endDate = new Date(subTermItem['payDayLong'])
      // let endDateLong = subTermItem['termStartDayLong'] + termDays * 24 * 3600 * 1000
      // let endDate = new Date(endDateLong)
      // let termStartDate = this.getTimerStr(starDate)
      // let payStrDate = this.getTimerStr(endDate)
      let starDate = new Date(subTermItem['termStartDayLong']);
      let endDate = new Date(subTermItem['termEndDayLong']);
      let termStartDate = getTimerStr(starDate);
      let payStrDate = getTimerStr(endDate);
      // 将对应的总金额变成2位小数展示
      totalMoney = totalMoney.toFixed(2);
      OwingMonty = OwingMonty.toFixed(2);
      // 获取对应的时间
      table.push({
        term: subTermItem.term, // 第几期
        termStartDate: termStartDate, // 应付款日期
        payDate: payStrDate, // 付款时间
        delayPayDate: subTermItem.delayPayDate,
        termDays: subTermItem.termDays, //  改天的期数
        totalMoney: totalMoney, //  总金额
        OwingMonty: OwingMonty, //  欠费的钱
        paymentStatus: subTermItem.paymentStatus,
        selected: false,
        Array: tempArray
      });
    }
  }
  return table;
}

// 抽取出来支付方式判断的逻辑
// 后台返回的字符方式字符串  '0,1' 这样的
// 0 表示分期  1 表示一次性支出   2表示一次性支付或者分期支付 3 后台没有返回对应的字段
// 返回的类型为num类型
export function getPayStayleEnum(actualRentPayStyle) {
  if (actualRentPayStyle === null || actualRentPayStyle === undefined) {
    return 3;
  }
  let letter1 = actualRentPayStyle.indexOf('1') !== -1; // 一次性支付
  let letter0 = actualRentPayStyle.indexOf('0') !== -1; //  按月分期
  if (letter1 && letter0) {
    return 2;
  } else if (letter1 && !letter0) {
    return 1;
  } else if (!letter1 && letter0) {
    return 0;
  } else {
    return 3;
  }
}

// 该方法用于处理js中的乘法精度丢失的问题
// 乘法(处理浮点数的乘法问题)
export function mul2Num(number1, number2) {
  var m = 0;
  var s1 = number1.toString();
  var s2 = number2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {}
  try {
    m += s2.split('.')[1].length;
  } catch (e) {}
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
}
