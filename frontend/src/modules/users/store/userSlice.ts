import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserService } from '../services/UserService.ts';
import { ICoachProfile, IUser, UserState } from './userInterfaces.ts';

const initialState: UserState = {
    user: null,
    loading: true,
    error: null,
};

export const fetchUser = createAsyncThunk<IUser>('user/fetchUser', async (_, { rejectWithValue }) => {
    try {
        const response = await UserService.getUser();
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to fetch user');
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
            state.error = null;
        },
        updateCoachProfile(state, action: PayloadAction<ICoachProfile>) {
            if (state.user) {
                state.user.coachProfile = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { updateUser, clearUser, updateCoachProfile } = userSlice.actions;
export default userSlice.reducer;
