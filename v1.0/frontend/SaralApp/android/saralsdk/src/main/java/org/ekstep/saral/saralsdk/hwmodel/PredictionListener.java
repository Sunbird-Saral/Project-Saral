package org.ekstep.saral.saralsdk.hwmodel;

public interface PredictionListener {
    public void OnPredictionSuccess(int digit, float confidence, String id, String annotate, int total);
    public void OnPredictionFailed(String error, String id);
}
