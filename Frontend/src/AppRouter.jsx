import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import { fetchUser, logout } from './components/Redux/userSlice.js';
import LoginModal from './components/LoginModal/LoginModal.jsx';
import HomePage from './views/HomePage/HomePage.jsx';
import UserPage from './views/UserPage/UserPage.jsx';
import CartPage from './views/CartPage/CartPage.jsx';

function AppRouter() {
    const { token } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        if (token) {
            dispatch(fetchUser(token)).unwrap().catch(() => {
                dispatch(logout());
            });
        }
    }, [token, dispatch]);

    return (
        <>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <HomePage
                                onLoginClick={() => setShowLogin(true)}
                            />
                        }
                    />
                    <Route
                        path="/user"
                        element={token
                            ? <UserPage onLoginClick={() => setShowLogin(true)} />
                            : <Navigate to="/" replace />}
                    />
                    <Route
                        path="/cart"
                        element={token
                            ? <CartPage onLoginClick={() => setShowLogin(true)} />
                            : <Navigate to="/" replace />}
                    />
                </Routes>
            </Router>

            <LoginModal
                show={showLogin}
                handleClose={() => setShowLogin(false)}
            />
        </>
    );
}

export default AppRouter;
