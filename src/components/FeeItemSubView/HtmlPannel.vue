<template>
  <div class="HtmlPannel">
    <x-dialog v-model="showScrollBox" class="dialog-demo" style="width:100%;max-width: 500px" :isPreventDefault="false" @fs-toggle="fsToggle">
      <div class="showScrollBox_hd">
        <strong class="showScrollBox_hd_title">{{ protocolTitle }}</strong>
      </div>
      <div class="showScrollBox_bd" style="max-height: 400px; overflow:scroll;-webkit-overflow-scrolling:touch;" ref="html">
        <div v-html="html" style="max-width: 500px"></div>
      </div>
      <div class="showScrollBox-dialog__ft" @click="sureBtnClick">
        <a href="javascript:;" class="showScrollBox-dialog__btn showScrollBox-dialog__btn_primary">
          确定
        </a>
      </div>
    </x-dialog>
  </div>
  <!--<mu-circular-progress :size="40" v-if="loading"/>-->
</template>

<script>
import { XDialog, TransferDomDirective as TransferDom } from 'vux';
export default {
  name: 'HtmlPannel',
  directives: {
    TransferDom
  },
  components: {
    XDialog
  },
  // 使用时请使用 :url.sync=""传值
  props: {
    showScrollBox: false,
    url: '',
    protocolTitle: ''
  },
  data() {
    return {
      isShowFirst: true,
      loading: false,
      html: '',
      aurl:
        'https://openapi.bestsign.info/openapi/v2/dist_v3/index.html#/donePage?developerId=1965831777222132321&data=FZiLywyKAh9Xywiiydj6jIf5mIv4nYf3mYDZnIjWnYjYnIfJkdiIA250DNeICfKLjIPJnsvZmInXpcnZmcbWncbXncbWjJXJCNKKC1q5DhvJpJiXDNu2Bxu3jJXJywGXBwiKrwrJpJjWmsj2psv3ncD5jJXJygaOjIPJnszXjJXJD2KMANuZjIPJDgK5zxO1ALbWmInVz29SjJXJDwuGAhK0Ftj6jIfXndi9'
    };
  },
  watch: {
    url(value) {
      console.log('url 发生了改变' + value);
      this.load(value);
    },
    protocolTitle(value) {
      console.log('protocolTitle 发生了改变' + value);
    }
  },
  mounted() {
    this.load(this.url);
    let height = document.body.clientHeight;
    let setHeight = height - 70 * 2 - 56 - 48 + 'px';
    let contentPlane = this.$refs.html;
    contentPlane.style['max-height'] = setHeight;
  },
  methods: {
    sureBtnClick: function() {
      this.$emit('sureBtnClick');
    },
    load(url) {
      if (url && url.length > 0) {
        // 加载中
        this.loading = true;
        let param = {
          accept: 'text/html, text/plain'
        };
        this.$http
          .get(url, param)
          .then(response => {
            this.loading = false;
            // 处理HTML显示
            this.html = response;
          })
          .catch(() => {
            this.loading = false;
            this.html = '加载失败';
          });
      }
    },
    fsToggle(that, val) {
      let _that = this;
      that.$nextTick(function() {
        let _scrollHeight = that.$el.querySelector('.weui-dialog .showScrollBox_bd').scrollHeight;
        let _clientHeight = that.$el.querySelector('.weui-dialog .showScrollBox_bd').clientHeight;
        if (_scrollHeight > _clientHeight) {
          // 有 滚条
        } else {
          if (_that.isShowFirst) {
            _that.isShowFirst = false;
            that.$el.querySelector('.weui-dialog').addEventListener(
              'touchmove',
              function(e) {
                e.preventDefault(); // 禁止原生事件
              },
              false
            );
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
@import './../../common/less/index';
.HtmlPannel {
  font-size: 16px;
  .weui-dialog {
    border-radius: 10px !important;
    width: 98% !important;
    max-width: 500px !important;
  }
  .showScrollBox_hd {
    padding: 1.3em 1.6em 0.5em;
    .border-1px();
    .showScrollBox_hd_title {
      font-weight: 400;
      font-size: 18px;
    }
  }
  .showScrollBox_bd {
    padding: 0.8em;
    min-height: 40px;
    font-size: 15px;
    line-height: 1.3;
    max-width: 500px !important;
    word-wrap: break-word;
    word-break: break-all;
    color: #999999;
  }
}
.showScrollBox_bd {
  padding: 0.8em 1.6em;
  min-height: 40px;
  font-size: 15px;
  line-height: 1.3;
  word-wrap: break-word;
  word-break: break-all;
  color: #999999;
}
.showScrollBox-dialog__ft {
  position: relative;
  line-height: 48px;
  font-size: 18px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  .border-1px-top();
  .showScrollBox-dialog__btn {
    display: block;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    color: #3cc51f;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    position: relative;
  }
  .showScrollBox-dialog__btn_primary {
    color: #26ddff;
  }
}
</style>
