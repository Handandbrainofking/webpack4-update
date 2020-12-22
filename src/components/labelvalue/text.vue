<template>
  <div class="input-box">
    <text class="label" :style="{ width: finalDataItem.labelWidth + 'px' }">{{ finalDataItem.label }}</text>
    <text class="require" :style="{ visibility: finalDataItem.isNeed && 'visible' || 'hidden'}">*</text>
    <text class="input input-no-border">{{ finalDataItem.text }}</text>
  </div>
</template>

<script>
  import DefaultTaskPickLabel from './default-props';
  export default {
    name: "task-common-input",
    props: {
      dataItem: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
        finalDataItem() {
          return Object.assign({}, DefaultTaskPickLabel, this.dataItem);
        }
    }
  }
</script>

<style lang="sass" type="text/scss" scoped>
  @import 'input';
  .input {
    lines: 1;
  }
</style>