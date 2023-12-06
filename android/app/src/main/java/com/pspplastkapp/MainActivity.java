package com.pspplastkapp;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import org.devio.rn.splashscreen.SplashScreen; // here
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;


public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */


   // Add this method.
   @Override
   protected void onCreate(Bundle savedInstanceState) {
       SplashScreen.show(this);
       super.onCreate(savedInstanceState);


       hideNavigationBar();
       // hide navigation-bar
       View decorView = getWindow().getDecorView();
       int uiOptions = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
       | View.SYSTEM_UI_FLAG_FULLSCREEN;
        decorView.setSystemUiVisibility(uiOptions);
        decorView.setOnSystemUiVisibilityChangeListener
               (new View.OnSystemUiVisibilityChangeListener() {
                   @Override
                   public void onSystemUiVisibilityChange(int visibility) {
                           hideNavigationBar();
                   }
               });
   }
   
   @Override
   public void onWindowFocusChanged(boolean hasFocus) {
       super.onWindowFocusChanged(hasFocus);
       View decorView = getWindow().getDecorView();
       if(hasFocus){
        hideNavigationBar();
           decorView.setSystemUiVisibility(
                   View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|
                   View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_IMMERSIVE
           );
         }
   }

   private void hideNavigationBar() {
       getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);

   }
   
  @Override
  protected String getMainComponentName() {
    return "PlastkApp";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the rendered you wish to use (Fabric or the older renderer).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }

     
  
   

   
}
