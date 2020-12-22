/**
 * 图片上传逻辑处理
 * 仅仅处理图片上传、删除相关逻辑
 */
import Dialog from '../utils/dialog'
import {
  native_logMessage,
  native_module_events,
  DEFINE_DELETE_IMAGE,
  DEFINE_UPLOAD_IMAGE,
  DEFINE_UPLOAD_IDCARD,
  DEFINE_UPLOAD_BANKCARD,
  DEFINE_CHOOSE_IMAGE,
  AGAIN_UPLOAD_IMAGE,
  DELETE_DB_IAMGE
} from '../utils/deal_native'

const defaultPickOption = {
  maxSelectCount: 20
}
export default {
  methods: {
    // 删除图像
    doDeleteImg(applyNo, fileType, fileId, item) {
      native_module_events(DEFINE_DELETE_IMAGE, applyNo, fileType, fileId).then(data => {
        Dialog.toast('图片删除成功')
        item.deleted = true
        let i = 0
        let flag = false
        for (i in this.innerUploadList) {
          if (this.innerUploadList[i].deleted) {
            flag = true
            Vue.delete(this.innerUploadList, i)
            this.$emit('changeUploadList', this.innerUploadList.length)
            break
          }
        }
        if (!flag) {
          for (i in this.innerUnloadList) {
            if (this.innerUnloadList[i].deleted) {
              Vue.delete(this.innerUnloadList, i)
              break
            }
          }
        }
        // if (this.innerUnloadList.length < 1 && this.innerUploadList.length < 1) {
        //   'function' === typeof this.doCloseLightbox && this.doCloseLightbox();
        // }
        typeof this.overDeleteImage === 'function' && this.overDeleteImage()
      }, (msg) => {
        Dialog.toast(msg.message || '删除失败')
      })
    },

    // 上传图片
    doUploadClicked(applyNo, fileType, customerNo, analysisType) {
      if (this.innerUploadList && this.innerUploadList.length > 0) {
        // lastSortNo这个图片类型下的最后一张图片的下标
        var lastSortNo = this.innerUploadList[this.innerUploadList.length - 1].sortNo
      }

      if (this.showChooseIcon) {
        Dialog.toast('正在进行选择图片操作，请完成后再进行上传操作！')
        return false
      }
      const options = Object.assign({}, defaultPickOption, this.pickOptions || {})
      var that = this
      // 最大支持20张，支持gif图片
      native_module_events(DEFINE_CHOOSE_IMAGE, options, function (images) {
        native_logMessage('当前选择的图片====' + JSON.stringify(images))
        var image_arr = []
        for (var i = 0; i < images.length; i++) {
          var image = images[i]
          image_arr[i] = image.path
        }
        that.previewImage(image_arr)
        if (analysisType === undefined) {
          that.uploadImage(applyNo, fileType, customerNo, image_arr, lastSortNo)
        } else if (analysisType == '0') {
          // 身份证识别
          that.uploadImageForIdCard(applyNo, fileType, customerNo, image_arr)
        } else {
          // 银行卡识别
          that.uploadImageForBankCard(applyNo, fileType, customerNo, image_arr)
        }
      })
    },

    // 解析身份证；如果有customerNo 就要传
    uploadImageForIdCard(applyNo, fileType, customerNo = '', paths) {
      const data = {
        applyNo, fileType
      }
      if (customerNo) {
        data.customerNo = customerNo
      }
      return native_module_events(DEFINE_UPLOAD_IDCARD, data, paths).then(data => {
        const tdata = this.toJSON(data)
        this.innerUnloadList = []
        this.innerUploadList = [Object.assign({}, tdata, {
          src: 'file://' + tdata.imageLocationPath,
          fileId: tdata.imageKey
        })]
        this.$emit('uploadImage', tdata)
      }).catch(msg => {
        this.innerUploadList = []
        this.innerUnloadList = []
        Dialog.toast('图片识别失败！')
        this.$emit('uploadImage', {})
        throw new Error(msg)
      })
    },
    // 解析银行卡
    uploadImageForBankCard(applyNo, fileType, customerNo, paths) {
      return native_module_events(DEFINE_UPLOAD_BANKCARD, applyNo, fileType, paths).then(data => {
        const tdata = this.toJSON(data)
        this.innerUnloadList = []
        this.innerUploadList = [Object.assign({}, tdata, {
          src: 'file://' + tdata.imageLocationPath,
          fileId: tdata.imageKey
        })]
        this.$emit('uploadImage', tdata)
      }).catch(msg => {
        this.innerUploadList = []
        this.innerUnloadList = []
        Dialog.toast('图片识别失败！')
        this.$emit('uploadImage', {})
        throw new Error(msg)
      })
    },
    // 图片上传失败的处理
    handleUploadImageResultCatch(errorMsg,item) {
      native_logMessage('当前上传的图片失败-', 'errorMsg=' + errorMsg, 'type=' + typeof errorMsg,
        'errorMsg keys=' + JSON.stringify(Object.keys(errorMsg)), 'errorMsg values=' + JSON.stringify(Object.values(errorMsg)))
      Dialog.toast('图片上传失败')

      var temp 
      if(typeof errorMsg === 'object'){//抛出的Error
        temp = (new String(errorMsg.message)).split('fileName=')
      }else{
        temp = ('' + errorMsg).split('fileName=')
      } 

      var fileName;
      if (temp.length < 2){
        fileName = item.fileName
      }else{
        fileName = temp[1].split(' fileId=')[0]
      }
      native_logMessage('===fileName=====' + fileName)
      if(!fileName){
        return;
      }
      for (var i = 0; i < this.innerUnloadList.length; i++) {
        if (this.innerUnloadList[i].src.split(fileName).length > 1) {
          if (this.innerUnloadList[i].againCount > 2) {
            Vue.delete(this.innerUnloadList, i)
            Dialog.toast('图片重传失败超过3次了，则取消这张图片上传了。')
            native_module_events(DELETE_DB_IAMGE,fileName);
            break
          }
          native_logMessage('图片重传次数==' + this.innerUnloadList[i].againCount)
          this.innerUnloadList[i].againUpload = true
          this.innerUnloadList[i].againCount = (this.innerUnloadList[i].againCount || 0) + 1
          break
        }
      }
      this.$emit('changeUnloadList', this.innerUnloadList)

    },
    // 图片上传成功的处理
    handleUploadImageResult(data) {
      native_logMessage('图片上传成功的处理 data=' + JSON.stringify(data))
      for (let i in this.innerUnloadList) {
        if (this.innerUnloadList[i].src === ('file://' + data.imageLocationPath)) {
          const images = this.innerUploadList || []
          images.push(Object.assign({}, data, {
            src: this.innerUnloadList[i].src,
            fileId: data.imageKey,
            sortNo: data.sortNo
          }))
          this.innerUploadList = images.sort((item1, item2) => {
            return item1.sortNo - item2.sortNo
          })

          Vue.delete(this.innerUnloadList, i)
          this.$emit('changeUploadList', this.innerUploadList.length)

          break
        }
      }
      native_logMessage('此次图片上传结束====== data=' + JSON.stringify(data))
    },

    // 重传图片
    againUpload(item) {
      native_logMessage('图片重传 开始====' + JSON.stringify(item))
      Dialog.toast('正在进行图片重传...')
      native_module_events(AGAIN_UPLOAD_IMAGE, item.src,item.fileId, (data) => {
        this.handleUploadImageResult(data)
      }).catch(errorMsg => {
        this.handleUploadImageResultCatch(errorMsg,item)
      })
    },
    // 图片上传
    uploadImage(applyNo, fileType, customerNo = '', paths, lastSortNo) {
      native_logMessage('开始图片上传,applyNo=' + applyNo + ' ，fileType=' + fileType + '，上传了' + paths.length + '张' + ' lastSortNo=' + lastSortNo)
      native_module_events(DEFINE_UPLOAD_IMAGE, applyNo, fileType, customerNo, paths, lastSortNo, (data) => {
        this.handleUploadImageResult(data)
      }).catch(errorMsg => {
        this.handleUploadImageResultCatch(errorMsg)
      })
    },
    // 预览图片
    previewImage(paths) {
      native_logMessage('预览的图片===' + JSON.stringify(paths))
      paths.forEach((item, index) => {
        native_logMessage('预览的图片==item=' + item + '  index=' + index)
        const imageUrl = 'file://' + item
        this.innerUnloadList.push({
          src: imageUrl,
          upload: 1,
          id: index
        })
      })
    }
  }
}
