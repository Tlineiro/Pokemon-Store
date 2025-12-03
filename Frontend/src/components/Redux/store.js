import { configureStore } from '@reduxjs/toolkit';

import productsReducer from './productsSlice';
import cartReducer from './cartSlice';
import categoriesReducer from './categoriesSlice.js';
import userReducer from './userSlice.js';

export const store = configureStore({
    reducer: {
        products: productsReducer,
        cart: cartReducer,
        categories: categoriesReducer,
        user: userReducer
    },
});
