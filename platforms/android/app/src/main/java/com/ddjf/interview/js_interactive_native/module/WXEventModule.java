package com.ddjf.interview.js_interactive_native.module;


import android.app.Activity;
import android.content.Intent;
import android.text.TextUtils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.aliyun.sls.android.sdk.utils.Utils;
import com.baidu.mobstat.StatService;
import com.ddjf.interview.WXApplication;
import com.ddjf.interview.database.DatabaseUtils;
import com.ddjf.interview.database.entity.AreaEntity;
import com.ddjf.interview.database.entity.FileEntity;
import com.ddjf.interview.database.entity.UserEntity;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.global.Constants;
import com.ddjf.interview.global.ThreadPoolManager;
import com.ddjf.interview.http.HttpApi;
import com.ddjf.interview.http.HttpLogFileUpload;
import com.ddjf.interview.service.SystemService;
import com.ddjf.interview.util.DateUtils;
import com.ddjf.interview.http.HttpUtils;
import com.ddjf.interview.http.ImageHandler;
import com.ddjf.interview.util.FileUtils;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.SharedPreferenceUtil;
import com.ddjf.interview.util.SystemUtils;
import com.luck.picture.lib.PictureSelectionModel;
import com.luck.picture.lib.PictureSelector;
import com.luck.picture.lib.config.PictureConfig;
import com.luck.picture.lib.config.PictureMimeType;
import com.luck.picture.lib.entity.LocalMedia;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;
import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.bridge.JSCallback;
import com.taobao.weex.common.WXModule;


import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***
 * 接收 js的请求。业务部分
 *
 * 需要WXApplication进行注册
 */

public class WXEventModule extends WXModule {
    static String TAG = "WXEventModule";

