package com.ddjf.interview.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by yejunrong on 18/4/2.
 * 时间相关 工具类
 */

public class DateUtils {
    public static String DATA_FORMAT_ALL = "yyyy-MM-dd HH:mm:ss";
    public static String DATA_FORMAT_ALL_ = "yyyy_MM_dd_HH_mm_ss";
    public static String DATA_FORMAT_SHORT = "yyyy-MM-dd";
    public static String DATA_FORMAT_SHORT_ = "yyyy_MM_dd";
    public static String DATA_FORMAT_TIME = "yyyy-MM-dd HH:mm:ss";
    public static String DATA_FORMAT_TIME_ = "yyyy-MM-dd HH:mm:ss:SSS";
    public static String DATA_FORMAT_MINUTE = "yyyy-MM-dd HH:mm";
    public static String DATA_FORMAT_HOUR = "yyyy-MM-dd HH";

    /**
     * 格式化时间
     * @param date
     * @param format
     * @return
     */
    public static String formatDate(Date date,String format) {
        SimpleDateFormat formatter = new SimpleDateFormat(format);
        String dateString = formatter.format(date);
        return dateString;
    }

    /**
     * 获取现在时间
     *
     * @return返回字符串格式 yyyy-MM-dd HH:mm:ss
     */
    public static String getStringDate() {
        Date currentTime = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat(DATA_FORMAT_ALL);
        String dateString = formatter.format(currentTime);
        return dateString;
    }


    /**
     * 获取现在时间
     *
     * @return返回字符串格式
     */
    public static String getStringDate(String format) {
        Date currentTime = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat(format);
        String dateString = formatter.format(currentTime);
        return dateString;
    }

    /**
     * 获取现在时间
     *
     * @return 返回短时间字符串格式 yyyy-MM-dd
     */
    public static String getStringDateShort() {
        Date currentTime = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat(DATA_FORMAT_SHORT);
        String dateString = formatter.format(currentTime);
        return dateString;
    }

    /**
     * 获取时间 小时:分;秒 HH:mm:ss
     *
     * @return
     */
    public static String getTimeShort() {
        SimpleDateFormat formatter = new SimpleDateFormat(DATA_FORMAT_TIME);
        Date currentTime = new Date();
        String dateString = formatter.format(currentTime);
        return dateString;
    }

    /**
     * 根据固定的时间格式转为Date
     * @param formatData
     * @param format
     * @return
     */
    public static Date getDateForString(String formatData,String format){
        DateFormat format1 = new SimpleDateFormat(format);
        Date data = null;
        try {
            data = format1.parse(formatData);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return data;
    }


}
