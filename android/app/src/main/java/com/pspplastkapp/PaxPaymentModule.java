package com.pspplastkapp;

import android.app.Dialog;
import android.speech.tts.TextToSpeech;
import android.util.Log;
import android.view.Gravity;
import android.widget.EditText;
import android.widget.Toast;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.pax.poslink.CommSetting;
import com.pax.poslink.LogSetting;
import com.pax.poslink.ManageRequest;
import com.pax.poslink.ManageResponse;
import com.pax.poslink.POSLinkAndroid;
import com.pax.poslink.PosLink;
import com.pax.poslink.ProcessTransResult;
import com.pax.poslink.aidl.BasePOSLinkCallback;
import com.pax.poslink.constant.EDCType;
import com.pax.poslink.constant.TransType;
import com.pax.poslink.fullIntegration.AuthorizeCard;
import com.pax.poslink.fullIntegration.FullIntegrationBase;
import com.pax.poslink.fullIntegration.GetPINBlock;
import com.pax.poslink.fullIntegration.InputAccount;
import com.pax.poslink.log.LogFilter;
import com.pspplastkapp.sharepref.SharedPreferenceHelper;
import com.pax.poslink.peripheries.POSLinkPrinter;

import org.json.JSONException;
import org.json.JSONObject;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

public class PaxPaymentModule extends ReactContextBaseJavaModule {

  PaxPaymentModule(ReactApplicationContext context) {
    super(context);
  }

  // private static List<Dialog> usingDialogs = new ArrayList<>();


  @NonNull
  @Override
  public String getName() {
    return "PaxPaymentModule";
  }

  @ReactMethod
  public void testAuthorizeCard(String accountNumber, String encryptionType, String keySlot, String pinAlgorithm, Callback callBack) {
    authorizeCard(accountNumber, encryptionType, keySlot, pinAlgorithm);
    String eventId = "1";
    callBack.invoke(eventId);
  }

  @ReactMethod
  public void reset() {
    Log.d("Cancel", "Create event called with name");

    InputAccount.getInstance().abort();
    // resetReader();
  }

  private void resetReader() {
  }

  private String makeResponse(InputAccount.InputAccountResponse inputAccountResponse) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("cardHolderName", SharedPreferenceHelper.get("cardHolderName", ""));
        jsonObject.put("Result Text", inputAccountResponse.getResultTxt());
        jsonObject.put("Result Code", inputAccountResponse.getResultCode());
        jsonObject.put("Entry Mode", inputAccountResponse.getEntryMode() == null
            ? ""
            : String.valueOf(inputAccountResponse.getEntryMode()));
        jsonObject.put("Track1 Data", inputAccountResponse.getTrack1Data());
        jsonObject.put("Track2 Data", inputAccountResponse.getTrack2Data());
        jsonObject.put("Track3 Data", inputAccountResponse.getTrack3Data());
        jsonObject.put("PAN", inputAccountResponse.getPan());
        jsonObject.put("MaskedPAN", inputAccountResponse.getMaskedPAN());
        jsonObject.put("KSN", inputAccountResponse.getKsn());
        jsonObject.put("ETB", inputAccountResponse.getEncryptionTransmissionBlock());
        jsonObject.put("ContactlessTransactionPath", inputAccountResponse.getContactlessTransactionPath());
        jsonObject.put("Contactless Authorize Result", inputAccountResponse.getAuthorizationResult());
        jsonObject.put("SignatureFlag", inputAccountResponse.getSignatureFlag());
        jsonObject.put("OnlinePINFlag", inputAccountResponse.getOnlinePINFlag());
        jsonObject.put("EMVData", inputAccountResponse.getEmvData());
        jsonObject.put("EncryptedEMVTLVData", inputAccountResponse.getEncryptedEMVTLVData());
        jsonObject.put("EncryptedSensitiveTLVData", inputAccountResponse.getEncryptedSensitiveTLVData());
        jsonObject.put("Expiry Date", inputAccountResponse.getExpiry());
        jsonObject.put("ServiceCode", inputAccountResponse.getServiceCode());
        jsonObject.put("CVV", inputAccountResponse.getCVVCode());
        jsonObject.put("Zip", inputAccountResponse.getZipCode());
        jsonObject.put("VASCode", inputAccountResponse.getVASCode());
        jsonObject.put("VASData", inputAccountResponse.getVASData());
        jsonObject.put("NDEFData", inputAccountResponse.getNDEFData());
        jsonObject.put("CVM", inputAccountResponse.getCvm());
        jsonObject.put("Pinpad Type", inputAccountResponse.getPinpadType());
        jsonObject.put("Luhn Validation Result", inputAccountResponse.getLuhnValidationResult());
        jsonObject.put("CustomEncryptedData", inputAccountResponse.getCustomEncryptedData());
        jsonObject.put("Custom MAC Data", inputAccountResponse.getCustomMACInfo().getData());
        jsonObject.put("Custom MAC KSN", inputAccountResponse.getCustomMACInfo().getKSN());
        jsonObject.put("TransactionType", inputAccountResponse.getCustomMACInfo().getKSN());
        
