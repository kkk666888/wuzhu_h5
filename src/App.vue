<template>
  <div id="app">
    <div ref="testGetLocation"></div>
    <div style="height: 100%">
      <router-view></router-view>
    </div>
    <loading v-model="isLoading" :text="loadText"></loading>
  </div>
</template>

<script>
import { Loading } from 'vux';
import { mapState } from 'vuex';
import { isIOS, isAndroid, GetLocation, configWX, GetWXLocation, GetBaiduGps, isWeiXin } from './util/utils';
// import { isIOS, isAndroid, configWX } from './util/utils'
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
    let _isIOS = isIOS();
    let _isAndroid = isAndroid();
    if (_isIOS || _isAndroid) {
      if (_isIOS) {
        this.$store.commit('updateOsinfo', { osinfo: 'IOS' });
      } else if (_isAndroid) {
        this.$store.commit('updateOsinfo', { osinfo: 'Android' });
      }
    }
    if (isWeiXin()) {
      configWX(this, {
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
    // 获取用户数据
    this.$http.get('/wuzhu/user/getCustomrtInfo').then(res => {
      if (res.code === '00' && res.data) {
        this.isLogin = true;
        this.userName = res.data.name;
        this.userPhone = res.data.mebile;
      } else if (res.code === '1001') {
        this.isLogin = false;
      }
    });

    let isJDLogin = false;
    if (sessionStorage.getItem('JDLoginStatus')) {
      isJDLogin = true;
    }
    // 从session中取categoryCode，保存到store中 (该需求关联多个文件，关键字url_goto_goodsdetail)
    let _categoryCode = sessionStorage.getItem('_categoryCode')
    console.log('App created _categoryCode = ' + _categoryCode)
    if (_categoryCode) {
      this.$store.commit('categoryCodeMemory', { categoryCode: _categoryCode });
    }
    // 获取到申请码后更新到store
    if (localStorage) {
      let recommCode = localStorage.getItem('recommCode');
      // console.log('recommCode = ' + recommCode);
      if (recommCode) {
        recommCode = recommCode.split('#')[0];
        console.log('recommCode split = ' + recommCode);
        this.$store.commit('updateRecommeCode', { recommeCode: recommCode });
      }
    }
    // 获取京东用户信息并静默登陆
    if (this.$store.state.channelNo === '003' && !isJDLogin) {
      this.queryJDInfoAndLogin();
    }
  },
  mounted() {
    let that = this;

    this.getUserLocation();
    // that.appData.isGetLocation = true
    // if (sessionStorage) {
    //   sessionStorage.setItem('appData', JSON.stringify(that.appData))
    // }

    let openId = this.$store.state.othersOpenID;
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
                console.log(that.userName);
                console.log(that.userPhone);
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
  methods: {
    getUserLocation() {
      let that = this;
      if (this.$store.state.lat || this.$store.state.lng) {
        return;
      }
      setTimeout(function() {
        that.$nextTick(() => {
          // 分享按钮
          if (isWeiXin()) {
            that.wxMenuShare();
          }
          // 获取用户地理位置
          GetLocation({}, that)
            .then(position => {
              // console.log('position', position);
              // console.log(that.$store.state.lat);
              // console.log(that.$store.state.lng);
            })
            .catch(error => {
              console.log(error);
              GetWXLocation(that)
                .then(res => {
                  // console.log(res);
                })
                .catch(err => {
                  console.log('locationErr', err);
                  GetBaiduGps().then(res => {
                    that.$store.commit('latMemory', { lat: res.lat });
                    that.$store.commit('lngMemory', { lng: res.lng });
                  });
                });
            });
        });
      }, 1000);
    },
    // 根据accessToken获取京东小白用户信息并静默登陆
    queryJDInfoAndLogin() {
      let JDtoken = this.$store.state.accessToken;
      if (JDtoken) {
        this.$http
          .get('/wuzhu/jDEntryController/queryJDXBFromJDChannel', {
            accessToken: JDtoken,
            channelNo: this.$store.state.channelNo,
            recommCode: this.$store.state.recommeCode // 邀请码 --
          })
          .then(res => {
            if (res.code === '00' && res.data) {
              // 用户有两个京东号, 其 openId 不同, 不同的账号是否需要清空本地缓存的数据
              // if (this.$store.state.othersOpenID !== res.data.openId) {
              // }
              this.$store.commit('tokenMemory', { token: res.data.Token });
              this.$store.commit('updatePhone', { phone: res.data.moblile });
              this.$store.commit('updateWXOpenID', {
                othersOpenID: res.data.openId
              });
              sessionStorage.setItem('JDLoginStatus', true);
            } else {
              this.$vux.alert.show({
                title: '提示',
                content: res.err || res.msg
              });
            }
          })
          .catch(err => {
            this.$vux.alert.show({
              title: '提示',
              content: err
            });
          });
      } else {
        this.$vux.alert.show({
          title: '提示',
          content: '获取登陆accessToken失败'
        });
      }
    },
    wxMenuShare() {
      let mainjsData = {
        wxRedirectUri: window.location.href.split('/dist')[0] + '/dist?'
      };
      // if (sessionStorage) {
      //   let _mainjsData = sessionStorage.getItem('mainjsData')
      //   if (_mainjsData) {
      //     mainjsData.wxRedirectUri = _mainjsData.wxRedirectUri
      //   }
      // }
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
  .vux-tab .vux-tab-item.vux-tab-selected {
    color: #111 !important;
    font-weight: bold;
  }
  .vux-tab .vux-tab-item {
    font-size: 16px;
    color: #111;
  }
  .vux-tab-bar-inner {
    background-color: @orange;
  }
  .vux-tab-warp {
    // box-shadow: 0 2px 6px 0 #dadada;
  }
  .weui-btn {
    color: #000;
  }
  .weui-btn:after {
    border: none;
  }
}
</style>
