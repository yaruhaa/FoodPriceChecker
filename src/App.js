import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { CartProvider } from './Contexts/CartContext'; // Импортируем CartProvider
import Cart from './Components/Cart';

import CategoryList from './Components/CategoryList';
import SubcategoryList from './Components/SubcategoryList';
import ProductGroupList from './Components/ProductGroupList';
import ProductDetail from './Components/ProductDetail';
import Header from './Components/Header';
import SearchResults from './Components/SearchResults';
import './Styles/style.css';
import './Styles/CategoryList.css';
import './Styles/SubcategoryList.css';
import './Styles/ProductGroupList.css';
import './Styles/ProductDetail.css';
import './Styles/Header.css';
import './Styles/SearchResults.css';

const App = () => {
    return (
        <CartProvider> {/* Оборачиваем все компоненты в CartProvider */}
            <Router>
                <div>
                    <Header />
                    <Cart />

                    <Routes>
                        <Route path="/" element={<CategoryList />} />
                        <Route path="/categories/:category" element={<SubcategoryList />} />
                        <Route path="/categories/:category/:subcategory" element={<ProductGroupList />} />
                        <Route path="/categories/:category/:subcategory/:productId" element={<ProductDetail />} />
                        <Route path="/search" element={<SearchResults />} />

                    </Routes>
                </div>
            </Router>
        </CartProvider>
    );
};

export default App;
