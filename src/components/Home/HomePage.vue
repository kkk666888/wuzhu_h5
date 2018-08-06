<template>
  <div class="HomePage" id="HomePage">
    <!-- 轮播图 -->
    <div>
      <swiper :aspect-ratio="400/750" loop auto :index="banner_index" dots-position="center">
        <swiper-item class="fs-swiper-img" 
        v-if="item.type != '2'"
        v-for="(item, index) in banner_list" 
        :key="index" @click.native="bannerClickIndex(index, item)">
          <img v-lazy="item.imgUrl">
        </swiper-item>
      </swiper>
    </div>
    <!-- 购买流程 -->
    <div class="rent_progress vux-1px-b">
      <img src="./img/liucheng.png">
    </div>
    <!-- 活动图片 -->
    <div v-if="activityItem && activityItem.type === '2'" class="activity-div"
      @click="goodsSectionClick(activityItem)">
      <img :src="activityItem.imgUrl" />
    </div>
    <!-- 分类 -->
    <div>
       <tab class="GoodsCategoryPlane" :scroll-threshold="5" bar-active-color="#fff" >
        <tab-item @click.native="goGoodsCategory(index)" :style="tabFlex" v-for="(item, index) in goodsCategory" :key="index">
          <div class="GoodsCategoryPlaneItem">
            <img v-lazy="item.typeImg" class="GoodsCategoryPlaneItem-img"/>
            <div class="GoodsCategoryPlaneItem-name">{{ item.typeName }}</div>
          </div>
        </tab-item>
      </tab>
    </div>
    <!-- 热租爆款 -->
    <div v-if="popularList && popularList.length > 0" class="hot-div">
      <div class="header">热租爆款</div>
      <div class="item-row" 
        v-for="item in popularList" :key="item.categoryCode" 
        @click="goodsClick(item.categoryCode)">
        <div class="item-col">
          <img class="product-img" v-lazy="item.listImg"/>
        </div>
        <div class="item-col">
          <div class="product-div">
            <div class="product-name">{{item.shortName}}</div>
            <div class="product-second-name">{{item.fullName}}</div>
            <div class="product-price">￥{{item.leastRentDay}}<span class="product-mark">/元起</span></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐商品 -->
    <div class="recommend-div" v-for="item0 in phoneList" :key="item0.configSerialNo">
        <div class="header">
          {{item0.title}}&nbsp;
          <span v-if="item0.typeNo" class="more" @click="goodsSectionClick(item0)">
            更多<img class="right" src="./img/right.png"/>
          </span>
        </div>
        <div class="item-row">
          <div class="item-col" 
            v-for="item in item0.listCommodityCategory"
            :key="item.categoryCode" @click="goodsClick(item.categoryCode)">
            <div class="product-img"><img v-lazy="item.listImg"/></div>
            <div class="product-info">
              <div class="product-name content-ellipsis">{{item.shortName}}</div>
              <div class="product-second-name content-ellipsis">{{item.fullName}}</div>
              <div class="product-price">￥{{item.leastRentDay}}<span class="product-mark">/元起</span></div>
            </div>
          </div>
        </div>
    </div>
    <section>
      <main-page></main-page>
    </section>
  </div>
</template>

<script>
import vueJs from './HomePage.js'
export default vueJs
</script>

<style lang="less" scoped>
    @import './../../common/less/index';
    @import './HomePage.less';
</style>
