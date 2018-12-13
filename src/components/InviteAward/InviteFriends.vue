<template>
  <div class="InviteFriends">
    <!--头部部分UI-->
    <div class="headerPlane">
      <div class="topColor">
        <div class="colorBlockBack"></div>
        <div class="colorBlockFont"></div>
        <span class="topIcon">
        </span>
        <span class="topName">{{ customerName }}</span>
      </div>
      <div class="qrPlane">
        <div class="qrPic">
          <div id="qrcode" style="width:150px; height:150px;"></div>
        </div>
        <div class="detailDiv">
          <div>
            累计邀请<span style="color:#FFD600">{{ recommNum }}</span>人
          </div>
          <div>
            累计成功下单<span style="color:#FF2A3E">{{ recommApplyNum }}</span>
          </div>
          <div>
            当月邀请<span style="color:#FFD600">{{ monthRecomeNum }}</span>人
          </div>
          <div>
            当月成功下单<span style="color:#FF2A3E">{{ monthApplyNum }}</span>
          </div>
        </div>
      </div>
    </div>
    <!--中间的按钮部分-->
    <div class="ButtonPlane">
      <x-button @click.native="saveImagePic">保存二维码</x-button>
    </div>
    <!--规则说明-->
    <div class="rulePlane">
      <!--标题-->
      <div class="ruleTitle">规则说明</div>
      <div class="ruleContent">
        1、	邀请人数：扫描本人专属二维码扫码进入公众号完成注册与实名认证的客户数：
      累计邀请人数是从注册到查看前一天所有的成功邀请人数；
      当月邀请人数是从本月新发生截止到查看前一天所有的成功邀请人数。
      <br>
      2、	成功下单数：通过本人专属二维码扫码进入公众号，完成挑选商品、下单，最终支付完成、收到货品并进入租赁期的有效订单数：
      累计成功下单数是从注册到查看前一天所有成功转为租赁中的租赁订单数；
      当月成功下单数是当月新发生到查看前一天所有订单状态为租赁中的订单数。
      </div>
    </div>
     <!--Toast展示对应的结果-->
    <toast v-model="showToast" type="text" width="20em">{{ toastContent }}</toast>
  </div>
</template>

<script>
  import { XButton, Toast } from 'vux'
  import Config from '../../util/config'
    export default {
      name: 'InviteFriends',
      components: {
        XButton,
        Toast
      },
      data() {
        return {
          recommNum: '0',
          recommApplyNum: '0',
          monthRecomeNum: '0',
          monthApplyNum: '0',
          recommCode: '', // 邀请码
          qrcode: {}, // 用户产生二维码的对象
          customerName: '',
          qrStr: '',
          showToast: false
        }
      },
      created() {
        let that = this
        that.$store.commit('updateLoadingStatus', { isLoading: true })
        // let param = {
        //   openId: '001',
        //   channelNo: '001',
        //   categoryCode: '001'
        // }
        let param = {
          // customerId: ''
        }
        let getInfoUrl = '/wuzhu/invite/getInviteInfo'
        that.$http.get(getInfoUrl, param).then((res) => {
          that.$store.commit('updateLoadingStatus', { isLoading: false })
          console.log('==============' + JSON.stringify(res))
          if (res.code === '00' && res.data) {
            console.log('获取用户的提现信息')
            let data = res.data
            that.recommNum = data.recommNum || 0
            that.recommApplyNum = data.recommApplyNum || 0
            that.monthRecomeNum = data.monthRecomeNum || 0
            that.monthApplyNum = data.monthApplyNum || 0
            that.recommCode = data.recommCode
            that.customerName = data.customerName
            // 京东渠道的二维码
            if (that.$store.state.channelNo === '003') {
              let jdmUrl = Config.jdMiddlePage // 'https://opencredit.jd.com/resources/html/oauth2/user/app/index.html?merchantCode=74871465'
              let cbUrl = window.location.href.split('/dist')[0] + '/dist/index.html?channelNo=003&recommCode=' + that.recommCode
              that.qrStr = jdmUrl + '&callBack=' + encodeURIComponent(cbUrl)
            } else {
              that.qrStr = window.location.href.split('/dist')[0] + '/dist/index.html?recommCode=' + that.recommCode
            }
            console.log('that.qrStr ==== ' + that.qrStr)
            that.makeCode(that.qrStr)
          } else {
            that.toastContent = res.msg ? res.msg : '获取邀请信息失败'
            that.showToast = true
          }
        })
      },
      mounted: function() {
      },
      methods: {
        makeCode(qrStr) {
          // 初始化二维码部分
          let qrcode = new QRCode(document.getElementById('qrcode'), {  // eslint-disable-line
            width: 150,
            height: 150
          })
          this.qrcode = qrcode
          this.qrcode.makeCode(qrStr)
        },
        saveImagePic() {
          // 将当前的二维码放到对应的相册中
          console.log('开始保存二维码图片到相册')
        }
      }
    }
</script>

<style lang="less">
  @import "../../common/less/index.less";
  .InviteFriends{
    font-family: "PingFangSC";
    .headerPlane{
      .topColor{
        margin-top: 18px;
        height: 40px;
        position: relative;
        line-height: 40px;
        .colorBlockBack{
          position: absolute;
          top: 0;
          right: 104px;
          display: inline-block;
          width:40px;
          height:40px;
          background:rgba(255,218,41,1);
          border-radius: 50px
        }
        .colorBlockFont{
          position: absolute;
          top: 0;
          right: 0;
          display: inline-block;
          width: 124px;
          height: 40px;
          background:rgba(245,86,60,1);
          border-radius: 50px 0px 0px 50px;
        }
        .topIcon{
          margin-left: 30px;
          margin-right: 12px;
          width: 30px;
          height: 30px;
          background: #5B62CD;
        }
        .topName{
          font-size:18px;
          font-family:"PingFangSC-Regular";
          color:rgba(0,0,0,1);
          line-height:20px;
        }
      }
      .qrPlane{
        display: flex;
        justify-content: flex-start;
        margin-left: 30px;
        margin-right: 18px;
        margin-top: 18px;
        margin-bottom: 41px;
        .qrPic{
          display: inline-block;
          height: 150px;
          width: 150px;
        }
        .detailDiv{
          margin-left: 23px;
          display: inline-block;
          font-size: 16px;
        }
      }
    }
    .ButtonPlane{
      display: none;
      margin-left: 18px;
      margin-right: 18px;
      button.weui-btn, input.weui-btn{
        height:48px;
        background:rgba(255,218,41,1);
        border-radius: 6px;
        font-size:18px;
        color:rgba(0,0,0,1);
        line-height:25px;
      }

    }
    .rulePlane{
      margin-top: 36px;
      margin-left: 30px;
      margin-right: 30px;
      .ruleTitle {
        font-size:16px;
        font-family:"PingFangSC-Medium";
        color:rgba(0,0,0,1);
        line-height:20px;
      }
      .ruleContent{
        margin-top: 18px;
        font-size:13px;
        font-family:"PingFangSC-Medium";
        color:rgba(0,0,0,1);
        line-height:20px;
      }
    }
  }
</style>
