import {Alert, Form, ListGroup, Spinner} from 'react-bootstrap';
import {useDispatch, useSelector} from "react-redux";
import React, { useEffect } from 'react';

import { fetchCategories } from '../Redux/categoriesSlice';

import './FiltersSidebar.css';


function FiltersSidebar({ selectedCategory, onCategoryChange, minPrice, maxPrice, onPriceChange }) {
    const dispatch = useDispatch();
    const { items: categories, status, error } = useSelector((state) => state.categories);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <Spinner animation="border" size="sm" />;
    }

    if (status === 'failed') {
        return <Alert variant="danger">Error: {error}</Alert>;
    }

    return (
        <div>
            <h5>Categorías</h5>
            <ListGroup>
                <ListGroup.Item
                    active={selectedCategory === null}
                    onClick={() => onCategoryChange(null)}
                    className="clickable-item"
                >
                    All
                </ListGroup.Item>
                {categories.map((category) => (
                    <ListGroup.Item
                        key={category.id}
                        active={selectedCategory === category.name}
                        onClick={() => onCategoryChange(category.name)}
                        className="clickable-item"
                    >
                        {category.name}
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <h5 className="mt-4">Precio</h5>
            <Form>
                <Form.Group className="mb-2">
                    <Form.Label size="sm">Mínimo</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Min"
                        name="minPrice"
                        value={minPrice}
                        onChange={onPriceChange}
                        size="sm"
                        min="0"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label size="sm">Máximo</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Max"
                        name="maxPrice"
                        value={maxPrice}
                        onChange={onPriceChange}
                        size="sm"
                        min="1"
                    />
                </Form.Group>
            </Form>
        </div>
    );
}

export default FiltersSidebar;
