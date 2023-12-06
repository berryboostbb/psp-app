import { StyleSheet, Text, View, NativeModules, Alert } from "react-native";
import React from "react";
import SInfo from "react-native-sensitive-info";

var interval: any;

const CardFlow = () => {
  const { PaxPaymentModule } = NativeModules;

  const initializeCard = () => {
    SInfo.deleteItem("cardHolderName", {
      sharedPreferencesName: "SharedPreferenceHelper",
      keychainService: "",
    });

    interval = setInterval(async () => {
      getData();
    }, 1000);
  };

  const authorizeCard = async () => {
    SInfo.deleteItem("cardHolderName", {
      sharedPreferencesName: "SharedPreferenceHelper",
      keychainService: "",
    });

    const gettingAllKeys = await SInfo.getAllItems({
      sharedPreferencesName: "SharedPreferenceHelper",
      keychainService: "",
    });

    let accountNumber = gettingAllKeys["PAN"];
    let encryptionType = "1";
    let keySlot = "1";
    let pinAlgorithm = "1";

    console.log({ accountNumber, encryptionType, keySlot, pinAlgorithm });
    PaxPaymentModule.testAuthorizeCard(
      accountNumber,
      encryptionType,
      keySlot,
      pinAlgorithm,
      (eventId: any) => {
        // console.log(`Created a new event with id ${eventId}`);
        interval = setInterval(async () => {
          getData();
        }, 2000);
      }
    );
  };
  React.useEffect(() => {
    initializeCard();
    return () => clearInterval(interval);
  }, []);

  const getData = async () => {
    const gettingAllKeys = await SInfo.getAllItems({
      sharedPreferencesName: "SharedPreferenceHelper",
      keychainService: "",
    });

    if (gettingAllKeys.hasOwnProperty("cardHolderName")) {
      let str = "";
      Object.keys(gettingAllKeys).map((key: any) => {
        str += key + " :  " + gettingAllKeys[key] + "\n\n";
      });

      Alert.alert(
        "Card Info",
        str,
        [
          {
            text: "OK",
            onPress: () => {
              if (gettingAllKeys["Entry Mode"] == 4) {
                handleOkPress();
              }
            },
          },
        ],
        { cancelable: false }
      );
      clearInterval(interval);
    }
  };

  const handleOkPress = () => {
    setTimeout(() => {
      authorizeCard();
    }, 1000);
  };

  return (
    <View>
      <Text>CardFlow</Text>
    </View>
  );
};

export default CardFlow;

const styles = StyleSheet.create({});
