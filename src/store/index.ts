import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Slice imports
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';
import creatorSlice from './slices/creatorSlice';
import contentSlice from './slices/contentSlice';
import notificationSlice from './slices/notificationSlice';
import adminSlice from './slices/adminSlice';

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  ui: uiSlice,
  creator: creatorSlice,
  content: contentSlice,
  notification: notificationSlice,
  admin: adminSlice,
});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'], // 지속할 slice들
  blacklist: ['content', 'notification'], // 새로고침 시 초기화할 slice들
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
