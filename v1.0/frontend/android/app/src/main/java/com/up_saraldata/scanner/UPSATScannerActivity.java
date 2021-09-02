package com.up_saraldata.scanner;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.media.MediaActionSound;
import android.os.Bundle;
import android.os.SystemClock;
import android.util.Log;
import android.view.SurfaceView;
import android.view.Window;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import com.up_saraldata.R;
import com.up_saraldata.hwmodel.HWClassifier;
import com.up_saraldata.hwmodel.PredictionListener;
import com.up_saraldata.opencv.BlurDetection;
import com.up_saraldata.opencv.DetectShaded;
import com.up_saraldata.opencv.ExtractROIs;
import com.up_saraldata.opencv.TableCornerCirclesDetection;

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

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

public class UPSATScannerActivity extends ReactActivity implements CameraBridgeViewBase.CvCameraViewListener2 {
    private static final String  TAG                    = "UP_Saral::UPPAT";
    private static long mframeCount                     = 0;
    private static long mIgnoreFrameCount               = 0;
    private static final int START_PROCESSING_COUNT     = 20;

    private int mScannerCode                            = SCANNER_SAT_CODE.SCANNER_CLASS_3_4_5;
    private String mScannerType                            = SCANNER_TYPE.PAT;
    private boolean isHWClassiferAvailable              = true;
    private boolean isRelevantFrameAvailable            = false;
    private boolean mIsScanningComplete                 = false;
    private boolean mScanningResultShared               = false;

    private Mat                             mRgba;
    private CameraBridgeViewBase            mOpenCvCameraView;
    private TableCornerCirclesDetection     mTableCornerDetection;
    private ExtractROIs                     mROIs;
    private DetectShaded                    mDetectShaded;
    private BlurDetection                   blurDetection;
    private long                            mStartTime;
    private long                            mStartPredictTime;

    private int     mTotalClassifiedCount               = 0;
    private boolean mIsClassifierRequestSubmitted       = false;
    private HashMap<String, String> mPredictedDigits    = new HashMap<>();

    private HWClassifier hwClassifier;

    private BaseLoaderCallback mLoaderCallback = new BaseLoaderCallback(this) {
        @Override
        public void onManagerConnected(int status) {
            switch (status) {
                case LoaderCallbackInterface.SUCCESS:
                {
                    Log.i(TAG, "OpenCV loaded successfully");
                    mOpenCvCameraView.enableView();
                } break;
                default:
                {
                    super.onManagerConnected(status);
                } break;
            }
        }
    };
    public UPSATScannerActivity() {
        Log.i(TAG, "Instantiated new " + this.getClass());
    }

