<!--
  function: index
  author  : wq
  update  : 2018/11/26 15:22
-->
<template>
  <form-mark
     v-if="type === 'mark'"
     v-bind="$props"
     v-on="$listeners"
  ></form-mark>
  <d-layout v-else class="form-wrap" :style="{height: `${height + 24}px`, width: `${width}px`}" text-align="initial" :full-parent="false">
    <text class="label" :style="{ width: labelWidth + 'px' }">{{ label }}</text>
    <text class="require" :style="{ visibility: required && 'visible' || 'hidden'}">*</text>
    <slot name="front-part"></slot>
    <slot>
      <form-view-index
         :has-border="hasBorder"
         :type="type"
         :value="value"
         :size="size"
         :height="height"
         :pick-title="pickTitle"
         :list="list"
         :index="index"
         :min="min"
         :input-width="inputWidth"
         :maxlength="maxlength"
         :placeholder="placeholder"
         :disabled="disabled"
         :valid="valid"
         @input="input"
      ></form-view-index>
    </slot>
    <slot name="other-tip">
      <div v-if="hasTips" class="tips-box" @click="clickEnclosure">
        <d-image src="/image/icon_normal.png" width="28" height="28"></d-image>
      </div>
      <div v-if="hasCamera" class="tips-box" @click="clickEnclosure">
        <d-image src="/image/button_camera.png" width="52" height="44"></d-image>
      </div>
      <div v-if="hasChoose" class="tips-box" @click="clickEnclosure">
        <text class="btn-choose">选择</text>
      </div>
      <d-layout v-if="hasCheckbox" class="tips-box" :full-parent="false" @clickLayout="clickEnclosure">
        <d-image :src="checkBoxUrl" height="40" width="40"></d-image>
        <text class="long-font">长期</text>
      </d-layout>
      <d-layout v-if="hasOtherInput" class="tips-box" :full-parent="false">
        <form-view-index
           :type="input"
           :value="values && values[1] || ''"
           :size="size"
           :height="height"
           :maxlength="maxlength"
           :placeholder="placeholder"
           @input="clickEnclosure"
        ></form-view-index>
        <text class="text" style="padding-left: 10px;">{{(values && values[1] || '').length}}/20</text>
      </d-layout>
    </slot>
  </d-layout>
</template>

<script>
import MixinFormLabel from './mixins/mixinLabel'
import MixinFormInput from './mixins/mixinInput'
import FormViewIndex from './views/formIndex.vue'
import FormMark from './views/formMark.vue'

export default {
  name: 'FormIndex',
  components: {
    FormViewIndex,
    FormMark
  },
  mixins: [MixinFormLabel, MixinFormInput],
  data() {
    return {
      showObj: {
        showGroundBankFirst: false,
        showOrgBankFirst: false,
        show: false
      }
    }
  },
  computed: {
    checkBoxUrl() {
      const hasCheckbox = this.hasCheckbox
      if (hasCheckbox === 1) {
        return 'https://gw.alicdn.com/tfs/TB14fp2pwMPMeJjy1XbXXcwxVXa-72-72.png'
      } else if (hasCheckbox === 2) {
        return 'https://gw.alicdn.com/tfs/TB1U6SbpwMPMeJjy1XcXXXpppXa-72-72.png'
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  .form-wrap {
    @include setPaddingV(12px);
  }
  .label {
    color: $color_nav;
    font-size: $font_nav;
    text-align: right;
  }
  .require {
    color: #FF0000;
    font-size: $font_nav;
  }

  /** other-tip **/
  .tips-box {
    @include setPadding($normal_gap_left);
  }

  .btn-choose {
    background-color: $color_back;
    color: $color_white;
    height: 72px;
    line-height: 72px;
    width: 150px;
    text-align: center;
    border-radius: 4px;
    font-size: $font_normal;
  }

  .long-font {
    padding-left: 10px;
    font-size: $font_nav;
  }
</style>
