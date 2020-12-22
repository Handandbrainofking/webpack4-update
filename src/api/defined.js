/**
 * @type {{login: string}}
 * url 协议定义
 */

const defineApi = {
  'get_access_token': '/mobileapp/api/login/getAccessToken',
  'login_temp_code': '/mobileapp/api/login/getgotourl?loginTmpCode=123456',
  'logout': '/mobileapp/api/login/logout',
  'get_verify_num': '/mobileapp/api/login/getverifycode',

  user_info: `/bpmsx/sys/user/v1/getUserInfo`,
  bank_list: '/bpmsx/product/bank/v1/getBankInfo',
  org_list: `/bpmsx/product/cooperate/v1/getCooperateInfo`,
  product_limit_list: `/bpmsx/product/v1/getProductLoans`,
  get_next_matter_list: `/bpmsx/order/matter/v1/getNextMatterList`,

  /**
   * 首页
   */
  home_custom_list: `/bpmsx/order/matter/v1/getWaitingTaskList`,
  home_custom_set_top: `/bpmsx/order/appoint/v1/urgent/set`,
  home_custom_cancel_set_top: `/bpmsx/order/appoint/v1/urgent/cancel`,
  home_track_list_detail: `/bpmsx/order/list/v1/getFollowOrderList`,
  home_track_list_summary: `/bpmsx/order/list/v1/summaryFollowOrderList/get`,
  home_rob_doc: `/bpmsx/order/appoint/v1/roblist`,
  home_transfer_order: `/bpmsx/order/appoint/v1/transferOrderPool`,
  order_release: `/bpmsx/order/handle/v1/releaseOrder`,
  order_book: `/bpmsx/order/appoint/v1/appointSave`,
  order_book_conflict: `/bpmsx/order/appoint/v1/getConflictAppoints`,
  order_book_info: `/bpmsx/order/appoint/v1/get`,
  book_matter: `/bpmsx/order/matter/v1/getUndoMatters`,
  /**
   * 订单
   */
  order_info: `/bpmsx/order/info/v1/getOrderModuleInfo`,
  task_data_list: `/bpmsx/order/material/v1/getListNodeMaterialTypesTree`,
  order_management_list: `/bpmsx/order/info/v1/getOrderManagementList`,
  order_summary_list: `/bpmsx//order/info/v1/orderManagementSummaryList`,

  'message_list': '/bpmsx/order/handle/v1/getMessages',
  'get_top_messages': '/bpmsx/order/handle/v1/getTopMessages',
  'message_set_status': '/bpmsx/order/handle/v1/setMessageStatus',
  'get_notice_detail': '/bpmsx/sys/notice/v1/getNoticeDetail',

  order_info_submit: `/bpmsx/order/handle/v1/completeTask`,
  order_info_save: `/bpmsx/order/handle/v1/saveTask`,

  /** *************** 产品关联部分 ********************/
  product_list: `/bpmsx/order/relates/v1/getProductInfo`,
  associate_product_query: `/bpmsx/order/relates/v1/queryRelatesParameter`,
  do_product_associate: `/bpmsx/order/relates/v1/sendRelatesProduct`,
  /** ************** 产品关联部分 end ********************/

  litigation_info: `/bpmsx/order/litigation/v1/grss`,
  business_info: `/bpmsx/order/businessinfo/v1/list`,
  business_add: `/bpmsx/order/businessinfo/v1/start`,
  history_approval: `/bpmsx/order/matter/v1/checkOpinionList/get`,

  data_list: `/bpmsx/order/material/v1/getCustMaterialList`,
  data_menu_list: `/bpmsx/order/material/v1/getMaterialByApplyNo`,
  'data_image_kind_list': 'api/data/list/image/kind',
  'data_image_list': 'api/data/image/list',
  'data_image_delete': 'api/data/image/delete',

  'node_todo_list': 'api/todo/node/list',
  'node_track_list': 'api/track/node/list',

  'task_customer_list': 'api/task/customer/list',

  // 人工审核通过
  'man_check_agree': '/bpmsx/order/interview/manCheckAgree',
  // 杭州银行提放保日志查询
  'get_query_docking_result': '/bpmsx/order/log/v1/getQueryDockingResult',
  'first_approval': '/bpmsx/order/risk/v1/firstApproval',
  'update_approval': '/bpmsx/order/risk/v1/resetPreliminaryResult',

  // 未读消息数量
  'get_message_total' : '/bpmsx/order/handle/v1/getMessagesTotal',

  // 跟踪订单
  'order_info_status': 'ctx/applyOrder/status',
  'order_approve_status': '/bpmsx/order/matter/v1/getMatterList',
  'order_detail': '/bpmsx/order/info/v1/getOrderBaseInfo',
  // 跟单事项删除·恢复
  'node_state_change': '/bpmsx/order/handle/v1/deleteOrRevert',
  // 公证处信息查询
  'notary_info': '/bpmsx/sys/partnerInfo/v1/listNotary',

  /** *************** 要件管理部分 ********************/
  important_doc_borrow_list: `/bpmsx/essentialsManager/v1/borrow/list`,
  important_doc_list: `/bpmsx/essentialsManager/v1/list`,
  apply_borrow: `/bpmsx/essentialsManager/v1/applyBorrow`,
  apply_finish: `/bpmsx/essentialsManager/v1/applyEnd`,
  important_doc_details: `/bpmsx/essentialsManager/v1/details`,
  /** ************* 要件管理部分-end ******************/

  // 资金模块
  company_account_list: `/bpmsx/fundModule/v1/companyAccount/list`,
  fund_back_list: `/bpmsx/fundModule/v1/backToAccount/list`,
  fund_advance: `/bpmsx/fundModule/v1/fdAdvance/query`,
  fund_amount_total: `/bpmsx/fundModule/v1/backToAccountTotal`,
  fund_delete_list: `/bpmsx/fundModule/v1/backToAccount/delete`,
  fund_addback_account: `/bpmsx/fundModule/v1/incrementBackToAccount`,
  fund_default_value: `/bpmsx/fundModule/v1/getBackToAccountDefaultValue`,

  // 面签业务终止、房产区域接口
  interview_stop: `/bpmsx/order/handle/v1/endOrder`,
  company_area_list: `/bpmsx/sys/areaInfo/v1/listByCompanyCode`,

  // 转、派、预约、释放--预约地点接口
  order_place: `/bpmsx/order/appoint/v1/appointAddress/listByBelongCityCode`,

  // 公开产品列表
  product_order_list: `/bpmsx/product/v1/listPublic`,

  // 公司诉讼查询
  company_litigation_list: `/bpmsx/order/risk/v1/companyLitigation/list`,
  company_litigation_detail: `/bpmsx/order/risk/v1/companyLitigation/queryThird`,
  company_detail_content: `/bpmsx/order/risk/v1/companyLitigation/getDetail`,
  // 征信查询、概要、详情
  credit_zld_list: `/bpmsx/customer/v1/querycreditreport`,
  credit_channel_list: `/bpmsx/customer/v1/getQueryCredits`,
  credit_summary_message: `/bpmsx/order/risk/v1/getCreditSummary`,
  credit_detail_message: `/bpmsx/order/risk/v1/getCreditDetail`,
  history_num: `/bpmsx/order/operate/v1/getOpCoefficientHistoryList`,
  performance_detail: `/bpmsx/order/operate/v1/getUserOperateOrderList`,
  my_performance: `/bpmsx/order/operate/v1/getOpAccountInfo`,
  order_performance: `/bpmsx/order/operate/v1/getOrderOperateList`,
  operate_list: `/bpmsx/order/operate/v1/getAllOperateList`,
  performance_rule: `/bpmsx/order/operate/v1/getOperatePerformanceRule`,
  performance_max: `/bpmsx/order/operate/v1/getEffectiveOpToplimitList`,
  collect_order_matter: `/bpmsx/order/handle/v1/appointMatterLock`,
  order_key_info: `/bpmsx/order/info/v1/getKeyMessage`,
  matter_type: `/bpmsx/order/log/v1/getOrderHandleLog`,
  home_track_set_top: `/bpmsx/order/list/v1/followerOrderTop`,

  // 风险特批
  special_approval_history: `/bpmsx/bpm/flow/v1/getFlowHistory`,
  order_approval_list: `/bpmsx/bpm/flow/riskspecial/v1/getRiskSpecialFlowByApplyNo`,
  submit_supplement: `/bpmsx/bpm/flow/v1/complete`
}

export default defineApi
