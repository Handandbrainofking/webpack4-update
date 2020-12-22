package com.ddjf.interview.http;

import com.ddjf.interview.database.DatabaseUtils;
import com.ddjf.interview.database.entity.SystemDictEntity;
import com.ddjf.interview.exception.ExceptionGlobalHandler;
import com.ddjf.interview.global.Constants;
import com.ddjf.interview.global.ThreadPoolManager;
import com.ddjf.interview.log_manager.LogManager;
import com.ddjf.interview.util.DateUtils;
import com.ddjf.interview.util.FileUtils;
import com.ddjf.interview.util.SharedPreferenceUtil;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Date;

/**
 * 系统属性 获取
 */
public class HttpSystemProperty {
    static String TAG = "HttpSystemProperty";

    /**
     * 获取字典
     */
    public static void getSysDict() {

        String url = Constants.getBpmsBaseUrl(HttpApi.SYSTEM_DICT_LIST_URL);
        HttpUtils.httpGetRequest(url, null, null, new HttpUtils.HttpRequestCallBack() {
            @Override
            public void onFailure(Request request, Exception e) {

                LogManager.infoLog(TAG, "获取数据字典失败====" + e.getMessage());
            }

            @Override
            public void onSuccess(final Response response) {
                ThreadPoolManager.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            String body = response.body().string();
                            LogManager.infoLog(TAG, "获取数据字典结果====" + body.toString());
                            JSONObject jsonObject = new JSONObject(body);
                            String code = null;
                            if (jsonObject.has("code")) {
                                code = jsonObject.getString("code");
                            }

                            if (null != code && "200".equals(code)) {

                                SystemDictEntity entity = new SystemDictEntity();
                                Long list = DatabaseUtils.queryEntitySize(new SystemDictEntity());

                                entity.setCreateTime(DateUtils.formatDate(new Date(), DateUtils.DATA_FORMAT_ALL));
                                entity.setUpdateTime(DateUtils.formatDate(new Date(), DateUtils.DATA_FORMAT_ALL));

                                JSONArray array = jsonObject.getJSONArray("result");

                                //将字典写入文件
                                FileUtils.writeSystemDicFile(body);
                                SharedPreferenceUtil.setData(SharedPreferenceUtil.SYSTEM_DIC_CACHE,body);
                                for (int i = 0; i < array.length(); i++) {
                                    JSONObject item = array.getJSONObject(i);

                                    entity.setLabel(item.getString("label"));
                                    entity.setSort(item.getInt("sort"));
                                    entity.setStatus(item.getString("status"));
                                    entity.setType(item.getString("type"));
                                    entity.setTypeDesc(item.getString("typeDesc"));
                                    entity.setValue(item.getString("value"));

                                    if (list > 0) {

                                        String param = "label='" + entity.getLabel() +
                                                "',sort=" + entity.getSort() + ",status='" + entity.getStatus() + "',type='" + entity.getType() +
                                                "',typeDesc='" + entity.getTypeDesc() + "',value='" + entity.getValue() + "',updateTime='" + entity
                                                .getUpdateTime() + "' ";
                                        String sql = "UPDATE " + entity.tableName + " set " + param + " where value='" + entity.getValue() + "' and" +
                                                " type='"
                                                + entity
                                                .getType() + "'";

                                        DatabaseUtils.updateForSql(sql, new String[]{});
                                    } else {
                                        DatabaseUtils.saveEntity(entity);
                                    }
                                }
                                SharedPreferenceUtil.setData(SharedPreferenceUtil.FORCE_UPDATE_SYSTEM_PROPERTY, false);
                            } else {
                                LogManager.infoLog(TAG, "获取数据字典失败====" + jsonObject.toString());
                            }
                        } catch (Exception e) {
                            ExceptionGlobalHandler.showException(TAG, e);
                            LogManager.infoLog(TAG, "获取数据字典失败 异常====" + e.getMessage());
                        }
                    }
                });


            }
        });
    }
}
