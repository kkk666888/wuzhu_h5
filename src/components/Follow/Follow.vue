<template>
	<div class="Follow">
		<div class="login_icon">
			<img class="login-icon-img" src="./Follow.png" srcset="./Follow.png 1x, ./Follow@2x.png 2x, ./Follow@2x.png 3x"/>
			<!-- <img class="login-icon-img" src="./Follow_test.jpg"/> -->
		</div>

		<div class="box-follow-content">
			<p>长按或用微信扫描上方的二维码，关注物主公众号，更多精彩内容不错过。</p>
		</div>
	</div>
</template>

<style lang="less">
	.Follow {
		width: 100%;
		height: 100%;
		position: absolute;
		.login_icon {
		padding-top: 45px;
		text-align: center;
			.login-icon-img{
				width: 110px;
				height: 110px;
        		border-radius: 16px;
			}
		}
		.box-follow-content {
			margin-top: 36px;
			margin-left: 30px;
			margin-right: 30px;
			color: #111111;
			font-size: 1em;
		}
	}
</style>
