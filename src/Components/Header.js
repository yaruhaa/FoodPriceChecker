import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Images/logo.png';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const goToHomePage = () => {
        navigate('/');
    };

    return (
        <div className="header">
            <div className="header-container">
                <img
                    src={logo}
                    alt="logo"
                    className="header-logo"
                    onClick={goToHomePage} // Добавляем обработчик onClick для перехода на главную страницу
                    style={{ cursor: 'pointer' }} // Устанавливаем стиль курсора, чтобы показать, что элемент кликабелен
                />

                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Пошук товарів..."
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z">
                            </path>
                        </svg>
                    </button>
                </form>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default Header;