/**
 * function: index
 * author  : wq
 * update  : 2018/11/26 14:30
 */
import {
  DISC_CERT_TYPE, DISC_SEX_TYPE, DISC_MERRY_TYPE, DISC_INCOME_TYPE, DISC_CRESIT_CHANNEL, DISC_REPAY_WAY,
  DISC_RISK_LEVEL, DISC_ACCOUNT_TYPE, DISC_TAIL_PAY_WEY, DISC_REDEMPTION_PAY_WEY, DISC_REDEMPTION_STATUS, DISC_LITIGATED_FLAG,
  DISC_REPAY_SOURCE, DISC_CHARGE_MODE, DISC_CHARGE_TIME, IncomeCardType, RANSOM_REPAY_TYPE, DISC_AGREE_LOAN_SOURCE,
  ConfirmType, ConfirmTypeNumber, LendMotiveType, HouseKeptType, SellHouseType, NumberThirdType,
  DISC_AGREE_LOAN_TYPE, DISC_AGE_RALTION_TYPE, DISC_HOUSE_LIVE_STATUS, DISC_DECORATION_DEGREE, CUSTOMER_IDENTITY
} from '@/config'

const addSortIndex = function (obj) {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('switchObjectToArray function params is not object')
  }
  return Object.keys(obj).map(key => {
    const item = obj[key]
    if (item.title === undefined) {
      item.title = key
    }
    return item
  }).sort((itm1, itm2) => itm1.sort - itm2.sort).map((item, index) => {
    const children = item.children
    children.forEach(item => {
      item.blockIndex = index
    })
    return Object.assign({}, item, { 'sortIndex': index })
  })
}

const switchObjectToArray = function (obj, width, labelWidth, inputWidth) {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('switchObjectToArray function params is not object')
  }
  return Object.keys(obj).map(key => {
    const item = obj[key]
    const type = item.type
    if (item.key) {
      key = item.key
    }
    if (type === 'slot') {
      return Object.assign({}, item, { key })
    }
    if (type === 'pick' || type === 'select') {
      !item.index && item.index !== 0 && (item.index = -1)
      !item.list && (item.list = [])
    }
    if (!item.disabled) {
      if (type === 'pick' || type === 'date' || type === 'datetime' || type === 'time' || type === 'select' || type === 'pickother' || item.hasChoose) {
        !item.placeholder && (item.placeholder = '请选择' + (item.label || '').replace(/\([\S\s]+\)$/, '').replace(/（[\S\s]+）$/, ''))
      } else {
        !item.placeholder && (item.placeholder = '请输入' + (item.label || '').replace(/\([\S\s]+\)$/, '').replace(/（[\S\s]+）$/, ''))
      }
    }
    if (key.indexOf('|') > 0) {
      item.values = []
      key = key.split('|')
    }
    if (width) {
      !item.width && item.width !== 0 && (item.width = width)
    }
    if (labelWidth) {
      !item.labelWidth && item.labelWidth !== 0 && (item.labelWidth = labelWidth)
    }
    if (inputWidth) {
      !item.inputWidth && item.inputWidth !== 0 && (item.inputWidth = inputWidth)
    }
    if (item.hasChoose) {
      item.disabled = true
    }
    return Object.assign({}, item, { key })
  }).sort((itm1, itm2) => itm1.sort - itm2.sort).map((item, index) => Object.assign({}, item, { 'sortIndex': index }))
}

export const CustomerItem = switchObjectToArray({
  name: {
    label: '客户姓名',
    required: true,
    inner: 'customer',
    type: 'input',
    hasCamera: true,
    sort: 0
  },
  relation: {
    label: '关系人类型',
    required: true,
    hasTips: true,
    type: 'pick',
    pickTitle: '关系人类型',
    sort: 1
  },
  idCardType: {
    label: '证件类型',
    disc: DISC_CERT_TYPE,
    required: true,
    inner: 'customer',
    type: 'pick',
    pickTitle: '证件类型',
    sort: 2
  },
  idCardNo: {
    label: '证件号码',
    inner: 'customer',
    valid: 'id',
    type: 'input',
    sort: 3
  },
  customerIdentity: {
    label: '客户身份',
    inner: 'customer',
    hidden: true,
    required: true,
    hasTips: false,
    type: 'pick',
    disc: CUSTOMER_IDENTITY,
    pickTitle: '客户身份',
    sort: 4
  },
  age: {
    label: '年龄',
    inner: 'customer',
    valid: 'int',
    type: 'number',
    sort: 4
  },
  sex: {
    label: '性别',
    disc: DISC_SEX_TYPE,
    inner: 'customer',
    type: 'select',
    sort: 5
  },
  idCardValidity: {
    label: '证件有效期',
    inner: 'customer',
    type: 'date',
    min: false,
    hasCheckbox: 2,
    sort: 6
  },
  address: {
    label: '身份证居住地址',
    inner: 'customer',
    type: 'input',
    sort: 7
  },
  maritalStatus: {
    label: '婚姻状态',
    disc: DISC_MERRY_TYPE,
    inner: 'customer',
    type: 'pick',
    sort: 8
  },
  phone: {
    label: '联系方式',
    inner: 'customer',
    valid: 'tel',
    type: 'tel',
    sort: 9
  },
  incomeType: {
    label: '收入类型',
    disc: DISC_INCOME_TYPE, // 0  --- 10
    inner: 'customer',
    type: 'pick',
    sort: 10
  },
  employer: {
    label: '工作单位',
    inner: 'customer',
    type: 'input',
    sort: 11
  },
  isActualBorrowerName: {
    list: ConfirmType,
    required: true,
    type: 'select',
    index: 1,
    sort: 12
  },
  // 增加字段
  // andGuaranteeRelation: {
  //   label: '与抵押人关系',
  //   pickTitle: '与抵押人关系',
  //   disc: DISC_AGE_RALTION_TYPE,
  //   required: true,
  //   hidden: false,
  //   inner: 'customer',
  //   type: 'pick',
  //   sort: 13
  // },
  isProposer: {
    label: '是否为申请人',
    list: ConfirmType,
    required: true,
    type: 'select',
    index: 1,
    sort: 14
  },
  monthlyIncome: {
    label: '个人月收入',
    valid: 'number',
    inner: 'customer',
    type: 'money',
    index: 0,
    sort: 15
  },
  creditChannel: {
    label: '征信获取方式',
    disc: DISC_CRESIT_CHANNEL, // 0---15
    hidden: false,
    inner: 'customer',
    disable: false,
    type: 'select',
    index: 1,
    sort: 16
  },
  'provideOtherPersonalLocalResidences': {
    label: '提供本人当地其他住宅',
    // productType: 64678, // [1, 2, 5, 7, 10, 11, 12, 13, 14, 15]
    required: true,
    list: ConfirmType,
    block: 'customer',
    type: 'select',
    index: 1,
    sort: 17
  },
  'otherRelation': {
    label: '配偶姓名',
    required: false,
    hasAdd: true,
    hidden: true,
    type: 'pick',
    sort: 100
  }
}, 1100, 350)

