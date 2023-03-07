package org.ekstep.saral.saralsdk;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.media.MediaActionSound;
import android.os.Looper;
import android.util.Log;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.ekstep.saral.saralsdk.commons.FileOps;
import org.ekstep.saral.saralsdk.hwmodel.HWClassifier;
import org.ekstep.saral.saralsdk.hwmodel.HWClassifierStatusListener;
import org.ekstep.saral.saralsdk.hwmodel.HWBlockLettersClassifier;
import org.ekstep.saral.saralsdk.hwmodel.HWBlockLettersClassifierStatusListener;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.opencv.android.BaseLoaderCallback;
import org.opencv.android.LoaderCallbackInterface;
import org.opencv.android.OpenCVLoader;

public class SaralSDKModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final String TAG             = "SrlSDK::Module";
    Promise mPromise                            = null;
    int     timeInMiliSecond                        = 10000;

    private BaseLoaderCallback mLoaderCallback = new BaseLoaderCallback(getReactApplicationContext()) {
        @Override
        public void onManagerConnected(int status) {
            switch (status) {
                case LoaderCallbackInterface.SUCCESS:
                {
                    Log.i(TAG, "OpenCV loaded successfully");
                } break;
                default:
                {
                    super.onManagerConnected(status);
                } break;
            }
        }
    };

    SaralSDKModule(ReactApplicationContext context) {
        super(context);

        context.addActivityEventListener(this);
        FileOps.getInstance().initialize(context);

        Log.d(TAG, "SaralSDKModule loaded, trying to load OpenCV libs & Models");
        if (!OpenCVLoader.initDebug()) {
            Log.d(TAG, "Internal OpenCV library not found. Using OpenCV Manager for initialization");
            OpenCVLoader.initAsync(OpenCVLoader.OPENCV_VERSION, getReactApplicationContext(), mLoaderCallback);
        } else {
            Log.d(TAG, "OpenCV library found inside package. Using it!");
            mLoaderCallback.onManagerConnected(LoaderCallbackInterface.SUCCESS);
        }
        HWClassifier.getInstance();
        Log.d(TAG, "Loading HWClassifer models");
        HWClassifier.getInstance().initialize(new HWClassifierStatusListener() {
            @Override
            public void OnModelLoadSuccess(String message) {
                Log.d(TAG, "HWClassifer model loaded : " + message);
            }

            @Override
            public void OnModelLoadError(String message) {
                Log.d(TAG, "HWClassifer model cannot be loaded :" + message);
            }
        });

        HWBlockLettersClassifier.getInstance();
        Log.d(TAG, "Loading HWBlockLettersClassifier models");
        HWBlockLettersClassifier.getInstance().initialize(new HWBlockLettersClassifierStatusListener() {
            @Override
            public void OnModelLoadSuccess(String message) {
                Log.d(TAG, "HWBlockLettersClassifier model loaded : " + message);
            }

            @Override
            public void OnModelLoadError(String message) {
                Log.d(TAG, "HWBlockLettersClassifier model cannot be loaded :" + message);
            }
        });

    }

    private void timerTask(String layoutSchema, String pageNumber){
        new android.os.Handler(Looper.getMainLooper()).postDelayed(
                new Runnable() {
                    public void run() {
                        new AlertDialog.Builder(getCurrentActivity())
                                .setTitle("Message")
                                .setMessage("Do you want to contiue with manual edit screen ?")
                                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialogInterface, int i) {
                                        setDefaultValue(layoutSchema, pageNumber);
                                    }
                                })
                                .setNegativeButton("No",null)
                                .show();
                    }
                },
                timeInMiliSecond);
    }

    private void setDefaultValue(String mlayoutConfigs, String pageNumber){
        try {
            JSONObject layoutConfigs    = new JSONObject(mlayoutConfigs);
            JSONObject layoutObject     = layoutConfigs.getJSONObject("layout");
            JSONArray  cells            = layoutObject.getJSONArray("cells");

            for (int i = 0; i < cells.length(); i++) {
                JSONArray cellROIs      = cells.getJSONObject(i).getJSONArray("rois");
                JSONObject cell = cells.getJSONObject(i);
                boolean includeRois = (cell.has("page") && pageNumber!=null && cell.getString("page").equals(pageNumber)) || (!cell.has("page"));
                if (includeRois) {
                    for (int j = 0; j < cellROIs.length(); j++) {
                        JSONObject roi      = cellROIs.getJSONObject(j);

                        if (roi.getString("extractionMethod").equals("CELL_OMR")) {
                            JSONObject result  = new JSONObject();
                            result.put("prediction", 0);
                            result.put("confidence", new Double(1.00));

                            if(!roi.has("result")){
                                roi.put("result", result);
                            }else{
                                JSONObject resultObj = roi.getJSONObject("result");
                                if(resultObj.getString("prediction") != null){
                                    roi.put("result", result);
                                }
                            }
                        }

                        if (roi.getString("extractionMethod").equals("NUMERIC_CLASSIFICATION")){
                            JSONObject result  = new JSONObject();
                            result.put("prediction", 1);
                            result.put("confidence", new Double(1.00));

                            if(!roi.has("result")){
                                roi.put("result", result);
                            }else{
                                JSONObject resultObj = roi.getJSONObject("result");
                                if(resultObj.getString("prediction") != null){
                                    roi.put("result", result);
                                }
                            }
                        }

                        if (roi.get("extractionMethod").equals("BLOCK_ALPHANUMERIC_CLASSIFICATION")){
                            JSONObject result  = new JSONObject();
                            result.put("prediction", "A");
                            result.put("confidence", new Double(1.00));

                            if(!roi.has("result")){
                                roi.put("result", result);
                            }else{
                                JSONObject resultObj = roi.getJSONObject("result");
                                if(resultObj.getString("prediction") != null){
                                    roi.put("result", result);
                                }
                            }
                        }
                    }
                }
            }
            final Activity activity     = getCurrentActivity();
            Intent intent               = new Intent(activity, SaralSDKOpenCVScannerActivity.class);
            intent.putExtra("layoutConfigsResult", layoutConfigs.toString());
            onActivityResult(activity, 1, 2, intent);
            activity.finish();

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public String getName() {
        return "SaralSDKModule";
    }

    @ReactMethod
    void startCamera(String layoutSchema,String page, Promise promise) {
        Log.d(TAG, "startCamera called with: " + layoutSchema);
        Log.d(TAG, "startCamera called with: " + page);

        mPromise                        = promise;

        ReactApplicationContext context = getReactApplicationContext();
        Activity currentActivity        = getCurrentActivity();
        timerTask(layoutSchema, page);

        Intent intent                   = new Intent(currentActivity, SaralSDKOpenCVScannerActivity.class);
        intent.putExtra("layoutConfigs", layoutSchema);
        intent.putExtra("page", page);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        currentActivity.startActivity(intent);
    }

    @ReactMethod
    void stopCamera(Promise promise) {
        Log.d(TAG, "stopCamera called in");
        final Activity activity = getCurrentActivity();
        activity.finish();
        promise.resolve("true");
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == 1) {
            Log.d(TAG, "Response: " + data.getStringExtra("layoutConfigsResult"));
            this.mPromise.resolve(data.getStringExtra("layoutConfigsResult"));
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        Log.d(TAG, "SrlSDK:: onNewIntent");
    }
}
