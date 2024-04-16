import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useParams } from 'react-router-dom';
import './Orderlistdetails.css';

const Orderlistdetails = () => {
    const [data, setData] = useState({ orders: [], order_details: [] });
    const { OrderID } = useParams(); 
    console.log("orderid", OrderID)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('authTokens');
                const { access } = JSON.parse(accessToken);
                const response = await axios.get(`http://127.0.0.1:8000/api/order/${OrderID}/`, {
                    headers: {
                        Authorization: `Bearer ${access}`,
                        'Content-Type': 'application/json',
                    },
                });
                setData(response.data); // Corrected the state setter function name
            } catch (error) {
                console.error('Error', error);
            }
        };
        fetchData();
    }, [OrderID]); // Added orderId as a dependency

    console.log("Data", data);
    //  console.log("OData", data.order_details);
    console.log("Order_D", data.order_details[0]);

    const firstOrderDetail = data.order_details && data.order_details[0];
    const cafeInfo = firstOrderDetail ? {
        logoImage: firstOrderDetail.Item_ID.cafe.LogoImage,
        cafeName: firstOrderDetail.Item_ID.cafe.CafeName
    } : null;

    return (
        <div>
            <h1>Your Orders</h1>
                    <div className="orderidcontainer-M">
                        <p className='order_id-M'>Order ID:{OrderID}</p>
                    </div>
                    {cafeInfo && (
                        <div className="container_orderC">

                <div className="orderidcontainerCafeimg">
                    <img className='orderdcafeimg' src={`http://127.0.0.1:8000/api${cafeInfo.logoImage}`} alt={cafeInfo.cafeName} />
                    <p className='order_id'>{cafeInfo.cafeName}</p>
                </div>
                        </div>
            )}
            <div className="FullC">

            {data.order_details && data.order_details.map((detail) => (
                <div key={detail.OrderDetailsID} className="container_orderD">
                    <div className="orderidcontainerItemimg">
                        <img className='orderditemimg' src={`http://127.0.0.1:8000/api${detail.Item_ID.ItemImage}`} alt={detail.Item_ID.cafe.CafeName} />
                        <div className="c">
                            <p className='order_item_name_q'>{detail.Item_ID.ItemName}</p>
                            <p className='order_item_name_q'>Price: {detail.Item_ID.ItemPrice}</p>
                            <p className='order_item_name_q'>Item Quantity: {detail.ItemQuantity}</p>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
};

export default Orderlistdetails;
