## 移动展业android项目


### 工程目录

#### app 主工程
    com.ddjf.interview.global.Constants   #环境配置文件

#### hmsagents 华为推送工程

#### picture_library 图片相关工程
- 使用说明：https://github.com/LuckSiege/PictureSelector

#### ucrop 图片裁剪工程（由picture_library需要)

#### tigerdb db数据库工程
- 使用说明：https://github.com/huyongli/TigerDB

#### weex_anlyzer weex性能分析工具
- 使用说明：https://github.com/weexteam/weex-analyzer-android

#### weex_sdk weexSDK工程
一. 引入的原因：
  -  官方0.20.0版本无法解决input组件的首次输入事件监听

二. 修改的地方：
1. 时间选择控件样式修改：DatePickerImpl/WXPickersModule
2. 光标颜色修改：WXEditText
3. （0.20版本好像修复了）input事件修改：AbstractEditComponent 。 解决方案：https://github.com/apache/incubator-weex/pull/1048/commits/f971a788b1d5c43b498d387be0372f8285528a7b?utf8=%E2%9C%93&diff=unified
4. 增加对资源颜色处理的异常判断：WXResourceUtils
5. 修改弹出框按钮的颜色：WXModalUIModule
6. 日志修改 WXLogUtils
