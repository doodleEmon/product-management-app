import { apiCall } from "@/services/api";
import { getErrorMessage } from "@/utils/errorHandler";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const login = createAsyncThunk(
    'auth/login',
    async (loginData: string, { rejectWithValue }) => {
        try {
            const response = await apiCall("/auth", "POST", { email: loginData }, undefined) as { token: string };
            localStorage.setItem('token', response.token);
            return response;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error) || 'Login failed.');
        }
    }
)