package com.ddjf.interview.http;

import com.alibaba.fastjson.JSONObject;
import com.ddjf.interview.WXApplication;
import com.ddjf.interview.database.entity.FileEntity;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.global.Constants;
import com.ddjf.interview.global.ThreadPoolManager;
import com.ddjf.interview.js_interactive_native.module.WXEventResult;
import com.ddjf.interview.util.DateUtils;
import com.ddjf.interview.util.FileUtils;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.SharedPreferenceUtil;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;
import com.taobao.weex.bridge.JSCallback;


import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by yejunrong on 18/5/31.
 * log 日志文件上传
 */

public class HttpLogFileUpload {
    static String Tag = "HttpLogFileUpload";
    /**
     * @param isForce 是否强制上传
     */
    public static void logFileUpload(boolean isForce,final JSCallback callback) {
        /***
         *  日志不写入文件，所以也不上传
         */

//        //逻辑的判断 ：如果不是需要强制上传，那么每隔X小时进行一次上传操作
//        if (!isForce) {
//            long last = SharedPreferenceUtil.getDataLong(SharedPreferenceUtil.LOG_FILE_UPLOAD_TIME);
//            if ((new Date().getTime() - last) > Constants.SYSTEM_PROPERTY_UPDATE_TIME_INTERVAL/4) {
//
//                ThreadPoolManager.getThreadPool().execute(new Runnable() {
//                    @Override
//                    public void run() {
//                        upload(callback);
//                    }
//                });
//            }
//            return;
//        }
//        ThreadPoolManager.getThreadPool().execute(new Runnable() {
//            @Override
//            public void run() {
//                upload(callback);
//            }
//        });
    }

    private static void upload(final JSCallback callback) {
        try {
            String currentDate = DateUtils.getStringDateShort();

            //将当前日期下的log文件 压缩
            File file = new File(FileUtils.getLogDir());
            List<String> currentDateFileName = new ArrayList<>();
            String outputZipName = DateUtils.getStringDate(DateUtils.DATA_FORMAT_ALL_) + "_" +
                    SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE) + ".zip";
            File zipFile = new File(FileUtils.getLogDir(), outputZipName);
            if(null==file){
                LogManager.errorLog("HttpLogFileUpload"," 当前日期下 没有log文件。。。");
                return;
            }
            for (int i = 0; null != file && null!=file.listFiles() && i < file.listFiles().length; i++) {
                File f = file.listFiles()[i];
                if (f.getName().indexOf(currentDate) > -1) {
                    currentDateFileName.add(f.getPath());
                }
            }
            FileUtils.zipFiles(currentDateFileName, zipFile);

            // 上传到影像服务器
            FileEntity entity = new FileEntity();
            entity.setLocationUrl(zipFile.getPath());
            String eisUrl = Constants.getImageEnvironmentalUrl() + HttpApi.IMAGE_UPLOAD_URL + zipFile.getName();
            entity.setServerUrl(eisUrl);
            entity.setFileName(zipFile.getName());
            entity.setSuffix(FileEntity.FileSuffixImageZip);

            ImageHandler.handlerImageUpload(entity, null, new ImageHandler.ImageHttpCallback() {
                @Override
                public void httpSuccess(FileEntity entity) {
                    try {

                        LogManager.infoLog("HttpLogFileUpload ", "log压缩包文件上传到影像服务器成功 " + entity.getFileName() +
                                " fileKey=" + entity.getFileKey() + " 认证可访问的URL=" + entity.getAuthUrl());

                        // 上传到APP后台
                        String url = Constants.getBpmsBaseUrl(HttpApi.LOG_FILE_UPLOAD_URL);
                        JSONObject body = new JSONObject();
                        body.put("fileKey", entity.getFileKey());
                        body.put("content", entity.getAuthUrl());
                        body.put("userNo", SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_USERID));
                        body.put("mobile", SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE));

                        HttpUtils.httpPostRequest(url, body,null, new HttpUtils.HttpRequestCallBack() {
                            @Override
                            public void onFailure(Request request, Exception e) {
                                LogManager.infoLog("HttpLogFileUpload  log日志文件上传到App后台 失败", "" + e.getMessage());
                            }

                            @Override
                            public void onSuccess(Response response) {
                                try {
                                    String result = response.body().string();
                                    LogManager.infoLog("HttpLogFileUpload log日志文件上传到App后台 成功", "" + result);
                                    SharedPreferenceUtil.setData(SharedPreferenceUtil.LOG_FILE_UPLOAD_TIME, new Date().getTime());
                                    if(result != null && null!= callback){
                                        callback.invokeAndKeepAlive(WXEventResult.getResult(result));
                                    }
                                } catch (Exception e) {
                                    ExceptionGlobalHandler.showException(Tag,e);
                                    if( null!= callback){
                                        callback.invokeAndKeepAlive(WXEventResult.getFailureResult("上传失败，请稍后再试！"));
                                    }
                                }
                            }
                        });

                    } catch (Exception e) {
                        ExceptionGlobalHandler.showException(Tag,e);
                        if( null!= callback){
                            callback.invokeAndKeepAlive(WXEventResult.getFailureResult(e.getMessage()));
                        }
                    }
                }

                @Override
                public void httpFailure(FileEntity entity,String errorMsg) {
                    LogManager.infoLog("HttpLogFileUpload ", "log压缩包文件上传到影像服务器失败 " + entity.getFileName());
                    if( null!= callback){
                        callback.invokeAndKeepAlive(WXEventResult.getFailureResult("上传失败"));
                    }
                }
            }, false);

        } catch (Exception e) {
            ExceptionGlobalHandler.showException(Tag,e);
            if( null!= callback){
                callback.invokeAndKeepAlive(WXEventResult.getResult(null));
            }
        }

    }


}
