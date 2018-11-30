const enumService = {
  depreciation: [
    {key: 0, value: '全选'},
    {key: 1, value: '全新正品'},
    {key: 2, value: '二手优品'}
  ],
  getDepreciationByKey(key) {
    let item = null
    for (var i in this.depreciation) {
      if (this.depreciation[i].key === key) {
        item = this.depreciation[i]
        break
      }
    }
    return item
  }
}

export default enumService
