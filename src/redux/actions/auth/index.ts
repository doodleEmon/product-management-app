import { apiCall } from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const login = createAsyncThunk(
    'auth/login',
    async (loginData: string, { rejectWithValue }) => {
        try {
            const data = await apiCall("/auth", "POST", {"email": `${loginData}`})
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)