package com.luck.picture.lib.observable;


/**
 *
 * project：PictureSelector
 * package：com.luck.picture.lib.observable
 *
 * data：17/1/16
 */
public interface SubjectListener {
    void add(ObserverListener observerListener);

    void remove(ObserverListener observerListener);
}
