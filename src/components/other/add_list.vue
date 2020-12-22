<!--
  function: 列表增加删除组件
  author  : wq
  update  : 2018/5/29 9:10
-->
<template>
  <d-layout class="container-wrap" kind="column" text-align="initial" vertical-align="initial">
    <d-layout-scroll kind="column" text-align="initial" vertical-align="initial">
      <div class="scroll-wrap-inner">
        <div
           class="content-wrap"
           :style="{height: (item.height || height) + 'px'}"
           :ref="`add-list-${item.idx}`"
           v-for="(item, index) in [...serverList, ...innerList]"
           :key="`add-list-key-${item.noIdx}`">
          <div class="custom-info-head" :class="[item.isServer && serverNoColor && 'noBgColor']">
            <text class="head-title">{{ name }}{{serverTitleSymbol && item.isServer ? `-${item[serverTitleSymbol]}` : item.sortIdx}}</text>
            <div class="btn-delete-wrap" v-if="showDelete && !(stopEditServer && item.isServer)"
                 @click="doDeleteList(index, item)">
              <d-image src='/image/button_delete.png' width="32" height="32"></d-image>
            </div>
          </div>
          <slot :listItem="item"></slot>
        </div>
        <div class="block-mask" v-if="stopEditAll" @click="doStop"></div>
      </div>
    </d-layout-scroll>
    <div class="btn-add-wrap" @click="doAddList">
      <d-image src="/image/icon_addsell.png" width="34" height="34"></d-image>
      <text class="btn-add">添加{{ name }}信息</text>
    </div>
  </d-layout>
</template>
<script>
const dom = weex.requireModule('dom')
const animation = weex.requireModule('animation')
export default {
  name: 'add_list',
  props: {
    stopEditAll: {
      type: Boolean,
      default: false
    },
    stopEditServer: {
      type: Boolean,
      default: false
    },
    height: {
      type: [String, Number],
      default: 910
    },
    name: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => ([])
    },
    // 服务器数据不需要颜色
    serverNoColor: {
      type: Boolean,
      default: false
    },
    serverTitleSymbol: {
      type: String,
      default: ''
    },
    addFirstEdit: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    list(value, oldValue) {
      if (!this.compareObj(value, oldValue)) {
        this.productListData()
      }
    }
  },
  data() {
    return {
      // 内部新增加的客户列表
      innerList: [],
      serverList: []
    }
  },
  created() {
    this.productListData()
  },
  computed: {
    showDelete() {
      return (this.innerList.length + this.serverList.length) > 1
    }
  },
  methods: {
    // 添加客户
    doAddList: function (callback) {
      if (this.stopEditAll) {
        return false
      }
      
      const len1 = this.innerList.length
      const len2 = this.serverList.length
      const now = new Date().getTime() + 1000
      let i = 0
      let idx = 0
      if (len1 < 1) {
        if (!this.serverTitleSymbol) {
          i = this.serverList[len2 - 1].sortIdx
        }
        else {
          i = 0
        }
        idx = this.serverList[len2 - 1].idx
      } else {
        i = this.innerList[len1 - 1].sortIdx
        idx = this.innerList[len1 - 1].idx
      }
      const item = {
        sortIdx: i + 1,
        idx: idx + 1,
        noIdx: now + i
      }
      if(typeof callback === 'function'){
        callback(item)
      }
      this.innerList.push(item)

      setTimeout(() => {
        const _$ref = this.$refs['add-list-' + (idx + 1)][0]
        this.$emit('created', {item, ref:_$ref, list: [...this.serverList, ...this.innerList]})
        dom.scrollToElement(_$ref, {})
      }, 30)      
      return item
    },
    // 删除服务器端数据
    doDeleteServerList(index, item) {
      this.$emit('doDeleteItem', item, index, () => {
        this.deleteDom(item.idx, () => {
          Vue.delete(this.serverList, index)
        })
      })
    },
    // 删除临时增加的数据
    doDeleteList(index, item) {
      if (item.isServer) {
        this.doDeleteServerList(index, item)
        return false
      }
      this.deleteDom(item.idx, () => {
        Vue.delete(this.innerList, index - this.serverList.length)
      })

      this.$emit('removed', item)
    },
    // 删除列表动画
    deleteDom(index, func) {
      const _$ref = this.$refs['add-list-' + index][0]
      animation.transition(_$ref, {
        styles: {
          height: '1px'
        },
        duration: 500, // ms
        timingFunction: 'ease',
        delay: 0 // ms
      }, () => {
        typeof func === 'function' && func()
      })
    },
    // 生成列表数据
    productListData() {
      const list = this.list
      const now = new Date().getTime() + 1000
      const serverList = []
      this.serverList = []
      list.forEach((item, index) => {
        serverList.push(Object.assign({}, item, { idx: index + 1, sortIdx: index + 1, isServer: true, noIdx: now + index }))
      })
      const len2 = serverList.length
      if (this.addFirstEdit || serverList.length < 1) {
        let i = 0
        let idx = 0
        const serverLastItem = serverList[len2 - 1] || {}
        if (!this.serverTitleSymbol) {
          i = serverLastItem.sortIdx || 0
        }
        else {
          i = 0
        }
        idx = serverLastItem.sortIdx || 0
        this.innerList = [{ idx: idx + 1, noIdx: now + serverList.length + 1, sortIdx: i + 1 }]
      } else {
        this.innerList = []
      }
      this.serverList = serverList
    },
    // 比较数据，只要认为数据的id值没有变化，则没有变化
    compareList() {
      const list = this.list
      for (let i in list) {
        if (list[i].id !== this.serverList[i].id) {
          return false
        }
      }
      return true
    },
    doStop() {
    }
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  $add_button_height: 68;
  .container-wrap {
    @include setPaddingH($normal_gap_left);
  }
  .content-wrap {
    border-width: $condition-border + px;
    border-color: $color_list_border;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .custom-info-head {
    background-color: $color_list_title;
    padding-left: $normal_gap_left;
    padding-right: $normal_gap_left;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 80px;
  }
  .noBgColor {
    background-color: transparent;
  }
  .head-title {
    flex: 1;
    font-size: $font_normal;
    color: $color_nav;
  }
  .btn-delete-wrap {
    height: 80px;
    width: 80px;
    align-items: center;
    justify-content: center;
  }
  .btn-add-wrap {
    width: 400px;
    height: $add_button_height + px;
    background-color: $color_light_focus;
    border-width: $condition-border + px;
    border-color: $color_back;
    border-radius: 4px;
    margin-top: $normal_gap_bottom;
    margin-bottom: $normal_gap_bottom;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .btn-add {
    color: $color_back;
    font-size: $font_nav;
    padding-left: $normal_image_gap;
    line-height: $font_nav;
  }
  .scroll-wrap-inner {
    flex-direction: column;
  }
  .block-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
