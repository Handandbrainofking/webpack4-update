<template>
  <div class="check-head-box">
    <div class="check-wrap center" @click="doChecked">
      <div class="btn-uncheck">
        <d-image :style="{ visibility: checkedVisible }" src="/image/checked.png" width="46" height="46"></d-image>
      </div>
    </div>
    <div class="email-wrap center">
      <slot></slot>
    </div>
    <div class="title-wrap">
      <text class="title text">{{title}}</text>
    </div>
    <div class="time-wrap">
      <text class="time text time-left">{{time}}</text>
    </div>
  </div>
</template>

<script>
export default {
  name: 'list-head',
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '主题'
    },
    time: {
      type: String,
      default: '发送时间'
    }
  },
  computed: {
    checkedVisible() {
      return this.checked && 'visible' || 'hidden'
    }
  },

  methods: {
    doChecked() {
      this.$emit('changeCheck')
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .check-head-box {
    flex-direction: row;
    height: 80px;
    align-items: center;
  }

  .check-wrap {
    flex: 1;
  }

  .center {
    align-items: center;
    justify-content: center;
  }

  .btn-uncheck {
    width: 35px;
    height: 35px;
    border-width: 2px;
    border-color: rgba(103, 116, 117, 0.5);
    border-radius: 6px;
    align-items: center;
    justify-content: center;
  }

  .email-wrap {
    flex: 1;
  }

  .title-wrap {
    flex: 4;
  }

  .time-wrap {
    flex: 3;
  }
  .time-left {
    padding-left: 240px;
  }

  .text {
    font-size: $font_nav;
    color: $color_enclosure;
  }
</style>
