<template>
  <div class="GoodsCategory" style="height: 100%;">
    <!-- header -->
    <div v-transfer-dom>
      <header class="category-header" >
        <tab active-color='#FFDA29' custom-bar-width="40px" v-model="typeIndex">
          <tab-item class="vux-center" :selected="defaultItem === item.no" v-for="item in newTabList" @on-item-click="onTypesClick(item.no)" :key="item.no">{{item.val}}
          </tab-item>
        </tab>
      </header>
    </div>
    <!-- contentList -->
    <div class="scroll-wrapper" :class="'new-category'" style="height: 100%; box-sizing: border-box;">
      <div v-show="showNoData" style="margin: 140px 0; text-align: center">
        <img width="60" height="60" alt="" srcset="./search.png 1x, ./search@2x.png 2x">
        <p style="color: #BBB;margin-top:20px;font-size:14px;">咦？一件商品都没有找到</p>
      </div>
      <div v-show="contentData.length && !showNoData" class="content-wrapper" ref="listwrapper" style="height: 100%;overflow: hidden;">
        <scroll ref="scroll" :data="contentData" :scrollbar="scrollbarObj" :pullUpLoad="pullUpLoadObj" :startY="parseInt(startY)" @click="goodsClick" @pullingUp="getMore">
        </scroll>
        <div v-show="!contentData" class="no-info" style="text-align: center; margin-top: 40px;">暂无数据～</div>
      </div>
    </div>
    <section>
      <main-page></main-page>
    </section>
  </div>
