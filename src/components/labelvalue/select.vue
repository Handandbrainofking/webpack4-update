<template>
  <div class="input-box">
    <text class="label" :style="{width: finalDataItem.labelWidth + 'px'}">{{ finalDataItem.label }}</text>
    <text class="require" :style="{ visibility: finalDataItem.isNeed && 'visible' || 'hidden'}">*</text>
    <bui-radio
       :button-list="finalDataItem.list"
       :disable="disable"
       :checking="checking"
       :index="finalDataItem.index"
       :height="finalDataItem.height"
       @ButtonChoose="doChangeKind"></bui-radio>
  </div>
</template>

<script>
  import BuiRadio from '../form/radio.vue';
  import DefaultTaskPickLabel from './default-props';

  export default {
    name: "task-common-select",
    components: {
      BuiRadio
    },
    props: {
      dataItem: {
        type: Object,
        default: () => ({})
      },
      disable:{
        type: Boolean,
        default: false
      },
      checking: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      finalDataItem() {
        return Object.assign({}, DefaultTaskPickLabel, this.dataItem);
      }
    },
    methods: {
      doChangeKind(key, name, index) {
        this.$emit("changeValue", key, name, index);
      }
    }
  }
</script>

<style lang="sass" type="text/scss" scoped>
  @import 'input';
</style>
