import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const ProductDetail = () => {
    const { category, subcategory, productId } = useParams();
    const [product, setProduct] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/categories/${category}/${subcategory}/${productId}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        const fetchHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/history/${productId}`);
                setHistory(response.data);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };

        fetchProduct();
        fetchHistory();
    }, [category, subcategory, productId]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const getMinMaxPrice = (otherInfo) => {
        const prices = otherInfo.map(info => parseFloat(info.productPrice));
        const minPrice = Math.min(...prices).toFixed(2);
        const maxPrice = Math.max(...prices).toFixed(2);
        return `${minPrice} - ${maxPrice} грн`;
    };

    const formatHistoryData = () => {
        const stores = [...new Set(history.map(record => record.storeName))];
        const dates = [...new Set(history.map(record => new Date(record.date).toLocaleDateString()))];

        const datasets = stores.map(store => {
            return {
                label: store,
                data: dates.map(date => {
                    const record = history.find(r => new Date(r.date).toLocaleDateString() === date && r.storeName === store);
                    return record ? record.price : null;
                }),
                borderColor: getRandomColor(),
                fill: false,
            };
        });

        return {
            labels: dates,
            datasets: datasets,
        };
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <div className="ProductDetail-container">
            <h1 className="ProductDetail-h1">
                {product.type}
                {product.firm !== "Без фірми" && ` ${product.firm}`}
                {product.flavor !== "Без вкуса" && ` ${product.flavor}`}
                {product.sort !== "Без сорта" && ` ${product.sort}`}
                {` ${product.weight}г`}
            </h1>

            <div className="ProductDetail-info_wrapper">
                <img src={product.OtherInfo[0].productImg}
                     alt={`${product.type} image`}
                     className="ProductDetail-wrapper_img"
                />
                <div className="ProductDetail-info">
                    <h3>Всього пропозицій:</h3>
                    <h3>Ціни: <span>{getMinMaxPrice(product.OtherInfo)}</span></h3>
                    <h3>Характеристики:</h3>

                    <p>Тип: {product.type}</p>
                    {product.firm !== "Без фірми" && <p>Фірма: {product.firm}</p>}
                    {product.flavor !== "Без вкуса" && <p>Смак: {product.flavor}</p>}
                    {product.sort !== "Без сорта" && <p>Сорт: {product.sort}</p>}
                    <p>Вага: {product.weight}г</p>
                </div>
            </div>

            <div className="ProductDetail-price_wrapper">
                <div className="ProductDetail-price_title">
                    <h2>Магазини</h2>
                    <h2>Ціни </h2>
                    <h2>Придбати</h2>
                </div>
                <ul>
                    {product.OtherInfo.map((info, index) => (
                        <li key={index}>
                            <div className="ProductDetail-store_wrap">
                                <div className="ProductDetail-store_name">
                                    {info.storeName}
                                </div>
                                <div className="ProductDetail-store_price">
                                    {info.productPrice} грн
                                </div>
                                <div className="ProductDetail-store_link">
                                    {info.productLink &&
                                        <a className="ProductDetail-store_button" href={info.productLink} target="_blank"
                                           rel="noopener noreferrer"> До магазину</a>}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="history-graph_wrapper">
                {history.length > 0 && (
                    <div className="ProductDetail-history">
                        <h2>Історія цін:</h2>
                        <Line data={formatHistoryData()} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
