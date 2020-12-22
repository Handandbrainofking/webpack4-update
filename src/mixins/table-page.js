/**
 * 提取table的分页方法
 */
export default {
  props: {
    bodyList: {
      type: Array,
      default: () => []
    },
    idKey: {
      type: [Number, String]
    },
    headList: {
      type: Array,
      default: () => []
    },
    defineBodyListStyle: {
      type: [Object, undefined, null, Function],
      default: undefined
    },
    size: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    load_refresh: {
      type: Boolean,
      default: true
    },
    load_more: {
      type: Boolean,
      default: true
    },
    noData: {
      type: Boolean,
      default: false
    },
    hasCheck: {
      type: Boolean,
      default: false
    },
    showTag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      refreshing: false,
      showLoading: false,
      loadingText: '加载更多数据...',
      refreshText: '下拉刷新'
    }
  },
  methods: {
    // 定义列表样式
    defineListStyle(item, idx) {
      let obj = {
        height: this.height + 'px',
        backgroundColor: '#ffffff'
      }
      if (idx % 2 === 1) {
        obj.backgroundColor = '#f9f9f9'
      }
      if (this.defineBodyListStyle) {
        if (typeof this.defineBodyListStyle.func === 'function') {
          const style_ = this.defineBodyListStyle.func(item, idx)
          obj = Object.assign({}, obj, style_)
        } else {
          obj = Object.assign({}, obj, this.defineBodyListStyle)
        }
      }
      return obj
    },
    showName(list, item) {
      if (typeof item['key'] === 'function') {
        return item['key'](list)
      } else {
        return list[item['key']]
      }
    },
    showColor(list, item) {
      if (typeof item['color'] === 'function') {
        return item['color'](list)
      } else {
        return list[item['color']]
      }
    },
    onRefresh(e) {
      this.refreshing = true
      this.$emit('loadFresh', (nomMore) => {
        this.refreshText = '刷新成功'
        if (nomMore) {
          this.loadingText = '没有更多数据了'
        } else {
          this.loadingText = '加载更多数据...'
        }
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.refreshing = false
        }, 800)
      }, () => {
        this.refreshText = '刷新失敗'
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.refreshing = false
        }, 800)
      })
    },
    onPullingDown(e) {
      this.refreshText = '下拉可以刷新...'
      // 下拉到一定距离时改变文字
      if (Math.abs(e.pullingDistance) >= 80) {
        this.refreshText = '松开即可刷新...'
      }
    },
    onLoading(e) {
      this.showLoading = true
      this.$emit('loadMore', (nomMore) => {
        if (nomMore) {
          this.loadingText = '没有更多数据了'
        } else {
          this.loadingText = '加载更多数据...'
        }
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.showLoading = false
        }, 800)
      }, () => {
        this.loadingText = '加載失敗'
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.showLoading = false
          this.refreshText = '下拉可以刷新...'
        }, 800)
      })
    }
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer)
  }
}
