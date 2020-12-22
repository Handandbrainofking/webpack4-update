package com.ddjf.interview.activity;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Application;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.Process;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.LocalBroadcastManager;
import android.text.TextUtils;
import android.view.Menu;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baidu.mobstat.StatService;
import com.ddjf.interview.R;
import com.ddjf.interview.WXApplication;
import com.ddjf.interview.database.DatabaseUtils;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.http.FileDownload;
 import com.ddjf.interview.http.HttpLogFileUpload;
import com.ddjf.interview.http.HttpSystemUpdateModel;
import com.ddjf.interview.http.HttpUtils;
 import com.ddjf.interview.service.FileUploadService;
import com.ddjf.interview.service.SystemService;
import com.ddjf.interview.global.Constants;
import com.ddjf.interview.util.DateUtils;
import com.ddjf.interview.util.FileUtils;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.SystemUtils;
import com.ddjf.interview.util.msg.HWPushHandler;
import com.ddjf.interview.views.CustomAlertDialog;
import com.ddjf.interview.views.CustomDialog;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;
import com.huawei.android.hms.agent.HMSAgent;
import com.huawei.android.hms.agent.common.handler.ConnectHandler;
import com.huawei.android.hms.agent.push.handler.GetTokenHandler;

import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;
import com.taobao.weex.WXSDKInstance;
import com.taobao.weex.common.WXRenderStrategy;
import com.taobao.weex.ui.component.NestedContainer;

import java.io.File;
import java.lang.ref.WeakReference;


