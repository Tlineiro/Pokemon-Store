import axios from 'axios';

const BASE_URL = 'http://localhost:8080/products';

function extractErrorMessage(error) {
    return (
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'Something went wrong.'
    );
}

export async function getProducts(page = 0, size = 9) {
    try {
        const response = await axios.get(`${BASE_URL}?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function getAvailableProducts(page = 0, size = 9) {
    try {
        const response = await axios.get(`${BASE_URL}/available?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function searchProducts({ name = '', category = '', page = 0, size = 9, minPrice = '', maxPrice = '' }) {
    try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);

        if (name) params.append('name', name);
        if (category) params.append('categories', category);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);

        const url = `${BASE_URL}/search?${params.toString()}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function createProduct(productData, token) {
    try {
        const response = await axios.post(BASE_URL, productData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function getSellerProducts(token) {
    try {
        const response = await axios.get(`${BASE_URL}/seller`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function deleteProductById(productId, token) {
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

export async function updateProductById(productId, updatedData, token) {
    try {
        const response = await axios.put(`${BASE_URL}/${productId}`, updatedData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}
