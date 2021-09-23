package org.ekstep.saral.saralsdk.commons;

import android.os.Environment;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;

import org.ekstep.saral.saralsdk.hwmodel.HWClassifier;

import java.io.File;

public class FileOps {
    private static final String TAG                 = "SrlSDK::FileOps";
    private static FileOps mInstance                = null;
    private static ReactApplicationContext mContext = null;

    public static FileOps getInstance() {
        if (mInstance == null) {
            mInstance   = new FileOps();
        }
        return mInstance;
    }

    private FileOps() {
    }

    public void initialize(ReactApplicationContext context) {
        mContext = context;
    }

    public String getBaseDirectoryPath() {
        String basePath =   mContext.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS).toString();
        return basePath;
    }

    public File getBaseDirectory() {
        return  mContext.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
    }
}
