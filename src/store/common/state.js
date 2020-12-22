/**
 * 生成默认的状态
 * 状态是按模块来的，它会同时包含列表的状态信息与表单的状态信息
 * TIP：用户在做界面切换时如列表切表单 如果有需要可以单独清理相关的数据
 *      在整个模块退出时应该及时把相关的数据都进行清理
 */
export function getDefaultStates() {
  return {
    key: '',
    dict: {}, // 模块字典表

    // 列表相关的配置项
    listMethod: 'POST', // 请求列表的HTTP METHOD
    dataList: [], // 当前显示的列表数据
    currentItemId: 0, // 当前选中的项的id
    pageSize: 10, // 分页大小
    pageCount: 1,
    pageNumber: 1, // 页码
    total: 0, // 总的数据量
    isEmpty: false, // 是否为空列表
    isNoMore: false, // 没有更多
    noData: false, // 没有一条数据
    isLoading: false, // 是否在执行服务端请求
    columns: [], // 显示列的配置
    listUrl: '', // 必填 列表加载URL
    dictMappers: { // 列表字典映射
      // userId: {dict:'users', key:'id', map:'userName'} //取得映射值
    },

    // 表单相关的配置项
    saveUrl: '', // 保存数据的URL
    saveMethod: 'POST', // 保存数据的HTTP METHOD
    currentItem: {}, // 当前在编辑的项
    isDirty: false, // 当前表单是否为脏
    fields: [], // 当前的表单配置
    validators: { // 表单验证器
      // userId:'required|maxLength:30|email'
    },
    pagingMode: 'continuous', // continuous 持续的, single 每次只显示单页
    listPlugin: ['updateItemSeq']
  }
}
