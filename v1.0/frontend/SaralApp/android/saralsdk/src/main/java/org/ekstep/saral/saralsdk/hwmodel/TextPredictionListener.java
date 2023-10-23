package org.ekstep.saral.saralsdk.hwmodel;

public interface TextPredictionListener {
    public void OnTextPredictionSuccess(String text, float confidence, String id);
    public void OnPredictionFailed(String error, String id);
}
