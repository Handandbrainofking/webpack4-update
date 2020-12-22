/**
 * function: 处理基本的校验验证相关处理
 * author  : wq
 * update  : 2018/11/28 12:40
 */
import Dialog from '@/utils/dialog'
import { native_module_events, DEFINE_UPLOAD_IMAGE_BPMS } from '@/utils/deal_native'
import { Validator } from '@/utils/validator'
import { Dist_List_Get, DISC_ACCOUNT_TYPE } from '@/config/index'

export default {
  props: {
    traceItem: {
      type: Object,
      default: () => ({})
    },
    matterKey: {
      type: String,
      default: ''
    },
    showBtns: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productCode: '',
      applyNo: '',
      chooseOrg: {
        title: '',
        flag: ''
      },
      chooseGroundBank: {
        title: '',
        flag: ''
      },
      camera: {
        title: '',
        flag: ''
      },
      valueChanged: false
    }
  },
  created() {
    this.productCode = this.getPageParams('productType', true)
    this.applyNo = this.getPageParams('applyNo', true)
    // 处理列表的字典
    const info = this.dealInfoCompatibleArray()
    info && info.forEach(item => {
      if (item.disc) {
        item.list = Dist_List_Get(item.disc)
      }
    })
    // 处理其他
    typeof this.afterCreated === 'function' && this.afterCreated()
  },
  methods: {
    // 获取TaskBaseView
    getBaseView() {
      let $ref = this.$refs['task-base-view']
      if (Array.isArray($ref)) {
        $ref = $ref[0]
      }
      return $ref
    },
    // 对info做兼容处理
    dealInfoCompatibleArray() {
      const isTitleArrayConfig = this.isTitleArrayConfig
      const info = this.info
      let list = []
      if (isTitleArrayConfig) {
        info.forEach(item => {
          list = [...list, ...(item.children)]
        })
      }
      else {
        list = info
      }
      return list
    },
    // 判断value是否不存在
    isEmpty(value) {
      return value === '' || value === null || value === undefined
    },
    compareObj(a, b) {
      if (a === b) {
        return true
      }
      if (a === undefined || a === null) {
        return false
      }
      if (typeof a === 'object' && typeof b === 'object' && JSON.stringify(a) === JSON.stringify(b)) {
        return true
      }
      return false
    },
    // 在config列表中寻找某一个名称的数据对象
    findItemByNameBlock(list, name, block) {
      list = list || []
      for (let i = 0, len = list.length; i < len; i++) {
        if (this.compareObj(list[i].key, name)) {
          if (!block || list[i].block === block) {
            return list[i]
          }
        }
        if (list[i].key && Array.isArray(list[i].key)) {
          for (var j = 0; j < list[i].key.length; j++) {
            if (this.compareObj(list[i].key[j], name)) {
              if (!block || list[i].block === block) {
                return list[i]
              }
            }
          }
        }
      }
      return {}
    },
    /**
     * 设置数据中的项, 如果设置的是 value，则同时刷新 changed 属性
     */
    setData(field, prop, val) {
      const config = this.findItemByNameBlock(this.info, field)
      this.$set(config, prop, val)

      if (prop === 'value') {
        this.valueChanged = true
        this.$set(config, 'changed', true)
      }
    },
    /**
     * 获取属性的值 ，默认取 value 值
     */
    getData(field, prop = 'value') {
      const config = this.findItemByNameBlock(this.info, field)
      return config[prop]
    },
    // 基本数据的还原
    initData() {
      const dataItem = JSON.parse(JSON.stringify(this.dataItem || {}))
      const productType = this.productType || 0
      const info = this.dealInfoCompatibleArray()
      info && info.forEach(item => {
        let value
        let value2
        const inner = item.inner
        const block = item.block
        const key = item.key
        const type = item.type
        let blockItem = dataItem
        // 处理是否隐藏
        if (item.productType && productType && !(item.productType & productType)) {
          item.hidden = true
        }
        if (type === 'slot') {
          return item
        }
        if (block) {
          blockItem = blockItem[block] || {}
          if (Array.isArray(blockItem))
          {
            if (block === 'accountList') {
              return false
            }
            if (block === 'orderMatterRecordList') {
              dataItem[block] = blockItem = blockItem.filter(item => item.matterKey === this.matterKey && item.deleteFlag === '0')
                .reverse()
                .sort((item1, item2) => {
                  return item2.handleTime - item1.handleTime
                })[0] || {}
            }
            else {
              dataItem[block] = blockItem = blockItem[0] || {}
            }
          }
        }
        if (inner) {
          blockItem = blockItem[inner] || {}
        }
        if (Array.isArray(key)) {
          value = blockItem[key[0]]
          value2 = blockItem[key[1]]
        } else {
          value = blockItem[key]
        }
        if (value === undefined || value === null) value = ''
        const defaultValue = item.defaultValue
        const list = item.list
        if (value === '' && !this.isEmpty(defaultValue)) {
          if (type !== 'pick' && type === 'select') {
            value = defaultValue
            this.valueChanged = true
            item.changed = true
          }
        }
        if ((type === 'pick' || type === 'select') && Array.isArray(list) && list.length > 0) {
          let idx = -1
          if (!this.isEmpty(value)) {
            idx = this.getIndexByKeyFromArray(list, value)
          }
          else {
            if (!this.isEmpty(defaultValue)) {
              value = defaultValue
              idx = this.getIndexByKeyFromArray(list, value)
              if (idx !== -1) {
                this.valueChanged = true
                item.changed = true
              }
            }
          }
          // 存在默认值并且没有给值，则采用默认值，否则用返回的值
          if (idx === -1 && item.index > -1 && item.index < list.length) {
            idx = item.index
            this.valueChanged = true
            item.changed = true
          }
          item.index = idx
          value = this.getValue(list[idx], 'key')
          if (value !== '0') {
            value2 = this.getValue(list[idx], 'name')
          }
        }
        if (value) {
          if (type === 'date') {
            value = this.formatDate(value, 'YYYY-MM-DD')
          }
          else if (type === 'time') {
            value = this.formatDate(value, 'hh:mm')
          }
          else if (type === 'datetime') {
            value = this.formatDate(value, 'YYYY-MM-DD hh:mm')
          }
        }
        item.value = value
        if (Array.isArray(key)) {
          if (value) {
            item.values = [value, value2]
          }
          else {
            item.values = []
          }
        }
      })
    },
    // 基本数据的校验
    validBaseData(bool, dealContainHidden, title = '', _info) {
      if (!bool && !this.valueChanged) {
        return true
      }
      title = title || ''
      const resultInfo = {}
      let blockItem
      let item
      const info = _info || this.dealInfoCompatibleArray()
      for (let i = 0, len = info.length; i < len; i++) {
        item = info[i]
        // 对于隐藏的或者没有修改的数据不进行获取
        if ((!dealContainHidden && item.hidden) || item.readonly || (!bool && !item.changed)) {
          continue
        }
        if (bool && item.required && !item.value && item.value !== 0) {
          Dialog.toast(title + item.placeholder)
          return false
        }
        if (item.valid && (item.value || item.value === 0)) {
          const msg = Validator[item.valid](item.value)
          if (msg !== 'OK') {
            Dialog.toast(title + msg.replace(/\$\{\w+\}/g, item.label.replace(/\([\S\s]+\)#/, '')))
            return false
          }
        }
        if (!item.changed) {
          continue
        }
        blockItem = resultInfo
        if (item.block) {
          if (!resultInfo[item.block]) {
            resultInfo[item.block] = {}
          }
          blockItem = resultInfo[item.block]
        }
        if (item.inner) {
          if (!blockItem[item.inner]) {
            blockItem[item.inner] = {}
          }
          blockItem = blockItem[item.inner]
        }
        if (Array.isArray(item.key)) {
          item.key.forEach((itm, idx) => {
            blockItem[itm] = item.values[idx] || ''
          })
        } else {
          blockItem[item.key] = item.value
        }
      }
      if (typeof resultInfo === 'object' && Object.keys(resultInfo).length === 0) {
        return true
      }
      return resultInfo
    },
    // 处理列表
    dealPickText(list, item) {
      if (Array.isArray(list) && list.length > 0) {
        const value = item.value
        const defaultIndex = item.index
        const obj = {}
        let index = -1
        if (!this.isEmpty(value)) {
          index = this.getIndexByKeyFromArray(list, value)
        }
        if (index === -1 && defaultIndex > -1 && defaultIndex < list.length) {
          index = defaultIndex
          obj.changed = true
        }
        const tmp = list[index]
        obj.index = index
        obj.list = list
        obj.value = this.getValue(tmp)
        if (Array.isArray(item.key)) {
          obj.values = [this.getValue(tmp), this.getValue(tmp, 'name')]
        }
        return obj
      }
      return null
    },
    // 添加applyNo
    addApplyNo(data, block) {
      if ([
        'applyOrder', 'landCertList', 'queryEstimateList', 'queryArchiveList', 'customerRelList', 'notarizationInfoList',
        'projectAccountList', 'dealInfo', 'newLoan', 'supervisionList', 'oriLoan', 'accountList', 'ransomFloor',
        'houseTransfer', 'isrMixed', 'feeSummary', 'applyOrderExtend','downHouseSurvey'
      ].indexOf(block) > -1) {
        data['applyNo'] = this.applyNo
      }
    },
    // 添加HouseNo
    addHouseNo(data, block) {
      if ([
        'applyOrder', 'landCertList', 'queryEstimateList', 'queryArchiveList', 'dealInfo', 'newLoan', 'supervisionList',
        'oriLoan', 'accountList', 'ransomFloor', 'houseTransfer', 'houseList'].indexOf(block) > -1) {
        data['houseNo'] = this.applyOrder['houseNo']
      }
    },
    // 添加blockId
    addBlockId(data, block) {
      if (block === 'accountList') {
        return data
      }
      if (block === 'orderMatterRecordList') {
        data['id'] = (this.traceItem || {}).id
        return data
      }
      const dataItem = this.dataItem || {}
      if (dataItem[block]) {
        const tmpData = dataItem[block]
        if (Array.isArray(tmpData)) {
          if (tmpData.length > 0) {
            data['id'] = (tmpData[0] || {}).id
          }
        }
        else {
          data['id'] = tmpData.id
        }
      }
      return data
    },
    // 处理交易，增加交易的dealNo
    addDealNo(data, block) {
      if (block === 'dealInfo') {
        data['dealNo'] = ''
      }
      return data
    },
    // 保存时对输入的数据进行处理，增加id等
    dealSaveDataObjectToArray(resultInfo) {
      if (Object.keys(resultInfo).length > 0) {
        Object.keys(resultInfo).forEach(item => {
          const blockItem = resultInfo[item]
          if (!Array.isArray(blockItem)) {
            if (blockItem && typeof blockItem === 'object') {
             
              this.addHouseNo(blockItem, item)
              this.addDealNo(blockItem, item)
              this.addApplyNo(blockItem, item)
              this.addBlockId(blockItem, item)
            }
            resultInfo[item] = [blockItem]
          }
        })
        return resultInfo
      }
      return true
    },
    doValidate(bool) {
      if (!this.showBtns) {
        return true
      }
      let resultInfo = this.validBaseData(bool)
      if (resultInfo === false) {
        return false
      }
      else if (resultInfo === true) {
        return true
      }
      else if (typeof resultInfo === 'object') {
        const data = this.dealSaveDataObjectToArray(resultInfo)
        // 注入保存勾子
        if (typeof this.$options.beforeSave === 'function') {
          return this.$options.beforeSave.bind(this)(bool, data)
        }
        return data
      }
      return true
    },
    /**
     * 其他公用方法
     */
    // 将修改的数据还原
    resetViewBaseInfo() {
      this.valueChanged = false
      const info = this.dealInfoCompatibleArray()
      info.forEach(item => {
        if (item.changed) {
          item.changed = false
        }
      })
    },
    resetInfo() {
      this.resetViewBaseInfo()
    },
    // 更改传递的值
    changeValue(key, idx, item, value) {
      const _value = item.value
      const info = this.info
      if (_value !== value) {
        this.valueChanged = true
        if (Array.isArray(key) && key.length === 2) {
          this.$set(info, idx, Object.assign({}, item, { values: [value, name], value, changed: true }))
        } else {
          this.$set(info, idx, Object.assign({}, item, { value, changed: true }))
        }
      }
    },
    // 处理新贷款人的选择列表， 当选择公司的时候是输入框，当选择个人的时候是选择框
    dealOrgList (dataItem, value, item, prevValue) {
      // 处理新贷款人的选择列表， 当选择公司的时候是输入框，当选择个人的时候是选择框
      const list = (dataItem && dataItem['customerRelList']) || []
      const tmpList = []
      let tmp = ''
      let name = ''
      list.forEach(item => {
        tmp = item.customer || {}
        name = tmp.name || ''
        tmpList.push({
          key: name,
          name: name
        })
      })
      for (let i of tmpList) {
      	item.list && item.list.push(i)
      }
      if (prevValue === 'PERSONAL') {
        item.type = 'pick'
        item.index = this.getIndexByKeyFromArray(tmpList, value)
        item.value = this.getValue(tmpList[item.index])
      } else {
        item.type = 'input'
      }
    },
    // 处理新贷款机构，将对应的编号换成名称
    initOrgList(idx, item) {
      const values = item.values
      if (Array.isArray(values) && values.length === 2) {
        item.value = values[1]
      }
    },
    // 打开新贷款机构
    openLoanBankDialog(key, idx, item, blockIndex) {
      if (this.isInsuranceProduct(this.productCode)) {
        this.doOpenGroundBank(key, idx, item, blockIndex)
      } else {
        this.doOpenChooseOrg(key, idx, item, blockIndex)
      }
    },
    // 打开机构选择
    doOpenChooseOrg(key, idx, item, blockIndex) {
      const dateItem = this.chooseOrg
      dateItem.title = item.label
      dateItem.flag = idx
      dateItem.blockIndex = blockIndex
      const $ref = this.getBaseView()
      if ($ref) {
        $ref.doOpenChooseOrg(dateItem)
      }
    },
    // 打开落地行
    doOpenGroundBank(key, idx, item, blockIndex) {
      const dateItem = this.chooseGroundBank
      dateItem.title = item.label
      dateItem.flag = idx
      dateItem.blockIndex = blockIndex
      dateItem.productCode = this.productCode
      dateItem.capitalCode = this.capitalCode
      const $ref = this.getBaseView()
      if ($ref) {
        $ref.doOpenGroundBank(dateItem)
      }
    },
    // 选择机构
    doChooseOrg(item) {
      const dateItem = this.chooseOrg
      const idx = dateItem.flag
      const blockIndex = dateItem.blockIndex
      let info
      if (blockIndex === undefined) {
        info = this.info
      }
      else {
        info = this.info[blockIndex].children
      }
      this.valueChanged = true
      this.$set(info, idx, Object.assign({}, info[idx], { values: [item.bankCode, item.bankName], value: item.bankName, changed: true }))
    },
    // 选择落地行
    doChooseGroundBank(item) {
      const dateItem = this.chooseGroundBank
      const idx = dateItem.flag
      const blockIndex = dateItem.blockIndex
      let info
      if (blockIndex === undefined) {
        info = this.info
      }
      else {
        info = this.info[blockIndex].children
      }
      this.valueChanged = true
      this.$set(info, idx, Object.assign({}, info[idx], { values: [item.code, item.name], value: item.name, changed: true }))
    },
    // 打开拍照
    openCamera(key, idx, item, blockIndex) {
      const dataItem = this.camera
      dataItem.title = item.label
      dataItem.flag = idx
      dataItem.blockIndex = blockIndex
      dataItem.fileType = item.fileType
      dataItem.fileUploadType = item.fileUploadType
      dataItem.customerNo = ''
      const $ref = this.getBaseView()
      if ($ref) {
        $ref.openCamera(dataItem)
      }
    },
    // 对银行卡进行识别填入
    doAnalysisImage(data, fileId) {
      const bank = this.toJSON(data.bank)
      const dataItem = this.camera
      const idx = dataItem.flag
      let info
      if (dataItem.blockIndex !== undefined) {
        info = this.info[dataItem.blockIndex].children
      }
      else {
        info = this.info
      }
      if (bank.bankCardNumber) {
        info[idx].changed = true
        info[idx].value = bank.bankCardNumber
      }
      this.valueChanged = true
      !this.fileResources && (this.fileResources = {})
      this.fileResources[dataItem.fileUploadType] = fileId
      this.fileResources = fileId
    },
    // 对识别的图像进行上传
    uploadViewCameraImage(data) {
      const fileResources = this.fileResources || {}
      if (Object.keys(fileResources).length > 0) {
        const customerNo = ''
        Object.keys(fileResources).forEach(item => {
          const fileId = fileResources[item]
          const url = []
          for (let i in fileId) {
            url.push(fileId[i])
          }
          native_module_events(DEFINE_UPLOAD_IMAGE_BPMS, this.applyNo, item, url, customerNo, 0)
        })
      }
    }
  }
}
