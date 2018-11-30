<template>
	<div class="Settings">
		<div class="box-about">
		 <group>
			<cell title="关于" is-link :link="{path: '/About/About'}"></cell>
			</group>
		</div>
	</div>
</template>

<script>
	import { Cell, Group } from 'vux'
	export default {
    name: 'Settings',
    components: {
		  Cell,
		  Group
	  }
	}
</script>

<style lang="less">
  @import '../../common/less/index.less';
	.Settings {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: @bg;
	}

  .box-about {
  	color: #999999;
  }


</style>
