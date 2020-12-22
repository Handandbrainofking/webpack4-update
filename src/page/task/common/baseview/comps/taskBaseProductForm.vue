<!--
  function: taskBaseTitle
  author  : wq
  update  : 2018/11/30 9:48
-->
<template>
  <d-layout-scroll kind="column" text-align="initial" vertical-align="initial">
    <d-layout kind="column" :full-parent="false" text-align="initial" vertical-align="initial">
      <slot>
        <template v-if="isTitleArrayConfig && showChildren">
          <d-form-title
             v-if="list.children.filter(item => item.hidden !== true).length > 0"
             v-for="list in info"
             :key="`form-key-${list.sortIndex}`"
             :title="list.title">
            <template v-for="item in list.children" v-if="!item.hidden">
              <slot v-if="item.type === 'slot'" :name="`${item.slotName}`" :item="item"></slot>
              <d-form
                 v-else
                 :key="`form-key-${list.sortIndex}-${item.sortIndex}`"
                 v-bind="item"
                 @closeBoard="closeBoard"
                 @clickEnclosure="clickEnclosure(item.key, list.sortIndex, item.sortIndex, item, ...arguments)"
                 @input="input(item.key, list.sortIndex, item.sortIndex, item,  ...arguments)"
              ></d-form>
            </template>
          </d-form-title>
        </template>
        <template v-else-if="showChildren">
          <d-layout :wrap="true" :style="{width: width !== -1 ? `${width}px` : 'initial'}">
            <template v-for="item in info" v-if="!item.hidden">
              <slot v-if="item.type === 'slot'" :name="`${item.slotName}`" :item="item"></slot>
              <d-form
                 v-else
                 :key="`form-key-${item.sortIndex}`"
                 v-bind="item"
                 @closeBoard="closeBoard"
                 @clickEnclosure="clickEnclosure(item.key, item.sortIndex, item, ...arguments)"
                 @input="input(item.key, item.sortIndex, item,  ...arguments)"
                 @change="change(item.key, item.sortIndex, item,  ...arguments)"
              ></d-form>
            </template>
          </d-layout>
        </template>
      </slot>
      <template v-if="showDataUpload">
        <task-base-head title="资料上传" :is-order="false"></task-base-head>
        <task-data-upload-list
           :title="item.name"
           :applyNo="applyNo"
           :fileType="item.typeNo"
           :customer-no="item.custNo"
           v-for="(item,index) in dataList"
           :key="`data-list-${index}`"
        ></task-data-upload-list>
      </template>
      <template v-if="stopEdit">
        <div class="block-mask" @click="stopClick"></div>
      </template>
    </d-layout>
  </d-layout-scroll>
</template>

<script>
import TaskBaseHead from './taskBaseTitle.vue'
import TaskDataUploadList from './taskDataUploadList.vue'
import MixinTaskProductForm from '../mixins/mixinTaskProductForm'

export default {
  name: 'taskBaseProductForm',
  components: {
    TaskBaseHead,
    TaskDataUploadList
  },
  mixins: [MixinTaskProductForm],
  data() {
    return {
      dataList: []
    }
  },
  computed: {
    showDataUpload() {
      return this.hasUpload && this.dataList.length > 0
    }
  },
  created() {
    this.hasUpload && this.requestDataList()
  },
  methods: {
    requestDataList() {
      const applyNo = this.applyNo
      const productId = this.productCode
      const matterKey = this.matterKey
      this.$store.dispatch('getDataUploadList', { applyNo, matterKey, productId })
        .then(data => {
          this.dataList = this.dealDataTree(data || [])
          return data
        })
    },
    dealDataTree(data) {
      let list = []
      let tmp = null
      for (let i in data) {
        tmp = data[i] || {}
        if (Array.isArray(tmp.children) && tmp.children.length > 0) {
          if (tmp.hasRelation === 1) {
            const tlist = this.dealDataTree(tmp.children).map(item => Object.assign({}, item, {
              hasRelation: true,
              typeNo: tmp.typeNo,
              name: item.name
            }))
            list = [...list, ...tlist]
          } else {
            list = [...list, ...(this.dealDataTree(tmp.children))]
          }
        } else {
          list.push(tmp)
        }
      }
      return list
    }
  }
}
</script>

<style scoped>
  .block-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
