package com.ddjf.interview.views;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.widget.Button;

import com.ddjf.interview.WXApplication;
import com.ddjf.interview.exception.ExceptionGlobalHandler;

/**
 * 自定义弹出框
 */
public class CustomAlertDialog {


    /**
     * @param title          标题
     * @param message        内容
     * @param okText         确定按钮文字
     * @param cancelText     取消按钮文字
     * @param okListener     确定事件
     * @param cancelListener 取消事件
     */
    public void show(String title, String message, String okText, String cancelText,
                     DialogInterface.OnClickListener okListener, DialogInterface.OnClickListener cancelListener) {
        try {
            AlertDialog.Builder builder = new AlertDialog.Builder(WXApplication.mAppInstance);
            title = null == title ? "温馨提示" : title;
            cancelText = null == cancelText ? "取消" : cancelText;
            okText = null == okListener ? "确定" : okText;
            builder.setTitle(title);
            builder.setNegativeButton(cancelText, cancelListener);
            builder.setPositiveButton(okText, okListener);
            builder.setMessage(null == message ? "":message);
            builder.setCancelable(false);
            final AlertDialog noticeDialog = builder.create();
            noticeDialog.setOnShowListener(new DialogInterface.OnShowListener() {
                @Override
                public void onShow(DialogInterface dialog) {
                    //修改按钮颜色
                    Button button = noticeDialog.getButton(AlertDialog.BUTTON_POSITIVE);
                    button.setTextColor(Color.rgb(2, 179, 180));
                    button = noticeDialog.getButton(AlertDialog.BUTTON_NEGATIVE);
                    button.setTextColor(Color.rgb(2, 179, 180));
                }
            });
            noticeDialog.show();
        }catch (Exception e){
            e.printStackTrace();
            ExceptionGlobalHandler.showException("CustomAlertDialog",e);
        }


    }


}
