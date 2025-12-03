import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form } from 'react-bootstrap';
import React, { useState } from 'react';

import { loginUser, registerUser } from '../Redux/userSlice';
import CustomAlert from '../CustomAlert/CustomAlert.jsx';

import './LoginModal.css';

function LoginModal({ show, handleClose }) {
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.user);

    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
    const [modalType, setModalType] = useState('Log In');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        seller: false
    });

    const resetModal = () => {
        setModalType('Log In');
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            seller: false
        });
        setAlert({ show: false, variant: '', message: '' });
    };

    const handleModalClose = () => {
        resetModal();
        handleClose();
    };

    const toggleModalType = () => {
        setModalType(modalType === 'Log In' ? 'Register' : 'Log In');
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            seller: false
        });
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handlePrimaryAction = async () => {
        try {
            if (modalType === 'Log In') {
                await dispatch(loginUser({
                    username: formData.username,
                    password: formData.password
                })).unwrap();
            } else {
                await dispatch(registerUser({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    seller: formData.seller
                })).unwrap();
            }
            handleModalClose();
        } catch (err) {
            setAlert({ show: true, variant: 'danger', message: err });
        }
    };

    const isFormValid = () => {
        if (!formData.username.trim() || !formData.password.trim()) return false;
        if (modalType === 'Register') {
            if (!formData.email.trim() || !formData.firstName.trim() || !formData.lastName.trim()) return false;
            if (!isValidEmail(formData.email)) return false;
            if (formData.password !== formData.confirmPassword) return false;
        }
        return true;
    };

    return (
        <>
            <Modal show={show} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                autoFocus
                            />
                        </Form.Group>

                        {modalType === 'Register' && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        isInvalid={formData.email !== '' && !isValidEmail(formData.email)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a valid email.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter first name"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter last name"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Are you a seller?"
                                        name="seller"
                                        checked={formData.seller}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        {modalType === 'Register' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    isInvalid={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Passwords don't match
                                </Form.Control.Feedback>
                            </Form.Group>
                        )}
                    </Form>

                    <div className="switch-mode-text">
                        {modalType === 'Log In' ? (
                            <p>
                                Not registered?{' '}
                                <span className="switch-mode-link" onClick={toggleModalType}>
                                    Click here to register
                                </span>
                            </p>
                        ) : (
                            <p>
                                Already registered?{' '}
                                <span className="switch-mode-link" onClick={toggleModalType}>
                                    Log in
                                </span>
                            </p>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>Close</Button>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={handlePrimaryAction}
                        disabled={!isFormValid() || status === 'loading'}
                    >
                        {status === 'loading' ? "Processing..." : modalType}
                    </Button>
                </Modal.Footer>
            </Modal>

            <CustomAlert
                show={alert.show}
                variant={alert.variant}
                message={alert.message}
                onClose={() => setAlert({ ...alert, show: false })}
            />
        </>
    );
}

export default LoginModal;
