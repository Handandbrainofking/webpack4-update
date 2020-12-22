package com.ddjf.interview.views;

import android.app.ProgressDialog;
import android.content.Context;
import android.os.Bundle;
import android.view.WindowManager;

import com.ddjf.interview.R;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.DateUtils;

import java.util.Date;

/**
 * Created by yejunrong on 18/7/19.
 *
 * 自定义加载对话框
 */
public class CustomDialog extends ProgressDialog {
    boolean isCancelable = true;
    Object mTag = new Object();
    public CustomDialog(Context context) {
        super(context);
    }

    public CustomDialog(Context context, int theme,boolean isCancelable ) {
        super(context, theme);
        this.isCancelable = isCancelable;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        init(getContext());
    }

    private void init(Context context) {
        setCanceledOnTouchOutside(isCancelable);

        setContentView(R.layout.load_dialog);
        WindowManager.LayoutParams params = getWindow().getAttributes();
        params.width = WindowManager.LayoutParams.WRAP_CONTENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        getWindow().setAttributes(params);
    }


    @Override
    public void show() {
        super.show();
        this.mTag = new Date();
        LogManager.infoLog("CustomDialog","弹出框显示的开始时间="+
                DateUtils.getStringDate(DateUtils.DATA_FORMAT_TIME_));
    }

    @Override
    public void dismiss() {
        super.dismiss();
        if(null != this.mTag){
            long timeDiff = (new Date().getTime() - ((Date)this.mTag).getTime());
            LogManager.infoLog("CustomDialog","弹出框显示的时长="+ timeDiff);
            if(timeDiff > 4000){
                LogManager.infoLog("CustomDialog","弹出框显示的时长超4秒了，请注意！时长="+ timeDiff);
            }
            this.mTag = null;
        }
    }
}