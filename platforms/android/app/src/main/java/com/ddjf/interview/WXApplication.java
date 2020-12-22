package com.ddjf.interview;

import android.app.Application;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.os.Build;
import android.os.StrictMode;

import com.aliyun.sls.android.sdk.SLSDatabaseManager;
import com.ddjf.interview.database.DatabaseUtils;
import com.ddjf.interview.exception.AppException;
import com.ddjf.interview.extend.ImageAdapter;
import com.ddjf.interview.js_interactive_native.component.DDWebviewComponent;
import com.ddjf.interview.js_interactive_native.module.WXEventCommon;
import com.alibaba.weex.plugin.loader.WeexPluginContainer;
import com.ddjf.interview.js_interactive_native.module.WXEventModule;
import com.ddjf.interview.log_manager.ALiLogManager;
import com.ddjf.interview.plugins.ImageLoaderUtils;
import com.ddjf.interview.receiver.HuaweiPushRevicer;
import com.ddjf.interview.receiver.KeyDownBroadcastReceiver;
import com.ddjf.interview.receiver.NetworkStatusBroadcastReceiver;
import com.ddjf.interview.receiver.PictureLibraryReceiver;
import com.ddjf.interview.util.AppConfig;
import com.ddjf.interview.util.BaiduLocationUtils;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.FileUtils;
import com.ddjf.interview.util.PermissionManager;
import com.ddjf.interview.util.SystemUtils;
import com.ddjf.interview.util.msg.HWPushHandler;
import com.huawei.android.hms.agent.HMSAgent;
import com.huawei.android.hms.agent.push.handler.DeleteTokenHandler;
import com.huawei.android.hms.agent.push.handler.EnableReceiveNormalMsgHandler;
import com.huawei.android.hms.agent.push.handler.EnableReceiveNotifyMsgHandler;
import com.huawei.android.hms.agent.push.handler.GetPushStateHandler;
import com.luck.picture.lib.receiver.PictureSelectorReceiver;
import com.taobao.weex.InitConfig;
import com.taobao.weex.WXEnvironment;
import com.taobao.weex.WXSDKEngine;
import com.taobao.weex.common.WXException;

import java.io.File;

public class WXApplication extends Application implements HuaweiPushRevicer.IPushCallback {
    public static Application mAppInstance;
    static String TAG = "WXApplication";
    public static DatabaseUtils mDatabaseUtils;
    public static ProgressDialog mProgressDialog;
    private KeyDownBroadcastReceiver mKeyDownBroadcastReceiver;
    private NetworkStatusBroadcastReceiver mNetStatusBroadcast;
    public static String mHWPushToken;//华为push token
    public static BaiduLocationUtils mBaiduLocationUtils;//百度定位
    public static int startActivityAnimId = R.anim.slide_in_right;

    @Override
    public void onCreate() {
        super.onCreate();

        mAppInstance = this;
        //全局异常处理
        AppException.getInstance().init();

        ImageLoaderUtils.initImageLoader(this);
        InitConfig config = new InitConfig.Builder().setImgAdapter(new ImageAdapter(getApplicationContext())).build();
        WXSDKEngine.initialize(this, config);

        try {
            //注册接收js请求的model
            WXSDKEngine.registerModule("eventModule", WXEventModule.class);
            WXSDKEngine.registerModule("eventCommon", WXEventCommon.class);
            boolean result = WXSDKEngine.registerComponent("ddWeb", DDWebviewComponent.class,false);
            LogManager.infoLog(TAG,"ddWeb的注册结果=="+result);

//            initDebugEnvironment(true, false, "10.96.6.171");//切换到自己的ip

        } catch (WXException e) {
            e.printStackTrace();
        }
        AppConfig.init(this);
        WeexPluginContainer.loadAll(this);

        //创建广播
        mKeyDownBroadcastReceiver = null== mKeyDownBroadcastReceiver ? new KeyDownBroadcastReceiver() :mKeyDownBroadcastReceiver;

        //动态注册广播
        IntentFilter intentFilter = new IntentFilter(Intent.ACTION_CLOSE_SYSTEM_DIALOGS);
        //启动广播
        registerReceiver(mKeyDownBroadcastReceiver, intentFilter);


        //启动网络状态监听广播
        mNetStatusBroadcast = new NetworkStatusBroadcastReceiver();
        intentFilter = new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION);
        registerReceiver(mNetStatusBroadcast, intentFilter);

