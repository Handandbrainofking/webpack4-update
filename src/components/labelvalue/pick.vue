<template>
  <div class="input-box">
    <text class="label" :style="{width: finalDataItem.labelWidth + 'px'}">{{ finalDataItem.label }}</text>
    <text class="require" :style="{ visibility: finalDataItem.isNeed && 'visible' || 'hidden'}">*</text>
    <bui-select
       ref="pick-down-wrap"
       class="input"
       :defined-click="finalDataItem.definedClick"
       :width="finalDataItem.width"
       size="34"
       :height="finalDataItem.height"
       @doChoosePick="doChangeSelect"
       :pickTitle="finalDataItem.label"
       :searchList="finalDataItem.list"
       :initValue="finalDataItem.initValue"
       :index="finalDataItem.index"
       :placeHolder="finalDataItem.placeHolder"></bui-select>
  </div>
</template>

<script>
  import BuiSelect from '../dropdown/pick.vue';
  import DefaultTaskPickLabel from './default-props';

  export default {
    name: "task-common-pick",
    components: {
      BuiSelect
    },
    props: {
      dataItem: {
        type: Object,
        default: () => ({})
      },
    },
    computed: {
      finalDataItem() {
        return Object.assign({}, DefaultTaskPickLabel, this.dataItem);
      }
    },
    methods: {
      doChangeSelect(...args) {
        this.$emit('changeValue', ...args);
      },
      getCurrentList() {
        return this.chooseValue;
      },
      // 重置值
      resetValue() {
        const func = this.$refs['pick-down-wrap'].resetValue;
        'function' === typeof func && func();
      }
    }
  }
</script>

<style lang="sass" type="text/scss" scoped>
  @import 'input';
</style>
