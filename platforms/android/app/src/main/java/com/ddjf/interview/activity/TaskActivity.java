package com.ddjf.interview.activity;

import android.content.Intent;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.view.KeyEvent;
import android.view.View;

import com.ddjf.interview.R;
import com.ddjf.interview.log_manager.LogManager;
import com.taobao.weex.WXSDKInstance;
import com.taobao.weex.common.WXRenderStrategy;
import com.taobao.weex.ui.component.NestedContainer;

/**
 * Created by yejunrong on 18/4/17.
 */

public class TaskActivity extends BaseActivity implements
        WXSDKInstance.NestedInstanceInterceptor {
    private Handler uiHandler = new Handler(){
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what){
                case 0:
                    //渲染 页面
                    mInstance.renderByUrl(
                            getPageName(),
                            mCurrentPageUri,
                            null,
                            null,
                            WXRenderStrategy.APPEND_ASYNC);
                    break;
            }
        }
    };

    @Override
    public void onCreateNestInstance(WXSDKInstance instance, NestedContainer container) {

    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
    }


    @Override
    public void jumpPage(String pageUri) {
        super.jumpPage(pageUri);
        LogManager.infoLog(TAG, "要去到的js===== " + pageUri.toString());

        if (null != pageUri) {
            Intent intent = new Intent(TaskActivity.this, WXPageActivity.class);
            intent.putExtra("path", pageUri + "");
            startActivity(intent);
            finish();
        }

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_wxpage);

        mCurrentPageUri = loadPage(getIntent().getStringExtra("path"));
        if (null != mCurrentPageUri) {
            LogManager.infoLog(TAG,"渲染页面的文件=="+mCurrentPageUri);
            //渲染 页面
            uiHandler.sendEmptyMessage(0);
        }


    }

    @Override
    public void onViewCreated(WXSDKInstance instance, View view) {
        setContentView(view);
    }

    @Override
    public void onRenderSuccess(WXSDKInstance instance, int width, int height) {
        LogManager.infoLog("", "");
    }

    @Override
    public void onRefreshSuccess(WXSDKInstance instance, int width, int height) {
        LogManager.infoLog("", "");
    }

    @Override
    public void onException(WXSDKInstance instance, String errCode, String msg) {
//        LogManager.infoLog("", msg);
    }


    @Override
    public void onResume() {
        super.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
    }

    @Override
    public void onStop() {
        super.onStop();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        LogManager.infoLog(TAG," activity destroy");
    }

    public boolean onKeyDown(int keyCode, KeyEvent event) {

        return super.onKeyDown(keyCode,event);
    }


}

