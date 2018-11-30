<template>
  <div class="liveness-ui">
    <div v-transfer-dom>
      <x-dialog v-model="showHideOnBlur" class="liveness-ui-dialog" hide-on-blur>
        <div class="modal liveness-modal">
          <div class="modal-body">
            <div class="sample">
              <div class="sample-inner">
                <div class="gif-container">
                  <img :src="imgSrc">
                </div>
              </div>
            </div>
            <p>
              录制不超过<em> {{ fileTime }}s </em>的视频<br>
              拍摄视频时请<em> {{ description }} </em>
            </p>
            <div class="fs-btn">
              <!-- @click="btnClick" -->
              <button class="enabled">开始录制</button>
              <label for="uploadVideo" class="fs-label"></label>
            </div>
            <input ref="uploadVideo" id="uploadVideo" name="uploadVideo" class="upload-input" type="file" accept="video/*" capture="true">
          </div>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showLoading" class="liveness-ui-loading" hide-on-blur>
        <div class="modal loading-modal">
          <div class="modal-body">
            <div class="gif-container">
              <img :src="loadingImgSrc" alt="Loading">
            </div>
            <p>上传中...</p>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { XDialog, TransferDomDirective as TransferDom } from 'vux'
  // import { isWeiXin } from './../../util/utils'
  export default {
    data() {
      return {
        showHideOnBlur: false,
        showLoading: false,
        intCtrl: 0,
        livenessAssets: {
          BLINK: {
            key: 'BLINK',
            gif: './static/images/LivenessUI/blink.gif',
            description: '眨眨眼睛'
          },
          MOUTH: {
            key: 'MOUTH',
            gif: './static/images/LivenessUI/mouth.gif',
            description: '张一张嘴'
          },
          YAW: {
            key: 'YAW',
            gif: './static/images/LivenessUI/yaw.gif',
            description: '摇一摇头'
          },
          NOD: {
            key: 'NOD',
            gif: './static/images/LivenessUI/nod.gif',
            description: '点一点头'
          }
        },
        description: '眨眨眼睛',
        loadingImgSrc: './static/images/LivenessUI/cloud.gif',
        imgSrc: './static/images/LivenessUI/blink.gif'
      }
    },
    model: {
      prop: 'show',
      event: 'change'
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      silentLiveness: {
        type: Boolean,
        default: false
      },
      fileTime: {
        type: Number,
        default: 5
      },
      fileSize: {
        type: Number,
        default: 15 * 1024 * 1024
      },
      sizeText: {
        type: String,
        default: '15M'
      },
      action: {
        type: String,
        default: 'BLINK'
      },
      livenessEnum: {
        type: Object,
        default() {
          return {
            BLINK: 0, // 眨眼
            MOUTH: 1, // 张嘴
            YAW: 2, // 摇头
            NOD: 3 // 点头
          }
        }
      }
    },
    mounted() {
      let that = this
      that.$refs.uploadVideo.addEventListener('change', that.checkFile.bind(that), false)
      // let _isWeiXin = isWeiXin()
      // let _isIPhone = /(iPhone)/i.test(navigator.userAgent)
      // // 微信 6.6.6 iPhone 5
      // if (_isWeiXin && (_isWeiXin.version === '6.6.6') && _isIPhone && (screen.width < 321)) {
      //   that.$refs.uploadVideo.removeEventListener('change', that.checkFile.bind(that), false)
      //   that.intCtrl = setInterval(function() {
      //     if (that.$refs.uploadVideo.files.length > 0) { // input file 有文件
      //       that.checkFile.bind(that)
      //     }
      //   }, 500)
      // }
    },
    watch: {
      action(val) {
        this.switchImgSrc()
      },
      show(val) {
        this.showHideOnBlur = val
      },
      showHideOnBlur(val) {
        // this.$emit('update:show', val)
        // clearInterval(this.intCtrl)
        this.$emit(val ? 'on-show' : 'on-hide')
        this.$emit('fs-toggle', this, val)
        this.$emit('change', val) // 触发 show 变化
      }
    },
    methods: {
      btnClick() {
        this.$refs.uploadVideo.click()
      },
      switchImgSrc() {
        let that = this
        if (that.silentLiveness) {
          that.description = '保持不动'
          that.imgSrc = './static/images/LivenessUI/silent.gif'
        } else if (that.action === 'BLINK') {
          that.description = that.livenessAssets.BLINK.description
          that.imgSrc = './static/images/LivenessUI/blink.gif'
        } else if (that.action === 'MOUTH') {
          that.description = that.livenessAssets.MOUTH.description
          that.imgSrc = './static/images/LivenessUI/mouth.gif'
        } else if (that.action === 'YAW') {
          that.description = that.livenessAssets.YAW.description
          that.imgSrc = './static/images/LivenessUI/yaw.gif'
        } else if (that.action === 'NOD') {
          that.description = that.livenessAssets.NOD.description
          that.imgSrc = './static/images/LivenessUI/nod.gif'
        } else { // action 设置出错
          that.description = that.livenessAssets.BLINK.description
          that.imgSrc = './static/images/LivenessUI/blink.gif'
        }
      },
      checkFile(e) {
        let that = this
        // that.show = false
        // that.$emit('update:show', false)
        that.$emit('change', false) // 触发 show 变化
        const files = e.target.files
        if (files.length > 0) {
          const file = files[0]
          if (file.size > that.fileSize) {
            that.$emit('onError', {code: '01', msg: `视频大小不能超过${that.sizeText}`})
            return false
          }
          const formData = new FormData()
          formData.append('motions', that.action)
          formData.append('applySerialNo', that.$store.state.applySerialNo)
          formData.append('inputStream', file)
          that.inputUpload(formData)
        }
      },
      inputUpload(formData) {
        let that = this
        that.showLoading = true
        // http://10.35.60.14:3000/api/uploadFiles/excel
        // http://192.168.2.3:3000/api/uploadFiles/excel
        // /wuzhu/liveness/checkLiveness
        that.$http.post('/wuzhu/liveness/checkLiveness', formData).then((res) => {
          that.showLoading = false
          that.$emit('onSuccess', res)
        }).catch((err) => {
          that.showLoading = false
          that.$emit('onError', err)
          console.log(err)
        })
      }
    },
    directives: {
      TransferDom
    },
    components: {
      XDialog
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .liveness-ui{
    position: relative;
    background: #FAF8E6;
  }
  .liveness-ui-dialog {
    .weui-dialog{
      max-width: 335px;
      width: 90%;
      border-radius: 10px;
      .liveness-modal{
        width: 100%;
        max-width: 100%;
        background-color: #2f2f2f;
        // border-radius: 10px;
        box-shadow: 0 10px 28px rgba(0, 0, 0, .95), inset 0 1px 0 rgba(81, 81, 81, .5);
        text-align: center;
        color: #fff;
        font-size: 18px;
        display: block;
        .modal-body{
          .sample{
            .sample-inner{
              .gif-container{
                img{
                  width: 100%;
                  height: 100%;
                  vertical-align: middle;
                }
              }
            }
          }
          .fs-btn{
            position: relative;
            .fs-label{
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0px;
              top: 0px;
              z-index: 998;
            }
          }
        }
      }
    }
  }
  .liveness-ui-loading {
    .weui-dialog{
      width: auto;
      max-width: auto;
      border-radius: 10px;
      background-color: #2f2f2f;
      box-shadow: 0 10px 28px rgba(0, 0, 0, .95), inset 0 1px 0 rgba(81, 81, 81, .5);
      .loading-modal{
        display: block;
        text-align: center;
        color: #fff;
        font-size: 18px;
        .modal-body{
          .gif-container{
            img{
              width: 100%;
              height: 100%;
              vertical-align: middle;
            }
          }
        }
      }
    }
  }
</style>
