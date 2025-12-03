import { Form, Button, Row, Col, Spinner, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { updateUserAccount, deleteUserAccount, logout } from '../Redux/userSlice';
import CustomAlert from '../CustomAlert/CustomAlert.jsx';

import './UpdateAccountForm.css';

function UpdateAccountForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token, userInfo, status } = useSelector(state => state.user);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        seller: false
    });
    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (userInfo) {
            setFormData({
                username: userInfo.username || '',
                email: userInfo.email || '',
                password: '',
                firstName: userInfo.firstName || '',
                lastName: userInfo.lastName || '',
                seller: userInfo.seller || false,
            });
        }
    }, [userInfo]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            username: formData.username,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            seller: formData.seller
        };
        if (formData.password.trim()) {
            payload.password = formData.password;
        }

        try {
            await dispatch(updateUserAccount({ userData: payload, token })).unwrap();

            const requiresReLogin = userInfo.username !== payload.username || !!payload.password;
            if (requiresReLogin) {
                setAlert({ show: true, variant: 'info', message: 'Datos actualizados. Por seguridad, iniciá sesión nuevamente.' });
                setTimeout(() => {
                    dispatch(logout());
                    navigate('/');
                }, 2000);
            } else {
                setAlert({ show: true, variant: 'success', message: '¡Datos actualizados!' });
                setFormData(prev => ({ ...prev, password: '' }));
            }
        } catch (error) {
            setAlert({ show: true, variant: 'danger', message: error.message });
        }
    };

    const confirmDeleteAccount = async () => {
        try {
            await dispatch(deleteUserAccount(token)).unwrap();
            setAlert({ show: true, variant: 'info', message: 'Cuenta eliminada correctamente. Redirigiendo...' });
            setShowDeleteModal(false);
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            setAlert({ show: true, variant: 'danger', message: error.message });
        }
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    return (
        <>
            <CustomAlert
                show={alert.show}
                variant={alert.variant}
                message={alert.message}
                onClose={() => setAlert({ ...alert, show: false })}
            />

            {status === 'loading' && !formData.username ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Nuevo password"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} className="seller-checkbox-col">
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="¿Es vendedor?"
                                    name="seller"
                                    checked={formData.seller}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button type="submit" variant="primary" disabled={status === 'loading'}>
                        {status === 'loading' ? <Spinner size="sm" /> : 'Actualizar'}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDeleteAccount}
                        className="delete-button"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? <Spinner size="sm" /> : 'Eliminar cuenta'}
                    </Button>
                </Form>
            )}

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que querés eliminar tu cuenta? Esta acción no se puede deshacer.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteAccount} disabled={status === 'loading'}>
                        {status === 'loading' ? <Spinner size="sm" /> : 'Eliminar cuenta'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UpdateAccountForm;
