/**
 * function: productList
 * author  : wq
 * update  : 2018/12/17 9:27
 */
import RequestApi from '@/api/index'

export default {
  state: {
    productList: [],
    productDictList: [{ key: '', name: '全部', sort: 0 }]
  },
  mutations: {
    setProductList(state, list) {
      state.productList = list
    },
    setProductDictList(state, list) {
      state.productDictList = [...state.productDictList, ...list]
    }
  },
  actions: {
    requestProductList({ commit, state }, opts) {
      return new Promise((resolve, reject) => {
        const list = state.productList || []
        if (list.length > 0) {
          resolve(list)
        }
        else {
          RequestApi.product_order_list({
            data: opts,
            success: data => {
              // key name sort
              const tmpList = []
              const list = (data || {}).list || []
              list.forEach((item, index) => {
                tmpList.push({
                  sort: index + 1,
                  key: item.productId,
                  name: item.productName
                })
              })
              commit('setProductList', list)
              commit('setProductDictList', list)
              resolve(data)
            }
          })
        }
      })
    }
  }
}
