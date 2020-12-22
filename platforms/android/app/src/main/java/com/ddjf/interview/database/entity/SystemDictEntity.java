package com.ddjf.interview.database.entity;

import cn.ittiger.database.annotation.Column;
import cn.ittiger.database.annotation.PrimaryKey;
import cn.ittiger.database.annotation.Table;


/**
 * Created by yejunrong on 18/5/23.
 * 系统字典
 */
@Table(name = "systemDictTable")
public class SystemDictEntity extends BaseEntity{

    public static String tableName="systemDictTable";

    @PrimaryKey(isAutoGenerate = true)
    private long id;

    // 类型
    @Column
    private String type;

    //类型说明
    @Column
    private String typeDesc;

    //(状态：启用enable、禁用disable)
    @Column
    private String status;

    //排序
    @Column
    private int sort;

    //标签名
    @Column
    private String label;

    //数据值
    @Column
    private String value;

    @Column
    private String createTime;

    @Column
    private String updateTime;

    @Column
    private long version;

    //删除标识（1删除，0有记录）
    @Column
    private String deleteFlag;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTypeDesc() {
        return typeDesc;
    }

    public void setTypeDesc(String typeDesc) {
        this.typeDesc = typeDesc;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getSort() {
        return sort;
    }

    public void setSort(int sort) {
        this.sort = sort;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
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

    public long getVersion() {
        return version;
    }

    public void setVersion(long version) {
        this.version = version;
    }

    public String getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(String deleteFlag) {
        this.deleteFlag = deleteFlag;
    }

}
