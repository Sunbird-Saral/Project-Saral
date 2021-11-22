package org.ekstep.saral.saralsdk;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.media.MediaActionSound;
import android.os.Bundle;
import android.os.Environment;
import android.os.SystemClock;
import android.util.Log;
import android.view.SurfaceView;
import android.view.Window;
import android.view.WindowManager;
import android.util.Base64;
import android.graphics.Bitmap;
import org.opencv.android.Utils;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactContext;

import org.ekstep.saral.saralsdk.hwmodel.HWClassifier;
import org.ekstep.saral.saralsdk.hwmodel.PredictionListener;
import org.ekstep.saral.saralsdk.opencv.DetectShaded;
import org.ekstep.saral.saralsdk.opencv.TableCornerCirclesDetection;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.opencv.android.BaseLoaderCallback;
import org.opencv.android.CameraBridgeViewBase;
import org.opencv.android.LoaderCallbackInterface;
import org.opencv.android.OpenCVLoader;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Point;
import org.opencv.core.Scalar;
import org.opencv.imgproc.Imgproc;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

public class SaralSDKOpenCVScannerActivity extends ReactActivity implements CameraBridgeViewBase.CvCameraViewListener2 {
    private static final String  TAG                    = "SrlSDK::Scanner";
    private static long mframeCount                     = 0;
    private static long mIgnoreFrameCount               = 0;
    private static final int START_PROCESSING_COUNT     = 20;

    private String mlayoutConfigs                       = null;
    private boolean isHWClassiferAvailable              = true;
    private boolean isRelevantFrameAvailable            = false;
    private boolean mIsScanningComplete                 = false;
    private boolean mScanningResultShared               = false;

    private Mat                             mRgba;
    private CameraBridgeViewBase            mOpenCvCameraView;
    private TableCornerCirclesDetection     mTableCornerDetection;
    private DetectShaded                    mDetectShaded;
    private long                            mStartTime;
    private long                            mStartPredictTime;

    private int     mTotalClassifiedCount               = 0;
    private boolean mIsClassifierRequestSubmitted       = false;
    private HashMap<String, String> mPredictedDigits    = new HashMap<>();
    private HashMap<String, String> mPredictedOMRs      = new HashMap<>();
    private HashMap<String, String> mPredictedClass     = new HashMap<>();
    private HashMap<String, String> mRoiMatBase64       = new HashMap<>();
    private boolean isMultiChoiceOMRLayout = false;

    public SaralSDKOpenCVScannerActivity() {
        Log.i(TAG, "Instantiated new " + this.getClass());
    }

    /** Called when the activity is first created. */
    @SuppressLint("SourceLockedOrientationActivity")
    @Override
    public void onCreate(Bundle savedInstanceState) {
        Log.i(TAG, "called onCreate");
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        super.onCreate(savedInstanceState);
        Bundle b = getIntent().getExtras();
        if(b != null) {
            mlayoutConfigs = b.getString("layoutConfigs");
            Log.d(TAG, "Scanner type: " + mlayoutConfigs);
        }

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setContentView(R.layout.activity_scanner);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

        mOpenCvCameraView = (CameraBridgeViewBase) findViewById(R.id.camera_scanner_activity_surface_view);
        mOpenCvCameraView.setVisibility(SurfaceView.VISIBLE);
        mOpenCvCameraView.setCvCameraViewListener(this);
        mOpenCvCameraView.enableFpsMeter();
        mOpenCvCameraView.setCameraPermissionGranted();
        mOpenCvCameraView.enableView();
    }

    @Override
    public void onPause()
    {
        super.onPause();
        if (mOpenCvCameraView != null)
            mOpenCvCameraView.disableView();
    }