        String jsonStr = jsonObject.toString();

        return jsonStr;
  }

  @ReactMethod
  public void checkPrinterStatus(Callback printerStatus) {
        int status = POSLinkPrinter.getInstance(getReactApplicationContext()).getStatus();

    printerStatus.invoke(status+"");
  }

  @ReactMethod
  public void updatedAuthorizeCard(String amount, String accountNumber, String encryptionType, String keySlot, String tagList,Callback authorizecardCallback) {
     CommSetting commSetting = new CommSetting();
     BasePOSLinkCallback<AuthorizeCard.AuthorizeResponse> posLinkCallback =
     new BasePOSLinkCallback<AuthorizeCard.AuthorizeResponse>() {
         @Override
         public void onFinish(AuthorizeCard.AuthorizeResponse authorizeResponse) {
              Log.d("resultText","ahd " + authorizeResponse.getResultTxt());
              Log.d("Result Code!......","ahd " + authorizeResponse.getResultCode());
              Log.d("Authorization","ahd " + authorizeResponse.getAuthorizationResult());
              Log.d("AResponse EMV Data: ", authorizeResponse.getEmvData());
             Log.d("resultText","ahd " + authorizeResponse.getResultCode());

             Log.d("Result Code!......","ahd " + authorizeResponse.getResultCode());
             Log.d("Authorization","ahd " + authorizeResponse.getAuthorizationResult());
             Log.d("AResponse EMV Data: ", authorizeResponse.getEmvData());

              String jsonStr = "";

              try{

              JSONObject jsonObject = new JSONObject();
              jsonObject.put("Pin_Result_Text", authorizeResponse.getResultTxt());
              jsonObject.put("Pin_Result_Code", authorizeResponse.getResultCode());
              jsonObject.put("Pin_CVM", authorizeResponse.getCvm());
              jsonObject.put("Pin_Authorization_Result", authorizeResponse.getAuthorizationResult());
              jsonObject.put("pinBlock", authorizeResponse.getPinBlock());

              if(authorizeResponse.getEmvData() != ""){
                jsonObject.put("EMVData", authorizeResponse.getEmvData());
              }
                jsonStr = jsonObject.toString();
              } catch (JSONException e) {
                e.printStackTrace();
              }

              // SharedPreferenceHelper.save("Pin_Result_Text", authorizeResponse.getResultTxt());
              // SharedPreferenceHelper.save("Pin_Result_Code", authorizeResponse.getResultCode());
              // SharedPreferenceHelper.save("Pin_CVM", authorizeResponse.getCvm());
              // SharedPreferenceHelper.save("Pin_Authorization_Result", authorizeResponse.getAuthorizationResult());
              // SharedPreferenceHelper.save("pinBlock", authorizeResponse.getPinBlock());
              // SharedPreferenceHelper.save("emvData", authorizeResponse.getEmvData());
              
              // if(authorizeResponse.getEmvData() != ""){
              //   SharedPreferenceHelper.save("EMVData", authorizeResponse.getEmvData());
              // }
              authorizecardCallback.invoke(jsonStr);
              // authorizecardCallback.invoke(authorizeResponse.getPinBlock(),authorizeResponse.getEmvData(),authorizeResponse.getCvm(),authorizeResponse.getAuthorizationResult(),authorizeResponse.getResultCode(),authorizeResponse.getResultTxt());
         }
     };

     AuthorizeCard.EnterPinCallBack enterPinCallBack = new AuthorizeCard.EnterPinCallBack() {
         @Override
         public void onAddedPinCharacter() {
             Log.d("ON Added","ahd" );
         //When a PIN char is added, this method will be called back,
         // and you can customize the UI displayeffect for this
         }
         @Override
         public void onClearPin() {
         //When a PIN char is deleted, this method will be called back
         }
     };

     AuthorizeCard.CurrentStepCallback currentStepCallback =
     new AuthorizeCard.CurrentStepCallback() {
         @Override
         public void onSuccess(){
         // Currentstepinputcompleted
             Log.d("Succes!......","jksh");

         }
         @Override
         public void onFail(String code,String message){
             Log.d("Failed!......","sjkhgd");
         //The currently step failed
         }
     };
      // final TextToSpeech textToSpeech = new TextToSpeech(getReactApplicationContext(), new TextToSpeech.OnInitListener() {
      //     @Override
      //     public void onInit(int status) {
      //     }
      // });
     AuthorizeCard.AuthorizeCallback authorizeCallback = new AuthorizeCard.AuthorizeCallback() {
         @Override
         public void onEnterPinStart() {
             Log.d("ON ENTER PIN!......","ahd");

         // Prompt the customer to start input PIN.
         // You can monitor some status information bycalling handleInputPinStart.

        //  final EnterPINDialog dialog = new EnterPINDialog(getReactApplicationContext());
        //             // usingDialogs.add(dialog);
        //             dialog.show();
        //             dialog.setPINCallback(new EnterPINDialog.PinDialogCallback() {
        //                 @Override
        //                 public void onStart(EnterPINDialog pinDialog, final EditText editText) {
        //                     AuthorizeCard.getInstance().handleInputPinStart(new AuthorizeCard.EnterPinCallBackExpand() {
        //                         final StringBuilder pinChars = new StringBuilder();

        //                         @Override
        //                         public void onAddedPinCharacter() {
        //                             pinChars.append("*");
        //                             editText.setText(pinChars.toString());
        //                             textToSpeech.stop();
        //                         }

        //                         @Override
        //                         public void onClearPin() {
        //                             pinChars.delete(0, pinChars.length());
        //                             editText.setText(pinChars.toString());
        //                             textToSpeech.stop();
        //                         }

        //                         @Override
        //                         public void onTouchPINPad() {
        //                             textToSpeech.stop();
        //                         }
        //                     }, new AuthorizeCard.AuthorizeCurrentStepCallback() {
        //                         @Override
        //                         public void onLastPinTry() {
        //                             Toast toast = Toast.makeText(getReactApplicationContext(), "onLastPinTry", Toast.LENGTH_LONG);
        //                             toast.setGravity(Gravity.TOP, 0, 0);
        //                             toast.show();
        //                         }

        //                         @Override
        //                         public void onSuccess() {
        //                             dialog.dismiss();
        //                         }

        //                         @Override
        //                         public void onFail(String code, String msg) {
        //                             Toast.makeText(getReactApplicationContext(), msg, Toast.LENGTH_LONG).show();
        //                         }
        //                     });
        //                 }
        //             });



         AuthorizeCard.getInstance().handleInputPinStart(enterPinCallBack,currentStepCallback);
         }
     };

     AuthorizeCard.AuthorizeRequest authorizeRequest = new AuthorizeCard.AuthorizeRequest();
     authorizeRequest.setTagList(tagList);
     authorizeRequest.setAmount(amount);
     authorizeRequest.setPinEncryptionType(encryptionType);
     if(keySlot != ""){
        authorizeRequest.setKeySlot(keySlot);
     }
     authorizeRequest.setTimeOut(300);
     AuthorizeCard.authorize(getReactApplicationContext(),authorizeRequest,commSetting,posLinkCallback,authorizeCallback);
     
  }

  private void authorizeCard(String accountNumber, String encryptionType, String keySlot, String pinAlgorithm) {
    CommSetting commSetting = new CommSetting();
    SharedPreferenceHelper.instance(getReactApplicationContext());
    GetPINBlock.CurrentStepCallback currentStepCallback = new GetPINBlock.CurrentStepCallback() {
      @Override
      public void onSuccess() {
        // Currentstepinputcompleted
        Log.d("pin_block_success", "GETPINBLOCK ");
      }

      @Override
      public void onFail(String code, String message) {
        //The currently step failed
        Log.d("pin_block_fail", "GETPINBLOCK ");

      }
    };

    GetPINBlock.EnterPinCallBack enterPinCallBack = new GetPINBlock.EnterPinCallBack() {
      @Override
      public void onAddedPinCharacter() {
        Log.d("Succesgggs", "GETPINBLOCK ");
        //When a PIN char is added,this method will be called back,
        // and you can customize the UI displayeffect for this
      }

      @Override
      public void onClearPin() {
        //When a PIN char is deleted, this method will be called back
      }
    };

    GetPINBlock.GetPINBlockCallback getPINBlockCallback = new GetPINBlock.GetPINBlockCallback() {
      @Override
      public void onEnterPinStart() {
        Log.d("jiojjijioojijoi", "GETPINBLOCK ");

        // Prompt the customer to start input PIN.
        // You can monitor some status information bycalling handleInputPinStart.
        GetPINBlock
          .getInstance()
          .handleInputPinStart(enterPinCallBack, currentStepCallback);
      }
    };

    BasePOSLinkCallback<GetPINBlock.GetPINBlockResponse> posLinkCallback = new BasePOSLinkCallback<GetPINBlock.GetPINBlockResponse>() {
      @Override
      public void onFinish(
        GetPINBlock.GetPINBlockResponse getPINBlockResponse
      ) {
        //Run when GetPINBlock finished.
        final String pinBlock = getPINBlockResponse.getPinBlock();
        Log.d("resultText", "GETPINBLOCK " + pinBlock);

        if(pinBlock != null && pinBlock.length() > 0) {
          Log.d("LENGTH>", "Pin Block Found" + pinBlock);
          SharedPreferenceHelper.save("Pin_Result_Text", getPINBlockResponse.getPinBlock());
        }

      }
    };
          Log.d("LENGTH>", "Pin Block Found" + accountNumber);
          Log.d("LENGTH>", "Pin Block Found" + encryptionType);
          Log.d("LENGTH>", "Pin Block Found" + keySlot);
          Log.d("LENGTH>", "Pin Block Found" + pinAlgorithm);

    GetPINBlock.GetPINBlockRequest getPINBlockRequest = new GetPINBlock.GetPINBlockRequest();
    getPINBlockRequest.setAccountNumber(accountNumber);
    getPINBlockRequest.setEncryptionType(encryptionType);
    getPINBlockRequest.setKeySlot(keySlot);
    getPINBlockRequest.setPinAlgorithm(pinAlgorithm);
               getPINBlockRequest.setTransType(TransType.SALE);
    getPINBlockRequest.setEdcType(EDCType.ALL);
    GetPINBlock.getPinBlock(
      getReactApplicationContext(),
      getPINBlockRequest,
      commSetting,
      posLinkCallback,
      getPINBlockCallback
    );
  }

  @ReactMethod
  /*
   * amount, type, logMode, encryptionFlag, tagList, emvConfig
   */
  public void init(String amount,String type, Boolean logMode, String encryptionFlag, String tagList, String emvConfig, Callback callBack) {
    LogFilter.Const.DEBUG = BuildConfig.DEBUG;

    if(logMode){
      LogSetting.setLogMode(true); 
      LogSetting.setLevel(LogSetting.LOGLEVEL.DEBUG); 
      LogSetting.setLogFileName("POSLinkLog"); 
      LogSetting.setOutputPath("/storage/emulated/0/Download"); 
      LogSetting.setLogDays("30");
    }

    SharedPreferenceHelper.instance(getReactApplicationContext());
    CommSetting commSetting = new CommSetting();
    commSetting.setType(CommSetting.AIDL);
    commSetting.setTimeOut("60000");
    commSetting.setSerialPort("COM1");
    commSetting.setBaudRate("9600");
    commSetting.setDestIP("172.16.20.15");
    commSetting.setDestPort("10009");
    commSetting.setMacAddr("");
    commSetting.setEnableProxy(false);
    POSLinkAndroid.init(getReactApplicationContext());
    PosLink posLink = new PosLink(getReactApplicationContext()); // Create POSLink instance

    BasePOSLinkCallback<InputAccount.InputAccountResponse> posLinkCallback = new BasePOSLinkCallback<InputAccount.InputAccountResponse>() {
      @Override
      public void onFinish(
        InputAccount.InputAccountResponse inputAccountResponse
      ) {
          String finalResponse = null;
          String err = null;

          try {
              finalResponse = makeResponse(inputAccountResponse);
          } catch (JSONException e) {
              err = e.toString();
              e.printStackTrace();
          }
          callBack.invoke(finalResponse, err);
      }
    };

    final InputAccount.InputAccountRequest request = new InputAccount.InputAccountRequest();
    request.getTerminalConfiguration().setEmvKernelConfigurationSelection(emvConfig);
    request.setContactEMVEntryFlag("1");
    request.setMagneticSwipeEntryFlag("1");
    request.setContactlessEntryFlag("1");
    request.setAmount(amount);
    request.setEncryptionFlag(encryptionFlag);
    request.setKeySLot("1");
    request.setEdcType(EDCType.ALL);
    Log.d("TAGLIST", tagList);
    request.setTagList(tagList);


    if (type.equals("Sale")) {
      request.setTransType(TransType.SALE);
    } else {
      request.setTransType(TransType.RETURN);
    }

    InputAccount
      .getInstance()
      .setReportStatusListener(
        new InputAccount.ReportStatusListener() {
          @Override
          public void onReportStatus(int status) {
          }
        }
      );

    InputAccount.inputAccountWithEMV(
      getReactApplicationContext(),
      request,
      commSetting,
      posLinkCallback,
      new InputAccount.InputAccountCallbackCompat() {
        @Override
        public void onInputAccountStart() {
          InputAccount
            .getInstance()
            .handleInputAccount(
              new FullIntegrationBase.CurrentStepCallback() {
                @Override
                public void onSuccess() {
                  //inputAccountDialog.dismiss();
                }

                @Override
                public void onFail(String code, String msg) {
                  Toast
                    .makeText(
                      getReactApplicationContext(),
                      msg,
                      Toast.LENGTH_LONG
                    )
                    .show();
                }
              },
              new InputAccount.CardEventListener() {
                /**
                 * @param event {@link com.pax.poslink.constant.CardEvent}
                 */
                @Override
                public void onEvent(String event) {
                  Log.d("CARD_EVENT_LISTENER",event);
                }
              }
            );
        }

        @Override
        public void onEnterExpiryDate() {}

        @Override
        public void onEnterZip() {}

        @Override
        public void onEnterCVV() {}

        @Override
        public void onSelectEMVApp(List<String> list) {
          Log.d("onSelectEMVApp", "here");
        }

        @Override
        public void onProcessing(String s, String s1) {
          Log.d("ionProcessing", "here");
        }

        @Override
        public void onWarnRemoveCard() {
          Log.d("onWardRemoveCard", "here");
        }
      }
    );
  }
}
