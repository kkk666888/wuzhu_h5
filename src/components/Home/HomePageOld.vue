<template>
  <div class="HomePage" id="HomePage">
    <section>
      <swiper :aspect-ratio="400/750" loop auto :index="banner_index" dots-position="center">
        <swiper-item class="fs-swiper-img" v-for="(item, index) in banner_list" :key="index" @click.native="bannerClickIndex(index, item)">
          <img v-lazy="item.imgUrl">
        </swiper-item>
      </swiper>
    </section>
    <section>
      <img class="rent_progress" v-lazy="rent_progress">
    </section>
    <section>
       <tab class="GoodsCategoryPlane" :scroll-threshold="5" bar-active-color="#fff" >
        <tab-item @click.native="goGoodsCategory(index)" :style="tabFlex" v-for="(item, index) in goodsCategory" :key="index">
          <div class="GoodsCategoryPlaneItem">
            <img v-lazy="item.typeImg" class="GoodsCategoryPlaneItem-img"/>
            <div class="GoodsCategoryPlaneItem-name">{{ item.typeName }}</div>
          </div>
        </tab-item>
      </tab>
    </section>
    <div class="GoodsPadding-line"></div>
    <section>
      <div class="popular-goods">
        <div v-if="popularList.length>0" class="goods-header">热租爆款</div>
        <div class="goods-list">
          <div class="goods-item" v-for="(item, index) in popularList" :key="index" @click="goodsClick(item.categoryCode)">
            <img class="item-img" v-lazy="item.listImg"/>
            <div class="item-desc">{{ item.fullName }}</div>
            <div class="item-price">￥{{ item.leastRentDay }}元起</div>
          </div>
        </div>
      </div>
    </section>
    <!-- 推荐商品 -->
    <section v-for="(item0, index0) in phoneList" :key="index0">
      <!-- <div class="GoodsPadding-line2"></div> -->
      <div class="GoodsSection">
        <!-- <scroller lock-y :scrollbar-x=false> -->
          <div v-if="item0.imgUrl" @click="goodsSectionClick(item0)">
            <img class="GoodsSection-ban-img" v-lazy="item0.imgUrl"/>
          </div>
        <!-- </scroller> -->
        <div class="content-wrapper">
          <ul class="list-content">
            <li class="list-items"
                v-for="(item, index) in item0.listCommodityCategory"
                :key="index" @click="goodsClick(item.categoryCode)">
              <div>
                <!-- <img :src="item.listImg"> -->
                <img v-lazy="item.listImg">
              </div>
              <h5 class="items-title">{{item.shortName}}</h5>
              <span class="items-price">￥{{item.leastRentDay}}元/起</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <section>
      <main-page></main-page>
    </section>
    <!-- <section>
      <div class="fs-loading">
        <div class="fs-weui-loading"></div>
        <span>正在加载</span>
      </div>
    </section> -->
  </div>
</template>

