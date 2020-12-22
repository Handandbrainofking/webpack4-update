/*
 * Copyright (C) Huawei Technologies Co., Ltd. 2016. All rights reserved.
 * See LICENSE.txt for this sample's licensing information.
 */

package com.ddjf.interview.receiver;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.huawei.hms.support.api.push.PushReceiver;

import org.json.JSONException;

import java.util.ArrayList;
import java.util.List;

/**
 * 应用需要创建一个子类继承com.huawei.hms.support.api.push.PushReceiver，
 * 实现onToken，onPushState ，onPushMsg，onEvent，这几个抽象方法，用来接收token返回，push连接状态，透传消息和通知栏点击事件处理。
 * onToken 调用getToken方法后，获取服务端返回的token结果，返回token以及belongId
 * onPushState 调用getPushState方法后，获取push连接状态的查询结果
 * onPushMsg 推送消息下来时会自动回调onPushMsg方法实现应用透传消息处理。本接口必须被实现。 在开发者网站上发送push消息分为通知和透传消息
 *           通知为直接在通知栏收到通知，通过点击可以打开网页，应用 或者富媒体，不会收到onPushMsg消息
 *           透传消息不会展示在通知栏，应用会收到onPushMsg
 * onEvent 该方法会在设置标签、点击打开通知栏消息、点击通知栏上的按钮之后被调用。由业务决定是否调用该函数。
 *
 * Application needs to create a subclass to inherit com.huawei.hms.support.api.push.PushReceiver,
 * implement Ontoken,onpushstate, Onpushmsg,onevent,
 * these several abstract methods, Used to receive token return, push connection status,
 * pass through message and notification bar click event handling.
 * After Ontoken calls the GetToken method, gets the token result returned by the server, returns token,
 * and after Belongidonpushstate invokes the Getpushstate method,
 * gets the query result of the push connection state onpushmsg When a push message comes down,
 * it will automatically callback the Onpushmsg method to implement the application of the message processing.
 * This interface must be implemented.
 * On the developer website to send a push message is divided into notification and message notification for direct notification in the notice bar,
 * by clicking can open the Web page, application or rich media,
 * will not receive ONPUSHMSG messages will not be displayed in the notification bar,
 * application will receive onpushmsgonevent the method will It is called after you set the label,
 * click to open the Notification bar message, and click the button on the notification bar.
 * The business decides whether to call the function.
 */
public class HuaweiPushRevicer extends PushReceiver {

	public static final String TAG = "HuaweiPushRevicer";

    public static String PUSH_MSG = "push.message";
    public static String PUSH_STATE = "push.status";
    public static String PUSH_ERROR_MSG = "push.error.content";
    public static String NOTIFY_ID = "notify.id";
    public static String NOTIFY_MESSAGE = "notify.message";
    public static String NOTIFY_EVENT = "notify.event";

	public static final String ACTION_UPDATEUI = "action.updateUI";
    public static final String ACTION_TOKEN = "action.updateToken";

    private static List<IPushCallback> pushCallbacks = new ArrayList<IPushCallback>();
    private static final Object CALLBACK_LOCK = new Object();

    public interface IPushCallback {
        void onReceive(Intent intent);
    }

    public static void registerPushCallback(IPushCallback callback) {
        synchronized (CALLBACK_LOCK) {
            pushCallbacks.add(callback);
        }
    }

    public static void unRegisterPushCallback(IPushCallback callback) {
        synchronized (CALLBACK_LOCK) {
            pushCallbacks.remove(callback);
        }
    }

    @Override
    public void onToken(Context context, String tokenIn, Bundle extras) {
    	String belongId = extras.getString("belongId");

        Intent intent = new Intent();
        intent.setAction(ACTION_TOKEN);
        intent.putExtra(ACTION_TOKEN, tokenIn);
        callBack(intent);

        intent = new Intent();
        intent.setAction(ACTION_UPDATEUI);
        intent.putExtra(ACTION_UPDATEUI,  belongId);
        callBack(intent);
    }

    @Override
    public boolean onPushMsg(Context context, byte[] msg, Bundle bundle) {
        try {
        	//CP可以自己解析消息内容，然后做相应的处理 | CP can parse message content on its own, and then do the appropriate processing
            String content = new String(msg, "UTF-8");
            Intent intent = new Intent();
            intent.setAction(PUSH_MSG);
            intent.putExtra(PUSH_MSG,  content);
            callBack(intent);
        } catch (Exception e) {
            Intent intent = new Intent();
            intent.setAction(PUSH_ERROR_MSG);
            intent.putExtra(PUSH_ERROR_MSG, e.getMessage());
            callBack(intent);
            ExceptionGlobalHandler.showException(TAG,e);

        }
        return false;
    }

    //通知栏事件
    public void onEvent(Context context, Event event, Bundle extras) {
        Intent intent = new Intent();
        intent.setAction(NOTIFY_EVENT);

        int notifyId = 0;
        if (Event.NOTIFICATION_OPENED.equals(event) || Event.NOTIFICATION_CLICK_BTN.equals(event)) {
            notifyId = extras.getInt(BOUND_KEY.pushNotifyId, 0);
            if (0 != notifyId) {
                NotificationManager manager = (NotificationManager) context
                        .getSystemService(Context.NOTIFICATION_SERVICE);
                manager.cancel(notifyId);
            }
        }

        String message = extras.getString(BOUND_KEY.pushMsgKey);
        intent.putExtra(NOTIFY_ID, notifyId);
        intent.putExtra(NOTIFY_MESSAGE, message);
        callBack(intent);
        super.onEvent(context, event, extras);
    }

    @Override
    public void onPushState(Context context, boolean pushState) {
        Intent intent = new Intent();
        intent.setAction(PUSH_STATE);
        intent.putExtra(PUSH_STATE,  pushState);
        callBack(intent);
    }

    private static void callBack(Intent intent) {
        synchronized (CALLBACK_LOCK) {
            for (IPushCallback callback : pushCallbacks) {
                if (callback != null) {
                    callback.onReceive(intent);
                }
            }
        }
    }
}
