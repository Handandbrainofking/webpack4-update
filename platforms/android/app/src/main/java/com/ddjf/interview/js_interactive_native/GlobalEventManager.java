package com.ddjf.interview.js_interactive_native;

import com.ddjf.interview.log_manager.LogManager;
import com.taobao.weex.WXSDKInstance;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by yejunrong on 18/3/14.
 *
 * 所有向js发送数据的管理类
 */

public class GlobalEventManager {

    /**
     * 将String类型的值传送到js页面上
     * @param instance
     * @param value
     * @param listenerKey js🔚eventListener 接受的key
     *
     */
    public static void pushStringToJs(WXSDKInstance instance, String value,String listenerKey){
        if(null==instance){
            LogManager.infoLog("GlobalEventManager"," null");
            return;
        }
        Map<String, Object> map = new HashMap<>();
        map.put("value", value);
        instance.fireGlobalEventCallback(listenerKey, map);
    }

    /**
     * 将对象类型push到js页面上
     * @param instance
     * @param map
     * @param listenerKey
     */
    public static void pushMessageToJs(WXSDKInstance instance, Map<String, Object> map,String listenerKey) {
        if (instance != null) {
            instance.fireGlobalEventCallback("pushMessage", map);
        }

    }

}
