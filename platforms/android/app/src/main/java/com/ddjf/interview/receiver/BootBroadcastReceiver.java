package com.ddjf.interview.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.ddjf.interview.activity.SplashActivity;
import com.ddjf.interview.log_manager.LogManager;

/**
 * 开机自启动 所做的操作
 *
 */
public class BootBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        LogManager.infoLog("BootBroadcastReceiver"," "+intent.getAction());

//        if (intent.getAction().equals(Intent.ACTION_BOOT_COMPLETED)) {
            Intent mainActivityIntent = new Intent(context, SplashActivity.class);  // 要启动的Activity
            mainActivityIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(mainActivityIntent);
//        }
    }

}
