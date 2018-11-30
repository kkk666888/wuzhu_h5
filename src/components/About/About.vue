<template>
	<div class="About">
		<div class="login_icon">
			<img class="login-icon-img" v-bind:src="logoUrl"/>
		</div>

		<div class="box-about-content">
			<p>物主专注提供时尚数码智能终端产品租赁，与全球品牌厂商合作提供优质的硬件享用，免押租赁，租后维修与回收等一系列优质服务。</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'About',
		data() {
			return {
				logoUrl: './static/images/logo.png'
			}
		}
	}
</script>

<style lang="less">
	.About {
		width: 100%;
		height: 100%;
		position: absolute;
		.login_icon {
		padding-top: 45px;
		text-align: center;
			.login-icon-img{
				width: 100px;
				height: 100px;
        border-radius: 16px;
			}
		}
		.box-about-content {
			margin-top: 36px;
			margin-left: 18px;
			margin-right: 18px;
			color: #111111;
			font-size: 1em;
		}
	}
</style>
