<template>
	<div class="Withdraw">

		<div class="box-quota">
			<p class="quota-content">可提现金额  <span class="quota-number">{{ totalMoney }}</span></p>
		</div>

		<div class="box-account-time">
			<p class="account-time-content">到账时间：提交提现申请后，需在1-2个工作日后即可到账，节假日顺延。</p>
		</div>
    <group title="收款账户">
      <x-input title="支付宝账号" v-model="aliPayAccount" :max="13" placeholder="请填写您的支付宝账号"></x-input>
    </group>
    <group title="请填写提现金额">
      <x-input title=" 提现金额" v-model="withDrawMoney" placeholder="最多可提取￥100.00"></x-input>
    </group>
		<div class="box-withdraw">
			<x-button @click.native="goNext" text="提交申请" :gradients="['#4e92df', '#4e92df']"></x-button>
		</div>

	</div>
</template>

<script>
	import {XInput, XButton, Group, Cell} from 'vux'
	export default {
		name: 'Withdraw',
		components: {
			XInput,
			XButton,
      Group,
      Cell
    },
    data() {
      return {
        totalMoney: '￥100',
        aliPayAccount: '',
        withDrawMoney: ''
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
      let getInfoUrl = '/wuzhu/withdraw/getWithDrawInfo'
      that.$http.get(getInfoUrl).then((res) => {
        that.$store.commit('updateLoadingStatus', { isLoading: false })
        if (res.code === '00') {
          console.log('获取用户的提现信息')
        }
      })
    },
    methods: {
      goNext() {
        let that = this
        that.$store.commit('updateLoadingStatus', { isLoading: true })
        let param = {
          totalQuotaAmt: that.totalMoney,
          withdrawAmt: that.withDrawMoney,
          mobile: '',
          alipayAccount: that.aliPayAccount
        }
        let getInfoUrl = '/wuzhu/withdraw/generateWithDraw'
        that.$http.get(getInfoUrl, param).then((res) => {
          that.$store.commit('updateLoadingStatus', { isLoading: false })
          if (res.code === '00') {
            console.log('获取用户的提现信息')
            that.$router.push({name: 'WithdrawSuccess'})
          }
        })
      }
    }
	}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/less/index.less";
  .Withdraw {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: #f5f5f5;
    .box-quota {
      background-color: white;
      .quota-content {
        padding-top: 0.8em;
        padding-bottom: 0.8em;
        padding-left: 1.2em;
        font-size: 1em;
        color: #999999;
      }
      .bankcard-number {
        padding-left: 25px;
      }
    }
    .box-account-time {
      margin-top: 5px;
      margin-left: 8px;
      margin-right: 8px;
      .account-time-content {
        color: #999999;
        font-size: 0.8em;
      }
    }
    .box-withdraw {
      margin-top: 40px;
      margin-left: 10%;
      margin-right: 10%;
    }
    .weui-cells{
      font-size: 14px;
    }
    .weui-input::-webkit-input-placeholder{
      color: #BDBDBD;
    }
    .weui-cells__title{
      margin-top: 30px!important;
    }
    .weui-btn{
      font-size: 14px !important;
    }
  }
</style>
