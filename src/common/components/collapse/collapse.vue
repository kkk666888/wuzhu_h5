<template>
  <div :class="classes">
    <Group class="collapse-group">
      <CollapseItem v-for="(item,index) in listData" :title="item.title" :content="item.content" :name="item.name" :key="index" @handleItem="toggle"></CollapseItem>
    </Group>
  </div>
</template>
<script>
import CollapseItem from './collapseItem';
import { Group } from 'vux';
const prefixCls = 'wz-collapse';
export default {
  name: 'Collapse',
  components: {
    CollapseItem,
    Group
  },
  props: {
    accordion: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Array, String]
    },
    simple: {
      type: Boolean,
      default: false
    },
    listData: {
      type: Array,
      default() {
        return [
          {
            title: '',
            name: '',
            content: ''
          }
        ];
      }
    }
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-simple`]: this.simple
        }
      ];
    }
  },
  mounted() {
    this.setActive();
  },
  methods: {
    setActive() {
      const activeKey = this.getActiveKey();
      this.$children[0].$children.forEach((child, index) => {
        const name = child.name || index.toString();
        child.isActive = activeKey.indexOf(name) > -1;
        child.index = index;
      });
    },
    getActiveKey() {
      let activeKey = this.currentValue || [];
      const accordion = this.accordion;
      if (!Array.isArray(activeKey)) {
        activeKey = [activeKey];
      }
      if (accordion && activeKey.length > 1) {
        activeKey = [activeKey[0]];
      }
      for (let i = 0; i < activeKey.length; i++) {
        activeKey[i] = activeKey[i].toString();
      }
      return activeKey;
    },
    toggle(data) {
      const name = data.name.toString();
      let newActiveKey = [];
      if (this.accordion) {
        if (!data.isActive) {
          newActiveKey.push(name);
        }
      } else {
        let activeKey = this.getActiveKey();
        const nameIndex = activeKey.indexOf(name);
        console.log(nameIndex);
        if (data.isActive) {
          if (nameIndex > -1) {
            activeKey.splice(nameIndex, 1);
          }
        } else {
          if (nameIndex < 0) {
            activeKey.push(name);
          }
        }
        newActiveKey = activeKey;
      }
      this.currentValue = newActiveKey;
      this.$emit('input', newActiveKey);
      this.$emit('on-change', newActiveKey);
    }
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
    currentValue() {
      this.setActive();
    }
  }
};
</script>
<style lang="less" >
.wz-collapse {
  .collapse-group {
    .weui-cells {
      margin-top: -1px;
    }
  }
}
</style>
