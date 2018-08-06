<template>
  <div class="credit">
    <section class="text-msg" >
      完成信用授权，有助于提升您的信用免押评估。<br>新用户，建议选择手机运营商授权。
    </section>
    <group title="">
      <cell @click.native="bindJD" class="cell_info" title="" is-link >
        <div class="cell_info">
          <div class="cellContent">
            <div class="imageDiv">
              <img class="imageDivImage" src="./JDlogo.png" srcset="./JDlogo.png 1x, ./JDlogo@2x.png 2x"/>
            </div>
            <div class="infoPlane">
              <div class="infoPlaneDiv">
                <span class="creditName">京东小白信用</span>
                <span class="creditTips">提升信用</span>
              </div>
              <div>
                <span class="creditDesc">已开通京东小白推荐</span>
              </div>
            </div>
            <div class="creditStatus">
                {{jdCreditDesc}}
            </div>
          </div>
        </div>
      </cell>
      <cell @click.native="bindMX" class="cell_info" title="" is-link>
        <div class="cell_info">
          <div class="cellContent">
            <div class="imageDiv">
              <img class="imageDivImage" src="./MXlogo.png" srcset="./MXlogo.png 1x, ./MXlogo@2x.png 2x"/>
            </div>
            <div class="infoPlane">
              <div class="infoPlaneDiv">
                <span class="creditName">手机运营商授权</span>
              </div>
              <div>
                <span class="creditDescRed">新用户推荐</span>
              </div>
            </div>
            <div class="creditStatus">
                {{mxCreditDesc}}
            </div>
          </div>
        </div>
      </cell>
    </group>
  </div>
