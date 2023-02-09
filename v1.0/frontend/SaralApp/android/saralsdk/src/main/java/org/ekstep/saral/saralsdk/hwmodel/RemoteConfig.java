package org.ekstep.saral.saralsdk.hwmodel;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.remoteconfig.FirebaseRemoteConfig;
import com.google.firebase.remoteconfig.FirebaseRemoteConfigSettings;
import com.google.firebase.remoteconfig.FirebaseRemoteConfigValue;

import org.jetbrains.annotations.NotNull;
import java.util.concurrent.Executor;
import javax.annotation.Nonnull;
import androidx.annotation.NonNull;
import android.util.Log;
import android.widget.Toast;


public class RemoteConfig {
    private static final String TAG             = "RemoteConfig::";
    boolean isFBDownloadModel = false ;


    public boolean  fetchRemoteTitle() {

        FirebaseRemoteConfig mFirebaseRemoteConfig = FirebaseRemoteConfig.getInstance();
        FirebaseRemoteConfigSettings configSettings = new FirebaseRemoteConfigSettings.Builder()
                .setMinimumFetchIntervalInSeconds(3600)
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
                        Log.d(TAG, "onComplete: hasvalue" + hasValue);
                            isFBDownloadModel = hasValue;
                    }
                }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull @NotNull Exception e) {
                Log.d(TAG, "onFailure: failed"+e);
            }
        });
        Log.d(TAG, "fetchRemoteTitle: isFBDownloadModel " + isFBDownloadModel);
        return isFBDownloadModel;
    }
}

