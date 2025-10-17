export interface LoginDataType {
    email: string
}

export interface AuthState {
    authLoading: 'idle' | 'pending' | 'succeeded' | 'failed';
    authToken: string | null;
    authError: string | null;
    isAuthenticated: boolean;
}
