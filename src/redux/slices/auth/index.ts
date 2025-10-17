import { login } from "@/redux/actions/auth"
import { AuthState } from "@/types/auth"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: AuthState = {
    authLoading: 'idle',
    authToken: null,
    authError: null,
    isAuthenticated: false
}

const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.authLoading = 'idle';
            state.authToken = null;
            state.authError = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
        setCredentials: (state, action: PayloadAction<{ token: string }>) => {
            state.authToken = action.payload.token;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.authLoading = 'pending';
                state.authError = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
                state.authLoading = 'succeeded';
                state.authToken = action.payload.token;
                state.isAuthenticated = true;
                state.authError = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.authLoading = 'failed';
                state.authError = action.payload as string;
            })
    },
})

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer; 