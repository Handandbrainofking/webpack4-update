package com.ddjf.interview.database.entity;

import cn.ittiger.database.annotation.Column;
import cn.ittiger.database.annotation.PrimaryKey;
import cn.ittiger.database.annotation.Table;

/**
 * Created by yejunrong on 18/6/8.
 * 省市区
 *
 */
@Table(name = "areaTable")
public class AreaEntity extends BaseEntity {
    public static String tableName="areaTable";

    @PrimaryKey(isAutoGenerate = true)
    private long id;


    /**
     * 省编码
     */
    @Column
    private String provinceCode;

    /**
     * 省名称
     */
    @Column
    private String provinceName;

    /**
     * 市和区组成的json字符串
     */
    @Column
    private String cityAndAreaJSON;

    @Column
    private String createTime;

    @Column
    private String updateTime;

    public static String getTableName() {
        return tableName;
    }

    public static void setTableName(String tableName) {
        AreaEntity.tableName = tableName;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }


    public String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {
        this.provinceCode = provinceCode;
    }

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }

    public String getCityAndAreaJSON() {
        return cityAndAreaJSON;
    }

    public void setCityAndAreaJSON(String cityAndAreaJSON) {
        this.cityAndAreaJSON = cityAndAreaJSON;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
    }
}
