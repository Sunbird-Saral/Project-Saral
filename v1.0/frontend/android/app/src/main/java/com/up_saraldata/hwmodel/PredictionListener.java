package com.up_saraldata.hwmodel;

public interface PredictionListener {
    public void OnPredictionSuccess(int digit, String id);
    public void OnPredictionFailed(String error);
    public void OnModelLoadStatus(String message);
}
