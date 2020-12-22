<template>
  <div v-if="show">
    <wxc-popup popup-color="#00000000" :show="true" marginLeft="300" @wxcPopupOverlayClicked="popupOverlayBottomClick"
               pos="bottom" height="310">
      <text @click="orgChange" :class="['dialog']">组织切换</text>
      <text @click="doSetting" :class="['dialog','logout-text']">设置</text>
      <text @click="doLogout" :class="['dialog','logout-text']">退出登录</text>
    </wxc-popup>
    <wxc-dialog v-if="showSelectOrgDialog" :show="true" :definedBtn="true" width="800" top="300" height="1000">
      <div slot="title" class="header">
        <text class="header-text">{{ dialogTitle }}</text>
        <div @click="dialogCancel" class="order-title-close">
          <text class="order-title-text">×</text>
        </div>
      </div>
      <div slot="content" class="content">
        <scroller class="scroller" style="margin-top: 60px;height: 900px;">
          <div class="options">
            <div class="option" v-for="(option,index) in dataList" :key="index"
                 :style="isCurrent(option) && selectedStyle" @click="doOrgCheck(option)">
              <text class="option-text" :style="isCurrent(option) && selectedTextStyle">{{option.title}}</text>
            </div>
          </div>
        </scroller>
        <div class="row">
          <text class="footer-btn" @click="dialogCancel">取消</text>
          <text class="footer-btn btn-confirm" @click="dialogConfirm">确定</text>
        </div>
      </div>
    </wxc-dialog>
    <wxc-dialog v-if="logoutDialog" :show="true" :definedBtn="true" width="800" top="700">
      <div slot="content">
        <text style="font-size: 44px;text-align: center;margin-top: 50px;margin-bottom: 50px;">确定要退出吗？</text>
        <div class="row">
          <text class="footer-btn" @click="logoutCancel">取消</text>
          <text class="footer-btn btn-confirm" @click="logoutConfirm">确定</text>
        </div>
      </div>
    </wxc-dialog>
  </div>
</template>

<script>
import WxcPopup from '@/components/wxc/popup.vue'
import WxcDialog from '@/components/dialog/dialog.vue'
import LoginDataApi from '@/utils/login'
import Dialog from '@/utils/dialog'
import { Login } from '@/router/defined'
import {
  native_getSystemInfo,
  native_logMessage,
  native_clearMemory,
  native_updateCacheData,
  native_uploadLog,
  DEFINE_AGAIN_GET_TOKEN,
  DEFINE_GET_LOCATION,
  native_common_events,
  native_companyChange
} from '@/utils/deal_native'

