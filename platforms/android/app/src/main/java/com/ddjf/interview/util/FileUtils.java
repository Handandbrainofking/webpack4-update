package com.ddjf.interview.util;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.util.Log;

import com.ddjf.interview.WXApplication;
import com.ddjf.interview.database.entity.FileEntity;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.log_manager.LogManager;
import com.taobao.weex.ui.component.WXA;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Calendar;
import java.util.Date;
import java.util.Enumeration;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

/**
 * Created by yejunrong on 18/3/8.
 */

public class FileUtils {
    public static String TAG = "FileUtils";

    //缓存路径
    public static String AppCacheDir = WXApplication.mAppInstance.
            getApplicationContext().getCacheDir().getPath();

    //sd卡路径地址
    public static String AppStorageDir = Environment.getExternalStorageDirectory() + File.separator + "app_interview";

    //图片上传的缓存目录
    public static String UploadFileCachePath = AppStorageDir + File.separator + "uploadFileCache";

    //图片上传的压缩目录
    public static String UploadFileCompressPath = AppStorageDir + File.separator + "uploadFileCompress";

    //下载目录
    public static String AppCacheDownloadDir = AppCacheDir + File.separator + "download";

    //数据库存放地址目录
    public static String AppCacheDatabaseDir = AppCacheDir + File.separator + "DB";


    //log日志存放地址
    private static String AppCacheLogManagerDir = AppStorageDir + File.separator + "logManager";

    //weex js 存放的路径
    public static String WeexFileDir = AppCacheDir + File.separator + "weexFile";

    //file 缓存路径
    public static String FileCacheDir = AppStorageDir + File.separator + "fileCacheDir";

    //weex配置文件名
    public static String WeexConfigFile = "system_config.txt";
    public final static String WeexZipUploadFile = "weex.zip";

    //字典文件名
    public static String SystemDicFileName = "system_dic_file.json";
    public static String SystemDicFilePath = AppStorageDir + File.separator +"config";

