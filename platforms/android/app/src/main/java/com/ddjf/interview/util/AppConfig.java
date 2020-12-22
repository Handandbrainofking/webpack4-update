package com.ddjf.interview.util;

import android.content.Context;

import java.io.File;


public class AppConfig {
  private static final String TAG = "AppConfig";
  private static AppPreferences sPreferences = new AppPreferences();

  public static void init(Context context) {
    loadAppSetting(context);
  }

  /***
   * 加载jsBundler
   * @return
   */
  public static String getLaunchUrl() {
    if (isLaunchLocally()) {
      String path = "";//FileUtils.WeexFileDir+ File.separator +"index.js";
      if(!(new File(path).exists())){
        path = "file://assets/dist/index.js";
      }else{
        path = "file://"+path;
      }

      return path;
    }
    String path = "http://127.0.0.1:8080/dist/index.js";

    return path;
  }

  public static Boolean isLaunchLocally() {
    return sPreferences.getBoolean("launch_locally", false);
  }

  private static void loadAppSetting(Context context) {
    AppConfigXmlParser parser = new AppConfigXmlParser();
    parser.parse(context);
    sPreferences = parser.getPreferences();
  }
}
