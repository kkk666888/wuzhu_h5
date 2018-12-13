<template>
  <div ref="wrapper" class="list-wrapper">
    <div class="scroll-content">
      <div ref="listWrapper" class="list-div">
        <slot>
          <div class="recommend-row" v-for="goodsItem in data" :key="goodsItem.categoryCode">
            <div class="item-img">
              <img v-lazy="goodsItem.listImg" @click="clickItem($event, goodsItem)">
              <span class="list-label" :class="goodsItem.commodityListTagPosition">{{goodsItem.commodityListTag}}</span>
            </div>
            <p class="item-title text-ellipsis">{{goodsItem.shortName}}</p>
            <div class="item-price">
              <div class="price-block">
                <span class="new-price color-red">￥<span class="fz16 fw-b">{{goodsItem.leastRentDay}}</span></span>/天
              </div>
              <div v-if="goodsItem.leastOriginalPrice" class="price-block old-price">
                ￥{{goodsItem.leastOriginalPrice}}/天
              </div>
            </div>
          </div>
        </slot>
      </div>
      <slot name="pullup"
            :pullUpLoad="pullUpLoad"
            :isPullUpLoad="isPullUpLoad"
      >
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span>{{pullUpTxt}}</span>
          </div>
          <div class="after-trigger" v-else>
            <loading></loading>
          </div>
        </div>
      </slot>
    </div>
    <slot name="pulldown"
          :pullDownRefresh="pullDownRefresh"
          :pullDownStyle="pullDownStyle"
          :beforePullDown="beforePullDown"
          :isPullingDown="isPullingDown"
          :bubbleY="bubbleY"
    >
      <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
        <div class="before-trigger" v-if="beforePullDown">
          <bubble :y="bubbleY"></bubble>
        </div>
        <div class="after-trigger" v-else>
          <div v-if="isPullingDown" class="loading">
            <loading></loading>
          </div>
          <div v-else><span>{{refreshTxt}}</span></div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Loading from '../Loading/Loading.vue';
  import Bubble from '../Bubble/Bubble.vue';
  import { isAlipayLife } from '../../util/utils';

  const COMPONENT_NAME = 'scroll';
  const DIRECTION_H = 'horizontal';
  const DIRECTION_V = 'vertical';

  function getRect(el) {
    if (el instanceof window.SVGElement) {
      let rect = el.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      };
    } else {
      return {
        top: el.offsetTop,
        left: el.offsetLeft,
        width: el.offsetWidth,
        height: el.offsetHeight
      };
    }
  }

  export default {
    name: COMPONENT_NAME,
    props: {
      data: {
        type: Array,
        default: function() {
          return [];
        }
      },
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      listenBeforeScroll: {
        type: Boolean,
        default: false
      },
      direction: {
        type: String,
        default: DIRECTION_V
      },
      scrollbar: {
        type: null,
        default: false
      },
      pullDownRefresh: {
        type: null,
        default: false
      },
      pullUpLoad: {
        type: null,
        default: false
      },
      startY: {
        type: Number,
        default: 0
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      freeScroll: {
        type: Boolean,
        default: false
      },
      mouseWheel: {
        type: Boolean,
        default: false
      },
      bounce: {
        default: true
      }
    },
    data() {
      return {
        beforePullDown: true,
        isRebounding: false,
        isPullingDown: false,
        isPullUpLoad: false,
        pullUpDirty: true,
        pullDownStyle: '',
        bubbleY: 0,
        isAlipayLife: isAlipayLife()
      };
    },
    computed: {
      pullUpTxt() {
        const moreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more;
        const noMoreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.noMore;
        return this.pullUpDirty ? moreTxt : noMoreTxt;
      },
      refreshTxt() {
        return this.pullDownRefresh && this.pullDownRefresh.txt;
      }
    },
    created() {
      this.pullDownInitTop = -50;
    },
    mounted() {
      setTimeout(() => {
        this.initScroll();
      }, 20);
    },
    methods: {
      initScroll() {
        if (!this.$refs.wrapper) {
          return;
        }
        if (this.$refs.listWrapper && (this.pullDownRefresh || this.pullUpLoad)) {
          this.$refs.listWrapper.style.minHeight = `${getRect(this.$refs.wrapper).height + 1}px`;
        }
        let options = {
          probeType: this.probeType,
          click: this.click,
          scrollY: this.freeScroll || this.direction === DIRECTION_V,
          scrollX: this.freeScroll || this.direction === DIRECTION_H,
          scrollbar: this.scrollbar,
          pullDownRefresh: this.pullDownRefresh,
          pullUpLoad: this.pullUpLoad,
          startY: this.startY,
          freeScroll: this.freeScroll,
          mouseWheel: this.mouseWheel,
          bounce: this.bounce
        };
        this.scroll = new BScroll(this.$refs.wrapper, options);
        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos);
          });
        }
        if (this.listenBeforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScrollStart');
          });
        }
        if (this.pullDownRefresh) {
          this._initPullDownRefresh();
        }
        if (this.pullUpLoad) {
          this._initPullUpLoad();
        }
      },
      disable() {
        this.scroll && this.scroll.disable();
      },
      enable() {
        this.scroll && this.scroll.enable();
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      },
      clickItem(e, item) {
        this.$emit('click', item);
      },
      destroy() {
        this.scroll.destroy();
      },
      forceUpdate(dirty) {
        if (this.pullDownRefresh && this.isPullingDown) {
          this.isPullingDown = false;
          this._reboundPullDown().then(() => {
            this._afterPullDown();
          });
        } else if (this.pullUpLoad && this.isPullUpLoad) {
          this.isPullUpLoad = false;
          this.scroll.finishPullUp();
          this.pullUpDirty = dirty;
          this.refresh();
        } else {
          this.refresh();
        }
      },
      _initPullDownRefresh() {
        this.scroll.on('pullingDown', () => {
          this.beforePullDown = false;
          this.isPullingDown = true;
          this.$emit('pullingDown');
        });
        this.scroll.on('scroll', (pos) => {
          if (!this.pullDownRefresh) {
            return;
          }
          if (this.beforePullDown) {
            this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop);
            this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`;
          } else {
            this.bubbleY = 0;
          }
          if (this.isRebounding) {
            this.pullDownStyle = `top:${10 - (this.pullDownRefresh.stop - pos.y)}px`;
          }
        });
      },
      _initPullUpLoad() {
        this.scroll.on('pullingUp', () => {
          this.isPullUpLoad = true;
          this.$emit('pullingUp');
        });
      },
      _reboundPullDown() {
        const { stopTime = 600 } = this.pullDownRefresh;
        return new Promise((resolve) => {
          setTimeout(() => {
            this.isRebounding = true;
            this.scroll.finishPullDown();
            resolve();
          }, stopTime);
        });
      },
      _afterPullDown() {
        setTimeout(() => {
          this.pullDownStyle = `top:${this.pullDownInitTop}px`;
          this.beforePullDown = true;
          this.isRebounding = false;
          this.refresh();
        }, this.scroll.options.bounceTime);
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.forceUpdate(true);
        }, this.refreshDelay);
      }
    },
    components: {
      Loading,
      Bubble
    }
  };
</script>

<style lang="less">
  @import '../../common/less/index.less';

  @color-2: #222;
  @color-8: #888;
  .list-wrapper {
    position: relative;
    height: 100%;
    overflow: hidden;
    background: #fff;
    font-family: "PingFangSC-Regular";

    .scroll-content {
      position: relative;
      z-index: 1;
    }

    .list-content {
      position: relative;
      z-index: 10;
      background: #fff;

      .list-items {
        display: flex;
        box-sizing: border-box;

        .left-box {
          flex: 0 0 132px;
          width: 132px;
          line-height: 0;

          img {
            width: 100%;
          }
        }

        .right-box {
          flex: 1;
          width: 100%;
          margin-right: 10px;
          .border-1px(#ddd);
        }

        .items-title {
          width: 100%;
          padding-top: 10px;
          font-size: 14px;
          line-heigth: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          color: #000;
          opacity: .85;
        }

        .items-tag {
          height: 25px;
          overflow: hidden;
          max-width: 90%;

          span {
            display: inline-block;
            padding: 2px 5px;
            margin-right: 3px;
            color: #F5222D;
            font-size: 10px;
            line-height: 14px;
            max-width: 90%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            .border-r1(#F5222D);
          }
        }

        .gray {
          color: #000;
          opacity: .45;
        }

        .red {
          color: #F5222D;
        }

        .f16 {
          font-size: 16px;
          font-family: "PingFangSC-Medium";
        }

        .f10 {
          font-size: 10px;
        }

        .items-price {
          vertical-align: bottom;
          text-align: left;
        }
      }
    }

    .list-div {
      padding: 4%;
      display: flex;
      flex-wrap: wrap;
      .recommend-row {
        margin: 0 4% 4% 0;
        flex: 0 0 48%;
        &:nth-child(even) {
          margin-right: 0;
        }
        .item-img {
          font-size: 0;
          position: relative;
          border-radius: 4px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
          }

          .list-label {
            display: inline-block;
            text-align: center;
            padding: 0 5px;
            position: absolute;
            background-color: #FF3333;
            color: #fff;
            font-size: 10px;
            line-height: 18px;
          }

          .LEFT-UP {
            top: 10px;
            left: 0;
            border-bottom-right-radius: 9px;
            border-top-right-radius: 9px;
          }

          .LEFT-DOWN {
            bottom: 10px;
            left: 0;
            border-bottom-right-radius: 9px;
            border-top-right-radius: 9px;
          }

          .RIGHT-UP {
            right: 0;
            top: 10px;
            border-top-left-radius: 9px;
            border-bottom-left-radius: 9px;
          }

          .RIGHT-DOWN {
            right: 0;
            bottom: 10px;
            border-top-left-radius: 9px;
            border-bottom-left-radius: 9px;
          }
        }

        .item-title {
          font-size: 14px;
          max-width: 125px;
          color: @color-2;
          line-height: 20px;
          margin: 5px 0 2px 0;
          font-weight: 600;
        }

        .item-price {
          height: 22px;
        }

        .price-block {
          color: @color-8;
          font-size: 10px;
          display: inline-block;
        }
        .old-price {
          text-decoration: line-through;
          font-size: 12px;
          line-height: 22px;
          vertical-align: bottom;
          color: #bbb;
        }
      }
    }
  }

  .pulldown-wrapper {
    position: absolute;
    width: 100%;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all;

    .after-trigger {
      margin-top: 10px;
    }
  }

  .pullup-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
  }



  .color-red {
    color: #F5222D;
  }

  .fz16 {
    font-size: 16px;
  }
</style>
