import React, { createContext, useState } from 'react'
import Menu from '../Components/Menu/Menu';
export const MenuContext = createContext(null);
const getDefaultCart = () =>{
    let cart = {}
    for(let i=1; i < Menu.length +1;i++){
        cart[i]=0;
    }
    return cart;

};
export const MenuContextProvider = (props) => {
    const [cartItems,setCartItems] = useState(getDefaultCart());
    const [cartCounts, setCartCounts] = useState(0);
    const [showCarts, setShowCarts] = useState(false);
    // const addToCart = (itemId) => {
    //     setCartItems((prev) => ({...prev, [itemId]: prev[itemId] + 1}))
// ``};

const addToCart = (itemId) => {
  setCartItems((prev) => ({
    ...prev,
    [itemId]: Math.max(0, prev[itemId] || 0) + 1,
  }));
};
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({...prev, [itemId]: prev[itemId] - 1}))
    };
    // const Count = (itemId) => {
    //     setCartItems((prev) => ({...prev, [itemId]: (prev[itemId] || 0) + 1}))
    // };
    const handleAddToCart = (itemId) => {
        setCartCounts((prevCounts) => ({ ...prevCounts, [itemId]: 1 }));
        setShowCarts((prevShowCarts) => ({ ...prevShowCarts, [itemId]: true }));
      };
      
      const handleIncrement = (itemId) => {
        setCartCounts((prevCounts) => ({ ...prevCounts, [itemId]: (prevCounts[itemId] || 0) + 1 }));
      };
      
      const handleDecrement = (itemId) => {
        setCartCounts((prevCounts) => ({ ...prevCounts, [itemId]: Math.max(0, (prevCounts[itemId] || 0) - 1) }));
        setShowCarts((prevShowCarts) => ({ ...prevShowCarts, [itemId]: cartCounts[itemId] > 1 }));
      };
    
    const contextValue = {cartItems,addToCart,removeFromCart,handleDecrement,handleIncrement,handleAddToCart};
      console.log("cartItems:",cartItems)
    return (<MenuContext.Provider value={contextValue} >{props.children}</MenuContext.Provider>)
  
};



