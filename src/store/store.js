import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
// import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/es/storage/session';
import user from './userSlice';
import common from './commonSlice';
import popup from './popupSlice';

const reducers = combineReducers({
  user: user.reducer,
  common: common.reducer,
  popup: popup.reducer,
});

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['user'],
  blacklist: ['common', 'popup'] // common과 popup을 블랙리스트에 추가
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;