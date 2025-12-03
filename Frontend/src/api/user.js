import axios from 'axios';

const BASE_URL = 'http://localhost:8080/user';

function extractErrorMessage(error) {
    return (
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'Something went wrong.'
    );
}

export async function registerUser(userData) {
    try {
        const response = await axios.post(`${BASE_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function loginUser(loginData) {
    try {
        const response = await axios.post(`${BASE_URL}/login`, loginData);
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function updateUser(userData, token) {
    try {
        const response = await axios.put(`${BASE_URL}/update`, userData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function getUser(token) {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function deleteAccount(token) {
    try {
        const response = await axios.delete(`${BASE_URL}/autoDelete`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}
