import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';

import PaginationControls from "../PaginationControls/PaginationControls.jsx";
import ProductDetailModal from "../ProductDetailModal/ProductDetailModal.jsx";
import { fetchProducts, setPage } from '../Redux/productsSlice';
import ProductGrid from "../ProductGrid/ProductGrid.jsx";
import CustomAlert from '../CustomAlert/CustomAlert.jsx';
import { addToCart } from '../Redux/cartSlice';

import './ProductList.css';

function ProductList({ selectedCategory, searchQuery, minPrice, maxPrice }) {
    const { token } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
    const {
        items: products,
        currentPage: page,
        totalPages,
        status
    } = useSelector((state) => state.products);

    const finalMinPrice = Number(minPrice) > 1 ? minPrice : '';
    const finalMaxPrice = Number(maxPrice) > 0 ? maxPrice : '';

    useEffect(() => {
        dispatch(fetchProducts({
            page,
            size: 9,
            name: searchQuery,
            category: selectedCategory,
            minPrice: finalMinPrice,
            maxPrice: finalMaxPrice
        }))
            .unwrap()
            .catch((err) => {
                setAlert({ show: true, variant: 'danger', message: `Error fetching products: ${err}` });
            });
    }, [dispatch, page, selectedCategory, searchQuery, minPrice, maxPrice]);

    const handleAddToCart = async (productId) => {
        if (!token) {
            setAlert({ show: true, variant: 'warning', message: 'You need to be logged in to add products to the cart.' });
            return;
        }
        try {
            await dispatch(addToCart({ productId, quantity: 1, token })).unwrap();
            setAlert({ show: true, variant: 'success', message: 'Product added to cart' });
        } catch (error) {
            setAlert({ show: true, variant: 'danger', message: `Error adding product to cart: ${error}` });
        }
    };

    const handlePageChange = (newPage) => {
        dispatch(setPage(newPage));
    }

    return (
        <>
            {status === 'loading' ? (
                <Spinner animation="border" variant="primary" />
            ) : status === 'failed' ? (
                <div className="error-text">Hubo un error al cargar los productos.</div>
            ) : products.length === 0 ? (
                <div className="no-products-text">No se encontraron productos.</div>
            ) : (
                <>
                    <ProductGrid
                        products={products}
                        onView={setSelectedProduct}
                        onAddToCart={handleAddToCart}
                        canAddToCart={!!token}
                    />

                    <PaginationControls
                        page={page}
                        totalPages={totalPages}
                        onNext={() => handlePageChange(page + 1)}
                        onPrevious={() => handlePageChange(page - 1)}
                    />
                </>
            )}

            <CustomAlert
                show={alert.show}
                variant={alert.variant}
                message={alert.message}
                onClose={() => setAlert({ ...alert, show: false })}
            />

            <ProductDetailModal
                show={!!selectedProduct}
                onHide={() => setSelectedProduct(null)}
                product={selectedProduct}
            />
        </>
    );
}

export default ProductList;
