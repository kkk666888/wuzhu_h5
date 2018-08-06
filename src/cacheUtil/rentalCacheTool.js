import * as keyChain from './cacheConst.js'
import cacheUtil from './cacheUtil.js'

const rentalCacheTool = {}
// 商品详情页面的使用
// 存储商品详情的标志位
rentalCacheTool.markGoodJump2LoginFlag = function(flag) {
  cacheUtil.setBase(keyChain.goodsDetailJumpToLogin, flag)
}

// 清楚的对应的标志位
rentalCacheTool.clearGoodJump2LoginFlag = function(flag) {
  cacheUtil.delete(keyChain.goodsDetailJumpToLogin)
}

// 判断是否需要从缓存中获取用户的选择数据
rentalCacheTool.isRequiredGetUserChoose = function() {
  let ok = cacheUtil.getBase(keyChain.goodsDetailJumpToLogin)
  if (ok === true || ok === 'true') {    // 实际上的存储放到Storage里面会转成 字符串的 'true'
    return true
  } else {
    return false
  }
}
// 存储商品详情页中用户的选择
rentalCacheTool.saveUserChooseInGoodsDetail = function(userChoose) {
  cacheUtil.setObject(keyChain.goodsDetailUserChoose, userChoose)
}

// 获取上次存储在商品详情页中用户的选择
rentalCacheTool.getUserChooseInGoodsDetail = function() {
  let userChoose = cacheUtil.getObject(keyChain.goodsDetailUserChoose)
  return userChoose
}

// 删除对应商品详情的存储
rentalCacheTool.clearUserChooseInGoodsDetail = function() {
   cacheUtil.delete(keyChain.goodsDetailUserChoose)
}
// 临时存储生成的预约号, 新增和覆盖 采用的同一个方法
rentalCacheTool.saveApplyNo = function(applyNo) {
  cacheUtil.setBase(keyChain.goodsDetaiApplySerialNo, applyNo)
}

// 获取对应的获取对应的ApplyNo预约号
rentalCacheTool.getApplyNo = function() {
  let applyNo = cacheUtil.getBase(keyChain.goodsDetaiApplySerialNo)
  return applyNo
}

// 删除对应ApplyNo
rentalCacheTool.clearApplyNo = function() {
  cacheUtil.delete(keyChain.goodsDetaiApplySerialNo)
}

export default rentalCacheTool
