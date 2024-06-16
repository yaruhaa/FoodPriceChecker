// Components/GlobalSearch.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?query=${searchTerm}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="global-search-form">
            <input
                type="text"
                placeholder="Пошук..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="global-search-input"
            />
            <button type="submit" className="global-search-button">Шукати</button>
        </form>
    );
};

export default GlobalSearch;