public class WXPageActivity extends BaseActivity implements
        WXSDKInstance.NestedInstanceInterceptor, HttpSystemUpdateModel.HttpSystemUpdateResult {
    private final int REQUEST_PERMISSION = 0;

    private final String TAG = "WXPageActivity";
    private CustomDialog mCustomDialog;
    private TextView mTipView;
    private boolean mFromSplash = false;
    PageHandler mHandler;
    private Handler uiHandler = new Handler(){
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what){
                case 0:
                    //渲染 页面
                    mInstance.renderByUrl(
                            getPageName(),
                            mCurrentPageUri,
                            null,
                            null,
                            WXRenderStrategy.APPEND_ASYNC);
                    break;
            }
        }
    };

    WeakReference<Context> mContext;
    public WeakReference<WXApplication> mApp = new WeakReference<>((WXApplication)WXApplication.mAppInstance);

    @Override
    public void onCreateNestInstance(WXSDKInstance instance, NestedContainer container) {

    }

    @Override
    public void jumpPage(String pageUri) {
        super.jumpPage(pageUri);
        LogManager.infoLog(TAG, "要去到的js===== " + pageUri.toString());

        if (null != pageUri) {
            Intent intent = new Intent(mContext.get(), TaskActivity.class);
            intent.putExtra("path", pageUri + "");
            startActivity(intent);
            finish();
        }

    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mContext = new WeakReference<>((Context) this);
        mHandler = new PageHandler(this);

        Intent intent = getIntent();
        String from = intent.getStringExtra("from");
        mFromSplash = "splash".equals(from);

        setContentView(R.layout.activity_wxpage);
        mContainer = (ViewGroup) findViewById(R.id.container);
        mCustomDialog = new CustomDialog(this,R.style.CustomDialog,true);
        mCustomDialog.show();
        mTipView = (TextView) findViewById(R.id.index_tip);

        mCurrentPageUri = loadPage(getIntent().getStringExtra("path"));

        if (null != mCurrentPageUri) {
            //渲染 页面
            uiHandler.sendEmptyMessage(0);
            return;
        }

        mCurrentPageUri = loadPage("file://assets/dist/index.js");
        LogManager.infoLog(TAG,"渲染页面的文件=="+mCurrentPageUri);
        uiHandler.sendEmptyMessage(0);

        ActivityCompat.requestPermissions(this,
                new String[]{Manifest.permission.READ_PHONE_STATE,Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE},
                0);

        uiHandler.postDelayed(new Runnable() {
            @Override
            public void run() {

                //重新去跑一次上传操作
                startService(new Intent(WXApplication.mAppInstance, FileUploadService.class));
                startService(new Intent(WXApplication.mAppInstance, SystemService.class));


            }
        }, 5 * 1000);


        findViewById(R.id.getPushStatus).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mApp.get().getPushStatus();
            }
        });


        uiHandler.postDelayed(new Runnable() {
            @Override
            public void run() {

                // 版本更新
                HttpSystemUpdateModel.systemUpdate(false, WXPageActivity.this);

            }
        }, 3 * 1000);

        WeakReference<Activity> activityWeakReference = new WeakReference<>((Activity) WXPageActivity.this);

        // 在首个界面，需要调用connect进行连接 | In the first page, you need to call connect
        HMSAgent.connect(activityWeakReference.get(), new ConnectHandler() {
            @Override
            public void onConnect(int rst) {
                LogManager.infoLog(TAG, " HMSAgent.connect 华为消息连接结果 result=" + rst);
            }
        });

        //申请token，通过广播(HuawePushRevicer.onToken)后获取token
        HMSAgent.Push.getToken(new GetTokenHandler() {
            @Override
            public void onResult(int rtnCode) {
                LogManager.infoLog(TAG, " HMSAgent.Push.getToken 华为消息获取token结果=" + rtnCode);
            }
        });

        WXApplication.setPermission();


        try {

            //百度统计
            StatService.start(this);
            SystemUtils.checkLocationStatus();
//            //模拟消息通知
//            String content = "{applyNo:\"XXXXXX\",msgContent:\"您在2018-12-13有面签任务,请您准时办理！^[NotificationBar]$\"," +
//                    "id: \"10010100\",pageNumber:1002," +
//                    "isNotification:1,sendTime:\"2018-03-25\"}";
//            org.json.JSONObject object = new org.json.JSONObject(content);
//            HWPushHandler.showNotification(this,object);

        }catch (Exception e){
            ExceptionGlobalHandler.showException(TAG,e);
        }


    }

    protected void preRenderPage() {
        mCustomDialog.show();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        Intent intent = new Intent("requestPermission");
        intent.putExtra("REQUEST_PERMISSION_CODE", requestCode);
        intent.putExtra("permissions", permissions);
        intent.putExtra("grantResults", grantResults);
        LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
        for(String per : permissions){
            if(per != null && per.equals(Manifest.permission.WRITE_EXTERNAL_STORAGE)){
                //创建库的操作
                WXApplication.setDatabaseUtils(new DatabaseUtils(WXApplication.mAppInstance));
                LogManager.infoLog(TAG," 创建数据的操作。。。");

                //如果没有json文件则从assets拷贝过去
                if(! new File(FileUtils.SystemDicFilePath + File.separator
                        + FileUtils.SystemDicFileName).exists()){
                    FileUtils.assetCopySd("config", FileUtils.SystemDicFilePath);
                }

            }
        }
    }


    @Override
    public void onRenderSuccess(WXSDKInstance instance, int width, int height) {
        super.onRenderSuccess(instance, width, height);
        mCustomDialog.dismiss();
        mTipView.setVisibility(View.GONE);
    }

    @Override
    public void onException(WXSDKInstance instance, String errCode, String msg) {
        super.onException(instance, errCode, msg);
        mCustomDialog.dismiss();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(mFromSplash ? R.menu.main_scan : R.menu.main, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        LogManager.infoLog(TAG, " activity destroy");
        if(null!=mCustomDialog){
            mCustomDialog = null;
        }
        if(null != mHandler) {
            mHandler = null;
        }
        mContext.clear();
        mContext = null;
        mApp = null;
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        IntentResult result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
        if (result != null) {
            if (result.getContents() == null) {
                Toast.makeText(this, "Cancelled", Toast.LENGTH_LONG).show();
            } else {

            }
        }
        super.onActivityResult(requestCode, resultCode, data);
    }


    @Override
    public void onResume() {
        super.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
    }

    private static class PageHandler extends Handler{
        private WeakReference<WXPageActivity> activityWeakReference ;
        ProgressDialog mProcessDia;
        AlertDialog.Builder mBuilder;
        AlertDialog mDialog;

        public PageHandler(WXPageActivity activity){
            activityWeakReference = new WeakReference<>(activity);
        }
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what) {
                case 1:
                    Bundle bundle = msg.getData();
                    final String sererUrl = bundle.getString("sererUrl");
                    final String versionName = bundle.getString("versionName");
                    final boolean isForceDownload = bundle.getBoolean("isForceDownload");
                    if (null == mProcessDia) {
                        mProcessDia = new ProgressDialog(activityWeakReference.get());
                    }
                    mProcessDia.setProgress(0);
                    mProcessDia.setTitle("最新版本下载中...");
                    mProcessDia.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
                    mProcessDia.setMax(100);

                    if (null == mBuilder) {
                        mBuilder = new AlertDialog.Builder(activityWeakReference.get());
                    }
                    mBuilder.setTitle("软件更新");
                    if (!isForceDownload) {
                        mBuilder.setNegativeButton("确定", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int i) {
                                dialog.dismiss();
                            }
                        });
                        mBuilder.setCancelable(false);
                        mBuilder.setMessage("检测到新版本:" + versionName + ",请到ZIYA软件中下载更新");
                    } else {
                        mBuilder.setMessage("检测到新版本:" + versionName + ",必须到ZIYA软件中下载更新后才能使用新功能哦！");
                        mBuilder.setCancelable(false);
                        mBuilder.setNegativeButton("关闭", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int i) {
                                Process.killProcess(Process.myPid());
                                dialog.dismiss();
                            }
                        });
                    }

                    if (null == mDialog) {
                        mDialog = mBuilder.create();
                        mDialog.setOnShowListener(new DialogInterface.OnShowListener() {
                            @Override
                            public void onShow(DialogInterface dialog) {
                                //修改按钮颜色
                                Button button  = mDialog.getButton(AlertDialog.BUTTON_NEGATIVE);
                                button.setTextColor(Color.rgb(2, 179, 180));
                            }
                        });
                    }
                    mDialog.show();
                    break;
                case 0:
                    new CustomAlertDialog().show("资源更新",
                            "已更新最新的资源，是否马上重启APP进行体验?", "马上重启", "稍后再说",
                            new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    dialog.dismiss();
                                    //重启APP 生效js文件
                                    Intent intent = new Intent(activityWeakReference.get().mApp.get().mAppInstance, SplashActivity.class);
                                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                    activityWeakReference.get().mApp.get().startActivity(intent);
                                    Process.killProcess(Process.myPid());
                                }
                            }, null);

                    LogManager.infoLog(activityWeakReference.get().TAG,"js资源更新完成。");
                    break;
            }
        }
    }


    @Override
    public void updateAPK(String sererUrl, boolean isForceDownload, String versionName) {
        //更新APK
        Message msg = new Message();
        msg.what = 1;
        Bundle bundle = new Bundle();
        bundle.putString("sererUrl", sererUrl);
        bundle.putString("versionName", versionName);
        bundle.putBoolean("isForceDownload", isForceDownload);
        msg.setData(bundle);
        mHandler.sendMessage(msg);
    }

    @Override
    public void updateJsBundler(String jsUrl, String versionName) {
        final String fileName = DateUtils.getStringDate() + ".zip";
        final String locationPath = FileUtils.WeexFileDir;

        //更新js
        FileDownload.downloadZIPFile(jsUrl, locationPath, fileName, new HttpUtils.HttpRequestCallBack() {
            @Override
            public void onFailure(Request request, Exception e) {

            }

            @Override
            public void onSuccess(Response response) {
                try {
                    FileUtils.readFileName(locationPath);
                    File zipJsFile = new File(locationPath, fileName);
                    //解压JSBundle
                    boolean result = FileUtils.decompressZip(zipJsFile, locationPath);
                    LogManager.infoLog(TAG, "解压JSBundle结果==" + result);
                    if (result) {
                        zipJsFile.delete();

                        mHandler.sendEmptyMessage(0);

                    }

                } catch (Exception e) {
                    ExceptionGlobalHandler.showException(TAG,e);
                }
            }
        });
    }



}
