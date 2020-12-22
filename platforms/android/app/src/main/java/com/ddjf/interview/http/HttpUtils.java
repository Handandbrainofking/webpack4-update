package com.ddjf.interview.http;

import com.baidu.mapapi.http.HttpClient;
import com.baidu.mobstat.StatService;
import com.ddjf.interview.WXApplication;
import com.ddjf.interview.database.entity.FileEntity;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.global.ThreadPoolManager;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.DateUtils;
import com.ddjf.interview.util.SharedPreferenceUtil;
import com.squareup.okhttp.Callback;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import java.io.File;
import java.io.IOException;
import java.lang.ref.WeakReference;
import java.net.SocketTimeoutException;
import java.util.Date;
import java.util.concurrent.TimeUnit;

/**
 * Created by yejunrong on 18/3/8.
 */

public class HttpUtils {
    static WeakReference<OkHttpClient> clientWeak;
    static String TAG = "HttpUtils";
    static String mUserAgent = null;
    static OkHttpClient getHttpClien(){
//        if(null == clientWeak || null == clientWeak.get()){
//            clientWeak = new WeakReference<>(new OkHttpClient());
//        }
//        return clientWeak.get();
        return new OkHttpClient();
    }

    public static void httpGetRequest(String url, String requestBody, Request.Builder headerBuilder, final HttpRequestCallBack callBack) {
        try {
            httpRequestStatistic(url,"get");

            if (null != requestBody) {
                url = url + requestBody;
            }
            if (null == headerBuilder) {
                headerBuilder = new Request.Builder();
                headerBuilder.addHeader("Accept-Encoding", "identity");
            }

            headerBuilder.removeHeader("User-Agent").addHeader("User-Agent",getUserAgent());
            headerBuilder.url(url);
            Date sendHttpRequestTime = new Date();
            headerBuilder.tag(sendHttpRequestTime);
            String oldAccessToken = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_TOKEN);
            String accessToken =  headerBuilder.build().headers().get("accessToken");
            if (null == accessToken && null != oldAccessToken) {
                headerBuilder.addHeader("accessToken", oldAccessToken);
                accessToken = oldAccessToken;
            }
            if(null != accessToken && (null == oldAccessToken || !accessToken.equals(oldAccessToken))){
                //把新token替换老token
                LogManager.infoLog(TAG,"替换老token  newToken="+accessToken +"   oldToken="+oldAccessToken);
                SharedPreferenceUtil.setData(SharedPreferenceUtil.CURRENT_LOGIN_TOKEN,accessToken);
            }
            final Request request = headerBuilder.build();

            LogManager.infoLog(TAG, "get 请求url=" + url + " token=" + accessToken);
            request(request,callBack);

        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }


    public static void httpPostRequest(String url, Object requestBody, Request.Builder headerBuilder, final HttpRequestCallBack callBack) {
        try {
            httpRequestStatistic(url,"post");

            MediaType JSON = MediaType.parse("application/json; charset=utf-8");//数据类型为json格式，

            RequestBody body = null;
            if (null != requestBody) {
                body = RequestBody.create(JSON, requestBody.toString());
            } else {
                body = RequestBody.create(JSON, "");
                requestBody = "";
            }
            if(headerBuilder == null){
                headerBuilder = new Request.Builder();
            }

            headerBuilder.url(url);
            Date sendHttpRequestTime = new Date();
            headerBuilder.tag(sendHttpRequestTime);

            String oldAccessToken = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_TOKEN);
            String accessToken =  headerBuilder.build().headers().get("accessToken");
            if (null == accessToken && null != oldAccessToken) {
                headerBuilder.addHeader("accessToken", oldAccessToken);
                accessToken = oldAccessToken;
            }
            headerBuilder.removeHeader("User-Agent").addHeader("User-Agent",getUserAgent());

            if(null != accessToken && (null == oldAccessToken || !accessToken.equals(oldAccessToken))){
                //把新token替换老token
                LogManager.infoLog(TAG,"替换老token  newToken="+accessToken +"   oldToken="+oldAccessToken);
                SharedPreferenceUtil.setData(SharedPreferenceUtil.CURRENT_LOGIN_TOKEN,accessToken);
            }

            final Request request = headerBuilder.post(body).build();
            LogManager.infoLog(TAG, "post 请求url=" + url + " accessToken=" + accessToken + " body=" + requestBody.toString());

            request(request,callBack);

        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }

