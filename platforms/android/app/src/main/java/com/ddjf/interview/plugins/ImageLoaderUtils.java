package com.ddjf.interview.plugins;

import android.content.Context;
import android.graphics.Bitmap;

import com.ddjf.interview.R;
import com.ddjf.interview.util.FileUtils;
import com.nostra13.universalimageloader.cache.disc.impl.UnlimitedDiskCache;
import com.nostra13.universalimageloader.cache.disc.naming.Md5FileNameGenerator;
import com.nostra13.universalimageloader.cache.memory.impl.UsingFreqLimitedMemoryCache;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.ImageLoaderConfiguration;
import com.nostra13.universalimageloader.core.assist.ImageScaleType;
import com.nostra13.universalimageloader.core.assist.QueueProcessingType;
import com.nostra13.universalimageloader.core.display.FadeInBitmapDisplayer;
import com.nostra13.universalimageloader.core.display.RoundedBitmapDisplayer;
import com.nostra13.universalimageloader.core.download.BaseImageDownloader;
import com.nostra13.universalimageloader.utils.StorageUtils;

import java.io.File;

/**
 * Created by yejunrong on 18/3/23.
 * 图片加载、图片缓存 配置
 */

public class ImageLoaderUtils {

    public static void initImageLoader(Context context){
        //图片缓存路径
        File cacheFile = new File(FileUtils.AppCacheDir+File.separator+"imageLoader/cache");
                //StorageUtils.getOwnCacheDirectory(context,"imageLoader/cache");
        ImageLoaderConfiguration config = new ImageLoaderConfiguration.Builder(context)
                .memoryCacheExtraOptions(480,800)//每一个缓存图片的最大长宽
                .threadPoolSize(5) //线程池加载的数量
                .threadPriority(Thread.NORM_PRIORITY - 2) //线程优先级
                .diskCacheFileNameGenerator(new Md5FileNameGenerator()) //保存的文件名用MD5加密
                .denyCacheImageMultipleSizesInMemory() //
                .memoryCache(new UsingFreqLimitedMemoryCache(2 * 1024 *1024)) //
                .memoryCacheSize(2*1024*1024) //内存缓存大小 2M
                .diskCacheSize(50 * 1024 *1024) //缓存总量大小 50M
                .diskCache(new UnlimitedDiskCache(cacheFile)) //自定义缓存路径
                .diskCacheFileCount(100) //缓存file数量
                .tasksProcessingOrder(QueueProcessingType.LIFO)
                .imageDownloader(new BaseImageDownloader(context,5 * 1000,30 *1000)) //连接、读取 超时时间
                .defaultDisplayImageOptions(getDisplayOptions())
                .writeDebugLogs() //打印log日志，发布版本需要删除
                .build();
        //全局初始化配置
        ImageLoader.getInstance().init(config);

    }
    private static DisplayImageOptions getDisplayOptions() {
        DisplayImageOptions options;
        options = new DisplayImageOptions.Builder()
                .showImageOnLoading(R.drawable.ic_action_refresh)// 设置图片在下载期间显示的图片
                .showImageForEmptyUri(R.drawable.ic_action_refresh)// 设置图片Uri为空或是错误的时候显示的图片
                .showImageOnFail(R.drawable.ic_action_refresh) // 设置图片加载/解码过程中错误时候显示的图片

                .cacheInMemory(true)// 设置下载的图片是否缓存在内存中
                .cacheOnDisc(true)// 设置下载的图片是否缓存在SD卡中

                .considerExifParams(true) // 是否考虑JPEG图像EXIF参数（旋转，翻转）
                .imageScaleType(ImageScaleType.EXACTLY_STRETCHED)// 设置图片以如何的编码方式显示
                .bitmapConfig(Bitmap.Config.RGB_565)// 设置图片的解码类型//
                // .delayBeforeLoading(int delayInMillis)//int
                // delayInMillis为你设置的下载前的延迟时间
                // 设置图片加入缓存前，对bitmap进行设置
                // .preProcessor(BitmapProcessor preProcessor)
                .resetViewBeforeLoading(true)// 设置图片在下载前是否重置，复位
                .displayer(new RoundedBitmapDisplayer(20))// 是否设置为圆角，弧度为多少
                .displayer(new FadeInBitmapDisplayer(100))// 是否图片加载好后渐入的动画时间
                .build();// 构建完成
        return options;
    }

}
