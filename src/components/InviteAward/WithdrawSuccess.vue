<template>
	<div class="WithdrawSuccess">
		
		<div box-msg>
			<msg description="提现申请已成功提交，预计1-2个工作日打款到您的账户，工作日顺延"></msg>
		</div>

	</div>
</template>

<script>
	import { Msg } from 'vux'
	export default {
		name: 'WithdrawSuccess',
		components: {
			Msg
		}
	}
</script>