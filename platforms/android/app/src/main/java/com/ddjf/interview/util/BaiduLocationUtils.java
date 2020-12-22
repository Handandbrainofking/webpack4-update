package com.ddjf.interview.util;

import com.baidu.location.BDAbstractLocationListener;
import com.baidu.location.BDLocation;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.ddjf.interview.WXApplication;
import com.ddjf.interview.log_manager.LogManager;

/**
 * Created by yejunrong on 18/7/2.
 * 百度 定位
 *
 */

public class BaiduLocationUtils {
    public  LocationClient mLocationClient = null;
    public  BDLocation mBDLocation;
    private MyLocationListener myListener = new MyLocationListener();

    public void onCreate() {
        //声明LocationClient类
        mLocationClient = new LocationClient(WXApplication.mAppInstance);
        initParam();

        //注册监听函数
        mLocationClient.registerLocationListener(myListener);

    }

    private void initParam(){
        LocationClientOption option = new LocationClientOption();

        //可选，设置定位模式，默认高精度
        //LocationMode.Hight_Accuracy：高精度；
        //LocationMode. Battery_Saving：低功耗；
        //LocationMode. Device_Sensors：仅使用设备；
        option.setLocationMode(LocationClientOption.LocationMode.Battery_Saving);

        //可选，设置返回经纬度坐标类型，默认gcj02
        //gcj02：国测局坐标；
        //bd09ll：百度经纬度坐标；
        //bd09：百度墨卡托坐标；
        //海外地区定位，无需设置坐标类型，统一返回wgs84类型坐标
        option.setCoorType("bd09ll");

        option.setIsNeedAddress(true);//可选，设置是否需要地址信息，默认不需要

        //可选，设置发起定位请求的间隔，int类型，单位ms
        //如果设置为0，则代表单次定位，即仅定位一次，默认为0
        //如果设置非0，需设置1000ms以上才有效
        option.setScanSpan(1000 * 60 * 2);//2分钟更新一次位置

        //可选，设置是否使用gps，默认false
        //使用高精度和仅用设备两种定位模式的，参数必须设置为true
        option.setOpenGps(true);


        //可选，设置是否当GPS有效时按照1S/1次频率输出GPS结果，默认false
        option.setLocationNotify(true);

        //可选，定位SDK内部是一个service，并放到了独立进程。
        //设置是否在stop的时候杀死这个进程，默认（建议）不杀死，即setIgnoreKillProcess(true)
        option.setIgnoreKillProcess(false);

        //可选，设置是否收集Crash信息，默认收集，即参数为false
        option.SetIgnoreCacheException(false);

        //可选，7.2版本新增能力
        //如果设置了该接口，首次启动定位时，会先判断当前WiFi是否超出有效期，若超出有效期，会先重新扫描WiFi，然后定位
        option.setWifiCacheTimeOut(5*60*1000);

        //可选，设置是否需要过滤GPS仿真结果，默认需要，即参数为false
        option.setEnableSimulateGps(false);

        //mLocationClient为第二步初始化过的LocationClient对象
        //需将配置好的LocationClientOption对象，通过setLocOption方法传递给LocationClient对象使用
        //更多LocationClientOption的配置，请参照类参考中LocationClientOption类的详细说明
        mLocationClient.setLocOption(option);

    }



    public class MyLocationListener extends BDAbstractLocationListener {
        @Override
        public void onReceiveLocation(BDLocation location){
            //此处的BDLocation为定位结果信息类，通过它的各种get方法可获取定位相关的全部结果
            //以下只列举部分获取经纬度相关（常用）的结果信息
            //更多结果信息获取说明，请参照类参考中BDLocation类中的说明

            double latitude = location.getLatitude();    //获取纬度信息
            double longitude = location.getLongitude();    //获取经度信息
            float radius = location.getRadius();    //获取定位精度，默认值为0.0f
            int errorCode = location.getLocType();
            if((latitude+"").equals("4.9E-324")){
                LogManager.infoLog("百度定位","获取地理位置失败!错误码=="+errorCode);
                SharedPreferenceUtil.setData(SharedPreferenceUtil.LOCATION_SERVER_STATUS,false);
                return;
            }
            SharedPreferenceUtil.setData(SharedPreferenceUtil.LOCATION_SERVER_STATUS,true);
            mBDLocation = location;

            String coorType = location.getCoorType();
            //获取经纬度坐标类型，以LocationClientOption中设置过的坐标类型为准


            //获取定位类型、定位错误返回码，具体信息可参照类参考中BDLocation类中的说明
            LogManager.infoLog("百度定位获取相关数据：","纬度="+latitude+"  经度="+
                    longitude+" 定位精度="+radius+"  坐标类型="+coorType+ " 定位类型或者定位错误码=" +
                    errorCode+" 具体位置=" + location.getAddrStr() +" 当前APP的内存=" +
                    String.format("%.2f", MemoryUtils.totalMemory()) );
        }
    }



}
