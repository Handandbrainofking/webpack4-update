package com.ddjf.interview.global;

/**
 * Created by yejunrong on 18/3/20.
 */


/**
 * @description: 推送的常量配置
 * @date 2017/4/26  11:31
 */
public class PushConstants {
    //穿透消息事例
    //{isNotification:1,msgContent:"您在2018-12-13有面签任务,请您准时办理",id: "10010100",
    // sendTime:"时间戳",applyNo:"SZXXXXX",pageNumber:1002}

    /**
     * 属于通知
     */
    public static final String IS_NOTIFICATION = "isNotification";
    /**
     * 标题
     */
    public static final String TITLE = "title";
    /**
     * 内容
     */
    public static final String CONTENT = "msgContent";
    /**
     * applyNo
     */
    public static final String APPLY_NO = "applyNo";
    /**
     * 内容的id
     */
    public static final String CONTENT_ID = "id";
    /**
     * 任务时间
     */
    public static final String SEND_TIME = "sendTime";

    /**
     * 对应打开页面的编号
     */
    public static final String PAGE_NUMBER = "pageNumber";

    /** 主页面 */
    public static final int PAGE_MAIN = 0;

    /**
     * 订单详情页
     */
    public static final int PAGE_ORDER_DETAIL = 1000;

    /**
     * 消息中心
     */
    public static final int PAGE_MESSAGE_CENTER = 1001;

    /**
     * 任务处理
     */
    public static final int TASK_HANDLER = 1002;

    /**
     * 任务处理
     */
    public static final int UPDATA_JS_BUNDLE = 1003;


    //******************************推送提醒***********************************************

    public static final String NOTIFY_TYPE = "notifyType";

    public static final String UNREAD_COUNT = "unReadCount";

    /**
     * 消息中心的提醒
     */
    public static final int MESSAGE_CENTER_NOTIFY = 2000;

}
