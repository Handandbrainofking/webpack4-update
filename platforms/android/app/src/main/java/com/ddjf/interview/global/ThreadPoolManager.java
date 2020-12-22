package com.ddjf.interview.global;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * Created by yejunrong on 18/7/24.
 */

public class ThreadPoolManager {
    private static ThreadPoolManager mThreadPoolManager;

    //允许10个运行，池中最大
    private static ThreadPoolExecutor mThreadPool = new ThreadPoolExecutor(4, 20, 15,
            TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(128),
            new ThreadPoolExecutor.DiscardOldestPolicy());

    private ThreadPoolManager(){}

    public static ThreadPoolExecutor getThreadPool(){
        if(null == mThreadPoolManager){
            mThreadPoolManager = new ThreadPoolManager();
            mThreadPool.allowCoreThreadTimeOut(true);
        }
        return mThreadPoolManager.mThreadPool;
    }

}
