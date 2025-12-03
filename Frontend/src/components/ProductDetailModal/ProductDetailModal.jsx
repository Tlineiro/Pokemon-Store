import { Modal, Carousel, Button } from 'react-bootstrap';
import React from 'react';

import './ProductDetailModal.css';

function ProductDetailModal({ show, onHide, product }) {
    if (!product) return null;

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{product.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {product.images?.length > 0 && (
                    <Carousel>
                        {product.images.map((img, idx) => (
                            <Carousel.Item key={idx}>
                                <img
                                    className="d-block w-100 product-detail-image"
                                    src={`data:image/png;base64,${img.imageBase64}`}
                                    alt={`Imagen ${idx + 1}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )}

                <p className="mt-3"><strong>Descripción:</strong> {product.description}</p>
                <p><strong>Precio:</strong> ${product.price}</p>
                <p><strong>Stock disponible:</strong> {product.stock}</p>
                <p><strong>Categorías:</strong> {product.categories?.map(c => c.name).join(', ')}</p>
                <p><strong>Vendedor:</strong> {product.seller?.firstName} {product.seller?.lastName}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProductDetailModal;
