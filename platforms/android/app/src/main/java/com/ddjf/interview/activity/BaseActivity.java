
package com.ddjf.interview.activity;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;

import com.baidu.mobstat.StatService;
import com.ddjf.interview.R;
import com.ddjf.interview.WXApplication;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.receiver.PictureLibraryReceiver;
import com.ddjf.interview.util.FileUtils;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.SystemUtils;
import com.ddjf.interview.util.WXAnalyzerDelegate;
import com.luck.picture.lib.receiver.PictureSelectorReceiver;
import com.taobao.weex.IWXRenderListener;
import com.taobao.weex.WXSDKEngine;
import com.taobao.weex.WXSDKInstance;
import com.taobao.weex.common.WXRenderStrategy;
import com.ddjf.interview.util.CommonUtils;

import org.json.JSONObject;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

/**
 * Activity 基类
 */
public abstract class BaseActivity extends AppCompatActivity implements IWXRenderListener {
    public final String TAG = "BaseActivity";
    protected ViewGroup mContainer;
    public WXSDKInstance mInstance;
    protected Uri mUri;
    private WxReloadListener mReloadListener;
    private WxRefreshListener mRefreshListener;
    private String mUrl;// "http://your_current_IP:12580/examples/build/index.js";
    private String mPageName = TAG;
    protected Boolean isLocalUrl = false;
    protected WXAnalyzerDelegate mWxAnalyzerDelegate;  //性能监控类
    public String mCurrentPageUri;//当前页面URI
    private long assetsJsVersion = 0; //assets下js的版本号
    private long cacheJsVersion = 0;//缓存下js的版本号
    PictureLibraryReceiver mPictureLibraryReceiver;


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mPictureLibraryReceiver = new PictureLibraryReceiver();
        registerReceiver(mPictureLibraryReceiver, new IntentFilter(PictureSelectorReceiver.PICTURE_SELECT_RECEIVER_ACTION));
        LogManager.infoLog(TAG, " 监听 广播  mPictureLibraryReceiver");

