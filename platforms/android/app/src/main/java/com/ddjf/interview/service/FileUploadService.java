package com.ddjf.interview.service;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

import com.ddjf.interview.WXApplication;
import com.ddjf.interview.database.entity.FileEntity;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.http.ImageHandler;
import com.ddjf.interview.log_manager.LogManager;

import java.io.File;
import java.util.List;

/**
 * 图片上传
 */
public class FileUploadService extends Service {
    String TAG = "FileUploadService";
    List<FileEntity> files;

    public FileUploadService() {

    }

    @Override
    public IBinder onBind(Intent intent) {
        throw new UnsupportedOperationException("Not yet implemented");
    }


    /**
     * 每次通过startService()方法启动Service时都会被回调。
     *
     * @param intent
     * @param flags
     * @param startId
     * @return
     */
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        try {
            if(null == WXApplication.mDatabaseUtils){
                LogManager.infoLog(TAG,"WXApplication.mDatabaseUtils对象为null ");
                return super.onStartCommand(intent, flags, startId);
            }

            //数据库里面抓上传失败数据
            files = WXApplication.mDatabaseUtils.query(FileEntity.class, "status=?",
                    new String[]{"1"});
            if (null != files && files.size() != 0) {
                LogManager.infoLog(TAG, "当前上传失败的文件有==" + files.size());

                for (FileEntity item : files) {
                    uploadFile(item);
                }
            }else {
                LogManager.infoLog(TAG,"当前没有上传失败的文件！！");
            }

        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }

        return super.onStartCommand(intent, flags, startId);
    }

    public void uploadFile(FileEntity entity) {
        LogManager.infoLog(TAG, "图片重传：url=" + entity.getServerUrl() + " path=" + entity.getLocationCacheUrl() + " fileName=" + entity.getFileName());
        File file = new File(entity.getLocationCacheUrl());
        if (!file.exists()) {
            LogManager.infoLog(TAG, " fileName=" + entity.getFileName() + "  不存在，所以不能重新上传");
            entity.setStatus(3);
            WXApplication.mDatabaseUtils.updateEntityForKey(entity);
            return;
        }
        entity.setStatus(2);
        WXApplication.mDatabaseUtils.updateEntityForKey(entity);
        ImageHandler.handlerImageUpload(entity, null, null, true);

    }

}
