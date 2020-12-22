# 运行

## 安装依赖包
$ npm install
### 安装ddpad组件库
$ cnpm update @ddjf/ddpad

## 运行web
web工程打包

$ npm run build 
 

## 安装基于sass编写样式

npm install node-sass;

npm install sass-loader; //依赖node-sass

npm install scss-loader  //依赖node-sass

npm install postcss-import css-mqpacker cssnano --save-dev 

npm install  -g  weex-toolkit  安装devtools


构建web工程 & 启动服务

$ npm run server 

## 运行ios
ios打包需要开发者帐号，如果不是付费用户就只能通过xcode调试的方式安装在自己的关联手机上（就是手机需要使用此帐号登录）或者虚拟机调试。
以下是无开发者付费帐号的执行方法
安装ios框架

$ weexpack platform add ios


## 执行打包命令
$ weex build ios

进入到ios工程里面执行pod命令
$ pod install


##  运行android

$ weexpack platform add android   //生成android平台工程项目

$ weex build android     //将web代码编译到android环境
```
 

## 集成nat组件 http://natjs.com/#/zh-cn/README

npm install natjs --save

weexpack plugin add nat-media-image   //加载图片相关模块

weexpack plugin add nat-stream  //网络请求相关

weexpack plugin add nat-transfer  //网络传输相关的

weexpack plugin add nat-modal  //弹窗组件

weexpack plugin add nat-camera  //拍照组件

weexpack plugin add nat-transfer  //文件传输

weexpack plugin add nat-geolocation  //实时定位

weexpack plugin add nat-device-info //设备信息

weexpack plugin add nat-device-network  //网络状态

weexpack plugin add nat-device-vibration  //震动

weexpack plugin add nat-device-screen  //屏幕信息

weexpack plugin add nat-device-volume  //音量

weexpack plugin add nat-device-battery  //电池电量


# 工程目录结构
/ddjf-interview
  ├── apk_version/                              #
  ├── back/                                     #
  ├── build/                                    #构建配置文件
  ├── build2/                                   #
  ├── dist/                                     #
  ├── doc/                                      #项目文本资料
  ├── node_modules/                             #项目所有的依赖包
  ├── platforms/
      ├── android/                              #安卓平台
      ├── ios/                                  #ios平台
  ├── plugins/                                  #项目用到的插件
  ├── src/                                      #项目开发主目录
      ├── api/
          ├── api.js                            #网络请求处理
          ├── defined.js                        #请求地址定义
          ├── index.js                          #请求地址统一处理
          ├── mock.js                           #mock模拟数据
          ├── string.js                         #处理字符串的一些公共方法【本项目没有用到这个文件】
      ├── components/
          ├── back/
              ├── head.vue                      #返回组件
          ├── calender/
              ├── calender.vue                  #日历组件
              ├── format.js                     #日历格式化处理
          ├── dialog/
              ├── confirm.vue                   #抢单弹窗
              ├── dialog.vue                    #标准弹窗-标题-底部按钮
              ├── error.vue                     #错误弹窗
              ├── order-book.vue                #订单预定
              ├── overlay.vue                   #蒙版
              ├── plan-order.vue                #预约信息弹窗
              ├── success.vue                   #成功弹窗
              ├── time-conflit.vue              #时间冲突弹窗
              ├── tip.vue                       #成功提示
              ├── transfer-order.vue            #用户显示抢单等时间冲突信息
              ├── type.js                       #选中-未选中图片链接
          ├── dropdown/
              ├── pick_web.vue                  #兼容web的选择框【现在项目中没有用到，已经被替换了】
              ├── pick.vue                      #父选择弹出框
              ├── pickdate.vue                  #日期选择框
              ├── pickdatetime.vue              #日期时间选择组件
              ├── PickerList.vue                #子选择弹出框
              ├── picktime.vue                  #时间选择组件
              ├── pick.scss                     #下拉框样式
          ├── form/
              ├── number_input.vue              #数字输入框，格式化数字
              ├── radio.vue                     #单选按钮切换
              ├── sub-title.vue                 #表单抬头
          ├── icon/                             #字体图标处理
          ├── image/
              ├── image.vue                     #图片组件
          ├── labelvalue/                       #表单label - value 形式;例如 姓名：输入框；
              ├── input.vue                     #输入框
              ├── pick.vue                      #下拉选择框
              ├── pickdate.vue                  #日期选择框
              ├── pickdatetime.vue              #时间选择框
              ├── select.vue                    #单选
              ├── input.scss
              ├── default-props.js              #默认props值
          ├── left/
              ├── left.vue                      #主页左边栏
          ├── money/
              ├── moneyInput.vue                #金额输入组件
          ├── order/
              ├── appoint-info.vue              #
              ├── order-info.vue                #
          ├── other/
              ├── add_list.vue                  #增加卡片组件
          ├── paging/
              ├── paging.vue                    #页数组件 【没有用到】
          ├── pick/
              ├── city.vue                      #城市选择
              ├── date.vue                      #日期选择
              ├── pick-item.vue                 #
              ├── pick.vue                      #滑动选择
          ├── search/
              ├── index.vue                     #连接下拉选项的搜索框
              ├── search.vue                    #搜索框
          ├── table/
              ├── common
                  ├── table-body.vue            #不带滑动的列表
                  ├── table-slide-body.vue      #带有滑动的列表
                  ├── table-cell.scss           #列表样式
              ├── cell.vue                      #列表单元     【丢弃了，采用了common写在一起了】
              ├── swipe-cell.vue                #滑动列表单元 【丢弃了，采用了common写在一起了】
              ├── table-body.vue                #列表体
              ├── table-head.vue                #表头
              ├── table.vue                     #列表主组件
          ├── tabpage/
              ├── tab-page.vue                  #主页tab切换组件
          ├── upload/
              ├── upload.vue                    #资料上传组件
          ├── wxc/
              ├── lightbox.vue                  #图片显示组件
              ├── menu.vue                      #【丢弃了】
              ├── popover.vue                   #蒙版
              ├── popup.vue                     #带有弹出动画的弹框组件
              ├── radio.vue                     #单选框组件
              ├── tip.vue                       #提示组件【备注提示组件】
      ├── config/
          ├── index.js                          #配置文件
          ├── task_tab_style.js                 #任务tab样式配置
      ├── core/                                 #
      ├── css/                                  #css配置
      ├── disc/
          ├── city.js                           #城市字典
          ├── config.js                         #业务系统字典
          ├── index.js                          #获取字典数据
      ├── entry/                                #一些页面的加载入口
          ├── common/
              ├── before_entry.js               #放置协议，mixin，从内存中获取数据等
              ├── set-view-port.js              #设置视图大小
          ├── data_detail.js                    #资料详情加载入口
          ├── data_upload.js                    #资料上传加载入口
          ├── index.js                          #首页加载入口
          ├── interview.js                      #流程节点加载入口
          ├── message_detail.js                 #消息管理加载入口
          ├── product_association.js            #产品关联加载入口
          ├── quality_query.js                  #资质查询加载入口
          ├── track_order.js                    #跟踪订单加载入口
      ├── filters/
          ├── date.js                           #
          ├── dict.js                           #
          ├── index.js                          #
          ├── money.js                          #
      ├── image/                                #项目图片存储
      ├── mixins/
          ├── index.js                          #各种混入
          ├── page.js                           #提取列表的分页方法
          ├── table-page.js                     #提取table的分页方法
          ├── task-base.js                      #获取订单信息 处理保存提交相关逻辑
          ├── upload.js                         #图片上传逻辑处理
      ├── page/                                 #页面目录
          ├── assign/                           #
          ├── calendar/                         #日历页面
          ├── data/                             #资料管理页面
          ├── home/                             #主页页面
          ├── login/                            #登录页面
          ├── message/                          #消息页面
          ├── order/                            #订单管理页面
          ├── setting/                          #个人中心
          ├── task/                             #表单页面
              ├── components/                   #表单页面相关组件
              			├── common											#公共组件
              ├── css/                          #表单页面相关样式
              ├── elements_hosting/             #要件托管子组件
              ├── task_product_association/     #关联产品子组件
              ├── task_quality_inquiry/         #面签节点子事项页面
              ├── task_view/                    #面签节点主页面
              ├── task_accounttest.vue          #账户测试
              ├── task_checkfile.vue            #查档
              ├── task_logout_info.vue          #取注销资料
              ├── task_logout_mortgage.vue      #注销抵押
              ├── task_mortgage_in.vue          #抵押递件
              ├── task_mortgage_out.vue         #抵押出件
              ├── task_notarization.vue         #委托公证
              ├── task_page_tab.vue             #订单节点办理tab页
              ├── task_redemption_register.vue  #赎楼登记
              ├── task_requirement_vue          #要件托管
              ├── task_transfer_in.vue          #过户递件
              ├── task_transfer_out.vue         #过户出件
          ├── track/                            #跟踪订单页面
              ├───components
              			├───applyInfo.vue							#订单信息
              			├───appointInfo.vue						#预约信息
              			├───basicInfo.vue
              			├───missingMaterialInfo.vue   #补件信息
              			├───orderProgress.vue   				#订单进度
          ├── main.vue                          #首页
      ├── router/
          ├── defined.js                        #路由url配置
          ├── index.js                          #路由响应
          ├── menu.js                           #路由路径定义
      ├── store/                                #vuex
      ├── utils/
          ├── deal_native.js                    #native相关交互的处理
          ├── dialog.js                         #将natJS的弹出框进行简单封装，使之可以进行各种过滤
          ├── filters.js                        #过滤器
          ├── load_network_js.js                #网络加载
          ├── login.js                          #用户信息处理
          ├── storage.js                        #存储数据到本地，获取的数据采用promise方式
          ├── utils.js                          #常用工具集合
          ├── validator.js                      #常用类型的校验
          ├── weex-utils.js                     #weex-ui里面的utils方法
  ├── test/                                     #
  ├── tools/                                    #
  ├── UI/                                       #UI界面文件
  ├── web/                                      #

  ```
