import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
    addToCart as apiAddToCart,
    checkoutCart,
    getCart,
    removeItemFromCart,
    updateCartQuantity
} from '../../api/cart.js';

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (token, { rejectWithValue }) => {
        try {
            return await getCart(token);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return { items: [], total: 0 };
            }
            return rejectWithValue(error.message);
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, quantity, token }, { rejectWithValue }) => {
        try {
            return await apiAddToCart(productId, quantity, token);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateItemQuantity = createAsyncThunk(
    'cart/updateItemQuantity',
    async ({ productId, quantity, token }, { rejectWithValue }) => {
        try {
            return await updateCartQuantity(productId, quantity, token);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeItem = createAsyncThunk(
    'cart/removeItem',
    async ({ productId, token }, { rejectWithValue }) => {
        try {
            return await removeItemFromCart(productId, token);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const checkout = createAsyncThunk(
    'cart/checkout',
    async (token, { rejectWithValue }) => {
        try {
            await checkoutCart(token);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    items: [],
    total: 0,
    status: 'idle',
    error: null,
};

const handleFulfilledCart = (state, action) => {
    state.status = 'succeeded';

    const apiItems = action.payload?.items || [];

    state.items = apiItems.map(item => ({
        ...item,
        id: item.productId,
        image: `data:image/png;base64,${item.imageBase64}`
    }));

    state.total = action.payload?.total || 0;
    state.error = null;
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, handleFulfilledCart)
            .addCase(addToCart.fulfilled, handleFulfilledCart)
            .addCase(updateItemQuantity.fulfilled, handleFulfilledCart)
            .addCase(removeItem.fulfilled, handleFulfilledCart)
            .addCase(checkout.fulfilled, (state) => {
                state.items = [];
                state.total = 0;
                state.status = 'succeeded';
            })
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.status = 'loading';
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload;
                }
            );
    },
});

export default cartSlice.reducer;
