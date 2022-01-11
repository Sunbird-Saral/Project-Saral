package org.ekstep.saral.saralsdk;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.ekstep.saral.saralsdk.commons.FileOps;
import org.ekstep.saral.saralsdk.hwmodel.HWClassifier;
import org.ekstep.saral.saralsdk.hwmodel.HWClassifierStatusListener;
import org.json.JSONArray;
import org.json.JSONException;
import org.opencv.android.BaseLoaderCallback;
import org.opencv.android.LoaderCallbackInterface;
import org.opencv.android.OpenCVLoader;

public class SaralSDKModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final String TAG             = "SrlSDK::Module";
    Promise mPromise                            = null;

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
