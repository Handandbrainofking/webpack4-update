package com.ddjf.interview.http;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.JSONPObject;
import com.ddjf.interview.WXApplication;
import com.ddjf.interview.database.entity.FileEntity;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.global.Constants;
import com.ddjf.interview.js_interactive_native.module.WXEventResult;
import com.ddjf.interview.util.FileUtils;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.SystemUtils;
import com.ddjf.interview.util.UrlAuth;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;
import com.taobao.weex.bridge.JSCallback;


import org.json.JSONException;

import java.io.File;
import java.io.FileInputStream;

/**
 * Created by yejunrong on 18/5/15.
 * <p>
 * 图片相关业务处理
 */

public class ImageHandler {
    static String TAG = "ImageHandler 相关操作 ";

    /**
     * 压缩图片逻辑处理
     */
    public static String compressImageHandle(String locationUrl, String fileType, String outFileUrl) {

        try {
            File file = new File(locationUrl);
            FileInputStream fis = new FileInputStream(file);
            long size = fis.available();
            LogManager.infoLog(TAG, "当前上传的原图大小：" + String.format("%.2f", (double) size / 1024 / 1024) + " M");

            //个人征信报告、原图小于1.5M 不做压缩处理
            if(!fileType.equals("M01004") && size > 2 * 1024 * 1024) {
                FileUtils.compressImage(locationUrl, outFileUrl);
                file = new File(outFileUrl);
                fis = new FileInputStream(file);
                size = fis.available();
                LogManager.infoLog(TAG, "压缩后的图片大小：" + String.format("%.2f", (double) size / 1024 / 1024) + " M");
            }else {
                outFileUrl = locationUrl;
                LogManager.infoLog(TAG, "图片没有做压缩操作 fileType="+fileType+" size=" +
                        String.format("%.2f", (double) size / 1024 / 1024) + " M");

            }
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG, e);
        }
        return outFileUrl;
    }

    /**
     * 图片上传逻辑处理
     *
     * @param entity
     * @param jsCallback
     * @param uploadCallback
     * @param isUploadBPMS
     */
    public static void handlerImageUpload(final FileEntity entity, final JSCallback jsCallback, final
    ImageHttpCallback uploadCallback, final boolean isUploadBPMS) {

        LogManager.infoLog(TAG, "上传到影像服务器开始  fileName="+entity.getFileName()+" fileId="+entity.getFileKey());

        //对图片进行压缩处理
        if (null != entity.getSuffix() && entity.getSuffix().equals(FileEntity.FileSuffixImageJpeg)) {
            String outFile = FileUtils.UploadFileCompressPath + File.separator + entity.getFileName();
            String resultFile = compressImageHandle(entity.getLocationUrl(), entity.getFileType(), outFile);

            if (null == resultFile) {
                if (null != jsCallback) {
                    jsCallback.invokeAndKeepAlive(WXEventResult.getFailureResult("图片有异常！  fileName="+
                            entity.getFileName() +" fileId="+entity.getFileKey()));
                }
                if (null != uploadCallback) {
                    uploadCallback.httpFailure(entity, "图片有异常！  fileName="+entity.getFileName()
                            +" fileId="+entity.getFileKey());
                }
                entity.setStatus(0);
                WXApplication.mDatabaseUtils.updateEntityForKey(entity);
                LogManager.infoLog(TAG, "图片压缩出错了。。。。" + "  fileName=" + entity.getFileName()
                        +" fileId="+entity.getFileKey());
                return;
            }
            entity.setCompressImageUrl(resultFile);
        }

        HttpUtils.upLoadFile(entity, getRequestBuilder(), new HttpUtils.HttpRequestCallBack() {
            @Override
            public void onFailure(Request request, Exception e) {
                if (null != jsCallback) {
                    jsCallback.invokeAndKeepAlive(WXEventResult.getFailureResult("服务器异常，请稍后再试！  fileName="
                            +entity.getFileName() +" fileId="+entity.getFileKey()));
                }
                if (null != uploadCallback) {
                    uploadCallback.httpFailure(entity, "服务器异常，请稍后再试！  fileName="+entity.getFileName()
                            +" fileId="+entity.getFileKey());
                }
                //更改数据库上传图片的状态
                FileUtils.updateUploadImageStatus(entity, 1);

                LogManager.errorLog(TAG, "上传到影像服务器失败    fileName="+entity.getFileName() +" fileId="+entity.getFileKey()
                        +"   " + e.getLocalizedMessage());

            }

            @Override
            public void onSuccess(Response response) {
                try {
                    String bodyString = response.body().string();
                    LogManager.infoLog(TAG, "上传影像服务器结果：" + bodyString+"   fileName="+entity.getFileName()
                            +" fileId="+entity.getFileKey());
                    JSONObject resultBody = JSONObject.parseObject(bodyString);
                    String retCode = resultBody.getString("retCode");
                    String fileKey = null;
                    if (null != retCode && retCode.equals("1")) {
                        JSONObject resultData = resultBody.getJSONObject("data");
                        fileKey = resultData.getString("fileKey");
                        String suffix = resultData.getString("suffix");
                        String fileSize = resultData.getString("contentLength");
                        entity.setSuffix(suffix);
                        entity.setFileSize(fileSize);

                        LogManager.infoLog(TAG, "上传到影像服务器成功 ==" + resultBody.toJSONString() + "  fileName="
                                + entity.getFileName() +" fileId="+entity.getFileKey());

                        String authKey = UrlAuth.getUrlSign(fileKey, Constants.getImageOffsetDays(), Constants.getImageAuthKey());
                        String url = Constants.getImageBaseUrl() + HttpApi.IMAGE_VIEW_URL + "/" + fileKey + "?authKey=" + authKey
                                + "&systemCode=" + Constants.getImageSystemCode();

                        entity.setAuthUrl(url);

                        LogManager.infoLog(TAG, authKey + " 生成的认证URL ==" + url);

                    } else if (null != retCode && retCode.equals("0")) { //失败
                        if (null != jsCallback) {
                            jsCallback.invokeAndKeepAlive(WXEventResult.getFailureResult(resultBody.getString("retMsg")));
                        }
                        if (null != uploadCallback) {
                            uploadCallback.httpFailure(entity, resultBody.getString("retMsg"));
                        }
                        LogManager.errorLog(TAG, "上传到影像服务器失败！！！ ==" + resultBody.getString("retMsg")
                                + "  fileName=" + entity.getFileName() +" fileId="+entity.getFileKey());
                        //更改数据库上传图片的状态
                        FileUtils.updateUploadImageStatus(entity, 1);
                        return;
                    }
//                    //删除压缩文件的图片和
//                    if(null != entity.getCompressImageUrl() && new File(entity.getCompressImageUrl()).exists()){
//                        new File(entity.getCompressImageUrl()).delete();
//                        FileUtils.updateFileFromDatabase(WXApplication.mAppInstance,new File(entity.getCompressImageUrl()));
//                    }

                    entity.setFileKey(fileKey);
                    if (isUploadBPMS) {
                        uploadBMPS(entity, jsCallback);
                    } else {
                        //更改数据库上传图片的状态
                        FileUtils.updateUploadImageStatus(entity, 0);

                        LogManager.errorLog(TAG, "此次上传不需要上传到业务系统  fileName="+entity.getFileName()
                                +" fileId="+entity.getFileKey());
                        if (null != uploadCallback) {
                            uploadCallback.httpSuccess(entity);
                        }
                    }


                } catch (Throwable e) {
                    e.printStackTrace();

                    if (null != uploadCallback) {
                        uploadCallback.httpFailure(entity, "系统异常  fileName="+entity.getFileName()
                                +" fileId="+entity.getFileKey());
                    }

                    //更改数据库上传图片的状态
                    FileUtils.updateUploadImageStatus(entity, 1);
                }
            }
        });
    }

    public static void uploadBMPS(final FileEntity entity, final JSCallback jsCallback) {
        String pbmsUrl = Constants.getBpmsBaseUrl(HttpApi.BPMS_UPLOAD_IMAGE_URL);

        JSONArray materialList = new JSONArray();

        JSONObject item = null;
        if (null != entity.getFileKeys() && entity.getFileKeys().length > 0) {

            for (int i = 0; i < entity.getFileKeys().length; i++) {
                item = new JSONObject();
                item.put("materialType", entity.getFileType());
                item.put("fileId", entity.getFileKeys()[i]);
                item.put("flieSuffix", entity.getSuffix());
                item.put("applyNo", entity.getApplyNo());
                item.put("fileType", "image");
                item.put("fileSize", entity.getFileSize());
                item.put("sortNo", entity.getSortNo());

                if (null != entity.getCustomerNo() && !entity.getCustomerNo().equals("")) {
                    item.put("customerNo", entity.getCustomerNo());
                }
                if (null != entity.getCustCertID() && !entity.getCustCertID().equals("")) {
                    item.put("custCertID", entity.getCustCertID());
                }

                materialList.add(i, item);
            }
        } else {
            item = new JSONObject();
            item.put("materialType", entity.getFileType());
            item.put("fileId", entity.getFileKey());
            item.put("flieSuffix", entity.getSuffix());
            item.put("applyNo", entity.getApplyNo());
            item.put("fileType", "image");
            item.put("fileSize", entity.getFileSize());
            item.put("sortNo", entity.getSortNo());

            if (null != entity.getCustomerNo() && !entity.getCustomerNo().equals("")) {
                item.put("customerNo", entity.getCustomerNo());
            }
            if (null != entity.getCustCertID() && !entity.getCustCertID().equals("")) {
                item.put("custCertID", entity.getCustCertID());
            }

            materialList.add(0, item);

        }


        HttpUtils.httpPostRequest(pbmsUrl, materialList, null, new HttpUtils.HttpRequestCallBack() {
            @Override
            public void onFailure(Request request, Exception e) {
                if (null != jsCallback) {
                    jsCallback.invokeAndKeepAlive(WXEventResult.getFailureResult("调用业务系统图片上传接口失败  fileName="
                            +entity.getFileName()+" fileId="+entity.getFileKey()));
                }
                LogManager.errorLog(TAG, "调用业务系统图片上传接口失败！！！ ==  fileName="+entity.getFileName()
                        +" fileId="+entity.getFileKey() +"   ===" + e.getMessage());
                //更改数据库上传图片的状态
                FileUtils.updateUploadImageStatus(entity, 1);
            }

            @Override
            public void onSuccess(Response response) {
                try {
                    String bodyString = response.body().string();
                    org.json.JSONObject resultObject = new org.json.JSONObject(bodyString);
                    LogManager.infoLog(TAG, "图片上传到业务系统结果：" + bodyString + "  fileName=" + entity.getFileName()
                            +" fileId="+entity.getFileKey());
                    if (null == resultObject || null == resultObject.getString("code") || !resultObject.getString("code").equals("200")) {
                        if (null != jsCallback) {
                            jsCallback.invokeAndKeepAlive(WXEventResult.getFailureResult(resultObject.getString("msg"),
                                    resultObject.getString("code")));
                        }
                        //更改数据库上传图片的状态
                        FileUtils.updateUploadImageStatus(entity, 1);
                        return;
                    }

                    //更改数据库上传图片的状态
                    FileUtils.updateUploadImageStatus(entity, 0);

                    if (null != jsCallback) {
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
                        if (null != jsCallback) {
                            jsCallback.invokeAndKeepAlive(WXEventResult.getResult(data.toJSONString()));
                        }
                    }


                } catch (Exception e) {
                    ExceptionGlobalHandler.showException(TAG, e);
                    //更改数据库上传图片的状态
                    FileUtils.updateUploadImageStatus(entity, 1);
                }
            }
        });
    }


    /**
     * @param fileKeys
     * @param imageType  图片类型：0大图，1小图
     * @param jsCallback
     */
    public static void getImageUrls(String[] fileKeys, String imageType, final JSCallback jsCallback) {
        if (null == fileKeys && fileKeys.length == 0) {
            return;
        }

        JSONObject data = new JSONObject();
        for (String fileKey : fileKeys) {
            data.put(fileKey, getImageUrl(fileKey, imageType, null));
        }
        if (null != jsCallback) {
            jsCallback.invokeAndKeepAlive(WXEventResult.getResult(data.toJSONString()));
        }
    }

    /**
     * @param fileKey
     * @param imageType  图片类型：0大图，1小图
     * @param jsCallback
     */
    public static String getImageUrl(String fileKey, String imageType, final JSCallback jsCallback) {
        if (null == fileKey) {
            return null;
        }

        JSONObject data = new JSONObject();
        String authKey = UrlAuth.getUrlSign(fileKey, Constants.getImageOffsetDays(), Constants.getImageAuthKey());
        String url = Constants.getImageBaseUrl() + HttpApi.IMAGE_VIEW_URL + "/" + fileKey + "?authKey=" + authKey
                + "&systemCode=" + Constants.getImageSystemCode() + "&version=" + imageType;
        data.put(fileKey, url);
        if (null != jsCallback) {
            jsCallback.invokeAndKeepAlive(WXEventResult.getResult(data.toJSONString()));
        }
        return url;
    }

    /**
     * 删除图片
     *
     * @param fileKey
     * @param jsCallback
     */
    public static void imageDelete(final String applyNo, final String fileKey, final JSCallback jsCallback,
                                   final ImageHttpCallback imageHttpCallback) {


        String url = Constants.getBpmsBaseUrl(HttpApi.BPMS_DELETE_IMAGE_URL);
        JSONObject body = new JSONObject();
        body.put("applyNo", applyNo);
        body.put("fileIdList", new String[]{fileKey});

        HttpUtils.httpPostRequest(url, body, null, new HttpUtils.HttpRequestCallBack() {
            @Override
            public void onFailure(Request request, Exception e) {
                if (null != jsCallback) {
                    jsCallback.invokeAndKeepAlive(WXEventResult.getFailureResult(e.getMessage()));
                }
                if (null != imageHttpCallback) {
                    imageHttpCallback.httpFailure(null, "系统异常！");
                }
            }

            @Override
            public void onSuccess(Response response) {
                try {
                    String bodyString = response.body().string();
                    JSONObject resultBody = JSONObject.parseObject(bodyString);
                    String code = resultBody.getString("code");
                    LogManager.infoLog(TAG, "业务系统删除图片结果==" + resultBody.toJSONString());

                    if (null != code && code.equals("200")) {
                        JSONObject object = new JSONObject();
                        object.put("fileKey", fileKey);
                        if (null != jsCallback) {
                            jsCallback.invokeAndKeepAlive(WXEventResult.getResult(object.toJSONString()));
                        }
                        if (null != imageHttpCallback) {
                            imageHttpCallback.httpSuccess(null);
                        }
                    } else {
                        JSONObject object = new JSONObject();
                        object.put("fileKey", fileKey);
                        if (null != jsCallback) {
                            jsCallback.invokeAndKeepAlive(WXEventResult.getFailureResult(resultBody.getString("msg")));
                        }
                        if (null != imageHttpCallback) {
                            imageHttpCallback.httpFailure(null, resultBody.getString("msg"));
                        }
                    }

                } catch (Exception e) {
                    ExceptionGlobalHandler.showException(TAG, e);
                }

            }
        });
    }

    /**
     * 图片解析
     *
     * @param type     1 身份证；0 银行
     * @param fileUrl
     * @param fileName
     * @param callBack
     */
    public static void analysisInfo(int type, String fileUrl, String fileName, HttpUtils.HttpRequestCallBack callBack) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("filePath", fileUrl);
        jsonObject.put("fileName", fileName);

        String url = null;
        if (type == 1) {
            url = Constants.getBpmsBaseUrl(HttpApi.IMAGE_ID_CARD_URL);
            LogManager.infoLog(TAG, "身份证识别请求url=" + url + "  fileName=" + fileName + "  filePath=" + fileUrl);
        } else if (type == 0) {
            url = Constants.getBpmsBaseUrl(HttpApi.IMAGE_BANK_CRAD_URL);
            LogManager.infoLog(TAG, "银行卡识别请求url=" + url + "  fileName=" + fileName + "  filePath=" + fileUrl);
        }

        HttpUtils.httpPostRequest(url, jsonObject, null, callBack);
    }

    /**
     * 旋转图片
     *
     * @param fileKey
     * @param rotate
     * @param callBack
     */
    public static void imageRotate(String fileKey, String rotate, HttpUtils.HttpRequestCallBack callBack) {
        LogManager.infoLog(TAG, "影像系统旋转图片开始=======fileKey=" + fileKey + "   rotate=" + rotate);

        String url = Constants.getImageEnvironmentalUrl() + HttpApi.IMAGE_ROTATE_SAVE + "/"
                +fileKey+"?rotate="+rotate;
        HttpUtils.httpPostRequest(url, null, getRequestBuilder(), callBack);
    }

    /**
     * 业务系统-旋转图片保存
     *
     * @param oldFileKey
     * @param newFileInfo
     * @param callBack
     */
    public static void bpmsImageRotateSave(String oldFileKey,String newFileInfo,HttpUtils.HttpRequestCallBack callBack) throws JSONException {
        LogManager.infoLog(TAG,"业务系统-旋转图片保存 开始");
        String url = Constants.getBpmsBaseUrl(HttpApi.BPMS_IMAGE_ROTATE_SAVE);

        org.json.JSONObject imageBody = new org.json.JSONObject(newFileInfo);


        JSONObject body = new JSONObject();
        body.put("originalFileId", oldFileKey);
        body.put("newFileId", imageBody.getString("fileKey"));
        body.put("newFileSuffix", imageBody.getString("suffix"));
        body.put("newFileSize", imageBody.getString("contentLength"));
        body.put("newFileType", imageBody.getString("fileType"));

        HttpUtils.httpPostRequest(url,body,null,callBack);
    }

    /**
     * 影像系统-文件拷贝fileId获取
     * @param beforeFileId
     */
    public static void eisImageCopy(String beforeFileId, HttpUtils.HttpRequestCallBack callBack){
        String url = Constants.getImageEnvironmentalUrl() + HttpApi.EIS_IMAGE_COPY_GET_FILEKEY + "/"
                +beforeFileId;
        HttpUtils.httpPostRequest(url, null, getRequestBuilder(), callBack);
    }


    /**
     * 业务系统-文件拷贝
     *
     * @param typeNo
     * @param beforeFileId
     * @param currentFileId
     * @param callBack
     */
    public static void bpmsImageCopy(String typeNo,String targetCustomerNo,String beforeFileId,String currentFileId,
                                     HttpUtils.HttpRequestCallBack callBack){
        String url = Constants.getBpmsBaseUrl(HttpApi.BPMS_IMAGE_COPY);
        JSONObject body = new JSONObject();
        body.put("targetTypeNo", typeNo);
        body.put("originFileId", beforeFileId);
        body.put("genFileId", currentFileId);
        if(null!=targetCustomerNo){
            body.put("targetCustomerNo",targetCustomerNo);
        }
        HttpUtils.httpPostRequest(url, body, null, callBack);
    }

    /**
     * 图片上传 http请求头
     *
     * @return
     */
    private static Request.Builder getRequestBuilder() {
        Request.Builder builder = new Request.Builder();
        builder.addHeader(Constants.IMAGE_EIS_SYSTEM_KEY_PARAM, Constants.getImageSystemKey());
        builder.addHeader(Constants.IMAGE_EIS_SYSTEM_CODE_PARAM, Constants.getImageSystemCode());
        return builder;
    }

    /**
     * 图片http 请求回调
     */
    public interface ImageHttpCallback {
        void httpSuccess(FileEntity entity);

        void httpFailure(FileEntity entity, String errorMsg);
    }


}

