import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
    createProduct,
    deleteProductById,
    getAvailableProducts,
    getSellerProducts,
    searchProducts,
    updateProductById,
} from '../../api/products';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ page, size, name, category, minPrice, maxPrice }, { rejectWithValue }) => {
        try {
            let data;
            if (name || category || minPrice || maxPrice) {
                data = await searchProducts({ name, category, page, size, minPrice, maxPrice });
            } else {
                data = await getAvailableProducts(page, size);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addNewProduct = createAsyncThunk(
    'products/addNewProduct',
    async ({ productData, token }, { rejectWithValue }) => {
        try {
            return await createProduct(productData, token);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchSellerProducts = createAsyncThunk(
    'products/fetchSellerProducts',
    async (token, { rejectWithValue }) => {
        try {
            const data = await getSellerProducts(token);
            return data.content || data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async ({ productId, token }, { rejectWithValue, dispatch }) => {
        try {
            await deleteProductById(productId, token);
            dispatch(fetchSellerProducts(token));
            return productId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ productId, updatedData, token }, { rejectWithValue, dispatch }) => {
        try {
            const updatedProduct = await updateProductById(productId, updatedData, token);
            dispatch(fetchSellerProducts(token));
            return updatedProduct;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    items: [],
    totalPages: 0,
    currentPage: 0,

    sellerItems: [],

    status: 'idle',
    error: null,
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setPage(state, action) {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content ?? [];
                state.totalPages = action.payload.totalPages ?? 1;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchSellerProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSellerProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sellerItems = action.payload;
            })
            .addCase(fetchSellerProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addMatcher(
                (action) => [addNewProduct.pending, deleteProduct.pending, updateProduct.pending].includes(action.type),
                (state) => {
                    state.status = 'loading';
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => [addNewProduct.fulfilled, deleteProduct.fulfilled, updateProduct.fulfilled].includes(action.type),
                (state) => {
                    state.status = 'succeeded';
                }
            )
            .addMatcher(
                (action) => [addNewProduct.rejected, deleteProduct.rejected, updateProduct.rejected].includes(action.type),
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload;
                }
            );
    },
});

export const { setPage } = productsSlice.actions;

export default productsSlice.reducer;
