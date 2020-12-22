package com.luck.picture.lib.observable;

import com.luck.picture.lib.entity.LocalMedia;
import com.luck.picture.lib.entity.LocalMediaFolder;

import java.util.List;

/**
 *
 * project：PictureSelector
 * package：com.luck.picture.lib.observable
 *
 * data：17/1/16
 */
public interface ObserverListener {
    void observerUpFoldersData(List<LocalMediaFolder> folders);

    void observerUpSelectsData(List<LocalMedia> selectMedias);
}
