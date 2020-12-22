package com.ddjf.interview.util;

import android.Manifest;
import android.app.ActivityManager;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.telephony.CellInfo;
import android.telephony.CellInfoCdma;
import android.telephony.CellInfoGsm;
import android.telephony.CellInfoLte;
import android.telephony.CellInfoWcdma;
import android.telephony.CellSignalStrengthCdma;
import android.telephony.CellSignalStrengthGsm;
import android.telephony.CellSignalStrengthLte;
import android.telephony.CellSignalStrengthWcdma;
import android.telephony.TelephonyManager;
import android.widget.Toast;

import com.ddjf.interview.WXApplication;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.views.CustomAlertDialog;
import com.huawei.android.hms.agent.HMSAgent;
import com.huawei.android.hms.agent.push.handler.GetPushStateHandler;

import org.json.JSONObject;

import java.util.List;
import java.util.logging.Logger;

/**
 * Created by yejunrong on 18/3/20.
 */

public class SystemUtils {
    static String Tag = "SystemUtils";
    public static String Network_Type_Wifi = "wifi";

    /**
     * 判断应用是否已经启动
     *
     * @param context     一个context
     * @param packageName 要判断应用的包名
     * @return boolean
     */
    public static boolean isAppAlive(Context context, String packageName) {
        ActivityManager activityManager =
                (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> processInfos
                = activityManager.getRunningAppProcesses();
        for (int i = 0; null != processInfos && i < processInfos.size(); i++) {
            if (processInfos.get(i).processName.equals(packageName)) {
                LogManager.infoLog("NotificationLaunch",
                        String.format("the %s is running, isAppAlive return true", packageName));
                return true;
            }
        }
        LogManager.infoLog("NotificationLaunch",
                String.format("the %s is not running, isAppAlive return false", packageName));
        return false;
    }

    /**
     * 用来判断服务是否运行.
     *
     * @param mContext
     * @param className 使用.class.getCanoicalName获取
     * @return true 在运行 false 不在运行
     */
    public static boolean isServiceRunning(Context mContext, String className) {
        boolean isRunning = false;
        ActivityManager activityManager = (ActivityManager) mContext
                .getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningServiceInfo> serviceList = activityManager
                .getRunningServices(30);
        if (!(serviceList.size() > 0)) {
            return false;
        }
        for (int i = 0; i < serviceList.size(); i++) {
            if (serviceList.get(i).service.getClassName().equals(className) == true) {
                isRunning = true;
                break;
            }
        }
        return isRunning;
    }

    public static void getActivityStatus(Context cxt) {
        ActivityManager am = (ActivityManager) cxt.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningTaskInfo> runningTaskInfoList = am.getRunningTasks(10);
        for (ActivityManager.RunningTaskInfo runningTaskInfo : runningTaskInfoList) {
            LogManager.infoLog("getActivityStatus", "id: " + runningTaskInfo.id);
            LogManager.infoLog("getActivityStatus", "description: " + runningTaskInfo.description);
            LogManager.infoLog("getActivityStatus", "number of activities: " + runningTaskInfo.numActivities);
            LogManager.infoLog("getActivityStatus", "topActivity: " + runningTaskInfo.topActivity);

            LogManager.infoLog("getActivityStatus", "baseActivity: " + runningTaskInfo.baseActivity.toString());
        }
    }

    /**
     * 获取apk版本号
     *
     * @return 当前应用的版本号
     */
    public static int getAPKVersionCode() {
        try {
            PackageManager manager = WXApplication.mAppInstance.getPackageManager();
            PackageInfo info = manager.getPackageInfo(WXApplication.mAppInstance.getPackageName(), 0);
            int version = info.versionCode;
            return version;
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(Tag, e);
            return 0;
        }
    }

    /**
     * 获取apk版本号
     *
     * @return 当前应用的版本号
     */
    public static String getAPKVersionName() {
        try {
            PackageManager manager = WXApplication.mAppInstance.getPackageManager();
            PackageInfo info = manager.getPackageInfo(WXApplication.mAppInstance.getPackageName(), 0);
            return info.versionName;
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(Tag, e);

        }
        return "";
    }

    /**
     * 获取本地weex的版本信息
     *
     * @return
     */
    public static String getWeexVersionName() {
        String content = FileUtils.readFile(FileUtils.WeexConfigFile, FileUtils.WeexFileDir);
        String version = "v0.0.1";

        try {
            if (content == null || content.isEmpty()) {
                // 获取assets/dist/下面的版本信息
                content = FileUtils.readAssetsFile(FileUtils.WeexConfigFile, "dist");
            }

            JSONObject jsonObject = new JSONObject(content);
            version = jsonObject.getString("versionName");
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(Tag, e);
        }
        return version;
    }

    /**
     * 获取本地weex的版本号
     *
     * @return
     */
    public static long getWeexVersionCode() {
        String cacheContent = FileUtils.readFile(FileUtils.WeexConfigFile, FileUtils.WeexFileDir);
        long version = 0;
        try {
            if (cacheContent == null || cacheContent.equals("") || cacheContent.isEmpty()) {
                // 获取assets/dist/下面的版本信息
                cacheContent = FileUtils.readAssetsFile(FileUtils.WeexConfigFile, "dist");
            }
            JSONObject jsonObject = new JSONObject(cacheContent);
            version = jsonObject.getLong("versionCode");
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(Tag, e);
        }
        return version;
    }

    /**
     * 华为消息推送状态输出到日志文件
     */
    public static void getHwPushStatusToLog() {
        HMSAgent.Push.getPushState(new GetPushStateHandler() {
            @Override
            public void onResult(int rst) {

                LogManager.infoLog("SystemUtils", "当前华为推送状态getPushState:end code=" + rst);
            }
        });
    }

    /**
     * 获取当前的网络类型
     *
     * @return
     */
    public static String getNetype() {
        //结果返回值
        String netType = "nono_connect";
        //获取手机所有连接管理对象
        ConnectivityManager manager = (ConnectivityManager) WXApplication.mAppInstance.
                getSystemService(Context.CONNECTIVITY_SERVICE);
        //获取NetworkInfo对象
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        //NetworkInfo对象为空 则代表没有网络
        if (networkInfo == null) {
            return netType;
        }
        //否则 NetworkInfo对象不为空 则获取该networkInfo的类型
        int nType = networkInfo.getType();
        if (nType == ConnectivityManager.TYPE_WIFI) {
            //WIFI
            netType = Network_Type_Wifi;
        } else if (nType == ConnectivityManager.TYPE_MOBILE) {
            int nSubType = networkInfo.getSubtype();
            TelephonyManager telephonyManager = (TelephonyManager) WXApplication.mAppInstance.
                    getSystemService(Context.TELEPHONY_SERVICE);
            //4G
            if (nSubType == TelephonyManager.NETWORK_TYPE_LTE
                    && !telephonyManager.isNetworkRoaming()) {
                netType = "4G";
            } else if (nSubType == TelephonyManager.NETWORK_TYPE_UMTS || nSubType == TelephonyManager.
                    NETWORK_TYPE_HSDPA || nSubType == TelephonyManager.NETWORK_TYPE_EVDO_0 &&
                    !telephonyManager.isNetworkRoaming()) {
                netType = "3G";
                //2G 移动和联通的2G为GPRS或EGDE，电信的2G为CDMA
            } else if (nSubType == TelephonyManager.NETWORK_TYPE_GPRS || nSubType == TelephonyManager.
                    NETWORK_TYPE_EDGE || nSubType == TelephonyManager.NETWORK_TYPE_CDMA &&
                    !telephonyManager.isNetworkRoaming()) {
                netType = "2G";
            } else {
                netType = "2G";
            }
        }
        LogManager.infoLog(Tag,"当前网络类型："+netType);
        return netType;
    }

    /**
     * 获取手机信号强度
     * dBm是负数，越接近0信号强度越高，信号越好，但不可能为0
     * 中国移动的规范规定,手机接收电平>=(城市取-90dBm;乡村取-94dBm) 时,则满足覆盖要求,
     * @return
     */
    public static String getMobileDbm() {
        int dbm = 0;
        TelephonyManager tm = (TelephonyManager) WXApplication.mAppInstance.getSystemService(Context.TELEPHONY_SERVICE);
        List<CellInfo> cellInfoList;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            if (ActivityCompat.checkSelfPermission(WXApplication.mAppInstance, Manifest.permission.ACCESS_COARSE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED) {
                return "";
            }
            cellInfoList = tm.getAllCellInfo();
            if (null != cellInfoList) {
                for (CellInfo cellInfo : cellInfoList) {
                    if (cellInfo instanceof CellInfoGsm) {
                        CellSignalStrengthGsm cellSignalStrengthGsm = ((CellInfoGsm) cellInfo).getCellSignalStrength();
                        dbm = cellSignalStrengthGsm.getDbm();
                    } else if (cellInfo instanceof CellInfoCdma) {
                        CellSignalStrengthCdma cellSignalStrengthCdma =
                                ((CellInfoCdma) cellInfo).getCellSignalStrength();
                        dbm = cellSignalStrengthCdma.getDbm();
                    } else if (cellInfo instanceof CellInfoWcdma) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
                            CellSignalStrengthWcdma cellSignalStrengthWcdma =
                                    ((CellInfoWcdma) cellInfo).getCellSignalStrength();
                            dbm = cellSignalStrengthWcdma.getDbm();
                        }
                    } else if (cellInfo instanceof CellInfoLte) {
                        CellSignalStrengthLte cellSignalStrengthLte = ((CellInfoLte) cellInfo).getCellSignalStrength();
                        dbm = cellSignalStrengthLte.getDbm();
                    }
                }
            }
        }
        return ""+dbm;
    }


    /**
     * 获取当前设备信息
     *
     * @return
     */
    public static String getDevicesInfo() {
        com.alibaba.fastjson.JSONObject result = getDevicesInfoObject();

        LogManager.infoLog("SystemUtils", result.toJSONString());
        return result.toJSONString();
    }

    /**
     * 获取当前设备信息
     *
     * @return
     */
    public static com.alibaba.fastjson.JSONObject getDevicesInfoObject() {
        com.alibaba.fastjson.JSONObject result = new com.alibaba.fastjson.JSONObject();
        result.put("apkVersionCode", getAPKVersionCode());
        result.put("apkVersionName", getAPKVersionName());
        result.put("jsVersionCode", getWeexVersionCode());
        result.put("jsVersionName", getWeexVersionName());
        result.put("manufacturer", Build.BRAND);
        //设备名称
        result.put("deviceName", Build.MODEL);
        //系统版本
        result.put("sdkVersionCode", Build.VERSION.SDK_INT);
        result.put("sdkVersionName", Build.VERSION.RELEASE);
        result.put("host", Build.HOST);
        TelephonyManager tm = (TelephonyManager) WXApplication.mAppInstance.getSystemService(Context.TELEPHONY_SERVICE);
        if (ActivityCompat.checkSelfPermission(WXApplication.mAppInstance, Manifest.permission.READ_PHONE_STATE)
                == PackageManager.PERMISSION_GRANTED) {
            result.put("deviceId", tm.getDeviceId());
            result.put("sim", tm.getSimSerialNumber());
        }
        //网络情况
        result.put("netType", getNetype());
        //信号强度
        result.put("mobileDbm",getMobileDbm());
        result.put("deviceToken", WXApplication.mHWPushToken);
        if (null != WXApplication.mBaiduLocationUtils && null != WXApplication.mBaiduLocationUtils.mBDLocation) {
            if (!SharedPreferenceUtil.getDataBoolean(SharedPreferenceUtil.LOCATION_SERVER_STATUS)) {
                Toast.makeText(WXApplication.mAppInstance, "请开启位置信息服务和网络服务!", Toast.LENGTH_LONG).show();
            }
            result.put("longitude", WXApplication.mBaiduLocationUtils.mBDLocation.getLongitude());
            result.put("latitude", WXApplication.mBaiduLocationUtils.mBDLocation.getLatitude());
            result.put("address", WXApplication.mBaiduLocationUtils.mBDLocation.getAddress().address);
        }
        result.put("maxMemory",MemoryUtils.maxMemory());
        LogManager.infoLog("SystemUtils 设备详情", result.toString());
        return result;
    }

    /**
     * 检测当前网络
     */
    public static void checkNetStatus(){
        ConnectivityManager manager = (ConnectivityManager)WXApplication.mAppInstance.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo gprs = manager.getNetworkInfo(ConnectivityManager.TYPE_MOBILE);
        NetworkInfo wifi = manager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
        if(!gprs.isConnected() && !wifi.isConnected()){
            new CustomAlertDialog().show(null, "检测到您未开启网络服务！",
                    "马上开启", "稍后再试", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            dialog.dismiss();
                            Intent intent = new Intent();
                            intent.setAction(Settings.ACTION_WIRELESS_SETTINGS);
                            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            WXApplication.mAppInstance.startActivity(intent);

                            try{
                                WXApplication.mAppInstance.startActivity(intent);
                            } catch(ActivityNotFoundException ex){
                                intent.setAction(Settings.ACTION_SETTINGS);
                                try {
                                    WXApplication.mAppInstance.startActivity(intent);
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            }
                        }
                    }, null);
            return;
        }
        LogManager.infoLog(Tag,"网络状态良好");

    }

    public static boolean checkLocationStatus(){
        LocationManager locationManager = (LocationManager)WXApplication.mAppInstance.
                getSystemService(Context.LOCATION_SERVICE);
        boolean baiduLocationStatus = SharedPreferenceUtil.getDataBoolean(SharedPreferenceUtil.LOCATION_SERVER_STATUS);
        boolean GPSStatus = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);

        if(GPSStatus  && !baiduLocationStatus){
            //如果已经开启了位置服务，但是百度地图没有获取到经纬度
            WXApplication.mBaiduLocationUtils.mLocationClient.restart();
            Toast.makeText(WXApplication.mAppInstance, "请稍后，正在努力获取地理位置！",Toast.LENGTH_LONG).show();
            return false;
        }
        if(!GPSStatus  || !baiduLocationStatus){
            showSettingLocation();
            return false;
        }
        return true;
    }

    /**
     * 检测当前位置服务
     */
    private static  void showSettingLocation(){
        new CustomAlertDialog().show( null, "检测到您未开启位置信息服务！",
                "马上开启", "稍后再试", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                        Intent intent = new Intent();
                        intent.setAction(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        WXApplication.mAppInstance.startActivity(intent);

                        try{
                            WXApplication.mAppInstance.startActivity(intent);
                        } catch(ActivityNotFoundException ex){
                            intent.setAction(Settings.ACTION_SETTINGS);
                            try {
                                WXApplication.mAppInstance.startActivity(intent);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                    }
                }, null);
    }

}
