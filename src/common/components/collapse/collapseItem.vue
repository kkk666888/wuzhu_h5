<template>
  <div @click="toggle">
    <cell class="collapse-item" :title="title" is-link :border-intent="false" :arrow-direction="icon"></cell>
    <div v-show="isActive">
      <p class="collapse-content">{{content}}</p>
    </div>
  </div>

</template>
<script>
import { Cell } from 'vux';
export default {
  name: 'collapseItem',
  components: { Cell },
  props: {
    title: String,
    name: String,
    content: String
  },
  data() {
    return {
      index: 0, // use index for default when name is null
      isActive: false
    };
  },
  computed: {
    icon() {
      return this.isActive ? 'up' : 'right';
    }
  },
  methods: {
    toggle() {
      let item = {
        name: this.name,
        isActive: this.isActive
      };
      this.$emit('handleItem', item);
    }
  },
  created() {}
};
</script>
<style lang="less" scoped>
.collapse-content {
  background-color: #f5f5f5;
  color: #888;
  padding: 15px;
  font-size: 14px;
}
</style>
