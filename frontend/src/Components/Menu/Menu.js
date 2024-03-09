import React, { useState } from 'react';
import './Menu.css';
// import { NavLink } from 'react-router-dom';
const Menu = () => {
 const [cartCount, setCartCount] = useState(0);
 const [showCart, setShowCart] = useState(false);

 const handleAddToCart = () => {
    setCartCount(1);
    setShowCart(true);
 };

 const handleIncrement = () => {
    setCartCount(prevCount => prevCount + 1);
 };

 const handleDecrement = () => {
    setCartCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
    if (cartCount === 1) {
      setShowCart(false);
    }
 };



 return (
<>
<div className="">
    

    <div className="menu-item">
      {/* <img src={item.image} alt={item.name} className="menu-item-image" /> */}
      <div className="menu-item-details">
        <h2>Pizza</h2>
        <p>test desc</p>
        <p>Price: 399</p>
      {showCart ? (
        <div className="cart-controls">
          <button onClick={handleDecrement}>-</button>
          <span>{cartCount}</span>
          <button onClick={handleIncrement}>+</button>
        </div>
      ) : (
        <button onClick={handleAddToCart}>Add to Cart</button>
        )}
      
      </div>
    </div>
        
</div>
</>  
 );
};

export default Menu;
