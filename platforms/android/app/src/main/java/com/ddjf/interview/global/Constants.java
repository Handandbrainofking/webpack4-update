package com.ddjf.interview.global;

public class Constants { 
    private static Environmental.EnvironmentalEnum CURRENT_ENVIRONMENTAL = Environmental.CURRENT_ENVIRONMENTAL;//当前的开发环境

    //影像地址（UAT/SIT是一样的）
    private static String UAT_IMAGE_EIS_BASE_URL = "http://120.25.130.236:27100/eis";
    private static String UAT_IMAGE_EIS_INNER_URL = "http://120.25.130.236:27100/eis";//"http://172.16.180.236:27100/eis";
    private static String UAT_IMAGE_EIS_SYSTEM_CODE = "bpms";
    private static String UAT_IMAGE_EIS_SYSTEM_KEY = "ZmaX#ymikZxXfYKGP75G#V^Z9fYJu6bN";
    private static String UAT_IMAGE_EIS_AUTH_KEY = "Fbda4IDo6izH*pGE^n9soSny5u#8bWR7AZh6y9&@&Vq&MzygnP1pLmA%diaF7z4QOEB4$j1sca4XbV@C";
    private static int UAT_IMAGE_OFFSET_DAYS_PARAM = 17;
    //影像地址（SIT）
    private static String SIT_IMAGE_EIS_BASE_URL = "http://10.1.108.124:27100/eis";
    private static String SIT_IMAGE_EIS_INNER_URL = "http://10.1.108.124:27100/eis";
    private static String SIT_IMAGE_EIS_SYSTEM_CODE = "bpms";
    private static String SIT_IMAGE_EIS_SYSTEM_KEY = "ZmaX#ymikZxXfYKGP75G#V^Z9fYJu6bN";
    private static String SIT_IMAGE_EIS_AUTH_KEY = "Fbda4IDo6izH*pGE^n9soSny5u#8bWR7AZh6y9&@&Vq&MzygnP1pLmA%diaF7z4QOEB4$j1sca4XbV@C";
    private static int SIT_IMAGE_OFFSET_DAYS_PARAM = 17;

    //灰度
    private static String HUIDU_IMAGE_EIS_BASE_URL = "http://120.25.130.236:27100/eis";
    private static String HUIDU_IMAGE_EIS_INNER_URL = "http://120.25.130.236:27100/eis";//"http://172.16.180.236:27100/eis";
    private static String HUIDU_IMAGE_EIS_SYSTEM_CODE = "bpms";
    private static String HUIDU_IMAGE_EIS_SYSTEM_KEY = "ZmaX#ymikZxXfYKGP75G#V^Z9fYJu6bN";
    private static String HUIDU_IMAGE_EIS_AUTH_KEY = "Fbda4IDo6izH*pGE^n9soSny5u#8bWR7AZh6y9&@&Vq&MzygnP1pLmA%diaF7z4QOEB4$j1sca4XbV@C";
    private static int HUIDU_IMAGE_OFFSET_DAYS_PARAM = 17;
    //线上环境
    private static String RELEASE_IMAGE_EIS_BASE_URL = "http://120.25.133.111:27100/eis";
    private static String RELEASE_IMAGE_EIS_INNER_URL = "http://120.25.133.111:27100/eis";
    private static String RELEASE_IMAGE_EIS_SYSTEM_CODE = "bpms";
    private static String RELEASE_IMAGE_EIS_SYSTEM_KEY = "3c36f10885b290b4faf4e41988049d9a";
    private static String RELEASE_IMAGE_EIS_AUTH_KEY = "u/0xV7t2ihXnHjcwiuTprmTlC2yg9tnV3HMjgCnPAWFyqas5Lhkgfck6EqHTPBrc";
    private static int RELEASE_IMAGE_OFFSET_DAYS_PARAM = 7;

    public static String IMAGE_EIS_SYSTEM_KEY_PARAM = "eis_system_key";
    public static String IMAGE_EIS_SYSTEM_CODE_PARAM = "eis_system_code";

