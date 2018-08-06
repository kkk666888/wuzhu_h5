<template>
	<div class="IDverify">
		<div class="d_id_box">
			<p class="p_img_info">请上传您本人的有效证件</p>
			<flexbox class="fb_box" :gutter="0">
				<flexbox-item>
					<div class="f_item f_item-1">
            <img class="id-img" :src="imgUrl0.localId">
            <label for="uploadImage" class="upload-input"></label>
            <input :disabled="isCheckCustomer" ref="uploadImage" id="uploadImage" name="uploadImage" type="file" accept="image/*" capture="camera" style="display: none;">
						<p class="img_tips">身份证人像面</p>
					</div>
				</flexbox-item>
				<flexbox-item>
					<div class="f_item f_item-2">
            <img class="id-img" :src="imgUrl1.localId">
            <label for="uploadImage2" class="upload-input"></label>
            <input :disabled="isCheckCustomer" ref="uploadImage2" id="uploadImage2" name="uploadImage2" type="file" accept="image/*" capture="camera" style="display: none;">
						<p class="img_tips">身份证国徽面</p>
					</div>
				</flexbox-item>
			</flexbox>
			<p class="img_bottom_tips">请保持照片清晰可辨，并按照指引获取您本人的学信网在线验证码。身份信息一旦认证成功，将不可更改。资料严格保密，仅用于平台认证。</p>
		</div>
    <div class="padding-line"></div>
		<!-- <div ref="ceshi" name="ceshi">测试记得删掉</div> -->
		<div class="id_info">
     	<group class="id_group" label-width="8em" label-margin-right="2em" label-align="right">
			 	<x-input v-if="!isCheckCustomer" class="xi_info" title="姓名" placeholder="请输入" v-model="ocrMsg.name" @on-blur="inputNameChange"></x-input>
        <x-input v-else class="xi_info" title="姓名" placeholder="请输入" :disabled="true" v-model="ocrMsgShow.name"></x-input>
			 	<x-input v-if="!isCheckCustomer" class="xi_info" title="身份证号" placeholder="请输入" v-model="ocrMsg.number" @on-blur="inputMsgChange"></x-input>
        <x-input v-else class="xi_info" title="身份证号" placeholder="请输入" :disabled="true" v-model="ocrMsgShow.number"></x-input>
			 	<x-input v-if="showChsi" class="xi_info" title="学信网验证" placeholder="请输入验证码" :disabled="isCheckEducation" v-model="Chsi" @on-blur="inputChsiChange">
			 		<p class="p_guide" slot="right" @click="getChsiGuide">
            <span>
              <u>获取指引</u>
            </span>
			 		</p>
			 	</x-input>
		 	</group>
		</div>
    <div class="fs-box-next">
      <x-button v-show="btnState === 'next'" @click.native="goNext">下一步</x-button>
      <x-button v-show="btnState === 'save'" :class="(isCheckCustomer && (isCheckEducation || !showChsi))?'fs-gray fs-display-none':''" :disabled="(isCheckCustomer && isCheckEducation)" @click.native="saveID">认 证</x-button>
      <div v-show="btnState === 'save'" :class="(isCheckCustomer && (isCheckEducation || !showChsi))?'warming-txt':'fs-display-none'">您的身份信息已验证通过，平台将根据协议约定严格保密</div>
      <div :class="(showChsi && isCheckCustomer && !isCheckEducation)?'warming-txt':'fs-display-none'">学信网在线验证码与您本人身份信息不匹配，请检查</div>
    </div>
    <section>
      <div class="fs-dialog">
        <fee-desc-alert :dialogTitle="dialogTitle" :potocol-type="true" :showScrollBox="showScrollBox" @sureBtnClick="getChsiGuide">
          <div slot="htmlPocotol">
            <!-- <div>学信网在线验证码获取指引</div> -->
            <div style="text-align: left;text-indent: 1.5em;">学信网在线验证码仅用于验证您的身份信息，平台根据客户协议严格保密您的所有信息资料。</div>
            <ul style="text-align: left;text-indent: 1.5em;">
              <li>Step1 复制https://my.chsi.com.cn/archive/index.jsp并在手机浏览器中打开学信档案的登陆/注册页面；</li>
              <li>如已有账号选择登陆：如忘记用户名可找回用户名，忘记密码可选择忘记密码；</li>
              <li>如未有账号选择注册：按照相应步骤进行新用户的注册。</li>
              <li>Step2 登陆后，选择查看或申请学信网在线验证报告；</li>
              <li>Step3 未申请过学信网在线验证码客户申请中文版在线验证报告；</li>
              <li>已有学信网在线验证码客户：检查状态为“有效”则将该验证码填入，检查状态为“失效”则需要将在线验证码延期。</li>
              <li>Step4 将12位在有效期内的学信网在线验证码输入到物主。</li>
            </ul>
            <div style="text-align: left;text-indent: 1.5em;">如未有验证码则按照提示进行申请，如已有验证码请确保验证码状态为有效，如失效则申请延期。</div>
          </div>
        </fee-desc-alert>
      </div>
    </section>
	</div>
