package com.ddjf.interview.util;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;

import com.ddjf.interview.exception.ExceptionGlobalHandler;

/**
 * Created by yejunrong on 18/3/29.
 * 申请权限管理
 */

public class PermissionManager {
    private static final int REQUEST_EXTERNAL_STORAGE = 1;
    private static String[] PERMISSIONS_STORAGE = {
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_NETWORK_STATE,
            Manifest.permission.ACCESS_COARSE_LOCATION};
    static String TAG = "PermissionManager";
    /**
     * SD卡读写权限申请
     *
     * @param activity
     */
    public static void verifyStoragePermissions(Activity activity) {

        try {
            //检测是否有写的权限
            int permission = ActivityCompat.checkSelfPermission(activity,
                    "android.permission.WRITE_EXTERNAL_STORAGE");
            if (permission != PackageManager.PERMISSION_GRANTED) {
                // 没有写的权限，去申请写的权限，会弹出对话框
                ActivityCompat.requestPermissions(activity, PERMISSIONS_STORAGE,REQUEST_EXTERNAL_STORAGE);
            }
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }

    /***
     * 获取sd卡 读写权限状态
     *
     * @param cxt
     * @return
     */
    public static boolean getStoragePermission(Context cxt){
        int permission = ActivityCompat.checkSelfPermission(cxt,
                "android.permission.WRITE_EXTERNAL_STORAGE");
        return permission == PackageManager.PERMISSION_GRANTED;
    }

    public static boolean getActionPermission(Activity cxt){
        if (Build.VERSION.SDK_INT >= 23) {
            boolean isRequestPermission = false;
            for(String itemPermission : PERMISSIONS_STORAGE){
                if(ActivityCompat.checkSelfPermission(cxt, itemPermission) != PackageManager.PERMISSION_GRANTED){
                    isRequestPermission = true;
                }
            }
            if(isRequestPermission){
                ActivityCompat.requestPermissions(cxt, PERMISSIONS_STORAGE,0);
                return false;
            }

        } else {
            //Android6.0以下，不用动态声明权限
        }
        return true;
    }
}
