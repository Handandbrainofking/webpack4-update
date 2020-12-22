<template>
  <d-layout class="login-box" vertical-align="initial" kind="column" :full-parent="false">
    <d-layout class="login-wrap" vertical-align="initial">
      <d-layout kind="column" text-align="center">
        <d-image src="/image/login_icon.png" width="640" height="720"></d-image>
        <d-image src="/image/app_name.png" width="320" height="72" style="margin-top: 20px;"></d-image>
        <text class="environment-text">{{ environment }}</text>
      </d-layout>
      <div style="width: 846px;">
        <d-layout class="switch-wrap" :full-parent="false" vertical-align="top">
          <d-layout kind="column" text-align="center" @clickLayout="switchuseClick">
            <text :class="['on-active', isActive && 'un-active']" value="用户名登录"></text>
            <div v-if='switchShow' class="switch-bottom"></div>
          </d-layout>
          <d-layout kind="column" text-align="center" @clickLayout="switchnumClick">
            <text :class="['on-active', !isActive && 'un-active']" value="手机号登录"></text>
            <div v-if='!switchShow' class="switch-bottom"></div>
          </d-layout>
        </d-layout>
        <div class="login-info">
          <template v-if="switchShow">
            <d-layout class="row-wrap">
              <text class="label">用户名</text>
              <input class="text" v-model="username" key="username" placeholder="输入用户名" />
            </d-layout>
            <d-layout class="row-wrap">
              <text class="label">密　码</text>
              <input class="text" type="password" key="password"
                     v-model="passNum" placeholder="输入密码" maxlength="20" />
            </d-layout>
          </template>
          <template v-else>
            <d-layout class="row-wrap">
              <text class="label">手机号</text>
              <input class="text" v-model="phoneNum" key="phone" type="text" placeholder="输入手机号" maxlength="11" />
            </d-layout>
            <d-layout class="row-wrap">
              <text class="label">验证码</text>
              <input class="text" type="text" key="verify" v-model="verifyNum" placeholder="输入验证码" maxlength="8" />
              <text class="textcode" style="" @click="sendcode">{{ btnContent }}</text>
            </d-layout>
          </template>
        </div>
        <div>
          <text class="button-login" value="登录" type="primary" @click="loginClick"></text>
        </div>
      </div>
    </d-layout>
  </d-layout>
</template>

<script>
import { Home } from '@/router/defined'
import Dialog from '@/utils/dialog'
import loginApi from '@/utils/login'
import {Validator} from '@/utils/validator'
import Base64Utils from '@/utils/base64_utils'
import LocalStorageManage from '@/utils/storage'
import requestSingle from '@/api/api'
import appConfig from '@/config/index'
import {
  native_logMessage,
  native_getSystemInfo,
  native_login,
  DEFINE_HIDDEN_KEYBORAD,
  native_common_events
} from '@/utils/deal_native'
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";

