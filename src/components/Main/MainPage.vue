<template>
  <div class="MainPage">
    <tabbar class="MainPageTabBar">
      <tabbar-item :selected="selectedIndex === 0" @click.native="gotHomePage">
        <img slot="icon-active" :src="home.active">
        <img slot="icon" :src="home.normal">
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item :selected="selectedIndex === 1" @click.native="goShopPage">
        <img slot="icon" :src="list.normal">
        <img slot="icon-active" :src="list.active">
        <span slot="label">分类</span>
      </tabbar-item>
      <tabbar-item :selected="selectedIndex === 2" @click.native="goMinePage">
        <img slot="icon" :src="my.normal">
        <img slot="icon-active" :src="my.active">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux';

export default {
  name: 'MainPage',
  components: {
    Tabbar,
    TabbarItem
  },
  data() {
    return {
      home: {
        active: './static/svg/home_press.svg',
        normal: './static/svg/home_nor.svg'
      },
      list: {
        normal: './static/svg/list_nor.svg',
        active: './static/svg/list_press.svg'
      },
      my: {
        normal: './static/svg/me_nor.svg',
        active: './static/svg/me_press.svg'
      }
    };
  },
  computed: {
    selectedIndex() {
      return this.$store.state.selectedIndex;
    }
  },
  created() {},
  methods: {
    gotHomePage() {
      this.$router.push({ name: 'HomePage' });
      this.$store.commit('SELECTED_INDEX', { selectedIndex: 0 });
    },
    goMinePage() {
      this.$router.push({ name: 'MinePage' });
      this.$store.commit('SELECTED_INDEX', { selectedIndex: 2 });
    },
    goShopPage() {
      this.$router.push({ name: 'GoodsCategory' });
      this.$store.commit('SELECTED_INDEX', { selectedIndex: 1 });
      this.$store.commit('typeNoMemory', {typeNo: '99999'});
    }
  }
};
</script>

<style lang="less">
@import "./../../common/less/index";

.weui-tabbar {
  // position: fixed !important;
  left: 0;
}

.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
  opacity: 1 !important;
  color: #4a4a4a !important;
  font-family: "PingFang SC" !important;
  font-size: 10px;
}

.weui-tabbar__icon {
  display: inline-block;
  width: 22px !important;
  height: 22px !important;
}

.weui-tabbar__label {
  opacity: 0.4 !important;
  color: #4a4a4a !important;
  font-family: "PingFang SC" !important;
}
</style>
