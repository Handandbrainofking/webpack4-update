<template>
  <div class="order-list">
    <back-head back-title="特批订单" :beforeBack="onCancel"></back-head>
    <d-search>
      <d-search-input width="800" v-model="params.queryKeyword" @search="doSearch" placeholder="输入订单编号/客户姓名/渠道经理进行搜索"></d-search-input>
    </d-search>
    <d-table :enable-load-more="false" :height="1284" :body-height="100" :head-list="columns" :body-list="ordersList"
      :no-data="isDataEmpty" :filterParams="params" :defineBodyListStyle="listStyle" :selected="isSelected" cell-key="applyNo"
      @search="doSearch" @clickCellBtn="selectItem" @loadFresh="refreshPage">
    </d-table>
    <d-paging v-if="pageCount" :currPage="pageNumber" :totalPage="pageCount" :totalNum="total" :pageSize="pageSize"
      :style="{borderTopWidth:'0'}" @doSkipPage="loadPage"></d-paging>
  </div>
</template>

<script>
import BackHead from '@/components/back/head.vue'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'approval-order-list',
  components: { BackHead },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    selected: {
      type: String,
      default: ''
    }
  },
  data() {
    const self = this
    return {
      params: {
        queryKeyword: '',
        productId: '',
        orderBy: 'appointTime',
        orderType: 'desc',
        applyStatus: ''
      },
      columns: [
        { title: '订单编号', width: 3, key: 'applyNo' },
        { title: '产品名称', width: 3, key: 'productName', key: 'productName' }, //, filterKey: 'productId', filterList: () => this.padProducts
        { title: '客户姓名', width: 2, key: 'sellerName' },
        { title: '渠道经理', width: 2, key: 'salesUserName' },
        { title: '运营跟单人', width: 2, key: 'robUserName' },
        { title: '订单状态', width: 2, formatter: 'dict:orderStatus', key: 'applyStatus', filterKey: 'applyStatus', filterList: 'orderStatus' },
        {
          title: '操作',
          width: 3,
          isBtns: true,
          btns: [
            {
              title: '选择',
              show: item => item.applyNo !== self.selected,
              style: {
                fontSize: '30px',
                backgroundColor: '#02B3B4',
                borderRadius: '4px',
                color: '#ffffff',
                marginLeft: '20px'
              }
            }
          ]
        }
      ],
      ordersList: [],
      listStyle: {
        func(item) {
          if (item && item.applyNo === self.selected) {
            return {
              color: '#02B3B4',
              backgroundColor: '#F7F7F7'
            }
          } else {
            return {
              backgroundColor: '#FFFFFF',
              borderBottomStyle: 'solid',
              borderBottomWidth: '1px',
              borderBottomColor: '#EBEBEB'
            }
          }
          return {}
        }
      },
      isSelected(item) {
        return self.selected === item.applyNo
      }
    }
  },
  computed: {
    ...mapState('approveOrders', ['dataList', 'isNoMore', 'currentItem', 'pageSize', 'pageNumber', 'pageCount', 'total']),
    ...mapState('approveOrders', {
      isDataEmpty: state => state.isEmpty
    })
  },
  mounted() {
    this.doSearch()
  },
  methods: {
    ...mapActions('approveOrders', ['refreshList', 'clear']),
    loadPage(pageNumber) {
      pageNumber = pageNumber || 1
      return this.refreshList({ ...this.params, pageNumber }).then(res => {
        this.ordersList = res.data
        return res
      })
    },
    doSearch() {
      this.loadPage(1)
    },
    refreshPage(resolve, reject) {
      this.loadPage(this.pageNumber).then(res => {
        if (typeof resolve === 'function' && typeof reject === 'function') {
          res.success ? resolve(this.isNoMore) : reject(res.msg)
        }
      })
    },
    selectItem(index, item) {
      this.$emit('select', item)
      this.$emit('update:show', false)
    },
    onCancel() {
      this.$emit('update:show', false)
      this.$emit('close')
    }
  }
}
</script>

<style>
.order-list {
  flex-direction: column;
  flex: 1;
  height: 1700px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
