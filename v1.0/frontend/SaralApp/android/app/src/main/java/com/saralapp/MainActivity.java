package com.saralapp;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import android.os.Bundle;
import com.newrelic.agent.android.NewRelic;
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "SaralApp";
  }
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
     return new ReactActivityDelegate(this, getMainComponentName()) {
       @Override
       protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
       }
     };
   }

   @Override
   protected void onCreate(Bundle savedInstanceState) {
    NewRelic.withApplicationToken(
"AAa4f98b48afc14ae704f5a29f4950f1e65a90a3e7-NRMA"
).start(this.getApplicationContext());
   super.onCreate(null);
}
}
