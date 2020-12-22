package com.luck.picture.lib.tools;

/**
 *
 * project：PictureSelector
 * package：com.luck.picture.lib.tool
 *
 * data：2017/5/25
 */

public class DoubleUtils {
    /**
     * Prevent continuous click, jump two pages
     */
    private static long lastClickTime;
    private final static long TIME = 800;

    public static boolean isFastDoubleClick() {
        long time = System.currentTimeMillis();
        if (time - lastClickTime < TIME) {
            return true;
        }
        lastClickTime = time;
        return false;
    }
}
