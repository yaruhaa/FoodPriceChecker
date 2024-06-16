import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import snacksImage from '../Images/snacks.png';

const SubcategoryList = () => {
    const { category } = useParams();
    const [subcategories, setSubcategories] = useState([]);

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/categories/${category}`);
                setSubcategories(response.data);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            }
        };
        fetchSubcategories();
    }, [category]);

    // Маппинг для соответствия подкатегорий и URL изображений
    const getSubcategoryImage = (subcategoryName) => {
        switch (subcategoryName) {
            case 'Фрукти та ягоди':
                return 'https://rost.kh.ua/photo/cache/48711/48806/cat/48806-228x206.jpg';
            case 'Овочі':
                return 'https://rost.kh.ua/photo/cache/48711/48804/cat/48804-228x206.jpg';
            case 'Зелень':
                return 'https://rost.kh.ua/photo/cache/48711/48803/cat/48803-228x206.jpg';
            case 'Гриби':
                return 'https://rost.kh.ua/photo/cache/48711/48802/cat/48802-228x206.jpg';
            case 'Соління та салати':
                return 'https://rost.kh.ua/photo/cache/197313/197314/cat/197314-228x206.jpg';
            case 'Горіхи, сухофрукти та насіння':
                return 'https://rost.kh.ua/photo/cache/48711/48805/cat/48805-228x206.jpg';
            case 'Чіпси, сухарики, снеки':
                return snacksImage; // Использование импортированного изображения
            default:
                return 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Color_icon_blue.svg/1024px-Color_icon_blue.svg.png';
        }
    };

    return (
        <div className="SubcategoryList-grid">
            <h1 className="SubcategoryList-h1">{category}</h1>

            {subcategories.map(subcategory => (
                <Link
                    key={subcategory}
                    to={`/categories/${category}/${subcategory}`}
                    className="SubcategoryList-card_link"
                    style={{ textDecoration: 'none' }}
                >
                    <div className="SubcategoryList-card">
                        <img
                            src={getSubcategoryImage(subcategory)}
                            alt={subcategory}
                            style={{ width: '100%', height: 'auto' }}
                        />
                        <div className="SubcategoryList-card_title">
                            {subcategory}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default SubcategoryList;