    @Override
    public void onResume()
    {
        super.onResume();
        HWClassifier.getInstance().setPredictionListener(new PredictionListener() {
            @Override
            public void OnPredictionSuccess(int digit, float confidence, String id) {
                Log.d(TAG, "predicted digit:" + digit + " unique id:" + id + " confidence:" + confidence);
                
                mTotalClassifiedCount++;
                try {
                    JSONObject result = new JSONObject();
                    result.put("prediction", new Integer(digit));
                    result.put("confidence", new Double(confidence));
                    mPredictedDigits.put(id, result.toString());
                } catch (JSONException e) {
                    Log.e(TAG, "unable to create prediction object");
                }

                if (mIsClassifierRequestSubmitted && mTotalClassifiedCount >= mPredictedDigits.size()) {
                    mIsScanningComplete     = true;
                }

                if (mIsScanningComplete) {
                    Log.d(TAG, "Scaning completed, classification count " + mTotalClassifiedCount);
                    processScanningCompleted();
                }
            }

            @Override
            public void OnPredictionFailed(String error, String id) {
                Log.e(TAG, "Model prediction failed");
                mTotalClassifiedCount++;
                try {
                    JSONObject result = new JSONObject();
                    result.put("prediction", new Integer(0));
                    result.put("confidence", new Double(0.0));
                    mPredictedDigits.put(id, result.toString());
                } catch (JSONException e) {
                    Log.e(TAG, "unable to create prediction object");
                }

                if (mIsClassifierRequestSubmitted && mTotalClassifiedCount >= mPredictedDigits.size()) {
                    mIsScanningComplete     = true;
                }

                if (mIsScanningComplete) {
                    Log.d(TAG, "Scaning completed, classification count " + mTotalClassifiedCount);
                    processScanningCompleted();
                }
            }
        });
    }

    public void onDestroy() {
        super.onDestroy();
        if (mOpenCvCameraView != null)
            mOpenCvCameraView.disableView();
    }

    @Override
    public List<? extends CameraBridgeViewBase> getCameraViewList() {
        return null;
    }

    public void onCameraViewStarted(int width, int height) {
        mRgba                           = new Mat(height, width, CvType.CV_8UC4);
        mTableCornerDetection           = new TableCornerCirclesDetection(false);
        mDetectShaded                   = new DetectShaded(false);
        mTotalClassifiedCount           = 0;
        mIsScanningComplete             = false;
        mScanningResultShared           = false;
        isHWClassiferAvailable          = true;
        isRelevantFrameAvailable        = false;
        mIsClassifierRequestSubmitted   = false;
        mframeCount                     = 0;
        mIgnoreFrameCount               = 0;
    }

    public void onCameraViewStopped() {
        mRgba.release();
    }

    public Mat onCameraFrame(CameraBridgeViewBase.CvCameraViewFrame inputFrame) {
        mRgba               = inputFrame.rgba();
        if (!isRelevantFrameAvailable) {
            processCameraFrame(mRgba, mframeCount);
            mframeCount ++;
        } else {
            showProcessingInformation(mRgba);
        }
        return mRgba;
    }

    private void processCameraFrame(Mat image, long frameCount) {
        double DARKNESS_THRESHOLD   = 80.0;
        Mat tableMat                = mTableCornerDetection.processMat(image);
        mStartTime                  = SystemClock.uptimeMillis();
        isMultiChoiceOMRLayout = isMultiChoiceOMRLayout();
        if(isMultiChoiceOMRLayout)
        {
            DARKNESS_THRESHOLD = 70.0;
        }
        if (tableMat != null && isHWClassiferAvailable) {
            if (mIgnoreFrameCount < START_PROCESSING_COUNT) {
                mIgnoreFrameCount ++;
                return;
            }
            isRelevantFrameAvailable        = true;
            mIsScanningComplete             = false;
            mIsClassifierRequestSubmitted   = false;

            JSONArray rois              = getROIs();
            Log.d(TAG, "Received Table image, extracting: " + rois.length() + " ROIs:");

            mStartPredictTime       = SystemClock.uptimeMillis();
            MediaActionSound sound  = new MediaActionSound();
            sound.play(MediaActionSound.FOCUS_COMPLETE);

            try {
                for (int i = 0; i < rois.length(); i++) {
                    JSONObject roiConfig  = rois.getJSONObject(i);

                    if (roiConfig.getString("extractionMethod").equals("CELL_OMR")) {
                        String roiId        = roiConfig.getString("roiId");
                        JSONObject rect      = roiConfig.getJSONObject("rect");

                        double percent      = mDetectShaded.getShadedPercentage(tableMat, rect.getInt("top"), rect.getInt("left"), rect.getInt("bottom"), rect.getInt("right"),isMultiChoiceOMRLayout);
                        Integer answer      = 0;
                        if (percent > DARKNESS_THRESHOLD) {
                            answer = 1;
                        }
                        mPredictedOMRs.put(roiId, answer.toString());
                        Log.d(TAG, "key: " + roiId + " answer: " + answer.toString()+" percent "+percent);
                    }

                    if (roiConfig.getString("extractionMethod").equals("NUMERIC_CLASSIFICATION")) {
                        String roiId        = roiConfig.getString("roiId");
                        JSONObject rect      = roiConfig.getJSONObject("rect");

                        mPredictedDigits.put(roiId, "0");
                        Mat digitROI        = mDetectShaded.getROIMat(tableMat, rect.getInt("top"), rect.getInt("left"), rect.getInt("bottom"), rect.getInt("right"));
                        mRoiMatBase64.put(roiId,createBase64FromMat(digitROI));
                        if(HWClassifier.getInstance().isInitialized() == true) {
                            Log.d(TAG, "Requesting prediction for: " + roiId);
                            HWClassifier.getInstance().classifyMat(digitROI, roiId);
                        }
                    }
                }
                mIsClassifierRequestSubmitted = true;
                Log.d(TAG, "Detected OMR count: " + mPredictedOMRs.size() + " classifier count: " + mPredictedDigits.size());
            } catch (JSONException e) {
                Log.e(TAG, "got JSON exception");
            }
        }
    }

