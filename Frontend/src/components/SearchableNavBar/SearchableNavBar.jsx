import { Form, FormControl, Button } from 'react-bootstrap';
import React, { useState } from 'react';

import GenericNavBar from '../GenericNavBar/GenericNavBar.jsx';

import './SearchableNavBar.css';

function SearchableNavBar({ onLoginClick, onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value === '') onSearch('');
    };

    return (
        <GenericNavBar onLoginClick={onLoginClick}>
            <Form className="search-form" onSubmit={handleSubmit}>
                <FormControl
                    type="search"
                    placeholder="Search products"
                    className="search-input"
                    aria-label="Search"
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                <Button variant="success" type="submit">Search</Button>
            </Form>
        </GenericNavBar>
    );
}

export default SearchableNavBar;
