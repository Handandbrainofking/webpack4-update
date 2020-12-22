package com.ddjf.interview.log_manager;

import android.text.TextUtils;

import com.aliyun.sls.android.sdk.ClientConfiguration;
import com.aliyun.sls.android.sdk.LOGClient;
import com.aliyun.sls.android.sdk.LogException;
import com.aliyun.sls.android.sdk.SLSLog;
import com.aliyun.sls.android.sdk.core.auth.StsTokenCredentialProvider;
import com.aliyun.sls.android.sdk.core.callback.CompletedCallback;
import com.aliyun.sls.android.sdk.model.Log;
import com.aliyun.sls.android.sdk.model.LogGroup;
import com.aliyun.sls.android.sdk.request.PostLogRequest;
import com.aliyun.sls.android.sdk.result.PostLogResult;
import com.ddjf.interview.WXApplication;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.global.Constants;
import com.ddjf.interview.http.HttpLogToken;
import com.ddjf.interview.http.HttpUtils;
import com.ddjf.interview.util.DateUtils;
import com.ddjf.interview.util.SharedPreferenceUtil;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

import org.json.JSONObject;

import java.lang.ref.WeakReference;
import java.util.Date;


/**
 * 阿里log日志的管理
 */
public class ALiLogManager {
    static WeakReference<LOGClient> mLogClient;
    static String TAG = "ALiLogManager";

    private static void initLog(String STS_AK,String STS_SK,String STS_TOKEN){
        StsTokenCredentialProvider credentialProvider =
                new StsTokenCredentialProvider(STS_AK, STS_SK, STS_TOKEN);

        // 配置信息
        ClientConfiguration conf = new ClientConfiguration();
        conf.setConnectionTimeout(15 * 1000); // 连接超时，默认15秒
        conf.setSocketTimeout(15 * 1000); // socket超时，默认15秒
        conf.setMaxConcurrentRequest(5); // 最大并发请求书，默认5个
        conf.setMaxErrorRetry(2); // 失败后最大重试次数，默认2次

        conf.setCachable(true);     // 设置日志发送失败时，是否支持本地缓存。
        conf.setConnectType(ClientConfiguration.NetworkPolicy.WIFI_ONLY);   // 设置缓存日志发送的网络策略。


        SLSLog.enableLog(); // log打印在控制台

        if( null == mLogClient || null == mLogClient.get()){
            LOGClient logClient = new LOGClient(WXApplication.mAppInstance, Constants.PLATFORM_LOG_ENDPOINT,
                    credentialProvider, conf);    // 初始化client
            if(null != mLogClient){
                mLogClient.clear();
                mLogClient = null;
            }
            mLogClient = new WeakReference<>(logClient);
            android.util.Log.e(TAG,"初始化阿里日志 服务");
        }

    }

