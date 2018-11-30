import common from '../util/common.js'
const filters = {
  moneyFormat(value) {
    return common.moneyFormat(value)
  },
  dateFormat(value, fmt) {
    return common.dateFormat(value, fmt)
  }
}

export default filters
