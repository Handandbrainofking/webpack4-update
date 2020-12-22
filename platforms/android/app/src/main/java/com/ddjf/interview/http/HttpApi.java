package com.ddjf.interview.http;

/**
 * Created by yejunrong on 18/5/15.
 *
 * 请求接口API
 */

public class HttpApi {
    private static String BPMS_URL_VERSION = "v1";

    /**
     * 图片上传
     * /eis/upload?fileName=sb.jpg
      */
    public static final String IMAGE_UPLOAD_URL="/upload?fileName=";

    /**
     * 图片预览
     * /eis/view/{fileKey}?authKey=1234&systemCode=bpms
     */
    public static final String IMAGE_VIEW_URL="/view";

    /**
     * 图片删除
     */
    public static final String IMAGE_DELETE_URL="/delete";

    /**
     * 身份证识别
     */
    public static final String IMAGE_ID_CARD_URL = "/mobileapp/api/card/idCardAnalysis";

    /**
     * 银行卡识别
     */
    public static final String IMAGE_BANK_CRAD_URL = "/mobileapp/api/card/bankCardAnalysis";

    /**
     * 数据字典
     */
    public static final String SYSTEM_DICT_LIST_URL = "/mobileapp/api/dict/getDictList";


    /**
     * 系统属性
     */
    public static final String SYSTEM_PROPERTY_LIST_URL = "/mobileapp/api/property/getPropertyList";

    /**
     * 系统版本更新
     */
    public static final String SYSTEM_UPDATE_URL = "/mobileapp/api/version/getlatestversion";
    /**
     * log文件上传
     */
    public static final String LOG_FILE_UPLOAD_URL = "/mobileapp/api/log/uploadLogFile";

    /***
     *登录后设备信息记录
     */
    public static final String LOGIN_AFTER_RECORD_URL = "/mobileapp/api/record/uploadRecord";

    /***
     * log日志信息上传
     */
    public static final String LOG_MSG_UPLOAD_URL="/mobileapp/api/log/uploadLog";

    /***
     * 获取省市区列表
     */
    public static final String GET_AREA_URL="/mobileapp/api/area/getAreaList";

    /***
     * 业务系统 图片上传
     */
    public static final String BPMS_UPLOAD_IMAGE_URL="/bpmsx/order/material/"+BPMS_URL_VERSION+"/upload";

    /**
     * 业务系统 图片删除
     */
    public static final String BPMS_DELETE_IMAGE_URL="/bpmsx/order/material/"+BPMS_URL_VERSION+"/delete";

    /***
     * 客户信息 保存
     */
    public static final String BPMS_CUSTOMER_SAVE_URL="/bpmsx/customer/"+BPMS_URL_VERSION+"/save";

    /**
     * 技术平台日志服务
     */
    public static final String PLATFORM_LOG_TOKEN_URL="/log/token";

    /**
     * 图片旋转后保存操作
     * /eis/image/rotate/{fileKey}?rotate=?
     */
    public static final String IMAGE_ROTATE_SAVE="/image/rotate/";

    /***
     * 业务系统-图片旋转后保存操作（先在影像系统保存后再进行业务系统的保存）
     */
    public static final String BPMS_IMAGE_ROTATE_SAVE="/bpmsx/order/material/"+BPMS_URL_VERSION+"/rotateImage";

    /**
     * 业务系统-图片拷贝
     */
    public static final String BPMS_IMAGE_COPY="/bpmsx/order/material/"+BPMS_URL_VERSION+"/copy";

    /**
     * 影像系统-图片拷贝获取fileKey
     */
    public static final String EIS_IMAGE_COPY_GET_FILEKEY="/copy";

    /***
     * 获取征信报告
     */
    public static final String BPMS_GET_CREDIT_DETAIL="/bpmsx/order/risk/"+BPMS_URL_VERSION+"/getCreditDetail";
}
