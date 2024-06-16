import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const getCategoryImage = (categoryName) => {
        switch (categoryName) {
            case 'Бакалії':
                return 'https://rost.kh.ua/photo/cache/48614/48701/cat/48701-228x206.jpg';
            case 'Овочі та фрукти':
                return 'https://rost.kh.ua/photo/cache/48614/48711/cat/48711-228x206.jpg';
            default:
                return 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Color_icon_blue.svg/1024px-Color_icon_blue.svg.png';
        }
    };

    return (
        <div className="CategoryList-grid">
            <h1 className="CategoryList-h1">Категорії</h1>

            {categories.map(category => (
                <Link
                    key={category}
                    to={`/categories/${category}`}
                    className="CategoryList-card_link"
                    style={{ textDecoration: 'none' }}
                >
                    <div className="CategoryList-card">
                        <img
                            src={getCategoryImage(category)}
                            alt={category}
                            style={{ width: '100%', height: 'auto' }}
                        />
                        <h3 className="CategoryList-card_title">
                            {category}
                        </h3>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default CategoryList;
