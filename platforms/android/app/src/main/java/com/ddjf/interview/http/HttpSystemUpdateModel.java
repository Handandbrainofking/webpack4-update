package com.ddjf.interview.http;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.DialogInterface.OnClickListener;
import android.content.Intent;
import android.net.Uri;
import android.os.Handler;

import com.alibaba.fastjson.JSONObject;
import com.ddjf.interview.WXApplication;
import com.ddjf.interview.activity.SplashActivity;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.global.Constants;
import com.ddjf.interview.util.FileUtils;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.SharedPreferenceUtil;
import com.ddjf.interview.util.SystemUtils;
import com.ddjf.interview.views.CustomAlertDialog;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

import java.io.File;
import java.util.Date;

/**
 * Created by yejunrong on 18/5/26.
 * 系统版本升级 http 请求处理
 *
 */

public class HttpSystemUpdateModel {
    static String TAG = "HttpSystemUpdateModel";

    public static void systemUpdate(boolean isForce, HttpSystemUpdateResult callBack){

//        if(!isForce){
//            long last = SharedPreferenceUtil.getDataLong(SharedPreferenceUtil.UPDATE_SYSTEM_TIME_PROPERTY);
//            if((new Date().getTime() - last) > Constants.SYSTEM_PROPERTY_UPDATE_TIME_INTERVAL){
//                update(callBack);
//            }
//
//            return;
//        }
        //每次都去更新版本
        update(callBack);
    }

    /**
     * 系统更新机制
     * 1，apk的更新：获取manifest.xml的版本号和网络端的版本号进行匹配，然后看是否需要更新
     * 2，JSBundle的更新：获取缓存目录中配置文件的版本号和网络端的版本号进行匹配，然后看是否需要更新
     */
    private static void update( final HttpSystemUpdateResult callback) {
        String url = Constants.getBpmsBaseUrl(HttpApi.SYSTEM_UPDATE_URL) ;
        HttpUtils.httpGetRequest(url, null,null, new HttpUtils.HttpRequestCallBack() {
            @Override
            public void onFailure(Request request, Exception e) {
                LogManager.errorLog(TAG, "系统更新失败："
                        + e.getLocalizedMessage());
            }

            @Override
            public void onSuccess(Response response) {
                try {

                    String bodyString = response.body().string();
                    JSONObject responseBody = JSONObject.parseObject(bodyString);
                    boolean retStatus = responseBody.getBoolean("success");
                    LogManager.infoLog(TAG, "获取系统更新接口数据=="+responseBody.toString());
                    if (retStatus) {

                        JSONObject resultData = responseBody.getJSONObject("result");
                        int currentApkVersionCode = SystemUtils.getAPKVersionCode();
                        long serverApkVersionCode = resultData.getLong("apkVersionCode");
                        String serverApkVersionName = resultData.getString("apkVersionName");
                        Boolean forceAPK = resultData.getBoolean("apkForceFlag");

                        if (serverApkVersionCode > currentApkVersionCode) {
                            String apkUrl = resultData.getString("apkUrl");

                            if(null!=callback){
                                callback.updateAPK(apkUrl,forceAPK,serverApkVersionName);
                            }

                        }

                        // js 获取缓存下面的js配置文件信息
                        long currentJsVersionCode = SystemUtils.getWeexVersionCode();
                        long serverJsVersionCode = resultData.getLong("jsVersionCode");
                        String serverJsVersionName = resultData.getString("jsVersionName");
                        if (serverJsVersionCode > currentJsVersionCode) {
                            String jsUrl = resultData.getString("jsUrl");

                            if(null != callback){
                                callback.updateJsBundler(jsUrl,serverJsVersionName);
                            }
                        }

                    } else {
                        LogManager.errorLog(TAG, "系统更新失败===" + responseBody.toString());
                    }

                    SharedPreferenceUtil.setData(SharedPreferenceUtil.UPDATE_SYSTEM_TIME_PROPERTY,new Date().getTime());

                } catch (Exception e) {
                    ExceptionGlobalHandler.showException(TAG,e);
                    LogManager.errorLog(TAG, "系统更新失败===exception=" + e.getMessage());
                }
            }
        });
    }

    public interface HttpSystemUpdateResult{
        void updateAPK(String apkUrl,boolean forceAPK,String versionName);
        void updateJsBundler(String jsUrl,String versionName);
    }


}
