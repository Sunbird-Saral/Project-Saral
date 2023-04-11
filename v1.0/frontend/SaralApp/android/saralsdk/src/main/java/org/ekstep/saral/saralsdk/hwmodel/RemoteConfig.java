package org.ekstep.saral.saralsdk.hwmodel;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.util.Log;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.remoteconfig.FirebaseRemoteConfig;
import com.google.firebase.remoteconfig.FirebaseRemoteConfigSettings;

import org.jetbrains.annotations.NotNull;

import java.util.concurrent.atomic.AtomicBoolean;


public class RemoteConfig {
    private static final String TAG             = "RemoteConfig::";
    private static AtomicBoolean isFBDownloadModel = new AtomicBoolean(false);



    public boolean isFBDownloadModelEnable(Context context) {

        boolean networkAvailable = isNetworkAvailable(context);
        FirebaseRemoteConfig mFirebaseRemoteConfig = FirebaseRemoteConfig.getInstance();
        final boolean[] hasValue = {false};

        Log.d(TAG, "isFBDownloadModelEnable: networkAvailable"+networkAvailable);

        if (networkAvailable) {
            FirebaseRemoteConfigSettings configSettings = new FirebaseRemoteConfigSettings.Builder()
                    .setMinimumFetchIntervalInSeconds(100)
                    .build();
            mFirebaseRemoteConfig.setConfigSettingsAsync(configSettings);

            mFirebaseRemoteConfig.fetchAndActivate()
                    .addOnCompleteListener(new OnCompleteListener<Boolean>() {
                        @Override
                        public void onComplete(@NonNull Task<Boolean> task) {
                            if (task.isSuccessful()) {
                               hasValue[0] = mFirebaseRemoteConfig.getBoolean("isFBDownloadEnable");
                                Log.d(TAG, "onComplete: hasValue[0]=> " + hasValue[0]);
                                hasValue[0] = true;
                                isFBDownloadModel.set(hasValue[0]);
                                boolean value = task.getResult();
                                Log.d(TAG, "onComplete: value " + value);
                                Log.d(TAG, "onComplete: isFBDownloadModel=> " + isFBDownloadModel.get());
                            } else {
                                Log.d(TAG, "onComplete: else" + task);
                            }
                        }
                    }).addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(@NonNull @NotNull Exception e) {
                    Log.d(TAG, "onFailure: failed" + e);
                }
            });


        }
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        Log.d(TAG, "isFBDownloadModelEnable: isFBDownloadModelEnabble=> " + isFBDownloadModel.get());
            return isFBDownloadModel.get();
    }

    private static boolean isNetworkAvailable(Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
        boolean connected= networkInfo != null ? networkInfo.isConnected() : false;
        Log.d(TAG, "isNetworkAvailable: " + connected);
        return connected;
    }

}