<script type="text/ecmascript-6">
import {
  Swiper,
  Loading,
  SwiperItem,
  Flexbox,
  FlexboxItem,
  Divider,
  Grid,
  GridItem,
  Scroller,
  XButton,
  Tab,
  TabItem
} from 'vux';
import MainPage from './../Main/MainPage';
import { RegainOpenid } from './../../util/utils';
export default {
  name: 'HomePage',
  data() {
    return {
      wxReady: false,
      range: 60, // 距下边界高度
      scrollFlag: true, // 控制下滑滚动特效
      banner_index: 1,
      banner_list: [],
      rent_progress: './static/images/Home/rent_progress.jpg',
      goodsCategory: [], // 手机分类 toggle
      phoneList: [], // 二维数组
      popularList: [],
      tabFlex: {
      }
    };
  },
  created() {
    if (this.checkFromWXSign()) {
      let toUrl = window.location.href.split('?')[0] + '#/Pay/WXPayCashing?&from_wxpay=1';
      console.log('toUrl === ' + toUrl);
      window.location.href = toUrl;
    }
  },
  mounted: function() {
    if (this.checkFromWXSign()) {
      return;
    }
    let that = this;
    that.$store.commit('updateLoadingText', { loadText: '加载中' });
    that.$store.commit('goodsCheckNoMemory', { goodsCheckNo: this.enum.depreciation[0] });
    that.$store.commit('updateLoadingStatus', { isLoading: true });
    that.queryHomeInfomation(function(res) {
      that.alertOpenIDerr();
      // that.preventImgDefault() // 禁止 img 默认行为
    });
    // app window
    document.getElementById('app').addEventListener('scroll', this.handleScroll);
    // 获取到申请码后更新到store
    // let recommCode = that.GetQueryString('recommCode')
    // if (localStorage) {
    //   let recommCode = localStorage.getItem('recommCode');
    //   // console.log('recommCode = ' + recommCode);
    //   if (recommCode) {
    //     recommCode = recommCode.split('#')[0];
    //     console.log('recommCode split = ' + recommCode);
    //     this.$store.commit('updateRecommeCode', { recommeCode: recommCode });
    //   }
    // }
    if (this.gotoGoodsDetail()) {
      return;
    }
    that.checkOrder() // 查看是否有“待确定-未审批”定单
  },
  destroyed() {
    // 销毁
    let _bodyClassName = document.getElementsByTagName('body')[0].className;
    document.getElementsByTagName('body')[0].className = String(_bodyClassName).replace('YSF-BTN-HOLDER-HIDE', '');
    document.getElementById('app').removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    checkFromWXSign() {
      // console.log('checkFromWXSign')
      let url = location.href;
      let wxDataSignLabel = ['from_wxpay=1'];
      let isFromWXSign = true;
      wxDataSignLabel.forEach(function(item) {
        if (url.indexOf(item) === -1) {
          isFromWXSign = false;
        }
      });
      return isFromWXSign;
    },
    alertOpenIDerr() {
      let that = this;
      if (sessionStorage) {
        // openid 信息报错
        let _mainjsData = sessionStorage.getItem('mainjsData');
        if (_mainjsData) {
          _mainjsData = JSON.parse(_mainjsData);
          if (_mainjsData.openIDerr && _mainjsData.openIDerr.code !== '00') {
            if (_mainjsData.openIDerr.code === '803') {
              // 803 获取失败
              that.$vux.confirm.show({
                content: '微信授权出现问题，点击确认重新授权',
                onConfirm() {
                  RegainOpenid(); // 重新授权获取 code 值
                },
                onCancel() {
                  // that.$vux.alert.show({
                  //   content: '未授权，可能部分功能不可用'
                  // })
                }
              });
            } else {
              that.$vux.alert.show({
                content: _mainjsData.openIDerr.msg
              });
            }
            _mainjsData.openIDerr = '';
            sessionStorage.setItem('mainjsData', JSON.stringify(_mainjsData));
          }
        }
      }
    },
    // 禁止 img 默认行为
    preventImgDefault() {
      this.$nextTick(function() {
        let fsImgs = document.getElementsByTagName('img');
        for (let i in fsImgs) {
          fsImgs[i].addEventListener('click', e => {
            e.preventDefault();
          });
        }
      });
    },
    // 监听 滚条 滚动
    handleScroll(e) {
      let verify = e.target.scrollTop + e.target.clientHeight + this.range;
      if (verify >= e.target.scrollHeight) {
        this.rangeTrigger();
      }
    },
    rangeTrigger() {
      // 触发
      console.log('>>> rangeTrigger');
    },
    queryHomeInfomation(callback) {
      let that = this;
      that.$http
        .get('/wuzhu/homePageController/queryHomeInfomation', {
          // that.$http.get('/src/components/Home/副本/HomePageData.json', {
          openId: that.$store.state.wxOpenID,
          channelNo: that.$store.state.channelNo
        })
        .then(res => {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          if (res.code === '00' && res.data) {
            // banner
            that.banner_list = res.data.bannerData || [];

            // 手机 电脑 切换
            that.goodsCategory = res.data.typeData;
            if (that.goodsCategory.length > 4) {
              that.$set(that.tabFlex, 'flex', '0 0 20%');
            }
            if (res.data.pageData) {
              // 热租爆款
              that.popularList = res.data.pageData[0] && res.data.pageData[0].listCommodityCategory;
              if (!that.popularList) {
                that.popularList = [];
              } else if (res.data.pageData[0] && res.data.pageData[0].pageModuleNo !== '1') {
                // 根据 第一个pageData 的 pageModuleNo 确定是否显示 热租爆款
                that.popularList = [];
              }
              // 获取手机列表信息 -- 此处需优化 图片懒加载
              res.data.pageData.map(function(item, index, array) {
                if (res.data.pageData[index].pageModuleNo !== '1') {
                  that.phoneList.push(res.data.pageData[index]);
                }
              });
              // that.$nextTick(function() { // GoodsSection-ban-img
              //   let bodyW = document.body.clientWidth
              //   let _popularWidth = (that.goodsSectionBanImgs.length * bodyW)
              //   that.$refs.phoneListBox.map(function(item, index, array) {
              //     that.$refs.phoneListBox[index].style.width = _popularWidth + 'px'
              //     let fsNodeList = that.$refs.phoneListBox[index].querySelectorAll('.box-item')
              //     for (let i = 0; i < fsNodeList.length; i++) {
              //       fsNodeList[i].style.width = bodyW + 'px'
              //     }
              //   })
              // })
            }
          } else {
            that.$vux.alert.show({
              content: res.msg
            });
          }
          callback(res.code);
        })
        .catch(err => {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          console.log(err);
        });
    },
    bannerClickIndex(index, item) {
      this.banner_index = index;
      this.goodsSectionClick(item);
    },
    goGoodsCategory(index) {
      let _goodsCategory = this.goodsCategory[index] || {};
      this.$store.commit('CATEGORY_STATE', { categoryState: _goodsCategory.typeName });
      this.$store.commit('typeNoMemory', { typeNo: _goodsCategory.typeNo });
      this.$router.push({ name: 'GoodsCategory' });
    },
    goodsClick(code) {
      this.$store.commit('categoryCodeMemory', { categoryCode: code });
      this.$router.push({ name: 'GoodsDetailPage' });
    },
    GetQueryString(name) {
      var urlSearch = window.location.href.split('?')[1]; // 根据 ? 分割
      var results = new RegExp('(^|&)' + name + '=([^&]*)').exec(urlSearch);
      if (results) {
        return results[2];
      } else {
        return '';
      }
    },
    // 顶部banner和楼层图banner共用
    goodsSectionClick(item) {
      if (item.categoryCode) {
        this.goodsClick(item.categoryCode);
      } else if (item.typeNo) {
        let obj = this.enum.getDepreciationByKey(item.depreciationRatio || 0);
        this.$store.commit('typeNoMemory', { typeNo: item.typeNo });
        this.$store.commit('goodsCheckNoMemory', { goodsCheckNo: obj });
        this.$router.push({ name: 'GoodsCategory' });
      } else if (item.imgLinkUrl) {
        location.href = item.imgLinkUrl + '?_r=' + Math.random();
      }
    },
    // 检查是否有未审核完成定单
    checkOrder() {
      let that = this;
      that.$http.post('/wuzhu/order/checkHavePendingConfirmationOrder', {
        channelNo: that.$store.state.channelNo
      })
      .then(res => {
        console.log(res)
        if (res && res.data && res.data.applySerialNo) {
          that.$vux.confirm.show({
            content: '发现您有未完成的订单，是否继续操作',
            onConfirm() {
              that.$store.commit('updateApplySerialNo', { applySerialNo: res.data.applySerialNo });
              that.$router.push({name: 'LivenessVerify'})
            },
            onCancel() {
              that.delOrder()
            }
          })
        }
      })
    },
    // 删除未审核完成定单
    delOrder() {
      let that = this;
      that.$http.post('/wuzhu/order/deletePendingConfirmationOrder', {
        channelNo: that.$store.state.channelNo
      }).then(res => {
          console.log(res)
        })
    },
    // 从sessionStorage中获取categoryCode，跳转到指定的商品详情页面 (该需求关联多个文件，关键字url_goto_goodsdetail)
    gotoGoodsDetail() {
      let _categoryCode = null;
      let _from = null;
      if (sessionStorage) {
        let lastCategoryCode = sessionStorage.getItem('lastCategoryCode')
        _categoryCode = sessionStorage.getItem('_categoryCode')
        console.log('gotoGoodsDetail lastCategoryCode = ' + lastCategoryCode)
        console.log('gotoGoodsDetail _categoryCode = ' + _categoryCode)
        // 防止跳转到其他页面（如小白等）再返回又会跳转到详情
        if (_categoryCode && lastCategoryCode === _categoryCode) {
          console.log('当前URL中_categoryCode与上一次跳转过的商品编码相同，不再跳转')
          return false;
        }
        _from = sessionStorage.getItem('_from')
      }
      console.log('gotoGoodsDetail _categoryCode = ' + _categoryCode + ', _from = ' + _from)
      if (_categoryCode) {
        console.log('gotoGoodsDetail start.');
        this.$store.commit('categoryCodeMemory', { categoryCode: _categoryCode });
        this.$router.push({ name: 'GoodsDetailPage' });
        return true;
      }
    }
  },
  components: {
    MainPage,
    XButton,
    Swiper,
    Loading,
    SwiperItem,
    Flexbox,
    FlexboxItem,
    Divider,
    Grid,
    GridItem,
    Scroller,
    Tab,
    TabItem
  }
};
</script>

