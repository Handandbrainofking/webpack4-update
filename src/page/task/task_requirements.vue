<template>
  <div class="tab-contain-wrap">
    <DTab
       ref="d-tab-set"
       mode="bottom-short"
       :isScrollTab="false"
       :swipe-change="true"
       :page-width="tabPageWidth"
       :page-height="!deleteFlag ? tabPageHeight : (tabPageHeight + 120)"
       :tab-styles="{ height: 120, headWrapStyle: {paddingTop: '10px'} }"
       :filter-change-tab="true"
       @beforeChangePage="beforeChangePage">
      <d-layout slot="tab-title-other" text-align="right" @clickLayout="doStop">
        <d-layout class="title-other-wrap" :full-parent="false" @clickLayout="showOrderPopup">
          <text class="btn-list-text">订单信息</text>
          <d-image src="/image/icon_detail.png" width="40" height="40"></d-image>
        </d-layout>
      </d-layout>
      <DTabPage
         :title="item.title"
         :key="`task-tab-page-${index}`" v-for="(item, index) in tabTitles">
        <component
           :ref="`wxc-requirements-tab-${index}`"
           :is="item.component"
           :deleteFlag="deleteFlag"
           v-if="showViewTab"
        ></component>
      </DTabPage>
    </DTab>
    <footer-button v-if="!deleteFlag" :btns="btnsArray" @clickBtn="doClickBtn"></footer-button>
    <task-order-info v-model="isShowOrderPopup" :orderId="applyNo"></task-order-info>
    <!-- <dialog-order-book :data-item="releaseItem" :flag="2" title="订单释放" @orderReleaseSuccess="orderReleaseSuccess"
                       @closeOrderBook="releaseModalShow=false" v-if="releaseModalShow"></dialog-order-book> -->
  </div>
</template>

<script>
import { throttle } from '@/utils/utils'
import IdCardList from '@/page/task/elements_hosting/idcard.vue';
import BankCardList from '@/page/task/elements_hosting/bankcard.vue';
import HouseCardList from '@/page/task/elements_hosting/housecard.vue';
import OtherCardList from '@/page/task/elements_hosting/othercard.vue';
import ImgList from '@/page/task/elements_hosting/imgList.vue';
import FooterButton from '@/page/task/components/task_footer_button.vue';
import TaskOrderInfo from '@/page/task/components/common/order-info.vue';
import dialog from '@/utils/dialog';
// import DialogOrderBook from '@/components/dialog/release-order.vue';
import RequirementsRemark from '@/page/task/elements_hosting/requirements_remark.vue';
import { native_eventStatistic } from '@/utils/deal_native'
import LocalStorageManage from '@/utils/storage'
import {
  native_module_events,
  native_logMessage,
  DEFINE_UPLOAD_IMAGE_BPMS,
  native_common_events,
  DEFINE_GET_LOCATION
} from '@/utils/deal_native';
import loginApi from '@/utils/login';
import { Validator } from '../../utils/validator';

