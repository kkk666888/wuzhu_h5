<template>
  <div>
    <div v-transfer-dom>
      <x-dialog v-model="showScrollBox" class="dialog-demo" :isPreventDefault="false" @fs-toggle="fsToggle">
        <div class="showScrollBox_hd">
          <strong class="showScrollBox_hd_title">{{ dialogTitle }}</strong>
        </div>
        <div class="showScrollBox_bd" style="max-height:400px; overflow:scroll;-webkit-overflow-scrolling:touch;" v-if="!potocolType" ref="dialogContent">
          <div>{{ dialogContent }}</div>
        </div>
        <div class="showScrollBox_bd" style="max-height:400px; overflow:scroll;-webkit-overflow-scrolling:touch;" v-if="potocolType" ref="dialogContent">
          <slot name="htmlPocotol"></slot>
        </div>
        <div class="showScrollBox-dialog__ft" @click="sureBtnClick">
          <a href="javascript:;" class="showScrollBox-dialog__btn showScrollBox-dialog__btn_primary">
            确定
          </a>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { XDialog, TransferDomDirective as TransferDom } from 'vux';
export default {
  name: 'fee-desc-alert',
  directives: {
    TransferDom
  },
  components: {
    XDialog
  },
  props: {
    dialogTitle: '',
    dialogContent: '',
    showScrollBox: true,
    potocolType: false
  },
  methods: {
    sureBtnClick: function() {
      this.$emit('sureBtnClick');
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
  },
  mounted() {
    let height = document.body.clientHeight;
    let setHeight = height - 70 * 2 - 56 - 48 + 'px';
    let contentPlane = this.$refs.dialogContent;
    contentPlane.style['max-height'] = setHeight;
  },
  data() {
    return {
      isShowFirst: true
    };
  }
};
</script>

<style lang="less">
@import './../../common/less/index';
.dialog-demo {
  font-size: 16px;
  .weui-dialog {
    border-radius: 10px !important;
    width: 95% !important;
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
}
</style>
