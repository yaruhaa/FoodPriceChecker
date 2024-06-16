import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [categories, setCategories] = useState({});
    const [totalProducts, setTotalProducts] = useState(0);
    const [sortOrder, setSortOrder] = useState(null);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/search?query=${encodeURIComponent(query)}`);
                setProducts(response.data.products);
                setSortedProducts(response.data.products);
                setCategories(response.data.categories);
                setTotalProducts(response.data.products.length);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    useEffect(() => {
        sortProducts(sortOrder);
    }, [sortOrder, products]);

    const handleSubcategoryClick = (category, subcategory) => {
        navigate(`/categories/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}?search=${encodeURIComponent(query)}`);
    };

    const handleProductClick = (subcategory, productId) => {
        const category = Object.keys(categories)[0];
        navigate(`/categories/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}/${productId}`);
    };

    const sortProducts = (order) => {
        let sorted = [...products];

        if (order === 'asc') {
            sorted.sort((a, b) => parseFloat(a.OtherInfo[0].productPrice) - parseFloat(b.OtherInfo[0].productPrice));
        } else if (order === 'desc') {
            sorted.sort((a, b) => parseFloat(b.OtherInfo[0].productPrice) - parseFloat(a.OtherInfo[0].productPrice));
        }

        setSortedProducts(sorted);
    };

    const getMinMaxPrice = (otherInfo) => {
        const prices = otherInfo.map(info => parseFloat(info.productPrice));
        const minPrice = Math.min(...prices).toFixed(2);
        const maxPrice = Math.max(...prices).toFixed(2);
        return `${minPrice} - ${maxPrice} грн`;
    };

    return (
        <div className="SearchResults-grid">
            <div className="productsGroupList-sort">
                <h1 className="productsGroupList-h1">Результати пошуку для "{query}"</h1>
                <div className="sort-wrap">
                    <h2>Сортування</h2>
                    <button onClick={() => setSortOrder(null)}>За замовчуванням ▼</button>
                    <button onClick={() => setSortOrder('asc')}>Від дешевих ▼</button>
                    <button onClick={() => setSortOrder('desc')}>Від дорогих ▼</button>
                </div>
            </div>

            <div className="SearchResults-filter">
                <h2>Фільтр</h2>
                <p>Товарів в каталозі: {totalProducts}</p>
                {Object.keys(categories).map(category => (
                    <div key={category} className="category">
                        <p>{category}</p>
                        {categories[category].map(subcategory => (
                            <div className="SearchResults-Subcategory_link" key={subcategory}>
                                <a onClick={() => handleSubcategoryClick(category, subcategory)}>{subcategory}</a>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {sortedProducts.length > 0 ? (
                <div className="products-grid">
                    {sortedProducts.map(product => (
                        <div key={product._id} className="products-card">
                            <div className="card-info_main">
                                <img src={product.OtherInfo[0].productImg} alt={`${product.type} image`}
                                     className="product-img"/>
                                <div className="product-title">
                                    {product.type}
                                    {product.firm !== "Без фірми" && ` ${product.firm}`}
                                    {product.flavor !== "Без вкуса" && ` ${product.flavor}`}
                                    {product.sort !== "Без сорта" && ` ${product.sort}`}
                                    {` ${product.weight}г`}
                                </div>
                            </div>
                            <div className="card-info_price">
                                <div className="product-prices">
                                    {getMinMaxPrice(product.OtherInfo)}
                                </div>
                                <button
                                    onClick={() => handleProductClick(product.groupName, product._id)}
                                    className="product-button"
                                >
                                    Порівняти ціни
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Товари не знайдені.</p>
            )}
        </div>
    );
};

export default SearchResults;