export default {
  name: 'taskRequirements', //要件托管
  statistics: 'taskRequirements|跟单详情-要件托管',
  components: {
    IdCardList,
    BankCardList,
    HouseCardList,
    RequirementsRemark,
    OtherCardList,
    ImgList,
    FooterButton,
    TaskOrderInfo,
    // DialogOrderBook
  },
  props: {
    traceItem: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      showViewTab: true,
      dataList: [],
      matterKey: 'TrustAccount',
      btnsArray: ['提交'],
      tabTitles: [
        {
          title: '银行卡',
          component: 'BankCardList'
        },
        {
          title: '身份证',
          component: 'IdCardList'
        },
        {
          title: '房产证',
          component: 'HouseCardList'
        },
        {
          title: '其他证件',
          component: 'OtherCardList'
        },
        {
          title: '备注信息',
          component: 'RequirementsRemark'
        },
        {
          title: '影像资料',
          component: 'ImgList'
        }
      ],
      tabPageHeight: 1228,
      tabPageWidth: 2444,
      currentPage: 0,
      applyNo: '',
      productId: '',
      isShowOrderPopup: false,
      releaseItem: {},
      orderInfo: {},
      releaseModalShow: false,
      uploadList: [],
      operatorLocationX: '0',
      operatorLocationY: '0',
      operatorAddress: '',
      deleteFlag: false,
      transformTag: false,
      remark: ''
    };
  },
  created() {
    if (!this.traceItem.relateId) {
    		//如果事项不存储，则不展示
      this.deleteFlag = true;
    }
    if(this.traceItem.isHaveHandleRight && this.traceItem.isHaveHandleRight === '1') {
      this.deleteFlag = false
    } else {
      this.deleteFlag = true
    }
    this.tabList = this.tabTitles.map(i => false);
    Vue.set(this.tabList, this.currentPage, true);
    const applyNo = this.getPageParams('orderId', true) || 1;
    const productId = this.getPageParams('productType', true) || 1;
    this.applyNo = applyNo;
    this.productId = productId;
    let that = this
    this.requestApi.order_info({
      data: {
        applyNo: this.applyNo,
        relationKey: 'applyOrder'
      },
      success: data => {
        this.orderInfo = data.applyOrder || {};
        var loginInfo = loginApi.getLoginData();
        //TODO: ylh没有继承ExtendTaskBaseView 没做统一处理
        if(loginInfo.id != data.applyOrder.robUserId) {
          this.transformTag = true
        }
      }
    });

    native_common_events(DEFINE_GET_LOCATION).then(data => {
      const tdata = this.toJSON(data);
      this.operatorLocationX = tdata.longitude || '0';
      this.operatorLocationY = tdata.latitude || '0';
      this.operatorAddress = tdata.address;
      native_logMessage('获取的地理位置信息==' + JSON.stringify(tdata));
    });
    native_logMessage('获取的地理位置信息== create');
  },
  methods: {
    beforeChangePage(e, func) {
      const index = e.page;
      if (index !== this.currentPage) {
        this.currentPage = index
      }
      'function' === typeof func && func()
    },
    doClickBtn(idx,item,e) {
      var clickFunResult = undefined;
      e.btnClickStatus = true;
      switch (item) {
          case '提交':
            native_eventStatistic('requirementsSubmit', '要件托管-提交（requirements）')
            clickFunResult = this.doStaySubmit();
            break;
          default:
            break;
      }
      if(typeof clickFunResult === 'object'){
          clickFunResult.then(()=>{
              e.btnClickStatus = false;
          },(reason)=>{
             e.btnClickStatus = false;
          })
      }else if(clickFunResult != undefined){
          e.btnClickStatus = false;
      }   
      
    },
    doReleaseSave() {
      const _data = this.doValidate();
      const flag = 1;
      if (_data) {
        this.doSubmit(_data, flag)        
      }
     
    },
    doStaySubmit() {
      const _data = this.doValidate();
      const flag = 0;
      if (_data) {
        return this.doSubmit(_data, flag);
      }
       return false
    },
    doSubmit(_data, flag) {
      return new Promise((resolve, reject) => {
        this.requestApi.order_info_save({
          data: {
            applyNo: this.applyNo,
            taskId: this.traceItem.relateId,
            data: _data
          },
          success: data => {
            this.requestApi.order_info_submit({
              data: {
                applyNo: this.applyNo,
                operatorLocationX: this.operatorLocationX,
                operatorLocationY: this.operatorLocationY,
                operatorAddress: this.operatorAddress,
                taskId: this.traceItem.relateId,
                opinion: this.remark
              },
              success: data => {
                this.remark = '';
                this.$emit('upDateTaskId');
                this.doUploadFile();
                dialog.toast('提交成功');
                if(this.transformTag) {
                  this.deleteFlag = true
                }
                if (flag === 1) {
                  this.releaseItem = { ...this.orderInfo };
                  this.releaseModalShow = true;
                } else if (flag === 0) {
                  this.refreshPage();
                }
                resolve(data)
              }
            })
          }
        });
      })
    },
      //TODO 炒鸡复杂的校验 yjr
     doValidate() {
      try {
         var list = [];

        var accountTypeList = ['YHK', 'SFZ', 'FDCZ', 'QT'];
        for(var i=0;i<4;i++){
            var iditem = this.$refs['wxc-requirements-tab-' + i] && this.$refs['wxc-requirements-tab-' + i][0]
            && this.$refs['wxc-requirements-tab-' + i][0].iditem || [];
        		for(var k=0;iditem && k<iditem.length;k++){
        			iditem[k].accountType = accountTypeList[i];
        			list.push(iditem[k]);
        		}
        }
        var validateList = [
          ['accountNo', 'accountName', 'bankName', 'cardType','accountType'],
          ['accountName', 'accountNo', 'relation', 'cardType','accountType'],
          ['accountNo', 'cardType', 'remark','accountType'],
          ['accountName', 'remark','accountType']
        ];
        const _data = {};
        const _info = [];

		for (var i in list) {
		  if(!list[i]){
		  	continue;
		  }
          const tmpinfo = {};
          var tempHaveValue = false;
          var index=0;
          if(list[i].accountType == 'YHK'){
          	 index=0;
          }else if(list[i].accountType == 'SFZ'){
          	 index=1;
          }else if(list[i].accountType == 'FDCZ'){
          	 index=2;
          }else if(list[i].accountType == 'QT'){
          	 index=3;
          }
          for(var j=0;j<validateList[index].length && validateList[index][j]!='accountType';j++){

          		if (validateList[index][j] !== 'relation') {
              tmpinfo[validateList[index][j]] =
                list[i][validateList[index][j]].text;
            }
            if (validateList[index][j] === 'accountName' || validateList[index][j] === 'accountNo') {
              tmpinfo[validateList[index][j]] = list[i][validateList[index][j]].text && list[i][validateList[index][j]].text.toString().trim();
            }
            if(list[i][validateList[index][j]].text && !(list[i].accountType == 'SFZ' && validateList[index][j] == 'cardType')){
            		tempHaveValue = true;
            }

          }
          //只要一项有值，那么这个tab页其他的数据就做必填校验
          if(tempHaveValue){
          	 for (var j in validateList[index]) {
          	 	if ((list[i][validateList[index][j]].text === '' || !list[i][validateList[index][j]].text)
          	 	&& validateList[index][j] !== 'remark' && validateList[index][j]!='accountType') {
	              dialog.toast(
	                this.tabTitles[index].title+"页面-" + list[i][validateList[index][j]].placeHolder
	              );
	              return false;
	            }
          	 }
          }else{
          	continue
          }

          tmpinfo['accountType'] = list[i].accountType;
          tmpinfo['applyNo'] = this.applyNo;
          _info.push(tmpinfo);
		}
		_data.projectAccountList = _info;
		for(var j=0;j<_info.length;j++){
        // 银行卡处理
        if (_info[j].accountType == 'YHK') {
          let accountPlusList = [];
          for (var i in list) {
            if (list[i].accountType == 'YHK' && Validator['card'](list[i].accountNo.text) !== 'OK') {
              dialog.toast('请输入正确的银行卡账号！');
              return false;
            }
            if (list[i].accountType == 'YHK' && list[i].accountNo.show == true) {
              const accountPlusinfo = {
                applyNo: this.applyNo,
                name: list[i].accountName.text,
                number: list[i].accountNo.text,
                openBank: list[i].bankName.text,
                openBankNo: list[i].bankNo.text,
                type: list[i].cardType.text,
                houseNo:this.orderInfo.houseNo || ''
              };
              accountPlusList.push(accountPlusinfo);
              if (list[i].url.list.length !== 0) {
                let customerNo = '';
                let url = list[i].url.list;
                let fileType = '';
                list[i].cardType.text == 'GLK' && (fileType = 'M05001');
                (list[i].cardType.text == 'XDKSKK' ||
                  list[i].cardType.text == 'JGHKK' ||
                  list[i].cardType.text == 'AJHKZH' ||
                  list[i].cardType.text == 'GJJHKZH' ||
                  list[i].cardType.text == 'ZZZJSKZH' ||
                  list[i].cardType.text == 'QT(MMD)') &&
                (fileType = 'M05002');
                fileType == '' && (fileType = 'M05006');
                let tmpUploadInfo = {
                  url: url,
                  fileType: fileType
                };
                this.uploadList.push(tmpUploadInfo);
              }
            }
          }
          _data.accountList = accountPlusList;
        }
        // 身份证处理
        if (_info[j].accountType == 'SFZ') {
        		 for (var i in list) {
        		 		if(!this.$refs['wxc-requirements-tab-' + i]){
        		 			continue;
        		 		}
		          let fitNodeposit = this.$refs['wxc-requirements-tab-' + i][0].fitNodeposit;
		          let applyNodeposit = this.$refs['wxc-requirements-tab-' + i][0].applyNodeposit;
		          if(fitNodeposit === undefined){
		          		continue;
		          }
		          if (fitNodeposit.text == '') {
		            dialog.toast(fitNodeposit.placeHolder);
		            return false;
		          }
		          if (applyNodeposit.text == '') {
		            dialog.toast(applyNodeposit.placeHolder);
		            return false;
		          }
		          _data.applyOrderExtend = [
		            {
		              identityUntrusteeshipPolicy: fitNodeposit.text,
		              identityUntrusteeshipApply: applyNodeposit.text,
		              applyNo: this.applyNo
		            }
		          ];
		        }
        		}
			}
			var remarkItem = this.$refs['wxc-requirements-tab-' + 4] && this.$refs['wxc-requirements-tab-' + 4][0].iditem;
			//备注信息处理
        if (remarkItem && remarkItem.remark && remarkItem.remark.text) {
          this.remark = remarkItem.remark.text;
        }
        return _data;
      } catch (e) {
        dialog.toast(e);
      }
    },
    doUploadFile() {
      const customerNo = '';
      native_logMessage('doUploadFile== 1');
      this.uploadList = this.uniqueUploadFile(this.uploadList)
      native_logMessage('doUploadFile== 11');
      for (var i in this.uploadList) {
        native_module_events(
          DEFINE_UPLOAD_IMAGE_BPMS,
          this.applyNo,
          this.uploadList[i].fileType,
          this.uploadList[i].url,
          customerNo,
          0
        );
      }
    },
    uniqueUploadFile(uploadList){
       //去重复的上传文件
      if(uploadList.length == 0){
        return uploadList;
      }
     
     let result = {};
     let finalResult=[]; 
     for(let i=0;i<uploadList.length;i++){
         result[uploadList[i].url]=uploadList[i];
     }
     for(var item in result){
         finalResult.push(result[item]);
     }
     return finalResult;
    },
    refreshPage() {
      this.showViewTab = false;
      setTimeout(() => {
        this.showViewTab = true;
        this.uploadList=[];
      }, 100);
    },
    showOrderPopup() {
      if (!this.isShowOrderPopup) {
        this.isShowOrderPopup = true;
      }
    },
    orderReleaseSuccess() {
      this.releaseModalShow = false;
      LocalStorageManage.getLocalStorage('PARAMS_LIST').then((data) => {
        if(data.length >2) {
          let localParams = JSON.parse(data.split('||')[1]) || {}
          localParams.searchParams = decodeURIComponent(localParams.searchParams)
          this.jump('/index.js', false, true, localParams)
        }
    })
    },
    doStop() {
    }
  }
};
</script>

<style lang="sass" type="text/scss" scoped>
  .tab-contain-wrap {
    margin-top: 20px;
    flex-direction: column;
    flex: 1;
  }

  .tab-page {
    flex: 1;
  }
  .mask-requirements {
    position: absolute;
    top: 0px;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .nav-title {
    flex-direction: row;
    width: 216px;
    height: 120px;
    justify-content: center;
    align-items: center;
  }

  .nav-title-wrap {
    flex-direction: row;
    align-items: center;
    width: 1300px;
    flex: 1;
  }

  .text {
    height: 80px;
    line-height: 80px;
    text-align: center;
    font-size: $font_nav;
    color: $color_enclosure;
  }

  .text-active {
    color: $color_back;
    border-bottom-width: 6px;
    border-bottom-color: $color_back;
  }

  .title-other-wrap {
    padding-bottom: 20px;
    padding-right: 20px;
  }

  .btn-list-text {
    font-size: $font_nav;
    color: $color_back;
  }

  .item-container {
    margin-top: 20px;
    width: 2524px;
    height: 1100px;
    background-color: #fff;
    flex: 1;
  }

  .image-title {
    @include setPaddingH($normal_gap_root_column);
  }

  .block-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