</template>
<script>
import { Tab, TabItem, Checker, CheckerItem, Popup, TransferDom } from 'vux';
import Scroll from '../Scroll/Scroll';
import MainPage from './../Main/MainPage';
import { deepCopy, piwikTrackEvent } from '../../util/utils';
export default {
  directives: {
    TransferDom
  },
  name: 'GoodsCategory',
  components: {
    Tab,
    TabItem,
    Checker,
    CheckerItem,
    Scroll,
    Popup,
    MainPage
  },
  data() {
    let item = this.enum.getDepreciationByKey(parseInt(this.$store.state.goodsCheckNo.key || 0));
    return {
      showMask: false, // 显示mask
      showPriceSort: false,
      showBrandList: false,
      showIsNew: false,
      getDataFlag: false, // 设置开关，防止频繁获取数据
      curCheck: item, // 当前选项
      checkItems: this.enum.depreciation,
      typeIndex: 0, // 分类 tab选中项 0 手机， 1 电脑
      defaultItem: '', // 默认选中项
      newTabList: [], // 2.12改版
      contentData: [],
      showNoData: false,
      showLoading: true,
      curTypeNo: this.$store.state.typeNo, // 当前typeNo
      curPage: 1, // 当前页
      maxNum: 10, // 每页加载条数
      noMoreDataFlag: false,
      startY: 0,
      pullUpLoad: true,
      pullUpLoadThreshold: 500,
      pullUpLoadMoreTxt: '',
      pullUpLoadNoMoreTxt: '没有更多了',
      sortObj: {
        brand: {
          // 多选
          brandList: [], // 品牌列表
          brandCheckItems: [''], // 已生效
          curBrandCheckItems: [''], // 当前
          brandText: '全部品牌', // 品牌显示文字
          brandNum: 1,
          isSelected: false // 是否选择过
        },
        sort: {
          sortList: [], // 列表
          sortCheckItems: '', // 已生效
          cursSortCheckItems: '', // 当前
          sortText: '推荐排序',
          isSelected: false // 是否选择过
        },
        filter: {
          // 单选
          filterList: [], // 列表
          filterCheckItems: { value: '', name: '全部' }, // 已生效
          curFilterItems: { value: '', name: '全部' }, // 当前
          filterText: '筛选',
          isSelected: false // 是否选择过
        }
      }
    };
  },
  created() {
  },
  mounted() {
    this.getNewData();
  },
  // activated() {
  //   // console.log(this.$route);
  //   console.log('activated')
  //   if (this.$route.params.time) {
  //     this.getDefaultData();
  //   }
  // },
  methods: {
    getNewData() {
      if (this.getDataFlag) {
        return false;
      }
      let brandToString = '';
      let priceSort = '';
      // 如果有typeNo,去查询是否有缓存
      console.log('typeNo', this.$store.state.typeNo);
      if (this.$store.state.typeNo) {
        this.getCurTypeSortObj(this.$store.state.typeNo);
        if (this.sortObj) {
          priceSort = this.sortObj.sort.sortCheckItems;
          if (this.sortObj.brand.brandCheckItems.length > 1) {
            brandToString = this.sortObj.brand.brandCheckItems.toString();
          } else {
            brandToString = this.sortObj.brand.brandCheckItems[0];
          }
        }
      }
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      this.getDataFlag = true;

      let params = {
        channelNo: this.$store.state.channelNo,
        isNew: '', // 默认
        pageNum: 1,
        maxRecordNum: this.maxNum,
        queryTypeFlag: 1,
        brand: brandToString,
        priceSort: priceSort
      };
      if (this.$store.state.typeNo && this.$store.state.typeNo !== '99999') {
        params['typeNo'] = this.$store.state.typeNo;
      }
      this.$http.get('/wuzhu/homePageController/queryCommodityListPage', params).then(res => {
        this.showLoading = false;
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        if (res.code === '00' && res.data) {
          this.handleData(res)
        } else {
          console.log(`没有数据～`);
        }
        this.getDataFlag = false;
      });
    },
    handleData(res) {
      let arr = [{no: '99999', val: '全部'}]; // 新增全部类型
      if (res.data.listCommodityType && res.data.listCommodityType.length > 0) {
        for (let i = 0, j = res.data.listCommodityType.length; i < j; i++) {
          let tab = {};
          tab.val = res.data.listCommodityType[i].typeName;
          tab.no = res.data.listCommodityType[i].typeNo;
          arr.push(tab);
        }
        this.newTabList = arr;
      }
      // 设置筛选条件
      if (res.data.conditions) {
        this.setSortObj(res.data.conditions);
      }
      this.$nextTick(() => {
        this.setTab();
        setTimeout(() => {
          let no = this.$store.state.typeNo;
          this.typeIndex = this.newTabList.findIndex(y => Object.is(no, y.no));
          this.defaultItem = no;
        }, 100);
      });
      if (res.data.listCommodityCategory && res.data.listCommodityCategory.length) {
        this.contentData = res.data.listCommodityCategory;
      } else {
        this.showNoData = true;
      }
    },
    // 设置当前SortObj的数据
    setSortObj(arr = []) {
      let that = this;
      let typeNo = that.$store.state.typeNo || arr[0].typeNo;
      if (!that.$store.state.typeNo) {
        that.$store.commit('typeNoMemory', { typeNo: arr[0].typeNo });
      }
      let storeObj = that.$store.state.moduleGoodsList.typeObj;
      if (storeObj[typeNo] && storeObj[typeNo].brand.brandList.length) {
        console.log('已存在store,并且list有值');
      } else {
        // 生成新的模板数据
        that.sortObj = deepCopy(that.$store.state.moduleGoodsList.typeObjTpl);
        for (let i = 0; i < arr.length; i++) {
          if (typeNo === arr[i].typeNo) {
            that.sortObj.brand.brandList = [...arr[i].brand];
            that.sortObj.sort.sortList = [...arr[i].sort];
            that.sortObj.filter.filterList = [...arr[i].isNew];
            // 新模板数据存入store
            that.$store.commit('setTypeObj', {
              typeObj: Object.assign(that.$store.state.moduleGoodsList.typeObj, { [typeNo]: that.sortObj })
            });
          }
        }
      }
    },
    getData(hideLoading) {
      if (this.getDataFlag) {
        return false;
      }
      if (!hideLoading) {
        this.$store.commit('updateLoadingStatus', { isLoading: true });
      }
      this.getDataFlag = true;
      if (this.curPage > 1) {
      } else {
        this.noMoreDataFlag = false;
        this.contentData = [];
        this.pullUpLoadNoMoreTxt = '';
      }
      let brandToString = '';
      if (this.sortObj.brand.brandCheckItems.length > 1) {
        brandToString = this.sortObj.brand.brandCheckItems.toString();
      } else {
        brandToString = this.sortObj.brand.brandCheckItems[0];
      }
      let params = {
        openId: '',
        channelNo: this.$store.state.channelNo,
        // typeNo: this.curTypeNo,
        isNew: this.sortObj.filter.filterCheckItems.value,
        pageNum: this.curPage,
        maxRecordNum: this.maxNum,
        queryTypeFlag: 1,
        brand: brandToString, // 空表示所有
        priceSort: this.sortObj.sort.sortCheckItems // 默认
      };
      if (this.$store.state.typeNo && this.$store.state.typeNo !== '99999') {
        params['typeNo'] = this.$store.state.typeNo;
      }
      this.$http.get('/wuzhu/homePageController/queryCommodityListPage', params).then(res => {
        this.showLoading = false;
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        if (res.code === '00' && res.data) {
          // 设置筛选条件数据
          if (res.data.conditions) {
            this.setSortObj(res.data.conditions);
          }
          if (!res.data.listCommodityCategory) {
            res.data.listCommodityCategory = [];
          }
          if (res.data.listCommodityCategory.length < this.maxNum && this.curPage > 1) {
            this.noMoreDataFlag = true;
          }
          if (res.data.listCommodityCategory.length) {
            if (this.curPage > 1) {
              console.log(`cur > 1`);
              this.contentData.push(...res.data.listCommodityCategory);
              console.log(this.contentData);
            } else {
              console.log(`cur < 1`);
              this.showNoData = false;
              this.contentData = res.data.listCommodityCategory;
            }
          } else if (this.curPage === 1) {
            console.log('没有数据～');
            this.showNoData = true;
          } else {
            this.pullUpLoadNoMoreTxt = '没有更多了';
            this.$refs.scroll.forceUpdate();
          }
        } else {
          console.log(`出错了～`);
        }
        this.getDataFlag = false;
      });
    },
    onTypesClick(index) {
      this.curTypeNo = index;
      this.$store.commit('typeNoMemory', { typeNo: index });

      this.curPage = 1;
      this.showNoData = false;
      this.showMask = false; // 关闭蒙层, 数据回退到生效数据
      this.showLoading = true;
      this.getData();
    },
    // clickBrandItem(item) {
    //   // 选择品牌
    //   // console.log(item.name);
    // },
    goodsClick(e) {
      console.log('进入  GoodsDetailPage页面 ===============');
      piwikTrackEvent('normalClick', 'goodsDetail', e.categoryCode);
      this.$store.commit('categoryCodeMemory', { categoryCode: e.categoryCode });
      this.$router.push({ name: 'GoodsDetailPage' });
    },
    getMore() {
      console.log('get more');
      let that = this;
      if (that.noMoreDataFlag) {
        this.pullUpLoadNoMoreTxt = '没有更多了';
        that.$refs.scroll.forceUpdate();
      } else {
        setTimeout(function() {
          that.curPage++;
          that.getData(true);
        }, 1500);
      }
    },
    // 设置选中的Tab-item
    setTab() {
      // 分类 tab选中项

        // console.log('no', no)
        // for (let i = 0, l = this.newTabList.length; i < l; i++) {
        //   if (Object.is(no, this.newTabList[i].no)) {
        //     this.typeIndex = i;
        //   }
        // }
    },
    rebuildScroll() {
      // 每次刷新有闪动。。
      //        this.$nextTick(() => {
      //          console.log('scroll.init....')
      //          this.$refs.scroll.destroy()
      //          this.$refs.scroll.initScroll()
      //        })
    },
    // 点击排序
    // changePriceSort(item) {
    //   this.curPage = 1;
    //   this.showMask = false; // 关闭蒙层
    //   this.sortObj.sort.isSelected = true;
    //   this.sortObj.sort.sortCheckItems = item.value;
    //   this.sortObj.sort.sortText = item.name;
    //   this.getData();
    // },
    // 点击筛选
    clickFilterItem(value) {
      // this.curIsNewCheckItem = value
    },
    // 重置 品牌
    // resetBrand() {
    //   this.sortObj.brand.curBrandCheckItems = [''];
    // },
    // 确认 brand
    // confirmBrand() {
    //   this.curPage = 1;
    //   this.showMask = false;
    //   this.sortObj.brand.isSelected = true; // 选择过品牌
    //   this.sortObj.brand.brandCheckItems = this.sortObj.brand.curBrandCheckItems; // 确认时,把当前状态传给已生效
    //   let arr = this.sortObj.brand.brandCheckItems.slice(',');
    //
    //   if (arr.length >= 1) {
    //     for (let i = 0; i < arr.length; i++) {
    //       if (arr[i] === '') {
    //         console.log('选择了全部');
    //         this.sortObj.brand.brandCheckItems = this.sortObj.brand.curBrandCheckItems = [''];
    //         this.sortObj.brand.brandText = '全部品牌';
    //       }
    //     }
    //   } else {
    //     // 一项都没选
    //     console.log('一项都没选');
    //     this.sortObj.brand.brandCheckItems = this.sortObj.brand.curBrandCheckItems = [''];
    //     this.sortObj.brand.brandText = '全部品牌';
    //   }
    //   this.sortObj.brand.brandNum = this.sortObj.brand.brandCheckItems.length || 1; // 一项都没选的时候默认为1
    //   if (this.sortObj.brand.brandCheckItems[0]) {
    //     this.setBrandText(this.sortObj.brand.brandCheckItems[0]);
    //   }
    //   this.getData();
    // },
    // setBrandText(id) {
    //   for (let i = 0; i < this.sortObj.brand.brandList.length; i++) {
    //     if (this.sortObj.brand.brandList[i].value === id) {
    //       this.sortObj.brand.brandText = this.sortObj.brand.brandList[i].name;
    //     }
    //   }
    // },
    // 重置 筛选
    // resetFilter() {
    //   this.sortObj.filter.curFilterItems = { value: '', name: '全部' };
    // },
    // 确认 筛选
    // confirmFilter() {
    //   this.curPage = 1;
    //   this.showMask = false;
    //   this.sortObj.filter.isSelected = true;
    //   this.sortObj.filter.filterCheckItems = this.sortObj.filter.curFilterItems; // 确认时,把当前状态传给已生效
    //   this.getData();
    // },
    // 隐藏所有选择层
    // hideAllSelectLayer() {
    //   this.showPriceSort = false;
    //   this.showBrandList = false;
    //   this.showIsNew = false;
    // },
    // 品牌 显示/隐藏
    // toggleBrand() {
    //   if (this.showBrandList) {
    //     this.showMask = false; // 会触发maskHide
    //   } else {
    //     this.setEffectiveData();
    //     this.showBrandList = !this.showBrandList;
    //   }
    // },
    // 排序 显示/隐藏
    // toggleSort() {
    //   if (this.showPriceSort) {
    //     this.showMask = false; // 会触发maskHide
    //   } else {
    //     this.setEffectiveData();
    //     this.showPriceSort = !this.showPriceSort;
    //   }
    // },
    // 筛选 显示/隐藏
    // toggleFilter() {
    //   if (this.showIsNew) {
    //     this.showMask = false; // 会触发maskHide
    //   } else {
    //     this.setEffectiveData();
    //     this.showIsNew = !this.showIsNew;
    //   }
    // },
    // setEffectiveData() {
    //   let typeId = this.curTypeNo;
    //   this.hideAllSelectLayer();
    //   if (!this.showMask) {
    //     this.showMask = true;
    //   }
    //   this.sortObj.brand.curBrandCheckItems = [...this.sortObj.brand.brandCheckItems]; // 已生效的赋值给当前
    //   this.sortObj.filter.curFilterItems = this.sortObj.filter.filterCheckItems;
    //   this.$store.state.moduleGoodsList.typeObj[typeId] = this.sortObj;
    // },
    // maskHide() {
    //   this.hideAllSelectLayer();
    // },
    // 生成缓存对象并更新data
    createNewTpl() {
      let typeId = this.curTypeNo;
      let that = this;
      let obj = {
        // 需要存储的对象
        [typeId]: deepCopy(that.$store.state.moduleGoodsList.typeObjTpl)
      };
      that.$store.commit('setTypeObj', { typeObj: Object.assign(that.$store.state.moduleGoodsList.typeObj, obj) });
      that.sortObj = that.$store.state.moduleGoodsList.typeObj[typeId];
    },
    getCurTypeSortObj(typeId) {
      // 查看是否store里面有缓存
      let that = this;
      let storeObj = this.$store.state.moduleGoodsList.typeObj;
      // 如果有缓存,把缓存放到当前data
      if (storeObj[typeId]) {
        that.sortObj = that.$store.state.moduleGoodsList.typeObj[typeId];
      } else {
        that.createNewTpl(typeId);
      }
    }
    // 清除store的筛选及typeNo
    // clearSortStore() {
    //   this.$store.commit('setTypeObj', { typeObj: {} });
    //   this.$store.commit('typeNoMemory', { typeNo: '' });
    // }
  },
  watch: {
    scrollbarObj: {
      handler() {
        // this.rebuildScroll();
      },
      deep: true
    },
    pullUpLoadObj: {
      handler() {
        // this.rebuildScroll();
      },
      deep: true
    }
  },
  computed: {
    scrollbarObj: function() {
      return this.scrollbar ? { fade: this.scrollbarFade } : false;
    },
    pullUpLoadObj: function() {
      return this.pullUpLoad
        ? {
            threshold: parseInt(this.pullUpLoadThreshold),
            txt: { more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt }
          }
        : false;
    }
  }
};
</script>
<style lang="less" rel="stylesheet/less">
@import '../../common/less/index.less';
.GoodsCategory {
  .scroll-wrapper {
    padding-top: 90px;
  }
  .new-category {
    padding-top: 50px;
    padding-bottom: 45px;
  }
}
.f-w-bold {
  font-weight: bold;
  color: #222;
}
.f-w-d {
  font-weight: normal;
}
.sel-wrapper {
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  .border-1px(#ddd);
  .sel-item {
    flex: 1;
    padding: 9px 0;
    text-align: center;
    font-size: 14px;
    color: #555;
  }
  .r-icon {
    display: inline-block;
    vertical-align: middle;
    width: 15px;
    height: 15px;
  }
  .dropdown {
    .bg3('~./drop-down');
  }
  .dropdown-num {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #fadb14;
    color: #000;
    font-size: 9px;
    .top2 {
      position: relative;
      top: -2px;
    }
  }
  .dropdown-on {
    .bg3('~./drop_down_on');
  }
  .screen-on {
    width: 15px;
    height: 15px;
    .bg3('~./screen_on');
  }
  .screen {
    width: 15px;
    height: 15px;
    .bg3('~./screen');
  }
}
.category-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  .vux-tab-container {
    height: 50px;
  }
  .vux-center {
    font-size: 16px;
  }
  .vux-tab {
    height: 50px;
  }
  .vux-tab .vux-tab-item {
    line-height: 50px;
    height: 50px;
    font-size: 14px !important;
    color: #888 !important;
    &.vux-tab-selected {
      font-size: 16px !important;
      color: #222 !important;
    }
  }
}
.vux-checker-box {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  margin-top: 4%;
  margin-left: 4%;
  margin-right: 4%;
  padding-bottom: 48px;
  min-height: 220px;
  max-height: 260px;
  overflow-y: scroll;
  font-size: 0;
}
.vux-checker-item {
  flex: 0 1 30%;
  height: 50px;
  margin-right: 4.5%;
  margin-bottom: 4.5%;
  text-align: center;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 12px;
  line-height: 50px;
  color: #222;
  background-color: rgba(0, 0, 0, 0.04);
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  &:nth-child(3n) {
    margin-right: 0;
  }
}
.item-selected {
  border: 1px solid #fadb14;
  background: #fefbea;
  position: relative;
  &:after {
    display: inline-block;
    position: absolute;
    bottom: 0;
    right: 0;
    content: '';
    width: 15px;
    height: 15px;
    .bg('~./Fill');
  }
}
.vux-popup-dialog {
  background: #fff !important;
}
.priceSort {
  padding: 14px 0 12px 0;
  margin-left: 15px;
  font-size: 16px;
  line-height: 22px;
  color: #222;
  .border-1px(#ddd);
}
.priceSortActive {
  position: relative;
  font-weight: 500;
  &:after {
    position: absolute;
    right: 15px;
    display: inline-block;
    content: '';
    width: 18px;
    height: 18px;
    .bg3('~./Choice_Select');
  }
}
.box-checker {
  position: relative;
  .box-bottom-btn-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 48px;
    background: #fff;
    display: flex;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    color: #222;
    .left-btn {
      width: 139px;
      flex: 0 0 139px;
      .border-1px-top(#ddd);
    }
    .right-btn {
      flex: 1;
      background-color: #fadb14;
      .border-1px-top(#ddd);
    }
  }
}
</style>
