// 目前先用LocalStorage,后续可以考虑采用sql
const cacheUtil = {}
// 基本的数据类型就采用如下方法
cacheUtil.getBase = function(name) {
  return localStorage.getItem(name)
}
cacheUtil.setBase = function(name, value) {
  localStorage.setItem(name, value)
}

// 为了对象类型提供的存储方法
cacheUtil.getObject = function(name) {
  return JSON.parse(localStorage.getItem(name))
}

cacheUtil.setObject = function(name, value) {
  localStorage.setItem(name, JSON.stringify(value))
}

cacheUtil.addObject = function(name, addVal) {
  localStorage.set(name, addVal)
}

// delete两个方法通用
cacheUtil.delete = function(name) {
  localStorage.removeItem(name)
}

export default cacheUtil