export const AttentionItem = switchObjectToArray({
  'salesUserId|salesUserName': {
    label: '渠道经理',
    required: true,
    hidden: true,
    block: 'applyOrder',
    type: 'pick',
    sort: 0
  },
  'partnerInsuranceId|partnerInsuranceName': {
    required: true,
    hidden: true,
    block: 'applyOrder',
    type: 'pick',
    sort: 1
  },
  'partnerBankId|partnerBankName': {
    label: '合作银行',
    required: true,
    hidden: true,
    productType: [1, 2, 3, 4, 15].reduce((current, item) => current + Math.pow(2, item), 0),
    block: 'applyOrder',
    type: 'pick',
    sort: 2
  },
  'tailReleaseNode|tailReleaseNodeName': {
    label: '放款节点',
    required: true,
    hidden: true,
    block: 'isrMixed',
    type: 'pick',
    defaultValue: '',
    sort: 3
  },
  'productTerm': {
    label: '产品期限（天）',
    required: true,
    hidden: true,
    productType: 32256, // [14, 13, 12, 11, 10, 9]
    block: 'feeSummary',
    type: 'pick',
    sort: 4
  },
  'preUseAmountDate': {
    label: '客户预计用款日期',
    required: true,
    block: 'feeSummary',
    type: 'date',
    sort: 5
  },
  'isPriority': {
    label: '是否加急业务',
    list: ConfirmType,
    required: true,
    block: 'isrMixed',
    type: 'select',
    sort: 6
  },
  'riskLevel': {
    label: '风险标签',
    disc: DISC_RISK_LEVEL,
    block: 'isrMixed',
    type: 'select',
    disabled: true,
    sort: 7
  },
  'guaranteeAmount': {
    label: '保险金额(元)',
    required: true,
    productType: 32256, // [14, 13, 12, 11, 10, 9]
    valid: 'number',
    block: 'feeSummary',
    type: 'money',
    sort: 8
  },
  'borrowingAmount': {
    label: '借款金额(元)',
    required: true,
    productType: 480, // [8, 7, 6, 5]
    valid: 'number',
    block: 'feeSummary',
    type: 'money',
    sort: 9
  },
  'preRansomBorrowAmount': {
    label: '预计（赎楼）贷款金额（元）',
    productType: 32768, // [15]
    valid: 'number',
    block: 'feeSummary',
    type: 'money',
    sort: 10
  },
  'bizLoanAmount': {
    label: '预计商业贷款金额（元）',
    productType: 32798, // [15, 4, 3, 2, 1]
    valid: 'number',
    required: true,
    block: 'newLoan',
    type: 'money',
    sort: 11
  },
  'ransomBorrowAmount': {
    label: '赎楼金额(元)',
    productType: 11786, // [13, 11, 10, 9, 3, 1] 11
    valid: 'number',
    block: 'feeSummary',
    type: 'money',
    sort: 12
  },
  'ownFundAmount': {
    label: '客户自有资金(元)',
    productType: 44650, // [15, 13, 11, 10, 9, 6, 5, 3, 1]
    valid: 'number',
    block: 'feeSummary',
    type: 'money',
    sort: 13
  },
  'oriLoanBankCode|oriLoanBankName': {
    label: '原贷款机构',
    required: true,
    productType: 44650, // [15, 13, 11, 10, 9, 6, 5, 3, 1]
    hasChoose: true,
    block: 'oriLoan',
    type: 'input',
    sort: 14
  },
  'originBorrowerType': {
    label: '原贷款借款人类型',
    key: 'borrowerType',
    // origin: 'borrowerType',
    productType: 34922, // [1, 15, 3, 5, 6, 11]
    required: true,
    disc: DISC_ACCOUNT_TYPE,
    block: 'oriLoan',
    type: 'select',
    sort: 14
  },
  'certificateKeep': {
    label: '产证保管在',
    list: HouseKeptType,
    required: true,
    productType: 44650, // [15, 13, 11, 10, 9, 6, 5, 3, 1]
    block: 'applyOrderExtend',
    type: 'select',
    sort: 15
  },
  'hasNewLoanApply': {
    label: '是否已做新贷款申请',
    list: ConfirmType,
    required: true,
    productType: 1702, // [10, 9, 7, 5, 2, 1]
    block: 'applyOrderExtend',
    type: 'select',
    sort: 16
  },
  'accompanyNewLoanApply': {
    label: '是否需我司陪同办理新贷款申请',
    list: ConfirmType,
    required: true,
    productType: 1702, // [10, 9, 7, 5, 2, 1]
    block: 'applyOrderExtend',
    type: 'select',
    sort: 17
  },
  'handleEntrustNotarial': {
    label: '是否办理委托公证',
    list: ConfirmType,
    required: true,
    block: 'applyOrderExtend',
    type: 'select',
    sort: 18
  },
  'newLoanBankCode|newLoanBankName': {
    label: '新贷款机构',
    productType: [15, 10, 8, 7, 6, 5, 3, 1, 2, 4].reduce((current, item) => current + Math.pow(2, item), 0),
    block: 'newLoan',
    hasChoose: true,
    type: 'input',
    sort: 19
  },
  'borrowerType': {
    label: '新贷款借款人类型',
    disc: DISC_ACCOUNT_TYPE,
    productType: 344, // [8, 6, 4, 3]
    block: 'newLoan',
    type: 'select',
    sort: 20
  },
  'hasFundSupervision': {
    label: '是否已做资金监管',
    list: ConfirmType,
    productType: 34470, // [15, 10, 9, 7, 5, 2, 1]
    block: 'newLoan',
    type: 'select',
    sort: 21
  },
  'supervisionTime': {
    label: '预计监管时间',
    productType: 34470, // [15, 10, 9, 7, 5, 2, 1] 21
    block: 'newLoan',
    type: 'date',
    sort: 22
  },
  'supervisionAgreementGetTime': {
    label: '监管协议领取时间',
    productType: 34470, // [15, 10, 9, 7, 5, 2, 1]
    block: 'newLoan',
    min: false,
    type: 'date',
    sort: 23
  },
  'transferLoanCause': {
    label: '转贷动机',
    list: LendMotiveType,
    productType: 344, // [8, 6, 4, 3]
    block: 'newLoan',
    type: 'select',
    sort: 24
  },
  'thirdType': {
    label: '第三方收款账户类型',
    list: NumberThirdType,
    productType: 344, // [8, 6, 4, 3]
    block: 'newLoan',
    type: 'select',
    sort: 25
  },
  'houseLimitYear': {
    label: '房产年限（年）',
    productType: 65190, // [15, 14, 13, 12, 11, 10, 9, 7, 5, 2, 1]
    valid: 'int',
    block: 'applyOrderExtend',
    type: 'number',
    sort: 26
  },
  'thirdPayee': {
    label: '第三方收款人',
    productType: 344, // [8, 6, 4, 3]
    block: 'newLoan',
    type: 'input',
    sort: 27
  },
  'saleCause|otherSaleCause': {
    label: '售房原因',
    list: SellHouseType,
    productType: 32422, // [14, 13, 12, 11, 10, 9, 7, 5, 2, 1]
    block: 'applyOrderExtend',
    maxlength: 20,
    type: 'pick',
    sort: 28
  },
  'actualTradingPrice': {
    label: '实际成交价（元）',
    productType: 65190, // [15, 14, 13, 12, 11, 10, 9, 7, 5, 2, 1]
    valid: 'number',
    block: 'dealInfo',
    type: 'money',
    sort: 29
  },
  'earnestMoney': {
    label: '定金（元）',
    productType: 65190, // [15, 14, 13, 12, 11, 10, 9, 7, 5, 2, 1]
    valid: 'number',
    block: 'dealInfo',
    type: 'money',
    sort: 30
  },
  'downPaymentAmount': {
    label: '首付款（元）',
    productType: 65190, // [15, 14, 13, 12, 11, 10, 9, 7, 5, 2, 1] 31
    valid: 'number',
    block: 'feeSummary',
    type: 'money',
    sort: 31
  },
  'tailAmount': {
    label: '尾款（元）',
    productType: 65190, // [15, 14, 13, 12, 11, 10, 9, 7, 5, 2, 1]
    valid: 'number',
    block: 'feeSummary',
    type: 'money',
    sort: 32
  },
  'loanOffer': {
    label: '贷款申报价（元）',
    productType: 65190, // [15, 14, 13, 12, 11, 10, 9, 7, 5, 2, 1]
    valid: 'number',
    block: 'applyOrderExtend',
    type: 'money',
    sort: 33
  },
  'transferOffer': {
    label: '过户申报价（元）',
    productType: 65190, // [15, 14, 13, 12, 11, 10, 9, 7, 5, 2, 1]
    valid: 'number',
    block: 'applyOrderExtend',
    type: 'money',
    sort: 34
  },
  'randomPayMode': {
    label: '赎楼款支付方式',
    disc: DISC_REDEMPTION_PAY_WEY,
    required: false,
    productType: 43008, // [15, 13, 11]
    block: 'feeSummary',
    type: 'select',
    sort: 35
  },
  'tailPayMode': {
    label: '尾款支付方式',
    disc: DISC_TAIL_PAY_WEY,
    required: false,
    productType: 10240, // [13, 11]
    block: 'feeSummary',
    type: 'select',
    sort: 36
  },
  'tailAccountType': {
    label: '尾款收款账户类型',
    list: [{
      key: 'GLK',
      name: '供楼卡'
    }, {
      key: 'OWNERACCOUNTWK',
      name: '卖方收款账户（尾款）'
    }],
    required: false,
    productType: 10240, // [13, 11]
    block: 'feeSummary',
    type: 'select',
    sort: 37
  },
  'sellerAccountType': {
    label: '卖方收款账户类型',
    list: [{
      key: 'OWNERACCOUNTQK',
      name: '卖方收款账户（全款）'
    }],
    required: true,
    productType: 20480, // [14, 12]
    block: 'feeSummary',
    type: 'select',
    sort: 38
  },
  'number': {
    label: '卡号',
    productType: 30720, // [14, 13, 12, 11]
    valid: 'card',
    block: 'accountList',
    hasCamera: true,
    fileType: 'OWNERACCOUNTQK',
    fileUploadType: 'M05006',
    type: 'input',
    sort: 39
  },
  'name': {
    label: '户名',
    productType: 30720, // [14, 13, 12, 11]
    block: 'accountList',
    type: 'input',
    sort: 40
  },
  'openBankNo|openBank': {
    label: '开户行',
    productType: 30720, // [14, 13, 12, 11]  41
    block: 'accountList',
    hasChoose: true,
    type: 'input',
    sort: 41
  },
  'identityUntrusteeshipPolicy': {
    label: '是否符合身份证免托管政策',
    list: ConfirmType,
    block: 'applyOrderExtend',
    type: 'select',
    sort: 42
  },
  'identityUntrusteeshipApply': {
    label: '是否申请身份证免托管',
    list: ConfirmType,
    block: 'applyOrderExtend',
    type: 'select',
    sort: 43
  },
  'partnersAccount': {
    label: '电子账号',
    productType: 480, // [8, 7, 6, 5]
    block: 'isrMixed',
    type: 'input',
    sort: 44
  },
  'accountPassword': {
    label: '账号密码',
    productType: 480,
    block: 'isrMixed',
    type: 'input',
    sort: 45
  },
  'houseArea|houseAreaCode': {
    label: '房产区域',
    block: 'houseList',
    required: true,
    hasChoose: true,
    type: 'input',
    sort: 46
  },
  'nodeRemark': {
    label: '备注',
    block: 'orderMatterRecordList',
    placeholder: '请输入备注信息',
    type: 'mark',
    sort: 49
  }
}, 2400, 780)

