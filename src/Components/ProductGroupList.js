import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useLocation } from 'react-router-dom';

const ProductFilter = ({
                           types,
                           selectedTypes,
                           onTypeChange,
                           firms,
                           selectedFirms,
                           onFirmChange,
                           flavors,
                           selectedFlavors,
                           onFlavorChange,
                           sorts,
                           selectedSorts,
                           onSortChange,
                           totalProducts,
                           searchTerm,
                           setSearchTerm,
                       }) => {
    const [showAllTypes, setShowAllTypes] = useState(false);
    const [showAllFirms, setShowAllFirms] = useState(false);
    const [showAllFlavors, setShowAllFlavors] = useState(false);
    const [showAllSorts, setShowAllSorts] = useState(false);

    const renderItems = (items, selectedItems, onChange, showAll, setShowAll, title) => {
        const itemsToShow = showAll ? items : items.slice(0, 10);

        if (items.length === 0) {
            return null;
        }

        return (
            <>
                {title && <p>{title}</p>}
                {itemsToShow.map(item => (
                    <div key={item}>
                        <input
                            type="checkbox"
                            id={item}
                            value={item}
                            checked={selectedItems.includes(item)}
                            onChange={() => onChange(item)}
                        />
                        <label htmlFor={item}>{item}</label>
                    </div>
                ))}
                {items.length > 10 && (
                    <a className="show-all_button" onClick={() => setShowAll(!showAll)}>
                        {showAll ? 'Згорнути ▲' : 'Показати всі ▼'}
                    </a>
                )}
            </>
        );
    };

    return (
        <div className="product-filter">
            <h2>Фільтр</h2>
            <p>Товарів в каталозі: {totalProducts}</p>
            <input
                type="text"
                placeholder="Пошук..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="productsGroupList-search"
            />
            <div className="filter-item">
                {renderItems(types, selectedTypes, onTypeChange, showAllTypes, setShowAllTypes, 'Тип')}
            </div>
            <div className="filter-item">
                {renderItems(flavors, selectedFlavors, onFlavorChange, showAllFlavors, setShowAllFlavors, flavors.length > 0 && 'Смак')}
            </div>
            <div className="filter-item">
                {renderItems(sorts, selectedSorts, onSortChange, showAllSorts, setShowAllSorts, sorts.length > 0 && 'Сорт')}
            </div>
            <div className="filter-item">
                {renderItems(firms, selectedFirms, onFirmChange, showAllFirms, setShowAllFirms, 'Фірма')}
            </div>
        </div>
    );
};

