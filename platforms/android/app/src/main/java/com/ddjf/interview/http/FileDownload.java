package com.ddjf.interview.http;

import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.http.download_progress.ProgressHelper;
import com.ddjf.interview.http.download_progress.ProgressUIListener;
import com.ddjf.interview.util.FileUtils;
import com.ddjf.interview.log_manager.LogManager;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import okio.BufferedSink;
import okio.BufferedSource;
import okio.Okio;

/**
 * Created by yejunrong on 18/5/26.
 */

public class FileDownload {
    private static String TAG = "FileDownload";

    public static void downloadZIPFile(String downloadUrl,final String savePath,final String fileName,
                                    final HttpUtils.HttpRequestCallBack callBack){
        HttpUtils.httpGetRequest(downloadUrl, null, null, new HttpUtils.HttpRequestCallBack() {
            @Override
            public void onFailure(Request request, Exception e) {
                if (null != callBack) {
                    callBack.onFailure(request,e);
                }
            }

            @Override
            public void onSuccess(Response response) {
                try {
                    File file = new File(savePath);
                    if(!file.exists()){
                        file.mkdirs();
                    }

                    file = new File(savePath, fileName);
                    if (!file.exists()) {
                        file.createNewFile();
                    }

                    InputStream is = null;

                    byte[] buf = new byte[2048];
                    int len = 0;
                    FileOutputStream fos = null;
                    try {
                        long current = 0;
                        is = response.body().byteStream();
                        LogManager.infoLog(TAG, "close------>" + is.toString());
                        fos = new FileOutputStream(file);
                        while ((len = is.read(buf)) != -1) {
                            current += len;
                            fos.write(buf, 0, len);
                        }
                        fos.flush();

                    } catch (IOException e) {
                        e.printStackTrace();
                        LogManager.errorLog(TAG, e.toString());
                        if (null != callBack) {
                            callBack.onFailure(null,e);
                        }
                    } finally {
                        if (is != null) {
                            is.close();
                        }
                        if (fos != null) {
                            fos.close();
                        }
                    }
                    if (null != callBack) {
                        callBack.onSuccess(response);
                    }
                } catch (Exception e) {
                    ExceptionGlobalHandler.showException(TAG,e);
                    LogManager.errorLog(TAG, e.toString());
                    if (null != callBack) {
                        callBack.onFailure(null,e);
                    }
                }

            }
        });
    }


    /**
     * 普通文件下载
     *
     * @param serverUrl
     * @param locationPath      本地存储路径地址
     */
    public static void downloadFile(String serverUrl, final String locationPath, final String fileName,final  DownloadFileCallback callback) {


        okhttp3.OkHttpClient okHttpClient = new okhttp3.OkHttpClient();
        okhttp3.Request.Builder builder = new okhttp3.Request.Builder();
        builder.url(serverUrl);
        builder.get();
        okhttp3.Call call = okHttpClient.newCall(builder.build());
        call.enqueue(new okhttp3.Callback() {

            @Override
            public void onFailure(okhttp3.Call call, IOException e) {
                LogManager.errorLog(TAG, "=============onFailure===============");
                e.printStackTrace();
                if(null != callback){
                    callback.failure();
                }
            }

            @Override
            public void onResponse(okhttp3.Call call, okhttp3.Response response) throws IOException {
                LogManager.infoLog(TAG, "=============onResponse===============");
                LogManager.infoLog(TAG, "request headers:" + response.request().headers());
                LogManager.infoLog(TAG, "response headers:" + response.headers());

                okhttp3.ResponseBody body = response.body();
                okhttp3.ResponseBody responseBody = ProgressHelper.withProgress(body, new ProgressUIListener() {

                    @Override
                    public void onUIProgressStart(long totalBytes) {
                        super.onUIProgressStart(totalBytes);
                        LogManager.infoLog(TAG, "onUIProgressStart:" + totalBytes);
                    }

                    @Override
                    public void onUIProgressChanged(long numBytes, long totalBytes, float percent, float speed) {
                        LogManager.infoLog(TAG, "=============start===============");
                        LogManager.infoLog(TAG, "numBytes:" + numBytes);
                        LogManager.infoLog(TAG, "totalBytes:" + totalBytes);
                        LogManager.infoLog(TAG, "percent:" + percent);
                        LogManager.infoLog(TAG, "speed:" + speed);
                        LogManager.infoLog(TAG, "============= end ===============");

                        String desc = "numBytes:" + numBytes + " bytes" + "\ntotalBytes:" + totalBytes + " bytes" + "\npercent:" + percent
                                * 100 + " %" + "\nspeed:" + speed * 1000 / 1024 / 1024 + " MB/秒";
                        LogManager.infoLog(TAG, "下载详情===" + desc);


                        if(null != callback){
                            callback.progress((int) (100 * percent));
                        }
                    }

                    @Override
                    public void onUIProgressFinish() {
                        super.onUIProgressFinish();
                        LogManager.infoLog(TAG, "onUIProgressFinish: 结束上传。。。");

                        if(null != callback){
                            callback.progressFinish();
                        }
                    }

                });
                try {
                    BufferedSource source = responseBody.source();

                    FileUtils.forceMkdirs(locationPath);

                    File file = new File(locationPath, fileName);
                    if (!file.exists()) {
                        file.createNewFile();
                    } else {
                        file.delete();
                    }

                    BufferedSink sink = Okio.buffer(Okio.sink(file));
                    source.readAll(sink);
                    sink.flush();
                    source.close();

                    if(null != callback){
                        callback.success();
                    }
                } catch (Exception e) {
                    LogManager.infoLog(TAG,"文件下载出错=="+e.getMessage());
                    ExceptionGlobalHandler.showException(TAG,e);

                }
            }
        });
    }

    public interface DownloadFileCallback{
        void failure();
        void progress(int percent);
        void progressFinish();
        void success();
    }

}
