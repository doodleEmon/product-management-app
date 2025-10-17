import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from '@/redux/slices/auth';
import ProductReducer from '@/redux/slices/product';
import CategoryReducer from '@/redux/slices/category';

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    product: ProductReducer,
    category: CategoryReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;