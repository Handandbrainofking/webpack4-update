package com.ddjf.interview.database;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.support.annotation.NonNull;

import com.ddjf.interview.database.entity.BaseEntity;
import com.ddjf.interview.util.FileUtils;
import com.ddjf.interview.log_manager.LogManager;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

import cn.ittiger.database.SQLiteDB;
import cn.ittiger.database.SQLiteDBConfig;
import cn.ittiger.database.SQLiteDBFactory;
import cn.ittiger.database.listener.IDBListener;

/**
 * Created by yejunrong on 18/3/28.
 */

public class DatabaseUtils {
    static String TAG = "DatabaseUtils";
    private static SQLiteDB mLiteDB;

    public DatabaseUtils(Context cxt) {
        configDatabase(cxt);
    }

    private static void configDatabase(Context cxt) {
        //SQLite相关配置，包括数据库名字、创建路径、版本号、数据创建和升级时的监听
        SQLiteDBConfig config = new SQLiteDBConfig(cxt);
        //设置数据库创建更新时的监听，有提供空实现：SimpleDBListener
        config.setDbListener(new IDBListener() {
            @Override
            public void onUpgradeHandler(SQLiteDatabase db, int oldVersion, int newVersion) {
                LogManager.infoLog(TAG, "数据库升级操作");
            }

            @Override
            public void onDbCreateHandler(SQLiteDatabase db) {
                LogManager.infoLog(TAG, "数据库创建成功");
            }
        });
        config.setVersion(1);
        config.setDbRootPath(FileUtils.AppCacheDatabaseDir);
        //创建db，在创建数据库的时候，不需要在onDbCreateHandler手动去创建相关的数据表，
        // 在对实体对象进行数据操作的时候，会自动判断表是否存在，不存在的话会自动创建，同时如果有新增的字段也会自动更新表结构
        mLiteDB = SQLiteDBFactory.createSQLiteDB(config);
    }

    /**
     *
     * 保存
     * @param entity
     * @return
     */
    public static long saveEntity(Object entity) {
        long result = mLiteDB.save(entity);
        return result;
    }

    /**
     * 保存 -- 集合
     *
     * @param
     * @return
     */
    public static long saveEntity(ArrayList<Object> lists) {
        long result = mLiteDB.save(lists);
        return result;
    }

    /**
     * 查询 entity所有数据
     *
     * @param entity
     * @return
     */
    public static List queryEntityList(Object entity) {
        List result = mLiteDB.queryAll(entity.getClass());
        return result;
    }

    /**
     * 根据主键查询
     *
     * @param entity
     * @param key
     * @return
     */
    public static BaseEntity queryEntity(BaseEntity entity, String key) {
        BaseEntity result = mLiteDB.query(entity.getClass(), key);
        if (null == result) {

            LogManager.infoLog(TAG, "根据主键查询 结果=没有任何数据");
        } else {

            LogManager.infoLog(TAG, "根据主键查询 结果=没有任何数据" + result.toString());
        }

        return result;
    }

    /**
     * 根据条件查询实体类
     *
     * @param mClass      查询的实体类
     * @param whereClause 查询条件where子句
     * @param whereArgs   where子句参数
     * @return
     */
    public static <T> List<T> query(Class<T> mClass, String whereClause, String[] whereArgs) {
        if(mLiteDB == null){
            return new ArrayList<>();
        }
        return mLiteDB.query(mClass, whereClause, whereArgs);
    }


    /**
     * 查询entity的数量
     *
     * @param entity
     * @return
     */
    public static Long queryEntitySize(Object entity) {
        if(null==entity || null==entity.getClass()){
            return new Long(-1);
        }
        Long result = mLiteDB.queryTotal(entity.getClass());
        return result;
    }

    /**
     * 删除指定 entity
     *
     * @param entity
     */
    public static void deleteEntity(Object entity) {
        mLiteDB.delete(entity);
    }

    /**
     * 更新entity , 需要指定的key
     *
     * @param entity
     */
    public static void updateEntityForKey(Object entity) {
        mLiteDB.update(entity);
    }

    /**
     * 自定义sql 更新
     * @param sql
     * @param args
     */
    public static void updateForSql(String sql,String[] args){
        mLiteDB.update(sql,args);
    }

    /**
     * 分页查询
     *
     * @param entity
     * @param curPage
     * @param pageSize
     * @return
     */
    public static List queryPage(Object entity, int curPage, int pageSize) {
        List result = mLiteDB.queryPage(entity.getClass(), curPage, pageSize);
        return result;
    }

    /**
     * 根据sql 预计查询
     *
     * @param sql
     * @param params
     * @return
     */
    public static Cursor querySQL(String sql, String[] params) {
        Cursor result = mLiteDB.query(sql, params);
        return result;
    }

}
