<!--
  function: formIndex
  author  : wq
  update  : 2018/11/27 9:31
-->
<template>
  <d-layout class kind="column" vertical-align="initial" text-align="initial" :full-parent="false" :style="{paddingRight: `${labelWidth - 78}px`, width: `${width}px`}">
    <d-layout text-align="right" :full-parent="false">
      <text class="mark-tip">{{ markNum }}/200</text>
    </d-layout>
    <d-layout class="area-wrap" vertical-align="top">
      <text class="label" :style="{ width: labelWidth + 'px' }">{{ label }}</text>
      <text class="require" :style="{ visibility: required && 'visible' || 'hidden'}">*</text>
      <textarea class="mark" :value="value" rows="5" :placeholder="placeholder" maxLength="200" @input="$emit('input', $event.value, $event)"></textarea>
    </d-layout>
  </d-layout>
</template>

<script>
import MixinFormLabel from '../mixins/mixinLabel'
import MixinFormInput from '../mixins/mixinInput'

export default {
  name: 'formIndex',
  mixins: [MixinFormLabel, MixinFormInput],
  computed: {
    markNum() {
      const value = this.value
      return value.length
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .label {
    color: $color_nav;
    font-size: $font_nav;
    text-align: right;
    margin-top: $normal_gap_left;
  }
  .require {
    color: #FF0000;
    font-size: $font_nav;
    margin-top: $normal_gap_left;
  }
  .mark-tip {
    color: $color_back;
    font-size: $font_small;
    padding-top: $normal_gap_bottom;
  }
  .area-wrap {
    height: 400px
  }
  .mark {
    line-height: 50px;
    margin-left: 20px;
    @include setPadding($normal_gap_left);
    @include setBorder(#CACCCF);
    font-size: $font_nav;
    height: 400px;
    flex: 1;
  }
</style>
