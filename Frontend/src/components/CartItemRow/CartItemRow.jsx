import { Button } from "react-bootstrap";
import React from 'react';

import './CartItemRow.css';

function CartItemRow({ item, onUpdateQuantity, onRemove }) {
    const handleDecrement = () => {
        if (item.quantity > 1) {
            onUpdateQuantity(item.id, item.quantity - 1);
        }
    };

    const handleIncrement = () => {
        if (item.quantity < item.stock) {
            onUpdateQuantity(item.id, item.quantity + 1);
        }
    };

    return (
        <tr>
            <td>
                <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                />
            </td>
            <td>{item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>
                <div className="quantity-controls">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleDecrement}
                        disabled={item.quantity <= 1}
                    >-</Button>
                    <span className="quantity-value">{item.quantity}</span>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleIncrement}
                        disabled={item.quantity >= item.stock}
                    >+</Button>
                </div>
            </td>
            <td>${(item.price * item.quantity).toFixed(2)}</td> {/* Redondea el subtotal */}
            <td>
                <div className="remove-button-container">
                    <Button variant="danger" onClick={() => onRemove(item.id)}>
                        Remover
                    </Button>
                </div>
            </td>
        </tr>
    );
}

export default CartItemRow;