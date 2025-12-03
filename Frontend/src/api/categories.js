import axios from 'axios';

const BASE_URL = 'http://localhost:8080/categories';

function extractErrorMessage(error) {
    return (
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'Something went wrong.'
    );
}

export async function getCategories() {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function createCategory(name) {
    try {
        const response = await axios.post(BASE_URL, { name });
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}
