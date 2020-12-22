/**
 * function: mixinTaskIndex
 * author  : wq
 * update  : 2018/11/28 12:40
 */
export default {
  methods: {
    // 复制对应的属性到已存在的对象上
    deepAssignObject(obj, obj2) {
      obj = obj || {}
      if (!obj2 || typeof obj2 !== 'object') {
        return obj
      }
      Object.keys(obj2).forEach(item => {
        if (Array.isArray(obj2[item])) {
          if (Array.isArray(obj[item])) {
            obj[item] = [...obj[item], ...obj2[item]]
          }
          else {
            obj[item] = obj2[item]
          }
        }
        else if (!obj[item] || typeof obj[item] !== 'object' || !obj2[item] || typeof obj2[item] !== 'object') {
          obj[item] = obj2[item]
        }
        else {
          obj[item] = this.deepAssignObject(obj[item], obj2[item])
        }
      })
      return obj
    },
    validateChildren(bool) {
      const $refs = this.$refs || {}
      let valid = 0
      let info = true
      let ret = false
      Object.keys($refs).forEach(item => {
        if (ret) {
          return false
        }
        if (item.indexOf('valid-') === 0) {
          let ref = $refs[item]
          if (Array.isArray(ref)) {
            ref = ref[0]
          }
          if (ref && typeof ref.doValidate === 'function') {
            valid = ref.doValidate(bool)
            if (valid === false) {
              info = false
              ret = true
              return false
            }
            if (typeof valid === 'object') {
              if (info === true) {
                info = {}
              }
              info = this.deepAssignObject(info, valid)
            }
          }
        }
      })
      return info
    },
    doValidate(bool) {
      return this.validateChildren(bool)
    },
    uploadChildrenCameraImage(data) {
      const $refs = this.$refs || {}
      Object.keys($refs).forEach(item => {
        if (item.indexOf('valid-') === 0) {
          let ref = $refs[item]
          if (Array.isArray(ref)) {
            ref = ref[0]
          }
          if (typeof ref.uploadCameraImage === 'function') {
            ref.uploadCameraImage(data)
          }
        }
      })
    },
    uploadCameraImage(data) {
      this.uploadChildrenCameraImage(data)
    },
    // 将修改的数据还原
    resetChildrenInfo() {
      const $refs = this.$refs || {}
      Object.keys($refs).forEach(item => {
        if (item.indexOf('valid-') === 0) {
          let ref = $refs[item]
          if (Array.isArray(ref)) {
            ref = ref[0]
          }
          if (typeof ref.resetInfo === 'function') {
            ref.resetInfo()
          }
        }
      })
    },
    resetInfo() {
      this.resetChildrenInfo()
    }
  }
}
