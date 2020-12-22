<template>
  <div class="input-box">
    <text class="label" :style="{width: finalDataItem.labelWidth + 'px'}">{{ finalDataItem.label }}</text>
    <text class="require" :style="{ visibility: finalDataItem.isNeed && 'visible' || 'hidden'}">*</text>
    <bui-select-date
       ref='bui-pick-date'
       class="input"
       :width="finalDataItem.width"
       :date="finalDataItem.text"
       :height="finalDataItem.height"
       :min="finalDataItem.minDate"
       :place-holder="finalDataItem.placeHolder"
       @doChoosePick="doChangeSelect"></bui-select-date>
  </div>
</template>

<script>
  import BuiSelectDate from '../dropdown/pickdate.vue';
  import DefaultTaskPickLabel from './default-props';
  export default {
    name: "task-common-pickdate",
    components: {
      BuiSelectDate
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
      doChangeSelect(date) {
        this.$emit("changeValue", date);
      },
      setDate(date) {
        this.$refs['bui-pick-date'].setDate(date);
      }
    }
  }
</script>

<style lang="sass" type="text/scss" scoped>
  @import 'input';
</style>