import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    WebStorage,
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import AuthReducer from '@/redux/slices/auth';

// Create noop storage for server-side
const createNoopStorage = (): WebStorage => {
    return {
        getItem(_key: string) {
            return Promise.resolve(null);
        },
        setItem(_key: string, value: any) {
            return Promise.resolve(value);
        },
        removeItem(_key: string) {
            return Promise.resolve();
        },
    };
};

const storage = typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

// Root reducer
const rootReducer = combineReducers({
    auth: AuthReducer,
});

// Persist config
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'], // only auth will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store setup
export const makeStore = () => {
    const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }),
    });

    // attach persistor to the store (typed as any to avoid TypeScript error)
    (store as any).__persistor = persistStore(store);
    return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(makeStore);