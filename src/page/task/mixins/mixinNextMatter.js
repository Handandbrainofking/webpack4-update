/**
 * function: mixinNextMatter
 * author  : wq
 * update  : 2018/11/13 14:44
 */
export default {
  methods: {
    // 获取下一个节点信息
    getNextMatterList(productId) {
      const $store = this.$store
      const matterKey = this.matterKey
      return $store.dispatch('requestNextMatterList', { productId, matterKey })
        .then(data => {
          const info = this.info || []
          const item = this.findItemByNameBlock(info, 'nextMatterKey')
          item.list = data
          return data
        })
    },
    // created 完成后处理
    afterCreated() {
      // 如果需要在处理matter事项之前处理其他事情，则可以进行处理
      if (typeof this.beforeDealNextMatter === 'function') {
        this.beforeDealNextMatter()
      }
      this.productType = this.getProductType(this.productCode)
      const applyNo = this.applyNo
      const productCode = this.productCode
      Promise.all([this.getNextMatterList(productCode), this.requestOrderInfo(applyNo)])
        .then(() => {
          this.initData()
          this.initOtherData()
        })
    },
    afterInitData(data) {
      if (typeof this.afterInitInfoData === 'function') {
        this.afterInitInfoData(data)
      }
    },
    // 重写点击提交按钮
    doCommit(func) {
      return this.doBaseCommit(func).then(data => {
        // 填写预计抵押时间后需要生成待办事项
        const info = this.info || []
        const bookMatterKeyItem = this.findItemByNameBlock(info, 'nextMatterKey')
        const bookMatterTimeItem = this.findItemByNameBlock(info, 'nextHandleTime')
        const matterItem = this.getItemByName(bookMatterKeyItem.list, bookMatterKeyItem.value)
        this.requestApi.order_book({
          data: {
            applyNo: this.applyNo,
            matterKey: matterItem.key,
            matterName: matterItem.name,
            appointTime: bookMatterTimeItem.value,
            appointAddress: '',
            currentIsNextMatter: true,
            remark: ''
          },
          success: () => {
            this.$emit('upDateTaskId')
          },
          error: () => {
            this.$emit('upDateTaskId')
          }
        })
      })
    },
    // 重写提交订单信息 保存更新taskId在预约信息之后
    submitOrderInfo(params, info, func) {
      return this.$store.dispatch('submitOrderInfo', params)
        .then(data => {
          
          if (typeof func === 'function') {
            func()
          } else {
            const $ref = this.getBaseView()
            if ($ref && data != 'error') {
              $ref.doCommitSuccess()
            }
          }
        })
    }
  }
}
