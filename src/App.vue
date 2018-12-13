<template>
  <div id="app">
    <div ref="testGetLocation"></div>
    <div style="height: 100%">
      <keep-alive include="HomePage">
        <router-view></router-view>
      </keep-alive>
    </div>
    <loading v-model="isLoading" :text="loadText"></loading>
  </div>
</template>

<script>
import { Loading } from 'vux';
import { mapState } from 'vuex';
import * as Utils from './util/utils';
export default {
  name: 'App',
  data() {
    return {
      isGetOpenid: false, // 控制只执行一次 sessionStorage
      isGetLocation: false,
      appData: {},
      userPhone: '',
      userName: '',
      isLogin: false,
      wxReady: false
    };
  },
  components: {
    Loading
  },
  created() {
    try {
      this.initData();
    } catch (error) {
      console.log(error)
    }
    let channelNo = this.$store.state.channelNo;
    console.log('app created channelNo = ' + channelNo);
    // alert('app created channelNo = ' + channelNo);
    if (channelNo === '003') {
      this.JDLogin();
    } else if (channelNo === '004') {
      this.AliLifeLogin();
    } else {
      setTimeout(() => {
        this.getCustomerInfo();
      }, 2000);
    }
  },
  mounted() {
    this.getUserLocation();
  },
  methods: {
    initData() {
      // 取platformCode，保存到store中
      Utils.getPlatformCode();
      this.jsBridge.getDeviceInfo();
      // 设置loadText
      this.$store.commit('updateLoadingText', { loadText: '加载中' });
      if (sessionStorage) {
        let _appData = sessionStorage.getItem('appData');
        if (_appData) {
          this.appData = JSON.parse(_appData);
          this.isGetLocation = this.appData.isGetLocation;
        }
      }
      // 生成埋点唯一编号
      let ReporterDataSE = this.$reporter.getSessionStore();
      if (!ReporterDataSE.byno) {
        this.$reporter.createByno();
      }
      // 用户设备信息
      let _isIOS = Utils.isIOS();
      let _isAndroid = Utils.isAndroid();
      if (_isIOS || _isAndroid) {
        if (_isIOS) {
          this.$store.commit('updateOsinfo', { osinfo: 'IOS' });
        } else if (_isAndroid) {
          this.$store.commit('updateOsinfo', { osinfo: 'Android' });
        }
      }
      if (Utils.isWeiXin()) {
        Utils.configWX(this, {
          // jssdk 配置
          key: 'HomePageWX',
          url: window.location.href.split('#')[0],
          jsApiList: [
            'getLocation',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
          ]
        });
      }
      // 从session中取categoryCode，保存到store中 (该需求关联多个文件，关键字url_goto_goodsdetail)
      let _categoryCode = sessionStorage.getItem('_categoryCode');
      if (_categoryCode) {
        this.$store.commit('categoryCodeMemory', {
          categoryCode: _categoryCode
        });
      }
    },
    // 生活号静默登录
    AliLifeLogin() {
      let isAliLifeLogin = sessionStorage.getItem('AliLifeLoginStatus') || false;
      if (isAliLifeLogin !== 'true') {
        Utils.AliLifeLogin(this)
          .then(res => {
            this.getCustomerInfo();
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 京东静默登录
    JDLogin() {
      // 获取京东用户信息并静默登陆
      let that = this;
      let isJDLogin = false;
      if (sessionStorage.getItem('JDLoginStatus') === 'true') {
        isJDLogin = true;
      }
      console.log('JDLogin isJDLogin = ' + isJDLogin)
      // alert('JDLogin isJDLogin = ' + isJDLogin)
      if (!isJDLogin) {
        Utils.queryJDInfoAndLogin(that)
          .then(res => {
            that.getCustomerInfo();
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 初始化七鱼客服
    initYsfConfig() {
      let that = this;
      let openId = this.$store.state.othersOpenID;
      // 如果是app渠道，openId使用设备id
      if (Utils.isWzapp()) {
        openId = that.$store.state.deviceId;
      }
      if (!openId) {
        openId = '';
      }
      this.$nextTick(() => {
        /* eslint-disable no-undef */
        setTimeout(() => {
          ysf.on({
            onload: function() {
              ysf.config({
                uid: openId,
                name: that.userName,
                mobile: that.phone,
                success: function() {
                  console.log('ysf success...');
                  // console.log('ysf openid=' + openId);
                  // console.log('ysf userName=' + that.userName);
                  // console.log('ysf userPhone=' + that.userPhone);
                  /* eslint-disable no-new */
                  new Drag(); // 调用拖动
                },
                error: function(err) {
                  console.log(err);
                }
              });
            }
          });
        }, 2000);
      });
    },
    // 获取用户数据
    getCustomerInfo() {
      this.$http.get('/wuzhu/user/getCustomrtInfo').then(res => {
        if (res.code === '00' && res.data) {
          this.isLogin = true;
          this.userName = res.data.name;
          this.userPhone = res.data.mebile;
        } else if (res.code === '1001') {
          this.isLogin = false;
        }
        // this.initYsfConfig();
      });
    },
    getUserLocation() {
      let that = this;
      if (this.$store.state.lat || this.$store.state.lng) {
        return;
      }
      setTimeout(function() {
        that.$nextTick(() => {
          // 分享按钮
          if (Utils.isWeiXin()) {
            that.wxMenuShare();
          }
          // 获取用户地理位置
          Utils.GetLocation({}, that)
            .then(position => {
              // console.log('position', position);
              // console.log(that.$store.state.lat);
              // console.log(that.$store.state.lng);
            })
            .catch(error => {
              console.log(error);
              Utils.GetWXLocation(that)
                .then(res => {
                  // console.log(res);
                })
                .catch(err => {
                  console.log('locationErr', err);
                  Utils.GetBaiduGps().then(res => {
                    that.$store.commit('latMemory', { lat: res.lat });
                    that.$store.commit('lngMemory', { lng: res.lng });
                  });
                });
            });
        });
      }, 1000);
    },
    wxMenuShare() {
      let mainjsData = {
        wxRedirectUri: window.location.href.split('/dist')[0] + '/dist?'
      };
      let _title = document.title;
      let _link = mainjsData.wxRedirectUri;
      let _imgUrl = window.location.href.split('/dist')[0] + '/dist/static/images/logo.png';
      let _desc = '不来物主？朝阳群众举报你！';
      // 获取 “分享到朋友圈” 按钮点击状态及自定义分享内容接口
      wx.onMenuShareTimeline({
        title: '不来物主？朝阳群众举报你！', // 分享标题
        desc: _desc,
        link: _link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: _imgUrl, // 分享图标
        success: function() {},
        cancel: function() {}
      });
      // 获取 “分享给朋友” 按钮点击状态及自定义分享内容接口
      wx.onMenuShareAppMessage({
        title: _title, // 分享标题
        desc: _desc, // 分享描述
        link: _link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: _imgUrl, // 分享图标
        // type: '', // 分享类型,music、video或link，不填默认为 link
        // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function() {},
        cancel: function() {}
      });
      // 获取 “分享到QQ” 按钮点击状态及自定义分享内容接口
      wx.onMenuShareQQ({
        title: _title, // 分享标题
        desc: _desc, // 分享描述
        link: _link, // 分享链接
        imgUrl: _imgUrl, // 分享图标
        success: function() {},
        cancel: function() {}
      });
      // 获取 “分享到腾讯微博” 按钮点击状态及自定义分享内容接口
      wx.onMenuShareWeibo({
        title: _title, // 分享标题
        desc: _desc, // 分享描述
        link: _link, // 分享链接
        imgUrl: _imgUrl, // 分享图标
        success: function() {},
        cancel: function() {}
      });
      // 获取 “分享到QQ空间” 按钮点击状态及自定义分享内容接口
      wx.onMenuShareQZone({
        title: _title, // 分享标题
        desc: _desc, // 分享描述
        link: _link, // 分享链接
        imgUrl: _imgUrl, // 分享图标
        success: function() {},
        cancel: function() {}
      });
    }
  },
  computed: {
    ...mapState({
      isLoading: state => state.isLoading,
      loadText: state => state.loadText
    })
  }
};
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import './common/less/index.less';
@import '~vux/src/styles/1px.less';
body {
  max-width: 600px;
  margin: auto;
  background: @bg;
}
#app {
  height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  .vux-tab-bar-inner {
    background-color: @orange;
  }
  .weui-btn {
    color: #000;
  }
  .weui-btn:after {
    border: none;
  }
}
.vux-tab .vux-tab-item {
  font-size: 16px !important;
  color: #222 !important;
}
.vux-tab-selected {
  color: #222 !important;
  font-weight: 700;
}
</style>
