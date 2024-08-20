import { configureStore,combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import storage from 'redux-persist/lib/storage';
import { version } from 'mongoose';
import { persistStore,persistReducer } from 'redux-persist';
import temaReducer from './tema/temaSlice';

const rootReducer = combineReducers({
  user: userReducer,
  tema: temaReducer,
});
const persistConfig = {
  key: 'root',
  storage,
  version:1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer : persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
})

export const persistor = persistStore(store);