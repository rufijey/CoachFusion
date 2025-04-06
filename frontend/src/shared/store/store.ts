import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../../modules/users/store/authSlice.ts';
import userReducer from '../../modules/users/store/userSlice.ts';

export const createStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            user: userReducer
        },
    });
};

export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>;
export type AppDispatch = ReturnType<typeof createStore>['dispatch'];

export const store = createStore();
