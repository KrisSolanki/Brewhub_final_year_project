import React from 'react'
import CartList from '../Components/Cart/CartList'

import { useState , useEffect } from 'react';
import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import "../Cart/Cart.css"

const Cart = () => {
    const [data, setData] = useState({ cart: {}, cart_items: []})
  // const [dataM, setDataM] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('authTokens');
        const { access } = JSON.parse(accessToken);
        console.log('Access Token:', access);
  
        const response = await axios.get("http://127.0.0.1:8000/api/cart/", {
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json', 
          },
        });
        // const deliveryCafes = response.data.filter(cart => cart.CartID === cart.cart_items.Cart_ID);
        // setData(deliveryCafes);
        setData(response.data);
  
        // Additional code if needed...
  
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchData();
  }, []);
//   const cart = data.cart;
  console.log("data:",data);

  
  // console.log("data2:",dataM);
  return (
    <div style={{ background: 'burlywood' }}> 
      <CartList data={data} />
    </div>
  )
}

export default Cart
