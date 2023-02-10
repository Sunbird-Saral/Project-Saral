package org.ekstep.saral.saralsdk.hwmodel;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.remoteconfig.FirebaseRemoteConfig;
import com.google.firebase.remoteconfig.FirebaseRemoteConfigSettings;
import static androidx.core.content.ContextCompat.getSystemService;

import org.jetbrains.annotations.NotNull;
import androidx.annotation.NonNull;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.util.Log;


public class RemoteConfig {
    private static final String TAG             = "RemoteConfig::";
    private static boolean isFBDownloadModel    = false ;



    public static boolean  isFBDownloadModelEnable(Context context) {

        boolean networkAvailable = isNetworkAvailable(context);
        if(networkAvailable){
            FirebaseRemoteConfig mFirebaseRemoteConfig = FirebaseRemoteConfig.getInstance();
            FirebaseRemoteConfigSettings configSettings = new FirebaseRemoteConfigSettings.Builder()
                    .setMinimumFetchIntervalInSeconds(10)
                    .build();
            mFirebaseRemoteConfig.setConfigSettingsAsync(configSettings);

            mFirebaseRemoteConfig.fetchAndActivate()
                    .addOnCompleteListener( new OnCompleteListener<Boolean>() {
                        @Override
                        public void onComplete(@NonNull Task<Boolean> task) {
                            if (task.isSuccessful()) {
                                boolean value = task.getResult();
                                Log.d(TAG, "onComplete: value " + value);
                            } else {
                                Log.d(TAG, "onComplete: else" +task);
                            }
                            boolean hasValue = mFirebaseRemoteConfig.getBoolean("isFBDownloadEnable");
                            isFBDownloadModel = hasValue;
                        }
                    }).addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(@NonNull @NotNull Exception e) {
                    Log.d(TAG, "onFailure: failed"+e);
                }
            });
        }
        return isFBDownloadModel;
    }

    private static boolean isNetworkAvailable(Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
        return networkInfo != null & networkInfo.isConnected();
    }
}

