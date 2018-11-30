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
import { RegainOpenid, isWeiXin, piwikTrackEvent } from './../../util/utils';
export default {
  name: 'HomePage',
  data() {
    return {
      wxReady: false,
      range: 60, // 距下边界高度
      scrollFlag: true, // 控制下滑滚动特效
      banner_index: 1,
      banner_list: [],
      rent_progress: './img/liucheng.png',
      goodsCategory: [], // 手机分类 toggle
      phoneList: [], // 二维数组
      popularList: [],
      tabFlex: {},
      activityItem: {} // 活动图片
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
    that.checkOrder(); // 查看是否有“待确定-未审批”定单
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
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      let that = this;
      that.$http
        .get('/wuzhu/homePageController/queryHomeInfomation', {
          // that.$http.get('/src/components/Home/副本/HomePageData.json', {
          openId: that.$store.state.othersOpenID,
          channelNo: that.$store.state.channelNo
        })
        .then(res => {
          that.$store.commit('updateLoadingStatus', { isLoading: false });
          if (res.code === '00' && res.data) {
            // banner
            that.banner_list = res.data.bannerData || [];
            for (var i in that.banner_list) {
              if (that.banner_list[i].type === '2') {
                that.activityItem = that.banner_list[i];
                break;
              }
            }
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
          // that.$store.commit('updateLoadingStatus', { isLoading: false });
          console.log(err);
        });
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
    // 检查是否有未审核完成定单
    checkOrder() {
      let that = this;
      that.$http
        .post('/wuzhu/order/checkHavePendingConfirmationOrder', {
          channelNo: that.$store.state.channelNo
        })
        .then(res => {
          if (res && res.data && res.data.applySerialNo) {
            that.$vux.confirm.show({
              content: '发现您有未完成的订单，是否继续操作',
              onConfirm() {
                that.$store.commit('updateApplySerialNo', { applySerialNo: res.data.applySerialNo });
                that.$router.push({ name: 'LivenessVerify' });
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
        .post('/wuzhu/order/deletePendingConfirmationOrder', {
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
