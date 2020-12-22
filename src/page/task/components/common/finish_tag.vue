<template>
  <div class="finish-tag-wrapper">
    <d-image v-if="finishFlag" src="/image/finish.png" width="38" height="38"></d-image>
    <d-image v-if="!finishFlag" src="/image/unfinish.png" width="38" height="38"></d-image>
    <text :class="[finishFlag ? 'finish-text' : 'unfinish-text']">{{ tagText }}</text>
  </div>
</template>

<script>
export default {
  props: {
    finishFlag: {
      default: false
    },
    tagText: {
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  @import '../../../../components/labelvalue/input';

.finish-tag-wrapper {
  flex-direction: row;
  align-items: center;
  padding-top: 12px;
}

.finish-text {
  margin-left: 5px;
  color: #21363D;
  font-size: 30px;
}

.unfinish-text {
  margin-left: 5px;
  color: #677475;
  font-size: 30px;
}
</style>