        if (getSupportActionBar() != null) {
            getSupportActionBar().hide();
        }
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);


        createWeexInstance();
        //接入性能分析工具
        if(null == mWxAnalyzerDelegate){
            mWxAnalyzerDelegate = new WXAnalyzerDelegate(this);
            mWxAnalyzerDelegate.onCreate();
        }


        try {
            String cacheContent = FileUtils.readFile(FileUtils.WeexConfigFile, FileUtils.WeexFileDir);
            JSONObject jsonObject = new JSONObject();

            if (!TextUtils.isEmpty(cacheContent)) {
                jsonObject = new JSONObject(cacheContent);
                cacheJsVersion = jsonObject.getLong("versionCode");
            }

            //获取assets/dist/下面的版本信息
            cacheContent = FileUtils.readAssetsFile(FileUtils.WeexConfigFile, "dist");
            jsonObject = new JSONObject(cacheContent);
            assetsJsVersion = jsonObject.getLong("versionCode");

            SystemUtils.checkNetStatus();

        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG, e);
        }

    }

    public void onNewIntent(Intent intent) {

    }

    protected final ViewGroup getContainer() {
        return mContainer;
    }

    protected final void setContainer(ViewGroup container) {
        mContainer = container;
    }

    protected void destoryWeexInstance() {
        if (mInstance != null) {
            mInstance.registerRenderListener(null);
            mInstance.destroy();
            mInstance = null;
        }
    }

    protected void createWeexInstance() {
        destoryWeexInstance();
        mInstance = new WXSDKInstance(this);
        mInstance.registerRenderListener(this);
        //设置固定尺寸
        mInstance.setInstanceViewPortWidth(2560);
    }

    protected void renderPageByURL(String url) {
        if (null == url) {
            return;
        }
        renderPageByURL(url, null);
    }

    protected void renderPageByURL(String url, String jsonInitData) {
        CommonUtils.throwIfNull(mContainer, new RuntimeException("Can't render page, container is null"));
        Map<String, Object> options = new HashMap<>();
        options.put(WXSDKInstance.BUNDLE_URL, url);
//    WXFileUtils.loadFileOrAsset();
        //渲染 页面
        mInstance.renderByUrl(
                getPageName(),
                url,
                options,
                jsonInitData,
                WXRenderStrategy.APPEND_ASYNC);
    }

    public String getPageName() {
        return mPageName;
    }

    @Override
    public void onStart() {
        super.onStart();
        if (mInstance != null) {
            mInstance.onActivityStart();
        }
        if (mWxAnalyzerDelegate != null) {
            mWxAnalyzerDelegate.onStart();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if (mInstance != null) {
            mInstance.onActivityResume();
        }
        if (mWxAnalyzerDelegate != null) {
            mWxAnalyzerDelegate.onResume();
        }
        if (null != mCurrentPageUri) {
            StatService.onPageStart(this, mCurrentPageUri);
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        if (mInstance != null) {
            mInstance.onActivityPause();
        }
        if (mWxAnalyzerDelegate != null) {
            mWxAnalyzerDelegate.onPause();
        }
        if (null != mCurrentPageUri) {
            StatService.onPageEnd(this, mCurrentPageUri);
        }
    }

    @Override
    public void onStop() {
        super.onStop();
        if (mInstance != null) {
            mInstance.onActivityStop();
        }
        if (mWxAnalyzerDelegate != null) {
            mWxAnalyzerDelegate.onStop();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (mInstance != null) {
            mInstance.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (mInstance != null) {
            mInstance.onActivityResult(requestCode, resultCode, data);
        }
    }

    public void finish(){
        super.finish();
    }

    public void startActivity(Intent intent){
        super.startActivity(intent);
        // Activity 切换 左右动画
        if(WXApplication.startActivityAnimId == R.anim.slide_in_right){
            overridePendingTransition(R.anim.slide_in_right, android.R.anim.fade_out);
        }else{
            overridePendingTransition(android.R.anim.fade_in, R.anim.slide_out_right);
        }
        
         LogManager.infoLog(TAG,"current="+WXApplication.startActivityAnimId+"  left="+
                R.anim.slide_in_left + "   right="+ R.anim.slide_in_right);

        WXApplication.startActivityAnimId = (WXApplication.startActivityAnimId ==
                R.anim.slide_in_left ? R.anim.slide_in_right : R.anim.slide_in_left) ;
    }

    @Override
    public void overridePendingTransition(int enterAnim, int exitAnim) {
        super.overridePendingTransition(enterAnim, exitAnim);
        LogManager.infoLog(TAG,"enter="+enterAnim+"  exit="+exitAnim);
    }

    public void jumpPage(String pageUri){

    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        if (mWxAnalyzerDelegate != null) {
            mWxAnalyzerDelegate.onDestroy();
            mWxAnalyzerDelegate = null;
        }

        if (null != mPictureLibraryReceiver) {
            unregisterReceiver(mPictureLibraryReceiver);
            mPictureLibraryReceiver = null;
        }
        if(null != mInstance){
            mInstance = null;
        }
        if (mContainer != null) {
            mContainer.removeAllViews();
            mContainer = null;
        }
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        if (mWxAnalyzerDelegate != null) {
            mWxAnalyzerDelegate.onReceiveTouchEvent(ev);
        }
        return super.dispatchTouchEvent(ev);
    }

    @Override
    public void onViewCreated(WXSDKInstance wxsdkInstance, View view) {
        View wrappedView = null;
        if (mWxAnalyzerDelegate != null) {
            wrappedView = mWxAnalyzerDelegate.onWeexViewCreated(wxsdkInstance, view);
        }
        if (wrappedView != null) {
            view = wrappedView;
        }
        if (mContainer != null) {
            mContainer.removeAllViews();
            mContainer.addView(view);
        }
    }

    @Override
    public void onRefreshSuccess(WXSDKInstance wxsdkInstance, int width, int height) {
        LogManager.infoLog(TAG, "");

    }


    @Override
    public void onRenderSuccess(WXSDKInstance instance, int width, int height) {
        LogManager.infoLog(TAG, "");
        if (mWxAnalyzerDelegate != null) {
            mWxAnalyzerDelegate.onWeexRenderSuccess(instance);
        }
    }

    @Override
    public void onException(WXSDKInstance instance, String errCode, String msg) {
        LogManager.errorLog(TAG, "解析JSBundle发生错误  errCode=" + errCode + "  msg=" + msg);
        if (mWxAnalyzerDelegate != null) {
            mWxAnalyzerDelegate.onException(instance, errCode, msg);
        }
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        return (mWxAnalyzerDelegate != null && mWxAnalyzerDelegate.onKeyUp(keyCode, event)) || super.onKeyUp(keyCode, event);
    }

    public void setReloadListener(WxReloadListener reloadListener) {
        mReloadListener = reloadListener;
    }


    public void setRefreshListener(WxRefreshListener refreshListener) {
        mRefreshListener = refreshListener;
    }

    public String getUrl() {
        return mUrl;
    }

    public void setUrl(String url) {
        mUrl = url;
    }

    public void loadUrl(String url) {
        setUrl(url);
//    renderPage();
    }

    protected void preRenderPage() {

    }

    protected void postRenderPage() {

    }

    protected void renderPage() {
        preRenderPage();
        renderPageByURL(mUrl);
        postRenderPage();
    }

    /**
     * 加载js页面 路径的获取
     * 先在缓存路径获取js，如果没有再去assets/dist目录下面获取
     *
     * @param currentPage 例如：interview.js?productType=1&nodesType=2&orderId=undefined&
     * @return
     */
    protected String loadPage(String currentPage) {
        String jsPath = "";
        try {
            if (null == currentPage) return currentPage;

            String[] jsArray = currentPage.split(".js");
            String fileName = jsArray[0].split("/")[jsArray[0].split("/").length - 1] + ".js";
            File jsFile = new File(FileUtils.WeexFileDir, fileName);
            LogManager.infoLog(TAG, "assets版本号==" + assetsJsVersion + "  缓存js版本号=" + cacheJsVersion);
            //如果缓存目录有文件并且版本号比当前assets的版本号更高
            if (jsFile.exists() && (cacheJsVersion > assetsJsVersion)) {
                jsPath = "file://" + jsFile.getAbsolutePath() + (jsArray.length > 1 ? jsArray[1] : "");
                LogManager.infoLog(TAG, "加载缓存目录文件==" + jsPath);
            } else {
                return currentPage;
            }
            LogManager.infoLog(TAG, "加载的js 文件==" + jsPath);
        } catch (Throwable e) {
            e.printStackTrace();
        }

        return jsPath;
    }

    protected boolean isLocalPage() {
        boolean isLocalPage = true;
        if (mUri != null) {
            String scheme = mUri.getScheme();
            isLocalPage = !mUri.isHierarchical() ||
                    (!TextUtils.equals(scheme, "http") && !TextUtils.equals(scheme, "https"));
        }
        return isLocalPage;
    }

    public void setPageName(String pageName) {
        mPageName = pageName;
    }

    public interface WxReloadListener {
        void onReload();
    }

    public interface WxRefreshListener {
        void onRefresh();
    }

    public class DefaultBroadcastReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (WXSDKInstance.ACTION_DEBUG_INSTANCE_REFRESH.equals(intent.getAction())) {
                if (mRefreshListener != null) {
                    mRefreshListener.onRefresh();
                }
            } else if (WXSDKEngine.JS_FRAMEWORK_RELOAD.equals(intent.getAction())) {
                if (mReloadListener != null) {
                    mReloadListener.onReload();
                }
            }
        }
    }

    /**
     * 监听 按键事件:
     * 注意:
     * 返回值表示:是否能完全处理该事件
     * 在此处返回false,所以会继续传播该事件.
     * 在具体项目中此处的返回值视情况而定.
     */
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        LogManager.infoLog(TAG, " 当前按的key===" + keyCode);
        if ((keyCode == KeyEvent.KEYCODE_BACK) || (keyCode == KeyEvent.KEYCODE_HOME)
                || (keyCode == KeyEvent.KEYCODE_MENU)) {
            LogManager.infoLog(TAG, " onKeyDown()");
            return false;
        } else {

            return false;
        }
    }


    @Override
    public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        switch (level) {
            case TRIM_MEMORY_UI_HIDDEN:
                LogManager.infoLog(TAG, "");

            case TRIM_MEMORY_RUNNING_MODERATE:
                //你的app正在运行并且不在死亡清单中。但是，系统处于低内存状态，开始触法杀死LRU Cache中的Process机制
                LogManager.infoLog(TAG, "你的app正在运行并且不在死亡清单中。但是，系统处于低内存状态，开始触法杀死LRU Cache中的Process机制");


            case TRIM_MEMORY_RUNNING_LOW:
                //你的app正在运行并且不在死亡清单中。但是，系统处于更低内存状态，应该释放不用的资源以提高系统性能
                // （但是会直接影响你的app的性能)
                LogManager.infoLog(TAG, "你的app正在运行并且不在死亡清单中。但是，系统处于更低内存状态，应该释放不用的资源以提高系统性能\n" +
                        "(但是会直接影响你的app的性能)");

            case TRIM_MEMORY_RUNNING_CRITICAL:
                //你的app仍在运行，但是，系统已经杀死LRU Cache中的大多数进程，如果系统回收不到足够的RAM数量，
                // 将会清除所有LRU缓存中的进程，并且开始杀死之前判断不应该杀死的进程，如：包换正在运行状态的Service的进程。
                //此时应该释放所有非必须的资源，维持系统生态的和谐。
                LogManager.infoLog(TAG, "你的app仍在运行，但是，系统已经杀死LRU Cache中的大多数进程，如果系统回收不到足够的RAM数量，\n" +
                        "将会清除所有LRU缓存中的进程，并且开始杀死之前判断不应该杀死的进程，如：包换正在运行状态的Service的进程。\n" +
                        "此时应该释放所有非必须的资源，维持系统生态的和谐。");
                break;

            case TRIM_MEMORY_BACKGROUND:
                //系统处于低内存状态，你的app处于LRU缓存名单中最不容易杀掉的位置。
                LogManager.infoLog(TAG, "系统处于低内存状态，你的app处于LRU缓存名单中最不容易杀掉的位置。");
                break;

            case TRIM_MEMORY_MODERATE:
                //系统处于低内存状态，你的app处于LRU缓存名单中部位置。应该释放不用的资源以提高系统性能（但是会直接影响你的app的性能）。
                LogManager.infoLog(TAG, "系统处于低内存状态，你的app处于LRU缓存名单中部位置。应该释放不用的资源以提高系统性能（但是会直接影响你的app的性能）。");
                break;
            case TRIM_MEMORY_COMPLETE:
                //系统处于低内存状态，你的app处于LRU缓存名单中最容易杀掉的位置。此时应该释放掉任何不影响app恢复状态的资源以保全自己。
                LogManager.infoLog(TAG, "系统处于低内存状态，你的app处于LRU缓存名单中最容易杀掉的位置。此时应该释放掉任何不影响app恢复状态的资源以保全自己。");
                break;
        }
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        LogManager.infoLog(TAG, " onLowMemory");
    }
}
