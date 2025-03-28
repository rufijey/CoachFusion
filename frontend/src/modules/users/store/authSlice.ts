import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../shared/store/store.ts';
import { login, register } from './authThunks.ts';

interface AuthState {
    role: string;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const initialState: AuthState = {
    role: localStorage.getItem('role') || '',
    isAuthenticated: !!localStorage.getItem('role'),
    isLoading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setRole: (state, action: PayloadAction<string | null>) => {
            if (action.payload) {
                state.role = action.payload;
                state.isAuthenticated = true;
            }
            else{
                state.role = '';
                state.isAuthenticated = false;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(login.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(login.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(register.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(register.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(register.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setRole } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
