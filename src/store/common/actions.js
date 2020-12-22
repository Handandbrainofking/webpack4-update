import {
  Http,
  mapListDict,
  prcessPlugins
} from './utils'

const http = new Http()

export default {
  /**
   * 更新列表行号
   */
  updateItemSeq(store, items) {
    // 更新行号
    let nextNum = 1
    for (let item of items) {
      item.num = nextNum++
    }
    return items
  },
  /**
   * 获取数据列表
   * 1. 取得数据列表
   * 2. 把字典数据进行自动映射
   * 3. 返回promise
   */
  loadList({
    state,
    commit,
    rootState,
    dispatch
  }, params) {
    // 设置加载中
    commit('isLoading', true)
    let method = state.listMethod.toUpperCase()
    let queryParams = {
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      beforeSend: 1,
      ...params
    }

    let httpParams = {
      method: method
    }

    if (method === 'POST' || method === 'PUT') {
      httpParams.data = queryParams
    } else {
      httpParams.params = queryParams
    }

    const promise = http.http(state.listUrl, httpParams)

    return promise.then(result => {
      /** ************生成字典映射************* */
      let list = mapListDict(state, rootState, result.list || [])

      // 提交运行结果
      const doCommit = (list) => {
        /** **************COMMIT 数据*********** */
        commit('isLoading', false)
        commit('total', result.total)
        commit('pageCount', result.pages)
        commit('isEmpty', !result.total)
        // 如果是没有一页数据
        commit('noData', result.pages === 0)
        commit('isNoMore', result.isLastPage)

        return { success: true, data: list }
      }

      // 列表数据处理插件执行
      if (state.listPlugin) {
        return prcessPlugins(dispatch, state.listPlugin, list).then(list => {
          return doCommit(list)
        })
      } else {
        return doCommit(list)
      }
    }, err => {
      return {
        success: false,
        data: err.message
      }
    })
  },
  /**
   * 加载指定页数据
   */
  loadPage({
    state,
    commit,
    dispatch
  }, params) {
    return dispatch('loadList', params).then(res => {
      if (res.success) {
        // 更新行号
        const pageNum = state.pageNumber
        const pageSize = state.pageSize
        const baseNum = (pageNum - 1) * pageSize + 1
        for (let index = 0; index < res.data.length; index++) {
          res.data[index].num = baseNum + index
        }

        // 分页模式可以分为持续的，和单页两种 continuous / single
        if (state.pagingMode === 'single') {
          commit('dataList', [...res.data])
        } else {
          commit('dataList', [...state.dataList, ...res.data])
        }
        return {
          success: true,
          data: state.dataList
        }
      } else {
        return res
      }
    })
  },
  /**
   * 加载下一页
   */
  loadNextPage({
    state,
    commit,
    dispatch
  }, params) {
    commit('pageNumber', state.pageNumber + 1)
    return dispatch('loadPage', params)
  },
  /**
   * 刷新列表，默认从第一页开始展示
   */
  refreshLoad({
    state,
    commit,
    dispatch
  }, params) {
    commit('pageNumber', 1)
    return dispatch('loadPage', params)
  },

  /**
   * 保存表单修改
   */
  saveUpdate({
    commit,
    state
  }, params) {
    commit('isLoading', true)
    return http.http(state.saveUrl, {
      method: state.saveMethod,
      data: params || state.currentItem
    }).then(res => {
      commit('isLoading', false)
      return res
    }, err => {
      commit('isLoading', false)
      return {
        success: false,
        msg: err.message
      }
    })
  },

  clear({
    commit
  }) {
    commit('clearListData')
  }
}
