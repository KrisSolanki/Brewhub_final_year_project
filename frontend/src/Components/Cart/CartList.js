import React from 'react'
// import { useState , useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
import "../Cart/Cart.css"


const CartList = ({data}) => {
  // const [data, setData] = useState({ cart: {}, cart_items: []})
  // // const [dataM, setDataM] = useState([])
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const accessToken = localStorage.getItem('authTokens');
  //       const { access } = JSON.parse(accessToken);
  //       console.log('Access Token:', access);
  
  //       const response = await axios.get("http://127.0.0.1:8000/api/cart/", {
  //         headers: {
  //           Authorization: `Bearer ${access}`,
  //           'Content-Type': 'application/json', 
  //         },
  //       });
        
  //       setData(response.data);
  
  //       // Additional code if needed...
  
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   };
  
  //   fetchData();
  // }, []);
  const cart = data.cart;
  // console.log("data:",data);
  // // console.log("data2:",dataM);
  return (
    
    <div className="cart">
      <div>
        <h1>Your Cart Items</h1>
        {data.cart_items.map((cart) => (
          <div key={cart.CartID}>
            {/* <p>Item ID: {item.Item_ID}</p> */}
            {/* <p>Item Name: {data.ItemName}</p> */}
            {/* <p>Item Name: {item.ItemName}</p> */}
            <p>Quantity: {cart.ItemQuantity}</p>
            <p>Subtotal: {cart.Subtotal}</p>
          </div>
        ))}
      </div>
      <div className="cart">
      
      <p>cart</p>    

        
        <p>Total: {cart.Total}</p>

      </div>

      {/* {totalAmount > 0 ? ( */}

        <div className="checkout">

        
        
          {/* <button  */}
          {/* // onClick={() => navigate("/")} */}
          {/* // > Continue Shopping </button> */}
           <button
            // onClick={() => {
            //   checkout();
            //   navigate("/");
            // }}
          >
            {/* {" "} */}
            Checkout
            {/* {" "} */}
          </button>
        </div>
      {/* ) : ( */}
        <h1> Your Cart is Empty</h1>
      {/* )} */}
    </div>
  )
}

export default CartList
