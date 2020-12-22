package com.ddjf.interview.log_manager;

import android.Manifest;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.util.Log;

import com.ddjf.interview.WXApplication;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.global.Constants;
import com.ddjf.interview.util.DateUtils;
import com.ddjf.interview.util.FileUtils;
import com.ddjf.interview.util.SharedPreferenceUtil;

import java.io.File;
import java.io.RandomAccessFile;

/**
 * Created by yejunrong on 18/3/14.
 * log日志的简单管理
 */

public class LogManager {
    static String TAG = "ddjf_interview_log";
    static String MSG = "打印的log信息不能为空";
    static int failureMaxCount = 10; //日志上传最大失败次数，超过最大次数就不会再上传了

    public static void infoLog(String tag, String msg) {
        if (Constants.IS_OPEN_LOG) {
            Log.i(TAG, "tag=" + tag + " msg=" + (null == msg ? MSG : msg));
        }
        uploadAlilog("tag=" + tag ,  " msg=" + (null == msg ? MSG : msg),"info");

    }


    public static void errorLog(String tag, String msg) {
        if (Constants.IS_OPEN_LOG) {
            Log.e(TAG, "tag=" + tag + " msg=" + (null == msg ? MSG : msg));
        }
        uploadAlilog("tag=" + tag ,  " msg=" + (null == msg ? MSG : msg),"error");

    }


    public static void debugLog(String tag, String msg) {
        if (Constants.IS_OPEN_LOG) {
            Log.d(TAG, "tag=" + tag + " msg=" + (null == msg ? MSG : msg));
        }
    }

    public static void verboseLog(String tag, String msg) {
        if (Constants.IS_OPEN_LOG) {
            Log.v(TAG, "tag=" + tag + " msg=" + (null == msg ? MSG : msg));
        }
    }

    private static void uploadAlilog(String tag,String msg,String level){
        long failureCount = SharedPreferenceUtil.getDataLong(SharedPreferenceUtil.PLATFORM_LOG_FAILURE_COUNT);
        if(SharedPreferenceUtil.getDataBoolean(SharedPreferenceUtil.PLATFORM_LOG_STATUS) ||
                failureCount > failureMaxCount){
            SharedPreferenceUtil.setData(SharedPreferenceUtil.PLATFORM_LOG_FAILURE_COUNT,new Long(0));

            ALiLogManager.asyncUploadLog("tag=" + tag + " msg=" + (null == msg ? MSG : msg),
                    (null == level ? "info" : level));
        }else{
            SharedPreferenceUtil.setData(SharedPreferenceUtil.PLATFORM_LOG_FAILURE_COUNT,failureCount + 1);
        }

    }


    private static void logWriteFile(String logType, String tag, String msg) {
        try {
//            String outputMsg = DateUtils.getStringDate() + "  " + logType + "  " + "tag=" + tag + "  msg=" + msg;
//
//            if(ActivityCompat.checkSelfPermission(WXApplication.mAppInstance,  Manifest.permission.WRITE_EXTERNAL_STORAGE)
//                    != PackageManager.PERMISSION_GRANTED){
//                Log.i(TAG, "没有文件读取权限，写文件失败。。。。");
//                return;
//            }
//
//            File logDir = new File(FileUtils.getLogDir());
//            if (!logDir.exists()) {
//                logDir.mkdirs();
//                // do not allow media scan
//                new File(logDir, FileUtils.getLogFileName()).createNewFile();
//            }
//
//
//            RandomAccessFile raf = null;
//
//            File file = new File(FileUtils.getLogDir(), FileUtils.getLogFileName());
//            raf = new RandomAccessFile(file, "rw");
//            raf.seek(file.length());
//            raf.write(outputMsg.getBytes());
//            raf.write("\n".getBytes());
//
//            raf.close();


        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }

    }
}
