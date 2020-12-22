<template>
  <div class="container-wrap">
    <back-head back-title="关联产品" titleWidth="2120"></back-head>
    <d-add-list
       v-if="show"
       ref="add-list-comp"
       class="add-list-wrap"
       :list="serverList"
       title="关联产品"
       :height="620"
       :can-edit-server="false">
      <form-product
         slot-scope="product"
         :data-item="product.listItem"
         :ref="`product-item-${product.listItem.idx}`"></form-product>
    </d-add-list>
    <div class="btn-wrap">
      <text class="btn-commit" @click="doCommit">提交</text>
    </div>
  </div>
</template>

<script>
import BackHead from '@/components/back/head.vue'
import Dialog from '@/utils/dialog'
import FormProduct from './form_product.vue'

export default {
  components: {
    BackHead,
    FormProduct
  },
  data() {
    return {
      serverList: [],
      show: false,
      commitBtnStatus:false
    }
  },
  beforeMount() {
    const applyNo = this.applyNo = this.getPageParams('applyNo')
    this.requestList(applyNo)
  },
  methods: {
    // 请求关联产品列表
    requestList(applyNo) {
      this.requestApi.product_list({
        data: {
          applyNo
        },
        success: (data) => {
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].applyNo == this.applyNo) {
                data.splice(i, 1)
              }
            }
          }
          this.serverList = data || {}
          this.show = true
        }
      })
    },
    // 发起关联产品
    doCommitProductAssociate(data) {
      return new Promise((resolve) =>{
        this.requestApi.do_product_associate({
          data,
          success: () => {
            Dialog.toast('关联产品成功').then(() => {
              // this.back(true);
              // this.show = false
              // this.requestList(this.applyNo);
              const list = []
              const listComp = this.$refs['add-list-comp']
              const refs = this.$refs || {}
              for (let i in refs) {
                if (i.indexOf('product-item-') === 0) {
                  const ref = refs[i]
                  const isServer = ref.dataItem.isServer
                  if (!isServer) {
                    list.push(Object.assign({}, ref.doValidate(), {
                      isServer: true
                    }))
                  }
                }
              }
              for (let item of list) {
                item.loanNodeName = item.tailReleaseName
              }
              this.serverList = [...this.serverList, ...list]
              console.log('this.serverList', this.serverList)
              listComp.innerList = []
              resolve();
            })
          }
        })
      })
      
    },
    doValidate(needValidate) {
      const _refs = this.$refs
      const _info = []
      let tmp = null
      for (let i in _refs) {
        if (!_refs[i]) {
          delete _refs[i]
          continue
        }
        if (i.indexOf('product-item') === 0) {
          if (!(tmp = _refs[i].doValidate(needValidate))) {
            return
          }
          if (tmp !== true) {
            _info.push(tmp)
          }
        }
      }
      return {
        applyNo: this.applyNo,
        relateProducts: _info
      }
    },

    doCommit() {
      const _info = this.doValidate(true)
      if (!_info) {
        return false
      }
      if (_info.relateProducts.length < 1) {
        Dialog.toast('您没有添加关联产品,无需提交')
        return
      }
      if(this.commitBtnStatus){
        Dialog.toast('请稍后，正在提交中')
        return;
      }
      this.commitBtnStatus = true;

      this.doCommitProductAssociate(_info).then(()=>{
        this.commitBtnStatus = false;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container-wrap {
    flex-direction: column;
    @include setWindowWH();
  }

  .add-list-wrap {
    flex: 1;
    background-color: $color_white;
    @include setMarginH($normal_gap_left);
  }

  .btn-wrap {
    background-color: $color_white;
    @include setMarginH($normal_gap_left);
    @include setPaddingV($normal_gap_bottom);
    align-items: center;
    justify-content: center;
  }

  .btn-commit {
    width: 480px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    border-radius: 4px;
    background-color: rgba(2, 179, 180, .7);
    color: $color_white;
    font-size: $btn_font;
  }

</style>