    //压缩图片的最小宽度
    private static int CompressImageMinWidth = 480;
    //压缩图片的最小高度
    private static int CompressImageMinHeight = 800;
    //压缩图片质量
    private static int CompressImageQuality = 95;
    /**
     * 读取文件
     *
     * @param fileName
     * @param path
     * @return
     */
    public static String readFile(String fileName, String path) {
        StringBuilder sb = new StringBuilder("");
        try {
            File file = new File(path + File.separator + fileName);
            if (!file.exists()) {
                LogManager.errorLog("FileUtils readFile()", fileName + " 没有找到");
                return sb.toString();
            }
            FileInputStream inputStream = new FileInputStream(file);
            byte temp[] = new byte[1024];
            int len = 0;
            while ((len = inputStream.read(temp)) > 0) {
                sb.append(new String(temp, 0, len));
            }
            LogManager.debugLog("msg", "readFile: \n" + sb.toString());
            inputStream.close();

        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
        return sb.toString();
    }

    /**
     * 读取assets下的文件
     * @return
     */
    public static String readAssetsFile(String fileName,String path){
        StringBuilder sb = new StringBuilder("");
        try {
            path =  null==path ? "":path;
            InputStream inputStream = WXApplication.mAppInstance.getAssets().open(path+File.separator+fileName);
            byte temp[] = new byte[1024];
            int len = 0;
            while ((len = inputStream.read(temp)) > 0) {
                sb.append(new String(temp, 0, len));
            }
            LogManager.debugLog("msg", "readAssetsFile: \n" + sb.toString());
            inputStream.close();

        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
        return sb.toString();
    }
    /***
     * 保存文件
     * @param fileName
     * @param path
     * @param fileByte
     */
    public static void savePackageFile(String fileName, String path, byte[] fileByte) {
        File file = new File(path, fileName);
        if (file.exists()) {
            file.delete();
        }
        try {

            BufferedOutputStream fos = new BufferedOutputStream(new FileOutputStream(file));
            fos.write(fileByte);
            fos.close();

        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }

    /***
     * 读取路径下面的所有文件名
     * @param path
     * @return
     */
    public static String readFileName(String path) {
        String result = "";
        File[] files = new File(path).listFiles();
        if (null == files || files.length == 0) {
            return result;
        }
        for (File file : files) {
            if (file.exists()) {
                if (!file.isDirectory()) {
                    result += "  " + file.getPath() + "/" + file.getName();
                } else {
                    //如果是文件夹则递归查找
                    readFileName(file.getPath());
                }

                LogManager.infoLog("FileUtils readFileName()", "文件路径=" + file.getParent() + " 文件名=" + file.getName());
            }
        }
        return result;
    }

    public static void zipFiles(List<String> filePath, File zipfile) {
        byte[] buf = new byte[1024];
        try {
            //ZipOutputStream类：完成文件或文件夹的压缩
            ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipfile));
            for (int i = 0; i < filePath.size(); i++) {
                FileInputStream in = new FileInputStream(filePath.get(i));
                out.putNextEntry(new ZipEntry(filePath.get(i)));
                int len;
                while ((len = in.read(buf)) > 0) {
                    out.write(buf, 0, len);
                }
                out.closeEntry();
                in.close();
            }
            out.close();
        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }


    /**
     * 解压zip格式文件
     *
     * @param originFile zip文件。
     * @param targetDir  要解压到的目标路径。
     * @return 如果目标文件不是zip文件则返回false。
     * @throws IOException 如果发生I/O错误。
     */
    public static boolean decompressZip(File originFile, String targetDir) throws IOException {

        if (!targetDir.endsWith(File.separator)) {
            targetDir += File.separator;
        }
        ZipFile zipFile = new ZipFile(originFile);
        ZipEntry zipEntry;
        Enumeration<ZipEntry> entry = (Enumeration<ZipEntry>) zipFile.entries();
        while (entry.hasMoreElements()) {
            zipEntry = entry.nextElement();
            String fileName = zipEntry.getName();
            File outputFile = new File(targetDir + fileName);
            if (zipEntry.isDirectory()) {
                forceMkdirs(outputFile);
                continue;
            } else if (!outputFile.getParentFile().exists()) {
                forceMkdirs(outputFile.getParent());
            }
            OutputStream outputStream = new FileOutputStream(outputFile);
            InputStream inputStream = zipFile.getInputStream(zipEntry);
            int len;
            byte[] buffer = new byte[8192];
            while (-1 != (len = inputStream.read(buffer))) {
                outputStream.write(buffer, 0, len);
            }
            outputStream.close();
            inputStream.close();
        }
        zipFile.close();
        return true;
    }

    /***
     * 强制创建文件夹
     * @param file
     * @return
     */
    public static File forceMkdirs(File file) {
        if (!file.exists()) {
            file.mkdirs();
        } else if (!file.isDirectory()) {
            file.delete();
            file.mkdirs();
        }
        return file;
    }

    /**
     * 强制创建目录（如果上级目录不存在则直接创建）
     *
     * @param pathName
     * @return
     */
    public static File forceMkdirs(String pathName) {
        String[] children = pathName.split("/");
        String fileName = "";
        for (int i = 0; i < children.length; i++) {
            String item = children[i];
            if (null == item && item.equals("")) {
                continue;
            }
            fileName = fileName + File.separator + item;
            File fileSon = new File(fileName);
            if (!fileSon.getName().equals("") && !fileSon.exists()) {
                fileSon.mkdir();
                if (i < (children.length - 1)) {
                    forceMkdirs(fileName + File.separator + children[i + 1]);
                }
            }
        }
        return forceMkdirs(new File(pathName));
    }

    /**
     * 文件拷贝
     *
     * @param fromPath 原文件路径(xx/xx1/xx.txt)
     * @param toPath   目标文件路径(xx/xx2/xx.txt)
     */

    public static void copyFile(String fromPath, String toPath) {
        LogManager.infoLog(TAG,"文件拷贝 fromPath="+fromPath +" toPath="+toPath);
        File fromFile = new File(fromPath);
        if (null == fromFile || !fromFile.exists()) {
            return;
        }
        File toFile = new File(toPath);
        forceMkdirs(new File(toFile.getParent()));

        try {
            int bytesum = 0;
            int byteread = 0;
            File oldfile = new File(fromPath);
            if (oldfile.exists()) { //文件存在时
                InputStream inStream = new FileInputStream(fromPath); //读入原文件
                FileOutputStream fs = new FileOutputStream(toPath);
                byte[] buffer = new byte[1444];
                int length;
                while ((byteread = inStream.read(buffer)) != -1) {
                    bytesum += byteread; //字节数 文件大小
                    fs.write(buffer, 0, byteread);
                }
                inStream.close();
            }
        } catch (Exception e) {
            LogManager.errorLog(TAG, "复制单个文件操作出错");
            ExceptionGlobalHandler.showException(TAG,e);

        }
    }

    /**
     * assets 文件复制到sd
     * @param oldPath
     * @param newPath
     */
    public static void assetCopySd(String oldPath,String newPath) {
        try {
            String fileNames[] = WXApplication.mAppInstance.getAssets().list(oldPath);//获取assets目录下的所有文件及目录名
            if (fileNames.length > 0) {//如果是目录
                File file = new File(newPath);
                file.mkdirs();//如果文件夹不存在，则递归
                for (String fileName : fileNames) {
                    assetCopySd(oldPath + "/" + fileName,newPath+"/"+fileName);
                }
            } else {//如果是文件
                InputStream is = WXApplication.mAppInstance.getAssets().open(oldPath);
                FileOutputStream fos = new FileOutputStream(new File(newPath));
                byte[] buffer = new byte[1024];
                int byteCount=0;
                while((byteCount=is.read(buffer))!=-1) {//循环从输入流读取 buffer字节
                    fos.write(buffer, 0, byteCount);//将读取的输入流写入到输出流
                }
                fos.flush();//刷新缓冲区
                is.close();
                fos.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
            LogManager.errorLog(TAG, "asset复制文件到sd 操作出错");
            ExceptionGlobalHandler.showException(TAG,e);
        }
    }

    /**
     * 删除文件或者删除文件夹下面的所有文件
     *
     * @param file
     */
    public static void recursionDeleteFile(File file) {

        if (file.isFile()) {
            file.delete();
            LogManager.infoLog(TAG,"删除文件 path="+file.getPath());
            return;
        }
        if (file.isDirectory()) {
            File[] childFile = file.listFiles();
            if (childFile == null || childFile.length == 0) {
                file.delete();
                LogManager.infoLog(TAG,"删除文件 path="+file.getPath());
                return;
            }
            for (File f : childFile) {
                recursionDeleteFile(f);
            }
            file.delete();
            LogManager.infoLog(TAG,"删除文件 path="+file.getPath());
        }
    }

    /**
     * 获取异常奔溃日志文件名
     *
     * @return
     */
    public static String getCrashLogFileName() {
        String currentPhone = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE) == null ? "" :
                SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        int hours = calendar.get(Calendar.HOUR_OF_DAY);
        if (hours > 12) {
            return DateUtils.getStringDateShort() + "_" + currentPhone + "-crash-" + "-PM.log";
        }

        return DateUtils.getStringDateShort() + "_" + currentPhone + "-crash-" + "-AM.log";
    }


    /**
     * 获取log存储文件名
     *
     * @return
     */
    public static String getLogFileName() {
        String currentPhone = SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE) == null ? "" :
                SharedPreferenceUtil.getDataString(SharedPreferenceUtil.CURRENT_LOGIN_MOBILE);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        int hours = calendar.get(Calendar.HOUR_OF_DAY);
        if (hours > 12) {
            return DateUtils.getStringDateShort() + "_" + currentPhone + "-PM.log";
        }

        return DateUtils.getStringDateShort() + "_" + currentPhone + "-AM.log";
    }

    /**
     * 获取log存储路径
     *
     * @return
     */
    public static String getLogDir() {
        String fileName = AppCacheLogManagerDir + File.separator + DateUtils.getStringDate(DateUtils.DATA_FORMAT_SHORT_);
        forceMkdirs(fileName);
        return fileName;
    }

    /**
     * 压缩图片
     * @param filePath 原图地址
     * @param outputPath 压缩后地址
      * @return
     */
    public static String compressImage(String filePath, String outputPath)  {
        Bitmap bm = decodeSampledBitmapFromFd(filePath,CompressImageMinWidth,CompressImageMinHeight);
        File outputFile=new File(outputPath);
        try {
            File parentFile = new File(outputFile.getParent());
            if(!parentFile.exists()){
                parentFile.mkdir();
            }
            if (!outputFile.exists()) {
                outputFile.createNewFile();
            }else{
                outputFile.delete();
            }
            FileOutputStream out = new FileOutputStream(outputFile);
            bm.compress(Bitmap.CompressFormat.JPEG, CompressImageQuality, out);
        }catch (Exception e){
            ExceptionGlobalHandler.showException(TAG,e);
            return null;
        }
        return outputFile.getPath();
    }

    /**
     * 根据地址压缩图片
     *
     * @param pathName
     * @param reqWidth 最小宽度
     * @param reqHeight 最小高度
     * @return
     */
    public static Bitmap decodeSampledBitmapFromFd(String pathName, int reqWidth, int reqHeight) {
        final BitmapFactory.Options options = new BitmapFactory.Options();
        // 若要对图片进行压缩，必须先设置Option的inJustDecodeBounds为true才能进行Option的修改
        options.inJustDecodeBounds = true;
        // 第一次decodeFile是获取到options.outHeight和options.outWidth
        BitmapFactory.decodeFile(pathName, options);
        // options.inSampleSize是图片的压缩比，例如原来大小是100*100，options.inSampleSize为1，则不变，
        // options.inSampleSize为2，则压缩成50*50
        options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight);
        // 重新设置options.inJustDecodeBounds为false，不能修改option
        options.inJustDecodeBounds = false;
        // 根据options重新加载图片
        Bitmap src = BitmapFactory.decodeFile(pathName, options);
        return src;
    }

