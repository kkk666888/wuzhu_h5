<template>
  <div>

  </div>
</template>

<script>
    export default {
      name: 'EmptyPage',
      created: function() {
        console.log('调用了EmptyPage的create方法======')
        this.$router.push({
          name: 'ShopPage'
        });
      }
    }
</script>

<style scoped>
</style>
