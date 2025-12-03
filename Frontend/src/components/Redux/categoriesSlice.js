import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {createCategory, getCategories} from '../../api/categories.js';

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            return await getCategories();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addNewCategory = createAsyncThunk(
    'categories/addNewCategory',
    async (categoryName, { dispatch, rejectWithValue }) => {
        try {
            const newCategory = await createCategory(categoryName);
            dispatch(fetchCategories());
            return newCategory;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    items: [],
    status: 'idle',
    error: null,
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload || [];
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addNewCategory.pending, () => {})
            .addCase(addNewCategory.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default categoriesSlice.reducer;