</template>
<script type="text/ecmascript-6">
  import { XInput, Group, XButton, Cell } from 'vux'
  import Config from './../../util/config'
  import { getRequest } from './../../util/utils'
  import Vue from 'vue'
  export default {
    data() {
      return {
        openid: null,
        pageName: '',
        accountStatus: this.$store.state.accountStatus,
        JDaccessToken: localStorage.getItem('JDaccessToken') || null,
        jdIsCredited: false,  // 京东小白是否已授权
        jdCreditDesc: '未授权',
        mxIsCredited: false,   // 魔蝎是否已授权
        mxCreditDesc: '未授权',
        mxApplyUrl: '', // 魔蝎授权url
        mxTaskId: '', // 魔蝎授权任务ID
        mxBackParam: '',  // 魔蝎授权返回的参数
        startMxCredit: false, // 是否开始魔蝎授权
        startJdCredit: false,  // 是否开始京东授权
        handleType: 'FIRST' // 当前操作步骤，首次FIRST，京东授权JD，魔蝎授权FBK
      }
    },
    created() {
      let that = this
      console.log('created href = ' + window.location.href)
      that.handleType = 'FIRST'
      // that.pageName = window.location.href
      that.pageName = 'https://' + window.location.host + '/dist/#/Credit/Credit'
      console.log('created that.pageName = ' + that.pageName)
      sessionStorage.setItem('xiaobaoPageName', that.pageName)
      that.startMxCredit = sessionStorage.getItem('startMxCredit')
      console.log('created startMxCredit = ' + that.startMxCredit)
      if (that.startMxCredit === 'true') {
        sessionStorage.setItem('startMxCredit', '')
        that.getMXBackParams()
        that.handleType = 'FBK'
      }
      that.startJdCredit = sessionStorage.getItem('startJdCredit')
      console.log('created startJdCredit = ' + that.startJdCredit)
      if (that.startJdCredit === 'true') {
        sessionStorage.setItem('startJdCredit', '')
        that.handleType = 'JD'
      }
      // 如果是魔蝎授权回调并且不是用户取消的情况下，延迟30秒请求后台
      that.$store.commit('updateLoadingStatus', {isLoading: true})
      if (that.handleType === 'FBK' && that.mxTaskId !== '9999') {
        setTimeout(() => {
          that.checkJDXBCreditAndMOXStatus()
        }, 30000);
      } else {
        that.checkJDXBCreditAndMOXStatus()
      }
    },
    methods: {
      goNext() {
        this.$router.push({name: 'LivenessVerify'})
      },
      checkJDXBCreditAndMOXStatus() {
        // CheckJDXBAndMXResponse {
        // jdCode (string, optional): 京东小白返回code ,
        // jdMsg (string, optional): 京东小白返回信息 ,
        // jdStatus (string, optional): 京东小白状态：Y=获取成功；N=失败；P=过期 ,
        // mxApplyUrl (string, optional): 魔蝎认证地址 ,
        // mxCode (string, optional): 魔蝎返回code ,
        // mxMsg (string, optional): 魔蝎返回信息 ,
        // mxStatus (string, optional): 魔蝎状态：Y=获取成功；F=失败；N=未授权; P=过期,
        // openid (string, optional): 京东openId ,
        // xbScore (number, optional): 京东小百分
        // }
        let that = this
        let params = {
          channelNo: that.$store.state.channelNo,
          accessToken: that.JDaccessToken,
          handleType: that.handleType,
          remark: that.mxBackParam,
          taskId: that.mxTaskId
        }
        console.log('checkJDXBCreditAndMOXStatus params = ' + JSON.stringify(params))
        that.$http.get('/wuzhu/reservationController/checkJDXBCreditAndMOXStatus', params).then(res => {
          that.$store.commit('updateLoadingStatus', {isLoading: false})
          console.log('checkJDXBCreditAndMOXStatus res = ' + JSON.stringify(res))
          if (res && res.code === '00' && res.data) {
            let resData = res.data
            let jdStatus = resData.jdStatus
            let mxApplyUrl = resData.mxApplyUrl
            // let mxCode = resData.mxCode
            // let mxMsg = resData.mxMsg
            let mxStatus = resData.mxStatus
            if (jdStatus === 'Y') {
              that.jdIsCredited = true
              that.jdCreditDesc = '已授权'
            } else if (jdStatus === 'P') {
              that.jdCreditDesc = '已过期'
            } else {
              that.jdCreditDesc = '未授权'
            }
            if (mxStatus === 'Y') {
              that.mxIsCredited = true
              that.mxCreditDesc = '已授权'
            } else if (mxStatus === 'P') {
              that.mxCreditDesc = '已过期'
            } else {
              that.mxCreditDesc = '未授权'
            }
            that.mxApplyUrl = mxApplyUrl
            // 在session中保存openid，在JDCredit.vue中解绑小白时使用
            sessionStorage.setItem('JDOpenid', resData.openid)
            that.$store.commit('xiaobaiScoresMemory', {xiaobaiScores: resData.xbScore})
            // 通过渠道判断是否需要跳转
            let page = localStorage.getItem('origin')
            if (Object.is(page, 'GoodsDetailPage')) {
              // 京东渠道必须同时授权小白和魔蝎
              if (that.$store.state.channelNo === '003') {
                if (that.jdIsCredited && that.mxIsCredited) {
                  that.$vux.toast.show({
                    text: '授权成功',
                    isShowMask: true,
                    onHide() {
                      that.goNext()
                    }
                  });
                }
              } else {
                // 微信等渠道只需其一
                if (that.jdIsCredited || that.mxIsCredited) {
                  that.$vux.toast.show({
                    text: '授权成功',
                    isShowMask: true,
                    onHide() {
                      that.goNext()
                    }
                  });
                }
              }
            } else {
              if (mxStatus !== 'Y' && that.handleType === 'FBK') {
                Vue.$vux.alert.show({
                  title: '授权失败',
                  content: resData.mxMsg
                })
              }
            }
          } else {
            window.localStorage.setItem('JDaccessToken', null)
            Vue.$vux.alert.show({
              content: res && res.msg
            })
          }
        })
      },
      bindJD() {
        let that = this
        if (that.jdIsCredited) {
          that.$router.push({name: 'JDCredit'})
        } else {
          if (!Object.is(that.accountStatus, '正常')) {
            Vue.$vux.alert.show({
              content: `请先通过身份信息认证`,
              onHide() {
                that.$store.commit('ID_INFO_BTN_STATE', {IDInfoBtnState: 'save'})
                that.$router.push({name: 'IDverify'})
              }
            })
          } else {
            sessionStorage.setItem('startJdCredit', 'true')
            window.location.href = Config.xiaoBaiUrl + '&callBack=' + that.pageName
          }
        }
      },
      bindMX() {
        let that = this
        if (that.mxIsCredited) {
          console.log('bindMX mxIsCredited')
        } else {
          if (!Object.is(that.accountStatus, '正常')) {
            Vue.$vux.alert.show({
              content: '请先通过身份信息认证',
              onHide() {
                that.$store.commit('ID_INFO_BTN_STATE', {IDInfoBtnState: 'save'})
                that.$router.push({name: 'IDverify'})
              }
            })
          } else {
            if (that.mxApplyUrl) {
              sessionStorage.setItem('startMxCredit', 'true')
              // that.mxApplyUrl = 'https://api.51datakey.com/h5/importV3/index.html#/carrier?apiKey=7c91bb6f653d4fd885c14e69aefa0da8&userId=201805021244481&loginParams={"phone":"13689527870","idcard":"420322198306010033","name":"韩峰"}&showTitleBar=NO&quitOnLoginDone=YES&quitOnFail=YES&backUrl=http://10.35.40.167:8090/wuzhu/dist/#/Credit/Credit'
              window.location.href = that.mxApplyUrl
            } else {
              Vue.$vux.alert.show({
                content: '获取运营商授权地址异常'
              })
            }
          }
        }
      },
      getMXBackParams() {
        // 从URL中获取魔蝎返回的参数
        // mxcode	－	当配置了backUrl，自动跳转到该backUrl时，添加该参数到backUrl上
        // -4 用户输入出错（密码等输错且未继续输入）
        // -3 魔蝎数据服务异常
        // -2 平台方服务问题（如中国移动维护等）
        // -1 默认状态（用于没有进行操作退出）
        // 0 认证失败，异常错误
        // 1 任务进行成功
        // 2 任务进行中
        // taskId	－	当配置了backUrl，自动跳转到该backUrl时，添加该参数到backUrl上，用于查询用户授权数据
        // taskType	－	当配置了backUrl，自动跳转到该backUrl时，添加该参数到backUrl上，用于查看任务类型
        // account	－	当配置了backUrl，自动跳转到该backUrl时，添加该参数到backUrl上，用于查看用户名
        // userId	－	当配置了backUrl，自动跳转到该backUrl时，添加该参数到backUrl上，用于查看用户ID
        // message	－	当配置了backUrl，自动跳转到该backUrl时，添加该参数到backUrl上，用于查看返回信息
        // loginDone	－	当配置了backUrl，自动跳转到该backUrl时，添加该参数到backUrl上，用于查看是否登录成功 1 成功 0 失败
        console.log('getMXBackParams href = ' + window.location.href)
        let mxcode = getRequest('mxcode')
        let taskId = getRequest('taskId')
        let taskType = getRequest('taskType')
        let account = getRequest('account')
        let userId = getRequest('userId')
        let message = getRequest('message')
        let loginDone = getRequest('loginDone')
        if (!message) {
          message = '用户取消授权'
        }
        if (!taskId) {
          taskId = '9999'
        }
        console.log('getMXBackParams mxcode=' + mxcode + ',taskId=' + taskId + ',taskType=' + taskType +
        ',account=' + account + ',userId=' + userId + ',message=' + message + ',loginDone=' + loginDone)
        this.mxTaskId = taskId
        // this.mxBackParam = encodeURIComponent('mxcode=' + mxcode + '&taskId=' + taskId + '&taskType=' + taskType + '&account=' + account +
        // '&userId=' + userId + '&message=' + message + '&loginDone=' + loginDone)
        this.mxBackParam = 'mxcode=' + mxcode + '&taskId=' + taskId + '&taskType=' + taskType + '&account=' + account +
        '&userId=' + userId + '&message=' + message + '&loginDone=' + loginDone
        console.log('getMXBackParams mxBackParam = ' + this.mxBackParam)
      }
    },
    components: {
      XInput,
      Group,
      XButton,
      Cell
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../common/less/index.less';
  .credit /deep/ .weui-cells {
    margin-top: 0!important;
    .weui-cell {
      padding: 2px 15px;
    }
    .weui-cell__ft{
      width:100%;
    }
    .weui-cell_access .weui-cell__ft:after{
      height: 9px;
      width: 9px;
    }
  }
  .credit{
    height: 100%;
    box-sizing: border-box;
    background: @bg;
    .text-msg{
      font-family: PingFangSC-Regular;
      font-size: 14px;
      line-height: 20px;
      padding: 15px;
      color: #888888;
    }
    .cell_info{
      // margin: 0px 15px;
      font-size:14px;
      .cellContent{
        width:100%;
        text-align: left;
        padding: 15px 0px;
        display: flex;
        justify-content: flex-start;
        .imageDiv{
          margin-right: 15px;
          .imageDivImage{
            border-radius: 3px;
            width: 46px;
            height: 46px;
            vertical-align: middle;
          }
        }
        .infoPlane{
          .infoPlaneDiv{
            margin-bottom: 6px;
          }
          .creditName{
            font-size:16px;
            font-weight: bold;
            font-family: PingFangSC-Medium;
            color:#222222;
            line-height:22px;
          }
          .creditTips{
            color:#FF4754;
            font-size:13px;
            padding: 1px;
            border-radius:3px;
            border: 1px solid #FF4754
          }
          .creditDesc{
            font-size:12px;
            font-family: PingFangSC-Regular;
            color:#555555;
            line-height:17px;
          }
          .creditDescRed{
            font-size:12px;
            font-family: PingFangSC-Regular;
            color:#F5222D;
            line-height:17px;
          }
        }
        .creditStatus{
          color: #888888;
          position: absolute;
          top: 50%;
          margin-top: -7px;
          right: 17px;
        }
      }
    }
  }
</style>
