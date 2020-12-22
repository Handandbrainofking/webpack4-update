package com.ddjf.interview.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.widget.ImageView;
import android.widget.Toast;

import com.alibaba.fastjson.JSONObject;
import com.ddjf.interview.WXApplication;
import com.ddjf.interview.database.entity.FileEntity;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.http.HttpUtils;
import com.ddjf.interview.http.ImageHandler;
import com.ddjf.interview.log_manager.LogManager;
import com.luck.picture.lib.receiver.PictureSelectorReceiver;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

/**
 * Created by yejunrong on 18/7/12.
 * picture_library 广播接受
 */

public class PictureLibraryReceiver extends BroadcastReceiver {
    String TAG = "PictureLibraryReceiver";
    ReceiverHandler msgHandler;

    private static class ReceiverHandler extends Handler{
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.arg1) {
                case 0:
                    Bundle data = msg.getData();
                    Toast.makeText(WXApplication.mAppInstance, data.getString("msg"), Toast.LENGTH_LONG).show();
                    break;
                default:
                    break;
            }
        }
    }

    @Override
    public void onReceive(final Context context, Intent intent) {
        Bundle bundle = intent.getExtras();
        msgHandler = new ReceiverHandler();

        int type = bundle.getInt(PictureSelectorReceiver.PICTURE_SELECT_RECEIVER_TYPE, -1);
        String applyNo = bundle.getString(PictureSelectorReceiver.PICTURE_SELECT_RECEIVER_APPLY_NO);
        final String fileKey = bundle.getString(PictureSelectorReceiver.PICTURE_SELECT_RECEIVER_FILE_KEY);
        LogManager.infoLog(TAG, " 接受到图片预览组件的广播=== applyNo=" + applyNo + "  fileKey=" + fileKey);

        if (type == PictureSelectorReceiver.PICTURE_SELECT_RECEIVER_TYPE_DELETE) {
            // 删除图片
            ImageHandler.imageDelete(applyNo, fileKey, null, new ImageHandler.ImageHttpCallback() {
                @Override
                public void httpSuccess(FileEntity entity) {
                    Bundle data = new Bundle();
                    data.putString("msg", "图片删除成功");
                    Message msg = msgHandler.obtainMessage();
                    msg.arg1 = 0;
                    msg.setData(data);
                    msgHandler.sendMessage(msg);
                }

                @Override
                public void httpFailure(FileEntity entity, String errorMsg) {
                    Bundle data = new Bundle();
                    data.putString("msg", null == errorMsg ? "图片删除失败，请稍后再试！" : errorMsg);
                    Message msg = msgHandler.obtainMessage();
                    msg.arg1 = 0;
                    msg.setData(data);
                    msgHandler.sendMessage(msg);
                }
            });
        } else if (type == PictureSelectorReceiver.PICTURE_SELECT_RECEIVER_TYPE_ROTATE) {
            //旋转后 保存图片
            String rotate = bundle.getString(PictureSelectorReceiver.PICTURE_SELECT_RECEIVER_ROTATE);

            ImageHandler.imageRotate(fileKey, rotate, new HttpUtils.HttpRequestCallBack() {
                @Override
                public void onFailure(Request request, Exception e) {
                    Bundle data = new Bundle();
                    data.putString("msg", "图片保存失败，请稍后再试！");
                    Message msg = msgHandler.obtainMessage();
                    msg.arg1 = 0;
                    msg.setData(data);
                    msgHandler.sendMessage(msg);
                }

                @Override
                public void onSuccess(Response response) {
                    try {

                        String bodyString = response.body().string();
                        LogManager.infoLog(TAG, "影像系统旋转图片保存结果：" + bodyString);
                        JSONObject resultBody = JSONObject.parseObject(bodyString);
                        String retCode = resultBody.getString("retCode");
                        String retMsg = resultBody.getString("retMsg");
                        String resultData = resultBody.getString("data");
                        Bundle data = new Bundle();

                        if (null == retCode || !retCode.equals("1")) {
                            data.putString("msg", retMsg != null ? retMsg : "图片保存失败");
                            Message msg = msgHandler.obtainMessage();
                            msg.arg1 = 0;
                            msg.setData(data);
                            msgHandler.sendMessage(msg);
                            return;
                        }

                        ImageHandler.bpmsImageRotateSave(fileKey, resultData, new HttpUtils.HttpRequestCallBack() {
                            @Override
                            public void onFailure(Request request, Exception e) {
                                LogManager.errorLog(TAG, "业务系统-旋转图片保存失败！" + e.getMessage());
                            }

                            @Override
                            public void onSuccess(Response response) {
                                try {
                                    String bodyString = response.body().string();
                                    LogManager.infoLog(TAG, "业务系统-旋转图片保存结果：" + bodyString);
                                    JSONObject resultBody = JSONObject.parseObject(bodyString);
                                    String retCode = resultBody.getString("code");
                                    String retMsg = resultBody.getString("msg");
                                    boolean success = resultBody.getBoolean("success");
                                    Bundle data = new Bundle();

                                    if (null != retCode && retCode.equals("200") && success) {
                                        data.putString("msg", "图片保存成功");
                                        Message msg = msgHandler.obtainMessage();
                                        msg.arg1 = 0;
                                        msg.setData(data);
                                        msgHandler.sendMessage(msg);
                                    } else {
                                        data.putString("msg", retMsg == null ? "图片保存失败" : retMsg);
                                    }
                                } catch (Exception e) {
                                    LogManager.infoLog(TAG,e.getMessage());
                                }
                            }
                        });


                    } catch (Exception e) {
                        ExceptionGlobalHandler.showException(TAG, e);
                    }
                }
            });
        }

    }


}
