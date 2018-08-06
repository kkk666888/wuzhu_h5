<template>
	<div class="GoodsCategory" style="height: 100%;">
    <div v-transfer-dom>
      <header class="category-header">
        <tab active-color='#FFDA29'
             custom-bar-width="40px"
             v-model="typeIndex">
          <tab-item class="vux-center"
                    :selected="defaultItem === item.val"
                    v-for="item in tabList"
                    @on-item-click="onTypesClick(item.no)"
                    :key="item.no">{{item.val}}
          </tab-item>
        </tab>
        <div class="sel-wrapper">
          <div class="sel-item" @click="toggleBrand" >
          <span
            v-if="sortObj.brand.brandNum > 1"
            :class="[sortObj.brand.isSelected ? 'f-w-bold' : 'f-w-d' ]">
            {{sortObj.brand.brandText}}...</span>
            <span v-else
                  :class="[sortObj.brand.isSelected ? 'f-w-bold' : 'f-w-d' ]">
            {{sortObj.brand.brandText}}</span>
            <span class="r-icon dropdown-on"
                  v-if="sortObj.brand.brandNum == 1 && sortObj.brand.isSelected"></span>
            <span class="r-icon dropdown-num"
                  v-else-if="sortObj.brand.brandNum > 1">
            <span class="top2">{{sortObj.brand.brandNum}}</span>
          </span>
            <span class="r-icon dropdown" v-else></span>
          </div>
          <div class="sel-item" @click="toggleSort">
            <span :class="[sortObj.sort.isSelected ? 'f-w-bold' : 'f-w-d' ]">推荐排序</span>
            <span class="r-icon" :class="[sortObj.sort.isSelected ? 'dropdown-on' : 'dropdown' ]"></span>
          </div>
          <div class="sel-item" @click="toggleFilter">
            <span :class="[sortObj.filter.isSelected ? 'f-w-bold' : 'f-w-d' ]">筛选</span>
            <span class="r-icon" :class="[sortObj.filter.isSelected ? 'screen-on' : 'screen' ]"></span>
          </div>
        </div>
      </header>
      <popup style="margin-top: 84px;" v-model="showMask"
             position="top"

             @on-hide="maskHide"
             max-height="50%">
        <div>
          <!-- 品牌选择 -->
          <section class="brand-list-wrapper" v-show="showBrandList">
            <div class="box-checker">
              <checker
                type="checkbox"
                v-model="sortObj.brand.curBrandCheckItems"
                disabled-item-class="item-disabled"
                selected-item-class="item-selected">
                <checker-item :value="item.value"
                              v-for="(item, index) in sortObj.brand.brandList"
                              @on-item-click="clickBrandItem(item)"
                              :key="index">
                  <span></span>{{item.name}}
                </checker-item>
              </checker>
              <span>{{sortObj.brand.brandCheckItems}}</span>
              <div class="box-bottom-btn-wrapper">
                <div class="left-btn" @click="resetBrand">重置</div>
                <div class="right-btn" @click="confirmBrand">完成</div>
              </div>
            </div>
          </section>
          <section class="price-sort-list-wrapper" v-show="showPriceSort">
            <div class="box-checker">
              <ul >
                <li v-for="(item, index) in sortObj.sort.sortList"
                    :key="index"
                    @click="changePriceSort(item.value)"
                    class="priceSort"
                >
                  <div :class="{priceSortActive: sortObj.sort.sortCheckItems == item.value}">
                    {{item.name}}
                  </div>
                </li>
              </ul>
            </div>
          </section>
          <section class="isnew-list-wrapper" v-show="showIsNew">
            <div class="box-checker">
              <checker
                type="radio"
                radio-required
                v-model="sortObj.filter.curFilterItems"
                disabled-item-class="item-disabled"
                selected-item-class="item-selected">
                <checker-item :value="item"
                              v-for="(item, index) in sortObj.filter.filterList"
                              @on-item-click="clickFilterItem"
                              :key="index">
                  <span></span>{{item.name}}
                </checker-item>
              </checker>
              <div class="box-bottom-btn-wrapper">
                <div class="left-btn" @click="resetFilter">重置</div>
                <div class="right-btn" @click="confirmFilter">完成</div>
              </div>
            </div>
          </section>
        </div>
      </popup>
    </div>
    <div class="scroll-wrapper" style="height: 100%; box-sizing: border-box;">
      <div v-show="showNoData" style="margin: 140px 0; text-align: center">
        <img width="60" height="60" alt="" srcset="./search.png 1x, ./search@2x.png 2x">
        <p style="color: #BBB;margin-top:20px;font-size:14px;">咦？一件商品都没有找到</p>
      </div>
      <div v-show="contentData.length && !showNoData" class="content-wrapper" ref="listwrapper" style="height: 100%;overflow: hidden;">
        <scroll ref="scroll"
                :data="contentData"
                :scrollbar="scrollbarObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(startY)"
                @click="goodsClick"
                @pullingUp="getMore">
        </scroll>
        <div v-show="!contentData" class="no-info" style="text-align: center; margin-top: 40px;">暂无数据～</div>
      </div>
    </div>
	</div>
