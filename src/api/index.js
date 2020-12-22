/**
 * write by wangqiang 2018-03-30
 *
 * 协议拦截接口定义
 */
import DefineApi from './defined'
import RequestObj from './api'

/**
 *
 * @type {{login: requestApi.login}}
 * options 参数和ajax方式一样
 *  method: "POST",  // (String) (GET | POST | PUT | PATCH | DELETE | HEAD, default: POST)
 *  headers: {},     // (Object) default: {}
 *  type: "JSON",    // (String) (json | jsonp | text, default: json)
 *  data: null       // (Object) default: null
 *  success：function// 成功处理方法（会将协议里面的data作为参数传入回掉函数中）
 *  error  ：function// 错误处理，默认进行了错误弹框处理，需要特殊处理的可以调用
 *  beforeSend：function 发送协议是做的处理，默认的是弹出加载请求处理中的旋转
 */
const requestApi = {
  get_verify_num: options => {
    RequestObj.sendRequest(DefineApi.get_verify_num, options)
  },
  login_temp_code: options => {
    RequestObj.sendRequest(DefineApi.login_temp_code, options)
  },

  login: options => {
    RequestObj.sendRequest(DefineApi.get_access_token, options)
  },

  logout: options => {
    RequestObj.sendRequest(DefineApi.logout, options)
  },

  get_access_token: options => {
    RequestObj.sendRequest(DefineApi.get_access_token, options)
  },

  /**
   * 公共数据获取
   * @param options
   */
  // 获取用户信息
  user_info: options => {
    RequestObj.sendRequest(DefineApi.user_info, options)
  },

  // 获取机构(银行)列表
  bank_list: options => {
    RequestObj.sendRequest(DefineApi.bank_list, options)
  },

  // 获取首页个人待办和跟踪订单数量
  // home_list_num: (options) => {
  //   RequestObj.sendRequest(DefineApi.home_list_num, options);
  // },
  // 首页个人待办列表
  home_custom_list: options => {
    RequestObj.sendRequest(DefineApi.home_custom_list, options)
  },
  // 首页个人待办列表置顶
  home_custom_set_top: options => {
    RequestObj.sendRequest(DefineApi.home_custom_set_top, options)
  },

  // 首页个人待办列表取消置顶
  home_custom_cancel_set_top: options => {
    RequestObj.sendRequest(DefineApi.home_custom_cancel_set_top, options)
  },

  // 首页跟踪单据明细列表
  home_track_list_detail: options => {
    RequestObj.sendRequest(DefineApi.home_track_list_detail, options)
  },
  // 首页跟踪单据汇总列表
  home_track_list_summary: options => {
    RequestObj.sendRequest(DefineApi.home_track_list_summary, options)
  },
  // 首页加载抢单池数据列表
  home_rob_doc: options => {
    RequestObj.sendRequest(DefineApi.home_rob_doc, options)
  },
  home_transfer_order: options => {
    RequestObj.sendRequest(DefineApi.home_transfer_order, options)
  },
  // 订单管理列表
  order_management_list: options => {
    RequestObj.sendRequest(DefineApi.order_management_list, options)
  },
  order_summary_list: options => {
    RequestObj.sendRequest(DefineApi.order_summary_list, options)
  },
  book_matter: options => {
    RequestObj.sendRequest(DefineApi.book_matter, options)
  },

  order_release: options => {
    RequestObj.sendRequest(DefineApi.order_release, options)
  },

  order_book_conflict: options => {
    RequestObj.sendRequest(DefineApi.order_book_conflict, options)
  },

  order_book: options => {
    RequestObj.sendRequest(DefineApi.order_book, options)
  },

  // 根據任務節點獲取預約信息
  order_book_info: options => {
    RequestObj.sendRequest(DefineApi.order_book_info, options)
  },

  //

  // 获取订单信息
  order_info: options => {
    RequestObj.sendRequest(DefineApi.order_info, options)
  },

  // 获取待办资料列表
  task_data_list: options => {
    RequestObj.sendRequest(DefineApi.task_data_list, options)
  },

  // 获取合作机构列表
  org_list: options => {
    RequestObj.sendRequest(DefineApi.org_list, options)
  },

  get_next_matter_list: options => {
    RequestObj.sendRequest(DefineApi.get_next_matter_list, options)
  },
  // 请求产品期限
  product_limit_list: options => {
    RequestObj.sendRequest(DefineApi.product_limit_list, options)
  },

  // 消息部分
  message_list: options => {
    RequestObj.sendRequest(DefineApi.message_list, options)
  },
   // 获取最新消息
  get_top_messages: options => {
    RequestObj.sendRequest(DefineApi.get_top_messages, options)
  },
  message_set_status: options => {
    RequestObj.sendRequest(DefineApi.message_set_status, options)
  },
  get_notice_detail: options => {
    RequestObj.sendRequest(DefineApi.get_notice_detail, options)
  },

  /**
   * 产品关联
   * @param options
   */
  // 关联产品列表
  product_list: options => {
    RequestObj.sendRequest(DefineApi.product_list, options)
  },

  associate_product_query: options => {
    RequestObj.sendRequest(DefineApi.associate_product_query, options)
  },

  // 关联处理
  do_product_associate: options => {
    RequestObj.sendRequest(DefineApi.do_product_associate, options)
  },

  // 请求诉讼详情
  litigation_info: options => {
    RequestObj.sendRequest(DefineApi.litigation_info, options)
  },

  // 查询工商信息
  business_info: options => {
    RequestObj.sendRequest(DefineApi.business_info, options)
  },

  // 增加工商信息
  business_add: options => {
    RequestObj.sendRequest(DefineApi.business_add, options)
  },

  // 历史审批
  history_approval: options => {
    RequestObj.sendRequest(DefineApi.history_approval, options)
  },

  /**
   * 待办内容处理
   */
  order_info_save: options => {
    RequestObj.sendRequest(DefineApi.order_info_save, options)
  },

  order_info_submit: options => {
    RequestObj.sendRequest(DefineApi.order_info_submit, options)
  },

  /**
   * 资料管理部分
   * @param options
   */

  data_list: options => {
    RequestObj.sendRequest(DefineApi.data_list, options)
  },

  data_menu_list: options => {
    RequestObj.sendRequest(DefineApi.data_menu_list, options)
  },

  data_image_kind_list: options => {
    RequestObj.sendRequest(DefineApi.data_image_kind_list, options)
  },

  data_image_list: options => {
    RequestObj.sendRequest(DefineApi.data_image_list, options)
  },

  data_image_delete: options => {
    RequestObj.sendRequest(DefineApi.data_image_delete, options)
  },

  // 获取待办节点列表
  node_todo_list: options => {
    RequestObj.sendRequest(DefineApi.node_todo_list, options)
  },

  // 获取跟踪节点列表
  node_track_list: options => {
    RequestObj.sendRequest(DefineApi.node_track_list, options)
  },

  task_customer_list: options => {
    RequestObj.sendRequest(DefineApi.task_customer_list, options)
  },

  // 跟踪订单 展示列表
  order_info_status: options => {
    RequestObj.sendRequest(DefineApi.order_info_status, options)
  },
  order_approve_status: options => {
    RequestObj.sendRequest(DefineApi.order_approve_status, options)
  },
  order_detail: options => {
    RequestObj.sendRequest(DefineApi.order_detail, options)
  },
  node_state_change: options => {
    RequestObj.sendRequest(DefineApi.node_state_change, options)
  },
  man_check_agree: options => {
    // 人工审核通过
    RequestObj.sendRequest(DefineApi.man_check_agree, options)
  },
  // 杭州银行搭配提放保查询
  get_query_docking_result: options => {
    RequestObj.sendRequest(DefineApi.get_query_docking_result, options)
  },
  get_message_total: options => {
    RequestObj.sendRequest(DefineApi.get_message_total, options)
  },
  // 公证处信息查询
  notary_info: options => {
    RequestObj.sendRequest(DefineApi.notary_info, options)
  },
  //  发起初审
  first_approval: options => {
    RequestObj.sendRequest(DefineApi.first_approval, options)
  },

  //  更新发起初审结果
  updateFirstApproval: options => {
    RequestObj.sendRequest(DefineApi.update_approval, options)
  },

  // 要件管理列表
  important_doc_list: options => {
    RequestObj.sendRequest(DefineApi.important_doc_list, options)
  },
  // 要件外借列表
  important_doc_borrow_list: options => {
    RequestObj.sendRequest(DefineApi.important_doc_borrow_list, options)
  },
  // 申请要件
  apply_borrow: options => {
    RequestObj.sendRequest(DefineApi.apply_borrow, options)
  },
  // 完结要件
  apply_finish: options => {
    RequestObj.sendRequest(DefineApi.apply_finish, options)
  },
  // 要件详情
  important_doc_details: options => {
    RequestObj.sendRequest(DefineApi.important_doc_details, options)
  },
  // 公司账户列表
  company_account_list: options => {
    RequestObj.sendRequest(DefineApi.company_account_list, options)
  },
  // 回款记录列表
  fund_back_list: options => {
    RequestObj.sendRequest(DefineApi.fund_back_list, options)
  },
  // 垫资模块查询
  fund_advance: options => {
    RequestObj.sendRequest(DefineApi.fund_advance, options)
  },
  // 借款金额总额
  fund_amount_total: options => {
    RequestObj.sendRequest(DefineApi.fund_amount_total, options)
  },
  // 删除回款记录
  fund_delete_list: options => {
    RequestObj.sendRequest(DefineApi.fund_delete_list, options)
  },
  // 增加回款记录
  fund_addback_account: options => {
    RequestObj.sendRequest(DefineApi.fund_addback_account, options)
  },
  // 默认值接口
  fund_default_value: options => {
    RequestObj.sendRequest(DefineApi.fund_default_value, options)
  },
  // 业务终止接口
  interview_stop: options => {
    RequestObj.sendRequest(DefineApi.interview_stop, options)
  },
  // 面签房产区域列表接口
  company_area_list: options => {
    RequestObj.sendRequest(DefineApi.company_area_list, options)
  },
  order_place: options => {
    RequestObj.sendRequest(DefineApi.order_place, options)
  },
  // 征信状态查询接口
  credit_channel_list: options => {
    RequestObj.sendRequest(DefineApi.credit_channel_list, options)
  },
  // 中兰德征信查询
  credit_zld_list: options => {
    RequestObj.sendRequest(DefineApi.credit_zld_list, options)
  },
  product_order_list: options => {
    RequestObj.sendRequest(DefineApi.product_order_list, options)
  },
  // 公司诉讼查询列表
  company_litigation_list: options => {
    RequestObj.sendRequest(DefineApi.company_litigation_list, options)
  },
  // 公司诉讼查询接口
  company_litigation_detail: options => {
    RequestObj.sendRequest(DefineApi.company_litigation_detail, options)
  },
  // 公司诉讼查询详情
  company_detail_content: options => {
    RequestObj.sendRequest(DefineApi.company_detail_content, options)
  },
  // 征信概要信息
  credit_summary_message: options => {
    RequestObj.sendRequest(DefineApi.credit_summary_message, options)
  },
  // 征信概要信息
  credit_detail_message: options => {
    RequestObj.sendRequest(DefineApi.credit_detail_message, options)
  },
  history_num: options => {
    RequestObj.sendRequest(DefineApi.history_num, options)
  },
  performance_detail: options => {
    RequestObj.sendRequest(DefineApi.performance_detail, options)
  },
  my_performance: options => {
    RequestObj.sendRequest(DefineApi.my_performance, options)
  },
  order_performance: options => {
    RequestObj.sendRequest(DefineApi.order_performance, options)
  },
  operate_list: options => {
    RequestObj.sendRequest(DefineApi.operate_list, options)
  },
  performance_rule: options => {
    RequestObj.sendRequest(DefineApi.performance_rule, options)
  },
  performance_max: options => {
    RequestObj.sendRequest(DefineApi.performance_max, options)
  },
  collect_order_matter: options => {
    RequestObj.sendRequest(DefineApi.collect_order_matter, options)
  },
  order_key_info: options => {
    RequestObj.sendRequest(DefineApi.order_key_info, options)
  },
  matter_type: options => {
    RequestObj.sendRequest(DefineApi.matter_type, options)
  },
  home_track_set_top: options => {
    RequestObj.sendRequest(DefineApi.home_track_set_top, options)
  },
  // 风险特批审批历史
  special_approval_history: options => {
    RequestObj.sendRequest(DefineApi.special_approval_history, options)
  },
  // 订单下的审批列表
  order_approval_list: options => {
    RequestObj.sendRequest(DefineApi.order_approval_list, options)
  },
  // 特批驳回提交补充说明
  submit_supplement: options => {
    RequestObj.sendRequest(DefineApi.submit_supplement, options)
  }
}

export default requestApi
