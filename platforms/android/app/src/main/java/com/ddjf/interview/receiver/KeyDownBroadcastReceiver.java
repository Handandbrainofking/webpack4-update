package com.ddjf.interview.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.ddjf.interview.log_manager.LogManager;

import static com.ddjf.interview.util.SystemUtils.getActivityStatus;

/**
 * 按键监听
 *
 */
public class KeyDownBroadcastReceiver extends BroadcastReceiver {
    String TAG = "KeyDownBroadcastReceiver";

    final String SYSTEM_DIALOG_REASON_KEY = "reason";

    final String SYSTEM_DIALOG_REASON_RECENT_APPS = "recentapps";

    final String SYSTEM_DIALOG_REASON_HOME_KEY = "homekey";

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (Intent.ACTION_CLOSE_SYSTEM_DIALOGS.equals(action)) {
            String reason = intent.getStringExtra(SYSTEM_DIALOG_REASON_KEY);
            if (reason != null) {
                if (reason.equals(SYSTEM_DIALOG_REASON_HOME_KEY) || reason.equals(SYSTEM_DIALOG_REASON_RECENT_APPS)) {
                    LogManager.infoLog(TAG, "触发Home键或者menu键 的按钮事件");
                    getActivityStatus(context);
//                    Intent mainActivityIntent = new Intent(context, SplashActivity.class);
//                    mainActivityIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//                    context.startActivity(mainActivityIntent);
                }
            }
        }
    }
}

