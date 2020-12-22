package com.ddjf.interview.http;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.js_interactive_native.module.WXEventResult;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.FileUtils;
import com.ddjf.interview.util.SharedPreferenceUtil;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;
import com.taobao.weex.bridge.JSCallback;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by yejunrong on 18/7/13.
 * js http 的请求处理
 */

public class HttpForJSHandler implements HttpUtils.HttpRequestCallBack {
    String TAG = "js http处理的请求类 HttpForJSHandler";
    private JSCallback mCallback;
    private String mRequestUrl;


    public  HttpForJSHandler(String url,String param,JSCallback callback){
        com.alibaba.fastjson.JSONObject optionsObj = null;
        try {
            mCallback = callback;

            mRequestUrl = url;
            optionsObj = JSON.parseObject(param);
        }catch (JSONException e){
            LogManager.errorLog(TAG, e.getMessage());
            if(null !=callback){
                callback.invoke(WXEventResult.getFailureResult("参数错误"));
            }
            e.printStackTrace();
        }

        if(null == url || url.equals("")){
            LogManager.errorLog(TAG, "url 错误");
            if(null !=callback){
                callback.invoke(WXEventResult.getFailureResult("url 错误"));
            }
            return;
        }

        String method = optionsObj.getString("method");

        com.alibaba.fastjson.JSONObject headers = optionsObj.getJSONObject("headers");
        String body = optionsObj.getString("body");
        final String type = optionsObj.getString("type"); // (String) (json | jsonp | text, default: json)
        int timeout = optionsObj.getIntValue("timeout"); //超时时间
        Request.Builder headerBuilder = new Request.Builder();
        extractHeaders(headers,headerBuilder,type);

        //默认走get方法
        if(null==method || method.toLowerCase().equals("get") ||method.equals("")){

            HttpUtils.httpGetRequest(url,body,headerBuilder,this);
        }else if(null!=method && method.toLowerCase().equals("post")){
            HttpUtils.httpPostRequest(url,body,headerBuilder,this);

        }else{
            LogManager.errorLog(TAG, "参数错误！具体参数 method="+method+" headers="+headers.toJSONString()+
                    " body="+body+" type="+type+" timeout="+timeout);
            if(null !=callback){
                callback.invoke(WXEventResult.getFailureResult("参数错误"));
            }
        }
    }

    @Override
    public void onFailure(Request request, Exception e) {
        if(null != mCallback){
            mCallback.invoke(WXEventResult.getFailureResult("网络请求失败:"+e.getMessage()));
        }
        LogManager.errorLog(TAG,"网络请求失败："+e.getMessage());
    }

