// store/offlineSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type OfflineFile = {
  id: string;
  title: string;
  localPath: string;
  type: 'notes' | 'pyq';
};

interface OfflineState {
  files: OfflineFile[];
}

const initialState: OfflineState = {
  files: [],
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    addOfflineFile: (state, action: PayloadAction<OfflineFile>) => {
      const exists = state.files.some(f => f.id === action.payload.id);
      if (!exists) state.files.push(action.payload);
    },
    removeOfflineFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(f => f.id !== action.payload);
    },
    clearOfflineFiles: state => {
      state.files = [];
    },
  },
});

export const { addOfflineFile, removeOfflineFile, clearOfflineFiles } =
  offlineSlice.actions;
export default offlineSlice.reducer;
