package com.ddjf.interview.database.entity;

import cn.ittiger.database.annotation.Column;
import cn.ittiger.database.annotation.PrimaryKey;
import cn.ittiger.database.annotation.Table;

/**
 * Created by yejunrong on 18/5/26.
 * 系统版本
 * 数据库systemVersionTable表中 有且只有一条数据
 */
@Table(name = "systemVersionTable")
public class SystemVersionEntity {
    public String tableName = "systemVersionTable";

    @PrimaryKey(isAutoGenerate = true)
    private long id;

    //apk版本名
    @Column()
    private String apkVersionName;

    //apk版本号
    @Column()
    private Long apkVersionCode;

    //js版本名
    @Column()
    private String jsVersionName;

    //js版本号
    @Column()
    private Long jsVersionCode;

    //是否强制更新apk
    @Column()
    private Boolean apkForceFlag;

    //apk下载地址
    @Column()
    private String apkUrl;

    //是否强制更新js
    @Column()
    private Boolean jsForceFlag;

    //js压缩包地址
    @Column()
    private String jsUrl;

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getApkVersionName() {
        return apkVersionName;
    }

    public void setApkVersionName(String apkVersionName) {
        this.apkVersionName = apkVersionName;
    }

    public Long getApkVersionCode() {
        return apkVersionCode;
    }

    public void setApkVersionCode(Long apkVersionCode) {
        this.apkVersionCode = apkVersionCode;
    }

    public String getJsVersionName() {
        return jsVersionName;
    }

    public void setJsVersionName(String jsVersionName) {
        this.jsVersionName = jsVersionName;
    }

    public Long getJsVersionCode() {
        return jsVersionCode;
    }

    public void setJsVersionCode(Long jsVersionCode) {
        this.jsVersionCode = jsVersionCode;
    }

    public Boolean getApkForceFlag() {
        return apkForceFlag;
    }

    public void setApkForceFlag(Boolean apkForceFlag) {
        this.apkForceFlag = apkForceFlag;
    }

    public String getApkUrl() {
        return apkUrl;
    }

    public void setApkUrl(String apkUrl) {
        this.apkUrl = apkUrl;
    }

    public Boolean getJsForceFlag() {
        return jsForceFlag;
    }

    public void setJsForceFlag(Boolean jsForceFlag) {
        this.jsForceFlag = jsForceFlag;
    }

    public String getJsUrl() {
        return jsUrl;
    }

    public void setJsUrl(String jsUrl) {
        this.jsUrl = jsUrl;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
