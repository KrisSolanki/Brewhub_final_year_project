import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import './Cart.css';

const CartList = () => {
  const [data, setData] = useState([])


//  useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:8000/api/carts/");
//       // setData(response.data)
//       // setCartItems(response.data.cart_items);
//       //   setTotal(response.data.cart.Total);
//       const responseData = response.data;

//       if (responseData && responseData.cart_items && responseData.cart ) {
//         setCartItems(responseData.cart_items);
//         // setTotal(responseData.cart.Total);
//       } else {
//         console.error('Invalid data structure:', responseData);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };
//   fetchData();
// }, []);
// console.log("data:",data);
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/cart/");
      setData(response.data)
      console.log('Response data:',data); // Log the response data
      // const response2 = await axios.get("http://127.0.0.1:8000/api/cart-details/");
      // console.log('Response data2:', response2.data);
     
    } catch (error) {
      console.error('Error:', error);
    }
  };
  fetchData();
}, []);


// const handleIncrement = (itemId) => {
//   setCartItems(prevItems => {
//     return prevItems.map(item => {
//       if (item.Item_ID === itemId) {
//         return { ...item, ItemQuantity: item.ItemQuantity + 1 };
//       }
//       return item;
//     });
//   });
// };

// const handleDecrement = (itemId) => {
//   setCartItems(prevItems => {
//     return prevItems.map(item => {
//       if (item.Item_ID === itemId) {
//         return { ...item, ItemQuantity: Math.max(0, item.ItemQuantity - 1) };
//       }
//       return item;
//     });
//   });
// };

// const handleRemoveFromCart = (itemId) => {
//   setCartItems(prevItems => prevItems.filter(item => item.Item_ID !== itemId));
// };



//  const handleAddToCart = (itemId) => {
//     setCartItems(prevItems => ({
//       ...prevItems,
//       [itemId]: (prevItems[itemId] || 0) + 1,
//     }));
//  };

//  const handleIncrement = (itemId) => {
//     setCartItems(prevItems => ({
//       ...prevItems,
//       [itemId]: (prevItems[itemId] || 0) + 1,
//     }));
//  };

//  const handleDecrement = (itemId) => {
//     setCartItems(prevItems => ({
//       ...prevItems,
//       [itemId]: Math.max(0, (prevItems[itemId] || 0) - 1),
//     }));
//  };

//  const handleRemoveFromCart = (itemId) => {
//     setCartItems(prevItems => {
//       const newItems = { ...prevItems };
//       delete newItems[itemId];
//       return newItems;
//     });
//  };

// const handleIncrement = (itemId) => {
//   setCartItems((prevItems) => {
//     return prevItems.map((item) => {
//       if (item.CartID === itemId) {
//         return { ...item, ItemQuantity: item.ItemQuantity + 1 };
//       }
//       return item;
//     });
//   });
// };

// const handleDecrement = (itemId) => {
//   setCartItems((prevItems) => {
//     return prevItems.map((item) => {
//       if (item.CartID === itemId) {
//         return { ...item, ItemQuantity: Math.max(0, item.ItemQuantity - 1) };
//       }
//       return item;
//     });
//   });
// };

// const handleRemoveFromCart = (itemId) => {
//   setCartItems((prevItems) => prevItems.filter((item) => item.CartID !== itemId));
// };

return (
    // <div className="cart-page">
    //   <h1>Your Cart</h1>
    //   {/* {Object.entries(cartItems).map(([itemId, quantity]) => ( */}
    //     // <div  className="cart-item">
    //       <div className="item-details">
    //         <p>Item ID:</p>
    //         <p>Quantity: </p>
    //       </div>
    //       <div className="cart-controls">
    //         <button onClick={() => handleDecrement()}>-</button>
    //         <button onClick={() => handleIncrement()}>+</button>
    //         <button onClick={() => handleRemoveFromCart()}>Remove</button>
    //       </div>
    //     </div>
    //   {/* ))} */}
    // </div>
//---------------------------------------------------------------------------
    // <div className="cart-page">
    //   <h1>Your Cart</h1>
    //   {cartItems.map(item => (
    //     <div key={item.Item_ID} className="cart-item">
    //       <div className="item-details">
    //         <p>Item ID: {item.Item_ID}</p>
    //         <p>Quantity: {item.ItemQuantity}</p>
    //       </div>
    //       <div className="cart-controls">
    //         <button onClick={() => handleDecrement(item.Item_ID)}>-</button>
    //         <button onClick={() => handleIncrement(item.Item_ID)}>+</button>
    //         <button onClick={() => handleRemoveFromCart(item.Item_ID)}>Remove</button>
    //       </div>
    //     </div>
    //   ))}
    //   <p>Total: 
    //     </p>
    //     {/* {cartItems.cart.Total} */}
    // </div>
    <div className="cart-page">
      <h1>Your Cart</h1>
      {data.map((item) => (
        <div key={item.CartID} className="cart-item">
          <div className="item-details">
            <p>Item ID: {item.CartID}</p>
            <p>Quantity: {item.ItemQuantity}</p>
          </div>
          <div className="cart-controls">
            <button onClick={() => handleDecrement(item.CartID)}>-</button>
            <button onClick={() => handleIncrement(item.CartID)}>+</button>
            <button onClick={() => handleRemoveFromCart(item.CartID)}>Remove</button>
          </div>
          <p>SubTotal: {item.Subtotal}</p>
          <p>Total: {item.Total}</p>
        </div>
      ))}
    </div>
 );
};

export default CartList;
