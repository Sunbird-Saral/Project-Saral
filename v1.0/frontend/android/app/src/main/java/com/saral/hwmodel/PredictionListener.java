package com.saral.hwmodel;

public interface PredictionListener {
    public void OnPredictionSuccess(int digit, float confidence, String id);
    public void OnPredictionFailed(String error);
    public void OnModelLoadStatus(String message);
}