export const NotarizationItem = switchObjectToArray({
  'slotCardItem': {
    type: 'slot',
    slotName: 'slot-card-item',
    sort: 0
  },
  'nodeRemark': {
    label: '备注',
    block: 'orderMatterRecordList',
    placeholder: '请输入备注信息',
    type: 'mark',
    width: 2400,
    sort: 1
  }
}, 1200, 440)

export const NotarizationCustomer = switchObjectToArray({
  'slotCustomerItem': {
    type: 'slot',
    slotName: 'slot-customer-item',
    sort: 0
  },
  notarialOffice: {
    label: '公证处',
    required: true,
    type: 'pick',
    sort: 1
  },
  prReceiveTime: {
    label: '（预计）领取公证书时间',
    required: true,
    type: 'date',
    sort: 2
  },
  'slotEntrustNames': {
    type: 'slot',
    slotName: 'slot-entrust-names',
    sort: 3
  },
  entrustNames: {
    label: '公证受托人',
    inputWidth: 1750,
    width: 2360,
    hidden: true,
    required: true,
    hasBorder: false,
    type: 'input',
    hasChoose: true,
    sort: 4
  }
}, 1180, 420)

export const NotarizationCustomerItem = switchObjectToArray({
  principalNames: {
    label: '委托人姓名',
    required: true,
    placeholder: '请选择委托人',
    type: 'pick',
    sort: 0
  },
  principalIdcardNo: {
    label: '证件号码',
    required: true,
    placeholder: '请输入委托人证件号码',
    hasAdd: true,
    valid: 'id',
    type: 'input',
    sort: 1
  },
  principalType: {
    label: '委托人类型',
    hidden: true,
    sort: 2
  }
}, 1180, 420)

export const RequirementsBankcardItem = switchObjectToArray({
  accountNo: {
    label: '账号',
    required: true,
    hidden: true,
    type: 'input',
    fileUploadType: 'M05006',
    fileType: 'OWNERACCOUNTQK',
    sort: 0
  },
  'slotEntrustNames': {
    type: 'slot',
    slotName: 'slot-account-no',
    sort: 0
  },
  accountName: {
    label: '户名',
    required: true,
    type: 'input',
    sort: 1
  },
  'bankCode|bankName': {
    label: '开户行',
    required: true,
    hasChoose: true,
    type: 'input',
    sort: 2
  },
  cardType: {
    label: '账户类型',
    required: true,
    type: 'pick',
    sort: 3
  }
}, 1178, 420)

export const RequirementsIdCardList = switchObjectToArray({
  identityUntrusteeshipPolicy: {
    label: '是否符合身份证免托管政策',
    required: true,
    type: 'select',
    list: ConfirmType,
    sort: 0
  },
  identityUntrusteeshipApply: {
    label: '是否申请身份证免托管',
    required: true,
    type: 'select',
    list: ConfirmType,
    sort: 1
  },
  'slotIdCardItem': {
    type: 'slot',
    slotName: 'slot-idcard-item',
    sort: 2
  }
}, 1200, 480)

export const RequirementsIdCardItem = switchObjectToArray({
  accountName: {
    label: '客户姓名',
    required: true,
    type: 'pick',
    sort: 0
  },
  accountNo: {
    label: '证件号码',
    required: true,
    type: 'text',
    sort: 1
  },
  cardType: {
    label: '关系人类型',
    required: true,
    type: 'text',
    sort: 2
  }
}, 1178, 420)