    private static int calculateInSampleSize(BitmapFactory.Options options, int reqWidth, int reqHeight) {
        final int height = options.outHeight;
        final int width = options.outWidth;
        int inSampleSize = 1;
        if (height > reqHeight || width > reqWidth) {
            //首先获取原图高度和宽度的一半
            final int halfHeight = height / 2;
            final int halfWidth = width / 2;
            //循环，如果halfHeight和halfWidth同时大于最小宽度和最小高度时，inSampleSize乘2，
            //最后得到的宽或者高都是最接近最小宽度或者最小高度的
            while ((halfHeight / inSampleSize) > reqHeight && (halfWidth / inSampleSize) > reqWidth) {
                inSampleSize *= 2;
            }
        }
        return inSampleSize;
    }

    /**
     * 更新上传图片的状态
     * @param entity
     */
    public static void updateUploadImageStatus(FileEntity entity,int status){
        try {

            //更改数据库上传图片的状态
            String path = FileUtils.UploadFileCachePath + File.separator + entity.getFileName();
            entity.setLocationCacheUrl(path);
            entity.setUpdateDate(DateUtils.getStringDate());
            entity.setStatus(status);

            WXApplication.mDatabaseUtils.updateEntityForKey(entity);
            LogManager.infoLog(TAG, "更改数据库上传图片的状态：LocationCacheUrl=" +path+" status="+entity.getStatus() );

            //delete cache file
            if(0==status){
                FileUtils.recursionDeleteFile(new File(path));
            }
        }catch (Exception e){
            ExceptionGlobalHandler.showException(TAG,e);
            LogManager.errorLog(TAG,e.getMessage());
        }
    }

