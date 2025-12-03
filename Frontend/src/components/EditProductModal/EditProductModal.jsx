import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import './EditProductModal.css';

function EditProductModal({ show, onHide, product, onSave, loading }) {
    const { items: categories, status: categoryStatus, error: categoryError } = useSelector((state) => state.categories);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        images: [],
        categoryId: '',
        newCategory: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price?.toString() || '',
                stock: product.stock?.toString() || '',
                images: product.images?.map(img => img.imageBase64) || [],
                categoryId: product.categories?.[0]?.id || '',
                newCategory: ''
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'stock') {
            const intValue = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, stock: intValue }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then(imagesBase64 => {
            setFormData(prev => ({ ...prev, images: imagesBase64 }));
        }).catch(err => console.error("Error reading files:", err));
    };

    const handleSubmit = () => {
        const payload = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            images: formData.images,
            categoryId: formData.categoryId,
            newCategory: formData.newCategory
        };
        onSave(payload);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control name="name" value={formData.name} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control type="text" name="stock" value={formData.stock} onChange={handleChange} />
                    </Form.Group>
                    {categoryStatus === 'loading' && <Spinner animation="border" size="sm" />}
                    {categoryStatus === 'failed' && <Alert variant="danger">Error: {categoryError}</Alert>}
                    {categoryStatus === 'succeeded' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                                <option value="other">Other</option>
                            </Form.Select>
                        </Form.Group>
                    )}

                    {formData.categoryId === 'other' && (
                        <Form.Group className="mb-3">
                            <Form.Label>New Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="newCategory"
                                value={formData.newCategory}
                                onChange={handleChange}
                                placeholder="Enter new category name"
                                required
                            />
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>Images</Form.Label>
                        <Form.Control type="file" multiple onChange={handleImageChange} />
                    </Form.Group>
                    {formData.images.length > 0 && (
                        <div className="image-preview-container">
                            {formData.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={`data:image/jpeg;base64,${img}`}
                                    alt="preview"
                                    className="image-preview"
                                />
                            ))}
                        </div>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : 'Save Changes'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditProductModal;
