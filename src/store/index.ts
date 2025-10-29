import { configureStore, combineReducers } from '@reduxjs/toolkit';

// Slice imports
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';
import creatorSlice from './slices/creatorSlice';
import contentSlice from './slices/contentSlice';
import notificationSlice from './slices/notificationSlice';
import platformSlice from './slices/platformSlice';
import creatorApplicationSlice from './slices/creatorApplicationSlice';
import videoDetailSlice from './slices/videoDetailSlice';

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  ui: uiSlice,
  creator: creatorSlice,
  content: contentSlice,
  notification: notificationSlice,
  platform: platformSlice,
  creatorApplication: creatorApplicationSlice,
  videoDetail: videoDetailSlice,
});

// Store configuration
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
