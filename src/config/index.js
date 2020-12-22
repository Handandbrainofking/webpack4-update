import {
  Home,
  WeekCalendarPage,
  MessageList,
  OrderList,
  DataList,
  ImportDocListPage,
  PerformanceList,
  SpecialApproval
} from '../router/defined'

const appConfig = {
  // 基础配置信息
  ServerAddressAPP_DEV: 'http://10.11.0.144:10100', // Dev app 后台
  ServerAddressBPMS_DEV: 'http://10.11.0.166:11001', // http://10.11.0.159:11001
  ServerAddressAPP_SIT: 'http://119.23.69.49:8000/mobile-api', // sit app 后台
  ServerAddressBPMS_SIT: 'http://119.23.69.49:8000/bpmsx-api',
  ServerAddressAPP_UAT: 'http://120.25.130.236:58000/mobile-api', // uat app 后台
  ServerAddressBPMS_UAT: 'http://120.25.130.236:58000/bpmsx-api',
  ServerAddressAPP_HUIDU: 'http://120.25.130.236:58001/mobile-api', // 灰度环境
  ServerAddressBPMS_HUIDU: 'http://120.25.130.236:58001/bpmsx-api',
  ServerAddressAPP_RELEASE: 'http://120.77.128.139:50900/mobile-api', // 正式环境
  ServerAddressBPMS_RELEASE: 'http://120.77.128.139:50900/bpmsx-api',
  version: 'v1', // 服务器协议版本号
  DEBUG: false, // 是否开启mock数据
  webVersion: 'v1.0.0.1528287076617' //  前端版本,版本表示时间,方便找版本,防止版本错乱
}
export const UPLOAD_ID_CARD_TYPE = 'M01001'

export const HomeMenu = [
  {
    name: '首页',
    link: Home,
    image: '/image/home.png',
    focusImage: '/image/home.png',
    color: '#333333',
    focusColor: '#ffffff',
    bgColor: 'transparent',
    focusBgColor: '#282828'
  }, {
    name: '日历',
    link: WeekCalendarPage,
    image: '/image/calendar.png',
    focusImage: '/image/calendar.png',
    color: '#333333',
    focusColor: '#ffffff',
    bgColor: 'transparent',
    focusBgColor: '#282828'
  }, {
    name: '订单管理',
    link: OrderList,
    image: '/image/order.png',
    focusImage: '/image/order.png',
    color: '#333333',
    focusColor: '#ffffff',
    bgColor: 'transparent',
    focusBgColor: '#282828'
  }, {
    name: '资料管理',
    link: DataList,
    image: '/image/data.png',
    focusImage: '/image/data.png',
    color: '#333333',
    focusColor: '#ffffff',
    bgColor: 'transparent',
    focusBgColor: '#282828'
  }, {
    name: '消息',
    link: MessageList,
    image: '/image/message.png',
    focusImage: '/image/message.png',
    color: '#333333',
    focusColor: '#ffffff',
    bgColor: 'transparent',
    focusBgColor: '#282828'
  }, {
    name: '要件管理',
    link: ImportDocListPage,
    image: '/image/doc.png',
    focusImage: '/image/doc.png',
    color: '#333333',
    focusColor: '#ffffff',
    bgColor: 'transparent',
    focusBgColor: '#282828'
  }, {
    name: '我的提奖',
    link: PerformanceList,
    image: '/image/performance.png',
    focusImage: '/image/performance.png',
    color: '#333333',
    focusColor: '#ffffff',
    bgColor: 'transparent',
    focusBgColor: '#282828'
  },
  {
    name: '特批流程',
    link: SpecialApproval,
    image: '/image/special-approve-flow.png',
    focusImage: '/image/special-approve-flow.png',
    color: '#333333',
    focusColor: '#ffffff',
    bgColor: 'transparent',
    focusBgColor: '#282828'
  }
]