export default {
  name: 'Login',
  data() {
    return {
      isActive: false,
      switchShow: true,
      type: '02',
      username: '', //用户名
      passNum: '', //密码
      phoneNum: '', // 手机号
      // phoneNum: "", // 手机号
      verifyNum: '', //验证码
      btnContent: '获取验证码',
      newCode: '',
      time: 0, //间隔时间
      disabled: false, //按钮状态
      deviceToken: null, //华为推送token
      accessToken: null, //登录后的token
      environment: '',
      lastLoginInfo:null,
      userLoginInfo: {  //登录传入安卓代码的用户信息
        userId: '',
        phone: '',
        token: '',
        companyCode: '',
        companyName: ''
      }
    }
  },
  created() {
    const url = requestSingle.getUrl('')
    if (url === appConfig.ServerAddressBPMS_DEV) {
      this.environment = 'DEV';
    } else if (url === appConfig.ServerAddressBPMS_SIT) {
      this.environment = 'SIT';
    } else if (url === appConfig.ServerAddressBPMS_UAT) {
      this.environment = 'UAT';
    } else if (url === appConfig.ServerAddressBPMS_HUIDU) {
      this.environment = 'HUIDU';
    }
    var that = this
    //获取当前设备信息
    setTimeout(function () {
      native_getSystemInfo: (data) => {
        const tdata = typeof data === 'string' && JSON.parse(data) || data
        native_logMessage('获取的设备信息====' + tdata.result)
        const resultData = typeof data.result === 'string' && JSON.parse(data.result) || data.result
        that.deviceToken = (resultData && resultData.deviceToken) || ''
        LocalStorageManage.saveLocalStorage('systemInfo', JSON.stringify(resultData))
        native_logMessage('当前华为推送的token====' + that.deviceToken)
      }
    }, 2 * 1000);
    //保存最后一次登录的用户名
    loginApi.getLastLoginUserInfo(function (data) {
      that.lastLoginInfo = JSON.parse(data || '{}')
      if (that.lastLoginInfo && that.lastLoginInfo.type === '01') {
        that.switchShow = false
        that.isActive = true
        that.type = '01'
        that.phoneNum = that.lastLoginInfo.phone || ''
      } else if (that.lastLoginInfo && that.lastLoginInfo.type === '02') {
        that.switchShow = true
        that.isActive = false
        that.type = '02'
        that.username = that.lastLoginInfo.username || ''
      }
    })
  },
  methods: {
    ...mapMutations('calendar', [
      'setChoosedStaffs',
      'setStaffListState'
    ]),
    switchuseClick() {
      this.isActive = false
      this.switchShow = true
      this.type = '02'
    },
    switchnumClick() {
      this.isActive = true
      this.switchShow = false
      this.type = '01'
    },
    sendcode() {
      if (this.time > 0 || this.disabled) {
        native_logMessage('当前time=' + this.time + '  不能继续发送验证码。。')
        return false
      }
      //发送验证码校验
      if (!this.checkPhoneNum()) {
        return false
      }
      this.requestApi.get_verify_num({
        method: 'GET',
        data: 'mobile=' + this.phoneNum,
        success: () => {
          Dialog.toast('验证码发送成功，请查看钉钉！')
        }
      })
      this.disabled = true
      this.time = 61;
      this.timer()
    },
    //倒计时
    timer() {
      if (this.time > 0) {
        this.time--
        this.btnContent = this.time + 's后重发'
        setTimeout(this.timer, 1000)
      } else if (this.time <= 0) {
        this.btnContent = '获取验证码'
        this.disabled = false
      }
    },
    //登录 按钮
    loginClick: function () {
      var that = this      
      let requestData
      if (this.deviceToken == null) {
        native_getSystemInfo(function (data) {
          const tdata = 'string' === typeof data && JSON.parse(data) || data
          native_logMessage('再次获取的设备信息====' + tdata.result)
          const resultData = 'string' === typeof data.result && JSON.parse(data.result) || data.result
          that.deviceToken = (resultData && resultData.deviceToken) || ''
          LocalStorageManage.saveLocalStorage('systemInfo', JSON.stringify(resultData))
          native_logMessage('再次当前华为推送的token====' + that.deviceToken)
        })
      }
      if (this.type === '02') {  //用户名登录
        this.username = this.username.trim()
        if(!/^[A-Za-z0-9]+$/.test(this.username)){
          Dialog.toast('请输入正确的用户名', 0.8)
          return;
        }

        var base64Test = Base64Utils.encode(this.passNum)
        requestData = 'type=' + this.type + '&username=' + this.username + '&password=' + base64Test + '&deviceToken=' + (this.deviceToken || '123')
      }
      if (this.type === '01') {  //手机号登录
        if (!this.checkPhoneNum()) {
          return false
        }
        if (this.verifyNum.length < 4 || Validator.number(this.verifyNum)!='OK') {
          Dialog.toast('请输入正确的验证码', 0.8)
          return false
        }
        requestData = 'type=' + this.type + '&mobile=' + this.phoneNum + '&verifyCode=' + this.verifyNum + '&deviceToken=' + (this.deviceToken || '123');
      }
      native_logMessage('get_access_token 请求数据====' + requestData)
      this.requestApi.get_access_token({
        method: 'GET',
        data: requestData,
        success: (data) => {
          loginApi.setLoginData({
            accessToken: data.accessToken
          })
          that.accessToken = data.accessToken;
          that.userLoginInfo.token = data.accessToken
          native_logMessage(' 获取的token====' + that.accessToken)
          native_login(that.userLoginInfo)
          that.getUserInfo()
        }
      })
    },

    // 获取用户信息
    getUserInfo() {
      const that = this
      const params = {
        pageNo: 0,
        pageSize: 999
      }
      if (this.type === '01') {
        params.mobile = this.phoneNum
      }
      else {
        params.account = this.username
      }
      this.requestApi.user_info({
        data: params,
        success: (data) => {
          const tData = data.list[0] || {}
          const branchList = tData.branchList
          if (!Array.isArray(branchList) || branchList.length < 1) {
            Dialog.toast('获取组织机构为空')
            return false
          }

          native_logMessage('获取的用户信息===' + JSON.stringify(data))
          const tdata = typeof data === 'string' && JSON.parse(data) || data
          var list = tdata.list
          var permisstionLogin = false
          //运营岗和运营主管、面签岗才能登录
          for (var i = 0; i < list.length; i++) {
            var item = list[i]
            for (var k = 0; k < item.roleList.length; k++) {
              var alias = item.roleList[k].alias
              if (alias && (alias.toLocaleUpperCase().indexOf('YYZG') > -1 ||
                alias.toLocaleUpperCase().indexOf('WQG') > -1 || alias.toLocaleUpperCase().indexOf('MQG') > -1)) {
                permisstionLogin = true
                break
              }
            }
            that.phoneNum = item.mobile
          }
          if (!permisstionLogin) {
            Dialog.toast('登录失败，当前用户角色不对').then(() => {
            });
            return;
          }
          try{
	          const branch = branchList[0]
	          const loginInfo = Object.assign({}, loginApi.getLoginData(), tData, {
	            companyCode: branch.code,
	            companyName: branch.name,
	            cityNo: branch.cityNo || '',
	            cityName: branch.cityName || '',
	            provinceCode: branch.provinceCode || '',
	            provinceName: branch.provinceName || ''
	          });
	          //回归最后一次的用户设置信息
	          if(that.lastLoginInfo && that.lastLoginInfo.username && that.lastLoginInfo.username === loginInfo.account ){
	          	loginInfo.cityNo = that.lastLoginInfo.cityNo || '';
			        loginInfo.cityName = that.lastLoginInfo.cityName || '';
			        loginInfo.provinceCode = that.lastLoginInfo.provinceCode || '';
			        loginInfo.provinceName = that.lastLoginInfo.provinceName || '';
			        loginInfo.companyCode = that.lastLoginInfo.companyCode;
	        		loginInfo.companyName = that.lastLoginInfo.companyName;
	          }

	          loginApi.setLoginData(loginInfo)
	          that.lastLoginInfo = loginInfo;
	          	that.lastLoginInfo.phone = that.phoneNum;
	          	that.lastLoginInfo.type = that.type;
	          if (this.type === '02') {
							that.lastLoginInfo.username = that.username;
	          }
	          if (this.type === '01') {
	          		that.lastLoginInfo.username = '';
            }
            that.userLoginInfo.userId = list && list[0].id || ''
            that.userLoginInfo.phone = that.phoneNum
            that.userLoginInfo.companyCode = loginInfo.companyCode
            that.userLoginInfo.companyName = loginInfo.companyName
            native_login(that.userLoginInfo)
	          loginApi.setLastLoginUserInfo(	that.lastLoginInfo);
	          this.$store.commit('setLoginData', loginInfo);

          }catch(e){
						native_logMessage('回归最后一次用户登录信息出错了===' + JSON.stringify(e))
          }
          Dialog.toast('登录成功').then(() => {
            this.jump(Home, true)
            native_common_events(DEFINE_HIDDEN_KEYBORAD);
            this.setCalendarId()
          });
        }
      })
    },
    setCalendarId() {
      let self = loginApi.getLoginData()
      this.setChoosedStaffs({idList: [self.id], nameList: [self.fullname], describe: self.fullname})
      this.setStaffListState([self.id])
    },
    checkPhoneNum() {
     if (Validator.tel(this.phoneNum) !='OK') {
        Dialog.toast('手机号不合法', 0.8)
        return false
      }
      return true
    }
  }

}
</script>

