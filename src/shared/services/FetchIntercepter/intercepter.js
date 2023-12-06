// import { getAuthenticationToken } from "../utils/Constants";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { setIsLoggedIn, store, toggleLoader } from "@redux";
import { Receipt_ApiKey, showToast } from "@utils";
import { setTerminalActivated } from "@redux";

export const fetchWrapper = async (
  url,
  method,
  token,
  body,
  loader = false,
  isFormData = false

  //   enc = false,o-0i09i00o-0
  //   isTimeout = false
) => {
  const logoutUser = async () => {
    await AsyncStorage.removeItem("passcode");
    await AsyncStorage.removeItem("role");

    await AsyncStorage.removeItem("isLoggedIn");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("passcode");
    await AsyncStorage.removeItem("role");
    await AsyncStorage.removeItem("merchantID");
    await AsyncStorage.removeItem("clerkID");
    store.dispatch(setIsLoggedIn(false));
    store.dispatch(setTerminalActivated(false));
  };

  const { apiKey } = store.getState().pr;

  if (loader) store.dispatch(toggleLoader({ isLoading: true }));
  let headers;
  if (isFormData) {
    headers = {
      "Content-Type": "multipart/form-data",
    };
  } else {
    headers = {
      "Content-Type": "application/json",
    };
  }
  if (token) {
    const userToken = await AsyncStorage.getItem("token");
    if (url.includes("sendgrid"))
      headers.Authorization = "Bearer " + Receipt_ApiKey;
    else headers["x-api-key"] = apiKey;
  }

  let structure = {
    method: method,
    headers: headers,
    cache: "no-cache",
  };
  if (method !== "GET") {
    const { users, currentClerkId } = store.getState().tms;
    let userDetails = currentClerkId;
    const currentUser = users?.find(
      (d) => d?.clerk_id === parseInt(currentClerkId)
    );
    if (currentUser != undefined) {
      userDetails = `${userDetails}:${currentUser?.email}`;
    }
    if (body) {
      body.user_details = userDetails;
      structure.body = JSON.stringify(body);
    }
  }

  return fetch(url, structure)
    .then(async (data) => {
      store.dispatch(toggleLoader({ isLoading: false }));
      let Data;
      if (url.includes("sendgrid")) Data = data;
      else Data = await data.json();

      if (
        Data?.isUnAuthorized ||
        Data?.message?.includes("JsonWebTokenError") ||
        Data?.message?.includes("TokenExpiredError") ||
        Data?.code == 401
      ) {
        showToast("Failed", "Session expired please login again", false);

        logoutUser();
      }

      return Data;
    })
    .catch((error) => {
      store.dispatch(toggleLoader({ isLoading: false }));
      // if (isTimeout) clearTimeout(clearSetTimeout);
      console.log(error, "api errror");
    });
};
