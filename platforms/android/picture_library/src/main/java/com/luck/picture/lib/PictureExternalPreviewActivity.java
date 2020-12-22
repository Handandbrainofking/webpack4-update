package com.luck.picture.lib;

import android.Manifest;
import android.app.Activity;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.PointF;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AlertDialog;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.PointerIcon;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.Priority;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.load.resource.gif.GifDrawable;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.RequestOptions;
import com.bumptech.glide.request.target.SimpleTarget;
import com.bumptech.glide.request.target.Target;
import com.bumptech.glide.request.transition.Transition;
import com.luck.picture.lib.config.PictureConfig;
import com.luck.picture.lib.config.PictureMimeType;
import com.luck.picture.lib.dialog.CustomDialog;
import com.luck.picture.lib.entity.LocalMedia;
import com.luck.picture.lib.permissions.RxPermissions;
import com.luck.picture.lib.photoview.OnViewTapListener;
import com.luck.picture.lib.photoview.PhotoView;
import com.luck.picture.lib.receiver.PictureSelectorReceiver;
import com.luck.picture.lib.tools.PictureFileUtils;
import com.luck.picture.lib.tools.ScreenUtils;
import com.luck.picture.lib.tools.ToastManage;
import com.luck.picture.lib.widget.PreviewViewPager;
import com.luck.picture.lib.widget.longimage.ImageSource;
import com.luck.picture.lib.widget.longimage.ImageViewState;
import com.luck.picture.lib.widget.longimage.SubsamplingScaleImageView;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import io.reactivex.Observer;
import io.reactivex.disposables.Disposable;

/**
 *
 * project：PictureSelector
 * package：com.luck.picture.ui
 * 大图预览界面
 * data：17/01/18
 */
