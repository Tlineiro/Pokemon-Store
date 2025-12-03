import axios from 'axios';

const BASE_URL = 'http://localhost:8080/cart';

function extractErrorMessage(error) {
    return (
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'Something went wrong.'
    );
}

export async function addToCart(productId, quantity, token) {
    try {
        const response = await axios.post(BASE_URL, { productId, quantity }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function getCart(token) {
    try {
        const response = await axios.get(BASE_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function updateCartQuantity(productId, quantity, token) {
    try {
        const response = await axios.put(`${BASE_URL}/${productId}`, quantity, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function removeItemFromCart(productId, token) {
    try {
        const response = await axios.delete(`${BASE_URL}/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function checkoutCart(token) {
    try {
        const response = await axios.post(`${BASE_URL}/checkout`, {},{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}
