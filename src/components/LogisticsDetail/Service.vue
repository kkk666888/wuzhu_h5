<template>
	<div class="Service">
  
  <!-- <div><x-header title="维修"></x-header></div> -->
  
  <div class="content">
    <img class="server-icon" srcset="./server@1x.png 1x, ./server@1.5x.png 1.5x"/>
  	<p class="server-text">如需维修服务,请联系在线客服，或拨打<br /><a href="tel:400-839-6296">400-839-6296</a></p>
  </div>
  </div>
</template>

<script>
	export default {
		name: 'Service',
		components: {}
	}
</script>

<style lang="less">
.content {
	color: grey;
	text-align: center;
	padding-top: 220px;
	font-size: 1em;
}

.server-icon {
  width: 60px;
  height: 60px;
}

.server-text {
  margin: 44px;
}
</style>
