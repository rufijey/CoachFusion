import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFingerprint } from '../../../shared/utils/getFingerprint.ts';
import { router } from '../../../shared/router';
import { setRole } from './authSlice.ts';
import { UserService } from '../services/UserService.ts';

export const login = createAsyncThunk(
    "auth/login",
    async (loginForm: any, { dispatch, rejectWithValue }) => {
        try {
            loginForm.fingerprint = await getFingerprint();
            const res = await UserService.login(loginForm);
            localStorage.setItem("access_token", res.data.accessToken);
            localStorage.setItem("role", res.data.role);
            dispatch(setRole(res.data.role));
            await router.navigate("/profile");
        } catch (error: any) {
            return rejectWithValue(error.response ? error.response.data : { message: "Unknown error occurred" });
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (registrationForm: any, { dispatch, rejectWithValue }) => {
        try {
            registrationForm.fingerprint = await getFingerprint();
            const res = await UserService.register(registrationForm);
            localStorage.setItem("access_token", res.data.accessToken);
            localStorage.setItem("role", res.data.role);
            dispatch(setRole(res.data.role));
            await router.navigate("/profile");
        } catch (error: any) {
            return rejectWithValue(error.response ? error.response.data : { message: "Unknown error occurred" });
        }
    }
);

export const refresh = createAsyncThunk(
    "auth/refresh",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const res = await UserService.refresh();
            localStorage.setItem("access_token", res.data.accessToken);
            localStorage.setItem("role", res.data.role);
            dispatch(setRole(res.data.role));
        } catch (error: any) {
            return rejectWithValue(error.response ? error.response.data : { message: "Unknown error occurred" });
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { dispatch, rejectWithValue }) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("role");
        dispatch(setRole(null));
        try {
            await UserService.logout();
            await router.navigate("/");
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.response ? error.response.data : { message: "Unknown error occurred" });
        }
    }
);
