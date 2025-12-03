import { Card, Button, Row, Col } from 'react-bootstrap';
import React from 'react';

import './ProductGrid.css';

function ProductGrid({ products, onView, onAddToCart, canAddToCart }) {
    return (
        <Row>
            {products.map((product) => (
                <Col key={product.id} md={4} className="mb-4">
                    <Card>
                        {product.images.length > 0 && (
                            <Card.Img
                                variant="top"
                                src={`data:image/png;base64,${product.images[0].imageBase64}`}
                                className="product-image"
                            />
                        )}
                        <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Text>Precio: ${product.price}</Card.Text>
                            <div className="d-flex justify-content-between">
                                <Button variant="primary" onClick={() => onView(product)}>
                                    Ver
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={() => onAddToCart(product.id)}
                                    disabled={!canAddToCart}
                                >
                                    Agregar al carrito
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}

export default ProductGrid;
