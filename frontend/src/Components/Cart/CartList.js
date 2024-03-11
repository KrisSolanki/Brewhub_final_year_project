import React from 'react'
import { useState , useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../Cart/Cart.css"


const CartList = () => {
  const [data2, setData] = useState({ cart: {}, cart_items: []})
  // const [dataM, setDataM] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/cart/");
        setData(response.data)
        // const responseM = await axios.get("http://127.0.0.1:8000/api/menulist/");
        // setDataM(responseM.data.filter(menuitem => menuitem.ItemID === data.cart_items.Item_ID))
        // const deliveryCafes = response.data.filter(cafe => cafe.Take_away === true);


      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);
  console.log("data:",data2);
  // console.log("data2:",dataM);
  return (
    // <div>
    //   <h1>Your Cart</h1>
    //   <div>
    //     <h2>Cart Details</h2>
    //     {/* <p>Cart ID: {data.cart.CartID}</p> */}
    //     {/* <p>User ID: {data.cart.User_ID}</p> */}
    //     <p>Total: {data.cart.Total}</p>
    //     <p>Subtotal: {data.cart.Subtotal}</p>
    //   </div>

    //   <div>
    //     <h2>Cart Items</h2>
    //     {data.cart_items.map((item) => (
    //       <div key={item.CartDetailsID}>
    //         <p>Item ID: {item.Item_ID}</p>
    //         {/* <p>Item Name: {item.ItemName}</p> */}
    //         <p>Quantity: {item.ItemQuantity}</p>
    //         <p>Subtotal: {item.Subtotal}</p>
    //       </div>
    //     ))}
    //   </div>

    //   {/* <p>{data.message}</p> */}
    // </div>
    <div className="cart">
      <div>
        <h1>Your Cart Items</h1>
        {data2.cart_items.map((item) => (
          <div key={item.CartDetailsID}>
            {/* <p>Item ID: {item.Item_ID}</p> */}
            {/* <p>Item Name: {data.ItemName}</p> */}
            {/* <p>Item Name: {item.ItemName}</p> */}
            <p>Quantity: {item.ItemQuantity}</p>
            <p>Subtotal: {item.Subtotal}</p>
          </div>
        ))}
      </div>
      <div className="cart">
        
      <p>cart</p>    
      </div>

      {/* {totalAmount > 0 ? ( */}
        <div className="checkout">
          <p> Subtotal:  </p>
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
