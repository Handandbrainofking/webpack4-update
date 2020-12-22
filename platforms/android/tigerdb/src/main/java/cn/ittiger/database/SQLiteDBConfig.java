package cn.ittiger.database;

import cn.ittiger.database.listener.IDBListener;
import cn.ittiger.database.listener.SimpleDBListener;

import android.content.Context;

/**
 * 数据库相关配置
 * @author: huylee
 * @time:	2015-8-12下午10:22:59
 */
public final class SQLiteDBConfig {
	/**
	 * 默认数据库名，可修改
	 */
	public static String DEFAULT_DB_NAME = "interview.db";
	/**
	 * 默认版本号，可修改
	 */
	public static int DEFAULT_VERSION = 1;
	/**
	 * 数据库上下文
	 */
	private Context mContext;
	/**
	 * 数据库文件名,默认为：Tiger.db
	 */
	private String mDbName = DEFAULT_DB_NAME;
	/**
	 * 当前数据库版本号
	 */
	private int mVersion = DEFAULT_VERSION;
	/**
	 * 数据库监听
	 */
	private IDBListener mDbListener;

	/**
	 * 数据库的根目录
	 */
	private String mDbRootPath ;
	
	public SQLiteDBConfig(Context context) {
		this.mContext = context;
		mDbListener = new SimpleDBListener();
	}
	
	public SQLiteDBConfig(Context context, String dbName) {
		super();
		this.mContext = context;
		this.mDbName = dbName;
		mDbListener = new SimpleDBListener();
	}


	/**
	 * 获取数据库所在的上下文
	 * @author: huylee
	 * @time:	2015-8-12下午10:28:35
	 * @return
	 */
	public Context getContext() {
		return mContext;
	}
	
	/**
	 * 设置数据库所在的上下文
	 * @author: huylee
	 * @time:	2015-8-12下午10:29:03
	 * @param mContext
	 */
	public void setContext(Context mContext) {
		this.mContext = mContext;
	}
	

	public String getDbName() {
		return mDbName;
	}
	
	public void setDbName(String mDbName) {
		this.mDbName = mDbName;
	}
	
	public int getVersion() {
		return mVersion;
	}
	
	public void setVersion(int mVersion) {
		this.mVersion = mVersion;
	}

	public IDBListener getDbListener() {
		return mDbListener;
	}

	public void setDbListener(IDBListener mDbListener) {
		this.mDbListener = mDbListener;
	}

	public String getmDbRootPath() {
		return mDbRootPath;
	}

	public void setDbRootPath(String mDbRootPath) {
		this.mDbRootPath = mDbRootPath;
	}
}
