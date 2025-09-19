// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: any; // Replace `any` with a proper user type if you have one
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    clearToken(state) {
      state.token = null;
    },
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    logout(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setToken, clearToken, setUser, clearUser, logout } =
  authSlice.actions;
export default authSlice.reducer;
