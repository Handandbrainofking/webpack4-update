package com.ddjf.interview.database.entity;

import com.ddjf.interview.util.DateUtils;

import java.util.Date;

import cn.ittiger.database.annotation.Column;
import cn.ittiger.database.annotation.PrimaryKey;
import cn.ittiger.database.annotation.Table;

/**
 * Created by yejunrong on 18/3/30.
 */
@Table(name="fileUploadTable")
public class FileEntity extends BaseEntity {
    public static String FileSuffixImageJpeg=".jpeg";
    public static String FileSuffixImageZip=".zip";

    //设置主键id为自增长，也可以通过注解@Column设置字段名或字段默认值
    @PrimaryKey(isAutoGenerate = true)
    protected long id;

    //文件名
    @Column(defaultValue="")
    private String fileName;

    //图片上传的 url
    @Column(defaultValue="")
    private String serverUrl;

    //本地手机缓存 url
    @Column(defaultValue="")
    private String locationCacheUrl;

    //本地 url
    @Column(defaultValue="")
    private String locationUrl;

    //图片压缩后的路径
    @Column()
    private String compressImageUrl;

    //影像系统对应的文件key
    @Column(defaultValue="")
    private String fileKey;

    //数组形式
    private String[] fileKeys;

    //json串参数
    @Column(defaultValue="")
    private String jsonParams;

    //状态 0成功；1失败:2上传中:3 原始文件找不到了
    @Column()
    private int status;

    //订单号
    @Column()
    private String applyNo;

    //文件类型 银行卡、身份证、结婚证、合同等
    @Column()
    private String fileType;

    //文件后缀名
    @Column()
    private String suffix;

    //身份证号码
    @Column
    private String custCertID;

    //返回信息的json串
    @Column
    private String resultJsonInfo;

    //客户编号
    @Column
    private String customerNo;

    //文件大小
    @Column
    private String fileSize;

    @Column()
    private String createDate;

    @Column()
    private String updateDate;

    //认证获取的访问URL
    @Column()
    private String authUrl;

    //排序
    @Column()
    private int sortNo;

    /**
     *
     * @param fileName
     * @param serverUrl 服务器上传地址
     * @param status
     * @param applyNo
     * @param locationCacheUrl 本地缓存图片地址
     * @param jsonParams
     * @param fileType
     */
    public FileEntity(String fileName,String serverUrl,int status,String applyNo,
                      String locationCacheUrl,String jsonParams,String fileType,String createDate){
        this.fileName = fileName;
        this.serverUrl = serverUrl;
        this.status = status;
        this.applyNo = applyNo;
        this.locationCacheUrl = locationCacheUrl;
        if(null != jsonParams){
            this.jsonParams = jsonParams;
        }
        this.fileType = fileType;
        if(null != createDate){
            this.createDate = createDate;
        }
        this.updateDate = DateUtils.getStringDate();

    }

    public FileEntity(){}

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getServerUrl() {
        return serverUrl;
    }

    public void setServerUrl(String serverUrl) {
        this.serverUrl = serverUrl;
    }

    public String getLocationCacheUrl() {
        return locationCacheUrl;
    }

    public void setLocationCacheUrl(String locationCacheUrl) {
        this.locationCacheUrl = locationCacheUrl;
    }

    public String getJsonParams() {
        return jsonParams;
    }

    public void setJsonParams(String jsonParams) {
        this.jsonParams = jsonParams;
    }

    public int getStatus() {
        return status;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }

    public String getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(String updateDate) {
        this.updateDate = updateDate;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getApplyNo() {
        return applyNo;
    }

    public void setApplyNo(String applyNo) {
        this.applyNo = applyNo;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getLocationUrl() {
        return locationUrl;
    }

    /**
     * 获取js需要展示的图片URL
     * @return
     */
    public String getLocationCacheUrlForJs(){
        if(null!=locationCacheUrl && locationCacheUrl.indexOf("file:") > -1){
            return locationCacheUrl;
        }
        return "file://"+locationCacheUrl;
    }

    public void setLocationUrl(String locationUrl) {
        this.locationUrl = locationUrl;
    }

    public String getFileKey() {
        return fileKey;
    }

    public String getAuthUrl() {
        return authUrl;
    }

    public void setAuthUrl(String authUrl) {
        this.authUrl = authUrl;
    }

    public void setFileKey(String fileKey) {
        this.fileKey = fileKey;
    }

    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    public String getCustCertID() {
        return custCertID;
    }

    public void setCustCertID(String custCertID) {
        this.custCertID = custCertID;
    }

    public String getCustomerNo() {
        return customerNo;
    }

    public void setCustomerNo(String customerNo) {
        this.customerNo = customerNo;
    }

    public String getResultJsonInfo() {
        return resultJsonInfo;
    }

    public void setResultJsonInfo(String resultJsonInfo) {
        this.resultJsonInfo = resultJsonInfo;
    }

    public String getFileSize() {
        return fileSize;
    }

    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }

    public String getCompressImageUrl() {
        return compressImageUrl;
    }

    public void setCompressImageUrl(String compressImageUrl) {
        this.compressImageUrl = compressImageUrl;
    }

    public int getSortNo() {
        return sortNo;
    }

    public void setSortNo(int sortNo) {
        this.sortNo = sortNo;
    }

    public String[] getFileKeys() {
        return fileKeys;
    }

    public void setFileKeys(String[] fileKeys) {
        this.fileKeys = fileKeys;
    }
}
