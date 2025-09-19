// src/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/auth';

const rootReducer = combineReducers({
  auth: authSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
