package com.ddjf.interview.util.msg;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;

import com.ddjf.interview.R;
import com.ddjf.interview.WXApplication;
import com.ddjf.interview.global.PushConstants;
import com.ddjf.interview.receiver.HuaweiPushRevicer;
import com.ddjf.interview.receiver.NotificationBroadcastReceiver;
import com.ddjf.interview.util.DateUtils;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.SharedPreferenceUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Date;

import static com.ddjf.interview.receiver.HuaweiPushRevicer.ACTION_TOKEN;

/**
 * Created by yejunrong on 18/4/19.
 * 消息 处理
 */

public class HWPushHandler {
    static String TAG = "HWPushHandler";
    static String fileterMsg = "\\^\\[NotificationBar\\]\\$";
    public static void handlerMsg(Context context,Intent intent) throws JSONException {
        if (intent != null) {
            String action = intent.getAction();
            Bundle b = intent.getExtras();
            if (b != null && ACTION_TOKEN.equals(action)) {

                WXApplication.mHWPushToken = b.getString(ACTION_TOKEN);
                LogManager.infoLog(TAG,"获取当前的华为消息推送token==="+WXApplication.mHWPushToken);

            } else if (b != null && HuaweiPushRevicer.ACTION_UPDATEUI.equals(action)) {
                String log = b.getString(HuaweiPushRevicer.ACTION_UPDATEUI);
                LogManager.infoLog(TAG,"华为push 广播返回onReceive=="+log);

            }else if(b !=null && HuaweiPushRevicer.PUSH_MSG.equals(action)){
                //消息  推送
                String msg = b.getString(HuaweiPushRevicer.PUSH_MSG);
                LogManager.infoLog(TAG,"获取的消息==="+msg);

                //透传消息
                showNotification(context,new JSONObject(msg));
            }else if(b !=null && HuaweiPushRevicer.PUSH_ERROR_MSG.equals(action)){
                //接受到错误的消息 推送
                String msg = b.getString(HuaweiPushRevicer.PUSH_ERROR_MSG);
                LogManager.errorLog(TAG,"错误消息==="+msg);
            }

        }
    }

    /**
     * 根据消息内容弹出通知框
     *
     * @param context
     * @param jsonObject
     */
    public static void showNotification(Context context, JSONObject jsonObject) {
        String title = jsonObject.optString(PushConstants.TITLE);
        String content = jsonObject.optString(PushConstants.CONTENT);
        if(TextUtils.isEmpty(title)){
            title = "业务系统消息";
        }
        if (TextUtils.isEmpty(content)) {
            return;
        }

        /**  对消息体 进行过滤，目前只展示进入抢单池的消息 **/
        if(content.split(fileterMsg).length == 0 ){
            LogManager.infoLog(TAG,"消息被过滤掉了！"+jsonObject.toString());
            return;
        }
        content = content.split(fileterMsg)[0];


        String currentPhone = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE);
        SharedPreferenceUtil.setData(SharedPreferenceUtil.RECENT_MESSAGE_TAG+currentPhone,jsonObject.toString());

        int pageNum = jsonObject.optInt(PushConstants.PAGE_NUMBER);
        String contentId = jsonObject.optString(PushConstants.CONTENT_ID);
        Long taskTime = jsonObject.optLong(PushConstants.SEND_TIME);
        String applyNo = jsonObject.optString(PushConstants.APPLY_NO);
        //设置点击通知后是发送广播，传递对应的数据
        Intent broadcastIntent = new Intent(context, NotificationBroadcastReceiver.class);
        Bundle bundle = new Bundle();
        bundle.putInt(PushConstants.PAGE_NUMBER, pageNum);
        bundle.putString(PushConstants.CONTENT_ID, contentId);
        bundle.putString(PushConstants.SEND_TIME, DateUtils.formatDate(new Date(taskTime), DateUtils.DATA_FORMAT_ALL));
        bundle.putString(PushConstants.CONTENT, content);
        bundle.putString(PushConstants.APPLY_NO, applyNo);
        broadcastIntent.putExtras(bundle);
        PendingIntent pendingIntent = PendingIntent.
                getBroadcast(context, NotificationUtils.getRandowReqCode(), broadcastIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        NotificationUtils.showIntentNotification(context, title, content, title, pendingIntent, R.drawable.logo, R.drawable.logo);
    }

}
