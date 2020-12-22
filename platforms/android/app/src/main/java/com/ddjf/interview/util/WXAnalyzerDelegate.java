package com.ddjf.interview.util;

import android.content.Context;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;

import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.taobao.weex.WXSDKInstance;

import java.lang.ref.WeakReference;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

/**
 * 内存调试工具
 */
public final class WXAnalyzerDelegate {
    private Object mWXAnalyzer;
    static String TAG = "WXAnalyzerDelegate";
    WeakReference<Context> contextWeakReference ;

    @SuppressWarnings("unchecked")
    public WXAnalyzerDelegate(@Nullable Context context) {
        if (context == null) {
            return;
        }
        try {
            contextWeakReference = new WeakReference<>(context);
            Class clazz = Class.forName("com.taobao.weex.analyzer.WeexDevOptions");
            Constructor constructor = clazz.getDeclaredConstructor(Context.class);
            mWXAnalyzer = constructor.newInstance(contextWeakReference.get());
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }

    public void registerExtraOption(String optionName, int iconRes, Runnable runnable) {
        if (mWXAnalyzer == null) {
            return;
        }
        if (TextUtils.isEmpty(optionName) || runnable == null) {
            return;
        }
        try {
            Method method = mWXAnalyzer.getClass().getDeclaredMethod("registerExtraOption", String.class, int.class, Runnable.class);
            method.invoke(mWXAnalyzer, optionName, iconRes, runnable);
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }

    public void onReceiveTouchEvent(MotionEvent ev) {
        if(mWXAnalyzer == null) {
            return;
        }
        try {
            Method method = mWXAnalyzer.getClass().getDeclaredMethod("onReceiveTouchEvent", MotionEvent.class);
            method.invoke(mWXAnalyzer,ev);
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }

    public void onCreate() {
        if (mWXAnalyzer == null) {
            return;
        }
        try {
            Method method = mWXAnalyzer.getClass().getDeclaredMethod("onCreate");
            method.invoke(mWXAnalyzer);
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }


    public void onStart() {
        if (mWXAnalyzer == null) {
            return;
        }
        try {
            Method method = mWXAnalyzer.getClass().getDeclaredMethod("onStart");
            method.invoke(mWXAnalyzer);
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }

    public void onResume() {
        if (mWXAnalyzer == null) {
            return;
        }
        try {
            Method method = mWXAnalyzer.getClass().getDeclaredMethod("onResume");
            method.invoke(mWXAnalyzer);
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }


    public void onPause() {
        if (mWXAnalyzer == null) {
            return;
        }
        try {
            Method method = mWXAnalyzer.getClass().getDeclaredMethod("onPause");
            method.invoke(mWXAnalyzer);
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }

    public void onStop() {
        if (mWXAnalyzer == null) {
            return;
        }
        try {
            Method method = mWXAnalyzer.getClass().getDeclaredMethod("onStop");
            method.invoke(mWXAnalyzer);
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }

    public void onDestroy() {
        if (mWXAnalyzer == null) {
            return;
        }
        try {
            Method method = mWXAnalyzer.getClass().getDeclaredMethod("onDestroy");
            method.invoke(mWXAnalyzer);
            if(null!=contextWeakReference && null!=contextWeakReference.get()){
                contextWeakReference.clear();
                contextWeakReference = null;
            }
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }


    public void onWeexRenderSuccess(@Nullable WXSDKInstance instance) {
        if (mWXAnalyzer == null || instance == null) {
            return;
        }
        try {
            Method method = mWXAnalyzer.getClass().getDeclaredMethod("onWeexRenderSuccess", WXSDKInstance.class);
            method.invoke(mWXAnalyzer, instance);
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }

    }


    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (mWXAnalyzer == null) {
            return false;
        }
        try {
            Method method = mWXAnalyzer.getClass().getDeclaredMethod("onKeyUp", int.class, KeyEvent.class);
            return (boolean) method.invoke(mWXAnalyzer, keyCode, event);
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
            return false;
        }
    }

    public void onException(WXSDKInstance instance, String errCode, String msg) {
        if (mWXAnalyzer == null) {
            return;
        }
        if (TextUtils.isEmpty(errCode) && TextUtils.isEmpty(msg)) {
            return;
        }
        try {
            Method method = mWXAnalyzer.getClass().getDeclaredMethod("onException", WXSDKInstance.class, String.class, String.class);
            method.invoke(mWXAnalyzer, instance, errCode, msg);
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }

    public View onWeexViewCreated(WXSDKInstance instance, View view) {
        if (mWXAnalyzer == null || instance == null || view == null) {
            return null;
        }
        try {
            Method method = mWXAnalyzer.getClass().getDeclaredMethod("onWeexViewCreated", WXSDKInstance.class, View.class);
            View retView = (View) method.invoke(mWXAnalyzer, instance, view);
            return retView;
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
            return view;
        }
    }

}
