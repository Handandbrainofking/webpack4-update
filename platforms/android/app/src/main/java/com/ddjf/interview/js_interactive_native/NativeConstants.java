package com.ddjf.interview.js_interactive_native;

import com.ddjf.interview.R;
import com.ddjf.interview.WXApplication;
import com.taobao.weex.WXSDKEngine;

/**
 * Created by yejunrong on 18/3/23.
 *
 * 定义Native常量 给js使用
 */

public class NativeConstants {
    public static String APP_NAME="appName";

    public NativeConstants(){
        //JS可以通过weex.config.env.appName这样的方式来调用。
        WXSDKEngine.addCustomOptions(APP_NAME, WXApplication.mAppInstance.getString(R.string.app_name));



    }
}
