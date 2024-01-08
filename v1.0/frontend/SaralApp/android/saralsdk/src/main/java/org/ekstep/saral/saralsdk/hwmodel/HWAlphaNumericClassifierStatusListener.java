package org.ekstep.saral.saralsdk.hwmodel;

public interface HWAlphaNumericClassifierStatusListener {
    public void OnModelLoadSuccess(String message);
    public void OnModelLoadError(String message);
}
