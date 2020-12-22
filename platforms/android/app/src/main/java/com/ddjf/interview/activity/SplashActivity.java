package com.ddjf.interview.activity;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationSet;
import android.view.animation.RotateAnimation;
import android.view.animation.ScaleAnimation;

import com.baidu.mobstat.StatService;
import com.ddjf.interview.R;
import com.ddjf.interview.util.PermissionManager;


public class SplashActivity extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);


        final boolean perResult = PermissionManager.getActionPermission(this);

        View textView = findViewById(R.id.fullscreen_content);
        ScaleAnimation scaleAnimation = new ScaleAnimation(0.0f, 1.0f, 0.0f, 1.0f, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF,
                0.5f);
        RotateAnimation rotateAnimation = new RotateAnimation(0f, 360f, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);

        AnimationSet animationSet = new AnimationSet(false);
        animationSet.addAnimation(scaleAnimation);
        animationSet.addAnimation(rotateAnimation);
        animationSet.setDuration(1500);
        //不能用LogManager 因为此时阿里云日志还没有初始化好。
        Log.i("splashActivity", "animation之前");
        animationSet.setAnimationListener(new Animation.AnimationListener() {
            @Override
            public void onAnimationStart(Animation animation) {
                Log.i("splashActivity", "animation开始");
            }

            @Override
            public void onAnimationEnd(Animation animation) {
                Log.i("splashActivity", "animation结束");
                if(perResult){
                    jumpNextPage();
                }
            }

            @Override
            public void onAnimationRepeat(Animation animation) {
            }
        });
        textView.startAnimation(animationSet);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        for(String per : permissions){ 

            if(null != per && per.equals(Manifest.permission.WRITE_EXTERNAL_STORAGE)){
                jumpNextPage();
            }
        }
    }

    private void jumpNextPage(){

        Intent intent = new Intent(SplashActivity.this, WXPageActivity.class);
        Uri data = getIntent().getData();
        if (data != null) {
            intent.setData(data);
        }
        intent.putExtra("from", "splash");
        startActivity(intent);
        finish();
    }

}
