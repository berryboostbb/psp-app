package com.pspplastkapp;
import android.app.Application;
import android.content.Context;
import android.os.RemoteException;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;
import com.pax.market.android.app.sdk.BaseApiService;
import com.pax.market.android.app.sdk.StoreSdk;
import com.pax.market.android.app.sdk.dto.TerminalInfo;
import com.pspplastkapp.newarchitecture.MainApplicationReactNativeHost;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import com.brentvatne.react.ReactVideoPackage;
import com.pspplastkapp.sharepref.SharedPreferenceHelper;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.rssignaturecapture.RSSignatureCapturePackage;
// import org.wonday.orientation.OrientationPackage;
// import org.wonday.orientation.OrientationActivityLifecycle;


public class MainApplication extends Application implements ReactApplication {


      private String appkey = "0K46R3N3JWP829S87J7W"; 
  private String appSecret = "EF2FC4JKOUJXM7HYM64SUV80SQDOJLPPYN1LSQZP";  

    private void initPaxStoreSdk() {
       //todo Init AppKey，AppSecret, make sure the appKey and appSecret is corret.

        StoreSdk.getInstance().init(getApplicationContext(), appkey, appSecret, new BaseApiService.Callback() {
            @Override
            public void initSuccess() {
               //TODO Do your business here
                 StoreSdk.getInstance().getBaseTerminalInfo(getApplicationContext(),new BaseApiService.ICallBack() {
    @Override
    public void onSuccess(Object obj) {
        TerminalInfo terminalInfo = (TerminalInfo) obj;
        SharedPreferenceHelper.instance(getApplicationContext());
        SharedPreferenceHelper.save("serialNo", terminalInfo.getSerialNo().toString());
        SharedPreferenceHelper.save("merchantName", terminalInfo.getSerialNo().toString());
        SharedPreferenceHelper.save("terminalId", terminalInfo.getSerialNo().toString());
        SharedPreferenceHelper.save("terminalName", terminalInfo.getSerialNo().toString());

        Log.i("onSuccess: ",terminalInfo.toString());
    }

    @Override
    public void onError(Exception e) {
        Log.i("onError: ",e.toString());
    }
});



               Log.d("MyTagGoesHere", "This is my log message at the debug level here");
              
            }

            @Override
            public void initFailed(RemoteException e) {
               //TODO Do failed logic here
                Toast.makeText(getApplicationContext(), "Cannot get API URL from PAXSTORE, Please install PAXSTORE first.", Toast.LENGTH_LONG).show();
            }
        });
    }

  
  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
              new SplashScreenReactPackage();
              new RSSignatureCapturePackage(); 
              packages.add(new PaxPaymentPackage());
              // packages.add(new OrientationPackage());
                   
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  private final ReactNativeHost mNewArchitectureNativeHost =
      new MainApplicationReactNativeHost(this);

  @Override
  public ReactNativeHost getReactNativeHost() {
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      return mNewArchitectureNativeHost;
    } else {
      return mReactNativeHost;
    }
  }

  @Override
  public void onCreate() {
    super.onCreate();
        initPaxStoreSdk();

    // If you opted-in for the New Architecture, we enable the TurboModule system
    ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    // registerActivityLifecycleCallbacks(OrientationActivityLifecycle.getInstance());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.pspplastkapp.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
