import { login } from "@/redux/actions/auth"
import { AuthState } from "@/types/auth"
import { createSlice } from "@reduxjs/toolkit"

const initialState: AuthState = {
    authLoading: 'idle',
    authToken: null,
    authError: null
}

const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.authLoading = 'pending'
            })
            .addCase(login.fulfilled, (state, action) => {
                state.authLoading = 'succeeded';
                const payload = action.payload as { token: string };
                state.authToken = payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.authLoading = 'failed';
                state.authError = action.payload as string;
            })
    },
})

// export const { } = authSlice.actions;
export default authSlice.reducer; 