# android.config.json 或者 ios.config.json 中的信息
	- `AppName:` 生成的apk安装后的应用名
  -  `AppId: `application_id 包名
  -  `SplashText:` 打开后欢迎页上面的展示文字
  - `WeexBundle: `指定的weex bundle文件（支持文件名和url的形式）
  - "CodeSign":证书
  - "Profile":provisioning profile
  文件名则以本地文件的方式加载bundle,url则以远程的方式加载bundle 如果以本地方式指定bundle .we文件请放到src目录。

  常见问题

  1、weex 不支持 .btn.active 这种嵌套。也不支持window这种全局变量
  2、text 标签不要换行，不然换行会被解析
      例如
          <text>
          </text> 会有换行，如果lines=1， 这个就会有...
  3、字典添加:  需要在src/config/index.js里加入字典项
                例如: export const DISC_CERT_TYPE = "CertType";
              再去src/entry/before_entry.js中加入刚才添加的字典项 DISC_CERT_TYPE
  4、新增单页面:  需要去路由配置单页面入口文件路径，目前是存放在src/entry/目录下
                  例如: export const IndexJs = "/index.js";
                再去src/entry/目录下新建index.js文件，引入你的页面，参考其他js写法即可
  5、对元素进行高度隐藏的时候不要设置height: 0;这样设置可能不会生效，需要设置为1px
  6、对于v-if v-else这样的，对切换的时候发现元素没有变化，可能是元素被重用了，需要设置:key="``";
  