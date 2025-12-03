import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../Redux/userSlice';
import React, { useState } from 'react';

import CustomAlert from '../CustomAlert/CustomAlert.jsx';

import './GenericNavBar.css';

function GenericNavBar({ onLoginClick, children }) {
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.user);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('danger');
    const navigate = useNavigate();

    const isLoggedIn = !!token;

    const showAlert = (message, variant = 'danger') => {
        setAlertMessage(message);
        setAlertVariant(variant);
        setAlertVisible(true);
    };

    const handleCartClick = () => {
        isLoggedIn ? navigate('/cart') : showAlert('You need to log in to access the cart!');
    };

    const handleUserClick = () => {
        isLoggedIn ? navigate('/user') : showAlert('You need to log in to access your account!');
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <>
            <Navbar expand="lg" className="navbar-custom" variant="dark">
                <Container>
                    <Navbar.Brand onClick={() => navigate('/')} className="navbar-brand-clickable">
                        PokeShop
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll" className="justify-content-between">
                        <div className="navbar-search-container">
                            {children}
                        </div>

                        <Nav className="ms-auto">
                            <Button variant="outline-light" onClick={handleCartClick} className="ms-2">
                                <FaShoppingCart />
                            </Button>
                            {isLoggedIn ? (
                                <Button variant="outline-light" onClick={handleLogout} className="ms-2">
                                    Log Out
                                </Button>
                            ) : (
                                <Button variant="outline-light" onClick={onLoginClick} className="ms-2">
                                    Log In
                                </Button>
                            )}
                            <Button variant="outline-light" onClick={handleUserClick} className="ms-2">
                                <FaUser />
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <CustomAlert
                show={alertVisible}
                variant={alertVariant}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
                duration={3000}
            />
        </>
    );
}

export default GenericNavBar;
