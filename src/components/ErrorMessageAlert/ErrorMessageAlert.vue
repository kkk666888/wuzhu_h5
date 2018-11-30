<template>
  <div class="ErrorMessageAlert">
    <!--Toast展示对应的结果-->
    <toast v-model="showToast" type="text" width="20em">{{ message }}</toast>
  </div>
</template>

<script>
  import { Toast } from 'vux'
    export default {
        name: 'ErrorMessageAlert',
        components: {
          Toast
        },
      data() {
        return {
        }
      },
      props: {
        message: '',
        title: '',
        showToast: false
      }
    }
</script>

<style lang="less">
  @import "./../../common/less/index";
</style>
