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
import { RegainOpenid, isWeiXin, piwikTrackEvent, isAlipayLife, isWzapp } from './../../util/utils';
import { mapMutations } from 'vuex';

export default {
  name: 'HomePage',
  data() {
    return {
      canGotoOrderSubmit: false, // 有未完成订单可以进入提交订单页面
      isAlipayLife: isAlipayLife(),
      isWzapp: isWzapp(),
      wxReady: false,
      range: 60, // 距下边界高度
      scrollFlag: true, // 控制下滑滚动特效
      banner_index: 1,
      banner_list: [],
      goodsCategory: [], // 手机分类 toggle
      phoneList: [], // 二维数组
      popularList: [],
      tabFlex: {},
      activityItem: [], // 活动图片
      switchConfig: {}, // 开关配置
      rentProcessImg: '', // 租赁流程
      bussniessEntrance: [], // 业务入口
      brandBannars: [], // 品牌
      activityData: [], // 活动商品
      brandAdvertising: '' // slogan
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
    // app window
    document.getElementById('app').addEventListener('scroll', this.handleScroll);
    // 获取到申请码后更新到store
    let recommCode = localStorage.getItem('recommCode');
    console.log('recommCode = ' + recommCode);
    if (recommCode) {
      that.$store.commit('updateRecommeCode', { recommeCode: recommCode });
      console.log('store recommCode = ' + that.$store.state.recommeCode);
    }
    that.queryHomeInfomation(function(res) {
      that.alertOpenIDerr();
      if (that.gotoGoodsDetail()) {
        return;
      }
      that.checkOrder(); // 查看是否有“待确定-未审批”定单
    });
  },
  // 路由部分的处理，离开页面和进入页面的处理
  beforeRouteLeave(to, from, next) {
    if ((to.name === 'OrderSubmitPage' || to.name === 'OrderSubmitPageNew') && !this.canGotoOrderSubmit) {
      console.log('do nothing.');
    } else {
      next();
    }
  },
  destroyed() {
    // 销毁
    let _bodyClassName = document.getElementsByTagName('body')[0].className;
    document.getElementsByTagName('body')[0].className = String(_bodyClassName).replace('YSF-BTN-HOLDER-HIDE', '');
    document.getElementById('app').removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    ...mapMutations(['updateLoadingStatus']),
    checkFromWXSign() {
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
      if (sessionStorage && isWeiXin()) {
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
      this.updateLoadingStatus({ isLoading: true });
      let that = this;
      let params = {
        openId: that.$store.state.othersOpenID,
        channelNo: that.$store.state.channelNo
      };
      that.$http
        .get('/wuzhu/homePageController/queryHomeInfomation', params)
        // .get('/src/components/Home/副本/HomePageData.json', params)
        .then(res => {
          this.updateLoadingStatus({ isLoading: false });
          if (res.code === '00' && res.data) {
            this.handleHomeData(res);
          } else {
            that.$vux.alert.show({
              content: res.msg
            });
          }
          callback(res.code);
        })
        .catch(err => {
          console.log(err);
          callback(err);
        });
    },
    handleHomeData(res) {
      // 手机 电脑 切换
      this.goodsCategory = res.data.typeData;
      if (this.goodsCategory.length > 4) {
        this.$set(this.tabFlex, 'flex', '0 0 20%');
      }
      if (res.data.pageData) {
        // 获取手机列表信息 -- 此处需优化 图片懒加载
        res.data.pageData.map((item, index, array) => {
          if (res.data.pageData[index].pageModuleNo !== '1') {
            this.phoneList.push(res.data.pageData[index]);
          }
        });
      }

      // banner
      this.banner_list = res.data.rollBannars;
      this.activityItem = res.data.commonBannars;
      let resData = res.data;
      this.switchConfig = { ...resData.homeSwitchConfig }; //
      this.rentProcessImg = resData.rentFlowUrl;
      this.bussniessEntrance = resData.businessEntryBanners;
      this.brandBannars = resData.brandBannars;
      this.activityData = resData.activities;
      this.brandAdvertising = resData.brandAdvertising;
    },
    // 活动跳转
    activityClick(type, url) {
      switch (type) {
        // 直接跳转
        case 1:
          window.location.href = url;
          break;
        //  带参数
        case 2:
          break;
        default:
          break;
      }
    },
    bannerClickIndex(index, item) {
      this.banner_index = index;
      this.goodsSectionClick(item, 'bannerClick');
    },
    goGoodsCategory(index) {
      let _goodsCategory = this.goodsCategory[index] || {};
      this.$store.commit('CATEGORY_STATE', { categoryState: _goodsCategory.typeName });
      this.$store.commit('typeNoMemory', { typeNo: _goodsCategory.typeNo });
      let time = Date.now();
      this.$router.push({ name: 'GoodsCategory', params: { time: time } });
    },
    goodsClick(code, action) {
      piwikTrackEvent(action, 'goodsDetail', code);
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
    goodsSectionClick(item, action) {
      if (item.categoryCode) {
        this.goodsClick(item.categoryCode, action);
      } else if (item.typeNo) {
        piwikTrackEvent(action, 'goodsType', item.typeNo);
        let obj = this.enum.getDepreciationByKey(item.depreciationRatio || 0);
        this.$store.commit('typeNoMemory', { typeNo: item.typeNo });
        this.$store.commit('goodsCheckNoMemory', { goodsCheckNo: obj });
        let time = Date.now();
        this.$router.push({ name: 'GoodsCategory', params: { time: time } });
      } else if (item.imgLinkUrl) {
        piwikTrackEvent(action, 'url', item.imgLinkUrl);
        location.href = item.imgLinkUrl + '?_r=' + Math.random();
      }
    },
    // 检查是否有未审核完成订单
    checkOrder() {
      let that = this;
      that.$http
        .get('/wuzhu/order/checkHavePendingConfirmationOrder', {
          channelNo: that.$store.state.channelNo
        })
        .then(res => {
          if (res && res.data && res.data.applySerialNo) {
            that.$vux.confirm.show({
              content: '发现您有未完成的订单，是否继续操作',
              onConfirm() {
                that.$store.commit('updateApplySerialNo', { applySerialNo: res.data.applySerialNo });
                that.canGotoOrderSubmit = true;
                // that.$router.push({name: 'OrderSubmitPageNew'})
                // 2018-12-8 迭代2.12.0 新流程，未完成订单跳转到提交订单页面
                if (that.isAlipayLife) {
                  that.$router.push({ name: 'OrderSubmitPageNew' });
                } else {
                  that.$router.push({ name: 'OrderSubmitPageNew' });
                }
              },
              onCancel() {
                that.delOrder();
              }
            });
          }
        });
    },
    // 删除未审核完成定单
    delOrder() {
      let that = this;
      that.$http
        .get('/wuzhu/order/deletePendingConfirmationOrder', {
          channelNo: that.$store.state.channelNo
        })
        .then(res => {
          console.log(res);
        });
    },
    // 从sessionStorage中获取categoryCode，跳转到指定的商品详情页面 (该需求关联多个文件，关键字url_goto_goodsdetail)
    gotoGoodsDetail() {
      let _categoryCode = null;
      let _from = null;
      if (sessionStorage) {
        let lastCategoryCode = sessionStorage.getItem('lastCategoryCode');
        _categoryCode = sessionStorage.getItem('_categoryCode');
        console.log('gotoGoodsDetail lastCategoryCode = ' + lastCategoryCode);
        console.log('gotoGoodsDetail _categoryCode = ' + _categoryCode);
        // 防止跳转到其他页面（如小白等）再返回又会跳转到详情
        if (_categoryCode && lastCategoryCode === _categoryCode) {
          return false;
        }
        _from = sessionStorage.getItem('_from');
      }
      console.log('gotoGoodsDetail _categoryCode = ' + _categoryCode + ', _from = ' + _from);
      if (_categoryCode) {
        this.$store.commit('categoryCodeMemory', { categoryCode: _categoryCode });
        // 如果是从app跳转到详情，则使用replace
        if (this.isWzapp) {
          this.$router.replace({ name: 'GoodsDetailPage' });
        } else {
          this.$router.push({ name: 'GoodsDetailPage' });
        }
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
