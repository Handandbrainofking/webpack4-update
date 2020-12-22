package com.ddjf.interview.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.ddjf.interview.activity.TaskActivity;
import com.ddjf.interview.activity.WXPageActivity;
import com.ddjf.interview.global.PushConstants;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.SystemUtils;

import java.util.ArrayList;
import java.util.List;

/***
 *
 * 通知栏消息--点击后的处理，广播
 *
 */
public class NotificationBroadcastReceiver extends BroadcastReceiver {

    public static final String TAG = NotificationBroadcastReceiver.class.getSimpleName();
    private List<Intent> intentList;

    @Override
    public void onReceive(Context context, Intent intent) {
        Bundle bundle = intent.getExtras();
        int pageNum = bundle.getInt(PushConstants.PAGE_NUMBER, 0);
        String contentId = bundle.getString(PushConstants.CONTENT_ID, "");

        Intent destinationIntent = null;//目标intent
        switch (pageNum) {
            case PushConstants.PAGE_ORDER_DETAIL:
                //订单详情页
//                destinationIntent = new Intent(context, OrderDetailActivity.class);
//                destinationIntent.putExtra(OrderDetailActivity.ORDER_ID, contentId);//传订单的id
                break;
            case PushConstants.PAGE_MESSAGE_CENTER:
                //消息中心
//                destinationIntent = new Intent(context, MessageCenterActivity.class);
                break;

            case PushConstants.UPDATA_JS_BUNDLE:
            case PushConstants.TASK_HANDLER :
                //任务消息
                String taskTiem = bundle.getString(PushConstants.SEND_TIME, "");
                String content = bundle.getString(PushConstants.CONTENT, "");
                String applyNo = bundle.getString(PushConstants.APPLY_NO, "");
                destinationIntent = new Intent(context, TaskActivity.class);
                //判断是否为抢单消息，然后调整到抢单池
                String uri = "file://assets/dist/index.js?type=3";
                destinationIntent.putExtra("path", uri + "");
                bundle.putString("path",uri);

                break;
        }

        if (SystemUtils.isAppAlive(context, context.getPackageName())) {
            //如果存活的话，就直接启动目标Activity，但要考虑一种情况，就是app的进程虽然仍然在
            //但Task栈已经空了，比如用户点击Back键退出应用，但进程还没有被系统回收，如果直接启动
            //目标Activity,再按Back键就不会返回MainActivity了。所以在启动 目标Activity前，要先启动MainActivity。
            //将MainAtivity的launchMode设置成SingleTask, 或者在下面flag中加上Intent.FLAG_CLEAR_TOP,
            //如果Task栈中有MainActivity的实例，就会把它移到栈顶，把在它之上的Activity都清理出栈，
            //如果Task栈不存在MainActivity实例，则在栈顶创建

            LogManager.infoLog(TAG, "the app process is alive");
            Intent mainIntent = new Intent(context, WXPageActivity.class);
            mainIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            if (intentList == null){
                intentList = new ArrayList<Intent>();
            }
            intentList.add(mainIntent);
            //如果目标intent不为空，一起打开
            if (destinationIntent != null){
                intentList.add(destinationIntent);
            }
            context.startActivities(intentList.toArray(new Intent[intentList.size()]));
        } else {
            //如果app进程已经被杀死，先重新启动app，将目标Activity的启动参数传入Intent中，参数经过
            //SplashActivity传入MainActivity，此时app的初始化已经完成，在MainActivity中就可以根据传入
            // 参数跳转到目标Activity中去了
            Log.i(TAG, "the app process is dead");
            Intent launchIntent = context.getPackageManager().
                    getLaunchIntentForPackage(context.getPackageName());
            launchIntent.setFlags(
                    Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
            launchIntent.putExtras(bundle);
            context.startActivity(launchIntent);
        }
    }
}
