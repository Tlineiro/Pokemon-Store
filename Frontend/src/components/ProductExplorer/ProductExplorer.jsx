import { Container, Row, Col } from 'react-bootstrap';
import { setPage } from '../Redux/productsSlice';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';

import FiltersSidebar from '../FiltersSidebar/FiltersSidebar.jsx';
import ProductList from '../ProductList/ProductList.jsx';

import './ProductExplorer.css';

function ProductExplorer({ searchQuery }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const dispatch = useDispatch();
    const [prices, setPrices] = useState({ minPrice: '', maxPrice: '' });

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        dispatch(setPage(0));
    };

    const handlePriceChange = (e) => {
        setPrices(prev => ({ ...prev, [e.target.name]: e.target.value }));
        dispatch(setPage(0));
    };

    return (
        <Container fluid className="main-content">
            <Row className="h-100">
                <Col md={2} className="sidebar">
                    <FiltersSidebar
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        minPrice={prices.minPrice}
                        maxPrice={prices.maxPrice}
                        onPriceChange={handlePriceChange}
                    />
                </Col>
                <Col md={10}>
                    <ProductList
                        selectedCategory={selectedCategory}
                        searchQuery={searchQuery}
                        minPrice={prices.minPrice}
                        maxPrice={prices.maxPrice}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default ProductExplorer;
