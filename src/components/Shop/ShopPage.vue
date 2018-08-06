<template>
  <div class="shopTest">
    <!--模拟商品详情的顶部部分-->
    <div class="topDiv">我是商品详情顶部</div>
    <div style="background: black; padding: 10px 15px" @click="goBackToIndex">
      <x-button>返回首页</x-button>
    </div>
    <div style="background: black; padding: 10px 15px" @click="pushMyPage">
      <x-button>查看原来订单</x-button>
    </div>
    <div id = 'output'></div>
    <!--Tab部分的引入-->
    <div class="section2">
      <tab :line-width=3 custom-bar-width="60px"  active-color='#FFDA29' v-model="declarePlaneIndex">
        <tab-item class="vux-center" :selected="declarePlaneDefault === item" v-for="(item, declareIndex) in declareList" @click="declarePlaneDefault = item" :key="declareIndex">{{item}}</tab-item>
      </tab>
      <div class="wrapDiv">
        <div class="rentDesc" v-show="declarePlaneIndex === 0">租赁说明</div>
        <div class="picDesc" v-show="declarePlaneIndex === 1">图文详情</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Tab,
    TabItem,
    XButton

  } from 'vux';
    export default {
        name: 'ShopPage',
      components: {
        Tab,
        TabItem,
        XButton
      },
      data() {
        return {
          declareList: ['租赁说明', '图文详情'],
          declarePlaneIndex: 0,
          declarePlaneDefault: '租赁说明'
        }
      },
      created: function() {
        console.log('调用了create方法======')
      },
      // 路由部分的处理，离开页面和进入页面的处理
      beforeRouteLeave(to, from, next) {
        console.log('from.name = ' + from.name)
        console.log('to.name = ' + to.name)
        let orderDetailM = this.$store.state.orderDetailPageManager
        console.log('this.$store.state.orderDetailPageManager = ' + JSON.stringify(orderDetailM))
        if (to.name === 'EmptyPage') {
          // next({name: 'HomePage'})
          // this.$router.go(-3);
          let pushState = this.$store.state.orderDetailPageManager && this.$store.state.orderDetailPageManager.orderDetailPush
          let pushCount = this.$store.state.orderDetailPageManager && this.$store.state.orderDetailPageManager.orderDetailCount
          if (pushCount === undefined) {
            pushCount = 0
          }
          console.log('Before里面的 pushState方法 (' + pushState + ',' + pushCount + ')')
          if (pushState === true) {
            // 开始设置对应的pushState
            this.$store.commit('orderDetailPageManagerMemory', {
              orderDetailPageManager: {
                orderDetailPush: false,       // 说明是否是开发者主动push 到空页面
                orderDetailCount: pushCount          // 用于统计用户进入的页面层数，方便返回
              }
            })
            next()
          } else {
            // 开始设置对应的pushState
            this.$store.commit('orderDetailPageManagerMemory', {
              orderDetailPageManager: {
                orderDetailPush: false,       // 说明是否是开发者主动push 到空页面
                orderDetailCount: 0           // 用于统计用户进入的页面层数，方便返回
              }
            })
            // 说明用户点击了返回按钮，那么直接返回
            this.$router.go(-pushCount);
            // next()
          }
          next()
        } else {
          next()
        }
      },
      mounted: function() {
        // document.addEventListener('DOMMouseScroll', this.scrollFunc, false);

        // EventUtil.addHandler(document, 'touchstart', handleTouchEvent);
        // EventUtil.addHandler(document, 'touchend', handleTouchEvent);
        // EventUtil.addHandler(document, 'touchmove', handleTouchEvent);

        // document.addEventListener('touchstart', this.handleTouchEvent);
        // document.addEventListener('touchmove', this.handleTouchEvent);
        // document.addEventListener('touchend', this.handleTouchEvent);
      },
      methods: {
        // 返回首页的方法
        pushMyPage: function() {
          console.log('开始push一个一样的页面 ==============');
          // 开始配置下对应的 page
          let pushState = true
          // 每次+2 用于计算层数
          let originCount = this.$store.state.orderDetailPageManager && this.$store.state.orderDetailPageManager.orderDetailCount
          if (originCount === undefined) {
            originCount = 0
          }
          let pushCount = originCount + 2
          // let orderDetailPageManager = {      // 为了搞定订单详情页面附用而引入
          //   orderDetailPush: pushState,       // 说明是否是开发者主动push 到空页面
          //   orderDetailCount: pushCount       // 用于统计用户进入的页面层数，方便返回
          // }
          console.log('pushMyPage里面的 pushState方法 (' + pushState + ',' + pushCount + ')')
          // this.$store.commit('orderDetailPageManagerMemory', {orderDetailPageManager: orderDetailPageManager})
          this.$store.commit('orderDetailPageManagerMemory', {
            orderDetailPageManager: {
              orderDetailPush: pushState,       // 说明是否是开发者主动push 到空页面
              orderDetailCount: pushCount       // 用于统计用户进入的页面层数，方便返回
            }
          })
          this.$router.push({
            name: 'EmptyPage'
          });
          // location.reload()
        },
        // 返回首页的方法
        goBackToIndex: function() {
          var numberOfEntries = window.history.length;
          console.log('即将返回首页 当前层级为' + numberOfEntries);
          let number = -(numberOfEntries - 1)
          console.log('number ==== ' + number);
          // this.$router.go(number);
          this.$router.go(number);
          // window.history.go(number)
          // window.history.go(-2)
        },
        // 用于处理触摸的事件
        handleTouchEvent: function(event) {
          // 只跟踪一次触摸
          // if (event.touches.length === 1) {
          //   var output = document.getElementById('output');
          //   switch (event.type) {
          //     case 'touchstart':
          //       output.innerHTML = 'Touch started (' + event.touches[0].clientX +
          //         ',' + event.touches[0].clientY + ')';
          //       break;
          //     case 'touchend':
          //       output.innerHTML = '<br>Touch ended (' +
          //         event.changedTouches[0].clientX + ',' +
          //         event.changedTouches[0].clientY + ')';
          //       break;
          //     case 'touchmove':
          //       event.preventDefault(); // 阻止滚动
          //       output.innerHTML = '<br>Touch moved (' +
          //         event.changedTouches[0].clientX + ',' +
          //         event.changedTouches[0].clientY + ')';
          //       break;
          //   }
          // }
          this.outputScrollerTop();
        },
        outputScrollerTop: function() {
          let a = document.getElementById('app').scrollTop;
          console.log('滑动距离为：', a);
        }
      },
      watch: {
        declarePlaneIndex(newval, oldval) {
          console.log('newval === ' + newval);
          this.outputScrollerTop();
        }
      }
  }
</script>

<style lang="less">
  @import './../../common/less/index';
  .shopTest{
    .topDiv{
      width: 100%;
      height: 500px;
      background: rebeccapurple;
      text-align: center;
      color: white;
      line-height: 500px;
    }
    .vux-tab .vux-tab-item.vux-tab-selected {
      color: #222 !important;
      border-bottom: 3px solid @orange;
    }
    /*去掉Tab的阴影*/
    .vux-tab-warp{
      box-shadow: 0 0px 0px 0 #DADADA !important;
    }
    .rentDesc{
      width: 100%;
      height: 600px;
      background: green;
      color: white;
      text-align: center;
      line-height: 200px;
    }
    .picDesc{
      width: 100%;
      height: 1800px;
      background: pink;
      color: white;
      text-align: center;
      line-height: 200px;
    }
    .wrapDiv{
      width: 100%;
      height: 500px;
      overflow: auto;
    }
  }
</style>
