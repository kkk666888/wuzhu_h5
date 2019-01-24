class Drag {
  constructor() {
    this.init()
    this.setEvent()
  }

  init() {
    this.dom = document.getElementById('YSF-BTN-HOLDER')
    this.offsetY = 0 // 起始Y位置（每次位移前都是0）
    this.offsetX = 0
    this.vh = document.body.clientHeight // 网页可见区域H
    this.vw = document.body.clientWidth
    this.left = this.dom.offsetLeft // 当前元素离左边距离
    this.top = this.dom.offsetTop
    this.width = this.dom.offsetWidth || this.dom.clientWidth || this.dom.style.width // 元素自身width
    this.height = this.dom.offsetHeight || this.dom.clientHeight || this.dom.style.height
    this.maxHeight = this.vh - this.height // 最大高度 = 视口高度 - 自身高度 ，最小高度为0
    this.maxWidth = this.vw - this.width
    this.dom.style.cssText += 'position:absolute;-webkit-transform: translate3d(0,0,0);-webkit-backface-visibility: hidden;'
    this.dom.setAttribute('pos', this.left + '-' + this.top)
  }
  setEvent() {
    var self = this
    var startHandler = function(e) {
      // console.log(111)
      e.stopPropagation()
      self.startY = e.touches[0].pageY // 触摸位于Y的位置
      self.startX = e.touches[0].pageX

      self.offsetY = 0
      self.offsetX = 0
      var pos = self.dom.getAttribute('pos'),
          left = parseInt(pos.split('-')[0]),
          top = parseInt(pos.split('-')[1])

      self.left = left
      self.top = top
    }

    var moveHandler = function(e) {
      e.stopPropagation()
      // 阻止浏览器的滚动事件
      window.ontouchmove = e.preventDefault()
      self.offsetY = e.targetTouches[0].pageY - self.startY
      self.offsetX = e.targetTouches[0].pageX - self.startX
        // 范围限制
        var l = self.left + self.offsetX,
        t = self.top + self.offsetY,
        left = (l < 0) ? 0 : (l > self.maxWidth ? self.maxWidth : l),
        top = (t < 0) ? 0 : (t > self.maxHeight ? self.maxHeight : t)

      self.dom.style.cssText += '-webkit-transform: translate3d(' + self.offsetX + 'px,' + self.offsetY + 'px,0);'
      self.dom.setAttribute('pos', left + '-' + top)
    }

    var endHandler = function(e) {
      // console.log(444)
      e.stopPropagation()
        // 范围限制
        var l = self.left + self.offsetX,
        t = self.top + self.offsetY,
        left = (l < 0) ? 0 : (l > self.maxWidth ? self.maxWidth : l),
        top = (t < 0) ? 0 : (t > self.maxHeight ? self.maxHeight : t)

      self.dom.setAttribute('pos', left + '-' + top)
      self.dom.style.cssText += '-webkit-transform: translate3d(0,0,0);left: ' + left + 'px; ' + 'top: ' + top + 'px;right:auto;bottom:auto;'
      self.offsetX = self.offsetY = 0
      self.left = left
      self.top = top
    }
    this.dom.addEventListener('touchstart', startHandler)
    this.dom.addEventListener('touchmove', moveHandler)
    this.dom.addEventListener('touchend', endHandler)
  }
}
