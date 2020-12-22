package com.ddjf.interview.js_interactive_native.module;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.location.LocationManager;
import android.media.AudioManager;
import android.net.Uri;
import android.os.Vibrator;
import android.provider.Settings;
import android.text.TextUtils;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.Toast;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.ddjf.interview.R;
import com.ddjf.interview.WXApplication;

import com.ddjf.interview.activity.BaseActivity;
import com.ddjf.interview.activity.SplashActivity;
import com.ddjf.interview.activity.WXPageActivity;
import com.ddjf.interview.database.DatabaseUtils;
import com.ddjf.interview.database.entity.SystemDictEntity;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.global.ThreadPoolManager;
import com.ddjf.interview.http.HttpForJSHandler;
import com.ddjf.interview.http.HttpSystemProperty;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.FileUtils;
import com.ddjf.interview.util.MemoryUtils;
import com.ddjf.interview.util.SharedPreferenceUtil;
import com.ddjf.interview.util.SystemUtils;
import com.ddjf.interview.views.CustomAlertDialog;
import com.ddjf.interview.views.CustomDialog;
import com.huawei.android.hms.agent.HMSAgent;
import com.huawei.android.hms.agent.push.handler.GetTokenHandler;
import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.bridge.JSCallback;
import com.taobao.weex.common.WXModule;

import org.json.JSONObject;
import org.w3c.dom.Text;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

/***
 * 接收 js的请求。公共部分
 *
 * 需要WXApplication进行注册
 */

public class WXEventCommon extends WXModule {
    String TAG = "WXEventCommon";


    @JSMethod
    public void openURL(String url) {
        if (TextUtils.isEmpty(url)) {
            return;
        }
        Uri uri = Uri.parse(url);
        String scheme = uri.getScheme();

        if (scheme.equals("http") || scheme.equals("https") || scheme.equals("file")) {
            Intent renderIntent = new Intent(mWXSDKInstance.getContext(), WXPageActivity.class);
            renderIntent.setData(uri);
            mWXSDKInstance.getContext().startActivity(renderIntent);
        } else {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(uri);
            mWXSDKInstance.getContext().startActivity(intent);
        }
    }

    @JSMethod(uiThread = false)
    public void jsLogOut(String msg,String level) {
        if(null != level && level.equals("error")){
            LogManager.errorLog("接收来自js的日志输出",msg);
            return;
        }else if(null != level && level.equals("info")){
            LogManager.infoLog("接收来自js的日志输出",msg);
            return;
        }
        LogManager.debugLog("接收来自js的日志输出", " msg===" + msg);
    }

    /**
     * 获取多个字典
     *
     * @param types
     * @param callback
     */
    @JSMethod(uiThread = false)
    public void getDicArr(String[] types, JSCallback callback) {
        try {
            String sqlTypes = "";
            List<String> typeArray = new ArrayList<>();
            for (String type : types) {
                if (sqlTypes.length() > 0) {
                    sqlTypes = sqlTypes + "," + "'" + type + "'";
                } else {
                    sqlTypes = "'" + type + "'";
                }
                typeArray.add(type);
            }

            String sql = " type in(" + sqlTypes + ")";
            List<SystemDictEntity> list = DatabaseUtils.query(SystemDictEntity.class, sql, null);
            JSONArray result = new JSONArray();
            JSONObject jsonObject = new JSONObject();
            for (SystemDictEntity item : list) {
                jsonObject.put("value", item.getValue());
                jsonObject.put("type", item.getType());
                jsonObject.put("typeDesc", item.getTypeDesc());
                jsonObject.put("label", item.getLabel());
                jsonObject.put("status", item.getStatus());
                jsonObject.put("sort", item.getSort());
                result.add(jsonObject.toString());

                typeArray.remove(item.getType());
            }
            LogManager.infoLog(TAG,"getDicArr 1 ");

            //说明数据库里面没有找全字典
            for (String type : typeArray) {
                LogManager.infoLog(TAG,type+" 在数据库中没有获取到数据，则去缓存里面获取");
                JSONArray cacheDicArr = getCacheDic(type);
                for(int i=0;null != cacheDicArr && i < cacheDicArr.size();i++){
                    JSONObject oj = new JSONObject((String) cacheDicArr.get(i));
                    result.add(oj.toString());
                }
            }
            LogManager.infoLog(TAG,"getDicArr 2 ");

            if (null != callback) {
                callback.invokeAndKeepAlive(WXEventResult.getResult(result.toJSONString()));
            }
        } catch (Exception e) {

            LogManager.infoLog(TAG,"getDicArr 3 ");
            e.printStackTrace();
            if (null != callback) {
                callback.invokeAndKeepAlive(WXEventResult.getResult(null));
            }
        }
    }