    @Override
    public void onSuccess(Response response) {
        try {
            String result = response.body().string();
            String contentType = response.headers().get("Content-Type");
            String contentLength = response.headers().get("Content-Length");
            LogManager.infoLog(TAG, " 请求url=" + response.request().urlString() +" 返回结果=" + result);
            if(null != mCallback){
                JSONObject object = new JSONObject();
                JSONObject resultObject = new JSONObject();
                 object.put("status",200);
                if(null != contentType && contentType.equals("text/html;charset=UTF-8")) {
                    //生成Html文件 13199998888_12345678.html(当前手机号_客户编号.html)

                    String fileName = "";

                    if(mRequestUrl.indexOf(HttpApi.BPMS_GET_CREDIT_DETAIL) > 0){
                        String customerNo = mRequestUrl.split("customerNo=")[1];
                        //获取的征信报告，需要做特殊处理
                        result = handleCreditreport(result);

                        fileName = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE) + "_"
                                + customerNo +".html";
                    }

                    if(mRequestUrl.indexOf("getNoticeDetail") > 0){ //获取公告详细
                        String dingMsgId = mRequestUrl.split("dingMsgId=")[1];
                        fileName = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE) +
                                "msg_"+dingMsgId+".html";
                    }

                    File jsFile = new File(FileUtils.FileCacheDir, fileName);
                    if(!new File(FileUtils.FileCacheDir).exists()){
                        FileUtils.forceMkdirs(FileUtils.FileCacheDir);
                    }

                    if(!jsFile.exists() && jsFile.length()<10){
                        jsFile.createNewFile();
                        FileUtils.savePackageFile(fileName,FileUtils.FileCacheDir,result.getBytes());
                    }

                    resultObject.put("code", 200);
                    resultObject.put("msg", "成功");
                    JSONObject dataResultObject = new JSONObject();
                    dataResultObject.put("path","file://" + jsFile.getAbsolutePath());
                    resultObject.put("result",  dataResultObject);
                    resultObject.put("success", true);
                    object.put("data", resultObject.toJSONString());
                } else if (null != contentLength && contentLength.equals("0")) {
                    resultObject.put("code", 200);
                    resultObject.put("msg", "成功");
                    resultObject.put("result", "");
                    object.put("success", true);
                    object.put("data", resultObject.toJSONString());
                } else {
                    object.put("data", result);
                }
                mCallback.invoke(WXEventResult.getResult(object.toJSONString()));
            }
        }catch (Exception e){
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }

    /**
     * 处理征信报告，目前只展示第三部分
     *
     */
    private String handleCreditreport(String data){
        String startContent = "",loadInfoDivContent = "",lastContent = "";
        try{
            //找到第一个<div
            int startDivStart = data.indexOf("<div>");
            startContent = data.substring(0,startDivStart+5);

            //贷款信息
            String loadInfoArr[] = data.split(">三、");
            //往前找到第一个<div
            int loadInfoDivStart = loadInfoArr[0].lastIndexOf("<div");

            //公共信息明细
            String commonInfoArr[] = data.split(">四、");
            //往前找到第一个<div
            int commonInfoDivStart = commonInfoArr[0].lastIndexOf("<div");

            //贷款信息部分内容
            loadInfoDivContent = data.substring(loadInfoDivStart,commonInfoDivStart);
            loadInfoDivContent = loadInfoDivContent.replace("三、","");//找到div里面的数据，如果过长则换行处理
            String loadInfoDiv[] = loadInfoDivContent.split("<div");
            for(String item : loadInfoDiv){
                if(null == item || item.length()< 10){
                    continue;
                }
                //找到div的标签
                int firstDiv = item.indexOf(">");
                //找到div的结束标签
                int divEnd = item.indexOf("</div>");
                if(divEnd < 100){
                   continue;
                }
                String content = item.substring(firstDiv,divEnd).trim();
                //获取div class
                String classContent = item.substring(0,firstDiv);

                if(content.length() > 200){
                    content = content.substring(150,195).trim();
                    if(content.length()<15){
                        continue;
                    }
                    int index = loadInfoDivContent.indexOf(content)+content.length();
                    loadInfoDivContent = loadInfoDivContent.substring(0,index)
                            + "</div><div style='font-weight: bolder;margin-top:1px;'>" +
                            loadInfoDivContent.substring(index,loadInfoDivContent.length());
                }
            }
            //找到最后一个table
            int lastTableIndex = data.lastIndexOf("</table>");
            //剩余内容部分
            lastContent = data.substring(lastTableIndex+8,data.length());

        }catch (Exception e){
            LogManager.infoLog(TAG,"裁剪、解析征信报告出错 "+ e.getMessage());
            ExceptionGlobalHandler.showException(TAG,e);
            e.printStackTrace();
        }
        return startContent + loadInfoDivContent + lastContent;
    }

    /**
     *  http请求头
     *
     * @return
     */
    private void extractHeaders(com.alibaba.fastjson.JSONObject headers, Request.Builder builder, String type){
        if(headers != null){
            for (String key : headers.keySet()) {
                builder.addHeader(key, headers.getString(key));
            }
        }
        builder.addHeader("platform", "android");
        switch (type) {
            case "text":
                builder.addHeader("Content-Type", "text/plain");
                break;
            case "json":
                builder.addHeader("Content-Type", "application/json");
                break;
            case "jsonp":
                builder.addHeader("Content-Type", "text/javascript");
                break;
        }
    }
}
