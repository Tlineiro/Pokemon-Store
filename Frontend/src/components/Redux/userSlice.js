import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    loginUser as apiLoginUser,
    registerUser as apiRegisterUser,
    getUser,
    updateUser,
    deleteAccount
} from '../../api/user.js';

export const loginUser = createAsyncThunk('user/login', async (loginData, { rejectWithValue }) => {
    try {
        const response = await apiLoginUser(loginData);
        localStorage.setItem('token', response.token);
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const registerUser = createAsyncThunk('user/register', async (userData, { dispatch, rejectWithValue }) => {
    try {
        await apiRegisterUser(userData);
        const loginData = { username: userData.username, password: userData.password };
        const actionResult = await dispatch(loginUser(loginData));
        return actionResult.payload;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchUser = createAsyncThunk('user/fetch', async (token, { rejectWithValue }) => {
    try {
        return await getUser(token);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const updateUserAccount = createAsyncThunk(
    'user/update',
    async ({ userData, token }, { rejectWithValue }) => {
        try {
            return await updateUser(userData, token);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteUserAccount = createAsyncThunk(
    'user/delete',
    async (token, { rejectWithValue }) => {
        try {
            await deleteAccount(token);
            localStorage.removeItem('token');
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    userInfo: null,
    token: localStorage.getItem('token') || null,
    status: 'idle',
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.token = null;
            state.userInfo = null;
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userInfo = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userInfo = action.payload;
            })
            .addCase(updateUserAccount.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userInfo = action.payload;
            })
            .addCase(deleteUserAccount.fulfilled, (state) => {
                state.token = null;
                state.userInfo = null;
                state.status = 'idle';
            })
            .addMatcher(
                (action) => action.type.startsWith('user/') && action.type.endsWith('/pending'),
                (state) => {
                    state.status = 'loading';
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('user/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload;
                }
            );
    },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
