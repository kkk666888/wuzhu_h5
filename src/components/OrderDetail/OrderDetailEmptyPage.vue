<template>
  <!--该页面仅仅只是一个协调路由的中间页面，无实际意义，为了解决 查看原订单的路由需求-->
    <div>

    </div>
</template>

<script>
    export default {
      name: 'OrderDetailEmptyPage',
      created: function() {
        let tempParam = this.$router.app._route.params
        let orderNo = tempParam.orderNo
        console.log('调用了EmptyPage的create方法: ' + JSON.stringify(tempParam))
        this.$router.push({ name: 'OrderDetailNewPage', params: { orderNo: orderNo } })
      }
    }
</script>

<style scoped>

</style>
