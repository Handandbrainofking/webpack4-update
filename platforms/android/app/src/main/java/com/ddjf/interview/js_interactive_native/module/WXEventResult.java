package com.ddjf.interview.js_interactive_native.module;

import com.alibaba.fastjson.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by yejunrong on 18/6/4.
 * js数据返回统一格式
 * {
 * "code":-1/0,
 * "msg":"失败"/"成功",
 * "data":{对象}/{[对象]}
 * }
 *
 */

public class WXEventResult {
    private WXEventResult(){

    }

    public static Map<String,Object> getResult(String dataStr){
        Map<String,Object> data = new HashMap<>();
        data.put("code",0);
        data.put("success",true);
        data.put("msg","成功");
        data.put("result",dataStr);

        return data;
    }
    public static Map<String,Object> getFailureResult(String dataStr){
        Map<String,Object> data = new HashMap<>();
        data.put("code",-1);
        data.put("success",false);
        data.put("msg","失败！具体原因:"+dataStr);

        return data;
    }

    public static Map<String,Object> getFailureResult(String dataStr,String code){
        Map<String,Object> data = new HashMap<>();
        data.put("code",code);
        data.put("success",false);
        data.put("msg","失败！具体原因:"+dataStr);

        return data;
    }

}
