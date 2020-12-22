<template>
  <wxc-dialog
     :show="true"
     top="150"
     :definedBtn="true">
    <div slot="title" class="btn-wrap">
      <text class="flex1 btn" @click="doCancelChoose">取消</text>
      <text class="flex1 btn btn-sure" @click="doSureChoose">确定</text>
    </div>
    <div slot="content" class="item-list">
      <wxc-common-pick-item
         :values="item.values"
         :width="item.width"
         :name="item.name"
         :tag="index"
         :index="item.index"
         v-for="(item, index) in innerDataItems"
         :key="`common-list-${index}`"
         @changeItem="changeItem"></wxc-common-pick-item>
      <div class="choose-wrap"></div>
    </div>
  </wxc-dialog>
</template>

<script>
import WxcDialog from '../dialog/dialog.vue'
import WxcCommonPickItem from './pick-item.vue'

export default {
  name: 'common-pick-box',
  components: {
    WxcDialog,
    WxcCommonPickItem
  },
  props: {
    dataItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      result: []
    }
  },

  created() {
    const dataItems = this.dataItems || []
    dataItems.forEach((item, index) => {
      this.result[index] = item.values[item.index || 0]
    })
  },

  computed: {
    innerDataItems() {
      return this.dataItems.map((item) => {
        return Object.assign({width: 1, index: 0}, item)
      })
    }
  },
  methods: {
    doSureChoose() {
      this.$emit('doSureChoose')
    },
    doCancelChoose() {
      this.$emit('doCancelChoose')
    },
    changeItem(item, result, bool) {
      this.result[item] = result
      if (bool) {
        this.$emit('change', ...(this.result))
      }
    }
  }
}
</script>

<style scoped>
  .btn-wrap {
    flex-direction: row;
    align-items: center;
    height: 80px;
    border-bottom-width: 2px;
    border-bottom-color: #CACCCF;
  }

  .flex1 {
    flex: 1;
  }

  .btn {
    height: 80px;
    line-height: 80px;
    text-align: center;
    font-size: 34px;
  }

  .btn-sure {
    color: #0099FF;
  }

  .item-list {
    flex-direction: row;
    padding-top: 160px;
    padding-left: 40px;
    padding-right: 40px;
    padding-bottom: 160px;
    height: 720px;
  }

  .choose-wrap {
    position: absolute;
    height: 80px;
    left: 0;
    right: 0;
    top: 320px;
    border-top-width: 2px;
    border-bottom-width: 2px;
    border-color: #0099FF;
    z-index: 21;
  }
</style>
