package com.ddjf.interview.util;

import org.apache.commons.codec.binary.Hex;
import org.apache.commons.codec.digest.DigestUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * URL鉴权
 * @author zhaohui
 *
 */
public class UrlAuth {

    public static final String YYYY_MM_DD = "yyyyMMdd";
    
    // 缓存SimpleDateFormat对象
    private static Map<String, ThreadLocal<SimpleDateFormat>> simpleDateFormatCacheMap = new ConcurrentHashMap<String, ThreadLocal<SimpleDateFormat>>();

    /**
     * 获取SimpleDateFormat对象，如果有缓存则用缓存，如果没有则创建并缓存
     * @param pattern
     * @return
     */
    private static SimpleDateFormat getSimpleDateFormat(final String pattern) {

        ThreadLocal<SimpleDateFormat> threadLocal = simpleDateFormatCacheMap.get(pattern);
        if (threadLocal != null) {
            return threadLocal.get();
        }
        threadLocal = new ThreadLocal<SimpleDateFormat>() {
            @Override
            protected SimpleDateFormat initialValue() {
                return new SimpleDateFormat(pattern);
            }
        };
        simpleDateFormatCacheMap.put(pattern, threadLocal);
        return threadLocal.get();
    }
    
    /**
     * 
     * @param offset 偏移量 正数往后  负数往前
     * @return
     * @throws ParseException
     */
    public static String getAuthDate(int offset){
        
        Calendar calender = Calendar.getInstance();
        calender.add(Calendar.DAY_OF_MONTH, offset);
        return format(calender.getTime(), YYYY_MM_DD);
    }
    
    /**
     * 格式化Date为字符串
     * @param date   日期
     * @param format 格式
     * @return
     */
    public static String format(Date date, String format) {
        SimpleDateFormat sdf = getSimpleDateFormat(format);
        return sdf.format(date);
    }
    
    /**
     * 获取文件签名
     * @param fileKey
     * @param dateOffset
     * @param authKey
     * @return
     */
    public static String getUrlSign(String fileKey, int dateOffset, String authKey){
        StringBuilder originalSB = new StringBuilder();
        originalSB.append(fileKey).append("-")
                  .append(getAuthDate(dateOffset)).append("-")
                  .append(authKey);
//        return DigestUtils.md5Hex(originalSB.toString());
        return  new String(Hex.encodeHex(DigestUtils.md5(originalSB.toString())));
    }

    
    /**
     * 获取签名 (如果已有偏移后的日期字符串)
     * @param fileKey
     * @param authDate
     * @param authKey
     * @return
     */
    public static String getUrlSign(String fileKey, String authDate, String authKey){
        StringBuilder originalSB = new StringBuilder();
        originalSB.append(fileKey).append("-")
                  .append(authDate).append("-")
                  .append(authKey);
        return DigestUtils.md5Hex(originalSB.toString());
    }
}
