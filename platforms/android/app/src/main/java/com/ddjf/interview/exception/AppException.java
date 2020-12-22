package com.ddjf.interview.exception;

import android.content.Context;
import android.content.Intent;
import android.os.Environment;
import android.os.Looper;
import android.widget.Toast;

import com.alibaba.fastjson.JSONObject;
import com.ddjf.interview.WXApplication;
import com.ddjf.interview.activity.SplashActivity;
import com.ddjf.interview.global.Constants;
import com.ddjf.interview.http.HttpApi;
import com.ddjf.interview.http.HttpLogFileUpload;
import com.ddjf.interview.http.HttpUtils;
import com.ddjf.interview.util.DateUtils;
import com.ddjf.interview.util.FileUtils;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.SharedPreferenceUtil;
import com.ddjf.interview.util.SystemUtils;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.RandomAccessFile;
import java.io.StringWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by yejunrong on 16/6/4.
 * UncaughtException处理类,当程序发生Uncaught异常的时候,有该类来接管程序,并记录发送错误报告.
 */
public class AppException implements Thread.UncaughtExceptionHandler {

    public static final String TAG = "AppException";

    // 系统默认的UncaughtException处理类
    private Thread.UncaughtExceptionHandler mDefaultHandler;
    // CrashHandler实例
    private static AppException INSTANCE = new AppException();
    // 程序的Context对象
    private Context mContext = WXApplication.mAppInstance;
    // 用来存储设备信息和异常信息
    private Map<String, String> infos = new HashMap<String, String>();


    /**
     * 保证只有一个CrashHandler实例
     */
    private AppException() {
    }

    /**
     * 获取CrashHandler实例 ,单例模式
     */
    public static AppException getInstance() {
        return INSTANCE;
    }

    /**
     * 初始化
     */
    public void init() {
        // 获取系统默认的UncaughtException处理器
        mDefaultHandler = Thread.getDefaultUncaughtExceptionHandler();
        // 设置该CrashHandler为程序的默认处理器
        Thread.setDefaultUncaughtExceptionHandler(this);
    }

    /**
     * 当UncaughtException发生时会转入该函数来处理
     */
    @Override
    public void uncaughtException(Thread thread, Throwable ex) {
        if (!handleException(ex) && mDefaultHandler != null) {
            // 如果用户没有处理则让系统默认的异常处理器来处理
            mDefaultHandler.uncaughtException(thread, ex);
        } else {
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
                LogManager.errorLog(TAG, "=error : " + e.getMessage());
            }
            // 退出程序
//            android.os.Process.killProcess(android.os.Process.myPid());
//            System.exit(1);

            // 重新启动程序，注释上面的退出程序
            Intent intent = new Intent();
            intent.setClass(mContext, SplashActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            mContext.startActivity(intent);
            android.os.Process.killProcess(android.os.Process.myPid());
        }
    }

    /**
     * 自定义错误处理,收集错误信息 发送错误报告等操作均在此完成.
     *
     * @param ex
     * @return true:如果处理了该异常信息;否则返回false.
     */
    private boolean handleException(Throwable ex) {
        if (ex == null) {
            return false;
        }
        // 使用Toast来显示异常信息
        new Thread() {
            @Override
            public void run() {
                Looper.prepare();
                Toast.makeText(mContext, "很抱歉,程序出现异常,即将退出.", Toast.LENGTH_LONG).show();
                Looper.loop();
            }
        }.start();

        // 保存日志文件
        saveCrashInfo2File(ex);
        return true;
    }


    /**
     * 保存错误信息到文件中
     *
     * @param ex
     * @return 返回文件名称, 便于将文件传送到服务器
     */
    private void saveCrashInfo2File(Throwable ex) {

        StringBuffer sb = new StringBuffer();
        sb.append("----------" + DateUtils.getStringDate() + "----------");
        String currentPhone = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE) == null ? "" :
                SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE);
        String currentUserId = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_USERID) == null ? "" :
                SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_USERID);
        String currentCompanyCode = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_COMPANYCODE) == null ? "" :
                SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_COMPANYCODE);
        String currentCompanyName = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_COMPANYNAME) == null ? "" :
                SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_COMPANYNAME);
        sb.append("phone="+currentPhone+" userId="+currentUserId+" companyCode="+currentCompanyCode +
                " companyName="+currentCompanyName+"  ");
        sb.append("设备相关信息："+SystemUtils.getDevicesInfo()+"\n");

        for (Map.Entry<String, String> entry : infos.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            sb.append(key + "=" + value.toString() + "\n");
        }

        Writer writer = new StringWriter();
        PrintWriter printWriter = new PrintWriter(writer);
        ex.printStackTrace(printWriter);
        Throwable cause = ex.getCause();
        while (cause != null) {
            cause.printStackTrace(printWriter);
            cause = cause.getCause();
        }
        printWriter.close();
        String result = writer.toString();
        sb.append(result);
        try {
            LogManager.errorLog(TAG,"错误信息================\n"+sb.toString());
            uploadLog(sb.toString());
//            if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
//                File dir = new File(FileUtils.getLogDir());
//                if (!dir.exists()) {
//                    dir.mkdirs();
//                }
//
//                RandomAccessFile raf = null;
//
//                File file = new File(FileUtils.getLogDir(), FileUtils.getCrashLogFileName());
//                raf = new RandomAccessFile(file, "rw");
//                raf.seek(file.length());
//                raf.write(sb.toString().getBytes());
//                raf.write("///////////////////////////////////////////////////////////////////////////".getBytes());
//                raf.write("\n".getBytes());
//
//                raf.close();
//            }
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
            LogManager.errorLog(TAG, "==an error occured while writing file..." + e.getMessage());
        }
    }

    //将 闪崩的错误信息上传到后台
    private void uploadLog(String msg) {
        String url = Constants.getBpmsBaseUrl(HttpApi.LOG_MSG_UPLOAD_URL);
        JSONObject body = new JSONObject();
        body.put("userNo", SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_USERID));
        body.put("mobile", SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE));
        body.put("type", "error");
        body.put("content", msg);
        HttpUtils.httpPostRequest(url, body,null, new HttpUtils.HttpRequestCallBack() {
            @Override
            public void onFailure(Request request, Exception e) {
                LogManager.infoLog(TAG,"上传日志信息出错===="+e.getMessage());
            }

            @Override
            public void onSuccess(Response response) {
                try {
                    LogManager.infoLog(TAG,"上传日志信息结果===="+response.body().string());
                } catch (IOException e) {
                    ExceptionGlobalHandler.showException(TAG,e);
                }
            }
        });

        //同时打包错误信息文件上传到影像服务器
//        HttpLogFileUpload.logFileUpload(true, null);
    }
}
