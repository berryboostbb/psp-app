import { setDeviceMacAddress, store } from "@redux";
import { showToast } from "@utils";
import Ping from "react-native-ping";
import DeviceInfo from "react-native-device-info";

export const getPingConfiguration = async () => {
  const { hostText } = store.getState().user;
  const option = { timeout: 1000 };
  let ms;
  try {
    ms = await Ping.start(hostText, option);
  } catch (error: any) {
    // showToast("Failed", error.message, false);
    return error.code;
  }
  const result = await Ping.getTrafficStats();
  return { result, ms };
};

export const getDeviceMac = async () => {
  try {
    let mac = await DeviceInfo.getMacAddress();

    store.dispatch(setDeviceMacAddress(mac));

    return mac;
  } catch (error: any) {
    console.log(error.code, error.message);
  }
};
