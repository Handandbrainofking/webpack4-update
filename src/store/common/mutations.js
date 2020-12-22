import {ensure} from './utils'

export default {
  key(state, val) {
    state.key = val
  },
  listMethod(state, method) {
    state.listMethod = method
  },
  dataList(state, data) {
    state.dataList = ensure(data, [])
  },
  currentItem(state, item) {
    state.currentItem = ensure(item, {})
  },
  pageSize(state, val) {
    state.pageSize = val
  },
  pageNumber(state, val) {
    state.pageNumber = val
  },
  total(state, val) {
    state.total = val
  },
  pageCount(state, val) {
    state.pageCount = val
  },
  isEmpty(state, val) {
    state.isEmpty = val
  },
  isNoMore(state, val) {
    state.isNoMore = val
  },
  noData(state, val) {
    state.noData = val
  },
  isLoading(state, val) {
    state.isLoading = val
  },
  columns(state, val) {
    state.columns = val
  },
  listUrl(state, val) {
    state.listUrl = val
  },
  dict(state, val) {
    state.dict = val
  },
  dictMappers(state, mappers) {
    state.dictMappers = mappers
  },
  /**
   *  退出列表时要对列表数据进行回收
   */
  clearListData(state) {
    state.dataList = []
  },
  /**
   * 在退出表单时要对表单数据进行回收
   */
  clearFormData(state) {
    state.currentItem = {}
  },
  /**
   * 退出模块时对字典数据进行回收,在小量数据时建议不做该操作
   */
  clearDict(state) {
    state.dict = {}
  },
  /**
   * 更新字典的值
   */
  updateDict(state, dict) {
    state.dict = {...state.dict, ...dict}
  },
  /**
   * 更新字典键值映射
   */
  updateDictMapper(state, mappers) {
    state.dictMappers = {...state.dictMappers, ...mappers}
  },
  /**
   * 更新表单验证器
   */
  updateValidator(state, validators) {
    state.validators = {...state.validators, ...validators}
  }
}
