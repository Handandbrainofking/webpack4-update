/*
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.taobao.weex.analyzer.utils;

import android.support.annotation.Nullable;

import com.taobao.weex.utils.WXLogUtils;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Locale;


public final class ReflectionUtil {
    private static final String TAG = "ReflectionUtil";

    private ReflectionUtil() {
    }

    @Nullable
    public static Class<?> tryGetClassForName(String className) {
        try {
            return Class.forName(className);
        } catch (ClassNotFoundException e) {
            return null;
        }
    }

    @Nullable
    public static Field tryGetDeclaredField(Class<?> theClass, String fieldName) {
        try {
            return theClass.getDeclaredField(fieldName);
        } catch (NoSuchFieldException e) {
            WXLogUtils.d(TAG, String.format(Locale.CHINA, "Could not retrieve %s field from %s", fieldName, theClass));

            return null;
        }
    }

    @Nullable
    public static Method tryGetMethod(Class<?> theClass, String methodName, Class... parameterTypes) {
        try {
            return theClass.getMethod(methodName, parameterTypes);
        } catch (NoSuchMethodException e) {
            WXLogUtils.d(TAG, String.format(Locale.CHINA, "Could not retrieve %s method from %s", methodName, theClass));
        }
        return null;
    }

    public static Object tryInvokeMethod(Object receiver, Method method, Object... argument) {
        try {
            if (method != null && receiver != null) {
                return method.invoke(receiver, argument);
            }
        } catch (Exception e) {
            WXLogUtils.d(TAG, String.format(Locale.CHINA, "Could not invoke %s method from %s", method, receiver));
        }
        return null;
    }

    @Nullable
    public static Object getFieldValue(Field field, Object target) {
        try {
            return field.get(target);
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }
}