export const RequirementsHouseList = switchObjectToArray({
  certificateKeep: {
    label: '产证保管位置:',
    type: 'input',
    readonly: true,
    disabled: true,
    hasBorder: false,
    width: 2400,
    labelWidth: 230,
    sort: 0
  },
  'slotIdCardItem': {
    type: 'slot',
    slotName: 'slot-idcard-item',
    width: 2400,
    sort: 2
  }
}, 1200, 480)

export const RequirementsHouseItem = switchObjectToArray({
  cardType: {
    label: '产证类型',
    required: true,
    pickType: '产证类型',
    type: 'pick',
    sort: 0
  },
  accountNo: {
    label: '产证/土地证编号',
    required: true,
    type: 'input',
    sort: 1
  },
  remark: {
    label: '备注',
    placeholder: '请输入备注信息',
    type: 'mark',
    width: 2400,
    sort: 2
  }
}, 1178, 420)

export const DownHouseSurveyItem = switchObjectToArray({
  'customerSaidCertificateIsInHand': {
    label: '客户反馈房产是否红本在手',
    required: true,
    list: ConfirmType,
    block: 'downHouseSurvey',
    type: 'select',
    sort: 0
  },
  'customerInputAddressConsistentWithCertificate': {
    label: '客户录入的房产地址与产证地址是否一致',
    required: true,
    list: ConfirmType,
    block: 'downHouseSurvey',
    type: 'select',
    sort: 1
  },
  'cannotFindMortgageHouse': {
    label: '是否能找到抵押房产或抵押房产是否存在',
    required: true,
    list: ConfirmType,
    block: 'downHouseSurvey',
    type: 'select',
    sort: 2
  },
  'mortgageHouseDismantled': {
    label: '抵押房产是否已被拆除',
    required: true,
    list: ConfirmType,
    block: 'downHouseSurvey',
    type: 'select',
    sort: 3
  },
  'partMortgageHouseDismantled': {
    label: '建筑物是否被部分拆除',
    required: true,
    list: ConfirmType,
    block: 'downHouseSurvey',
    type: 'select',
    sort: 4
  },
  'addressFieldsNotConsistentWithCertificate': {
    label: '地址、小区、楼栋、户号是否和证载地址一致',
    required: true,
    list: ConfirmType,
    block: 'downHouseSurvey',
    type: 'select',
    sort: 5
  },
  'hasAbnormalSituation': {
    label: '产权人反馈该房产是否存在加建、扩建、改建、违建、添附（阁楼、地下室）、重大内部改造、与其他产证房屋贯通、房改房情况',
    required: true,
    list: ConfirmType,
    block: 'downHouseSurvey',
    type: 'select',
    sort: 6
  },
  'hasBeenOccupied': {
    label: '产权人反馈该房产是否被占用',
    required: true,
    list: ConfirmType,
    block: 'downHouseSurvey',
    type: 'select',
    sort: 7
  },
  'houseLiveStatus': {
    label: '房屋居住状态',
    pickTitle: '房屋居住状态',
    required: true,
    disc: DISC_HOUSE_LIVE_STATUS,
    block: 'downHouseSurvey',
    type: 'select',
    sort: 8
  },

  'decorationDegree': {
    label: '装修程度',
    pickTitle: '装修程度',
    required: true,
    disc: DISC_DECORATION_DEGREE,
    block: 'downHouseSurvey',
    type: 'select',
    sort: 9
  },
  'otherInstructions': {
    label: '其他影响房屋价值的风险状况说明',
    required: true,
    block: 'downHouseSurvey',
    type: 'mark',
    width: 3300,
    sort: 10
  }
}, 2400, 1180)

export const RequirementsOtherItem = switchObjectToArray({
  accountName: {
    label: '证件名称',
    required: true,
    type: 'input',
    sort: 0
  },
  'remark': {
    label: '备注',
    placeholder: '请输入备注信息',
    type: 'mark',
    width: 2400,
    sort: 2
  }
}, 1178, 420)

export const RequirementsRemarkItem = addSortIndex({
  '备注信息': {
    sort: 0,
    children: switchObjectToArray({
      'nodeRemark': {
        label: '备注',
        block: 'orderMatterRecordList',
        placeholder: '请输入备注信息',
        type: 'mark',
        width: 2400,
        sort: 2
      }
    })
  }
}, 1178, 420)

