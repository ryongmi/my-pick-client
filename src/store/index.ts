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

// Slice imports
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';
import creatorSlice from './slices/creatorSlice';
import contentSlice from './slices/contentSlice';
import notificationSlice from './slices/notificationSlice';
import adminSlice from './slices/adminSlice';
import platformSlice from './slices/platformSlice';
import userManagementSlice from './slices/userManagementSlice';
import creatorApplicationSlice from './slices/creatorApplicationSlice';
import videoDetailSlice from './slices/videoDetailSlice';

// Storage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let storage: any;
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  storage = require('redux-persist/lib/storage').default;
} else {
  const createNoopStorage = (): { getItem: () => Promise<null>; setItem: () => Promise<void>; removeItem: () => Promise<void> } => {
    return {
      getItem(): Promise<null> {
        return Promise.resolve(null);
      },
      setItem(): Promise<void> {
        return Promise.resolve();
      },
      removeItem(): Promise<void> {
        return Promise.resolve();
      },
    };
  };
  storage = createNoopStorage();
}

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  ui: uiSlice,
  creator: creatorSlice,
  content: contentSlice,
  notification: notificationSlice,
  admin: adminSlice,
  platform: platformSlice,
  userManagement: userManagementSlice,
  creatorApplication: creatorApplicationSlice,
  videoDetail: videoDetailSlice,
});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui', 'platform', 'creatorApplication'], // 지속할 slice들 (플랫폼 설정 및 크리에이터 신청 상태 포함)
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
