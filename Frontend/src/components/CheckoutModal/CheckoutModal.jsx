import { Modal, Button, Form } from 'react-bootstrap';
import React, { useState } from 'react';

function CheckoutModal({ show, onHide, onConfirm }) {
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expMonth, setExpMonth] = useState('');
    const [expYear, setExpYear] = useState('');
    const [cvv, setCvv] = useState('');

    const isCardNumberValid = /^\d{16}$/.test(cardNumber);
    const isExpMonthValid = /^(0[1-9]|1[0-2])$/.test(expMonth);
    const isExpYearValid = /^\d{2}$/.test(expYear) && Number(expYear) >= 25;
    const isCvvValid = /^\d{3}$/.test(cvv);
    const isFormValid = cardName && isCardNumberValid && isExpMonthValid && isExpYearValid && isCvvValid;

    const handleConfirm = () => {
        if (isFormValid) {
            onConfirm({ cardName, cardNumber, expMonth, expYear, cvv });
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Pago con tarjeta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre en la tarjeta</Form.Label>
                        <Form.Control
                            type="text"
                            value={cardName}
                            onChange={e => setCardName(e.target.value)}
                            placeholder="Nombre completo"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Número de tarjeta</Form.Label>
                        <Form.Control
                            type="text"
                            maxLength={16}
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))}
                            placeholder="16 dígitos"
                            isInvalid={cardNumber && !isCardNumberValid}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex gap-2">
                        <div>
                            <Form.Label>Mes</Form.Label>
                            <Form.Control
                                type="text"
                                maxLength={2}
                                value={expMonth}
                                onChange={e => setExpMonth(e.target.value.replace(/\D/g, ''))}
                                placeholder="MM"
                                isInvalid={expMonth && !isExpMonthValid}
                            />
                        </div>
                        <div>
                            <Form.Label>Año</Form.Label>
                            <Form.Control
                                type="text"
                                maxLength={2}
                                value={expYear}
                                onChange={e => setExpYear(e.target.value.replace(/\D/g, ''))}
                                placeholder="AA"
                                isInvalid={expYear && !isExpYearValid}
                            />
                        </div>
                        <div>
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                                type="text"
                                maxLength={3}
                                value={cvv}
                                onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                                placeholder="CVV"
                                isInvalid={cvv && !isCvvValid}
                            />
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                <Button variant="success" onClick={handleConfirm} disabled={!isFormValid}>
                    Confirmar pago
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CheckoutModal;