<style lang="less" rel="stylesheet/less">
@import './../../common/less/index';
.HomePage {
  font-family: 'PingFang SC';
  padding-bottom: 60px;
  background: white;
  .GoodsCategoryPlane {
    margin-top: 15px;
    margin-bottom: 15px;
    // box-shadow: 0 5px 5px 0 rgba(0,0,0,0.03);
    .GoodsCategoryPlaneItem {
      text-align: center;
      border-radius: 4px;
      background-clip: padding-box;
      .GoodsCategoryPlaneItem-img {
        height: 48px;
        width: 48px;
      }
      .GoodsCategoryPlaneItem-name {
        color: #222222;
        font-size: 13px;
        margin-bottom: 2px;
        margin-top: 16px;
      }
    }
  }
  .GoodsPadding-line {
    background: #f4f4f4;
    width: 100%;
    height: 7px;
  }
  .GoodsPadding-line2 {
    background: #f4f4f4;
    width: 100%;
    height: 10px;
  }
  .popular-goods {
    // margin-top: 18px;
    padding-left: 15px;
    padding-right: 15px;
    .goods-header {
      color: #000000;
      padding-left: 7.5px;
      font-size: 20px;
    }
    .goods-list {
      width: 100%;
      .clearfix();
      .goods-item {
        width: 33.3333%;
        float: left;
        text-align: center;
        margin-top: 5px;
        .item-img {
          width: 100%;
          height: 100%;
          max-width: 100px;
          max-height: 100px;
        }
        .item-desc {
          display: block;
          margin: auto;
          text-align: left;
          width: 105px;
          height: 38px;
          opacity: 0.8;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .item-price {
          display: block;
          margin: auto;
          font-size: 13px;
          color: #000000;
          letter-spacing: 0;
          width: 105px;
          height: 30px;
          line-height: 30px;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      }
    }
  }
  .GoodsSection {
    padding-left: 15px;
    padding-right: 15px;
    .GoodsSection-ban-img {
      width: 100%;
      // height: 150px;
    }
  }
  .fs-loading {
    text-align: center;
    margin-top: 30px;
    padding-bottom: 30px;
    span {
      font-size: 12px;
      color: #000000;
    }
  }
  // 新的样式   GoodsCategory
  .content-wrapper {
    .list-items {
      display: inline-block;
      box-sizing: border-box;
      width: 50%;
      padding: 10px;
      text-align: center;
      img {
        width: 95%;
      }
      .items-title {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        font-weight: 200;
      }
      .items-price {
        display: block;
        font-size: 15px;
        font-weight: 700;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100%;
      }
      .bg-orange {
        display: inline-block;
        padding: 0 5px;
        line-height: 16px;
        font-size: 12px;
        background: @orange;
      }
    }
  }
}
.HomePage {
  .rent_progress {
    width: 100%;
  }
  .vux-swiper {
    .fs-swiper-img {
      img {
        width: 100%;
      }
    }
  }

  .vux-slider > .vux-indicator > a > .vux-icon-dot,
  .vux-slider .vux-indicator-right > a > .vux-icon-dot {
    width: 5px !important;
    height: 5px !important;
    border-radius: 1.5px !important;
    background: #262628 !important;
    opacity: 0.4 !important;
  }
  .vux-slider > .vux-indicator > a > .vux-icon-dot.active,
  .vux-slider .vux-indicator-right > a > .vux-icon-dot.active {
    width: 17px !important;
    height: 5px !important;
    border-radius: 1.5px !important;
    background: #262628 !important;
    opacity: 1 !important;
  }

  .vux-tab-warp {
    padding-top: 0;
    box-shadow: none !important;
  }
  .vux-tab-container {
    height: 76px;
    position: relative;
  }
  .scrollable,
  .vux-tab {
    height: 76px;
  }
  .scrollable .vux-tab-item,
  .vux-tab .vux-tab-item {
    line-height: 0;
    background: #fff;
  }
  .vux-tab-ink-bar {
    display: none !important;
  }
}
</style>
