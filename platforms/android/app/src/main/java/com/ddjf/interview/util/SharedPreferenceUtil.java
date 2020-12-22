package com.ddjf.interview.util;

import android.content.Context;
import android.content.SharedPreferences;

import com.ddjf.interview.WXApplication;

/**
 * Created by yejunrong on 18/5/19.
 */

public class SharedPreferenceUtil {
    public static String SPName = "";
    public static final String CURRENT_LOGIN_MOBILE="current_login_mobile";
    public static final String CURRENT_LOGIN_USERID="current_login_userId";
    public static final String CURRENT_LOGIN_TOKEN="current_login_token";
    public static final String CURRENT_LOGIN_COMPANYCODE = "current_login_companyCode";
    public static final String CURRENT_LOGIN_COMPANYNAME = "current_login_companyName";
    //当前登录用户存入数据库表的ID
    public static final String CURRENT_USER_LOGIN_DB_ID ="current_login_db_id";

    //是否强制更新系统属性
    public static final String FORCE_UPDATE_SYSTEM_PROPERTY = "force_update_system_property";

    //更新系统属性的时间
    public static final String UPDATE_SYSTEM_TIME_PROPERTY = "update_system_time_property";

    //log文件上传时间
    public static final String LOG_FILE_UPLOAD_TIME = "log_file_upload_time";

    //最新一条消息
    public static final String RECENT_MESSAGE_TAG="recent_msg_tag";

    //定位服务状态
    public static final String LOCATION_SERVER_STATUS="location_server_status";

    //字典缓存
    public static final String SYSTEM_DIC_CACHE="system_dic_cache";

    //技术平台日志相关信息
    public static final String PLATFORM_LOG_ACCESSKEYID="platform_log_accesskeyid";
    public static final String PLATFORM_LOG_ACCESSKEYSECRET="platform_log_accesskeysecret";
    public static final String PLATFORM_LOG_SECURITYTOKEN="platform_log_securitytoken";
    public static final String PLATFORM_LOG_EXPIRATION="platform_log_expiration";
    public static final String PLATFORM_LOG_STATUS="platform_log_status";
    public static final String PLATFORM_LOG_FAILURE_COUNT="platform_log_failure_count";
    public static final String PLATFORM_LOG_HTTP_TOKEN_REQUEST_TIME="PLATFORM_LOG_HTTP_TOKEN_REQUEST_TIME";//token http请求时间差

    public static void setData(String key, Object value) {
        SharedPreferences sp = WXApplication.mAppInstance.getSharedPreferences(SPName, Context.MODE_PRIVATE);
        SharedPreferences.Editor  edit = sp.edit();
        if(value instanceof Long){
            edit.putLong(key, (Long)value);
        }else if(value instanceof String){
            edit.putString(key, (String)value);
        }else if(value instanceof Boolean){
            edit.putBoolean(key, (Boolean)value);
        }
        edit.commit();
    }


    public static String getDataString(String key) {
        SharedPreferences sp = WXApplication.mAppInstance.getSharedPreferences(SPName, Context.MODE_PRIVATE);
        return sp.getString(key, null);
    }

    public static Long getDataLong(String key) {
        SharedPreferences sp = WXApplication.mAppInstance.getSharedPreferences(SPName, Context.MODE_PRIVATE);
        return sp.getLong(key, 0);
    }

    public static Boolean getDataBoolean(String key) {
        SharedPreferences sp = WXApplication.mAppInstance.getSharedPreferences(SPName, Context.MODE_PRIVATE);
        return sp.getBoolean(key, false);
    }
}
