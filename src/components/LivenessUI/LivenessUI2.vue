<template>
  <div class="liveness-ui2">
    <div class="liveness-img"></div>
    <div class="liveness-txt">
      <div>录制不超过 <span class="txt-yellow">{{ fileTime }}s</span> 的视频</div>
      <div>拍摄视频时请 <span class="txt-yellow">{{ description }}</span></div>
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
      // let that = this
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
  @import "./../../common/less/index";
  .liveness-ui2{
    width: 100%;
    height: 284px;
    padding-top: 36px;
    .liveness-img{
      width: 182px;
      height: 182px;
      margin: auto;
      .bg("~./Rectangle2");
    }
    .liveness-txt{
      font-family: PingFangSC-Medium;
      text-align: center;
      padding-top: 12px;
      font-size: 18px;
      color: #262626;
      .txt-yellow{
        color: #FDD301;
      }
    }
  }
</style>