        setHWPush();

        try {
            //百度定位
            mBaiduLocationUtils = new BaiduLocationUtils();
            mBaiduLocationUtils.onCreate();
            mBaiduLocationUtils.mLocationClient.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
        //阿里log日志
        SLSDatabaseManager.getInstance().setupDB(getApplicationContext());
    }
    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
    }

    /**
     * 设置权限
     */
    public static void setPermission() {
        if (PermissionManager.getStoragePermission(mAppInstance)) {
            mDatabaseUtils = new DatabaseUtils(mAppInstance);
        }

        //针对android7.0版本 进行file访问的权限增加
        if (Build.VERSION.SDK_INT >= 18) {
            StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
            StrictMode.setVmPolicy(builder.build());
            builder.detectFileUriExposure();
        }

    }

    private void setHWPush() {
        //注册华为push
        HMSAgent.init(this);
        HuaweiPushRevicer.registerPushCallback(this);

        //设置是否接收普通透传消息
        HMSAgent.Push.enableReceiveNormalMsg(true, new EnableReceiveNormalMsgHandler() {
            @Override
            public void onResult(int rst) {
                LogManager.infoLog(TAG, "设置是否接受普通透传消息，enableReceiveNormalMsg:end code=" + rst);
            }
        });

        //设置接收通知消息
        HMSAgent.Push.enableReceiveNotifyMsg(true, new EnableReceiveNotifyMsgHandler() {
            @Override
            public void onResult(int rst) {
                LogManager.infoLog(TAG, "设置接收通知消息,enableReceiveNotifyMsg:end code=" + rst);
            }
        });
    }

    /**
     * 获取push状态 | Get Push State
     */
    public static void getPushStatus() {
        LogManager.infoLog(TAG, "getPushState:begin");
        HMSAgent.Push.getPushState(new GetPushStateHandler() {
            @Override
            public void onResult(int rst) {
                LogManager.infoLog(TAG, "getPushState:end code=" + rst);
            }
        });
    }

    /***
     * weex debug 调试配置
     * @param connectable
     * @param debuggable
     * @param host
     */
    private void initDebugEnvironment(boolean connectable, boolean debuggable, String host) {
            WXEnvironment.sDebugServerConnectable = connectable;
            WXEnvironment.sRemoteDebugMode = debuggable;
            WXEnvironment.sRemoteDebugProxyUrl = "ws://" + host + ":8089/debugProxy/native";
            WXSDKEngine.reload();
    }

    public static void setDatabaseUtils(DatabaseUtils mDatabaseUtils) {
        WXApplication.mDatabaseUtils = mDatabaseUtils;
    }


    @Override
    public void onReceive(Intent intent) {
        /**
         * 接受到消息
         */
        try {
            HWPushHandler.handlerMsg(mAppInstance, intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
        if (null != mKeyDownBroadcastReceiver) {
            unregisterReceiver(mKeyDownBroadcastReceiver);
        }


        if (null != mNetStatusBroadcast) {
            unregisterReceiver(mNetStatusBroadcast);
        }
        if (null == mHWPushToken) {
            HMSAgent.Push.deleteToken(mHWPushToken, new DeleteTokenHandler() {
                @Override
                public void onResult(int rst) {
                    LogManager.infoLog(TAG, "deleteToken:end code=" + rst);
                }
            });
        }

        HuaweiPushRevicer.unRegisterPushCallback(this);
    }


}
