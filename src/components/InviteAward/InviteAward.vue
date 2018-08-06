<template>
  <div class="invite-award">
    <div class="d-content">
      <section>
        <div class="grand-total">
          <div class="left-div">
            <div class="qr-code">
              <img src="./qr_code.png">
            </div>
          </div>
          <div class="right-div">
            <div>
              <div class="right-div-txt f13">
                <div>累计邀请「{{ numPeople }}」人</div>
                <div>累计「{{ numOrder }}」成功下单</div>
                <div>累计获得奖励「{{ numBounty }}」元</div>
                <div>可提现「{{ numCash }}」元</div>
              </div>
              <div class="right-div-btn">
                <x-button @click.native="withdraw">提现</x-button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="bg-div"></div>
        <div class="reward-rules">
          <div class="fs-head f18">奖励规则</div>
          <div class="fs-txt">规则介绍...</div>
        </div>
        <div class="bg-div"></div>
        <div class="reward-rules reward-way">
          <div class="fs-head f18">奖励规则</div>
          <div v-for="(item, index) in rewardRules" :key="index" class="fs-txt">
            {{ index + 1 }}、{{ item }}
          </div>
          <!-- <div class="fs-txt">1、分享链接给好友</div>
          <div class="fs-txt">2、好友注册并支付完成第一笔订单</div>
          <div class="fs-txt">3、您可获得奖励</div> -->
        </div>
      </section>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { XHeader, XButton } from 'vux'
  export default {
    name: 'InviteAward',
    data() {
      return {
        numPeople: '1231',
        numOrder: '234',
        numBounty: '4567',
        numCash: '23456',
        rewardRules: [
          '分享链接给好友',
          '好友注册并支付完成第一笔订单',
          '您可获得奖励'
        ]
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
          if (res.code === '00') {
            console.log('获取用户的提现信息')
          } else {
          }
      })
    },
    mounted() {
    },
    methods: {
      withdraw() {
        this.$router.push({name: 'Withdraw'})
      }
    },
    components: {
      XHeader,
      XButton
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/index.less";
  .invite-award{
    height: 100%;
    .d-content{
      height: 100%;
      // background-color: #f5f5f5;
      .grand-total{
        height: 190px;
        background-color: white;
        .left-div{
          width: 48%;
          height: 100%;
          float: left;
          position: relative;
          box-sizing: border-box;
          -moz-box-sizing:border-box; /* Firefox */
          -webkit-box-sizing:border-box; /* Safari */
          text-align: center;
          .qr-code{
            position: absolute;
            left: 0px;
            right: 0px;
            top: 50%;
            margin-top: -50px;
            height: 100px;
            img{
              width: 100px;
              height: 100px;
            }
          }
        }
        .right-div{
          min-width: 50%;
          max-width: 52%;
          height: 100%;
          position: relative;
          box-sizing: border-box;
          -moz-box-sizing:border-box; /* Firefox */
          -webkit-box-sizing:border-box; /* Safari */
          float: left;
          &>div{
            position: absolute;
            bottom: 15px;
          }
          .right-div-txt{

          }
          .right-div-btn{
            width: 100px;
            margin-top: 10px;
            button{
              font-size: 13px;
              height: 24px;
              line-height: 25px;
              background-color: #4a90e2;
              color: white;
            }
          }
        }
      }
      .reward-rules{
        height: 130px;
        background-color: white;
        .fs-head{
          .border-1px();
          font-weight: bold;
          // padding: 15px 0px 20px 8px;
          padding: 10px 0px 12px 8px;
        }
        .fs-txt{
          padding-left: 15px;
          color: #9a9a9a;
        }
        // 第一个 .fs-txt
        &>div:nth-child(2){
          padding-top: 15px;
        }
      }
      .reward-way{
        height: auto;
      }
    }
    .bg-div{
      background-color: #f5f5f5;
      height: 10px;
      width: 100%;
    }
  }
</style>