export const ApplyLoanItem = addSortIndex({
  '基本信息': {
    title: '',
    sort: 0,
    children: switchObjectToArray({
      'supervisionAgreementGetTime': {
        label: '监管协议领取时间',
        productType: 65190, // [15, 14, 13, 12, 11, 10, 9, 7, 5, 2, 1],,
        block: 'newLoan',
        type: 'datetime',
        min: false,
        sort: 0
      },
      'supervisionTime': {
        label: '预计监管时间',
        productType: 65190, // [15, 14, 13, 12, 11, 10, 9, 7, 5, 2, 1],,
        block: 'newLoan',
        type: 'datetime',
        sort: 1
      },
      'refundSource': {
        label: '回款来源',
        pickTitle: '回款来源',
        disc: DISC_REPAY_SOURCE,
        productType: 1504, // [10, 8, 7, 6, 5]
        block: 'feeSummary',
        type: 'pick',
        sort: 2
      }
    }, 1200, 440)
  },
  '交易信息': {
    sort: 1,
    children: switchObjectToArray({
      'tradingPrice': {
        label: '实际成交价（元）',
        productType: 33958, // [15, 10, 7, 5, 2, 1]
        block: 'dealInfo',
        valid: 'number',
        type: 'money',
        sort: 0
      },
      'earnestMoney': {
        label: '定金（元）',
        productType: 33958, // [15, 10, 7, 5, 2, 1]
        block: 'dealInfo',
        valid: 'number',
        type: 'money',
        sort: 1
      },
      'downPaymentAmount': {
        label: '首付款（元）',
        productType: 33958, // [15, 10, 7, 5, 2, 1]
        block: 'feeSummary',
        valid: 'number',
        type: 'money',
        sort: 2
      },
      'tailAmount': {
        label: '尾款（元）',
        productType: 33958, // [15, 10, 7, 5, 2, 1]
        block: 'feeSummary',
        valid: 'number',
        type: 'money',
        sort: 3
      }
    }, 1200, 440)
  },
  '新贷款信息': {
    sort: 2,
    children: switchObjectToArray({
      'newLoanBankCode|newLoanBankName': {
        label: '新贷款机构',
        required: true,
        hasChoose: true,
        block: 'newLoan',
        type: 'input',
        sort: 0
      },
      'borrowerType': {
        label: '新贷款借款人类型',
        required: true,
        disc: DISC_ACCOUNT_TYPE,
        block: 'newLoan',
        type: 'select',
        sort: 1
      },
      'sellerName': {
        label: '新贷款借款人',
        required: true,
        block: 'newLoan',
        type: 'pick',
        sort: 2
      },
      'businessSum': {
        label: '预计商业贷款金额（元）',
        required: true,
        block: 'newLoan',
        valid: 'number',
        type: 'money',
        sort: 3
      },
      'repayMethodLoan': {
        label: '还款方式',
        disc: DISC_REPAY_WAY,
        productType: 33118, // [15, 8, 6, 4, 3, 2, 1],
        block: 'newLoan',
        type: 'select',
        sort: 4
      },
      'loanTerms': {
        label: '贷款期限（月）',
        productType: 33118, // [15, 8, 6, 4, 3, 2, 1],
        block: 'newLoan',
        valid: 'int',
        type: 'input',
        sort: 5
      },
      'newLoanRate': {
        label: '贷款利率（%）',
        productType: 33118, // [15, 8, 6, 4, 3, 2, 1],
        block: 'newLoan',
        inputValid: 'number,,8',
        valid: 'number',
        type: 'number',
        sort: 6
      },
      'newBankUser': {
        label: '新贷款机构联系人',
        productType: 65534,
        block: 'newLoan',
        type: 'input',
        sort: 7
      },
      'newBankPhone': {
        label: '新贷款机构联系方式',
        productType: 65534,
        block: 'newLoan',
        valid: 'tel',
        type: 'input',
        sort: 8
      },
      // 新增两个字段19-1-2
      'revolvingCreditFlag': {
        label: '循环授信贷款',
        required: true,
        list: ConfirmTypeNumber,
        productType: 344, // [3，4，6，8]
        block: 'newLoan',
        type: 'select',
        sort: 9
      },
      'applyWithdrawAmount': {
        label: '申请提款金额（元）',
        required: true,
        productType: 344, // [3，4，6，8]
        block: 'newLoan',
        hidden: true,
        valid: 'number',
        type: 'money',
        sort: 10
      },
      'isHaveFundLoan': {
        label: '是否有公积金贷款',
        required: true,
        list: ConfirmType,
        productType: 160, // [7, 5]
        block: 'newLoan',
        type: 'select',
        sort: 11
      },
      'providentFundLoanAmount': {
        label: '预计公积金贷款金额（元）',
        required: true,
        productType: 160, // [7, 5]
        block: 'newLoan',
        valid: 'number',
        type: 'money',
        sort: 12
      },
      'fundLoanTerms': {
        label: '公积金贷款期限（年）',
        required: true,
        productType: 160, // [7, 5]
        block: 'newLoan',
        valid: 'int',
        type: 'input',
        sort: 13
      },
      'fundRate': {
        label: '公积金贷款利率（%）',
        required: true,
        productType: 160, // [7, 5]
        block: 'newLoan',
        valid: 'number',
        inputValid: 'number,,8',
        type: 'number',
        sort: 14
      },
      'totalMoney': {
        label: '预计贷款合计（元）',
        readonly: true,
        disabled: true,
        productType: 1184,
        width: 2400,
        type: 'money',
        sort: 15
      }
    }, 1200, 440)
  },
  '监管信息': {
    sort: 3,
    children: switchObjectToArray({
      'hasFundSupervision': {
        label: '是否有资金监管',
        list: ConfirmType,
        required: true,
        productType: 1184, // [11, 7, 5]
        block: 'newLoan',
        type: 'select',
        sort: 0
      },
      'amount': {
        label: '资金监管金额（元）',
        required: true,
        productType: 1184, // [11, 7, 5]
        block: 'supervisionList',
        valid: 'number',
        type: 'money',
        sort: 1
      },
      'name': {
        label: '监管款卡户名',
        required: true,
        productType: 1184, // [11, 7, 5]
        block: 'accountList',
        type: 'input',
        sort: 2
      },
      'number': {
        label: '监管款卡卡号',
        required: true,
        hasCamera: true,
        productType: 1184, // [11, 7, 5]
        block: 'accountList',
        valid: 'card',
        type: 'input',
        fileType: 'OWNERACCOUNTQK',
        fileUploadType: 'M05006',
        sort: 3
      },
      'openBankNo|openBank': {
        label: '监管款卡开户行',
        required: true,
        hasChoose: true,
        productType: 1184, // [11, 7, 5]
        block: 'accountList',
        type: 'input',
        sort: 4
      }
    }, 1200, 440)
  },
  '备注信息': {
    title: '',
    sort: 4,
    children: switchObjectToArray({
      'nodeRemark': {
        label: '备注',
        block: 'orderMatterRecordList',
        placeholder: '请输入备注信息',
        type: 'mark',
        width: 2400,
        sort: 0
      }
    }, 1200, 440)
  }
})

export const ApplyLoan_AtoneItem = switchObjectToArray({
  'newLoanBankCode|newLoanBankName': {
    label: '（赎楼）贷款银行',
    required: true,
    hasChoose: true,
    block: 'newLoan',
    type: 'input',
    sort: 0
  },
  'bankUser': {
    label: '（赎楼）贷款银行联系人',
    block: 'ransomFloor',
    type: 'input',
    sort: 1
  },
  'bankPhone': {
    label: '（赎楼）联系方式',
    block: 'ransomFloor',
    valid: 'tel',
    type: 'input',
    sort: 2
  },
  'remark': {
    label: '备注',
    block: 'newLoan',
    placeholder: '请输入备注信息',
    type: 'mark',
    width: 2400,
    sort: 3
  }
}, 1200, 440)

export const PreRandomItem = addSortIndex({
  '原商业贷款': {
    sort: 0,
    children: switchObjectToArray({
      'oriLoanBankCode|oriLoanBankName': {
        label: '原贷款机构',
        required: true,
        hasChoose: true,
        block: 'oriLoan',
        type: 'input',
        sort: 0
      },
      'borrowerType': {
        label: '原贷款借款人类型',
        required: true,
        disc: DISC_ACCOUNT_TYPE,
        block: 'oriLoan',
        type: 'select',
        sort: 1
      },
      'oriLoanPayee': {
        label: '原贷款借款人',
        required: true,
        block: 'oriLoan',
        type: 'pick',
        sort: 2
      },
      'busiDeductPrincipalBalance': {
        label: '商贷本金余额（元）',
        required: true,
        valid: 'number',
        block: 'oriLoan',
        type: 'money',
        sort: 3
      },
      'preFineAmount': {
        label: '预计罚息（元）',
        valid: 'number',
        block: 'oriLoan',
        type: 'money',
        sort: 4
      },
      'preRansomDate': {
        label: '预计赎楼时间',
        required: true,
        block: 'oriLoan',
        type: 'datetime',
        sort: 5
      },
      'repayMethod': {
        label: '扣款方式',
        disc: DISC_CHARGE_MODE,
        required: true,
        block: 'oriLoan',
        type: 'pick',
        sort: 6
      },
      'deductDateInterval': {
        label: '扣款时间段',
        disc: DISC_CHARGE_TIME,
        block: 'oriLoan',
        type: 'pick',
        sort: 7
      },
      'oriBankUser': {
        label: '原贷款机构联系人',
        block: 'oriLoan',
        type: 'input',
        sort: 8
      },
      'oriBankPhone': {
        label: '原贷款机构联系方式',
        valid: 'tel',
        block: 'oriLoan',
        type: 'input',
        sort: 9
      },
      'hasSecondMortgage': {
        label: '本笔贷款是否为二押',
        required: true,
        list: ConfirmType,
        block: 'oriLoan',
        type: 'select',
        sort: 10
      },
      'firstMortgageAmount': {
        label: '一押本金余额（元）',
        required: true,
        valid: 'number',
        block: 'oriLoan',
        type: 'money',
        sort: 11
      },
      'totalMoney': {
        label: '贷款余额合计（元）',
        readonly: true,
        disabled: true,
        width: 2400,
        type: 'money',
        sort: 12
      }
    }, 1200, 440)
  },
  '公积金贷款': {
    sort: 1,
    children: switchObjectToArray({
      'fundLoanFlag': {
        label: '是否有公积金贷款',
        required: true,
        list: ConfirmType,
        block: 'oriLoan',
        type: 'select',
        sort: 0
      },
      'fundDeductBalance': {
        label: '公积金贷款本金余额(元)',
        required: true,
        valid: 'number',
        block: 'oriLoan',
        type: 'money',
        sort: 1
      },
      'fundRepayUser': {
        label: '公积金还款联系人',
        block: 'oriLoan',
        type: 'input',
        sort: 2
      },
      'fundRepayUserPhone': {
        label: '公积金还款联系人联系方式',
        valid: 'tel',
        block: 'oriLoan',
        type: 'input',
        sort: 3
      }
    }, 1200, 440)
  },
  '关联贷款': {
    sort: 2,
    children: switchObjectToArray({
      'isRelationLoan': {
        label: '是否有关联贷款',
        required: true,
        list: ConfirmType,
        block: 'oriLoan',
        type: 'select',
        sort: 0
      },
      'relationLoanBalance': {
        label: '关联贷款余额（元）',
        required: true,
        valid: 'number',
        block: 'oriLoan',
        type: 'money',
        sort: 1
      }
    }, 1200, 440)
  },
  '供楼卡信息': {
    sort: 3,
    children: switchObjectToArray({
      'slotCardItem': {
        type: 'slot',
        slotName: 'slot-card-item'
      }
    }, 1200, 440)
  },
  '备注信息': {
    title: '',
    sort: 4,
    children: switchObjectToArray({
      'nodeRemark': {
        label: '备注',
        block: 'orderMatterRecordList',
        placeholder: '请输入备注信息',
        type: 'mark',
        width: 2400,
        sort: 0
      }
    }, 1200, 440)
  }
})
export const SupplyLoanMarkCardItem = switchObjectToArray({
  'name': {
    label: '供楼卡户名',
    required: true,
    type: 'input',
    sort: 0
  },
  'number': {
    label: '供楼卡卡号',
    required: true,
    hasCamera: true,
    valid: 'card',
    fileType: 'OWNERACCOUNTQK',
    fileUploadType: 'M05001',
    type: 'input',
    sort: 1
  },
  'openBankNo|openBank': {
    label: '供楼卡开户行',
    required: true,
    hasChoose: true,
    type: 'input',
    sort: 2
  }
})