</template>
<script>
	import { Tab, TabItem, Checker, CheckerItem, Popup, TransferDom } from 'vux'
  import Scroll from '../Scroll/Scroll'
  import {deepCopy} from '../../util/utils'
//  import jsonData from './test.js'
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
      Popup
	  },
    data() {
      let item = this.enum.getDepreciationByKey(parseInt(this.$store.state.goodsCheckNo.key || 0))
      return {
        showMask: false, // 显示mask
        showPriceSort: false,
        showBrandList: false,
        showIsNew: false,
        getDataFlag: false, // 设置开关，防止频繁获取数据
        curCheck: item, // 当前选项
        checkItems: this.enum.depreciation,
        typeIndex: 0, // 分类 tab选中项 0 手机， 1 电脑
        defaultItem: '', // 分类 tab
        tabList: [{}, {}], // 分类 tab 不给两个默认对象会导致IOS上显示不全
        contentData: [],
        showNoData: false,
        showLoading: true,
        curTypeNo: this.$store.state.typeNo, // 当前typeNo // 001手机，002电脑, 用于传给后台
        curPage: 1, // 当前页
        maxNum: 10, // 每页加载条数
        noMoreDataFlag: false,
        startY: 0,
        pullUpLoad: true,
        pullUpLoadThreshold: 500,
        pullUpLoadMoreTxt: '',
        pullUpLoadNoMoreTxt: '没有更多了',
        sortObj: {
          brand: { // 多选
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
            isSelected: false // 是否选择过
          },
          filter: { // 单选
            filterList: [], // 列表
            filterCheckItems: {value: '', name: '全部'}, // 已生效
            curFilterItems: {value: '', name: '全部'}, // 当前
            isSelected: false // 是否选择过
          }
        }
      }
    },
    created() {},
    methods: {
		  getDefaultData() {
        if (this.getDataFlag) {
          return false
        }
        let brandToString = ''
        let priceSort = ''
        // 如果有typeNo,去查询是否有缓存
        console.log(this.$store.state.typeNo)
        if (this.$store.state.typeNo) {
          this.getCurTypeSortObj(this.$store.state.typeNo)
          if (this.sortObj) {
            priceSort = this.sortObj.sort.sortCheckItems
            if (this.sortObj.brand.brandCheckItems.length > 1) {
              brandToString = this.sortObj.brand.brandCheckItems.toString()
            } else {
              brandToString = this.sortObj.brand.brandCheckItems[0]
            }
          }
        }
        this.$store.commit('updateLoadingStatus', { isLoading: true })
        this.getDataFlag = true
        let params = {
          openId: '', // 空
          channelNo: this.$store.state.channelNo,
          typeNo: this.$store.state.typeNo,
          isNew: '', // 默认
          pageNum: 1,
          maxRecordNum: this.maxNum,
          queryTypeFlag: 1,
          brand: brandToString,
          priceSort: priceSort
        }
        this.$http.get('/wuzhu/homePageController/queryCommodityListPage', params).then(res => {
          this.showLoading = false
          this.$store.commit('updateLoadingStatus', { isLoading: false })
          if (res.code === '00' && res.data) {
            let arr = []
            if (res.data.listCommodityType && res.data.listCommodityType.length > 0) {
              for (let i = 0, j = res.data.listCommodityType.length; i < j; i++) {
                let tab = {}
                tab.val = res.data.listCommodityType[i].typeName
                tab.no = res.data.listCommodityType[i].typeNo
                arr.push(tab)
              }
              this.tabList = arr
            }
            // 设置筛选条件
            if (res.data.conditions) {
              this.setSortObj(res.data.conditions)
            }
            this.$nextTick(() => {
              this.setTab()
            })
            if (res.data.listCommodityCategory && res.data.listCommodityCategory.length) {
              this.contentData = res.data.listCommodityCategory
            } else {
              this.showNoData = true
            }
          } else {
            console.log(`没有数据～`)
          }
          this.getDataFlag = false
        })
      },
      setSortObj(arr = []) {
        let that = this
        let typeNo = that.$store.state.typeNo || arr[0].typeNo
        if (!that.$store.state.typeNo) {
          that.$store.commit('typeNoMemory', {typeNo: arr[0].typeNo})
        }
        let storeObj = that.$store.state.moduleGoodsList.typeObj
        if (storeObj[typeNo] && storeObj[typeNo].brand.brandList.length) {
          console.log('已存在store,并且list有值')
        } else {
          // 生成新的模板数据
          that.sortObj = deepCopy(that.$store.state.moduleGoodsList.typeObjTpl)
          for (let i = 0; i < arr.length; i++) {
            if (typeNo === arr[i].typeNo) {
              that.sortObj.brand.brandList = [...arr[i].brand]
              that.sortObj.sort.sortList = [...arr[i].sort]
              that.sortObj.filter.filterList = [...arr[i].isNew]
              // 新模板数据存入store
              that.$store.commit('setTypeObj', {typeObj: Object.assign(that.$store.state.moduleGoodsList.typeObj, {[typeNo]: that.sortObj})})
            }
          }
        }
//        console.log(JSON.stringify(that.sortObj.brand))
      },
      getData() {
        if (this.getDataFlag) {
          return false
        }
        this.$store.commit('updateLoadingStatus', { isLoading: true })
        this.getDataFlag = true
        if (this.curPage > 1) {
        } else {
          this.noMoreDataFlag = false
          this.contentData = []
          this.pullUpLoadNoMoreTxt = ''
        }
        let brandToString = ''
        if (this.sortObj.brand.brandCheckItems.length > 1) {
          brandToString = this.sortObj.brand.brandCheckItems.toString()
        } else {
          brandToString = this.sortObj.brand.brandCheckItems[0]
        }
        let params = {
          openId: '',
          channelNo: this.$store.state.channelNo,
          typeNo: this.curTypeNo,
          isNew: this.sortObj.filter.filterCheckItems.value,
          pageNum: this.curPage,
          maxRecordNum: this.maxNum,
          brand: brandToString, // 空表示所有
          priceSort: this.sortObj.sort.sortCheckItems // 默认
        }
        this.$http.get('/wuzhu/homePageController/queryCommodityListPage', params).then(res => {
          this.showLoading = false
          this.$store.commit('updateLoadingStatus', { isLoading: false })
          if (res.code === '00' && res.data) {
            // 设置筛选条件数据
            if (res.data.conditions) {
              this.setSortObj(res.data.conditions)
            }
            if (!res.data.listCommodityCategory) {
              res.data.listCommodityCategory = []
            }
            if (res.data.listCommodityCategory.length < this.maxNum && this.curPage > 1) {
              this.noMoreDataFlag = true
            }
            if (res.data.listCommodityCategory.length) {
              if (this.curPage > 1) {
                console.log(`cur > 1`)
                this.contentData.push(...res.data.listCommodityCategory)
                console.log(this.contentData)
              } else {
                console.log(`cur < 1`)
                this.showNoData = false
                this.contentData = res.data.listCommodityCategory
              }
            } else if (this.curPage === 1) {
              console.log('没有数据～')
              this.showNoData = true
            } else {
              this.pullUpLoadNoMoreTxt = '没有更多了'
              this.$refs.scroll.forceUpdate()
            }
          } else {
            console.log(`出错了～`)
          }
          this.getDataFlag = false
        })
      },
		  onTypesClick(index) {
        this.curTypeNo = index
        this.$store.commit('typeNoMemory', {typeNo: index})
        this.getCurTypeSortObj(index)
        this.curPage = 1
        this.showNoData = false
        this.showLoading = true
        this.showMask = false // 关闭蒙层, 数据回退到生效数据
        this.getData()
      },
      clickBrandItem(item) { // 选择品牌
        console.log(item.name)
      },
      goodsClick(e) {
        console.log('进入  GoodsDetailPage页面 ===============')
        this.$store.commit('categoryCodeMemory', {categoryCode: e.categoryCode})
        this.$router.push({name: 'GoodsDetailPage'})
      },
      getMore() {
		    console.log('get more')
        let that = this
        if (that.noMoreDataFlag) {
          this.pullUpLoadNoMoreTxt = '没有更多了'
          that.$refs.scroll.forceUpdate()
        } else {
          setTimeout(function() {
            that.curPage++
            that.getData()
          }, 1500)
        }
      },
      setTab() { // 分类 tab选中项
        if (this.$store.state.typeNo) {
          let no = this.$store.state.typeNo
          for (let i = 0, l = this.tabList.length; i < l; i++) {
           if (Object.is(no, this.tabList[i].no)) {
             this.typeIndex = i
           }
          }
        }
      },
      rebuildScroll() { // 每次刷新有闪动。。
//        this.$nextTick(() => {
//          console.log('scroll.init....')
//          this.$refs.scroll.destroy()
//          this.$refs.scroll.initScroll()
//        })
      },
      // 点击排序
      changePriceSort(value) {
        this.curPage = 1
        this.showMask = false // 关闭蒙层
        this.sortObj.sort.isSelected = true
        this.sortObj.sort.sortCheckItems = value
        this.getData()
      },
      // 点击筛选
      clickFilterItem(value) {
		    console.log(value.name)
        // this.curIsNewCheckItem = value
      },
      // 重置 品牌
      resetBrand() {
        this.sortObj.brand.curBrandCheckItems = ['']
      },
      // 确认 brand
      confirmBrand() {
        this.curPage = 1
        this.showMask = false
		    this.sortObj.brand.isSelected = true // 选择过品牌
        this.sortObj.brand.brandCheckItems = this.sortObj.brand.curBrandCheckItems // 确认时,把当前状态传给已生效
        let arr = this.sortObj.brand.brandCheckItems.slice(',')

        if (arr.length >= 1) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === '') {
              console.log('选择了全部')
              this.sortObj.brand.brandCheckItems = this.sortObj.brand.curBrandCheckItems = ['']
              this.sortObj.brand.brandText = '全部品牌'
            }
          }
        } else { // 一项都没选
          console.log('一项都没选')
          this.sortObj.brand.brandCheckItems = this.sortObj.brand.curBrandCheckItems = ['']
           this.sortObj.brand.brandText = '全部品牌'
        }
        this.sortObj.brand.brandNum = this.sortObj.brand.brandCheckItems.length || 1 // 一项都没选的时候默认为1
        if (this.sortObj.brand.brandCheckItems[0]) {
          this.setBrandText(this.sortObj.brand.brandCheckItems[0])
        }
        this.getData()
      },
      setBrandText(id) {
        for (let i = 0; i < this.sortObj.brand.brandList.length; i++) {
          if (this.sortObj.brand.brandList[i].value === id) {
            this.sortObj.brand.brandText = this.sortObj.brand.brandList[i].name
          }
        }
      },
      // 重置 筛选
      resetFilter() {
        this.sortObj.filter.curFilterItems = {value: '', name: '全部'}
      },
      // 确认 筛选
      confirmFilter() {
        this.curPage = 1
        this.showMask = false
        this.sortObj.filter.isSelected = true
        this.sortObj.filter.filterCheckItems = this.sortObj.filter.curFilterItems // 确认时,把当前状态传给已生效
        this.getData()
      },
      // 隐藏所有选择层
      hideAllSelectLayer() {
        this.showPriceSort = false
        this.showBrandList = false
        this.showIsNew = false
        console.log('隐藏选择层...')
      },
      // 品牌 显示/隐藏
      toggleBrand() {
        if (this.showBrandList) {
          this.showMask = false // 会触发maskHide
        } else {
          this.setEffectiveData()
          this.showBrandList = !this.showBrandList
        }
      },
      // 排序 显示/隐藏
      toggleSort() {
        if (this.showPriceSort) {
          this.showMask = false // 会触发maskHide
        } else {
          this.setEffectiveData()
          this.showPriceSort = !this.showPriceSort
        }
      },
      // 筛选 显示/隐藏
      toggleFilter() {
        if (this.showIsNew) {
          this.showMask = false // 会触发maskHide
        } else {
          this.setEffectiveData()
          this.showIsNew = !this.showIsNew
        }
      },
      setEffectiveData() {
        console.log('setEffectiveData')
		    let typeId = this.curTypeNo
        this.hideAllSelectLayer()
        if (!this.showMask) {
          this.showMask = true
        }
        this.sortObj.brand.curBrandCheckItems = [...this.sortObj.brand.brandCheckItems] // 已生效的赋值给当前
        this.sortObj.filter.curFilterItems = this.sortObj.filter.filterCheckItems
        this.$store.state.moduleGoodsList.typeObj[typeId] = this.sortObj
      },
      maskHide() {
		    console.log('hide')
        this.hideAllSelectLayer()
      },
      // 生成缓存对象并更新data
      createNewTpl() {
        let typeId = this.curTypeNo
        let that = this
        let obj = { // 需要存储的对象
          [typeId]: deepCopy(that.$store.state.moduleGoodsList.typeObjTpl)
        }
        that.$store.commit('setTypeObj', {typeObj: Object.assign(that.$store.state.moduleGoodsList.typeObj, obj)})
        that.sortObj = that.$store.state.moduleGoodsList.typeObj[typeId]
      },
      getCurTypeSortObj(typeId) {
        // 查看是否store里面有缓存
        let that = this
        let storeObj = this.$store.state.moduleGoodsList.typeObj
        // 如果有缓存,把缓存放到当前data
        if (storeObj[typeId]) {
          that.sortObj = that.$store.state.moduleGoodsList.typeObj[typeId]
        } else {
          that.createNewTpl(typeId)
        }
      },
      // 清除store的筛选及typeNo
      clearSortStore() {
        this.$store.commit('setTypeObj', {typeObj: {}})
        this.$store.commit('typeNoMemory', {typeNo: ''})
      }
    },
    watch: {
      scrollbarObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      },
      pullUpLoadObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      }
    },
    computed: {
      scrollbarObj: function() {
        return this.scrollbar ? {fade: this.scrollbarFade} : false
      },
      pullUpLoadObj: function() {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getDefaultData()
      })
    }
	}
