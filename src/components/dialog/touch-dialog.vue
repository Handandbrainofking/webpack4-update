<template>
    <div class="tooltips" :style="{width: tipWidth + 'px', height: tipHeight + 'px', top: tipTop + 'px', left: tipLeft + 'px'}">
        <text class="tip-text">{{ tipContent }}</text>
    </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    tipWidth: {
      type: Number
    },
    tipHeight: {
      type: Number,
      default: 80
    },
    tipContent: {
      type: String
    },
    tipTop: {
      type: Number,
      default: 40
    },
    tipLeft: {
      type: Number,
      default: -50
    }
  },
  methods: {}
}
</script>

<style scoped>
.tooltips {
  position: absolute;
  line-height: 60px;
  border-radius: 4px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 20px;
  padding-left: 20px;
  border-width: 2px;
  border-color: #e1e3e3;
  z-index: 99999;
}
.tip-text {
  font-size: 22px;
  color: #677475;
}
</style>