    /***
     * TODO 保存字典的json 到文件中
     * @param data
     *
     */
    public static void writeSystemDicFile(String data){
        try {

            File file = new File(SystemDicFilePath,SystemDicFileName);
            if(!file.exists()){
                forceMkdirs(SystemDicFilePath+File.separator +
                        SystemDicFileName);
            }else{
                // 如果存在则删除重新创建写入数据
                file.delete();
                writeSystemDicFile(data);
            }

            savePackageFile(SystemDicFileName,SystemDicFilePath,data.getBytes());
            LogManager.infoLog(TAG,"将字典保存到文件中");
        }catch (Exception e){
            LogManager.errorLog(TAG,"字典保存文件失败");
            ExceptionGlobalHandler.showException(TAG,e);
            e.printStackTrace();
        }
    }

    /**
     * 过滤文件名的特殊字符,方便网络请求
     *  @param fileName
     * @return
     */
    public static String filterFileName(String fileName){
        String[] filter = {"=","&",","};
        for(String item : filter){
            fileName = fileName.replaceAll(item,"");
        }

        return fileName;
    }

    /**
     * 通知媒体库更新文件夹
     * @param context
     * @param file
     */
    public static void updateFileFromDatabase(Context context, File file){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            String[] paths = new String[]{Environment.getExternalStorageDirectory().toString()};
            MediaScannerConnection.scanFile(context, paths, null, null);
            MediaScannerConnection.scanFile(context, new String[] {
                            file.getAbsolutePath()},
                    null, new MediaScannerConnection.OnScanCompletedListener() {
                        public void onScanCompleted(String path, Uri uri)
                        {
                        }
                    });
        } else {
            context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_MOUNTED,
                    Uri.parse("file://" + Environment.getExternalStorageDirectory())));
        }
    }
}