</script>
<style lang="less" rel="stylesheet/less">
  @import '../../common/less/index.less';
  .GoodsCategory{
    .scroll-wrapper{
      padding-top: 90px;
    }
  }
  .f-w-bold{
    font-weight: bold;
  }
  .f-w-d{
    font-weight: normal;
  }
  .sel-wrapper{
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
  .border-1px(#ddd);
  .sel-item{
    flex: 1;
    padding: 9px 0;
    text-align: center;
    font-size: 14px;
    color: #000;
    opacity: 0.65;
  }
  .r-icon{
    display: inline-block;
    vertical-align: middle;
    width: 8px;
    height: 6px;
  }
  .dropdown{
  .bg3("~./drop_down");
  }
  .dropdown-num{
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #FADB14;
    color: #000;
    font-size: 9px;
  .top2{
    position: relative;
    top: -2px;
  }
  }
  .dropdown-on{
  .bg3("~./drop_down_on");
  }
  .screen-on{
    width: 11px;
    height: 11px;
  .bg3("~./screen_on");
  }
  .screen{
    width: 11px;
    height: 11px;
  .bg3("~./screen");
  }
  }
  .category-header{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: #fff;
  .vux-center{
    font-size: 16px;
  }
  .header-top{
    background-color: rgba(0, 0, 0, 0.5);
  }
  }
  .box-checker{
    font-size: 12px;
    padding: 0 10px;
  .border-1px();
  }
  .vux-checker-box{
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
  .vux-checker-item{
    flex: 0 1 30%;
    height: 44px;
    margin-right: 4.5%;
    margin-bottom: 4.5%;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 4px;
    font-size: 12px;
    line-height: 44px;
    color: rgba(34,34,34,.85);
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
    border: 1px solid #FADB14;
    background: #FEFBEA;
    position: relative;
  &:after{
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
  .vux-popup-dialog{
    background: #fff !important;
  }
  .priceSort{
    padding: 14px 0 12px 0;
    margin-left: 15px;
    font-size: 16px;
    line-height: 22px;
    color: #222;
  .border-1px(#ddd);
  }
  .priceSortActive{
    position: relative;
    font-weight: 500;
  &:after{
     position: absolute;
     right: 15px;
     display: inline-block;
     content: '';
     width: 18px;
     height: 18px;
   .bg3("~./Choice_Select");
   }
  }
  .box-checker{
    position: relative;
  .box-bottom-btn-wrapper{
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
  .left-btn{
    width: 139px;
    flex: 0 0 139px;
  .border-1px-top(#ddd);
  }
  .right-btn{
    flex: 1;
    background-color: #FADB14;
  .border-1px-top(#ddd);
  }
  }
  }



</style>