<style lang="sass" type="text/scss" scoped>
  .login-box {
    /*@include setPadding(300px, 437px);*/
    background-color: #5A7BD3;
  }
  .login-wrap {
  		margin-top: 300px;
    width: 1686px;
    margin-left: 437px;
    margin-right: 437px;
    margin-bottom: 300px;
    background-color: #fff;
  }

  .environment-text {
    color: #7F7F7F;
    padding-top: 15px;
    font-size: $font_head;
  }

  .switch-wrap {
    padding-top: 263px;
  }

  .switch-bottom {
    background-color: #02B3B4;
    width: 100px;
    height: 6px;
  }

  .on-active {
    font-size: $font_nav;
    padding-bottom: 10px;
    opacity: 1;
  }

  .un-active {
    opacity: 0.5;
  }

  .login-info {
    @include setPadding(109px, 0, 60px, 80px);
  }

  .label {
    font-size: $font_nav;
    color: #21363D;
    padding-right: 50px;
  }

  .row-wrap {
    @include setPaddingV(20px, 40px);
  }

  .text {
    width: 520px;
    font-size: $font_nav;
    @include setBorderBottom();
    @include setPadding(10px);
  }

  .text:focus {
    border-bottom-color: green;
  }

  .textcode {
    font-size: $font_normal;
    color: #02B3B4;
    margin-left: -170px;
  }

  .button-login {
    width: 640px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    border-radius: 4px;
    background-color: rgba(2, 179, 180, 0.7);
    color: #FFFFFF;
    font-size: 38px;
    margin-left: 118px;
    margin-top: 30px;
  }
</style>
