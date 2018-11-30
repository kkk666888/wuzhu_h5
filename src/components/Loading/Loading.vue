<template>
  <div class="mf-loading-container">
    <img src="./loading.gif">
    <span class="loading-txt">正在加载</span>
  </div>
</template>
<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'loading'
  export default {
    name: COMPONENT_NAME
  }
</script>
<style lang="less" rel="stylesheet/less">
  .mf-loading-container {
    img{
      width: 20px;
      height: 20px;
      // display: block;
    }
    .loading-txt{
      position: relative;
      top: -5px;
      font-size: 12px;
    }
  }
</style>

