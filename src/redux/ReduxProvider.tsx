'use client';

import { Provider, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setCredentials } from '@/redux/slices/auth';
import { AppDispatch, store } from '@/redux/store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {

  function HydrateUser() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
      const loadUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          dispatch(setCredentials({ token }));
        }
      };

      loadUser();
    }, [dispatch]);

    return null;
  }

  return (
    <Provider store={store}>
      <HydrateUser />
      {children}
    </Provider>
  )
}