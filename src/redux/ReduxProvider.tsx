'use client'

import React, { useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { AppDispatch, store } from '@/redux/store'

export default function ReduxProvider({ children }: { children: React.ReactNode }) {

    // function HydrateUser() {
    //     const dispatch = useDispatch<AppDispatch>();

    //     useEffect(() => {
    //         const loadUser = async () => {
    //             try {
    //                 await dispatch(checkAuth());
    //             } catch {
    //                 dispatch(setUser(null));
    //             }
    //         };
    //         loadUser();
    //     }, [dispatch]);

    //     return null;
    // }

    return (
        <Provider store={store}>
            {/* <HydrateUser /> */}
            {children}
        </Provider>
    )
}