export const AgreeLoanMarkItem = addSortIndex({
  '基本信息': {
    title: '',
    sort: 0,
    children: switchObjectToArray({
      'supervisionAgreementGetTime': {
        label: '监管协议领取时间',
        productType: 65190, // [15, 14, 13, 12, 11, 10, 9, 7, 5, 2, 1],
        block: 'newLoan',
        min: false,
        type: 'datetime',
        sort: 0
      },
      'supervisionTime': {
        label: '预计监管时间',
        productType: 65190, // [15, 14, 13, 12, 11, 10, 9, 7, 5, 2, 1],
        block: 'newLoan',
        type: 'datetime',
        sort: 1
      }
    }, 1200, 440)
  },
  '交易信息': {
    sort: 1,
    children: switchObjectToArray({
      'actualTradingPrice': {
        label: '实际成交价（元）',
        productType: 33958, // [15, 10, 7, 5, 2, 1]
        block: 'dealInfo',
        valid: 'number',
        type: 'money',
        sort: 0
      },
      'earnestMoney': {
        label: '定金（元）',
        productType: 33958, // [15, 10, 7, 5, 2, 1]
        block: 'dealInfo',
        valid: 'number',
        type: 'money',
        sort: 1
      },
      'downPaymentAmount': {
        label: '首付款（元）',
        productType: 33958, // [15, 10, 7, 5, 2, 1]
        block: 'feeSummary',
        valid: 'number',
        type: 'money',
        sort: 2
      },
      'tailAmount': {
        label: '尾款（元）',
        productType: 33958, // [15, 10, 7, 5, 2, 1]
        block: 'feeSummary',
        valid: 'number',
        type: 'money',
        sort: 3
      }
    }, 1200, 440)
  },
  '同贷信息': {
    sort: 2,
    children: switchObjectToArray({
      'newLoanBankCode|newLoanBankName': {
        label: '新贷款机构',
        required: true,
        hasChoose: true,
        block: 'newLoan',
        type: 'input',
        sort: 0
      },
      'borrowerType': {
        label: '新贷款借款人类型',
        required: true,
        disc: DISC_ACCOUNT_TYPE,
        block: 'newLoan',
        type: 'select',
        sort: 1
      },
      'agreeLoanSource': {
        label: '同贷来源',
        required: true,
        disc: DISC_AGREE_LOAN_SOURCE,
        block: 'newLoan',
        type: 'pick',
        sort: 2
      },
      'agreeLoanOtherRemark': {
        label: '其他来源',
        required: true,
        hidden: true,
        block: 'newLoan',
        type: 'input',
        sort: 3
      },
      'sellerName': {
        label: '新贷款借款人',
        required: true,
        block: 'newLoan',
        type: 'pick',
        sort: 4
      },
      'newBankUser': {
        label: '新贷款机构联系人',
        block: 'newLoan',
        type: 'input',
        sort: 5
      },
      'newBankPhone': {
        label: '新贷款机构联系方式',
        block: 'newLoan',
        valid: 'tel',
        type: 'input',
        sort: 6
      },
      // 新增两个字段19-1-2
      'revolvingCreditFlag': {
        label: '循环授信贷款',
        required: true,
        list: ConfirmTypeNumber,
        productType: 344, // [3，4，6，8]
        block: 'newLoan',
        type: 'select',
        sort: 7
      },
      'applyWithdrawAmount': {
        label: '申请提款金额（元）',
        required: true,
        productType: 344, // [3，4，6，8]
        block: 'newLoan',
        hidden: true,
        valid: 'number',
        type: 'money',
        sort: 8
      },
      // 新增字段18-12
      'thirdType': {
        label: '第三方收款账户类型',
        required: true,
        list: NumberThirdType,
        productType: 344, // [3,4,6,8]
        block: 'newLoan',
        type: 'select',
        sort: 9
      },
      // 'agreeLoanType': {
      //   label: '同贷类型',
      //   pickTitle: '同贷类型',
      //   disc: DISC_AGREE_LOAN_TYPE,
      //   productType: 480, // [8, 7, 6, 5]
      //   block: 'newLoan',
      //   type: 'pick',
      //   sort: 6
      // },
      'borrowContNo': {
        label: '借款合同编号',
        required: false,
        productType: 32798, // [15, 4, 3, 2, 1]
        readonly: false,
        block: 'newLoan',
        type: 'input',
        sort: 10
      },
      'bizLoanAmount': {
        label: '实际商业贷款金额（元）',
        required: true,
        readonly: false,
        block: 'newLoan',
        valid: 'number',
        type: 'money',
        sort: 11
      },
      'repayMethodLoan': {
        label: '还款方式',
        required: true,
        disc: DISC_REPAY_WAY,
        productType: 32798, // [15, 4, 3, 2, 1],
        block: 'newLoan',
        type: 'select',
        sort: 12
      },
      'loanTerms': {
        label: '贷款期限（月）',
        productType: 33118, // [15, 8, 6, 4, 3, 2, 1],
        readonly: false,
        block: 'newLoan',
        valid: 'int',
        type: 'input',
        sort: 13
      },
      'newLoanRate': {
        label: '贷款利率（%）',
        productType: 33118, // [15, 8, 6, 4, 3, 2, 1],
        readonly: false,
        block: 'newLoan',
        inputValid: 'number,,8',
        valid: 'number',
        type: 'number',
        sort: 14
      },
      'providentFundLoanAmount': {
        label: '实际公积金贷款金额（元）',
        required: true,
        productType: 1184, // [11, 7, 5]
        block: 'newLoan',
        valid: 'number',
        type: 'money',
        sort: 15
      },
      'totalMoney': {
        label: '实际贷款金额合计（元）',
        readonly: true,
        disabled: true,
        productType: 1504,
        width: 2400,
        type: 'money',
        sort: 16
      },
      // 杭州银行系统对接优化 10-11-13-14
      'queryDockingResult': {
        label: '是否选择提放保',
        hidden: true,
        readonly: true,
        list: ConfirmTypeNumber,
        block: 'newLoan',
        index: 1,
        type: 'select',
        sort: 17
      }
    }, 1200, 440)
  },
  '监管信息': {
    sort: 3,
    children: switchObjectToArray({
      'hasFundSupervision': {
        label: '是否有资金监管',
        list: ConfirmType,
        required: true,
        productType: 24736, // [13 ,14 , 7, 5]
        block: 'newLoan',
        type: 'select',
        sort: 0
      },
      'amount': {
        label: '资金监管金额（元）',
        required: true,
        productType: 24736, // [13 ,14 , 7, 5]
        block: 'supervisionList',
        valid: 'number',
        type: 'money',
        sort: 1
      },
      'name': {
        label: '监管款卡户名',
        required: true,
        productType: 24736, // [13 ,14 , 7, 5]
        block: 'accountList',
        type: 'input',
        sort: 2
      },
      'number': {
        label: '监管款卡卡号',
        required: true,
        hasCamera: true,
        productType: 24736, // [13 ,14 , 7, 5]
        block: 'accountList',
        valid: 'card',
        type: 'input',
        fileType: 'OWNERACCOUNTQK',
        fileUploadType: 'M05006',
        sort: 3
      },
      'openBankNo|openBank': {
        label: '监管款卡开户行',
        required: true,
        hasChoose: true,
        productType: 24736, // [13 ,14 , 7, 5]
        block: 'accountList',
        type: 'input',
        sort: 4
      }
    }, 1200, 440)
  },
  '回款卡信息': {
    sort: 4,
    children: switchObjectToArray({
      'refundSource': {
        label: '回款来源',
        pickTitle: '回款来源',
        required: true,
        width: 2400,
        disc: DISC_REPAY_SOURCE,
        productType: 1504, // [10, 8, 7, 6, 5]
        block: 'feeSummary',
        type: 'pick',
        sort: 0
      },
      'slotCardItem': {
        productType: 1504,
        type: 'slot',
        slotName: 'slot-card-item'
      }
    }, 1200, 440)
  },
  '账户信息': {
    sort: 5,
    children: switchObjectToArray({
      'name': {
        label: '户名',
        required: true,
        productType: 32798, // [15, 4, 3, 2, 1],
        block: 'accountList',
        type: 'input',
        sort: 1
      },
      'number': {
        label: '卡号',
        required: true,
        hasCamera: true,
        productType: 32798, // [15, 4, 3, 2, 1],
        block: 'accountList',
        valid: 'card',
        fileType: 'OWNERACCOUNTQK',
        fileUploadType: 'M05002',
        type: 'input',
        sort: 2
      },
      'openBankNo|openBank': {
        label: '开户行',
        required: true,
        hasChoose: true,
        productType: 32798, // [15, 4, 3, 2, 1],
        block: 'accountList',
        type: 'input',
        sort: 3
      }
    }, 1200, 440)
  },
  '备注信息': {
    title: '',
    sort: 6,
    children: switchObjectToArray({
      'nodeRemark': {
        label: '备注',
        block: 'orderMatterRecordList',
        placeholder: '请输入备注信息',
        type: 'mark',
        width: 2400,
        sort: 0
      }
    }, 1200, 440)
  }
})

