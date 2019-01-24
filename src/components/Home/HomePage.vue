<template>
  <div class="HomePage" id="HomePage">
    <section class="home-content">
      <!-- 轮播图 -->
      <div v-if="switchConfig && switchConfig.rollBannerSwitch === 'Y'">
        <swiper :aspect-ratio="430/750" loop auto :index="banner_index" dots-position="center" >
          <swiper-item class="fs-swiper-img" v-for="(item, index) in banner_list" :key="index" @click.native="bannerClickIndex(index, item)">
            <img v-lazy="item.imgUrl">
          </swiper-item>
        </swiper>
      </div>
      <!-- 购买流程 -->
      <div v-if="switchConfig && switchConfig.rentFlowSwitch === 'Y' && rentProcessImg" class="rent_progress vux-1px-b">
        <img :src="rentProcessImg">
      </div>
      <!-- 分类 -->
      <div>
        <tab class="GoodsCategoryPlane" v-if="switchConfig && switchConfig.commodityTypeSwitch === 'Y'" :scroll-threshold="5" bar-active-color="#fff">
          <tab-item @click.native="goGoodsCategory(index)" :style="tabFlex" v-for="(item, index) in goodsCategory" :key="index">
            <div class="GoodsCategoryPlaneItem">
              <img v-lazy="item.typeImg" class="GoodsCategoryPlaneItem-img" />
              <div class="GoodsCategoryPlaneItem-name">{{ item.typeName }}</div>
            </div>
          </tab-item>
        </tab>
      </div>
      <!-- 活动图片 -->
      <div class="activity-div">
        <img v-for="(imgItem, index) in activityItem" v-lazy="imgItem.imgUrl" :key="index"  @click="goodsSectionClick(imgItem, 'activeClick')"/>
      </div>
      <!-- 活动商品 -->
      <div class="activity-goods bg-white mt10" v-if="activityData && activityData.length > 0" v-for="(itemA, index) in activityData" :key="itemA.id">
        <div class="header">
          {{itemA.activityTitile}}
          <span class="desc" >
            {{itemA.activityDescription}}
          </span>
        </div>
        <div class="content">
          <div class="content-wrap">
            <div class="content-item" v-for="(item, index) in itemA.activityCommoditys" :key="index">
              <img v-lazy="item.listImg" @click="goodsSectionClick(item, 'floorClick')" width="140" height="140" class="item-img" />
              <p class="item-title text-ellipsis fw-b">{{item.shortName}}</p>
              <p class="item-desc" v-for="(tagItem, index) in item.activityTagList" :key="index">{{tagItem}}</p>
              <div class="item-price">
                <div class="price-block">
                  <span class="new-price color-red" >￥<span class="fz16 fw-b">{{item.leastRentDay}}</span></span>/天
                </div>
                <div class="price-block old-price" v-if="item.leastOriginalPrice">
                  ￥{{item.leastOriginalPrice}}/天
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 业务入口 -->
      <div class="entrance bg-white mt10" v-if="bussniessEntrance[0]">
          <img class="left" v-if="bussniessEntrance[0]" v-lazy="bussniessEntrance[0].imgUrl" @click="goodsSectionClick(bussniessEntrance[0], 'businessClick')" />
        <div class="right">
            <img class="item" v-if="bussniessEntrance[1]" v-lazy="bussniessEntrance[1].imgUrl" @click="goodsSectionClick(bussniessEntrance[1], 'businessClick')" />
            <img class="item mt5" v-if="bussniessEntrance[2]" v-lazy="bussniessEntrance[2].imgUrl" @click="goodsSectionClick(bussniessEntrance[2], 'businessClick')" />
        </div>
      </div>
       <!--推荐商品-->
      <div class="activity-goods bg-white mt10" v-for="activItem in phoneList" :key="activItem.configSerialNo">
        <img v-if="activItem.floorType === '1'" class="img-only" v-lazy="activItem.imgUrl" @click="goodsSectionClick(activItem, 'floorClick')">
        <div v-else-if="activItem.listCommodityCategory && activItem.listCommodityCategory.length > 0">
          <div class="header">
            {{activItem.title}}
            <span  class="desc">
              {{activItem.floorDescription}}
            </span>
          </div>
          <div class="recommend-content">
            <div v-if="activItem.floorType === '3'" class="recommend-banner">
              <img v-lazy="activItem.imgUrl" @click="goodsSectionClick(activItem, 'floorClick')">
            </div>
            <div class="recomend-row-list">
              <div class="recommend-row" v-for="goodsItem in activItem.listCommodityCategory" :key="goodsItem.categoryCode">
                <div class="item-img">
                  <img v-lazy="goodsItem.listImg" @click="goodsSectionClick(goodsItem, 'floorClick')">
                  <span class="list-label" :class="goodsItem.commodityListTagPosition">{{goodsItem.commodityListTag}}</span>
                </div>
                <p class="item-title fw-b">{{goodsItem.shortName}}</p>
                <div class="item-price">
                  <div class="price-block">
                    <span class="new-price color-red">￥<span class="fz16 fw-b">{{goodsItem.leastRentDay}}</span></span>/天
                  </div>
                  <div v-if="goodsItem.leastOriginalPrice" class="price-block old-price">
                    ￥{{goodsItem.leastOriginalPrice}}/天
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 推荐专题 -->
      <div class="activity-goods bg-white mt10" v-if="brandBannars && brandBannars.length > 0">
        <div class="header">
          推荐专题
        </div>
        <div class="content ">
          <div class="content-wrap recommend">
           <div class="recommend-item">
             <img v-for="(item, index) in brandBannars" :key="index" v-lazy="item.imgUrl" @click="goodsSectionClick(item, 'recommendClick')" />
           </div>
          </div>
        </div>
      </div>
      <div class="slogan"><span>{{brandAdvertising}}</span></div>
    </section>
    <section>
      <main-page></main-page>
    </section>
  </div>
</template>

<script>
import vueJs from './HomePage.js';
export default vueJs;
</script>

<style lang="less" scoped>
@import './../../common/less/index';
@import './HomePage.less';
</style>
