/**
 * function: nextMatter
 * author  : wq
 * update  : 2018/12/19 17:14
 */
import RequestApi from '@/api/index'

export default {
  state: {
    nextMatterList: []
  },
  mutations: {
    setNextMatterList(state, list) {
      state.nextMatterList = list
    }
  },
  actions: {
    requestNextMatterList({ commit }, opts) {
      return new Promise((resolve, reject) => {
        RequestApi.get_next_matter_list({
          method: 'GET',
          data: opts,
          success: (data) => {
            const list = (data || []).map(item => ({
              key: item.nextMatterKey,
              name: item.nextMatterName
            }))
            commit('setNextMatterList', list)
            resolve(list)
          }
        })
      })
    }
  }
}