export const AgreeLoanMarkCardItem = switchObjectToArray({
  name: {
    label: '回款卡户名',
    required: true,
    productType: 1504, // [10, 8, 7, 6, 5]
    type: 'input',
    sort: 0
  },
  number: {
    label: '回款卡卡号',
    required: true,
    hasCamera: true,
    productType: 1504, // [10, 8, 7, 6, 5]
    valid: 'card',
    fileType: 'OWNERACCOUNTQK',
    fileUploadType: 'M05002',
    type: 'input',
    sort: 1
  },
  type: {
    label: '回款卡类型',
    pickTitle: '回款卡类型',
    required: true,
    list: IncomeCardType,
    productType: 1504, // [10, 8, 7, 6, 5]
    type: 'pick',
    sort: 2
  },
  'openBankNo|openBank': {
    label: '回款卡开户行',
    required: true,
    hasChoose: true,
    productType: 1504, // [10, 8, 7, 6, 5]
    type: 'input',
    sort: 3
  }
}, 1180, 420)

export const AgreeLoanMark_AtoneItem = addSortIndex({
  '基本信息': {
    title: '',
    sort: 0,
    children: switchObjectToArray({
      'sellerName': {
        label: '借款人姓名',
        required: true,
        block: 'applyOrder',
        type: 'pick',
        sort: 0
      },
      'sellerCardNo': {
        label: '身份证（证件）号码',
        required: true,
        block: 'ransomFloor',
        type: 'input',
        sort: 1
      },
      'newLoanBankCode|newLoanBankName': {
        label: '赎楼贷款银行',
        required: true,
        block: 'newLoan',
        disabled: true,
        type: 'input',
        sort: 2
      },
      'ransomBorrowAmount': {
        label: '实际（赎楼）贷款金额（元）',
        required: true,
        valid: 'number',
        block: 'feeSummary',
        type: 'money',
        sort: 3
      },
      'loanRate': {
        label: '赎楼贷款利率（%）',
        required: true,
        valid: 'number',
        inputValid: 'number,,8',
        block: 'ransomFloor',
        type: 'input',
        sort: 4
      },
      'loanTerms': {
        label: '赎楼贷款期限（月）',
        required: true,
        valid: 'number',
        block: 'ransomFloor',
        type: 'input',
        sort: 5
      },
      'repayMethod': {
        label: '赎楼贷款还款方式',
        required: true,
        block: 'ransomFloor',
        disc: RANSOM_REPAY_TYPE,
        type: 'pick',
        sort: 6
      },
      'borrowContNo': {
        label: '赎楼贷款合同编号',
        required: true,
        block: 'newLoan',
        type: 'input',
        sort: 7
      }
    }, 1200, 500)
  },
  '账户信息': {
    sort: 1,
    children: switchObjectToArray({
      'name': {
        label: '户名',
        required: true,
        productType: 32798, // [15, 4, 3, 2, 1],
        block: 'accountList',
        type: 'input',
        sort: 1
      },
      'number': {
        label: '卡号',
        required: true,
        hasCamera: true,
        productType: 32798, // [15, 4, 3, 2, 1],
        block: 'accountList',
        valid: 'card',
        fileType: 'OWNERACCOUNTQK',
        fileUploadType: 'M05002',
        type: 'input',
        sort: 2
      },
      'openBankNo|openBank': {
        label: '开户行',
        required: true,
        hasChoose: true,
        productType: 32798, // [15, 4, 3, 2, 1],
        block: 'accountList',
        type: 'input',
        sort: 3
      }
    }, 1200, 500)
  },
  '备注信息': {
    title: '',
    sort: 2,
    children: switchObjectToArray({
      'nodeRemark': {
        label: '备注',
        block: 'orderMatterRecordList',
        placeholder: '请输入备注信息',
        type: 'mark',
        width: 2400,
        sort: 0
      }
    }, 1200, 500)
  }
})

