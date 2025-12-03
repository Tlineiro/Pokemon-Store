import { setPage } from '../../components/Redux/productsSlice';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';

import SearchableNavBar from "../../components/SearchableNavBar/SearchableNavBar.jsx";
import ProductExplorer from "../../components/ProductExplorer/ProductExplorer.jsx";

import './HomePage.css';

function HomePage({ onLoginClick }) {
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();

    const handleSearch = (query) => {
        setSearchQuery(query);
        dispatch(setPage(0));
    };

    return (
        <div className="app-container">
            <SearchableNavBar
                onLoginClick={onLoginClick}
                onSearch={handleSearch}
            />
            <ProductExplorer searchQuery={searchQuery} />
        </div>
    );
}

export default HomePage;
