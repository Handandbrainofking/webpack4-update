/**
 * 提取列表的分页方法
 */
import { native_eventStatistic } from '@/utils/deal_native'
export default {
  data() {
    return {
      load_refresh: true,
      load_more: false,
      noData: false,
      currentPage: 1,
      totalPage: 0,
      totalNum: 0,
      perNum: 11,
      isLoaded: false,
      params: {}, // 允许多搜索条件，默认可以带四组不同的搜索条件，支持条件返回重置
      params_0: {},
      params_1: {},
      params_2: {},
      params_3: {},
      _scrollY: -1,
      scrollY: -1,
      loadedItemsSize: 0
    }
  },
  methods: {
    /**
     * 初始化查询参数
     */
    initSearchParams() {
      let searchParams = this.$store.state.search.searchParams || '{}' // this.$store.state.search.searchParams || {}
      // 初始化定制参数
      searchParams = searchParams || {}
      const paramIndex = searchParams.paramIndex
      this._scrollY = searchParams.scrollTop || 0
      this.loadedItemsSize = searchParams.total || 0

      // 定制的参数都会根据this.params进行补充
      for (let i = 0; i < 4; i++) {
        this[`params_${i}`] = this.extend(this.params, searchParams[`params_${i}`])
      }
      this.params = {...this.params, ...this[`params_${paramIndex}`]}
      return this.params
    },
    /**
     * 取得查询参数
     */
    restoreSearchParams(scrollTop = 0) {
      let paramIndex = 0
      for (let i = 0; i < 4; i++) {
        if (this.params === this[`params_${i}`]) {
          paramIndex = i
          break
        }
      }

      let total = this.perNum < this.bodyList.length ? this.bodyList.length : this.perNum
      const searchParams = {
        paramIndex,
        total,
        scrollTop: this.scrollY,
        params_0: this.params_0,
        params_1: this.params_1,
        params_2: this.params_2,
        params_3: this.params_3
      }
      return JSON.stringify(searchParams)
    },
    /**
     * 激活定制参数
     * @param {Number} index 定制参数的下标 0-3
     */
    useParams(index) {
      this.params = this[`params_${index}`] || {}
      return this.params
    },
    /**
     * 清除参数 ，同时清除storage和store中的
     */
    clearParams() {
      this.clearPageParams(true)
      this.$store.commit('clearSearchParams')
    },
    // 请求列表
    requestList(page = 1, direct, success, error, size = this.perNum) {
      const dataObject = Object.assign({}, {
        pageNumber: page,
        pageSize: size
      }, this.params)

      this.requestApi[this.requestListKey]({
        data: dataObject,
        beforeSend: !!direct,
        success: (data) => {
          this.dealRequestDataList(data, page, direct, success, error, size)
        },
        error
      })
    },
    dealRequestDataList(data, page, direct, success, error, size) {
      let tData
      if (data.length) {
        tData = data || []
      } else {
        tData = (data || {}).list || []
      }
      const total = (data || {}).total || 0
      this.total = total
      this.totalPage = (data || {}).pages || 0
      this.totalNum = (data || {}).total || 0
      const noNext = tData.length < size
      if (page === 1) {
        this.load_refresh = true
      } else {
        this.load_refresh = false
      }
      typeof this.formatListData === 'function' && (tData = this.formatListData(tData))
      tData.forEach((item, index) => {
        item.num = (page - 1) * size + index + 1
        if ((item.productId === 'TFB_YSL_NJY_ISR' || item.productId === 'TFB_NSL_NJY_ISR') && item.thirdpartyName && item.thirdpartyName === 'WZB') {
          item.showTagp1 = true
        } else {
          item.showTagp1 = false
        }
        item.showSymbolSpecial = item.isSpecialApproved === '1'
      })
      if (direct === 1) {
        this.bodyList = [...(this.bodyList), ...tData]
      } else {
        this.bodyList = tData
      }
      // 保留下拉加载
      this.load_more = !noNext
      this.load_more = this.bodyList.length < total
      this.noData = this.bodyList.length <= 0 && total === 0
      typeof success === 'function' && success(noNext, total)
      typeof this.$options.onDataLoaded === 'function' && this.$options.onDataLoaded.bind(this)(this.bodyList)
    },
    loadMore(success, error) {
      this.requestList(++this.currentPage, 1, success, error)
    },
    loadFresh(success, error) {
      this.requestList(1, 2, success, error)
    },
    refreshPage(success, error) {
      this.requestList(this.currentPage, 2, success, error)
    },
    // 清除保存的搜索条件
    clearSearchParams() {
      this.$store.commit('clearSearchParams')
    },
    doSkipPage(page) {
      this.requestList(this.currentPage = page)
    }
  }
}
