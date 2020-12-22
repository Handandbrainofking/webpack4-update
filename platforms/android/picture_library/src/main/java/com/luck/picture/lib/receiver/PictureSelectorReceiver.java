package com.luck.picture.lib.receiver;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Intent;

public class PictureSelectorReceiver {
    public static String PICTURE_SELECT_RECEIVER_ACTION = "com.luck.picture.lib.receiver.PictureSelectorReceiver";
    public static String PICTURE_SELECT_RECEIVER_APPLY_NO = "applyNo";
    public static String PICTURE_SELECT_RECEIVER_FILE_KEY = "fileKey";
    public static String PICTURE_SELECT_RECEIVER_ROTATE = "rotate";
    public static String PICTURE_SELECT_RECEIVER_TYPE = "type";
    public static int PICTURE_SELECT_RECEIVER_TYPE_DELETE = 0;
    public static int PICTURE_SELECT_RECEIVER_TYPE_ROTATE = 1;

    public static void deleteImage(Activity activity, String applyNo, String fileKey) {
        Intent intent = new Intent();
        intent.setAction(PICTURE_SELECT_RECEIVER_ACTION);
        intent.putExtra(PICTURE_SELECT_RECEIVER_TYPE, PICTURE_SELECT_RECEIVER_TYPE_DELETE);
        intent.putExtra(PICTURE_SELECT_RECEIVER_APPLY_NO, applyNo);
        intent.putExtra(PICTURE_SELECT_RECEIVER_FILE_KEY, fileKey);
        activity.sendBroadcast(intent);
    }

    public static void rotateSaveImage(Activity activity, String applyNo, String fileKey, String rotate) {
        Intent intent = new Intent();
        intent.setAction(PICTURE_SELECT_RECEIVER_ACTION);
        intent.putExtra(PICTURE_SELECT_RECEIVER_TYPE, PICTURE_SELECT_RECEIVER_TYPE_ROTATE);
        intent.putExtra(PICTURE_SELECT_RECEIVER_APPLY_NO, applyNo);
        intent.putExtra(PICTURE_SELECT_RECEIVER_FILE_KEY, fileKey);
        intent.putExtra(PICTURE_SELECT_RECEIVER_ROTATE, rotate);
        activity.sendBroadcast(intent);
    }
}
