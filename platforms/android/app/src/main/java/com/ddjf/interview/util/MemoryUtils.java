package com.ddjf.interview.util;

import android.app.ActivityManager;
import android.content.Context;
import android.support.annotation.WorkerThread;

import com.ddjf.interview.log_manager.LogManager;

/**
 * Description:
 * <p>
 * Created by rowandjj(chuyi)<br/>
 * Date: 16/10/8<br/>
 * Time: 下午4:22<br/>
 */

public class MemoryUtils {
    static String TAG= "MemoryUtils";

    private MemoryUtils() {
    }


    /**
     * 当前设备能够获取的最大内存
     * @param cxt
     * @return
     */
    public static int getDevicesAppMemorySize(Context cxt){
        ActivityManager manager = (ActivityManager)cxt.getSystemService(Context.ACTIVITY_SERVICE);
        int memoClass = manager.getMemoryClass();
        int largeMemoClass = manager.getLargeMemoryClass(); //针对Manifest.xml 中的largeHeap属性
        LogManager.infoLog(TAG,"当前设备能使用的最大内存是="+memoClass+"  开启largeHeap后最大使用内存="+largeMemoClass);
        return memoClass;
    }

    /**
     * 获取当前内存占用,单位是MB
     */
    public static double getMemoryUsage() {
        Runtime runtime = Runtime.getRuntime();
        return (runtime.totalMemory() - runtime.freeMemory()) / (double) 1048576;
    }

    /**
     * 获取当前应用能获取的总内存,单位是MB
     */
    public static double maxMemory() {
        return Runtime.getRuntime().maxMemory() / (double) 1048576;
    }

    /**
     * 获取当前应用总内存
     * */
    public static double totalMemory() {
        return Runtime.getRuntime().totalMemory() / (double) 1048576;
    }

    @WorkerThread
    public static void tryForceGC() {
        // System.gc() does not garbage collect every time. Runtime.gc() is
        // more likely to perfom a gc.
        Runtime.getRuntime().gc();
        enqueueReferences();
        System.runFinalization();
    }

    private static void enqueueReferences() {
        /*
         * Hack. We don't have a programmatic way to wait for the reference queue
         * daemon to move references to the appropriate queues.
         */
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            throw new AssertionError();
        }
    }

}
