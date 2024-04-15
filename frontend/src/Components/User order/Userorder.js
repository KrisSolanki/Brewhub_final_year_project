import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import './Userorder.css'
import { NavLink } from 'react-router-dom';

const Userorder = () => {
  const [data, SetData] = useState({ orders: [], order_details: [] });
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('authTokens'); // Corrected variable name
        const { access } = JSON.parse(accessToken);
        console.log("access:", access);
        const response = await axios.get("http://127.0.0.1:8000/api/order/", {
          headers: { // Corrected the position of the headers object
            Authorization: `Bearer ${access}`, // Corrected spelling of Authorization
            'Content-Type': 'application/json',
          },
        });
        console.log("Response data:", response.data)
        SetData(response.data);
      } catch (error) {
        console.error('Error', error);
      }
    };
    fetchData();
  }, []);
  console.log("Data", data);
  console.log("OData", data.order_details);
  console.log("aaaa",data.order_details[0])
  // console.log("aaaa",data.order_details[0].Item_ID.ItemName)
  // console.log("aaaa",data.order_details[0].Item_ID.cafe.CafeName)

  return (

    <div>
    <h1>Your Orders</h1>
    {data.orders && data.orders.map((order) => (
      <div key={order.OrderID} className="container_order">
        <div className="orderidcontainer-M">
        <p className='order_id-M'>Order ID: {order.OrderID}</p>
        </div>
        <div className="orderidcontainer">
        <p className='order_id' >Order Date: {new Date(order.OrderDate).toLocaleString()}</p>
        </div>
        <div className="orderidcontainer">
        <p className='order_id' >Order Total: {order.Total}</p>
        </div>
        <div className="orderidcontainer">
        <p className='order_id-V' ><NavLink to={`/Orderlistdetails/${order.OrderID}/`}>View order details</NavLink></p>
        </div>
        {/* {data.order_details.map((detail) => (
          detail.Order_ID === order.OrderID && (
            <div key={detail.OrderDetailsID} className="orderidcontainer">
              <p className='order_id' >Item Name: {detail.Item_ID.ItemName}</p>
            
            <div className="orderidcontainer">

              <p className='order_id'>Item Quantity: {detail.ItemQuantity}</p>
            </div>
            
            
              {detail.Item_ID.cafe && (
               <>
               <div className="orderidcontainerCafe">

                  <p className='order_id'>
                    <img src={detail.Item_ID.cafe.LogoImage} alt={detail.Item_ID.cafe.CafeName} />
                    </p>
                  <p className='order_id'>Cafe Name: {detail.Item_ID.cafe.CafeName}</p>
               </div>
               </>
              )}
            </div>
          )
        ))} */}
      </div>
    ))}
  </div>

   
  );
};

export default Userorder