    /**
     * 获取字典
     *
     * @param type
     * @param value
     * @param callback
     */
    @JSMethod(uiThread = false)
    public void getDic(String type, String value, JSCallback callback) {
        try {

            String sql = "";
            String[] sqlParam = null;

            if (type != null) {
                sql = " type=?";
            }
            if (value != null && value.length() > 1 && type.length() > 1) {
                sql = sql + " and value=?";
                sqlParam = new String[]{type, value};
            } else if (value != null && value.length() > 1 && type.length() == 0) {
                sql = " value=?";
                sqlParam = new String[]{value};
            } else if ((value == null || value.length() == 0) && type.length() > 0) {
                sqlParam = new String[]{type};
            }
            if (sql.length() == 0) {
                LogManager.infoLog(TAG, "获取字典出错,没有传入参数（type 和 value） ");
                return;
            }
            List<SystemDictEntity> list = DatabaseUtils.query(SystemDictEntity.class, sql, sqlParam);
            JSONArray result = new JSONArray();
            JSONObject jsonObject = new JSONObject();
            for (SystemDictEntity item : list) {
                jsonObject.put("value", item.getValue());
                jsonObject.put("type", item.getType());
                jsonObject.put("typeDesc", item.getTypeDesc());
                jsonObject.put("label", item.getLabel());
                jsonObject.put("status", item.getStatus());
                jsonObject.put("sort", item.getSort());
                result.add(jsonObject.toString());

            }
            if (null != callback) {
                callback.invokeAndKeepAlive(WXEventResult.getResult(result.toJSONString()));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 从缓存中获取字典
     *
     * @param type
     * @param callback
     */
    @JSMethod(uiThread = false)
    public void getDicCache(String type, JSCallback callback) {

        LogManager.infoLog(TAG, " 获取缓存字典开始== type=" + type);

        if (null != callback) {
            JSONArray jsonArray = getCacheDic(type);
            if(null == jsonArray || jsonArray.size()==0){
                callback.invokeAndKeepAlive(WXEventResult.getFailureResult("字典获取失败。。"));
                return;
            }
            callback.invokeAndKeepAlive(WXEventResult.getResult(jsonArray.toJSONString()));
        }


    }

    private JSONArray getCacheDic(String type) {
        JSONArray result = new JSONArray();
        try {
            String cacheDic = null;
            String dics = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.SYSTEM_DIC_CACHE);

            if (null == dics || dics.length() == 0) {
                LogManager.infoLog(TAG, "SharedPreference缓存里面没有字典信息");

                if(! new File(FileUtils.SystemDicFilePath + File.separator
                        + FileUtils.SystemDicFileName).exists()){
                    LogManager.infoLog(TAG, "如果sd卡目录没有对应的字典缓存文件，则从assets里面拷贝过来");
                    cacheDic = FileUtils.readAssetsFile(FileUtils.SystemDicFileName,"config");

                }else{
                    cacheDic = FileUtils.readFile(FileUtils.SystemDicFileName, FileUtils.SystemDicFilePath);
                }

                if (null == cacheDic || cacheDic.length() == 0) {
                    LogManager.infoLog(TAG, "字典缓存文件也没有数据。。。");
                    return null;
                }

                SharedPreferenceUtil.setData(SharedPreferenceUtil.SYSTEM_DIC_CACHE, cacheDic);

            } else {
                cacheDic = dics;
            }
            JSONObject cacheObject = new JSONObject(cacheDic);
            JSONObject jsonObject = new JSONObject();

            org.json.JSONArray array = cacheObject.getJSONArray("result");
            for (int i = 0; i < array.length(); i++) {
                JSONObject item = array.getJSONObject(i);
                String cacheType = (String) item.get("type");
                if (type.equals(cacheType)) {
                    jsonObject.put("value", (String) item.get("value"));
                    jsonObject.put("type", (String) item.get("type"));
                    jsonObject.put("typeDesc", (String) item.get("typeDesc"));
                    jsonObject.put("label", (String) item.get("label"));
                    jsonObject.put("status", (String) item.get("status"));
                    jsonObject.put("sort", (int) item.get("sort"));
                    result.add(jsonObject.toString());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            ExceptionGlobalHandler.showException("缓存获取字典失败", e);
        }
        return result;
    }

    @JSMethod(uiThread = true)
    public void tostMsg(String msg) {
        Toast.makeText(WXApplication.mAppInstance, msg, Toast.LENGTH_LONG).show();
    }


    @JSMethod(uiThread = true)
    public void showDialog(Boolean isCancelable) {
        try {

            if (null == WXApplication.mProgressDialog) {
                WXApplication.mProgressDialog = new CustomDialog(mWXSDKInstance.getContext(), R.style.CustomDialog,
                        null == isCancelable ? true : isCancelable);

            } else {
                WXApplication.mProgressDialog.dismiss();
                WXApplication.mProgressDialog = null;
                WXApplication.mProgressDialog = new CustomDialog(mWXSDKInstance.getContext(), R.style.CustomDialog,
                        null == isCancelable ? true : isCancelable);

            }

            WXApplication.mProgressDialog.show();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @JSMethod(uiThread = true)
    public void dismissDialog() {
        try {
            if (null != WXApplication.mProgressDialog && WXApplication.mProgressDialog.isShowing()) {
                WXApplication.mProgressDialog.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @JSMethod(uiThread = false)
    public void clearMemory() {
        try {

            double beforMemory = MemoryUtils.totalMemory();
            LogManager.infoLog(TAG, "内存清除前=== 当前内存占用=" + MemoryUtils.totalMemory());
            MemoryUtils.tryForceGC();
            double afterMemory = MemoryUtils.totalMemory();
            LogManager.infoLog(TAG, "内存清除后=== 当前内存占用=" + MemoryUtils.totalMemory());
            double clearMemory = (beforMemory - afterMemory);

            Toast.makeText(WXApplication.mAppInstance, "清除了" + String.format("%.2f", clearMemory)
                    + "M的内存", Toast.LENGTH_LONG).show();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @JSMethod
    public void jumpPage(String path) {
        try {

//            Intent intent = new Intent(Intent.ACTION_VIEW);
//            intent.addCategory(Intent.CATEGORY_DEFAULT);
//            intent.addCategory("com.ddjf_interview.android.intent.category.WEEX");
            BaseActivity activity = (BaseActivity) mWXSDKInstance.getContext();
            activity.jumpPage(path);
//            intent.setData(Uri.parse(path));
//            activity.startActivity(intent);
//            activity.finish();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @JSMethod
    public void backPage() {

    }

    @JSMethod
    public void timeOut(final JSCallback callback, long time) {
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                if (null != callback) {
                    callback.invokeAndKeepAlive(null);
                }
            }
        }, time);

    }

    @JSMethod(uiThread = false)
    public void againGetToken(JSCallback callback) {

        final Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                //申请token，通过广播(HuawePushRevicer.onToken)后获取token
                HMSAgent.Push.getToken(new GetTokenHandler() {
                    @Override
                    public void onResult(int rtnCode) {
                        LogManager.infoLog(TAG, "20秒后获取华为消息获取token结果=" + rtnCode);
                    }
                });


                timer.schedule(new TimerTask() {
                    @Override
                    public void run() {
                        LogManager.infoLog(TAG, "10秒后去更新设备信息");

                        WXEventModule.uploadRecord();
                    }
                }, 1000 * 10);

            }
        }, 1000 * 20);

    }

    //获取经纬度位置
    @JSMethod(uiThread = true)
    public void getLocation(JSCallback callback) {
        try {
            if (!SystemUtils.checkLocationStatus()) {

                if (null != callback) {
                    callback.invokeAndKeepAlive(WXEventResult.getFailureResult("地理位置获取失败！"));
                }
                return;
            }

            if (null == WXApplication.mBaiduLocationUtils.mBDLocation) {

                if (null != callback) {
                    callback.invokeAndKeepAlive(WXEventResult.getFailureResult("地理位置获取失败！"));
                }
                return;
            }

            JSONObject result = new JSONObject();
            if (null != WXApplication.mBaiduLocationUtils && null != WXApplication.mBaiduLocationUtils.mBDLocation) {

                result.put("longitude", WXApplication.mBaiduLocationUtils.mBDLocation.getLongitude());
                result.put("latitude", WXApplication.mBaiduLocationUtils.mBDLocation.getLatitude());
                result.put("address", WXApplication.mBaiduLocationUtils.mBDLocation.getAddress().address);

            } else {
                if (null != callback) {
                    callback.invokeAndKeepAlive(WXEventResult.getFailureResult("地理位置获取失败！"));
                }
                return;
            }
            if (null != callback) {
                callback.invokeAndKeepAlive(WXEventResult.getResult(result.toString()));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //设备震动
    @JSMethod(uiThread = false)
    public void devicesVibrator() {
        AudioManager manager = (AudioManager) WXApplication.mAppInstance.getSystemService(Context.AUDIO_SERVICE);
        if (manager.getRingerMode() != AudioManager.RINGER_MODE_SILENT) {
            Vibrator vibrator = (Vibrator) WXApplication.mAppInstance.getSystemService(Context.VIBRATOR_SERVICE);
            vibrator.vibrate(1000);
        }
    }

    //网络请求
    @JSMethod(uiThread = false)
    public void networkRequest(final String url, final String param, final JSCallback callback) {

        ThreadPoolManager.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                new HttpForJSHandler(url, param, callback);
            }
        });

    }

    //拷贝 内容
    @JSMethod(uiThread = true)
    public void copyContent(String label, String content, JSCallback callback) {
        if (TextUtils.isEmpty(content)) {
            Toast.makeText(WXApplication.mAppInstance, "拷贝内容不能为空！", Toast.LENGTH_LONG).show();
            return;
        }
        ClipboardManager clipboard = (ClipboardManager) WXApplication.mAppInstance.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText(label, content);
        clipboard.setPrimaryClip(clip);

        if (null != callback) {
            callback.invoke(WXEventResult.getResult(label + "拷贝成功！"));
        }
    }

    /**
     * 隐藏键盘
     */
    @JSMethod
    public void hiddenKeyborad() {

        InputMethodManager imm = (InputMethodManager) mWXSDKInstance.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);

        imm.hideSoftInputFromWindow(mWXSDKInstance.getRootView().getWindowToken(), 0);
        imm.hideSoftInputFromWindow(mWXSDKInstance.getContainerView().getWindowToken(), 0);

    }

}
