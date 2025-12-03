import { Form, Button, Spinner, Image, Alert } from 'react-bootstrap';
import React, {useState, useEffect, useRef} from 'react';
import { useSelector } from 'react-redux';

import CustomAlert from '../CustomAlert/CustomAlert.jsx';

import './AddProductForm.css';

function AddProductForm({ onSubmit, loading, resetTrigger }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        images: [],
        newCategory: ''
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
    const fileInputRef = useRef(null);
    const { items: categories, status: categoryStatus, error: categoryError } = useSelector((state) => state.categories);

    useEffect(() => {
        setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            categoryId: '',
            images: [],
            newCategory: ''
        });
        setImagePreviews([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [resetTrigger]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'stock') {
            const intValue = value.replace(/\D/g, '');
            setFormData({ ...formData, [name]: intValue });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => URL.createObjectURL(file));

        const readers = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers)
            .then(imagesBase64 => {
                setFormData({ ...formData, images: imagesBase64 });
                setImagePreviews(previews);
            })
            .catch(err => {
                console.error("Error reading files:", err);
                setAlert({
                    show: true,
                    variant: 'danger',
                    message: 'Ocurrió un error al leer las imágenes. Intentalo nuevamente.'
                });
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isFormValid = () => {
        const requiredFields = [
            formData.name.trim(),
            formData.description.trim(),
            formData.price.trim(),
            formData.stock.trim(),
            formData.categoryId
        ];

        if (requiredFields.some(field => !field)) return false;
        if (formData.categoryId === 'other' && formData.newCategory.trim() === '') return false;
        return formData.images.length !== 0;
    };

    return (
        <>
            <CustomAlert
                show={alert.show}
                variant={alert.variant}
                message={alert.message}
                onClose={() => setAlert({ ...alert, show: false })}
            />

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} rows={3} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control type="text" name="stock" value={formData.stock} onChange={handleChange} required />
                </Form.Group>

                {categoryStatus === 'loading' && <Spinner animation="border" size="sm" />}
                {categoryStatus === 'failed' && <Alert variant="danger">Error al cargar categorías: {categoryError}</Alert>}
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
                    <Form.Control
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        ref={fileInputRef}
                    />
                </Form.Group>

                {imagePreviews.length > 0 && (
                    <div className="image-preview-container">
                        {imagePreviews.map((src, i) => (
                            <Image key={i} src={src} thumbnail className="image-preview" />
                        ))}
                    </div>
                )}
                <Button variant="primary" type="submit" disabled={!isFormValid() || loading || categoryStatus !== 'succeeded'}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Create Product"}
                </Button>
            </Form>
        </>
    );
}

export default AddProductForm;
