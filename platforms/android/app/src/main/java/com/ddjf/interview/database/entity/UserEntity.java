package com.ddjf.interview.database.entity;

import java.util.Date;

import cn.ittiger.database.annotation.Column;
import cn.ittiger.database.annotation.PrimaryKey;
import cn.ittiger.database.annotation.Table;

/**
 * Created by yejunrong on 18/3/29.
 */

//新建实体，可以通过注解@Table设置表名,如果不设置默认以类名User作为表名
@Table(name = "userTable")
public class UserEntity extends BaseEntity{
    //必须实现无参构造
    public UserEntity() {

    }
    //设置主键id为自增长，也可以通过注解@Column设置字段名或字段默认值
    @PrimaryKey(isAutoGenerate = true)
    protected long id;

    public UserEntity(String name) {
        super();
        this.name = name;
    }

    @Column(defaultValue="")
    private String name;

    @PrimaryKey()
    private String mobile;

    @PrimaryKey()
    private String userId;

    private boolean status; //true登录，false登出

    @Column()
    private String createDate;

    @Column()
    private String updateDate;

    @Column()
    private String accessToken;

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public boolean getStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public boolean isStatus() {
        return status;
    }
}
