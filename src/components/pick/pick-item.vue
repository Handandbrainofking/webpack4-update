<template>
  <scroller
     class="list-wrap"
     :show-scrollbar="false"
     :style="{flex: width}"
     @scroll="onScroll">
    <div class="gap" ref="top-node"></div>
    <text
       ref="picker-item"
       :class="['cell', currentIndex===idx && 'cell-active']"
       v-for="(itm, idx) in values"
       :key="`common-cell-${tag}-${idx}`">{{ getValue(itm, name) }}
    </text>
    <div class="gap"></div>
  </scroller>
</template>

<script>
const dom = weex.requireModule('dom')

export default {
  props: {
    values: {
      type: Array,
      default: () => []
    },
    width: {
      type: [Number, String],
      default: 1
    },
    name: {
      type: String,
      default: 'name'
    },
    tag: {
      type: [Number, String],
      default: 0
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },

  mounted() {
    const index = this.index
    if (index !== 0) {
      const el = this.$refs['top-node']
      dom.scrollToElement(el, {offset: index * 80, animated: false})
    }
    this.oldValues = this.values
    this.currentIndex = this.index
    this.$emit('changeItem', this.tag, this.values[this.index], true)
  },
  beforeUpdate() {
    if (!this.compareValues(this.oldValues, this.values)) {
      this.oldValues = this.values
    }
  },

  watch: {
    values() {
      if (!this.compareValues(this.oldValues, this.values)) {
        this.currentIndex = 0
        const el = this.$refs['top-node']
        dom.scrollToElement(el, {offset: 0})
        this.$emit('changeItem', this.tag, this.values[this.currentIndex], true)
      }
    }
  },

  methods: {
    compareValues(oldValue, values) {
      if (oldValue && values) {
        if (oldValue.length === values.length && JSON.stringify(oldValue.map(item => item.key)) === JSON.stringify(values.map(item => item.key))) {
          return true
        }
      }
      return false
    },
    onScrollStart(e) {
      console.log('start', e.contentOffset)
    },
    onScrollEnd(e) {
      const positionY = e.contentOffset.y
      const index = Math.round((0 - positionY) / 80)
      this.$emit('changeItem', this.tag, this.values[index], true)
    },
    onScroll(e) {
      const positionY = e.contentOffset.y
      const index = Math.round((0 - positionY) / 80)
      this.currentIndex = index
      // if (!this.beforeMove) {
      this.$emit('changeItem', this.tag, this.values[index], true)
      // }
    }
  }
}
</script>

<style scoped>
  .list-wrap {
    flex-direction: column;
    height: 400px;
    align-items: center;
  }

  .gap {
    height: 160px;
  }

  .cell {
    height: 80px;
    line-height: 80px;
    font-size: 34px;
  }

  .cell-active {
    font-size: 38px;
    color: #0099FF;
  }
</style>