    /**
     * 上传文件
     */
    public static void upLoadFile(final FileEntity entity,final Request.Builder builder,
                                  final HttpRequestCallBack callBack) {
        try {
            ThreadPoolManager.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    File file = null;
                    //优先取压缩后的图片,如果没有再取本地url图片
                    if (null!=entity.getCompressImageUrl() && entity.getCompressImageUrl()!="") {
                        file = new File(entity.getCompressImageUrl());
                    }
                    if (null==file || !file.exists()) {
                        file = new File(entity.getLocationUrl());
                    }

                    MediaType fileType = MediaType.parse("application/octet-stream");
                    RequestBody body = RequestBody.create(fileType, file);

                    builder.removeHeader("User-Agent").addHeader("User-Agent",getUserAgent());
                    Date sendHttpRequestTime = new Date();
                    builder.tag(sendHttpRequestTime);

                    LogManager.infoLog(TAG,"上传文件URL="+entity.getServerUrl()+" fileType="+fileType+" file="+file.getPath());
                    final Request request = builder
                            .url(entity.getServerUrl())
                            .post(body)
                            .build();
                    ThreadPoolManager.getThreadPool().execute(new Runnable() {
                        @Override
                        public void run() {
                            OkHttpClient client = new OkHttpClient();
                            getHttpClien().setWriteTimeout(2 * 60,TimeUnit.SECONDS);//上传写入超时设置
                            request(request,callBack);
                        }
                    });

                }
            });


        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }

    }

    public interface HttpRequestCallBack {
        void onFailure(Request request, Exception e);

        void onSuccess(Response response);
    }

    private static void request(Request request,final HttpRequestCallBack callBack){
        getHttpClien().setConnectTimeout(10,TimeUnit.SECONDS);//连接超时设置
        getHttpClien().setReadTimeout(30,TimeUnit.SECONDS);// 服务器读取超时设置
        getHttpClien().newCall(request).enqueue(new Callback() {
            public void onFailure(Request request, IOException e) {
                if(null !=e && null !=e.getCause() &&e.getCause().equals(SocketTimeoutException.class)){
                    LogManager.infoLog(TAG,"HTTP请求超时了。。。。");
                }
                if (null != callBack) {
                    callBack.onFailure(request, e);
                }
            }


            public void onResponse(Response response) throws IOException {
                if (response.isSuccessful()) {//回调的方法执行在子线程。
                    Date sendTime = (Date)response.request().tag();
                    Date reponseTime = new Date();
                    LogManager.infoLog(TAG, "获取数据成功了 response.code()==" + response.code());
                    if(null != sendTime && null != response){
                        LogManager.infoLog(TAG, "url=" +response.request().urlString()+" 发送时间=" +
                                DateUtils.formatDate(sendTime,DateUtils.DATA_FORMAT_ALL)
                                + " 返回时间=" + DateUtils.formatDate(reponseTime,DateUtils.DATA_FORMAT_ALL)
                                +" 时间差="+(reponseTime.getTime() - sendTime.getTime()));
                    }
                }
                if (null != callBack) {
                    callBack.onSuccess(response);
                }

            }
        });
    }

    /**
     * 返回正确的UserAgent
     * @return
     */
    private  static String getUserAgent(){
        if(null != mUserAgent){
            return mUserAgent;
        }
        String userAgent = "";
        StringBuffer sb = new StringBuffer();
        userAgent = System.getProperty("http.agent");//Dalvik/2.1.0 (Linux; U; Android 6.0.1; vivo X9L Build/MMB29M)

        for (int i = 0, length = userAgent.length(); i < length; i++) {
            char c = userAgent.charAt(i);
            if (c <= '\u001f' || c >= '\u007f') {
                sb.append(String.format("\\u%04x", (int) c));
            } else {
                sb.append(c);
            }
        }

        LogManager.infoLog("User-Agent","User-Agent: "+ sb.toString());
        return mUserAgent = sb.toString();
    }

    /**
     * 对url访问的统计
     * @param url
     */
    private static void httpRequestStatistic(String url, String requestType){
        try {
            String[] urls = url.split("/");
            String id = urls[urls.length-3]+File.separator + urls[urls.length-2]+File.separator
                    + urls[urls.length-1].split("\\?")[0];
            //百度统计最多30个字符，真是鸡肋
            if(id.length()>26){
                id = id.substring(0,25);
            }
            StatService.onEvent(WXApplication.mAppInstance, id, "http_"+id);
        }catch (Exception e){
            e.printStackTrace();
            ExceptionGlobalHandler.showException(TAG,e);
        }

    }
}