    /*
     *  推荐使用的方式，直接调用异步接口，通过callback 获取回调信息
     */
    public static void asyncUploadLog(final String msg,final String level) {
        if(null == Constants.getPlatformBaseUrl()){
            //不需要上传到阿里云日志
            return;
        }
        String STS_AK = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.PLATFORM_LOG_ACCESSKEYID);
        String STS_SK = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.PLATFORM_LOG_ACCESSKEYSECRET);
        String STS_TOKEN = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.PLATFORM_LOG_SECURITYTOKEN);
        Long expiration = SharedPreferenceUtil.getDataLong(SharedPreferenceUtil.PLATFORM_LOG_EXPIRATION);
        Long http_token_time = SharedPreferenceUtil.getDataLong(SharedPreferenceUtil.PLATFORM_LOG_HTTP_TOKEN_REQUEST_TIME);
        if(null == mLogClient || null==mLogClient.get() || TextUtils.isEmpty(STS_AK) || TextUtils.isEmpty(STS_SK) ||
                TextUtils.isEmpty(STS_TOKEN) || expiration==0 || (expiration-System.currentTimeMillis())< 10*60*1000){ //小于10分钟就去续签token
            SharedPreferenceUtil.setData(SharedPreferenceUtil.PLATFORM_LOG_STATUS,false);

            if((System.currentTimeMillis() - http_token_time) < 1200){
                LogManager.infoLog(TAG,"距离上一次的请求时间小于1秒，时间太短了就不需要再次发请求");
                return ;
            }
            SharedPreferenceUtil.setData(SharedPreferenceUtil.PLATFORM_LOG_HTTP_TOKEN_REQUEST_TIME,System.currentTimeMillis());

            LogManager.infoLog(TAG,"去获取技术平台log的相关参数。 当前相关参数：STS_AK="+STS_AK+"   STS_SK="+STS_SK+"   STS_TOEKN="+STS_TOKEN
            +"   expiration="+ DateUtils.formatDate(new Date(expiration), DateUtils.DATA_FORMAT_ALL));

            HttpLogToken.getLogToken(new HttpUtils.HttpRequestCallBack() {
                @Override
                public void onFailure(Request request, Exception e) {
                    LogManager.errorLog(TAG," 获取技术平台log 服务出错了=="+e.getMessage());
                    ExceptionGlobalHandler.showException(TAG,e);
                }

                @Override
                public void onSuccess(Response response) {
                    try {
                        String body = response.body().string();
                        LogManager.infoLog(TAG," 获取技术平台log信息=="+body);

                        if(null == body || body.isEmpty()){
                            LogManager.errorLog(TAG," 获取技术平台 log 信息 什么数据都没有返回");
                            return;
                        }
                        JSONObject result = new JSONObject(body);
                        Boolean success = result.getBoolean("success");
                        if(null != success && !success){
                            LogManager.infoLog(TAG," 获取技术平台log信息错误=="+result.getString("msg"));
                            return;
                        }
                        JSONObject object = result.getJSONObject("result");
                        String STS_AK = object.getString("accessKeyId");
                        String STS_SK = object.getString("accessKeySecret");;
                        String STS_TOKEN = object.getString("securityToken");;
                        String expirationStr = object.getString("expiration");
                        Long expiration = DateUtils.getDateForString(expirationStr,DateUtils.DATA_FORMAT_ALL).getTime();

                        initLog(STS_AK,STS_SK,STS_TOKEN);
                        postLog(msg,level);
                        SharedPreferenceUtil.setData(SharedPreferenceUtil.PLATFORM_LOG_ACCESSKEYID,STS_AK);
                        SharedPreferenceUtil.setData(SharedPreferenceUtil.PLATFORM_LOG_ACCESSKEYSECRET,STS_SK);
                        SharedPreferenceUtil.setData(SharedPreferenceUtil.PLATFORM_LOG_SECURITYTOKEN,STS_TOKEN);
                        SharedPreferenceUtil.setData(SharedPreferenceUtil.PLATFORM_LOG_EXPIRATION,expiration);
                        SharedPreferenceUtil.setData(SharedPreferenceUtil.PLATFORM_LOG_STATUS,true);

                    }catch (Exception e){
                        e.printStackTrace();
                        ExceptionGlobalHandler.showException(TAG,e);
                    }

                }
            });
            return;
        }

        postLog(msg,level);
    }

    private static void postLog(String msg,String level){
        if(null!=msg && msg.length() > 3000){
            msg = msg.substring(0,2500)+" ===由于日志信息太多，裁剪了一部分，如果要看全部信息，需要用户上传日志文件。";
        }
        /* 创建logGroup */
        LogGroup logGroup = new LogGroup("pad log", Constants.getPlatformBaseUrl());
        String currentPhone = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE) == null ? "" :
                SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE);
        String currentUserId = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_USERID) == null ? "" :
                SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_USERID);
        String currentCompanyCode = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_COMPANYCODE) == null ? "" :
                SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_COMPANYCODE);
        String currentCompanyName = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_COMPANYNAME) == null ? "" :
                SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_COMPANYNAME);
        /* 存入一条log */
        Log log = new Log();
        log.PutContent("level", level);
        log.PutContent("current time ", DateUtils.getStringDate());
        log.PutContent("current user info", "phone="+ currentPhone + " userId="+currentUserId
                +" companyCode="+ currentCompanyCode +" companyName="+ currentCompanyName);
        log.PutContent("content",msg);

        logGroup.PutLog(log);
        try {
            PostLogRequest request = new PostLogRequest(Constants.getLogProject(), Constants.PLATFORM_LOG_LOGSTORE, logGroup);
            mLogClient.get().asyncPostLog(request, new CompletedCallback<PostLogRequest, PostLogResult>() {
                @Override
                public void onSuccess(PostLogRequest request, PostLogResult result) {
                }

                @Override
                public void onFailure(PostLogRequest request, LogException exception) {
                    android.util.Log.e(TAG,"上传阿里日志失败");
                    ExceptionGlobalHandler.showException(TAG,exception);
                }
            });
        } catch (LogException e) {
            e.printStackTrace();
        }
    }

}