export const ProductKindList = {
  JYB_YSL_YJY_ISR: {
    name: '交易保（有赎楼）',
    kind: 21, // 第一个1（个位）表示交易类型：1: 交易类， 2: 非交易类  第二个1（十位）表示业务类型：1: 现金业务， 2: 保险业务
    code: 'S01',
    index: 1,
    nodes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    preNodes: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    afterNodes: [2, 3, 7, 8, 10, 11, 12, 13, 14, 15],
    haveRansom: true
  },
  JYB_NSL_YJY_ISR: {
    name: '交易保（无赎楼）',
    kind: 21,
    code: 'S02',
    index: 2,
    nodes: [1, 2, 3, 4, 6, 7, 8, 12, 13, 14, 15],
    preNodes: [1, 2, 3, 4, 6, 7, 8, 12, 13, 14, 15],
    afterNodes: [1, 2, 3, 4, 6, 7, 8, 12, 13, 14, 15],
    haveRansom: false
  },
  TFB_YSL_NJY_ISR: {
    name: '提放保（有赎楼）',
    kind: 22,
    code: 'S03',
    index: 3,
    //下户事项
    nodes: [1, 19, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15],
    preNodes: [1, 19, 2, 3, 4, 5, 6, 7, 8, 9],
    afterNodes: [2, 19, 3, 7, 8, 10, 11, 14, 15],
    // nodes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15],
    // preNodes: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    // afterNodes: [2, 3, 7, 8, 10, 11, 14, 15],
    haveRansom: true
  },
  TFB_NSL_NJY_ISR: {
    name: '提放保（无赎楼）',
    kind: 22,
    code: 'S04',
    index: 4,
    nodes: [1, 19, 2, 3, 4, 6, 7, 8, 14, 15],
    preNodes: [1, 19, 2, 3, 4, 6, 7, 8, 14, 15],
    afterNodes: [1, 19, 2, 3, 4, 6, 7, 8, 14, 15],
    haveRansom: false
  },
  SLY_YSL_YJY_CSH: {
    name: '及时贷（交易赎楼）',
    kind: 11,
    code: 'C01',
    index: 5,
    nodes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    preNodes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 16],
    afterNodes: [2, 3, 7, 8, 10, 11, 12, 13, 14, 15, 16],
    haveRansom: true
  },
  SLY_YSL_NJY_CSH: {
    name: '及时贷（非交易赎楼）',
    kind: 12,
    code: 'C02',
    index: 6,
    nodes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16],
    preNodes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 16],
    afterNodes: [2, 3, 7, 8, 10, 11, 14, 15, 16],
    haveRansom: true
  },
  JSD_NSL_YJY_CSH: {
    name: '及时贷（交易提放）',
    kind: 11,
    code: 'C03',
    index: 7,
    nodes: [1, 2, 3, 4, 6, 7, 8, 12, 13, 14, 15, 16],
    preNodes: [1, 2, 3, 4, 6, 7, 8, 12, 13, 14, 15, 16],
    afterNodes: [1, 2, 3, 4, 6, 7, 8, 12, 13, 14, 15, 16],
    haveRansom: false
  },
  JSD_NSL_NJY_CSH: {
    name: '及时贷（非交易提放）',
    kind: 12,
    code: 'C04',
    index: 8,
    nodes: [1, 2, 3, 4, 6, 7, 8, 14, 15, 16],
    preNodes: [1, 2, 3, 4, 6, 7, 8, 14, 15, 16],
    afterNodes: [1, 2, 3, 4, 6, 7, 8, 14, 15, 16],
    haveRansom: false
  },
  AJFW_NSL_YJY: {
    name: '按揭服务',
    kind: 22,
    code: 'F01',
    index: 9,
    nodes: [12, 13, 14, 15],
    preNodes: [12, 13, 14, 15],
    afterNodes: [12, 13, 14, 15],
    haveRansom: false
  },
  MFB_YSL_YJY_ISR: {
    name: '买付保（大道保证）',
    kind: 21,
    code: 'S05',
    index: 10,
    nodes: [1, 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    preNodes: [1, 2, 3, 5, 7, 8, 9],
    afterNodes: [2, 3, 7, 8, 10, 11, 12, 13, 14, 15],
    haveRansom: true
  },
  IMFB_YSL_YJY_ISR: {
    name: '买付保（有赎楼）',
    kind: 21,
    code: 'S07',
    index: 11,
    nodes: [1, 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    preNodes: [1, 2, 3, 5, 7, 8, 9],
    afterNodes: [2, 3, 7, 8, 10, 11, 12, 13, 14, 15],
    haveRansom: true
  },
  IMFB_NSL_YJY_ISR: {
    name: '买付保（无赎楼）',
    kind: 21,
    code: 'S08',
    index: 12,
    nodes: [1, 2, 3, 7, 8, 12, 13, 14, 15],
    preNodes: [1, 2, 3, 7, 8, 12, 13, 14, 15],
    afterNodes: [1, 2, 3, 7, 8, 12, 13, 14, 15],
    haveRansom: false
  },
  DMFB_YSL_YJY_ISR: {
    name: '买付保（有赎楼）-担保',
    kind: 21,
    code: 'S12',
    index: 13,
    nodes: [1, 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    preNodes: [1, 2, 3, 5, 7, 8, 9],
    afterNodes: [2, 3, 7, 8, 10, 11, 12, 13, 14, 15],
    haveRansom: false
  },
  DMFB_NSL_YJY_ISR: {
    name: '买付保（无赎楼）-担保',
    kind: 21,
    code: 'S13',
    index: 14,
    nodes: [1, 2, 3, 7, 8, 12, 13, 14, 15],
    preNodes: [1, 2, 3, 7, 8, 12, 13, 14, 15],
    afterNodes: [1, 2, 3, 7, 8, 12, 13, 14, 15],
    haveRansom: false
  },
  DZYB_YSL_YJY_ISR: {
    name: '交易保(两笔)-担保',
    kind: 21,
    code: 'S09',
    index: 15,
    nodes: [1, 2, 3, 4, 17, 5, 6, 18, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    preNodes: [1, 2, 3, 4, 17, 5, 6, 18, 7, 8, 9],
    afterNodes: [1, 2, 3, 7, 8, 10, 11, 12, 13, 14, 15],
    haveRansom: true
  }
}

export const InterviewListKind = [
  {
    name: '全部',
    key: '',
    sort: 0
  }, {
    name: '面签',
    key: 'Interview',
    sort: 1
  }, {
    name: '委托公证',
    key: 'Notarization',
    sort: 2
  }, {
    name: '要件托管',
    key: 'TrustAccount',
    sort: 3
  }, {
    name: '申请贷款',
    key: 'ApplyLoan',
    sort: 4
  }, {
    name: '预约赎楼',
    key: 'PreRandom',
    sort: 5
  }, {
    name: '核实同贷',
    key: 'AgreeLoanMark',
    sort: 6
  }, {
    name: '账户测试',
    key: 'AccountTest',
    sort: 7
  }, {
    name: '查档',
    key: 'QueryArchive',
    sort: 8
  }, {
    name: '赎楼登记',
    key: 'RandomMark',
    sort: 9
  }, {
    name: '取注销资料',
    key: 'GetCancelMaterial',
    sort: 10
  }, {
    name: '注销抵押',
    key: 'CancleMortgage',
    sort: 11
  }, {
    name: '过户递件',
    key: 'TransferIn',
    sort: 12
  }, {
    name: '过户出件',
    key: 'TransferOut',
    sort: 13
  }, {
    name: '抵押递件',
    key: 'MortgagePass',
    sort: 14
  }, {
    name: '抵押出件',
    key: 'MortgageOut',
    sort: 15
  }, {
    name: '确认回款资金到账',
    key: 'paymentArrival',
    sort: 16
  }, {
    name: '申请贷款(赎楼贷款)',
    key: 'ApplyLoan_atone',
    sort: 17
  }, {
    name: '核实同贷(赎楼贷款)',
    key: 'AgreeLoanMark_atone',
    sort: 18
  }, {
    name: '下户',
    key: 'DownHouseSurvey',
    sort: 19
  }
]

export const InsuranceProductCode = (function () {
  return Object.values(ProductKindList).filter(item => item.kind > 20).reduce((current, item) => current + Math.pow(2, item.index), 0)
}())

export const CashProductCode = (function () {
  return Object.values(ProductKindList).filter(item => item.kind < 20).reduce((current, item) => current + Math.pow(2, item.index), 0)
}())

export const DealProductCode = (function () {
  return Object.values(ProductKindList).filter(item => item.kind % 2 === 1).reduce((current, item) => current + Math.pow(2, item.index), 0)
}())

export const NoDealProductCode = (function () {
  return Object.values(ProductKindList).filter(item => item.kind % 2 === 0).reduce((current, item) => current + Math.pow(2, item.index), 0)
}())

export const ProductDictList = (function () {
  const result = []
  for (let prop in ProductKindList) {
    result.push({key: prop, name: ProductKindList[prop].name})
  }
  return result
}())

export const TimeList = [
  {
    type: '1',
    name: '今日'
  },
  {
    type: '0',
    name: '全部'
  }
]

export const DetailList = [
  {
    type: 1,
    name: '明细'
  },
  {
    type: 0,
    name: '进度'
  }
]

export const ConfirmType = [
  {
    key: 'Y',
    name: '是'
  },
  {
    key: 'N',
    name: '否'
  }]
export const ConfirmTypeNumber = [
  {
    key: '1',
    name: '是'
  },
  {
    key: '0',
    name: '否'
  }]
export const CreditList = [
  {
    key: 'onlinequery',
    name: '线上查询'
  },
  {
    key: 'offlineprint',
    name: '线下打印'
  }
]

export const HouseKeptType = [{
  key: '1',
  name: '自留'
}]

export const LendMotiveType = [
  {
    key: '1',
    name: '利率'
  },
  {
    key: '2',
    name: '还款方式'
  },
  {
    key: '3',
    name: '期限'
  },
  {
    key: '4',
    name: '额度'
  }]

export const SellHouseType = [
  {
    key: '1',
    name: '改善性需求'
  },
  {
    key: '2',
    name: '生意周转'
  },
  {
    key: '0',
    name: '其他'
  }
]

export const IncomeCardType = [
  {
    key: 'JGHKK',
    name: '监管回款卡'
  },
  {
    key: 'AJHKZH',
    name: '按揭回款账户'
  },
  {
    key: 'GJJHKZH',
    name: '公积金回款账户'
  },
  {
    key: 'ZZZJSKZH',
    name: '周转资金收款账户'
  },
  {
    key: 'QT(MMD)',
    name: '机构指定收款账户'
  }
]

export const NumberThirdType = [
  {
    key: '1',
    name: '公司'
  },
  {
    key: '2',
    name: '个人'
  }
]

export const HandleUser = [
  {key: 'YYZG', name: '运营主管'},
  {key: 'YYFZR', name: '运营负责人'},
  {key: 'ZJL', name: '总经理'},
  {key: 'FXGLB', name: '风险管理部'}
]

export const SpecialApprovalTypes = [
  {key: 'riskSpecialApproveFlow', name: '风险特批流程'}
]

// 证件类型
export const DISC_CERT_TYPE = 'CertType'
// 征信获取方式
export const DISC_CRESIT_CHANNEL = 'creditChannel'
// 征信查询状态
export const DISC_CREDIT_STATUS = 'QueryCreditType'
// 征信查询关系人类型（交易、非交易、抵押贷）
export const DISC_RELATION_MORTGAGE = 'LenderCustomerType'
// 收款账户类型
export const DISC_ACCOUNT_TYPE = 'receivedAcctType'
// 还款方式
export const DISC_REPAY_WAY = 'hkfs'
// 同贷来源
export const DISC_AGREE_LOAN_SOURCE = 'AgreeLoanSource'
// 性别类型
export const DISC_SEX_TYPE = 'Sex'
// 婚姻状态
export const DISC_MERRY_TYPE = 'MarriageStatus'
// 收入类型
export const DISC_INCOME_TYPE = 'IncomeType'
// 风险等级
export const DISC_RISK_LEVEL = 'RISKLEVEL'
// 赎楼支付方式
export const DISC_REDEMPTION_PAY_WEY = 'randomPayMode'
// 尾款支付方式
export const DISC_TAIL_PAY_WEY = 'tailPayMode'
// 赎楼状态
export const DISC_REDEMPTION_STATUS = 'redeemFloorFlag'
// 实际还款来源
export const DISC_REPAY_SOURCE = 'PaymentSource'
// 同贷类型
export const DISC_AGREE_LOAN_TYPE = 'AgreeLoanType'
// 与抵押人关系
export const DISC_AGE_RALTION_TYPE = 'AndGuaranteeRelationType'
// 还款扣款方式
export const DISC_CHARGE_MODE = 'PayMethod'
// 扣款时间段
export const DISC_CHARGE_TIME = 'kksjd'
// 关联类型
export const DISC_ASSOCIATE_TYPE = 'RelateType'
// 交易卖家客户类型
export const DISC_SELLER_SHIP_TYPE = 'OwnerCustomerType'
// 交易买家客户类型
export const DISC_BUYER_SHIP_TYPE = 'BuyerCustomerType'
// 非交易客户类型
export const DISC_CUSTOMER_SHIP_TYPE = 'RL_NJY'
// 放款节点_全量
export const DISC_LOAN_NODE_QL = 'fkjd_ql'
// 订单状态
export const DISC_ORDER_STATUS = 'orderStatus'
// 房产查档结果
export const PLEDGE_STATUS = 'pledgeStatus'
// 房产证类型
export const HOUSE_LAND_CERT_FLAG = 'houseLandCertFlag'
// 账户测试途径
export const TEST_CHANNEL = 'TestChannel'
// 账户测试状态
export const TEST_STATUS = 'TestStatus'
// 关系人类型-交易类
export const RELATION_TYPE_JY = 'RL_JY'
// 关系人类型-非交易类
export const RELATION_TYPE_NJY = 'RL_NJY'
// 关系人类型-抵押贷
export const RELATION_TYPE_GUARANTY = 'RL_GUARANTY'
// 账户类型-现金类
export const ACCOUNT_TYPE_CASH = 'AccountTypeCash'
// 账户类型
export const ACCOUNT_TYPE = 'AccountType'
// 实际回款账户
export const RETURN_AMT_FROM = 'RETURN_AMT_FROM'
// 使用权获得方
export const SYQQDFS_DIC_FLAG = 'syqqdfs'
// 土地用途
export const FCYT_DIC_FLAG = 'fcyt'
// 贷款类型
export const DISC_LOAN_TYPE = 'dklx'
// 要件状态
export const IMPORT_DOC_TYPE = 'essentialsStatus'
// 出入库状态
export const IMPORT_DOC_EVENT_STATUS = 'essentialsEventStatus'
// （赎楼）还款方式
export const RANSOM_REPAY_TYPE = 'slhkfs'
// （赎楼）贷款支付方式
export const RANSOM_LOAN_TYPE = 'sldkzffs'
// 有无
export const DISC_LITIGATED_FLAG = 'LitigatedFlag'
// 房屋装修程度
export const DISC_DECORATION_DEGREE = 'DECORATION_DEGREE'
// 房屋居住状态
export const DISC_HOUSE_LIVE_STATUS = 'HOUSE_LIVE_STATUS'
// 产品类型
export const DISC_PRODUCT_TYPE = 'productTypeV2'
// 账户测试方式
export const DISC_TEST_CHANNEL = 'TestChannel'
// 账户测试方式
export const CUSTOMER_IDENTITY = 'customerIdentity'
// 订单操作状态
export const DICT_APPROVE_STATUS = 'approveStatus'

const DistList = {}

// 向字典中放值
export const Dist_List_Set = (data, ...args) => {
  if (args.length < 1) {
    return false
  }
  for (let i in args) {
    DistList[args[i]] = data[args[i]]
  }
  return true
}

// 字典取值
export const Dist_List_Get = (...args) => {
  if (args.length === 0) {
    return DistList
  }
  if (args.length === 1) {
    return DistList[args[0]] || []
  }
  const obj = {}
  for (let i in args) {
    obj[args[i]] = DistList[args[i]] || []
  }
  return obj
}

export const ApprovalStatus = {
  'start': '发起流程',
  'end': '结束流程',
  'awaiting_check': '待审批',
  'agree': '同意',
  'against': '反对',
  'reject': '驳回',
  'abandon': '弃权',
  'retrieve': '追回',
  'skip': '跳过'
}

export default appConfig
