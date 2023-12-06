import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import userReducer from "./reducers/userReducer";
import commonReducer from "./reducers/commonReducer";
import tmsReducer from "./reducers/tmsReducer";
import perReducer from "./reducers/persistReducer";

const reducers = combineReducers({
  user: userReducer,
  common: commonReducer,
  tms: tmsReducer,
  pr: perReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["pr"],
};
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

// !!NEVER TOUCH THIS LINE -- IT WILL STOP THE STATE PERSISTING VARIABLES I.E APPINFO
export const persistor = persistStore(store);
