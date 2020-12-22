<template>
  <div class="input-box">
    <text class="label" :style="{ width: finalDataItem.labelWidth + 'px' }">{{ finalDataItem.label }}</text>
    <text class="require" :style="{ visibility: finalDataItem.isNeed && 'visible' || 'hidden'}">*</text>
    <number-input
       v-if="dataItem.inputValid"
       :class="['input', finalDataItem.noBorder && 'input-no-border', isColorRed ? 'input-active' : '']"
       :style="{width: finalDataItem.width + 'px', height: finalDataItem.height + 'px'}"
       :valid="dataItem.inputValid"
       :type="finalDataItem.type"
       :disabled="finalDataItem.disabled"
       :maxlength="finalDataItem.maxlength"
       :placeholder="finalDataItem.placeHolder"
       :value="finalDataItem.text"
       @input="doInput">
    ></number-input>
    <money-input
       v-else-if="dataItem.type==='money'"
       :class="['input', finalDataItem.noBorder && 'input-no-border', isColorRed ? 'input-active' : '']"
       :style="{width: finalDataItem.width + 'px', height: finalDataItem.height + 'px'}"
       :type="finalDataItem.type"
       :disabled="finalDataItem.disabled"
       :maxlength="finalDataItem.maxlength"
       :placeholder="finalDataItem.placeHolder"
       :value="finalDataItem.text"
       @input="doInput({value:$event})">
    </money-input>
    <input v-else
       :class="['input', finalDataItem.noBorder && 'input-no-border', isColorRed ? 'input-active' : '']"
       :style="{width: finalDataItem.width + 'px', height: finalDataItem.height + 'px' }"
       :type="finalDataItem.type"
       :disabled="finalDataItem.disabled"
       :maxlength="finalDataItem.maxlength"
       :placeholder="finalDataItem.placeHolder"
       :value="finalDataItem.text"
       @input="doInput"/>
  </div>
</template>

<script>
  import DefaultTaskPickLabel from './default-props';
  import MoneyInput from '@/components/money/moneyInput';
  import NumberInput from '@/components/form/number_input'

  export default {
    name: "task-common-input",
    components:{
      MoneyInput,
      NumberInput
    },
    props: {
      dataItem: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        isColorRed: false
      }
    },
    computed: {
      finalDataItem() {
        return Object.assign({}, DefaultTaskPickLabel, this.dataItem);
      }
    },
    methods: {
      doInput(e) {
        var value = e.value;
        this.$emit("changeValue", value);
        if (this.isNeed && !value) {
          this.isColorRed = true;
        } else {
          this.isColorRed = false;
        }
      }
    }
  }
</script>

<style lang="sass" type="text/scss" scoped>
  @import 'input';
</style>