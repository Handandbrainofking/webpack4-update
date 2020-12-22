<template>
  <div class="input-box">
    <text class="label" :style="{width: finalDataItem.labelWidth + 'px'}">{{ finalDataItem.label }}</text>
    <text class="require" :style="{ visibility: finalDataItem.isNeed && 'visible' || 'hidden'}">*</text>
    <bui-select-date-time
       ref='bui-pick-date-time'
       class="input"
       :width="finalDataItem.width"
       :datetime="finalDataItem.text"
       :min="finalDataItem.minDate"
       :height="finalDataItem.height"
       :place-holder="finalDataItem.placeHolder"
       @changeValue="changeValue"></bui-select-date-time>
  </div>
</template>

<script>
  import BuiSelectDateTime from '../dropdown/pickdatetime.vue';
  import DefaultTaskPickLabel from './default-props';
  export default {
    name: "task-common-pickdate",
    components: {
      BuiSelectDateTime
    },
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
    },
    methods: {
      changeValue(datetime, date, time) {
        this.$emit("changeValue", datetime, date, time);
      },
      // setDateTime(date, time) {
      //   this.$refs['bui-pick-date-time'].setDateTime(date, time);
      // }
    }
  }
</script>

<style lang="sass" type="text/scss" scoped>
  @import 'input';
</style>