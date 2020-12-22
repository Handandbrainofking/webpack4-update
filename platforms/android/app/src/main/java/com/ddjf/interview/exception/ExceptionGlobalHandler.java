package com.ddjf.interview.exception;

import com.ddjf.interview.log_manager.LogManager;

/**
 * Created by yejunrong on 18/7/16.
 *
 * 异常统一处理类
 *
 */

public class ExceptionGlobalHandler {
    static String Tag = "异常处理类 ExceptionGlobalHandler ";
    public static void showException(String tag, Throwable ex){
        StackTraceElement[] trace = ex.getStackTrace();
        LogManager.errorLog(Tag+"  tag="+tag,trace[0].getClassName()+"\n"+
                "出错的方法名="+trace[0].getMethodName()+"\n"+"出错的行数="+trace[0].getLineNumber()+"\n"+
                "出错的信息="+ ex.getMessage());
        ex.printStackTrace();
    }
}
