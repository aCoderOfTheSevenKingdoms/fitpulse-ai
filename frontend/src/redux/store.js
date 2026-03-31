import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import planReducer from "./features/planSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  user: userReducer,
  plan: planReducer
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user", "plan"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);