    /** Called when the activity is first created. */
    @SuppressLint("SourceLockedOrientationActivity")
    @Override
    public void onCreate(Bundle savedInstanceState) {
        Log.i(TAG, "called onCreate");
        super.onCreate(savedInstanceState);
//        Bundle b = getIntent().getExtras();

        if(getIntent().hasExtra("scannerType")) {
            mScannerType = getIntent().getStringExtra("scannerType");
        }

        if(getIntent().hasExtra("scanner")) {
            mScannerCode = getIntent().getIntExtra("scanner", 1);
        }

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setContentView(R.layout.activity_up_pat_scanner);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

        mOpenCvCameraView = (CameraBridgeViewBase) findViewById(R.id.up_pat_scanner_activity_surface_view);
        mOpenCvCameraView.setVisibility(SurfaceView.VISIBLE);
        mOpenCvCameraView.setCvCameraViewListener(this);
        mOpenCvCameraView.setMaxFrameSize(1280,720);
        mOpenCvCameraView.enableFpsMeter();
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
        if (!OpenCVLoader.initDebug()) {
            Log.d(TAG, "Internal OpenCV library not found. Using OpenCV Manager for initialization");
            OpenCVLoader.initAsync(OpenCVLoader.OPENCV_VERSION, this, mLoaderCallback);
        } else {
            Log.d(TAG, "OpenCV library found inside package. Using it!");
            mLoaderCallback.onManagerConnected(LoaderCallbackInterface.SUCCESS);

            /**
             * Now load the classifier
             */
            try {
                hwClassifier    = new HWClassifier(UPSATScannerActivity.this, new PredictionListener() {
                    @Override
                    public void OnPredictionSuccess(int digit, String id) {
                        Log.d(TAG, "predicted digit:" + digit + " unique id:" + id);
                        mTotalClassifiedCount++;
                        if(digit == 10) {
                            mPredictedDigits.put(id, "");
                        }
                        else {
                            mPredictedDigits.put(id, new Integer(digit).toString());
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
                    public void OnPredictionFailed(String error) {
                        Log.e(TAG, "Model prediction failed");
                        isHWClassiferAvailable  = false;
                    }

                    @Override
                    public void OnModelLoadStatus(String message) {
                        Log.d(TAG, "Model load status: " + message);
                        isHWClassiferAvailable  = true;
                    }
                });

                hwClassifier.initialize();

            } catch (IOException e) {
                Log.e(TAG, "Failed to load HWClassifier", e);
            }
        }
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
        mROIs                           = new ExtractROIs(false);
        mDetectShaded                   = new DetectShaded(false);
        blurDetection                   = new BlurDetection(false);
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
//        return;

        if (tableMat != null && isHWClassiferAvailable) {
//            if (mIgnoreFrameCount < START_PROCESSING_COUNT) {
//                mIgnoreFrameCount ++;
//                return;
//            }
            if(blurDetection.detectBlur(tableMat)) {
                Log.d(TAG, "processCameraFrame: blurDetection after:: "+blurDetection.detectBlur(tableMat));
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
                    JSONObject roi  = rois.getJSONObject(i);

                    if (roi.getString("method").equals("classify")) {
                        StringBuilder sb    = new StringBuilder().append(roi.getInt("row")).append("_").append(roi.getInt("col"));
                        mPredictedDigits.put(sb.toString(), "0");

                        Mat digitROI        = mDetectShaded.getROIMat(tableMat, roi.getInt("top"), roi.getInt("left"), roi.getInt("bottom"), roi.getInt("right"));
                        if(hwClassifier != null) {
                            Log.d(TAG, "Requesting prediction for: " + sb.toString());
                            hwClassifier.classifyMat(digitROI, sb.toString());
                        }
                    }
                }
                mIsClassifierRequestSubmitted = true;
                Log.d(TAG, "classifier count: " + mPredictedDigits.size());

            } catch (JSONException e) {
                Log.e(TAG, "got JSON exception");
            }
        }
    }

    private JSONArray getROIs() {
        if (mScannerCode == SCANNER_SAT_CODE.SCANNER_CLASS_6_7_8) {
            return mROIs.getSatClass6_7_8_ROIs();
        }
        return mROIs.getSatClass3_4_5_ROIs();
    }

    private void processScanningCompleted() {
        if (mScanningResultShared){
            return;
        }
        mScanningResultShared   = true;

        MediaActionSound sound  = new MediaActionSound();
        sound.play(MediaActionSound.SHUTTER_CLICK);

        JSONObject  response        = getScanResult();
        Log.d(TAG, "Scanning completed classifier count: " + mPredictedDigits.size());

        ReactInstanceManager mReactInstanceManager  = getReactNativeHost().getReactInstanceManager();
        ReactContext reactContext                   = mReactInstanceManager.getCurrentReactContext();
        Intent sendData                             = new Intent(reactContext, UPSATScannerActivity.class);

        sendData.putExtra("fileName", response.toString());
        mReactInstanceManager.onActivityResult(null, 1, 2, sendData);
        finish();
    }

    private JSONObject getScanResult() {
        String studentRoll     = mPredictedDigits.get("-1_0")+mPredictedDigits.get("-1_1")+mPredictedDigits.get("-1_2");
        JSONObject result       = new JSONObject();

        try {
            Log.d(TAG, "mPredictedDigits: " + new JSONObject(mPredictedDigits).toString());

            result.put("scannerType", mScannerType);
            result.put("scannerCode", mScannerCode);
            result.put("studentRoll", studentRoll);
            JSONArray marksData = getSubjectWiseMarks();

            result.put("marksData", marksData);
            result.put("predict", new Double((SystemClock.uptimeMillis() - mStartPredictTime)/1000));
            result.put("total", new Double((SystemClock.uptimeMillis() - mStartTime)/1000));

        } catch (JSONException e) {
            return result;
        }

        return result;
    }

    private String getSubject(int row) {
        String subject = "";
        if(row == 0) {
            subject = "HINDI";
        }
        if(row == 1) {
            subject = "ENGLISH";
        }
        if(row == 2) {
            subject = "MATHS";
        }
        if(row == 3 && mScannerCode == SCANNER_SAT_CODE.SCANNER_CLASS_3_4_5) {
            subject = "EVS";
        }
        if(row == 3 && mScannerCode == SCANNER_SAT_CODE.SCANNER_CLASS_6_7_8) {
            subject = "SOCIAL SCIENCE";
        }
        if(row == 4) {
            subject = "SCIENCE";
        }
        return  subject;
    }

    private JSONArray getSubjectWiseMarks() {
        int rows = 4;
        int cols = 10;
        if(mScannerCode == SCANNER_SAT_CODE.SCANNER_CLASS_6_7_8) {
            rows = 5;
        }

        JSONArray marksData  = new JSONArray();
        try {
            for (int row = 0; row < rows; row++) {
                JSONObject marksDataObj = new JSONObject();
                String subject = getSubject(row);
                marksDataObj.put("subject", subject);
                JSONArray objectiveMarks     = new JSONArray();
                JSONArray subjectiveMarks     = new JSONArray();
                for (int col = 0; col < cols; col++) {
                    JSONObject marksObj  = new JSONObject();
                    String key = row + "_" + col;
                    String result = mPredictedDigits.get(key);
                    marksObj.put("question", col);
                    marksObj.put("mark", result);
                    if(col <= 7) {
                        objectiveMarks.put(marksObj);
                    } else if(col > 7) {
                        subjectiveMarks.put(marksObj);
                    }
                }
                marksDataObj.put("objectiveMarks", objectiveMarks);
                marksDataObj.put("subjectiveMarks", subjectiveMarks);
                marksData.put(marksDataObj);
            }
        } catch (JSONException e) {
            return marksData;
        }
        return  marksData;
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

}
