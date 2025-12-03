import { Table, Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchCart, removeItem, updateItemQuantity, checkout } from '../../components/Redux/cartSlice';
import GenericNavBar from "../../components/GenericNavBar/GenericNavBar.jsx";
import CartItemRow from "../../components/CartItemRow/CartItemRow.jsx";
import CustomAlert from '../../components/CustomAlert/CustomAlert.jsx';
import CheckoutModal from '../../components/CheckoutModal/CheckoutModal.jsx';

import './CartPage.css';

function CartPage({ onLoginClick }) {
    const { token } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });

    const { items: cart, total, status } = useSelector((state) => state.cart);

    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleModalConfirm = async (cardData) => {
        setShowModal(false);
        await handleCheckout();
    };
    useEffect(() => {
        if (token) {
            dispatch(fetchCart(token));
        }
    }, [dispatch, token]);

    const removeFromCart = async (id) => {
        try {
            await dispatch(removeItem({ productId: id, token })).unwrap();
            setAlert({ show: true, variant: 'success', message: 'Product removed from the cart' });
        } catch (error) {
            setAlert({ show: true, variant: 'danger', message: `Error removing item from the cart: ${error}` });
        }
    };

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await dispatch(updateItemQuantity({ productId: id, quantity: newQuantity, token })).unwrap();
            setAlert({ show: true, variant: 'success', message: 'Quantity updated' });
        } catch (error) {
            setAlert({ show: true, variant: 'danger', message: `Error updating the quantity: ${error}` });
        }
    };

    const handleCheckout = async () => {
        if (!cart.length) {
            setAlert({ show: true, variant: 'warning', message: 'No tienes productos en el carrito.' });
            return;
        }
        try {
            await dispatch(checkout(token)).unwrap();
            setAlert({ show: true, variant: 'success', message: '¡Compra realizada con éxito! Gracias por tu compra.' });
        } catch (error) {
            setAlert({ show: true, variant: 'danger', message: `Error al procesar el checkout: ${error}` });
        }
    };

    const handleBackToMain = () => navigate('/');

    return (
        <div className="app-container">
            <GenericNavBar
                onLoginClick={onLoginClick}
            />
            {status === 'loading' && !cart.length ? (
                <div className="cart-spinner"><Spinner animation="border"/></div>
            ) : (
                <div className="cart-container">
                    <div className="cart-header">
                        <Button variant="secondary" onClick={handleBackToMain}>Volver al inicio</Button>
                        <h2>Carrito de compras</h2>
                    </div>

                    <CustomAlert
                        show={alert.show}
                        variant={alert.variant}
                        message={alert.message}
                        onClose={() => setAlert({...alert, show: false})}
                    />

                    {cart.length === 0 ? (
                        <p className="empty-message">El carrito está vacío.</p>
                    ) : (
                        <>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Foto</th>
                                    <th>Nombre</th>
                                    <th>Precio (unidad)</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cart.map(item => (
                                    <CartItemRow
                                        key={item.id}
                                        item={{
                                            ...item,
                                            subtotal: parseFloat((item.price * item.quantity).toFixed(2))
                                        }}
                                        onUpdateQuantity={updateQuantity}
                                        onRemove={removeFromCart}
                                    />
                                ))}
                                </tbody>
                            </Table>
                            <div className="cart-footer">
                                <h4>Total: ${parseFloat((total).toFixed(2))}</h4>
                                <Button variant="success" onClick={handleOpenModal}>Realizar checkout</Button>
                            </div>
                        </>
                    )}
                </div>
            )}
            <CheckoutModal
                show={showModal}
                onHide={handleCloseModal}
                onConfirm={handleModalConfirm}
            />
        </div>
    );
}

export default CartPage;
