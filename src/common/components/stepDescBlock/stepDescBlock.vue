<template>
  <div class="stepDescBlock">
    <div class="left">{{ stepDesc }}
    </div>
    <div class="right">{{ stepIndex }}<span class="gray">/4</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StepDescBlock',
  props: {
    stepDesc: {
      type: String,
      default: ''
    },
    stepIndex: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
    };
  }
};
</script>
<style lang="less" >
  .gray {
    color: #888888;
  }
  .stepDescBlock {
    text-align: center;
    height:27px;
    line-height: 27px;
    padding: 5px 15px 5px 15px;
    background:#F1F1F1;
    font-size:12px;
    color: #222222;
    display: flex;
    justify-content: space-between;
    background:linear-gradient(270deg,rgba(250,204,20,1) 0%,rgba(255,218,41,1) 100%);
    background-size: 5% 100%;
    background-repeat:no-repeat;
  }
</style>