</template>

<script>
  import { XImg, Flexbox, FlexboxItem, XHeader, Group, XInput, XButton } from 'vux'
  import feeDescAlert from './../FeeItemSubView/FeeDescAlert'
  import { compressImg } from './../../util/utils'
  export default {
    name: 'IDverify',
    data() {
      return {
        flatBtnCtrl: true,
        brisk: { // 埋点报文
          edittimes: [
            {
              type: 'uploads', // OCR正面成功次数
              times: 0
            },
            {
              type: 'uploadf', // OCR正面失败次数
              times: 0
            },
            {
              type: 'upload2s', // OCR反面成功次数
              times: 0
            },
            {
              type: 'upload2f', // OCR反面失败次数
              times: 0
            },
            {
              type: 'name', // 姓名修改次数
              times: 0
            },
            {
              type: 'no', // 身份证号码修改次数
              times: 0
            },
            {
              type: 'code', // 学信网在线验证码修改次数
              times: 0
            }
          ]
        },
        dialogTitle: '学信网在线验证码获取指引',
        showScrollBox: false,
        dialogContent: '',
      	nextPage: 'HomePage', // 在 beforeRouteEnter 中赋值
        resEducation: {}, // 查询到的信息
        resCustomer: {}, // 查询到的信息
        frontDatas: {},
        backDatas: {},
        imgOrder: 0, // 0 身份证正面，1
        isNotOcrDeal: false,
        isCheckCustomer: this.$store.state.ocrMsgCheck.isCheckCustomer, // 客户身份信息校验
        isCheckEducation: this.$store.state.ocrMsgCheck.isCheckEducation, // 客户学信信息校验
      	ocrMsg: {
      		name: '',
      		number: '' // 身份证号码
      	},
        ocrMsgShow: {
          name: '',
          number: ''
        },
      	Chsi: '', // 学信网在线验证码
        applySerialNo: '',
        accountStatus: '', // OK 代表校验通过
      	jsApiList: [
          'checkJsApi',
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage'
        ],
        btnState: this.$store.state.IDInfoBtnState,
        imgUrl0: {
          localId: './static/images/OrderSet/IDCard_front@1.5x.png',
          imageName: '',
          serverId: ''
        },
        imgUrl1: {
          localId: './static/images/OrderSet/IDCard_back@1.5x.png',
          imageName: '',
          serverId: ''
        },
        showChsi: true
      }
    },
    watch: {
      'ocrMsg.number': function(val, oldval) {
        val = String(val)
        let newVal = ''
        if (val.length > 8) {
          newVal += val.substr(0, 4)
          newVal += ' **** **** '
          newVal += val.substr(val.length - 4, val.length - 1)
          this.ocrMsgShow.number = newVal
        }
        return val
      },
      'ocrMsg.name': function(val, oldval) {
        val = String(val)
        let newVal = ''
        if (val) {
          val.split('').map(function(item, index, array) {
            if (index === 0) {
              newVal += item
            } else {
              newVal += '*'
            }
          })
          this.ocrMsgShow.name = newVal
        }
        return val
      },
      Chsi: function(val, oldval) {
        val = String(val)
        if (val && this.showChsi && this.isCheckCustomer && this.isCheckEducation) {
          let newVal = ''
          newVal += val.substr(0, 2)
          newVal += '********'
          newVal += val.substr(val.length - 2)
          this.Chsi = newVal
        }
        return val
      }
    },
    created() {
      // 京东渠道去掉学信网验证码
      if (this.$store.state.channelNo === '003') {
        this.showChsi = false
      }
      this.$store.commit('updateLoadingStatus', {isLoading: true})
      this.queryCustomerInfoAndEd()
    },
    mounted: function() {
      let that = this
      this.$reporter.init() // 埋点初始化
      that.$refs.uploadImage.addEventListener('change', function(e) {
        that.imgOrder = 0
        that.inputUpload(e, 0)
      }, false)
      that.$refs.uploadImage2.addEventListener('change', function(e) {
        that.imgOrder = 1
        that.inputUpload(e, 1)
      }, false)
    },
    methods: {
      testtest() {
        this.$reporter.dataReport(this.brisk)
      },
      inputNameChange() {
        this.brisk.edittimes[4].times++
      },
      inputMsgChange() {
        this.brisk.edittimes[5].times++
      },
      inputChsiChange() {
        this.brisk.edittimes[6].times++
      },
      getChsiGuide() {
        console.log('>>> getChsiGuide')
        let that = this
        that.showScrollBox = !that.showScrollBox
      },
    	// 检查 身份证名字 -- 没有做全角半角校验
    	checkIDCardName(name) {
    		let that = this
    		let reg = /^[\u2E80-\uFE4F·]{2,12}$/i
        let result = reg.test(name)
		    if (!result) {
		      that.$vux.alert.show({
            title: '身份信息错误',
            content: '请输入正确的姓名与身份证号码'
          })
		    }
        return result
    	},
    	// 检查 身份证
    	checkIDCard(card) {
    		let that = this
    		// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
			  let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        let result = reg.test(card)
			  if (result === false) {
			    that.$vux.alert.show({
            title: '身份信息错误',
            content: '请输入正确的姓名与身份证号码'
          })
			  }
        return result
    	},
    	// 检查 学信网
    	checkChsi(Chsi) {
    		let that = this
        // 在 京东app 中，且用户没有填 学信网验证码
        if (that.$store.state.channelNo === '003') {
          return true
        }
    		// 12位 数字+字母
    		// let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{12}$/
        // 12位 数字 或 字母
        let reg = /^[A-Za-z0-9]{12}$/
        let result = reg.test(Chsi)
    		if (result === false) {
			    that.$vux.alert.show({
            title: '学信网验证码错误',
            content: '请输入正确的学信网验证码'
          })
			  }
        return result
    	},
    	// OCR 识别
    	checkOCRIDCard(side, opt) {
        let that = this
        that.$http.get('/wuzhu/reservationController/checkOCRIDCard', {
          applySerialNo: that.$store.state.applySerialNo, // 后台定义
          filePath: opt.filePath,
          imageName: opt.imageName,
          side: side || 'front' // front or back
        }).then((res) => {
          if (res.code === '00') {
          	// that.$refs.ceshi.innerHTML = JSON.stringify(res)
          	if (side === 'front') {
              // OCR 正面成功次数
              that.brisk.edittimes[0].times++
          		that.ocrMsg.name = res.data.name
          		that.ocrMsg.number = res.data.number // 身份证
              // that.$store.commit('ocrMsg', { ocrMsg: that.ocrMsg })
              that.frontDatas = res.data
              that.imgUrl0.serverId = '图片已经上传'
          	} else {
              // OCR 反面成功次数
              that.brisk.edittimes[2].times++
              that.backDatas = res.data
              that.imgUrl1.serverId = '图片已经上传'
            }
          } else {
            if (side === 'front') {
              // OCR 正面失败次数
              that.brisk.edittimes[1].times++
              that.imgUrl0.localId = './static/images/OrderSet/IDCard_front@1.5x.png'
              that.imgUrl0.imageName = ''
              that.imgUrl0.serverId = ''
            } else {
              // OCR 反面失败次数
              that.brisk.edittimes[3].times++
              that.imgUrl1.localId = './static/images/OrderSet/IDCard_back@1.5x.png'
              that.imgUrl1.imageName = ''
              that.imgUrl1.serverId = ''
            }
            that.$vux.alert.show({
              title: '身份证照片识别错误',
              content: res.msg
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      inputUpload(e, order) {
        let that = this
        const files = e.target.files
        if (files.length > 0) {
          const file = files[0]
          if (!that.checkRealFile(file.lastModifiedDate)) {
            that.$vux.alert.show({
              content: '请直接拍摄照片，不可以使用本地照片哦～若无法拍摄照片，请使用京东APP且更新京东App至最新版本。'
            })
            return
          }
          // 加载 loading
          that.$store.state.isLoading = true
          // 压缩图片
          compressImg(file).then(function(resBlob) {
            const formData = new FormData()
            formData.append('file', resBlob, file.name)
            that.$http.post('/wuzhu/common/uploadFile', formData, {}, 300000).then((res) => {
              that.$store.state.isLoading = false
              that.dealUploadRes(order, res) // 处理上传后的 结果
            }).catch((err) => {
              that.$store.state.isLoading = false
              if (!err.response || err.message === 'Network Error') {
                that.$vux.alert.show({
                    title: '上传失败',
                    content: '网络异常，请检查您的网络连接'
                })
              }
              console.log(err)
            })
          }, function(error) { // 报错的话 上传原图
            console.log(error)
            const formData = new FormData()
            formData.append('file', file)
            that.$http.post('/wuzhu/common/uploadFile', formData, {}, 300000).then((res) => {
              that.$store.state.isLoading = false
              that.dealUploadRes(order, res)
            }).catch((err) => {
              that.$store.state.isLoading = false
              if (!err.response || err.message === 'Network Error') {
                that.$vux.alert.show({
                    title: '上传失败',
                    content: '网络异常，请检查您的网络连接'
                })
              }
              console.log(err)
            })
          })
        }
      },
      // 处理上传后的 结果
      dealUploadRes(order, res) {
        let that = this
        that.$store.state.isLoading = false
        if (res.code === '00' && res.data) {
          if (order === 0) {
              // 正面
            that.imgUrl0.localId = res.data.filePath
            that.imgUrl0.imageName = res.data.imageName
            that.checkOCRIDCard('front', { filePath: res.data.filePath, imageName: res.data.imageName })
          } else {
              // 返面
            that.imgUrl1.localId = res.data.filePath
            that.imgUrl1.imageName = res.data.imageName
            that.checkOCRIDCard('back', { filePath: res.data.filePath, imageName: res.data.imageName })
          }
        } else {
          that.$vux.alert.show({
            content: res.msg
          })
        }
      },
      // 向后台 查询数据
      queryCustomerInfoAndEd() {
        let that = this
        that.$http.get('/wuzhu/customerVerController/queryCustomerInfoAndEd', {
        }).then((res) => {
          that.$store.commit('updateLoadingStatus', {isLoading: false})
          if (res.code === '00' && res.data) {
            that.resEducation = res.data.education || {}
            that.resCustomer = res.data.customer || {}
            that.isCheckCustomer = res.data.isCheckCustomer
            that.isCheckEducation = res.data.isCheckEducation
            that.ocrMsg.name = that.resCustomer.customerName
            that.ocrMsg.number = that.resCustomer.certId
            // 身份证验证通过
            if (res.data.isCheckCustomer) {
              that.imgUrl0.localId = './static/images/OrderSet/ID_badge@2x.png'
              that.imgUrl1.localId = './static/images/OrderSet/ID_badge@2x.png'
            }
            // 学信网验证通过后才设置Chsi
            if (that.isCheckEducation) {
              that.Chsi = that.resCustomer.chsiAuthCode
            }
            that.isNotOcrDeal = res.data.isNotOcrDeal
            // "isNotOcrDeal", false);//是否不需要重新进行ocr扫描
            if (that.isNotOcrDeal) { // true 不需要重新扫描
              that.imgUrl0.serverId = '图片已经上传'
              that.imgUrl1.serverId = '图片已经上传'
            } else {
              that.imgUrl0.serverId = ''
              that.imgUrl1.serverId = ''
            }
            that.$store.commit('updateOcrMsg', {
              ocrMsg: {
                name: that.ocrMsg.name,
                number: that.ocrMsg.number, // 身份证号码
                Chsi: that.Chsi
              }
            })
            that.$store.commit('updateOcrMsgCheck', {
              ocrMsgCheck: {
                isCheckCustomer: that.isCheckCustomer, // 客户身份信息校验
                isCheckEducation: that.isCheckEducation // 客户学信信息校验
              }
            })
          } else {
            that.$vux.alert.show({
              content: res.msg
            })
          }
        }).catch((err) => {
          that.$store.commit('updateLoadingStatus', {isLoading: false})
          console.log(err)
        })
      },
      checkIdentityVerification(isNext) {
      	let that = this
        if (!that.imgUrl0.serverId) {
          that.$vux.alert.show({
            content: '请上传正确的身份证人像面照片'
          })
          that.flatBtnCtrl = true
          return false
        }
        if (!that.imgUrl1.serverId) {
          that.$vux.alert.show({
            content: '请上传正确的身份证国徽面照片'
          })
          that.flatBtnCtrl = true
          return false
        }
        let resOCRName = that.checkIDCardName(that.ocrMsg.name)
        if (!resOCRName) { // 检测 ocr 名字
          that.flatBtnCtrl = true
          return false
        }
        let resOCRNum = that.checkIDCard(that.ocrMsg.number)
        if (!resOCRNum) {
          that.flatBtnCtrl = true
          return false
        }
        let resChsi = that.checkChsi(that.Chsi)
        if (!resChsi) {
          that.flatBtnCtrl = true
          return false
        }
        let _birthday = []
        if (that.resCustomer.birthday) {
          _birthday = that.resCustomer.birthday.split('-')
        }
        that.$store.commit('updateLoadingStatus', {isLoading: true})
      	that.$http.get('/wuzhu/customerVerController/checkIdentityVerification', {
          openId: that.$store.state.othersOpenID || that.resCustomer.wechatOpenId,
          channelNo: that.$store.state.channelNo,
          applySerialNo: that.$store.state.applySerialNo || that.resEducation.applySerialNo, // 后台定义
          customerId: that.$store.state.userID || that.resEducation.customerId,
          loginMobile: 'serverId',
          name: that.ocrMsg.name,
          certId: that.ocrMsg.number,
          sex: that.frontDatas.sex || that.resCustomer.sex,
          nation: that.frontDatas.nation || that.resCustomer.nation,
          year: that.frontDatas.year || _birthday[0],
          month: that.frontDatas.month || _birthday[1],
          day: that.frontDatas.day || _birthday[2],
          address: that.frontDatas.address || that.resCustomer.permanentAddr,
          idImgFront: that.imgUrl0.imageName || that.resCustomer.idImgFront,
          idImgBack: that.imgUrl1.imageName || that.resCustomer.idImgBackend,
          authority: that.backDatas.authority || that.resCustomer.signAuthority,
          certDueDate: that.backDatas.timelimit || that.resCustomer.certDueDate, // 到期日
          chsiAuthCode: that.Chsi || that.resCustomer.chsiAuthCode, // 学信网 验证
          recommCode: that.$store.state.recommeCode, // 邀请码 --
          // isNext false 保存 2 入口是个人中心; 1 入口是确认预约
          fromFlag: (isNext ? 1 : 2) // 是否校验 applySerialNo
        }).then((res) => {
          that.$store.commit('updateLoadingStatus', {isLoading: false})
        	console.log(res)
          if (res.code === '00' && res.data) {
            that.applySerialNo = res.data.applySerialNo
            that.accountStatus = res.data.accountStatus
            that.isCheckCustomer = res.data.isCheckCustomer
            that.isCheckEducation = res.data.isCheckEducation
            // true校验通过 false 校验不通过
            // private boolean isCheckCustomer; // 客户身份信息校验
            // private boolean isCheckEducation; // 客户学信信息校验
            if (that.accountStatus === 'OK') {
              that.$store.commit('accountStatusMemory', {accountStatus: '正常'})
            }
            that.$store.commit('updateOcrMsg', {
              ocrMsg: {
                name: that.ocrMsg.name,
                number: that.ocrMsg.number, // 身份证号码
                Chsi: that.Chsi
              }
            })
            that.$store.commit('updateOcrMsgCheck', {
              ocrMsgCheck: {
                isCheckCustomer: that.isCheckCustomer, // 客户身份信息校验
                isCheckEducation: that.isCheckEducation // 客户学信信息校验
              }
            })
            // 埋点数据上报
            that.$reporter.dataReport(that.brisk)
          	if (isNext) { // 跳下一步
              that.$vux.toast.show({
                text: '验证成功',
                isShowMask: true,
                onHide() {
                    that.$router.push({name: 'Credit'}) // 下一步 跳小白
                }
              })
          	} else { // 保存成功后，返回原页面
          		that.$router.push({name: that.nextPage})
          	}
          } else {
            that.$vux.alert.show({
              content: res.msg
            })
            that.flatBtnCtrl = true
          }
        }).catch((err) => {
          that.$store.commit('updateLoadingStatus', {isLoading: false})
          that.flatBtnCtrl = true
          if (!err.response || err.message === 'Network Error') {
            that.$vux.alert.show({
                title: '认证失败',
                content: '网络异常，请检查您的网络连接'
            })
          } else {
            that.$vux.alert.show({
              content: '身份验证异常，请稍后再试'
            })
          }
          console.log(err)
        })
      },
      goNext() {
        // 如果已经校验通过了, 直接跳到 小白
        if (this.isCheckCustomer && this.isCheckEducation) {
          this.$router.push({name: 'Credit'}) // 下一步 跳小白
          return false
        }
        // 把信息上传后台 -- 控制只让 用户点一次
        if (this.flatBtnCtrl) {
          this.flatBtnCtrl = false
          this.checkIdentityVerification(true)
        }
      },
      saveID() {
      	let that = this
      	console.log('saveID')
      	console.log(that.nextPage)
        if (this.flatBtnCtrl) {
          this.flatBtnCtrl = false
          that.checkIdentityVerification(false)
        }
      },
      // 京东渠道，Android手机，通过file.lastModifiedDate判断是否是实时拍摄的照片，15秒内的视为有效照片
      checkRealFile(lastModifiedDate) {
        if (lastModifiedDate && this.$store.state.channelNo === '003' && this.$store.state.osinfo === 'Android') {
          console.log('checkRealFile nowDate = ' + new Date() + ', lastModifiedDate = ' + lastModifiedDate);
          let nowTime = new Date().getTime();
          let fileTime = lastModifiedDate.getTime();
          console.log('checkRealFile nowTime = ' + nowTime + ', fileTime = ' + fileTime);
          if (fileTime && fileTime <= nowTime && fileTime + 15000 >= nowTime) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
		    vm.nextPage = from.name
        localStorage.setItem('origin', from.name)
		  })
    },
    components: {
      feeDescAlert,
      XImg,
      XButton,
      Flexbox,
      FlexboxItem,
      XHeader,
      Group,
      XInput
    }
  }
</script>

<style lang="less">
  @import "./../../common/less/index";
	.IDverify {
    height: 100%;
    background: #F5F5F5;
    font-family: PingFangSC-Medium;
    .d_title {
			margin-top: 14px;
			.i_back {
				float: left;
				margin-left: 15px;
			}
			.d_title_info {
				position: absolute;
				width: 100%;
				text-align: center;
				float: left;
				.p_title {
					font-size: 19px;
					color: #222222;
				}
			}
		}
		.d_id_box {
      padding:0 18px;
      background: #fff;
			.p_img_info {
	      font-size: 16px;
	      color: #000000;
	      letter-spacing: 0;
            padding: 16px 8px;
            font-weight: bold;
			}
			.fb_box {
				.f_item{
          position: relative;
          &.f_item-1{
            text-align: right;
            margin-right: 4px;
          }
          &.f_item-2{
            text-align: left;
            margin-left: 4px;
          }
          .img-mask{
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: 9999;
          }
          .upload-input{
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 998;
            left: 0px;
            top: 0px;
            // visibility: hidden;
          }
          .id-img {
            border-radius: 8px;
            width: 100%;
            height: 100px;
            // -moz-box-shadow:2px 2px 2px #333333;
            // -webkit-box-shadow:2px 2px 2px #333333;
            // box-shadow:2px 2px 2px #333333;
          }
					.img_tips {
						margin-top: 10px;
						font-family: PingFangSC-Regular;
		        font-size: 12px;
		        color: #333333;
		        letter-spacing: 0;
		        text-align: center;
		        line-height: 20px;
					}
				}
			}
			.img_bottom_tips {
				margin-top: 12px;
				font-family: PingFangSC-Regular;
	      font-size: 14px;
	      color: #BBBBBB;
	      letter-spacing: 0;
	      line-height: 20px;
        padding-bottom: 13px;
			}
		}
    .padding-line {
      height: 20px;
      width: 100%;
    }
		.id_info {
      background: #fff;
      .id_group {
        .vux-no-group-title {
          margin-top: 0 !important;
          &::before {
            border-top: 0;
          }
          &:last-child {
            &:after {
              border-bottom: 0;
            }
          }
        }
	    	.xi_info {
  	      height: 30px;
  	      font-size: 14px;
          .weui-cell__hd{
            .weui-label{
              word-wrap: unset;
              word-break: unset;
              white-space: nowrap;
              margin-right: 0em!important;
              text-align: left !important;
            }
          }
          .weui-cell__bd{
            margin-right: 5px;
          }
          .weui-cell__ft{
            .p_guide{
              margin-right: 5px;
              font-size: 13px;
              color: #FFC400;
            }
            i.weui-icon{
              position: absolute;
              right: 0px;
              top: 50%;
              margin-top: -8px;
            }
          }
        }
      }
		}
		.box_next {
			margin-top: 45px;
			margin-left: 22px;
			margin-right: 22px;
			height: 45px;
			background: #FFDA29;
      border-radius: 50px;
      text-align: center;
		}
    .fs-display-none{
      display: none;
    }
    .fs-box-next{
      margin-top: 16px;
      height: 45px;
      padding:0 18px;
      .weui-btn_default{
        background: #FFDA29;
        color: #222222;
        &:after {
          border: 0;
        }
      }
      .warming-txt{
        color: #c9302c;
        font-size: 14px;
      }
    }
    .weui-cell:before {
      border-top: 1px solid #ddd;
    }

    @media screen and (max-width: 320px) {
      .d_id_box{
        padding: 0 5px;
        padding-top: 36px;
        .fb_box{
          .f_item{
            .id-img{
              width: 150px;
            }
            &.f_item-1{
              margin-right: 2px;
            }
            &.f_item-2{
              margin-left: 2px;
            }
          }
        }
      }
    }
    // 大于 400px
    @media screen and (min-width: 400px) {
      .d_id_box{
        .fb_box{
          .f_item{
            &.f_item-1{
              text-align: center;
              margin-right: 8px;
            }
            &.f_item-2{
              text-align: center;
              margin-left: 8px;
            }
          }
        }
      }
    }
	}
</style>
