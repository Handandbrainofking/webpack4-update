package com.ddjf.interview.js_interactive_native.component;

import android.content.Context;
import android.support.annotation.NonNull;
import android.webkit.WebView;

import com.ddjf.interview.log_manager.LogManager;
import com.taobao.weex.WXSDKInstance;
import com.taobao.weex.ui.action.BasicComponentData;
import com.taobao.weex.ui.component.WXComponent;
import com.taobao.weex.ui.component.WXComponentProp;
import com.taobao.weex.ui.component.WXVContainer;

public class DDWebviewComponent extends WXComponent<WebView> {
    String TAG = "DDWebviewComponent";
    public DDWebviewComponent(WXSDKInstance instance, WXVContainer parent, BasicComponentData basicComponentData) {
        super(instance, parent, basicComponentData);
    }

    public DDWebviewComponent(WXSDKInstance instance, WXVContainer parent, int type, BasicComponentData basicComponentData) {
        super(instance, parent, type, basicComponentData);
    }

    @Override
    protected WebView initComponentHostView(@NonNull Context context) {
        WebView webView = new WebView(context);

        return webView;
    }

    @WXComponentProp(name = "src")
    public void setUrl(String src){
        if(getHostView() == null || src == null || src.equals("")){
            return;
        }
        getHostView().loadUrl(src);
        LogManager.infoLog(TAG,"加载的url地址="+src);
    }
}