    //开发环境
    private static String DEV_IMAGE_EIS_BASE_URL = "http://10.1.108.124:27100/eis";
    private static String DEV_IMAGE_EIS_INNER_URL = "http://10.1.108.124:27100/eis";
    private static String DEV_IMAGE_EIS_SYSTEM_CODE = "bpms";
    private static String DEV_IMAGE_EIS_SYSTEM_KEY = "ZmaX#ymikZxXfYKGP75G#V^Z9fYJu6bN";
    private static String DEV_IMAGE_EIS_AUTH_KEY = "Fbda4IDo6izH*pGE^n9soSny5u#8bWR7AZh6y9&@&Vq&MzygnP1pLmA%diaF7z4QOEB4$j1sca4XbV@C";
    private static int DEV_IMAGE_OFFSET_DAYS_PARAM = 17;
    /////////////////////////影像地址 常量设置结束///////////////////////////////

    //业务系统、APP后台 地址
    private static String DEV_BPMS_BASE_URL = "http://10.11.0.166:11001";
    private static String DEV_APP_BASE_URL = "http://10.11.0.144:10100";
    private static String SIT_BPMS_BASE_URL = "http://119.23.69.49:8000/bpmsx-api";
    private static String SIT_APP_BASE_URL = "http://119.23.69.49:8000/mobile-api";
    private static String UAT_APP_BASE_URL = "http://120.25.130.236:58000/mobile-api";
    private static String UAT_BPMS_BASE_URL = "http://120.25.130.236:58000/bpmsx-api";
    private static String HUIDU_APP_BASE_URL = "http://120.25.130.236:58001/mobile-api";
    private static String HUIDU_BPMS_BASE_URL = "http://120.25.130.236:58001/bpmsx-api";
    private static String RELEASE_APP_BASE_URL = "http://120.77.128.139:58000/mobile-api";
    private static String RELEASE_BPMS_BASE_URL = "http://120.77.128.139:58000/bpmsx-api";
    //技术平台地址
    private static String DEV_PLATFORM_BASE_URL = "http://10.11.0.101:50100/platform";
    private static String SIT_PLATFORM_BASE_URL = "http://10.11.0.101:50100/platform";
    private static String UAT_PLATFORM_BASE_URL = "http://10.11.0.101:50100/platform";
    private static String HUIDU_PLATFORM_BASE_URL = "http://10.11.0.101:50100/platform";
    private static String RELEASE_PLATFORM_BASE_URL = " http://120.77.128.139:58000/platform";
    private static String DEV_PLATFORM_LOG_PROJECT = "ddjf-dev";
    private static String RELEASE_PLATFORM_LOG_PROJECT = "ddjf-prod";


    //log 日志服务
    public static String PLATFORM_LOG_TOKEN_PASSWORD_VALUE="123";
    public static String PLATFORM_LOG_TOKEN_USERNAME_VALUE="admin";
    public static String PLATFORM_LOG_ENDPOINT = "cn-shenzhen.log.aliyuncs.com";//华南1
    public static String PLATFORM_LOG_LOGSTORE = "pad_interview";


    public static boolean IS_OPEN_LOG = true;//是否开启日志

    //系统属性更新时间间隔 8小时
    public static final long SYSTEM_PROPERTY_UPDATE_TIME_INTERVAL = 8 * 60 * 60 * 1000;



    /**
     * 获取影像地址URL
     *
     * @return
     */
    public static String getImageEnvironmentalUrl() {
        if (CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.UAT) {
            return UAT_IMAGE_EIS_BASE_URL;
        }else if (CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.SIT) {
            return SIT_IMAGE_EIS_BASE_URL;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.DEV){
            return  DEV_IMAGE_EIS_BASE_URL;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.HUIDU){
            return  HUIDU_IMAGE_EIS_BASE_URL;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.RELEASE){
            return RELEASE_IMAGE_EIS_BASE_URL;
        }
        return UAT_IMAGE_EIS_BASE_URL;
    }

    public static String getImageSystemCode() {
        if (CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.UAT) {
            return UAT_IMAGE_EIS_SYSTEM_CODE;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.DEV){
            return  DEV_IMAGE_EIS_SYSTEM_CODE;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.HUIDU){
            return  HUIDU_IMAGE_EIS_SYSTEM_CODE;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.RELEASE){
            return RELEASE_IMAGE_EIS_SYSTEM_CODE;
        }
        return SIT_IMAGE_EIS_SYSTEM_CODE;
    }