public class PictureExternalPreviewActivity extends PictureBaseActivity implements View.OnClickListener {
    private ImageButton left_back;
    private TextView tv_title,save_picture;
    ImageView set_rotate,delete_picture;
    private PreviewViewPager viewPager;
    private List<LocalMedia> images = new ArrayList<>();
    private int position = 0,currentPostion;
    private String directory_path;
    private SimpleFragmentAdapter adapter;
    private LayoutInflater inflater;
    private RxPermissions rxPermissions;
    private loadDataThread loadDataThread;
    String TAG = "PictureExternalPreviewActivity";
    Activity mActivity;
    boolean isNotifyRefresh = false; //旋转保存、删除操作后 是否通知页面
    RelativeLayout rl_title;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.picture_activity_external_preview);
        mActivity = this;
        inflater = LayoutInflater.from(this);
        tv_title = (TextView) findViewById(R.id.picture_title);
        save_picture = (TextView) findViewById(R.id.save_picture);
        delete_picture = (ImageView) findViewById(R.id.delete_picture);
        set_rotate = (ImageView) findViewById(R.id.set_rotate);
        rl_title = (RelativeLayout)findViewById(R.id.rl_title);
        left_back = (ImageButton) findViewById(R.id.left_back);
        viewPager = (PreviewViewPager) findViewById(R.id.preview_pager);
        position = getIntent().getIntExtra(PictureConfig.EXTRA_POSITION, 0);
        currentPostion = position;
        directory_path = getIntent().getStringExtra(PictureConfig.DIRECTORY_PATH);
        images = (List<LocalMedia>) getIntent().getSerializableExtra(PictureConfig.EXTRA_PREVIEW_SELECT_LIST);
        left_back.setOnClickListener(this);
        set_rotate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                PhotoView view = adapter.viewsMap.get(currentPostion);
                if (null != view){
                    view.setRotationTo(view.currentRotation+90);
                }
                if(view.currentRotation%360 != 0){
                    save_picture.setVisibility(View.VISIBLE);
                    save_picture.setTag(view.currentRotation);
                }else{
                    save_picture.setVisibility(View.GONE);
                }
            }
        });
        save_picture.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isNotifyRefresh = true;
                PhotoView view = adapter.viewsMap.get(currentPostion);
                view.setTag(view.getId(),true);
                LocalMedia item = images.get(currentPostion);
                PictureSelectorReceiver.rotateSaveImage(mActivity,item.getApplyNo(),item.getFileKey(),(int)view.currentRotation+"");

                Log.i(TAG,"保存操作 当前旋转度数="+v.getTag()+"   图片信息=applyNo="+item.getApplyNo()+" key="+item.getFileKey());
                save_picture.setVisibility(View.GONE);
                set_rotate.setVisibility(View.GONE);
                delete_picture.setVisibility(View.GONE);
            }
        });
        delete_picture.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //删除提示
                AlertDialog.Builder builder = new AlertDialog.Builder(mActivity);
                builder.setMessage("确定要删除吗？");
                builder.setPositiveButton("确定", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        isNotifyRefresh = true;
                        LocalMedia item = images.get(currentPostion);
                        PictureSelectorReceiver.deleteImage(mActivity,item.getApplyNo(),item.getFileKey());
                        Log.i(TAG,"图片预览删除操作"+"   图片信息=applyNo="+item.getApplyNo()+" key="+item.getFileKey());
                        dialog.dismiss();
                    }
                });
                builder.setNegativeButton("取消", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                });
                final AlertDialog alertDialog = builder.create();
                alertDialog.setOnShowListener(new DialogInterface.OnShowListener() {
                    @Override
                    public void onShow(DialogInterface dialog) {
                        //修改按钮颜色
                        Button button = alertDialog.getButton(android.app.AlertDialog.BUTTON_POSITIVE);
                        button.setTextColor(Color.rgb(2, 179, 180));
                        button = alertDialog.getButton(android.app.AlertDialog.BUTTON_NEGATIVE);
                        button.setTextColor(Color.rgb(2, 179, 180));
                    }
                });

                alertDialog.show();

            }
        });
        initViewPageAdapterData();
    }

    @Override
    protected void onResume() {
        /**
         * 设置为横屏
         */
        if(getRequestedOrientation()!= ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE){
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        }
        super.onResume();
    }

    private void initViewPageAdapterData() {
        tv_title.setText(position + 1 + "/" + images.size());
        adapter = new SimpleFragmentAdapter();

        viewPager.setAdapter(adapter);
        viewPager.setCurrentItem(position);
        viewPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

            }

            @Override
            public void onPageSelected(int position) {
                try{

                    currentPostion = position;
                    tv_title.setText(position + 1 + "/" + images.size());

                    PhotoView view = adapter.viewsMap.get(currentPostion);
                    if(null != view.getTag(view.getId()) && (Boolean)view.getTag(view.getId())){
                        //已经保存过了则不能继续保存/选择/删除
                        save_picture.setVisibility(View.GONE);
                        set_rotate.setVisibility(View.GONE);
                        delete_picture.setVisibility(View.GONE);
                    }else{
                        save_picture.setVisibility(View.VISIBLE);
                        set_rotate.setVisibility(View.VISIBLE);
                        delete_picture.setVisibility(View.VISIBLE);
                    }
                }catch (Exception e){
                    Log.i(TAG,e.getMessage());
                    e.printStackTrace();
                }
            }

            @Override
            public void onPageScrollStateChanged(int state) {
            }
        });
    }

    @Override
    public void onClick(View v) {
        finishPage();
    }

    public void finishPage(){
        Intent intent = new Intent();
        intent.putExtra("isNotifyRefresh",isNotifyRefresh);
        setResult(RESULT_OK,intent);
        finish();
        overridePendingTransition(0, R.anim.a3);
    }

    public class SimpleFragmentAdapter extends PagerAdapter {
        private HashMap<Integer,PhotoView> viewsMap = new HashMap<>();

        @Override
        public int getCount() {
            return images.size();
        }

        @Override
        public void destroyItem(ViewGroup container, int position, Object object) {
            (container).removeView((View) object);
        }

        @Override
        public boolean isViewFromObject(View view, Object object) {
            return view == object;
        }

        @Override
        public Object instantiateItem(ViewGroup container, int position) {
            View contentView = inflater.inflate(R.layout.picture_image_preview, container, false);
            // 常规图控件
            final PhotoView imageView = (PhotoView) contentView.findViewById(R.id.preview_image);
            // 长图控件
            final SubsamplingScaleImageView longImg = (SubsamplingScaleImageView) contentView.findViewById(R.id.longImg);
            viewsMap.put(position,imageView);

            LocalMedia media = images.get(position);
            if (media != null) {
                final String pictureType = media.getPictureType();
                final String path;
                if (media.isCut() && !media.isCompressed()) {
                    // 裁剪过
                    path = media.getCutPath();
                } else if (media.isCompressed() || (media.isCut() && media.isCompressed())) {
                    // 压缩过,或者裁剪同时压缩过,以最终压缩过图片为准
                    path = media.getCompressPath();
                } else {
                    path = media.getPath();
                }
                boolean isHttp = PictureMimeType.isHttp(path);
                // 可以长按保存并且是网络图片显示一个对话框
                if (isHttp) {
                    showPleaseDialog();
                }
                boolean isGif = PictureMimeType.isGif(pictureType);
                final boolean eqLongImg = PictureMimeType.isLongImg(media);
                imageView.setVisibility(eqLongImg && !isGif ? View.GONE : View.VISIBLE);
                longImg.setVisibility(eqLongImg && !isGif ? View.VISIBLE : View.GONE);
                // 压缩过的gif就不是gif了
                if (isGif && !media.isCompressed()) {
                    RequestOptions gifOptions = new RequestOptions()
                            .override(480, 800)
                            .priority(Priority.HIGH)
                            .diskCacheStrategy(DiskCacheStrategy.NONE);
                    Glide.with(PictureExternalPreviewActivity.this)
                            .asGif()
                            .apply(gifOptions)
                            .load(path)
                            .listener(new RequestListener<GifDrawable>() {
                                @Override
                                public boolean onLoadFailed(@Nullable GlideException e, Object model
                                        , Target<GifDrawable> target, boolean isFirstResource) {
                                    dismissDialog();
                                    return false;
                                }

                                @Override
                                public boolean onResourceReady(GifDrawable resource, Object model
                                        , Target<GifDrawable> target, DataSource dataSource,
                                                               boolean isFirstResource) {
                                    dismissDialog();
                                    return false;
                                }
                            })
                            .into(imageView);
                } else {
                    RequestOptions options = new RequestOptions()
                            .diskCacheStrategy(DiskCacheStrategy.ALL);
                    Glide.with(PictureExternalPreviewActivity.this)
                            .asBitmap()
                            .load(path)
                            .apply(options)
                            .into(new SimpleTarget<Bitmap>() {
                                @Override
                                public void onLoadFailed(@Nullable Drawable errorDrawable) {
                                    super.onLoadFailed(errorDrawable);
                                    dismissDialog();
                                }

                                @Override
                                public void onResourceReady(Bitmap resource, Transition<? super Bitmap> transition) {
                                    dismissDialog();
                                    if (eqLongImg) {
                                        displayLongPic(resource, longImg);
                                    } else {
                                        imageView.setImageBitmap(resource);
                                    }
                                }
                            });
                }
                imageView.setOnViewTapListener(new OnViewTapListener() {
                    @Override
                    public void onViewTap(View view, float x, float y) {
                        rl_title.setVisibility(rl_title.getVisibility()==View.VISIBLE ? View.GONE:View.VISIBLE);
                    }
                });
                longImg.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        finishPage();
                    }
                });
                imageView.setOnLongClickListener(new View.OnLongClickListener() {
                    @Override
                    public boolean onLongClick(View v) {
                        if (rxPermissions == null) {
                            rxPermissions = new RxPermissions(PictureExternalPreviewActivity.this);
                        }
                        rxPermissions.request(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                                .subscribe(new Observer<Boolean>() {
                                    @Override
                                    public void onSubscribe(Disposable d) {
                                    }

                                    @Override
                                    public void onNext(Boolean aBoolean) {
                                        if (aBoolean) {
                                            showDownLoadDialog(path);
                                        } else {
                                            ToastManage.s(mContext, getString(R.string.picture_jurisdiction));
                                        }
                                    }

                                    @Override
                                    public void onError(Throwable e) {
                                    }

                                    @Override
                                    public void onComplete() {
                                    }
                                });
                        return true;
                    }
                });
            }
            (container).addView(contentView, 0);
            return contentView;
        }
    }

    /**
     * 加载长图
     *
     * @param bmp
     * @param longImg
     */
    private void displayLongPic(Bitmap bmp, SubsamplingScaleImageView longImg) {
        longImg.setQuickScaleEnabled(true);
        longImg.setZoomEnabled(true);
        longImg.setPanEnabled(true);
        longImg.setDoubleTapZoomDuration(100);
        longImg.setMinimumScaleType(SubsamplingScaleImageView.SCALE_TYPE_CENTER_CROP);
        longImg.setDoubleTapZoomDpi(SubsamplingScaleImageView.ZOOM_FOCUS_CENTER);
        longImg.setImage(ImageSource.cachedBitmap(bmp), new ImageViewState(0, new PointF(0, 0), 0));
    }

    /**
     * 下载图片提示
     */
    private void showDownLoadDialog(final String path) {
        final CustomDialog dialog = new CustomDialog(PictureExternalPreviewActivity.this,
                ScreenUtils.getScreenWidth(PictureExternalPreviewActivity.this) * 3 / 4,
                ScreenUtils.getScreenHeight(PictureExternalPreviewActivity.this) / 4,
                R.layout.picture_wind_base_dialog_xml, R.style.Theme_dialog);
        Button btn_cancel = (Button) dialog.findViewById(R.id.btn_cancel);
        Button btn_commit = (Button) dialog.findViewById(R.id.btn_commit);
        TextView tv_title = (TextView) dialog.findViewById(R.id.tv_title);
        TextView tv_content = (TextView) dialog.findViewById(R.id.tv_content);
        tv_title.setText(getString(R.string.picture_prompt));
        tv_content.setText(getString(R.string.picture_prompt_content));
        btn_cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialog.dismiss();
            }
        });
        btn_commit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showPleaseDialog();
                boolean isHttp = PictureMimeType.isHttp(path);
                if (isHttp) {
                    loadDataThread = new loadDataThread(path);
                    loadDataThread.start();
                } else {
                    // 有可能本地图片
                    try {
                        String dirPath = PictureFileUtils.createDir(PictureExternalPreviewActivity.this,
                                System.currentTimeMillis() + ".png", directory_path);
                        PictureFileUtils.copyFile(path, dirPath);
                        ToastManage.s(mContext, getString(R.string.picture_save_success) + "\n" + dirPath);
                        dismissDialog();

                        //保存图片后发送广播通知更新数据库
                        Uri uri = Uri.fromFile(new File(path));
                        mActivity.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, uri));


                    } catch (IOException e) {
                        ToastManage.s(mContext, getString(R.string.picture_save_error) + "\n" + e.getMessage());
                        dismissDialog();
                        e.printStackTrace();
                    }
                }
                dialog.dismiss();
            }
        });
        dialog.show();
    }


    // 进度条线程
    public class loadDataThread extends Thread {
        private String path;

        public loadDataThread(String path) {
            super();
            this.path = path;
        }

        @Override
        public void run() {
            try {
                showLoadingImage(path);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    // 下载图片保存至手机
    public void showLoadingImage(String urlPath) {
        try {
            URL u = new URL(urlPath);
            String path = PictureFileUtils.createDir(PictureExternalPreviewActivity.this,
                    System.currentTimeMillis() + ".png", directory_path);
            byte[] buffer = new byte[1024 * 8];
            int read;
            int ava = 0;
            long start = System.currentTimeMillis();
            BufferedInputStream bin;
            bin = new BufferedInputStream(u.openStream());
            BufferedOutputStream bout = new BufferedOutputStream(
                    new FileOutputStream(path));
            while ((read = bin.read(buffer)) > -1) {
                bout.write(buffer, 0, read);
                ava += read;
                long speed = ava / (System.currentTimeMillis() - start);
            }
            bout.flush();
            bout.close();
            Message message = handler.obtainMessage();
            message.what = 200;
            message.obj = path;
            handler.sendMessage(message);

            //保存图片后发送广播通知更新数据库
            Uri uri = Uri.fromFile(new File(path));
            mActivity.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, uri));
            
        } catch (IOException e) {
            ToastManage.s(mContext, getString(R.string.picture_save_error) + "\n" + e.getMessage());
            e.printStackTrace();
        }
    }


    private Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what) {
                case 200:
                    String path = (String) msg.obj;
                    ToastManage.s(mContext, getString(R.string.picture_save_success) + "\n" + path);
                    dismissDialog();
                    break;
            }
        }
    };

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if(keyCode == KeyEvent.KEYCODE_BACK){
            finishPage();
            return false;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (loadDataThread != null) {
            handler.removeCallbacks(loadDataThread);
            loadDataThread = null;
        }
    }
}
