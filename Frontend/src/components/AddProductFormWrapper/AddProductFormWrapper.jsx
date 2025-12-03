import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';

import { addNewCategory, fetchCategories } from '../Redux/categoriesSlice';
import AddProductForm from '../AddProductForm/AddProductForm.jsx';
import CustomAlert from '../CustomAlert/CustomAlert.jsx';
import { addNewProduct } from '../Redux/productsSlice';

import './AddProductFormWrapper.css';

function AddProductFormWrapper() {
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.user);
    const { status } = useSelector((state) => state.products);
    const { status: categoryStatus } = useSelector((state) => state.categories);
    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
    const [resetCounter, setResetCounter] = useState(0);

    useEffect(() => {
        if (categoryStatus === 'idle') {
            dispatch(fetchCategories());
        }
    }, [categoryStatus, dispatch]);


    const handleSubmit = async (formData) => {
        try {
            let categoryId;
            if (formData.categoryId === 'other') {
                const newCategoryAction = await dispatch(addNewCategory(formData.newCategory.trim())).unwrap();
                categoryId = newCategoryAction.id;
            } else {
                categoryId = parseInt(formData.categoryId);
            }

            const productData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                categoryIds: [categoryId],
                images: formData.images
            };

            await dispatch(addNewProduct({ productData, token })).unwrap();

            setAlert({ show: true, variant: 'success', message: 'Product created successfully!' });
            setResetCounter(prev => prev + 1);

        } catch (error) {
            setAlert({ show: true, variant: 'danger', message: error.message || error });
        }
    };

    return (
        <div className="add-product-form-wrapper">
            <AddProductForm
                onSubmit={handleSubmit}
                loading={status === 'loading'}
                resetTrigger={resetCounter}
            />
            <CustomAlert
                show={alert.show}
                variant={alert.variant}
                message={alert.message}
                onClose={() => setAlert({ ...alert, show: false })}
            />
        </div>
    );
}

export default AddProductFormWrapper;