    private JSONArray getROIs() {
        try {
            JSONArray rois              = new JSONArray();
            JSONObject layoutConfigs    = new JSONObject(mlayoutConfigs);

            JSONObject layoutObject     = layoutConfigs.getJSONObject("layout");
            JSONArray  cells            = layoutObject.getJSONArray("cells");

            for (int i = 0; i < cells.length(); i++) {
                JSONArray cellROIs      = cells.getJSONObject(i).getJSONArray("rois");
                for (int j = 0; j < cellROIs.length(); j++) {
                    JSONObject roi      = cellROIs.getJSONObject(j);
                    rois.put(roi);
                }
            }
            return rois;

        } catch (JSONException e) {
            Log.e(TAG, "unable to parse LayoutConfigs object");
            return null;
        }
    }

    private void processScanningCompleted() {
        if (mScanningResultShared){
            return;
        }
        mScanningResultShared   = true;

        MediaActionSound sound  = new MediaActionSound();
        sound.play(MediaActionSound.SHUTTER_CLICK);

        JSONObject  response = getScanResult();
        Log.d(TAG, "Scanning completed !!, OMR count: " + mPredictedOMRs.size() + " classifier count: " + mPredictedDigits.size());

        /**
         * return result to react-native
         */
        ReactInstanceManager mReactInstanceManager  = getReactNativeHost().getReactInstanceManager();
        ReactContext reactContext                   = mReactInstanceManager.getCurrentReactContext();
        Intent intent                               = new Intent(reactContext, SaralSDKOpenCVScannerActivity.class);
        intent.putExtra("layoutConfigsResult", response.toString());
        mReactInstanceManager.onActivityResult(this, 1, 2, intent);
        finish();
    }

    private boolean isMultiChoiceOMRLayout()
    {
        boolean isMultiChoiceOMRLayout=false;
        try {
            JSONObject layoutConfigs    = new JSONObject(mlayoutConfigs);
            JSONObject layoutObject     = layoutConfigs.getJSONObject("layout");
            JSONArray  cells            = layoutObject.getJSONArray("cells");
            for (int i = 0; i < cells.length(); i++) { 
                JSONObject cell = cells.getJSONObject(i);
                JSONArray cellROIs      = cell.getJSONArray("rois");
                int omrROIsCountInCell=0;
                for (int j = 0; j < cellROIs.length(); j++) {
                    JSONObject roi = cellROIs.getJSONObject(j);
                    if(roi.getString("extractionMethod").equals("CELL_OMR"))
                    {
                        omrROIsCountInCell++;
                    }
                    if(omrROIsCountInCell > 1)
                    {
                        isMultiChoiceOMRLayout= true;
                        break;
                    }
                }
                if(isMultiChoiceOMRLayout)
                {
                    break;
                }
            }
        } catch (JSONException e) {
            Log.e(TAG, "Failed to parse layout configuration");
        }
            
         return isMultiChoiceOMRLayout;
    }

