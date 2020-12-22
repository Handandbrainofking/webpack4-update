<template>
  <div class="data-detail-box">
    <back-head></back-head>
    <div class="main-box">
      <data-detail-left
         v-if="show"
         :list-menu="navList"
         :initIndex="initNavTab"
         @doChangeItem="doChangeItem"
      ></data-detail-left>
      <data-detail-right
         v-if="show"
         ref="data-detail-right"
         :list="childList"
         :nav-index="currentIndex"
      ></data-detail-right>
    </div>
  </div>
</template>

<script>
import BackHead from '@/components/back/head.vue'
import DataDetailLeft from './data-detail-cps/left.vue'
import DataDetailRight from './data-detail-cps/right.vue'

export default {
  name: 'data-list',
  statistics: 'data-detail|资料管理详情',
  components: {
    BackHead,
    DataDetailLeft,
    DataDetailRight
  },
  data() {
    return {
      initNavTab: 0,
      currentItem: {},
      currentIndex: 0,
      navList: [],
      show: false
    }
  },
  computed: {
    childList() {
      const tdata = this.treeMenuList || []
      const list = []
      let tmp = null
      const tList = tdata[this.currentIndex].children
      for (let i in tList) {
        if (tList[i].hasRelation === 1) {
          tmp = tList[i]
          for (let j in tmp.children) {
            list.push(Object.assign({}, tmp, tmp.children[j], {children: null}))
          }
        } else {
          list.push(Object.assign({}, tList[i], {children: null}))
        }
      }
      return list.sort(function (item1, item2) {
        if (item1.typeNo < item2.typeNo) {
          return -1
        }
        if (item1.typeNo > item2.typeNo) {
          return 1
        }
        return 0
      })
    }
  },
  beforeMount() {
    const navIndex = this.getPageParams('currentTab', true) || 0
    this.initNavTab = this.currentIndex = navIndex
    const applyNo = this.getPageParams('orderId', true)
    const productId = this.getPageParams('productId', true)
    this.requestList(applyNo, productId).then((obj) => {
      this.productTree(obj.MenuList, obj.DataList)
      //  提交到百度统计
      this.commitStastics()
    })
  },
  methods: {
    // 请求数据
    requestList(applyNo, productId) {
      const self = this
      return new Promise(function (resolve, reject) {
        const maxRequestNum = 2
        let requestNum = 0
        let MenuList = null
        let DataList = null
        self.getMenuList(applyNo, productId, (data) => {
          MenuList = data
          if (++requestNum >= maxRequestNum) {
            resolve({MenuList, DataList})
          }
        })
        self.getFileList(applyNo, (data) => {
          DataList = data
          if (++requestNum >= maxRequestNum) {
            resolve({MenuList, DataList})
          }
        })
      })
    },
    // 获取资料菜单列表
    getMenuList(applyNo, productId, success) {
      this.requestApi.task_data_list({
        data: {
          applyNo,
          productId
        },
        success
      })
    },
    // 获取文件
    getFileList(applyNo, success) {
      this.requestApi.data_menu_list({
        data: {
          applyNo
        },
        success
      })
    },
    // 合并资料项到树
    productTree(menuList, dataList) {
      const _menuList = (menuList || []).sort(function (item1, item2) {
        if (item1.typeNo < item2.typeNo) {
          return -1
        }
        if (item1.typeNo > item2.typeNo) {
          return 1
        }
        return 0
      })
      const _dataList = dataList || []
      const obj = {}
      let tmp = null
      _dataList.forEach(item => {
        tmp = item.typeNo
        if (item.deleteFlag !== '0') return false
        if (!obj[tmp]) {
          obj[tmp] = []
        }
        obj[tmp].push(item)
        if (item.custNo) {
          tmp = item.typeNo + '-' + item.custNo
          if (!obj[tmp]) {
            obj[tmp] = []
          }
          obj[tmp].push(item)
        }
      })
      // 将三级目录变成二级目录;

      // 处理树，将资料项放入树中
      function doTree(data) {
        if (data.hasRelation === 1) {
          let tmp
          for (let i in data.children) {
            tmp = data.children[i]
            tmp.children = obj[data.typeNo + '-' + tmp.custNo] || []
            tmp.total = tmp.children.length || 0
            if (tmp.total > 0) {
              tmp.fileId = tmp.children[0].fileId
            }
          }
          return true
        }
        if (!data.children || data.children.length === 0) {
          data.children = obj[data.typeNo] || []
          data.total = data.children.length || 0
          if (data.total > 0) {
            data.fileId = data.children[0].fileId
          }
          return true
        }
        for (let i in data.children) {
          doTree(data.children[i])
        }
      }

      const navList = []
      _menuList.forEach(item => {
        navList.push(Object.assign({}, item, {children: []}))
        doTree(item)
      })
      this.navList = navList
      this.treeMenuList = _menuList
      console.log(this.treeMenuList, obj)
      this.show = true
    },

    // 请求列表菜单
    doChangeItem(item, index) {
      this.currentIndex = index
      this.currentItem = item
    }
  }
}
</script>
<style lang="sass" type="text/scss" scoped>
  .data-detail-box {
    @include setWindowWH();
  }

  .main-box {
    flex-direction: row;
    width: $window_width - 40 + px;
    height: $window_height - $back_head_height + px;
    background-color: $color_white;
    padding-bottom: $normal_gap_bottom;
    @include setMarginH($normal_gap_left);
  }
</style>