export const RedemptionRegisterItem = switchObjectToArray({
  preFineAmount: {
    label: '预计罚息（元）',
    disabled: true,
    readonly: true,
    hasBorder: false,
    width: 2200,
    block: 'oriLoan',
    type: 'money',
    sort: 0
  },
  oriBankUser: {
    label: '银行联系人',
    valid: 'name',
    block: 'oriLoan',
    type: 'input',
    sort: 1
  },
  oriBankPhone: {
    label: '联系方式',
    valid: 'tel',
    block: 'oriLoan',
    type: 'input',
    sort: 2
  },
  ransomFlag: {
    label: '赎楼状态',
    required: true,
    disc: DISC_REDEMPTION_STATUS,
    block: 'ransomFloor',
    type: 'select',
    sort: 3
  },
  preRansomNextTime: {
    label: '预计下次赎楼时间',
    required: true,
    block: 'ransomFloor',
    type: 'date',
    sort: 4
  },
  ransomFailReason: {
    label: '赎楼失败原因',
    required: true,
    width: 2200,
    block: 'ransomFloor',
    type: 'input',
    sort: 5
  },
  ransomCutAmount: {
    label: '赎楼扣款金额（元）',
    required: true,
    valid: 'number',
    block: 'ransomFloor',
    type: 'money',
    sort: 6
  },
  ransomCutTime: {
    label: '赎楼扣款时间',
    required: true,
    width: 2200,
    block: 'ransomFloor',
    min: false,
    type: 'date',
    sort: 7
  },
  nextMatterKey: {
    label: '下一办理事项',
    defaultValue: 'GetCancelMaterial',
    required: true,
    block: 'orderMatterRecordList',
    type: 'pick',
    sort: 8
  },
  nextHandleTime: {
    label: '预计办理时间',
    required: true,
    block: 'orderMatterRecordList',
    type: 'datetime',
    sort: 9
  },
  'nodeRemark': {
    label: '备注',
    block: 'orderMatterRecordList',
    placeholder: '请输入备注信息',
    type: 'mark',
    width: 2400,
    sort: 10
  }
}, 1200, 550)

export const GetCancelMaterialItem = switchObjectToArray({
  nextMatterKey: {
    label: '下一办理事项',
    defaultValue: 'CancleMortgage',
    required: true,
    block: 'orderMatterRecordList',
    type: 'pick',
    sort: 0
  },
  nextHandleTime: {
    label: '预计办理时间',
    required: true,
    block: 'orderMatterRecordList',
    type: 'datetime',
    sort: 1
  },
  'nodeRemark': {
    label: '备注',
    block: 'orderMatterRecordList',
    placeholder: '请输入备注信息',
    type: 'mark',
    width: 2400,
    sort: 2
  }
}, 1200, 500)

export const CancelMortgageItem = switchObjectToArray({
  cancelGuanratyTime: {
    label: '注销抵押时间',
    required: true,
    block: 'houseTransfer',
    min: false,
    type: 'date',
    sort: 0
  },
  nextMatterKey: {
    label: '下一办理事项',
    required: true,
    block: 'orderMatterRecordList',
    type: 'pick',
    sort: 1
  },
  nextHandleTime: {
    label: '预计办理时间',
    required: true,
    block: 'orderMatterRecordList',
    type: 'datetime',
    sort: 2
  },
  'nodeRemark': {
    label: '备注',
    block: 'orderMatterRecordList',
    placeholder: '请输入备注信息',
    type: 'mark',
    width: 2400,
    sort: 3
  }
}, 1200)

export const TransferInItem = switchObjectToArray({
  transferPostTime: {
    label: '过户递件时间',
    required: true,
    block: 'houseTransfer',
    min: false,
    type: 'date',
    sort: 0
  },
  nextMatterKey: {
    label: '下一办理事项',
    required: true,
    defaultValue: 'TransferOut',
    block: 'orderMatterRecordList',
    type: 'pick',
    sort: 1
  },
  nextHandleTime: {
    label: '预计办理时间',
    required: true,
    block: 'orderMatterRecordList',
    type: 'datetime',
    sort: 2
  },
  'nodeRemark': {
    label: '备注',
    block: 'orderMatterRecordList',
    placeholder: '请输入备注信息',
    type: 'mark',
    width: 2400,
    sort: 3
  }
}, 1200)

export const TransferOutItem = switchObjectToArray({
  transferOutTime: {
    label: '过户出件时间',
    required: true,
    block: 'houseTransfer',
    min: false,
    type: 'date',
    sort: 0
  },
  nextMatterKey: {
    label: '下一办理事项',
    required: true,
    defaultValue: 'MortgagePass',
    block: 'orderMatterRecordList',
    type: 'pick',
    sort: 1
  },
  nextHandleTime: {
    label: '预计办理时间',
    required: true,
    block: 'orderMatterRecordList',
    type: 'datetime',
    sort: 2
  },
  'nodeRemark': {
    label: '备注',
    block: 'orderMatterRecordList',
    placeholder: '请输入备注信息',
    type: 'mark',
    width: 2400,
    sort: 3
  }
}, 1200)

export const MortgagePassItem = switchObjectToArray({
  mortgagePostTime: {
    label: '抵押递件时间',
    required: true,
    block: 'houseTransfer',
    min: false,
    type: 'date',
    sort: 0
  },
  nextMatterKey: {
    label: '下一办理事项',
    productType: 65023, // 除了大道按揭[9]
    required: true,
    defaultValue: 'MortgageOut',
    block: 'orderMatterRecordList',
    type: 'pick',
    sort: 1
  },
  nextHandleTime: {
    label: '预计办理时间',
    productType: 65023, // 除了大道按揭[9]
    required: true,
    block: 'orderMatterRecordList',
    type: 'datetime',
    sort: 2
  },
  'nodeRemark': {
    label: '备注',
    block: 'orderMatterRecordList',
    placeholder: '请输入备注信息',
    type: 'mark',
    width: 2400,
    sort: 3
  }
}, 1200)

export const MortgageOutItem = switchObjectToArray({
  mortgageOutTime: {
    label: '抵押出件时间',
    required: true,
    block: 'houseTransfer',
    min: false,
    type: 'date',
    sort: 0
  },
  nextMatterKey: {
    label: '下一办理事项',
    required: true,
    productType: 64542, // [1, 2, 3, 4, 10, 11, 12, 13, 14, 15]保险类产品
    defaultValue: 'MortgageOut',
    readonly: true,
    disabled: true,
    list: [],
    index: 0,
    type: 'pick',
    sort: 1
  },
  nextHandleTime: {
    label: '预计银行放款时间',
    required: true,
    block: 'orderMatterRecordList',
    type: 'datetime',
    sort: 2
  },
  'nodeRemark': {
    label: '备注',
    block: 'orderMatterRecordList',
    placeholder: '请输入备注信息',
    type: 'mark',
    width: 2400,
    sort: 3
  }
}, 1200)