    private void resetInvalidOMRChoice(JSONArray cellROIs)
    {
        try {
            if (cellROIs != null) {
                for (int i = 0; i < cellROIs.length(); i++) {
                    JSONObject roi = cellROIs.getJSONObject(i);
                    JSONObject result  = new JSONObject();
                    result.put("prediction", "");
                    result.put("confidence", new Double(0.00));
                    roi.put("result", result);
                }
            }
        }catch (JSONException e) {
            Log.w(TAG, "unable to resetInvalidOMRChoice");
        }
    }

    private JSONObject getScanResult() {

        try {
            JSONObject layoutConfigs    = new JSONObject(mlayoutConfigs);
            JSONObject layoutObject     = layoutConfigs.getJSONObject("layout");
            JSONArray  cells            = layoutObject.getJSONArray("cells");
            
            Log.d(TAG, "isMultiChoiceOMRLayout:: "+isMultiChoiceOMRLayout);

            for (int i = 0; i < cells.length(); i++) {
                JSONArray cellROIs      = cells.getJSONObject(i).getJSONArray("rois");
                JSONObject cell = cells.getJSONObject(i);
                JSONArray trainingDataSet = new JSONArray();
                int countOMRChoice =0;
                for (int j = 0; j < cellROIs.length(); j++) {
                    JSONObject roi      = cellROIs.getJSONObject(j);
                    String roiId = roi.getString("roiId");
                    if (roi.getString("extractionMethod").equals("NUMERIC_CLASSIFICATION")) {
                        JSONObject result  = new JSONObject(mPredictedDigits.get(roiId));
                        roi.put("result", result);
                        if(mRoiMatBase64.get(roiId)!=null)
                        {
                            trainingDataSet.put(j,mRoiMatBase64.get(roiId));
                        }    
                    }

                    if (roi.getString("extractionMethod").equals("CELL_OMR")) {
                        JSONObject result  = new JSONObject();
                        if(isMultiChoiceOMRLayout)
                        {
                            //Handling Multi Choice OMR Layout predictions
                            String prediction =mPredictedOMRs.get(roiId);
                            if(prediction!=null && prediction.equals("1")){
                                result.put("prediction", String.valueOf(j));
                                result.put("confidence", new Double(1.00));
                                countOMRChoice++;
                            }else{
                                result.put("prediction", "");
                                result.put("confidence", new Double(0.0));
                            }
                        }else {
                            result.put("prediction", mPredictedOMRs.get(roiId));
                            result.put("confidence", new Double(1.00));
                        }
                        roi.put("result", result);
                    }
                }
                if(isMultiChoiceOMRLayout && countOMRChoice > 1)
                {
                    resetInvalidOMRChoice(cellROIs);
                }
                if(trainingDataSet.length() > 0)
                {
                    cell.put("trainingDataSet",trainingDataSet);
                    Log.d(TAG, "CellId:" + cell.getString("cellId")+" trainingDataSet :: "+trainingDataSet);
                }                
            }
            return layoutConfigs;

        } catch (JSONException e) {
            Log.e(TAG, "unable to create response LayoutConfigs object");
            return null;
        }
    }

    private void showProcessingInformation(Mat image) {
        String text     = "Please wait, scanning is in progress !!";
        Point position  = new Point(image.width()/5, image.height() / 2);
        Scalar color    = new Scalar(0, 0, 255);
        int font        = Imgproc.COLOR_BGR2GRAY;
        int scale       = 1;
        int thickness   = 3;
        Imgproc.putText(image, text, position, font, scale, color, thickness);
    }

    private String createBase64FromMat(Mat image) {
        Bitmap resultBitmap = Bitmap.createBitmap(image.cols(), image.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(image, resultBitmap);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        resultBitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
        byte[] byteArray    = byteArrayOutputStream.toByteArray();
        String base64       = Base64.encodeToString(byteArray, Base64.DEFAULT);
        return base64;
    }
}
