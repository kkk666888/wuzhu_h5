<template>
  <div class="GoodsDetailPage">
    <div class="GoodsDetailPage_MainContent">
      <!--商品的Banner图-->
      <div class="GoodsDetailPageScrollerDiv vux-1px-b">
        <swiper height="375px" v-model="banner_index" :show-dots="true" dots-position="center">
          <swiper-item
            class="GoodSDetailImageItem"
            v-for="(item, swiperIndex) in parseData.bannerList"
            :key="swiperIndex"
            @click.native="bannerClickIndex(swiperIndex, item)"
          >
            <div class="GoodSDetailImage_div">
              <img class="GoodSDetailImage_img" v-lazy="item.img">
              <img
                class="detail-img-tag"
                v-if="detailTagUrl"
                :class="detailTagUrlPosition"
                :src="detailTagUrl"
              >
            </div>
          </swiper-item>
        </swiper>
        <img
          v-if="isAlipayLife"
          class="alipay_hb_slogan"
          src="./alipay_hb_slogan.png"
          srcset="./alipay_hb_slogan.png 1x, ./alipay_hb_slogan@2x.png 2x"
        >
      </div>
      <!--商品具体的名字，租金，以及商品价值的展示-->
      <div class="GoodsCategoryPlane">
        <!--商品详情部分-->
        <div class="GoodsConfigDetailPlane">
          <span class="GoodsConfigDetailPlane_info">{{ commodities.fullName }}</span>
        </div>
        <div
          class="GoodsDetailTags vux-1px"
          v-for="(tagItem, index) in detailTagList"
          :key="index"
        >{{tagItem}}</div>

        <div class="Goods_least_sign_price">
          <span class="Goods_rent_price_value color-red">
            ￥
            <em class="fz-24">{{ leastRentDay }}</em>
          </span>
          <span class="Goods_rent_price_unit">/天</span>
          <span class="goods-old-price" v-if="leastOriginalPrice">￥{{leastOriginalPrice}}/天起</span>
          <span class="goods-months-price">
            月租低至
            <span>￥{{leastMonthRentAmtOut}}</span>
          </span>
        </div>
        <!-- <div class="goods-price-comment">
          <span class="goods-market-price">市场价: ￥{{leastMarketPrice}}</span>
          <span class="goods-buyout-price">买断尾款: ￥{{leastBuyoutAmtOut}}起</span>
          <i class="icon iconfont icon-help1 color-blue" @click="showBuyOutDetail"></i>
        </div> -->
        <div class="comment-img mt10" v-if="detailRentDescriptionUrl">
          <img v-lazy="detailRentDescriptionUrl">
        </div>
      </div>
      <div class="padding-line"></div>
      <!--租机必看 和 租赁说明的展示框-->
      <div class="GoodsDetailTabDeclarePlane">
        <tab
          :line-width="3"
          custom-bar-width="60px"
          active-color="#FFDA29"
          v-model="declarePlaneIndex"
        >
          <tab-item
            class="vux-center"
            :selected="declarePlaneDefault === item"
            v-for="(item, declareIndex) in declareList"
            @click="declarePlaneDefault = item"
            :key="declareIndex"
          >{{item}}</tab-item>
        </tab>
        <!--租赁说明-->
        <div v-show="declarePlaneIndex === 0">
          <div class="GoodsDetailTabDeclarePlane_Plane" v-show="showRentHttpDesc">
            <img
              class="GoodsDetailTabDeclarePlane_Plane_img"
              v-for="(rentImageItem, rentImageIndex) in detailImgUrlsList"
              :key="rentImageIndex"
              v-lazy="rentImageItem"
            >
          </div>
          <div class="GoodsDetailTabDeclarePlane_Plane" v-show="!showRentHttpDesc">
            <lease-description
              :adv-title="leaseDescShorName"
              :left-day="leaseDescRentDay"
              :left-price="leaseDescRentTotal"
              :right-price="leaseDescMarketPrice"
              :isShowAdvantage="leaseShowCompare"
            ></lease-description>
          </div>
        </div>
        <!--图文详情-->
        <div class="GoodsDetailTabDeclarePlane_Plane" v-show="declarePlaneIndex === 1">
          <img
            class="GoodsDetailTabDeclarePlane_Plane_img"
            v-for="(detailImageItem, detailImageIndex) in detailImageTextList"
            :key="detailImageIndex"
            v-lazy="detailImageItem"
          >
        </div>
      </div>
      <div class="marginBottom70px"></div>
    </div>
    <!-- 选择商品弹框 -->
    <div class="GoodsDetail_Bottom_fixed vux-1px-t">
      <div class="GoodsDetail_Bottom_fixed_Content">
        <div class="detail-customer-service" @click="activityClick(1, customerServiceUrl)">
          <img src="./contact.svg" style="vertical-align: middle;" alt="我的客服">我的客服
        </div>
        <div
          @click="showCategoryPlanClick"
          class="new-submit"
          v-bind:class="submitOrderBtnClass"
        >立即租赁</div>
      </div>
    </div>
    <!--移植弹窗部分的代码-->
    <div class="goodsCategoryPlane" v-show="categoryPlaneShow">
      <div class="sl-dialog">
        <!--阴影部分-->
        <transition :name="maskTransition">
          <div class="sl-mask" @click="planeHideClick"></div>
        </transition>
        <transition :name="dialogTransition">
          <div class="sl-dialog-content">
            <!--商品展示部分-->
            <div class="goodsInfo">
              <div class="goodsContent">
                <div class="dialog-content-item">
                  <p class="remark"></p>
                  <p class="months-price">
                    <span class="price-symbol">￥</span>
                    {{leastMonthRentAmt}}
                  </p>
                  <p class="price-zh">月租金</p>
                </div>
                <div class="dialog-content-item">
                  <p class="remark" v-if="leastOriginTotalRentAmt">￥{{leastOriginTotalRentAmt}}</p>
                  <p class="remark" v-else></p>
                  <p class="total-price">
                    <span class="price-symbol">￥</span>
                    {{leastTotalRentAmt}}
                  </p>
                  <p class="price-zh">总租金</p>
                </div>
                <div class="dialog-content-item">
                  <p class="remark"></p>
                  <p class="dialog-buyout-price">
                    <span class="price-symbol">￥</span>
                    {{leastBuyoutAmt}}
                  </p>
                  <p class="price-zh">
                    买断尾款
                    <i class="icon iconfont icon-help1 color-blue" @click="showBuyOutDetail"></i>
                  </p>
                </div>
              </div>
            </div>
            <!--滑动部分的控制-->
            <div class="scrollerWrap" ref="scrollerWrap">
              <!--规格展示-->
              <div class="categoryPlane">
                <div
                  class="sectionBox"
                  v-for="(item, index) in parseData.categoryTable"
                  :key="index"
                >
                  <div class="sectionTitle">{{ item.specName }}</div>
                  <div class="sectionContent">
                    <div
                      class="categoryItem"
                      v-for="(subItem, subIndex) in item.Array"
                      :key="subIndex"
                      v-bind:data-Item="subItem"
                      v-bind:class="{ 'categoryItemSel': categoryItemChooseClass(subItem, 2), 'categoryItem':(subItem.Status === 0),  'categoryItemDisable':(subItem.Status === 1)}"
                      @click="categoryItemClick(subItem)"
                    >
                      {{ subItem.specContent }}
                      <div class="categoryItemIcon" v-show="subItem.Status === 2"></div>
                    </div>
                  </div>
                </div>
              </div>
              <!--租期部分展示-->
              <div class="rentDayPlane">
                <div class="sectionBox">
                  <div class="sectionTitle">租赁方式</div>
                  <div class="sectionContent">
                    <div
                      class="categoryItem"
                      v-for="(rentItem, rentIndex) in parseData.rentStyleArray"
                      :key="rentIndex"
                      v-bind:class="{ 'categoryItemSel': getRentStyleItemStatus(rentItem, 2, true), 'categoryItem':(rentItem.Status === 0),  'categoryItemDisable':(rentItem.Status === 1)}"
                      @click="rentItemClick(rentItem, true) "
                    >
                      {{ rentItem.rentSolutionName }}
                      <div class="categoryItemIcon" v-show="rentItem.Status === 2"></div>
                    </div>
                  </div>
                </div>
                <div class="sectionBox">
                  <div class="sectionTitle">租期</div>
                  <div class="sectionContent">
                    <div
                      class="categoryItem"
                      v-for="(termItem, termIndex) in parseData.financeProductList"
                      :key="termIndex"
                      v-bind:class="{ 'categoryItemSel': getFinalproductNoStatus(termItem, 2), 'categoryItem':(termItem.Status === 0),  'categoryItemDisable':(termItem.Status === 1)}"
                      @click="financialItemClick(termItem) "
                    >
                      {{ termItem.termShortDes ? termItem.termShortDes : termItem.totalDays + '天' }}
                      <div class="categoryItemIcon" v-show="termItem.Status === 2"></div>
                    </div>
                  </div>
                </div>
              </div>
              <!--增值服务-->
              <div class="feePlane">
                <div class="service-title">增值服务</div>
                <div class="feeSection" v-if="!isUserChooseFinancialProduct">
                  <div class="feeSectionTop">
                    <div class="feeSection-left">
                      <div class="feeSelCir"></div>
                      <div class>意外保障金（必选）</div>
                    </div>
                    <div class="feeSection-right" @click="feeDescItemClick">
                      <i class="icon iconfont icon-help1"></i>
                    </div>
                  </div>
                  <div class="feeSectionBottom">用机无忧，物主平台提供的意外保障服务</div>
                </div>
                <div v-else>
                  <div
                    class="feeSection"
                    v-for="(additionalItem, index) in additionalFeeList"
                    :key="index"
                  >
                    <div class="feeSectionTop">
                      <div class="feeSection-left">
                        <div class="feeSelCir"></div>
                        <div class>{{ feeItemNameDesc(additionalItem) }} (必选)</div>
                      </div>
                      <div class="feeSection-right" @click="feeDescItemClick(additionalItem)">
                        <i class="icon iconfont icon-help1"></i>
                      </div>
                    </div>
                    <div class="feeSectionBottom">{{additionalItem.feeShortDesc}}</div>
                  </div>
                  <div
                    class="feeSection"
                    v-for="(feeItem, feeIndex) in optionalFeeList"
                    :key="feeIndex"
                  >
                    <div class="feeSectionTop">
                      <div class="feeSection-left">
                        <div
                          v-bind:class="feeListCircleClassObject(feeItem)"
                          class="mr10"
                          @click="feeListItemClick(feeItem)"
                        ></div>
                        <div class>{{ feeItemNameDesc(feeItem) }}</div>
                      </div>
                      <div class="feeSection-right" @click="feeDescItemClick(feeItem)">
                        <i class="icon iconfont icon-help1"></i>
                      </div>
                    </div>
                    <div class="feeSectionBottom">{{feeItem.feeShortDesc}}</div>
                  </div>
                </div>
              </div>
            </div>
            <!--按钮部分说明-->
            <div class="buttonPlane">
              <x-button @click.native="goNext">确定</x-button>
            </div>
            <!--费用说明和其它对应的说明-->
            <fee-desc-alert
              :showScrollBox="showScrollBox"
              :potocol-type="true"
              :dialogTitle="dialogTitle"
              :dialogContent="dialogContent"
              @sureBtnClick="feeDescItemClick()"
            >
              <div v-html="dialogContent" slot="htmlPocotol"></div>
            </fee-desc-alert>
            <toast v-model="reminderShow" type="text" width="20em">{{ reminderInfoMessage }}</toast>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import detailJs from './GoodsDetaiPage';
export default detailJs;
</script>

<style lang="less">
@import "./../../common/less/index";
@import "./GoodsDetailPage.less";
</style>

