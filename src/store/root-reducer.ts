// src/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/auth';
import offlineSlice from './slices/offline-slice';

const rootReducer = combineReducers({
  auth: authSlice,
  offline: offlineSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
