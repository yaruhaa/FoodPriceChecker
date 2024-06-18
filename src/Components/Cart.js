// src/components/Cart.js
import React, { useState } from 'react';
import { useCart } from '../Contexts/CartContext';
import cartIcon from '../Images/074checklist_101554.svg';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Cart = () => {
    const { cartItems, removeFromCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    const downloadPDF = () => {
        const input = document.getElementById('cart-list');
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10);
            pdf.save('shopping_list.pdf');
        });
    };

    return (
        <div className="cart-container">
            <div className="cart-icon" onClick={toggleCart}>
                <img src={cartIcon} alt="Cart" />
            </div>
            {isOpen && (
                <div className="cart">
                    <h2>Список</h2>
                    {cartItems.length === 0 ? (
                        <p>Список поки що порожній</p>
                    ) : (
                        <div id="cart-list">
                            <ul>
                                {cartItems.map((item, index) => (
                                    <li key={index}>
                                        <div>
                                            <div>{item.productName}</div>
                                            <div>{item.storeName} - {item.productPrice} грн</div>
                                        </div>
                                        <button onClick={() => removeFromCart(index)}>×</button>
                                    </li>
                                ))}
                            </ul>
                            <button className="Cart-download" onClick={downloadPDF}>Завантажити список</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Cart;
