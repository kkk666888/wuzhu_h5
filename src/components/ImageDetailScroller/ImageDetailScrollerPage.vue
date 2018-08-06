<template>
  <div class="ImageDetailScrollerPage">
    <!--<x-header :left-options="{backText: ''}">{{ banner_index }} / {{ totalPictureCount }}</x-header>-->
    <div class="ImageDisplayPlane">
      <swiper :aspect-ratio="600/500" :show-dots="false" v-model="banner_index">
        <swiper-item class="ScrollerImageItem" v-for="(item, index) in banner_list" :key="index">
          <div class="ScrollerImageItem_div" @click="back()">
            <img class="ScrollerImageItem_img" :src="item.img"  style="width: 100%" />
          </div>
        </swiper-item>
      </swiper>
    </div>
    <div class="IndicatePlane">
      <span class="IndicatePlaneBg">
        <span class="IndicatePlane_currentIndex">{{ banner_index+1 }} / </span>
        <span class="IndicatePlaneBg_TotalIndex">{{ totalPictureCount }}</span>
      </span>
    </div>
  </div>
</template>

<script>
  import {XHeader, Swiper, SwiperItem} from 'vux'

  // const baseList = [{
  //   url: 'javascript:',
  //   img: 'https://m.360buyimg.com/n0/jfs/t4402/174/572302090/605882/dd1e029d/58d161baN6fba1a2d.jpg!q70.jpg'
  //   // title: '送你一朵fua'
  // }, {
  //   url: 'javascript:',
  //   img: 'https://m.360buyimg.com/n0/jfs/t4669/204/568472059/337075/6354fdb5/58d161b8Nf21033b2.jpg!q70.jpg'
  //   // title: '送你一辆车'
  // }, {
  //   url: 'javascript:',
  //   img: 'https://m.360buyimg.com/n0/jfs/t3280/128/9189314034/355207/4c051ed2/58d161b8N72349202.jpg!q70.jpg'
  //
  //   // title: '送你一次旅行'
  //   // fallbackImg: 'https://static.vux.li/demo/3.jpg'
  // }]

    export default {
      name: 'ImageDetailScrollerPage',
      components: {
        XHeader,
        Swiper,
        SwiperItem
      },
      data() {
        return {
          banner_list: [],
          banner_index: 0
        }
      },
      created() {
        let index = this.$router.app._route.params.selectedIndex
        let list = this.$router.app._route.params.banner_list
        this.banner_list = list
        this.banner_index = index
      },
      computed: {
        totalPictureCount: function() {
          return this.banner_list.length
        }
      },
      methods: {
        itemOnClickMethod: function(item) {
          console.log('===========================')
        },
        back() {
          history.back()
        }
      }
    }
</script>

<style lang="less">
  @import "./../../common/less/index";
  .ImageDetailScrollerPage{
    background: white;
    font-family: 'PingFang SC';
    position: relative;
    height: 100%;

    /*.fixed-header{*/
    /*width: 100%;*/
    /*background: #F04655;*/
    /*height: 40px;*/
    /*z-index: 99;*/
    .vux-header{
      background-color: #FFFFFF !important;
      position: fixed !important;
      z-index: 100 !important;
      width: 100% !important;
    }
    .vux-header .vux-header-title{
      color: #222222 !important;
      font-size: 19px !important;
      font-family: 'PingFangSC-Regular' !important;
      background: white  !important;
    }
    .ImageDisplayPlane{
      position: absolute;
      top: 50%;
      background: white;
      width: 100%;
      transform: translateY(-40%);
    }
    .scroll-imgs {
      text-align: center;
      width: 100%;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -160px;

      .slide {
        min-width: 320px;
        min-height: 320px;
        max-width: 640px;
        width: 100%;
        overflow: hidden;
        display: inline-block;
        position: relative;

        ul {
          position: absolute;
          top: 0;
          left: 0;
          visibility: visible;
          z-index: 10;

          li {
            width: 100%;
            min-width: 320px;
            max-width: 640px;
            min-height: 320px;
            visibility: visible;
            position: relative;
            background-color: #fff;
            float: left;
            display: -webkit-box;
            -webkit-box-pack: center;
            -webkit-box-align: center;

            img {
              max-width: 100%;
              max-height: 100%;
              display: block;
              overflow: hidden;
            }
          }
        }
      }
    }
    .IndicatePlane{
      position: fixed;
      bottom: 80px;
      width: 100%;
      height: 50px;
      text-align: center;
      line-height: 50px;
      .IndicatePlaneBg{
        background: rgba(6,25,39,0.31);
        border-radius: 100px;
        padding: 0px 8px;
        .IndicatePlane_currentIndex{
          font-size: 13px;
          color: #FFFFFF;
          letter-spacing: 0;
          text-align: center;
        }
        .IndicatePlaneBg_TotalIndex{
          font-size: 10px;
          color: #FFFFFF;
          letter-spacing: 0;
          text-align: center;
        }
      }
    }
  }
</style>