const ProductGroupList = () => {
    const {category, subcategory} = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialSearchTerm = searchParams.get('search') || '';
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [types, setTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);

    const [firms, setFirms] = useState([]);
    const [selectedFirms, setSelectedFirms] = useState([]);

    const [flavors, setFlavors] = useState([]);
    const [selectedFlavors, setSelectedFlavors] = useState([]);

    const [sorts, setSorts] = useState([]);
    const [selectedSorts, setSelectedSorts] = useState([]);

    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [sortOrder, setSortOrder] = useState(null); // State to handle sorting order

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/categories/${category}/${subcategory}`);
                setProducts(response.data);
                setFilteredProducts(response.data);
                const productTypes = [...new Set(response.data.map(product => product.type))];
                const productFirms = [...new Set(response.data.map(product => product.firm))].filter(firm => firm !== "Без фірми");
                const productFlavors = [...new Set(response.data.map(product => product.flavor))].filter(flavor => flavor !== "Без вкуса");
                const productSorts = [...new Set(response.data.map(product => product.sort))].filter(sort => sort !== "Без сорта");
                setTypes(productTypes);
                setFirms(productFirms);
                setFlavors(productFlavors);
                setSorts(productSorts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [category, subcategory]);

    useEffect(() => {
        filterProducts(selectedTypes, selectedFirms, selectedFlavors, selectedSorts, searchTerm);
    }, [selectedTypes, selectedFirms, selectedFlavors, selectedSorts, searchTerm, products]);

    useEffect(() => {
        sortProducts(sortOrder);
    }, [sortOrder]);

    const handleTypeChange = (type) => {
        const updatedSelectedTypes = selectedTypes.includes(type)
            ? selectedTypes.filter(t => t !== type)
            : [...selectedTypes, type];
        setSelectedTypes(updatedSelectedTypes);
    };

    const handleFirmChange = (firm) => {
        const updatedSelectedFirms = selectedFirms.includes(firm)
            ? selectedFirms.filter(f => f !== firm)
            : [...selectedFirms, firm];
        setSelectedFirms(updatedSelectedFirms);
    };

    const handleFlavorChange = (flavor) => {
        const updatedSelectedFlavors = selectedFlavors.includes(flavor)
            ? selectedFlavors.filter(f => f !== flavor)
            : [...selectedFlavors, flavor];
        setSelectedFlavors(updatedSelectedFlavors);
    };

    const handleSortChange = (sort) => {
        const updatedSelectedSorts = selectedSorts.includes(sort)
            ? selectedSorts.filter(f => f !== sort)
            : [...selectedSorts, sort];
        setSelectedSorts(updatedSelectedSorts);
    };

    const filterProducts = (selectedTypes, selectedFirms, selectedFlavors, selectedSorts, searchTerm) => {
        let filtered = products;

        if (selectedTypes.length > 0) {
            filtered = filtered.filter(product => selectedTypes.includes(product.type));
        }

        if (selectedFirms.length > 0) {
            filtered = filtered.filter(product => selectedFirms.includes(product.firm));
        }

        if (selectedFlavors.length > 0) {
            filtered = filtered.filter(product => selectedFlavors.includes(product.flavor));
        }

        if (selectedSorts.length > 0) {
            filtered = filtered.filter(product => selectedSorts.includes(product.sort));
        }

        if (searchTerm) {
            filtered = filtered.filter(product =>
                (product.type + ' ' + (product.firm !== "Без фірми" ? product.firm : '') + ' ' + (product.flavor !== "Без вкуса" ? product.flavor : '') + (product.sort !== "Без сорта" ? product.sort : '') + ` ${product.weight}г`)
                    .toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    };

    const sortProducts = (sortOrder) => {
        let sortedProducts = [...filteredProducts];

        if (sortOrder === 'asc') {
            sortedProducts.sort((a, b) => parseFloat(a.OtherInfo[0].productPrice) - parseFloat(b.OtherInfo[0].productPrice));
        } else if (sortOrder === 'desc') {
            sortedProducts.sort((a, b) => parseFloat(b.OtherInfo[0].productPrice) - parseFloat(a.OtherInfo[0].productPrice));
        } else {
            sortedProducts = products; // Reset to initial products
        }

        setFilteredProducts(sortedProducts);
    };

    const getMinMaxPrice = (otherInfo) => {
        const prices = otherInfo.map(info => parseFloat(info.productPrice));
        const minPrice = Math.min(...prices).toFixed(2);
        const maxPrice = Math.max(...prices).toFixed(2);
        return `${minPrice} - ${maxPrice} грн`;
    };

    return (
        <div className="productsGroupList-grid">

            <div className="productsGroupList-sort">
                <h1 className="productsGroupList-h1">{subcategory}</h1>

                <div className="sort-wrap">
                    <h2>Сортування</h2>
                    <button onClick={() => setSortOrder(null)}>За замовчуванням ▼</button>
                    <button onClick={() => setSortOrder('asc')}>Від дешевих ▼</button>
                    <button onClick={() => setSortOrder('desc')}>Від дорогих ▼</button>
                </div>

            </div>

            <div className="productsGroupList-filter">
                <ProductFilter
                    types={types}
                    selectedTypes={selectedTypes}
                    onTypeChange={handleTypeChange}
                    firms={firms}
                    selectedFirms={selectedFirms}
                    onFirmChange={handleFirmChange}
                    flavors={flavors}
                    selectedFlavors={selectedFlavors}
                    onFlavorChange={handleFlavorChange}

                    sorts={sorts}
                    selectedSorts={selectedSorts}
                    onSortChange={handleSortChange}

                    totalProducts={filteredProducts.length}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
            </div>

            <div className="products-grid">
                {filteredProducts.map(product => (
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
                            <Link to={`/categories/${category}/${subcategory}/${product._id}`}
                                  className="product-button">
                                Порівняти ціни
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductGroupList;
