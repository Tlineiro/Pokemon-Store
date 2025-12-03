import React, { useEffect } from 'react';
import { Alert } from 'react-bootstrap';

import './CustomAlert.css';

function CustomAlert({ show, variant, message, onClose, duration = 3000 }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!show) return null;

    return (
        <div className="custom-alert-container">
            <Alert variant={variant} onClose={onClose} dismissible>
                {message}
            </Alert>
        </div>
    );
}

export default CustomAlert;