export default {
  components: {
    WxcDialog,
    WxcPopup
  },
  created() {

    this.getDevicesInfo();

  },
  model: {
    prop: 'show',
    event: 'settingInfoShowStatus'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    selectedStyle() {
      return {
        backgroundColor: '#EBF0F6'
      };
    },
    selectedTextStyle() {
      return {
        color: ' #02B3B4'
      };
    },
  },
  data() {
    return {
      currentIndex: 0,
      showSelectOrgDialog: false,
      dataList: [],
      logoutDialog: false,
      selectItem: null,
      deviceToken: null,
      systemInfo: null,
      dialogTitle: ''
    }
  },
  name: 'userinfo',
  methods: {
    popupOverlayBottomClick() {
      this.$emit('settingInfoShowStatus', false);
    },
    doSetting() {
      this.dataList = [{
        title: '清除内存',
        value: 'qcnc'
      }, {
        title: '日志上传',
        value: 'rzsc'
      }, {
        title: '清除缓存',
        value: 'qchc'
      }, {
        title: '系统信息',
        value: 'xtxx'
      }, {
        title: '推送检查',
        value: 'tsjc'
      }];
      this.showSelectOrgDialog = true;
      this.dialogTitle = '设置';
    },
    getDevicesInfo() {
      var that = this;
      native_getSystemInfo(function (data) {
        const tdata = 'string' === typeof data && JSON.parse(data) || data;
        native_logMessage('setting 获取的设备信息====' + tdata.result);
        const resultData = 'string' === typeof data.result && JSON.parse(data.result) || data.result;
        that.deviceToken = resultData && resultData.deviceToken;

        native_logMessage('setting 当前华为推送的token====' + that.deviceToken);
        that.systemInfo = resultData;
      });
    },
    doLogout() {
      this.logoutDialog = true;
    },
    orgChange() {
      const loginInfo = LoginDataApi.getLoginData();
      this.dataList = (LoginDataApi.getLoginData().branchList || []).map(item => {
        if (item.code === loginInfo.companyCode) {
          return {
            value: item.code,
            title: item.name,
            checked: true
          }
        } else {
          return {
            value: item.code,
            title: item.name
          }
        }
      })
      this.showSelectOrgDialog = true
      this.dialogTitle = '组织切换'
    },
    dialogConfirm() {

      var item = this.selectItem;
      if (item === null) {
        this.showSelectOrgDialog = false;
        this.$emit('settingInfoShowStatus', false);
        return;
      }
      if (item.value == 'qcnc') {
        native_clearMemory();
      } else if (item.value == 'qchc') {
        native_updateCacheData();
        Dialog.toast('清除缓存成功', 0.8)
      } else if (item.value == 'rzsc') {
        native_uploadLog(function (data) {
          var result = JSON.parse(data.result);
          native_logMessage('log文件上传结果===' + data.result + result.code);
          if (result && result.code == '200') {
            Dialog.toast('日志文件上传成功', 1);
          }
          native_logMessage('log文件上传结果：' + JSON.stringify(data));
        });
      } else if (item.value == 'xtxx') {//系统信息
        native_logMessage(' 设备信息====' + JSON.stringify(this.systemInfo));
        native_common_events(DEFINE_GET_LOCATION);
        if (this.systemInfo) {
          var msg = 'apk信息：版本号=' + this.systemInfo.apkVersionCode + '  版本名=' +
            this.systemInfo.apkVersionName + '\n';
          msg = msg + ' sdk信息：版本号=' + this.systemInfo.sdkVersionCode + ' 版本名=' +
            this.systemInfo.sdkVersionName + '\n';
          msg = msg + ' js信息：版本号=' + this.systemInfo.jsVersionCode + ' 版本名=' +
            this.systemInfo.jsVersionName + '\n';
          msg = msg + ' 当前网络=' + this.systemInfo.netType + ' 推送Token=' + this.systemInfo.deviceToken;
          Dialog.confirm({
            message: msg,
          }, (value) => {
          })
        } else {
          native_getSystemInfo(function (data) {
            const tdata = 'string' === typeof data && JSON.parse(data) || data;
            const resultData = 'string' === typeof data.result && JSON.parse(data.result) || data.result;
            var msg = 'apk信息：版本号=' + resultData.apkVersionCode + '  版本名=' +
              resultData.apkVersionName + '\n';
            msg = msg + ' sdk信息：版本号=' + resultData.sdkVersionCode + ' 版本名=' +
              resultData.sdkVersionName + '\n';
            msg = msg + ' js信息：版本号=' + resultData.jsVersionCode + ' 版本名=' +
              resultData.jsVersionName + '\n';
            msg = msg + ' 当前网络=' + resultData.netType + ' 推送Token=' + resultData.deviceToken;
            Dialog.confirm({
              message: msg,
            }, (value) => {
            })
          });
        }

      } else if (item.value == 'tsjc') {//推送检查
        if (!this.deviceToken) {
          native_common_events(DEFINE_AGAIN_GET_TOKEN);
          Dialog.confirm({
            message: '请先切换网络后，重新试一下！',
          }, (value) => {
          });

          this.getDevicesInfo();
        } else {
          Dialog.confirm({
            message: '当前推送的Token=' + this.deviceToken,
          }, (value) => {
          });
        }

      } else {
				//组织切换
        const loginInfo = LoginDataApi.getLoginData();
        loginInfo.companyCode = item.value;
        loginInfo.companyName = item.title;
        const companyInfo = (LoginDataApi.getLoginData().branchList || []).filter(itm => (itm.code === item.value))[0] || {};
        loginInfo.cityNo = companyInfo.cityNo || '';
        loginInfo.cityName = companyInfo.cityName || '';
        loginInfo.provinceCode = companyInfo.provinceCode || '';
        loginInfo.provinceName = companyInfo.provinceName || '';
        LoginDataApi.setLoginData(loginInfo);
        this.$store.commit('setLoginData', loginInfo);
        this.$eventHub.$emit('BroadcastChangedOrganization');
        LoginDataApi.getLastLoginUserInfo(function (data) {        	
      			var lastLoginInfo = JSON.parse(data || '{}')
      			loginInfo.type = lastLoginInfo.type;
      			lastLoginInfo = loginInfo;
      			LoginDataApi.setLastLoginUserInfo(lastLoginInfo);
          });
        native_companyChange(loginInfo.companyCode, loginInfo.companyName)
      }

      this.showSelectOrgDialog = false;
      this.$emit('settingInfoShowStatus', false);
      this.selectItem = null;
    },
    dialogCancel() {
      this.showSelectOrgDialog = false;
      this.$emit('settingInfoShowStatus', false);
      this.selectItem = null;
    },
    doOrgCheck(item) {
      this.selectItem = item;
    },
    isCurrent(option) {
      if (this.selectItem) {
        return this.selectItem === option;
      } else {
        return option.checked;
      }
    },
    logoutConfirm() {
      var that = this;
      that.requestApi.logout({
        success: () => {
          LoginDataApi.clearLoginData()
          that.jump(Login);
        },
        error: () => {
          LoginDataApi.clearLoginData()
          that.jump(Login);
        }
      });
      that.logoutDialog = false;
      that.$emit('settingInfoShowStatus', false);

    },
    logoutCancel() {
      this.logoutDialog = false;
      this.$emit('settingInfoShowStatus', false);
    },
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .row {
    flex-direction: row;
  }

  .dialog {
    margin-left: 310px;
    width: 300px;
    height: 100px;
    background-color: white;
    font-size: 38px;
    color: #21363D;
    text-align: center;
    vertical-align: middle;
    padding-top: 25px;
  }

  .logout-text {
    @include setBorderTop(#666, 1);
  }

  .btn-sure {
    background-color: $color_back;
    color: $color_white;
    margin-left: 50px;
  }

  .btn-cancel {
    background-color: $color_back;
    color: $color_white;
    margin-left: 50px;
  }

  .btn {
    width: 200px;
    text-align: center;
    height: 88px;
    line-height: 88px;
    margin-right: 150px;
    margin-top: 50px;
    margin-bottom: 50px;
    font-size: $font_head;
  }

  .header {
    background-image: linear-gradient(to right, #02b3b4, #1abc9c);
    justify-content: center;
    align-items: center;
    width: 800px;
    height: 88px;
    flex-direction: row;
  }

  .header-text {
    color: #ffffff;
    font-size: 38px;
    width: 800px;
    text-align: center;
  }

  .order-title-close {
    align-items: center;
    margin-left: -100px;
    float: right;
    width: 100px;
    height: 88px;
  }

  .order-title-text {
    color: #ffffff;
    font-size: 75px;
    font-weight: 100;
  }

  .options {
    flex-direction: column;
  }

  .option {
    flex: 1;
    height: 88px;
    width: 800px;
    align-items: center;
    justify-content: center;
  }

  .option-text {
    color: #030606;
    font-size: 30px;
  }

  .content {
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    display: block;
  }

  .footer-btn {
    font-size: 38px;
    text-align: center;
    padding-top: 40px;
    color: #02B3B4;
    height: 120px;
    margin-top: 60px;
    border-top-color: #E2E2E2;
    border-top-width: 2px;
    width: 400px;
  }
  .btn-confirm {
    border-left-color: #E2E2E2;
    border-left-width: 1px;
  }

</style>