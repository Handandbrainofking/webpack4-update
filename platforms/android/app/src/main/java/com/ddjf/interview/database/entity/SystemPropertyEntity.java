package com.ddjf.interview.database.entity;

import cn.ittiger.database.annotation.Column;
import cn.ittiger.database.annotation.PrimaryKey;
import cn.ittiger.database.annotation.Table;

/**
 * Created by yejunrong on 18/5/25.
 * 系统属性
 *
 */
@Table(name="systemPropertyTable")
public class SystemPropertyEntity extends BaseEntity{
    public String tableName="systemPropertyTable";

    @PrimaryKey(isAutoGenerate = true)
    private long id;

    //属性名称
    @Column
    private String proName;

    //属性key
    @Column
    private String proKey;

    //状态(启用enable，禁用disable）
    @Column
    private String proStatus;

    //属性值
    @Column
    private String proValue;

    @Column
    private String createTime;

    @Column
    private String updateTime;

    @Column
    private int version;

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getProName() {
        return proName;
    }

    public void setProName(String proName) {
        this.proName = proName;
    }

    public String getProKey() {
        return proKey;
    }

    public void setProKey(String proKey) {
        this.proKey = proKey;
    }

    public String getProStatus() {
        return proStatus;
    }

    public void setProStatus(String proStatus) {
        this.proStatus = proStatus;
    }

    public String getProValue() {
        return proValue;
    }

    public void setProValue(String proValue) {
        this.proValue = proValue;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
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
