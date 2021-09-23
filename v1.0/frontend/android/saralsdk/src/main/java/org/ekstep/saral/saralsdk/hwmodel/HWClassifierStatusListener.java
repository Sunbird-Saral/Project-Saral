package org.ekstep.saral.saralsdk.hwmodel;

public interface HWClassifierStatusListener {
    public void OnModelLoadSuccess(String message);
    public void OnModelLoadError(String message);
}