    /**
     * 图片上传
     *
     * @param imageLocationPaths 图片本地路径
     * @param callback
     */
    @JSMethod(uiThread = false)
    public void uploadImage(final String applyNo, final String fileType, final String customerNo,
                            final String[] imageLocationPaths,final int sortNo,final JSCallback callback) {

        if (null == applyNo || applyNo.equals("") || null == fileType || fileType.equals("")) {
            if (null != callback) {
                callback.invokeAndKeepAlive(WXEventResult.getFailureResult("applyNo和fileType不能为空！！"));
            }
            return;
        }
        ThreadPoolManager.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                LogManager.infoLog("接收来自js的请求", " images===" + imageLocationPaths.length);
                FileEntity entity = null;
                int mSortNo = sortNo+1;
                for (String imageLocationPath : imageLocationPaths) {
                    String fileName = imageLocationPath.split("/")[imageLocationPath.split("/").length - 1];
                    LogManager.infoLog("接收来自js的请求", " image name===" + fileName);

                    String eisUrl = Constants.getImageEnvironmentalUrl() + HttpApi.IMAGE_UPLOAD_URL +  FileUtils.filterFileName(fileName);

                    //将文件拷贝到缓存目录
                    FileUtils.copyFile(imageLocationPath, FileUtils.UploadFileCachePath + File.separator + fileName);

                    entity = new FileEntity();
                    entity.setCustomerNo(customerNo);
                    entity.setServerUrl(eisUrl);
                    entity.setLocationUrl(imageLocationPath);
                    entity.setFileName(fileName);
                    entity.setApplyNo(applyNo);
                    entity.setFileType(fileType);
                    entity.setLocationCacheUrl(FileUtils.UploadFileCachePath + File.separator + entity.getFileName());
                    entity.setSuffix(FileEntity.FileSuffixImageJpeg);
                    entity.setSortNo(++mSortNo);
                    entity.setStatus(2);
                    entity.setCreateDate(DateUtils.getStringDate());
                    entity.setId(WXApplication.mDatabaseUtils.saveEntity(entity));

                    ImageHandler.handlerImageUpload(entity, callback, null, true);

                }
            }
        });


    }

    /**
     * 图片重传
     */
    @JSMethod(uiThread = false)
    public void againUploadImage(String locationUrl,final JSCallback callback){
        try{

            locationUrl = locationUrl.replace("file://","");
            List<FileEntity> entityList = WXApplication.mDatabaseUtils.query(FileEntity.class,
                    "locationUrl like ? and status!=0",
                    new String[]{locationUrl});
            List<FileEntity> successList = WXApplication.mDatabaseUtils.query(FileEntity.class,
                    "locationUrl like ? and status=0",
                    new String[]{locationUrl});
            if(entityList.size()==0 && successList.size()>0){
                FileEntity entity = successList.get(0);
                if (null != callback) {
                    JSONObject data = new JSONObject();
                    data.put("imageLocationCachePath", entity.getLocationCacheUrlForJs());
                    data.put("imageLocationPath", entity.getLocationUrl());
                    data.put("authUrl", entity.getAuthUrl());
                    data.put("imageKey", entity.getFileKey());
                    data.put("sortNo", entity.getSortNo());

                    if (null != entity.getResultJsonInfo()) {
                        data.put("info", entity.getResultJsonInfo());
                    }
                    data.put("result", "true");
                    callback.invokeAndKeepAlive(WXEventResult.getResult(data.toJSONString()));

                }

                LogManager.infoLog(TAG,"图片重传找不到数据，说明已经上传成功了。");
                return;
            }
            if((entityList.size()>0 && successList.size()==0) || entityList.size()==0){
                if (null != callback) {
                    callback.invokeAndKeepAlive(WXEventResult.getFailureResult("重传失败！"));

                }

                LogManager.infoLog(TAG,"图片重传找不到数据，并且也没有上传成功了。");
                return;
            }
            entityList.get(0).setStatus(2);
            WXApplication.mDatabaseUtils.updateEntityForKey(entityList.get(0));
            ImageHandler.handlerImageUpload(entityList.get(0), callback, null, true);

        }catch (Exception e){
            e.printStackTrace();
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }
    /**
     * 图片上传到业务系统
     *
     * @param fileKey
     * @param callback
     * @param applyNo
     * @param fileType 图片类型
     */
    @JSMethod(uiThread = false)
    public void uploadImageToBPMS(String applyNo, String fileType, String[] fileKey, String customerNo,
                                  int sortNo, JSCallback callback) {
        for(int i=0;i<fileKey.length;i++){

            List<FileEntity> entityList = DatabaseUtils.query(FileEntity.class,"fileKey=? ",
                    new String[]{fileKey[i]});
            if(entityList!=null && entityList.size() > 0){
                FileEntity entity = entityList.get(0);
                entity.setFileKey(fileKey[i]);
                entity.setApplyNo(applyNo);
                entity.setFileType(fileType);
                entity.setSuffix(FileEntity.FileSuffixImageJpeg);
                entity.setCustomerNo(customerNo);
                entity.setSortNo(++sortNo);
                ImageHandler.uploadBMPS(entity, callback);
            }
        }


    }

    /**
     * 获取图片url
     *
     * @param fileKeys
     * @param callback
     * @param imageType 图片类型：0大图，1小图
     */
    @JSMethod(uiThread = false)
    public void getImageUrl(String[] fileKeys, String imageType, JSCallback callback) {
        if (null == fileKeys && fileKeys.length == 0) {
            LogManager.infoLog(TAG, "");
            return;
        }
        if (null == imageType) {
            imageType = "0";
        }
        Map<String, String> fileKeyVersionMap = new HashMap<String, String>();
        for (String fileKey : fileKeys) {
            fileKeyVersionMap.put(fileKey, imageType);
        }
        ImageHandler.getImageUrls(fileKeys, imageType, callback);
    }

    /***
     * 图片删除
     * @param applyNo
     * @param fileKeys
     * @param callback
     */
    @JSMethod(uiThread = false)
    public void imageDelete(final String applyNo, String fileType, final String fileKeys, final JSCallback callback) {

        if (null == applyNo || applyNo.equals("") || null == fileKeys || fileKeys.equals("")) {
            if (null != callback) {
                callback.invokeAndKeepAlive(WXEventResult.getFailureResult("applyNo和fileKeys不能为空！！"));
            }
            return;
        }
        ImageHandler.imageDelete(applyNo, fileKeys, callback,null);
    }

    /**
     * 图片识别
     *
     * @param type               1身份证；0银行卡
     * @param applyNo
     * @param fileType           资料类型
     * @param imageLocationPaths
     * @param callback
     */
    private void handlerAnalysis(final int type, final String applyNo, final String fileType, final String customerNo,
                                 final String customerSaveData, String[] imageLocationPaths, final JSCallback callback) {
        FileEntity entity = null;
        final Map<String, Object> resultMap = new HashMap<>();

        for (final String imageLocationPath : imageLocationPaths) {
            String fileName = imageLocationPath.split("/")[imageLocationPath.split("/").length - 1];

            String eisUrl = Constants.getImageEnvironmentalUrl() + HttpApi.IMAGE_UPLOAD_URL +  FileUtils.filterFileName(fileName);

            entity = new FileEntity();
            entity.setServerUrl(eisUrl);
            entity.setLocationUrl(imageLocationPath);
            entity.setFileName(fileName);
            entity.setApplyNo(applyNo);
            entity.setFileType(fileType);
            entity.setLocationCacheUrl(FileUtils.UploadFileCachePath + File.separator + entity.getFileName());
            entity.setSuffix(FileEntity.FileSuffixImageJpeg);
            entity.setStatus(2);
            entity.setCreateDate(DateUtils.getStringDate());
            entity.setId(WXApplication.mDatabaseUtils.saveEntity(entity));

            //将文件拷贝到缓存目录
            FileUtils.copyFile(imageLocationPath, FileUtils.UploadFileCachePath + File.separator + fileName);

            //第一步上传到影像服务
            ImageHandler.handlerImageUpload(entity, callback, new ImageHandler.ImageHttpCallback() {
                @Override
                public void httpSuccess(final FileEntity entity) {
                    String url = ImageHandler.getImageUrl(entity.getFileKey(), "0", null);

                    //第二步 解析
                    ImageHandler.analysisInfo(type, url, entity.getFileName(), new HttpUtils.HttpRequestCallBack() {
                        @Override
                        public void onFailure(Request request, Exception e) {
                            if (null != callback) {
                                callback.invokeAndKeepAlive(WXEventResult.getFailureResult(e.getMessage()));
                            }
                            //更新上传图片的状态
                            FileUtils.updateUploadImageStatus(entity, 1);
                        }

                        @Override
                        public void onSuccess(Response response) {

                            try {
                                //更新上传图片的状态
                                FileUtils.updateUploadImageStatus(entity, 0);

                                String body = response.body().string();
                                final JSONObject resultData = JSONObject.parseObject(body).getJSONObject("result");

                                Boolean success = JSONObject.parseObject(body).getBoolean("success");
                                if (null == success || !success) {
                                    String msg = JSONObject.parseObject(body).getString("msg");
                                    if (null != callback) {
                                        callback.invokeAndKeepAlive(WXEventResult.getFailureResult(msg));
                                    }
                                    LogManager.errorLog(TAG, "解析图片失败--" + body);
                                    return;
                                }

                                if (type == 1) {//身份证
                                    String idCardSide = resultData.getString("idCardSide");
                                    if (idCardSide.equals("none")) {
                                        if (null != callback) {
                                            callback.invokeAndKeepAlive(WXEventResult.getFailureResult("图片识别失败"));
                                        }
                                        LogManager.infoLog(TAG, "解析图片失败--" + body);
                                        return;
                                    }
                                }


                                LogManager.infoLog(TAG, "解析图片结果===" + body);

                                if (type == 1) {//身份证
                                    String idCard = resultData.getString("cardNumber");
                                    entity.setCustCertID(idCard);

                                    JSONObject customerJson = new JSONObject();
                                    customerJson.put("name", resultData.getString("name"));
                                    customerJson.put("idCardNo", idCard);
                                    customerJson.put("sex", resultData.getString("sex"));
                                    customerJson.put("signAddress", resultData.getString("signAddress"));
                                    customerJson.put("address", resultData.getString("address"));
                                    customerJson.put("age", resultData.getString("age"));
                                    customerJson.put("nation", resultData.getString("nation"));
                                    customerJson.put("birthday", resultData.getString("birthday"));
                                    customerJson.put("expireDate", resultData.getString("expireDate"));
                                    customerJson.put("signAddress", resultData.getString("signAddress"));
                                    customerJson.put("signDate", resultData.getString("signDate"));
                                    customerJson.put("idCardSide", resultData.getString("idCardSide"));


                                    JSONObject bodyJson = JSONObject.parseObject(customerSaveData);
                                    bodyJson.put("customer", customerJson);
                                    entity.setResultJsonInfo(bodyJson.toJSONString());

                                } else {//银行卡

                                    JSONObject bankJson = new JSONObject();
                                    bankJson.put("bankCardNumber", resultData.getString("bankCardNumber"));
                                    bankJson.put("bankName", resultData.getString("bankName"));
                                    bankJson.put("bankCardType", resultData.getString("bankCardType"));

                                    JSONObject bodyJson = new JSONObject();
                                    bodyJson.put("bank", bankJson);
                                    entity.setResultJsonInfo(bodyJson.toJSONString());

                                }

                                if (null != callback) {
                                    JSONObject data = new JSONObject();
                                    data.put("imageLocationCachePath", entity.getLocationCacheUrlForJs());
                                    data.put("imageLocationPath", entity.getLocationUrl());
                                    data.put("authUrl", entity.getAuthUrl());
                                    data.put("imageKey", entity.getFileKey());
                                    if (null != entity.getResultJsonInfo()) {
                                        data.put("info", entity.getResultJsonInfo());
                                    }
                                    data.put("result", "true");
                                    callback.invokeAndKeepAlive(WXEventResult.getResult(data.toJSONString()));
                                }

                            } catch (Throwable e) {
                                e.printStackTrace();
                                if (null != callback) {
                                    callback.invokeAndKeepAlive(WXEventResult.getResult(null));
                                }
                            }
                        }
                    });

                }

                @Override
                public void httpFailure(FileEntity entity,String errorMsg) {
                    if (null != callback) {
                        callback.invokeAndKeepAlive(WXEventResult.getResult(null));
                    }
                }
            }, false);

        }
    }

    /**
     * 银行卡识别
     *
     * @param applyNo
     * @param fileType           资料类型
     * @param imageLocationPaths
     * @param callback
     */
    @JSMethod(uiThread = false)
    public void getBankCardForImage(String applyNo, String fileType,
                                    String[] imageLocationPaths, final JSCallback callback) {

        if (null == applyNo || applyNo.equals("") || null == fileType || fileType.equals("")) {
            if (null != callback) {
                callback.invokeAndKeepAlive(WXEventResult.getFailureResult("applyNo和fileType不能为空！！"));
            }
            return;
        }

        handlerAnalysis(0, applyNo, fileType, null, null, imageLocationPaths, callback);
    }

    /**
     *
     * @param typeNo 目标影像科目
     * @param originFileIds 原fileId
     * @param custNo 客户编号  如果有的话就传入
     */
    @JSMethod(uiThread = false)
    public void imageCopy(final String typeNo, final String custNo, final String[] originFileIds, final JSCallback jsCallback){
        final StringBuffer resultMsg = new StringBuffer();
        for( int i=0;i<originFileIds.length;i++){
            final String fileId = originFileIds[i];
            final int index = i+1;
            ImageHandler.eisImageCopy(fileId, new HttpUtils.HttpRequestCallBack() {
                @Override
                public void onFailure(Request request, Exception e) {
                    ExceptionGlobalHandler.showException(TAG,e);
                }

                @Override
                public void onSuccess(Response response) {
                    try {

                        JSONObject bodyObject = JSONObject.parseObject(response.body().string());
                        String retCode = bodyObject.getString("retCode");
                        final String retMsg = bodyObject.getString("retMsg");

                        final JSONObject resultData = bodyObject.getJSONObject("data");

                        if(null!= retCode && retCode.equals("1") && null!=resultData){
                            String currentFileId = resultData.getString("fileKey");
                            ImageHandler.bpmsImageCopy(typeNo, custNo,fileId, currentFileId, new HttpUtils.HttpRequestCallBack() {
                                @Override
                                public void onFailure(Request request, Exception e) {
                                    ExceptionGlobalHandler.showException(TAG,e);
                                }

                                @Override
                                public void onSuccess(Response response) {
                                    try{

                                        JSONObject bodyObject = JSONObject.parseObject(response.body().string());
                                        String code = bodyObject.getString("code");
                                        String msg = bodyObject.getString("msg");
                                        String success = bodyObject.getString("success");

                                        LogManager.infoLog(TAG,"第"+index+"张 图片拷贝结果==="+bodyObject.toJSONString());

                                        if(null != code && code.equals("200") && null!=success && success.equals("true")){
                                            resultMsg.append("第"+index+"张图片拷贝成功;");
                                        }else{
                                            resultMsg.append("第"+index+"张图片拷贝失败，具体原因："+msg);
                                        }

                                        if(null != jsCallback && index == originFileIds.length){
                                            JSONObject data = new JSONObject();
                                            data.put("msg", resultMsg.toString());
                                            data.put("result", "true");
                                            jsCallback.invokeAndKeepAlive(WXEventResult.getResult(data.toJSONString()));
                                        }

                                    }catch (Exception e){
                                        ExceptionGlobalHandler.showException(TAG,e);
                                        if(null != jsCallback && index == originFileIds.length-1){
                                            jsCallback.invokeAndKeepAlive(WXEventResult.getFailureResult("图片拷贝异常"));
                                        }
                                    }
                                }
                            });
                        }else{
                            resultMsg.append("第"+index+"张图片拷贝失败，具体原因："+retMsg);
                            if(null != jsCallback && index == originFileIds.length-1){
                                jsCallback.invokeAndKeepAlive(resultMsg);
                            }
                        }
                    }catch (Exception e){
                        ExceptionGlobalHandler.showException(TAG,e);
                        if(null != jsCallback && index == originFileIds.length-1){
                            jsCallback.invokeAndKeepAlive(WXEventResult.getFailureResult("图片拷贝异常"));
                        }
                    }
                }
            });
        }
    }

    /**
     * 身份证识别
     *
     * @param customerInfo       json字符串
     * @param imageLocationPaths 身份证正反面图片
     * @param callback
     */
    @JSMethod(uiThread = false)
    public void getIdCardForImage(String customerInfo, String[] imageLocationPaths, JSCallback callback) {
//        customerInfo = "{\"applyNo\":\"SZC0220180613006\",\"fileType\":\"M01001\",}";
        JSONObject jsonObject = JSONObject.parseObject(customerInfo);
        String applyNo = jsonObject.getString("applyNo");
        String fileType = jsonObject.getString("fileType");
        String customerNo = jsonObject.getString("customerNo");

        if (null == applyNo || applyNo.equals("") || null == fileType || fileType.equals("")) {
            if (null != callback) {
                callback.invokeAndKeepAlive(WXEventResult.getFailureResult("applyNo和fileType不能为空！！"));
            }
            return;
        }

        handlerAnalysis(1, applyNo, fileType, customerNo, customerInfo, imageLocationPaths, callback);
    }

    /**
     * 登录
     *
     * @param userInfo
     *
     */
    @JSMethod
    public void login(JSONObject userInfo) {
        String userId = userInfo.getString("userId");
        String phone = userInfo.getString("phone");
        String accessToken = userInfo.getString("token");
        String companyCode = userInfo.getString("companyCode");
        String companyName = userInfo.getString("companyName");
        LogManager.infoLog(TAG, "login操作  userId=" + userId + " phone=" + phone + " token=" + accessToken + " companyCode=" + companyCode + " companyName=" + companyName);
        SharedPreferenceUtil.setData(SharedPreferenceUtil.CURRENT_LOGIN_TOKEN, accessToken);

        UserEntity entity = new UserEntity();
        try {
            entity.setUserId(userId);
            entity.setMobile(phone);
            entity.setStatus(true);
            entity.setAccessToken(accessToken);
            entity.setCreateDate(DateUtils.formatDate(new Date(), DateUtils.DATA_FORMAT_ALL));
            long id = DatabaseUtils.saveEntity(entity);

            SharedPreferenceUtil.setData(SharedPreferenceUtil.CURRENT_LOGIN_USERID, userId);
            SharedPreferenceUtil.setData(SharedPreferenceUtil.CURRENT_USER_LOGIN_DB_ID, id);
        }catch (Exception e){
            e.printStackTrace();
            ExceptionGlobalHandler.showException(TAG,e);
        }
        if(!TextUtils.isEmpty(phone)){
            SharedPreferenceUtil.setData(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE, phone);
        }
        if(!TextUtils.isEmpty(companyCode)){
            SharedPreferenceUtil.setData(SharedPreferenceUtil.CURRENT_LOGIN_COMPANYCODE, companyCode);
        }
        if(!TextUtils.isEmpty(companyName)){
            SharedPreferenceUtil.setData(SharedPreferenceUtil.CURRENT_LOGIN_COMPANYNAME, companyName);
        }
        //设备信息上传
        uploadRecord();
    }

    /**
     * 组织切换
     *
     * @param companyCode
     * @param companyName
     */
    @JSMethod
    public void companyChange(String companyCode, String companyName) {
        SharedPreferenceUtil.setData(SharedPreferenceUtil.CURRENT_LOGIN_COMPANYCODE, companyCode);
        SharedPreferenceUtil.setData(SharedPreferenceUtil.CURRENT_LOGIN_COMPANYNAME, companyName);
    }
    /**
     * 退出
     *
     * @param callback
     */
    @JSMethod
    public void logout(JSCallback callback) {
        Long id = SharedPreferenceUtil.getDataLong(SharedPreferenceUtil.CURRENT_USER_LOGIN_DB_ID);
        UserEntity entity = new UserEntity();
        entity.setId(id);
        entity.setStatus(false);
        entity.setUpdateDate(DateUtils.formatDate(new Date(), DateUtils.DATA_FORMAT_ALL));
        DatabaseUtils.updateEntityForKey(entity);
        callback.invokeAndKeepAlive(null);

        SharedPreferenceUtil.setData(SharedPreferenceUtil.CURRENT_USER_LOGIN_DB_ID, null);
        SharedPreferenceUtil.setData(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE, null);
        SharedPreferenceUtil.setData(SharedPreferenceUtil.CURRENT_LOGIN_TOKEN, null);
    }

    /**
     * 获取当前用户信息
     *
     * @param callback
     */
    @JSMethod
    public void getCurrentUserInfo(JSCallback callback) {
        Long id = SharedPreferenceUtil.getDataLong(SharedPreferenceUtil.CURRENT_USER_LOGIN_DB_ID);
        UserEntity entity = (UserEntity) DatabaseUtils.queryEntity(new UserEntity(), id + "");


        if (null == entity) {
            entity = new UserEntity();
            entity.setStatus(false);
        }

        JSONObject object = new JSONObject();
        try {
            object.put("mobile", entity.getMobile());
            object.put("name", entity.getName());
            object.put("status", entity.getStatus());
            object.put("accessToken", entity.getAccessToken());

        } catch (JSONException e) {
            e.printStackTrace();
        }

        callback.invokeAndKeepAlive(WXEventResult.getResult(object.toJSONString()));

    }

    /**
     * 获取上传中的图片
     *
     * @param applyNo
     * @param fileType 文件类型：身份证、银行卡等等
     * @param callback
     */
    @JSMethod(uiThread = false)
    public void getUploadingImage(String applyNo, String fileType, String customerNo, JSCallback callback) {

        try {
            String[] whereArgs = {"1", applyNo, fileType};
            String sql = "status=? and applyNo=?  and fileType=? ";
            if (null != customerNo && !customerNo.equals("")) {
                whereArgs = new String[]{"1", applyNo, fileType, customerNo};
                sql = "status=? and applyNo=?  and fileType=? and customerNo=? ";
            }
            //数据库里面抓上传失败数据
            List<FileEntity> files = WXApplication.mDatabaseUtils.query(FileEntity.class, sql, whereArgs);
            if (null != callback) {
                JSONArray jsonArray = new JSONArray();
                if (null != files && files.size() != 0) {

                    for (int i = 0; i < files.size(); i++) {
                        FileEntity item = files.get(i);

                        if (!new File(item.getLocationCacheUrl()).exists()) {
                            LogManager.infoLog(TAG, "name=" + item.getFileName() + " 图片不在了 url=" + item.getLocationCacheUrl());
                            continue;
                        }
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.put("fileName", item.getFileName());
                        jsonObject.put("fileId", item.getFileKey());
                        jsonObject.put("fileType", fileType);
                        jsonObject.put("locationCacheUrl", item.getLocationCacheUrlForJs());
                        jsonObject.put("applyNo", item.getApplyNo());
                        jsonArray.add(jsonObject);

                    }
                }

                callback.invokeAndKeepAlive(WXEventResult.getResult(jsonArray.toJSONString()));

            }
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
            if (null != callback) {
                callback.invoke(WXEventResult.getResult(null));
            }
            LogManager.errorLog(TAG, e.getMessage());
        }
    }

    /**
     * 百度自定义事件 发生次数统计
     *
     * @param eventId   事件ID
     * @param eventDesc 事件详情
     */
    @JSMethod(uiThread = false)
    public void eventStatisticBaidu(String eventId, String eventDesc) {
        LogManager.infoLog(TAG, "百度统计 eventId=" + eventId + " eventDesc=" + eventDesc);
        if (null != eventDesc && null != eventId) {
            StatService.onEvent(mWXSDKInstance.getContext(), eventId, eventDesc);
        }
    }


    /**
     * 添加面试统计渲染事件
     * @param key 页面的KEY
     * @param name  页面的名称
     * @param mounted  页面渲染时长
     * @param http  http请求时长
     * @param sum  页面总加载时间
     */
    @JSMethod(uiThread = false)
    public void eventStatisticRender(String key, String name, long mounted, long http, long sum){
        LogManager.infoLog(TAG, "百度统计 rendering duration=" + sum);
        Map<String, String> params = new HashMap<String,String>();
        params.put("mounted", String.valueOf(mounted));
        params.put("http", String.valueOf(http));
        params.put("sum", String.valueOf(sum));
        StatService.onEvent(mWXSDKInstance.getContext(), "page_render_stat", name, 1, params);
    }

    /**
     * 添加面试统计渲染事件
     * @param key 页面的KEY
     * @param name  页面的名称
     * @param httpCount  请求数据
     * @param duration  请求时长
     */
    @JSMethod(uiThread = false)
    public void eventStatisticHttp(String key, String name, long httpCount, long duration){
        LogManager.infoLog(TAG, "百度统计 http duration=" + duration);
        Map<String, String> httpParams = new HashMap<String, String>();
        httpParams.put("count", String.valueOf(httpCount));
        httpParams.put("duration", String.valueOf(duration));
        StatService.onEvent(mWXSDKInstance.getContext(), "http_stat", name, 1, httpParams);
    }

    /***
     * 系统更新
     */
    @JSMethod
    public void systemUpdate() {

    }

    /**
     * 获取系统信息
     *
     * @param callback
     */
    @JSMethod
    public void getSystemInfo(JSCallback callback) {

        callback.invokeAndKeepAlive(WXEventResult.getResult(SystemUtils.getDevicesInfo()));
    }

    /***
     * 更新 缓存数据(系统属性、字典)
     */
    @JSMethod
    public void updateCacheData() {
        try {
            SharedPreferenceUtil.setData(SharedPreferenceUtil.FORCE_UPDATE_SYSTEM_PROPERTY, true);
            WXApplication.mAppInstance.startService(new Intent(WXApplication.mAppInstance, SystemService.class));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * log日志文件上传
     */
    @JSMethod(uiThread = false)
    public void uploadLogFile(JSCallback jsCallback) {
        //log日志文件上传
//        HttpLogFileUpload.logFileUpload(true, jsCallback);
    }

    /**
     * 获取省份、城市信息
     *
     * @param provinceCode 省份编码
     * @param cityCode     市编码
     * @param jsCallback
     */
    @JSMethod(uiThread = false)
    public void getProvinceCity(String provinceCode, String cityCode, JSCallback jsCallback) {
        try {

            String sql = "";
            if (null != provinceCode && !provinceCode.equals("")) {
                sql = "provinceCode='" + provinceCode + "'";
            }
            if (!sql.equals("") && null != cityCode && !cityCode.equals("")) {
                sql = sql + " and cityAndAreaJSON like %" + cityCode + "%";
            } else if (sql.equals("") && null != cityCode && !cityCode.equals("")) {
                sql = " cityAndAreaJSON like %" + cityCode + "%";
            }
            List<AreaEntity> list = null;
            if (sql.length() == 0) {
                sql = " 1=1 ";
            }
            list = DatabaseUtils.query(AreaEntity.class, sql, new String[]{});
            JSONArray jsonArray = new JSONArray();
            for (AreaEntity item : list) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("provinceCode", item.getProvinceCode());
                jsonObject.put("provinceName", item.getProvinceName());
                jsonObject.put("cityAndArea", item.getCityAndAreaJSON());
                jsonArray.add(jsonObject);
            }

            if (null != jsCallback) {
                jsCallback.invokeAndKeepAlive(WXEventResult.getResult(jsonArray.toJSONString()));
            }
        } catch (Exception e) {
            e.printStackTrace();
            if (null != jsCallback) {
                jsCallback.invokeAndKeepAlive(WXEventResult.getResult(null));
            }
        }
    }

    /**
     * 获取最新一条的推送消息
     *
     * @param callback
     */
    @JSMethod(uiThread = false)
    public void getRecentMsg(JSCallback callback) {
        String currentPhone = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE);
        String msg = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.RECENT_MESSAGE_TAG + currentPhone);
        if (null != callback) {
            callback.invokeAndKeepAlive(WXEventResult.getResult(msg));
        }
        LogManager.infoLog(TAG, "当前手机号=" + currentPhone + "");
    }

    private JSCallback previewImageCallback;
    /**
     * 图片预览
     * @param options
     */
    @JSMethod(uiThread = false)
    public void previewImage(HashMap<String,Object> options,JSCallback callback){
        this.previewImageCallback = callback;
        JSONArray urls = (JSONArray) options.get("urls");
        JSONArray fileIds = (JSONArray) options.get("fileIds");
        String applyNo = (String) options.get("applyNo");


        List<LocalMedia> medias = new ArrayList<>();

        for (int i = 0; i < urls.size(); i++) {

            String url = urls.getString(i);
            if(url.indexOf("version=1")>0){
                url = url.replace("version=1","version=0");
            }

            LocalMedia media = new LocalMedia(url, 0, false, 0, 0, PictureConfig.TYPE_IMAGE);
            media.setApplyNo(applyNo);
            media.setFileKey(fileIds.getString(i));

            media.setPictureType("image/jpeg");

            medias.add(media);

            LogManager.infoLog(TAG,"url="+url+"  applyNo="+applyNo+"  ids="+fileIds.getString(i));
        }

        int position = (int)options.get("current");

        PictureSelector.create((Activity) this.mWXSDKInstance.getContext()).externalPicturePreview
                (position, medias,PictureConfig.REFRESH_PREVIEW_REQUEST);

    }


    private JSCallback onChooseCallBack;

    /**
     *
     * 图片选择
     * @param options
     * @param callback
     */
    @JSMethod(uiThread = false)
    public void chooseImage(HashMap<String, Object> options, JSCallback callback) {
        this.onChooseCallBack = callback;

        PictureSelectionModel pictureSelectionModel;

        if (options.containsKey("sourceType")) {
            if ("album".equals(options.get("sourceType"))) {
                pictureSelectionModel = PictureSelector.create((Activity) this.mWXSDKInstance.getUIContext()).openGallery(PictureMimeType.ofImage()
                ).isCamera(false);
            } else {
                pictureSelectionModel = PictureSelector.create((Activity) this.mWXSDKInstance.getUIContext()).openCamera(PictureMimeType.ofImage());
            }
        } else {
            pictureSelectionModel = PictureSelector.create((Activity) this.mWXSDKInstance.getUIContext()).openGallery(PictureMimeType.ofImage());
        }

        for (Map.Entry<String, Object> entry : options.entrySet()) {

            switch (entry.getKey()) {
                case "maxSelectCount":
                    pictureSelectionModel.maxSelectNum((Integer) entry.getValue());
                    break;
                case "allowSelectGif":
                    pictureSelectionModel.isGif((Boolean) entry.getValue());
                    break;
                case "sourceType":

                    if ("album".equals(entry.getValue())) {
                        pictureSelectionModel.isCamera(false);
                    }

                    break;
                case "allowEditImage":
                    pictureSelectionModel.enableCrop((Boolean) entry.getValue());
                    break;
                case "clipRatio":

                    JSONObject ratio = (JSONObject) entry.getValue();

                    Integer x = ratio.getInteger("x");

                    Integer y = ratio.getInteger("y");

                    pictureSelectionModel.withAspectRatio(x, y);// 裁剪比例 如16:9 3:2 3:4 1:1 可自定义
            }
        }
        pictureSelectionModel.rotateEnabled(true);
        pictureSelectionModel.forResult(PictureConfig.CHOOSE_REQUEST);//结果回调onActivityResult code
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode == -1 || resultCode ==0) {
            switch (requestCode) {
                case PictureConfig.CHOOSE_REQUEST:
                    // 图片选择结果回调
                    List<LocalMedia> selectList = PictureSelector.obtainMultipleResult(data);

                    JSONArray jsonArray = new JSONArray();

                    // 例如 LocalMedia 里面返回三种path
                    // 1.media.getPath(); 为原图path
                    // 2.media.getCutPath();为裁剪后path，需判断media.isCut();是否为true
                    // 3.media.getCompressPath();为压缩后path，需判断media.isCompressed();是否为true
                    // 如果裁剪并压缩了，已取压缩路径为准，因为是先裁剪后压缩的
                    for (LocalMedia media : selectList) {

                        JSONObject object = new JSONObject();
                        object.put("path", media.getPath());
                        jsonArray.add(object);
                    }
                    if (null != this.onChooseCallBack) {
                        this.onChooseCallBack.invoke(WXEventResult.getResult(jsonArray.toJSONString()));

                    }
                    break;
                case PictureConfig.REFRESH_PREVIEW_REQUEST:
                    //图片预览界面 旋转保存、删除后
                    if(null!=previewImageCallback && null!=data){
                        boolean isNotifyRefresh = data.getBooleanExtra("isNotifyRefresh",false);
                        if(isNotifyRefresh){
                            JSONObject object = new JSONObject();
                            object.put("refresh", true);
                            previewImageCallback.invokeAndKeepAlive(WXEventResult.getResult(object.toJSONString()));
                        }
                    }
                    break;
            }
        }

    }


    public static void uploadRecord(){
        String phone = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE);
        String userId = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_USERID);
        if(TextUtils.isEmpty(phone) || TextUtils.isEmpty(userId)){
            LogManager.infoLog(TAG,"更新设备信息记录失败！手机号或者用ID为空：phone="+phone+"  userId="+userId);
            return;
        }
        String url = Constants.getBpmsBaseUrl(HttpApi.LOGIN_AFTER_RECORD_URL);
        JSONObject jsonObject = SystemUtils.getDevicesInfoObject();
        jsonObject.put("mobile", phone);
        jsonObject.put("userNo", userId);
        HttpUtils.httpPostRequest(url, jsonObject,null, new HttpUtils.HttpRequestCallBack() {
            @Override
            public void onFailure(Request request, Exception e) {
                LogManager.infoLog(TAG, "设备信息上传出错了==" + e.getMessage());
            }

            @Override
            public void onSuccess(Response response) {
                try {
                    String msg = response.body().string();
                    LogManager.infoLog(TAG, "设备信息上传返回结果==" + msg);

                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });
    }
}
