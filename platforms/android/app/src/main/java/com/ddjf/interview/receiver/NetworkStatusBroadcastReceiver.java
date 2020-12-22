package com.ddjf.interview.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkInfo;

import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.service.FileUploadService;
import com.ddjf.interview.log_manager.LogManager;
import com.huawei.android.hms.agent.HMSAgent;
import com.huawei.android.hms.agent.push.handler.GetTokenHandler;

/**
 * 网络状态切换 -- 监听
 */
public class NetworkStatusBroadcastReceiver extends BroadcastReceiver {
    String Tag = "NetworkStatusBroadcastReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        try {

            LogManager.infoLog(Tag, "网络状态发生变化");
            //检测API是不是小于23，因为到了API23之后getNetworkInfo(int networkType)方法被弃用
            if (android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.LOLLIPOP) {

                //获得ConnectivityManager对象
                ConnectivityManager connMgr = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);

                //获取ConnectivityManager对象对应的NetworkInfo对象
                //获取WIFI连接的信息
                NetworkInfo wifiNetworkInfo = connMgr.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
                //获取移动数据连接的信息
                NetworkInfo dataNetworkInfo = connMgr.getNetworkInfo(ConnectivityManager.TYPE_MOBILE);
                if (wifiNetworkInfo.isConnected() && dataNetworkInfo.isConnected()) {
                    LogManager.infoLog(Tag, "WIFI已连接,移动数据已连接");
                } else if (wifiNetworkInfo.isConnected() && !dataNetworkInfo.isConnected()) {
                    LogManager.infoLog(Tag, "WIFI已连接,移动数据已断开");
                } else if (!wifiNetworkInfo.isConnected() && dataNetworkInfo.isConnected()) {
                    LogManager.infoLog(Tag, "WIFI已断开,移动数据已连接");
                } else {
                    LogManager.infoLog(Tag, "WIFI已断开,移动数据已断开");
                }
            } else {

                //API大于23时使用下面的方式进行网络监听
                LogManager.infoLog(Tag, "API level 大于23");
                //获得ConnectivityManager对象
                ConnectivityManager connMgr = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);

                //获取所有网络连接的信息
                Network[] networks = connMgr.getAllNetworks();
                //用于存放网络连接信息
                StringBuilder sb = new StringBuilder();
                //通过循环将网络信息逐个取出来
                for (int i = 0; i < networks.length; i++) {
                    //获取ConnectivityManager对象对应的NetworkInfo对象
                    NetworkInfo networkInfo = connMgr.getNetworkInfo(networks[i]);
                    if (networkInfo.isConnected()) {
                        sb.append(networkInfo.getTypeName() + " connect is " + networkInfo.isConnected());
                    }
                }
                LogManager.infoLog(Tag, sb.toString());

                if (sb.length() > 0) {
                    //网络发生变化，重新去跑一次上传操作
                    context.startService(new Intent(context, FileUploadService.class));

                    //重新去获取华为token
                    HMSAgent.Push.getToken(new GetTokenHandler() {
                        @Override
                        public void onResult(int rtnCode) {
                            LogManager.infoLog(Tag, " HMSAgent.Push.getToken 华为消息获取token结果=" + rtnCode);
                        }
                    });
                }
            }

        } catch (Exception e) {
            ExceptionGlobalHandler.showException(Tag, e);
        }
    }
}