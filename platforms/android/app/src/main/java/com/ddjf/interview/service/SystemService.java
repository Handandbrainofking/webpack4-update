package com.ddjf.interview.service;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

import com.ddjf.interview.database.DatabaseUtils;
import com.ddjf.interview.database.entity.AreaEntity;
import com.ddjf.interview.database.entity.SystemDictEntity;
import com.ddjf.interview.database.entity.SystemPropertyEntity;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.global.Constants;
import com.ddjf.interview.global.ThreadPoolManager;
import com.ddjf.interview.http.HttpApi;
import com.ddjf.interview.http.HttpSystemProperty;
import com.ddjf.interview.util.DateUtils;
import com.ddjf.interview.http.HttpUtils;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.SharedPreferenceUtil;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


public class SystemService extends Service {
    private String TAG = "SystemService";

    public SystemService() {

    }

    private void handlerData() {

        ThreadPoolManager.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                HttpSystemProperty.getSysDict();
                getSystemProperty();
                getArea();
            }
        });
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        try {

            // 1，如果强制更新状态，则进行数据的更新
            boolean status = SharedPreferenceUtil.getDataBoolean(SharedPreferenceUtil.FORCE_UPDATE_SYSTEM_PROPERTY);
            if (status) {
                handlerData();
                return super.onStartCommand(intent, flags, startId);
            }

            // 2，如果非强制更新状态，则启动后取上一次的更新时间，如果超过X小时就更新
            Long dictList = DatabaseUtils.queryEntitySize(new SystemDictEntity());
            Long propertyList = DatabaseUtils.queryEntitySize(new SystemPropertyEntity());
            Long areaList = DatabaseUtils.queryEntitySize(new AreaEntity());

            if (dictList > 0) {
                SystemDictEntity systemDictEntity = (SystemDictEntity) DatabaseUtils.queryEntity(new SystemDictEntity(), dictList - 2 + "");
                String updateTime = systemDictEntity.getUpdateTime();
                LogManager.infoLog(TAG, "上次的更新时间===" + updateTime);
                long beforTime = DateUtils.getDateForString(updateTime, DateUtils.DATA_FORMAT_ALL).getTime();
                LogManager.infoLog(TAG, "beforTime===" + beforTime + "   currentTime=" + (new Date()).getTime());
                if (((new Date()).getTime() - beforTime) > Constants.SYSTEM_PROPERTY_UPDATE_TIME_INTERVAL) {
                    handlerData();
                }
            }
            //初始化时没有数据的情况
            if (null == dictList || dictList == 0) {
                HttpSystemProperty.getSysDict();
            }
            if (null == propertyList || propertyList == 0) {
                getSystemProperty();
            }
            if (null == areaList || areaList == 0) {
                getArea();
            }


        } catch (Exception e) {
            ExceptionGlobalHandler.showException(TAG, e);
        }
        return super.onStartCommand(intent, flags, startId);
    }

    /**
     * 获取系统属性
     */
    private void getSystemProperty() {
        String url = Constants.getBpmsBaseUrl(HttpApi.SYSTEM_PROPERTY_LIST_URL);
        HttpUtils.httpGetRequest(url, null, null, new HttpUtils.HttpRequestCallBack() {

            @Override
            public void onFailure(Request request, Exception e) {
                LogManager.infoLog(TAG, "获取系统属性失败====" + e.getMessage());
            }

            @Override
            public void onSuccess(final Response response) {
                ThreadPoolManager.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            String body = response.body().string();
                            LogManager.infoLog(TAG, "获取系统属性结果====" + body.toString());
                            JSONObject jsonObject = new JSONObject(body);
                            String code = null;
                            if (jsonObject.has("code")) {
                                code = jsonObject.getString("code");
                            }

                            if (null != code && "200".equals(code)) {
                                SystemPropertyEntity entity = new SystemPropertyEntity();
                                Long list = DatabaseUtils.queryEntitySize(new SystemPropertyEntity());

                                entity.setCreateTime(DateUtils.formatDate(new Date(), DateUtils.DATA_FORMAT_ALL));
                                entity.setUpdateTime(DateUtils.formatDate(new Date(), DateUtils.DATA_FORMAT_ALL));

                                JSONArray array = jsonObject.getJSONArray("result");
                                for (int i = 0; i < array.length(); i++) {
                                    JSONObject item = array.getJSONObject(i);

                                    entity.setProKey(item.getString("proKey"));
                                    entity.setProName(item.getString("proName"));
                                    entity.setProValue(item.getString("proValue"));
                                    entity.setProStatus(item.getString("proStatus"));
                                    //替换单引号为双引号。 由于单引号引起数据库操作失败的情况
                                    entity.setProValue(entity.getProValue().replace("\'","\""));
                                    if (null != list && list > 0) {

                                        String param = "proKey='" + entity.getProKey() +
                                                "',proName='" + entity.getProName() + "',proValue='" + entity.getProValue() + "',proStatus='" + entity
                                                .getProStatus() + "',updateTime='" + entity.getUpdateTime() + "' ";
                                        String sql = "UPDATE " + entity.tableName + " set " + param + " where proKey='" + entity.getProKey() + "' " +
                                                "and " +
                                                "proValue='"
                                                + entity.getProValue() + "'";

                                        DatabaseUtils.updateForSql(sql, new String[]{});
                                    } else {
                                        DatabaseUtils.saveEntity(entity);
                                    }
                                }
                                SharedPreferenceUtil.setData(SharedPreferenceUtil.FORCE_UPDATE_SYSTEM_PROPERTY, false);
                            } else {
                                LogManager.infoLog(TAG, "获取系统属性失败====" + jsonObject.toString());
                            }
                        } catch (Exception e) {
                            ExceptionGlobalHandler.showException(TAG, e);
                        }
                    }
                });

            }
        });

    }


    /**
     * 获取省市区
     */
    private void getArea() {
        String url = Constants.getBpmsBaseUrl(HttpApi.GET_AREA_URL);
        HttpUtils.httpGetRequest(url, null, null, new HttpUtils.HttpRequestCallBack() {
            @Override
            public void onFailure(Request request, Exception e) {
                LogManager.errorLog(TAG, "获取省市区接口出错" + e.getMessage());
            }

            @Override
            public void onSuccess(final Response response) {
                ThreadPoolManager.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            String body = response.body().string();
                            JSONObject jsonObject = new JSONObject(body);

                            Boolean success = null;
                            if (jsonObject.has("success")) {
                                success = jsonObject.getBoolean("success");
                            }
                            LogManager.infoLog(TAG, "获取省市区结果====" + body.toString());
                            if (null != success && success) {
                                Map<String, AreaEntity> provinceMap = new HashMap<>();
                                Map<String, JSONObject> cityMap = new HashMap<>();
                                List<JSONObject> areaList = new ArrayList<>();

                                JSONArray array = jsonObject.getJSONArray("result");
                                String parentCode;
                                JSONObject contentObject;
                                for (int i = 0; i < array.length(); i++) {
                                    JSONObject item = array.getJSONObject(i);
                                    String type = item.getString("type");
                                    String code = item.getString("code");
                                    String name = item.getString("name");

                                    if (type.equals("1")) {//省份
                                        AreaEntity entity = new AreaEntity();
                                        entity.setProvinceCode(code);
                                        entity.setProvinceName(name);
                                        provinceMap.put(code, entity);

                                    } else if (type.equals("2")) {//市
                                        contentObject = new JSONObject();
                                        parentCode = item.getString("parentCode");
                                        contentObject.put("code", code);
                                        contentObject.put("name", name);
                                        contentObject.put("parentCode", parentCode);
                                        contentObject.put("areaArray", new JSONArray());
                                        cityMap.put(code, contentObject);

                                    } else if (type.equals("3")) {//区
                                        contentObject = new JSONObject();
                                        parentCode = item.getString("parentCode");
                                        contentObject.put("code", code);
                                        contentObject.put("name", name);
                                        contentObject.put("parentCode", parentCode);
                                        areaList.add(contentObject);
                                    }
                                }

                                /**
                                 * 将区的信息组装到市里面（areaArray 数组里面）
                                 */
                                for (int i = 0; i < areaList.size(); i++) {
                                    JSONObject areaItem = areaList.get(i);
                                    parentCode = areaItem.getString("parentCode");

                                    JSONObject cityItem = cityMap.get(parentCode);
                                    if (cityItem == null) {
                                        LogManager.infoLog(TAG, "areaItem=" + areaItem.toString() +
                                                "  parentCode=" + parentCode + " 没有cityItem");
                                        continue;
                                    }

                                    JSONArray areaArray = cityItem.getJSONArray("areaArray");

                                    if (null == areaArray || areaArray.length() == 0) {
                                        areaArray = new JSONArray();
                                    }

                                    areaArray.put(areaItem);
                                    cityItem.put("areaArray", areaArray);

                                    cityMap.put(parentCode, cityItem);
                                }

                                Long list = DatabaseUtils.queryEntitySize(new AreaEntity());

                                /***
                                 * 将市的信息组装到省里面
                                 */
                                Iterator it = cityMap.entrySet().iterator();
                                while (it.hasNext()) {
                                    Map.Entry entry = (Map.Entry) it.next();
                                    JSONObject cityItem = (JSONObject) entry.getValue();
                                    parentCode = cityItem.getString("parentCode");

                                    AreaEntity itemEntity = provinceMap.get(parentCode);
                                    JSONArray cityAndAreaJson;
                                    if (null == itemEntity.getCityAndAreaJSON() || itemEntity.getCityAndAreaJSON().equals("")) {
                                        cityAndAreaJson = new JSONArray();
                                    } else {
                                        cityAndAreaJson = new JSONArray(itemEntity.getCityAndAreaJSON());
                                    }

                                    cityAndAreaJson.put(cityItem);
                                    itemEntity.setCityAndAreaJSON(cityAndAreaJson.toString());

                                    provinceMap.put(parentCode, itemEntity);

                                }
                                it = provinceMap.entrySet().iterator();
                                while (it.hasNext()) {
                                    Map.Entry entry = (Map.Entry) it.next();
                                    AreaEntity itemEntity = (AreaEntity) entry.getValue();

                                    //存储到数据库中
                                    if (list > 0) {//更新
                                        String param = "provinceCode='" + itemEntity.getProvinceCode() +
                                                "',provinceName='" + itemEntity.getProvinceName() + "',cityAndAreaJSON='" +
                                                itemEntity.getCityAndAreaJSON() + "' ";
                                        String sql = "UPDATE " + itemEntity.tableName + " set " + param + " where provinceCode='" + itemEntity
                                                .getProvinceCode()
                                                + "'";

                                        DatabaseUtils.updateForSql(sql, new String[]{});
                                    } else {
                                        itemEntity.setCreateTime(DateUtils.formatDate(new Date(), DateUtils.DATA_FORMAT_ALL));
                                        itemEntity.setUpdateTime(DateUtils.formatDate(new Date(), DateUtils.DATA_FORMAT_ALL));
                                        DatabaseUtils.saveEntity(itemEntity);
                                    }

                                }


                            }
                        } catch (Exception e) {
                            ExceptionGlobalHandler.showException(TAG, e);
                        }

                    }
                });

            }
        });
    }

    @Override
    public IBinder onBind(Intent intent) {
        throw new UnsupportedOperationException("Not yet implemented");
    }
}
