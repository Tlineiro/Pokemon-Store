import { ListGroup, Image, Button, Spinner, Row, Col, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

import { fetchSellerProducts, deleteProduct, updateProduct } from '../Redux/productsSlice';
import { addNewCategory, fetchCategories } from '../Redux/categoriesSlice';
import EditProductModal from "../EditProductModal/EditProductModal.jsx";
import CustomAlert from '../CustomAlert/CustomAlert.jsx';

import './ManageProducts.css';

function ManageProducts() {
    const { token } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { status: categoryStatus } = useSelector((state) => state.categories);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
    const { sellerItems: products} = useSelector((state) => state.products);

    useEffect(() => {
        if (token) {
            dispatch(fetchSellerProducts(token));
        }
    }, [dispatch, token]);

    useEffect(() => {
        if (categoryStatus === 'idle') {
            dispatch(fetchCategories());
        }
    }, [categoryStatus, dispatch]);

    const handleSaveProduct = async (payloadFromModal) => {
        try {
            let finalCategoryId;
            if (payloadFromModal.categoryId === 'other') {
                const newCategoryAction = await dispatch(
                    addNewCategory(payloadFromModal.newCategory.trim())
                ).unwrap();
                finalCategoryId = newCategoryAction.id;
            } else {
                finalCategoryId = parseInt(payloadFromModal.categoryId);
            }

            const finalProductData = {
                name: payloadFromModal.name,
                description: payloadFromModal.description,
                price: payloadFromModal.price,
                stock: payloadFromModal.stock,
                images: payloadFromModal.images,
                categoryIds: [finalCategoryId],
            };

            await dispatch(updateProduct({
                productId: editingProduct.id,
                updatedData: finalProductData,
                token
            })).unwrap();

            setEditingProduct(null);
            setAlert({ show: true, variant: 'success', message: 'Product updated successfully' });
        } catch (err) {
            setAlert({ show: true, variant: 'danger', message: err });
        }
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;

        try {
            await dispatch(deleteProduct({ productId: productToDelete.id, token })).unwrap();
            setAlert({ show: true, variant: 'success', message: 'Product deleted successfully' });
            setProductToDelete(null);
        } catch (err) {
            setAlert({ show: true, variant: 'danger', message: err });
        }
    };

    return (
        <>
            <h4 className="mb-3">Your Products</h4>

            {status === 'loading' && !productToDelete && !editingProduct ? (
                <Spinner animation="border" />
            ) : products.length === 0 ? (
                <p>No products found</p>
            ) : (
                <ListGroup>
                    {products.map(product => (
                        <ListGroup.Item key={product.id} className="d-flex align-items-center justify-content-between">
                            <Row className="w-100 align-items-center">
                                <Col xs={2}>
                                    {product.images?.[0]?.imageBase64 ? (
                                        <Image
                                            src={`data:image/jpeg;base64,${product.images[0].imageBase64}`}
                                            thumbnail
                                            className="product-thumbnail"
                                        />
                                    ) : (
                                        <div className="placeholder-thumbnail" />
                                    )}
                                </Col>
                                <Col xs={6}>
                                    <h6 className="mb-1">{product.name}</h6>
                                    <p className="mb-0">Price: ${product.price}</p>
                                    <p className="mb-0">Stock: {product.stock}</p>
                                </Col>
                                <Col xs={4} className="text-end">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => setEditingProduct(product)}
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => setProductToDelete(product)}
                                    >
                                        <FaTrash />
                                    </Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            <EditProductModal
                show={!!editingProduct}
                product={editingProduct}
                onHide={() => setEditingProduct(null)}
                onSave={handleSaveProduct}
                loading={status === 'loading'}
            />

            <CustomAlert
                show={alert.show}
                variant={alert.variant}
                message={alert.message}
                onClose={() => setAlert({ ...alert, show: false })}
            />

            <Modal show={!!productToDelete} onHide={() => setProductToDelete(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <strong>{productToDelete?.name}</strong>?<br />
                    <span className="text-danger">This action cannot be reverted.</span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setProductToDelete(null)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm} disabled={status === 'loading'}>
                        {status === 'loading' ? 'Deleting...' : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ManageProducts;