    public static String getImageSystemKey() {
        if (CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.UAT) {
            return UAT_IMAGE_EIS_SYSTEM_KEY;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.DEV){
            return  DEV_IMAGE_EIS_SYSTEM_KEY;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.HUIDU){
            return  HUIDU_IMAGE_EIS_SYSTEM_KEY;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.RELEASE){
            return RELEASE_IMAGE_EIS_SYSTEM_KEY;
        }
        return SIT_IMAGE_EIS_SYSTEM_KEY;
    }

    public static String getImageAuthKey() {
        if (CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.UAT) {
            return UAT_IMAGE_EIS_AUTH_KEY;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.DEV){
            return  DEV_IMAGE_EIS_AUTH_KEY;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.HUIDU){
            return  HUIDU_IMAGE_EIS_AUTH_KEY;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.RELEASE){
            return RELEASE_IMAGE_EIS_AUTH_KEY;
        }
        return SIT_IMAGE_EIS_AUTH_KEY;
    }

    public static String getBpmsBaseUrl(String childUrl) {
        String bpmsBaseUrl = "";
        String appBaseUrl = "";
        if (CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.UAT) {
            bpmsBaseUrl = UAT_BPMS_BASE_URL;
            appBaseUrl = UAT_APP_BASE_URL;
        } else if (CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.DEV) {
            bpmsBaseUrl = DEV_BPMS_BASE_URL;
            appBaseUrl = DEV_APP_BASE_URL;
        }else if (CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.SIT) {
            bpmsBaseUrl = SIT_BPMS_BASE_URL;
            appBaseUrl = SIT_APP_BASE_URL;
        }else if (CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.HUIDU) {
            bpmsBaseUrl = HUIDU_BPMS_BASE_URL;
            appBaseUrl = HUIDU_APP_BASE_URL;
        }else if (CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.RELEASE) {
            bpmsBaseUrl = RELEASE_BPMS_BASE_URL;
            appBaseUrl = RELEASE_APP_BASE_URL;
        }
        if(childUrl.split("mobileapp").length>1){
            return appBaseUrl + childUrl;
        }
        return bpmsBaseUrl + childUrl;
    }

    public static String getImageInnerUrl() {
        if (CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.UAT) {
            return UAT_IMAGE_EIS_INNER_URL;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.DEV){
            return  DEV_IMAGE_EIS_INNER_URL;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.HUIDU){
            return  HUIDU_IMAGE_EIS_INNER_URL;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.RELEASE){
            return RELEASE_IMAGE_EIS_INNER_URL;
        }
        return SIT_IMAGE_EIS_INNER_URL;
    }

    public static String getImageBaseUrl() {
        if (CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.UAT) {
            return UAT_IMAGE_EIS_BASE_URL;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.DEV){
            return  DEV_IMAGE_EIS_BASE_URL;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.HUIDU){
            return  HUIDU_IMAGE_EIS_BASE_URL;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.RELEASE){
            return RELEASE_IMAGE_EIS_BASE_URL;
        }
        return SIT_IMAGE_EIS_BASE_URL;
    }

    public static int getImageOffsetDays() {
        if (CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.UAT) {
            return UAT_IMAGE_OFFSET_DAYS_PARAM;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.DEV){
            return  DEV_IMAGE_OFFSET_DAYS_PARAM;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.HUIDU){
            return  HUIDU_IMAGE_OFFSET_DAYS_PARAM;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.RELEASE){
            return RELEASE_IMAGE_OFFSET_DAYS_PARAM;
        }
        return SIT_IMAGE_OFFSET_DAYS_PARAM;
    }

    /**
     * 技术平台地址
     * @return
     */
    public static String getPlatformBaseUrl(){
        if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.SIT){
            return null;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.UAT){
            return null;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.RELEASE){
            return RELEASE_PLATFORM_BASE_URL;
        }else if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.HUIDU){
            return null;
        }
        return null;
    }

    /***
     * 日志服务的名称
     */
    public static String getLogProject(){
        if(CURRENT_ENVIRONMENTAL == Environmental.EnvironmentalEnum.RELEASE){
            return RELEASE_PLATFORM_LOG_PROJECT;
        }
        return DEV_PLATFORM_LOG_PROJECT;
    }
}
