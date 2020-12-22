package com.ddjf.interview.http;

import com.alibaba.fastjson.JSONObject;
import com.ddjf.interview.global.Constants;
import com.ddjf.interview.log_manager.LogManager;
import com.luck.picture.lib.tools.Constant;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

/**
 * 日志token的获取
 */
public class HttpLogToken {
    public static void getLogToken( HttpUtils.HttpRequestCallBack callBack){
        if(null == Constants.getPlatformBaseUrl() ){
            LogManager.infoLog("HttpLogToken","当前环境不需要进行log上传到阿里云服务器、、、、");
            return;
        }
        String url = Constants.getPlatformBaseUrl() + HttpApi.PLATFORM_LOG_TOKEN_URL;
        JSONObject body = new JSONObject();
        body.put("password", Constants.PLATFORM_LOG_TOKEN_PASSWORD_VALUE);
        body.put("username", Constants.PLATFORM_LOG_TOKEN_USERNAME_VALUE);

        HttpUtils.httpPostRequest(url, body, null, callBack);
    }
}
