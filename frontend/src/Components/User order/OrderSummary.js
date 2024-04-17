import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './OrderSummary.css';

const OrderSummary = () => {
    const [data, setData] = useState([]);
    const { PaymentID } = useParams();
    console.log("PaymentID", PaymentID);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('authTokens');
                const { access } = JSON.parse(accessToken);
                const response = await axios.get(`http://127.0.0.1:8000/api/complete/${PaymentID}`, {
                    headers: {
                        Authorization: `Bearer ${access}`,
                        'Content-Type': 'application/json',
                    },
                });
                setData(response.data);
            } catch (error) {
                console.error('Error', error);
            }
        };
        fetchData();
    }, [PaymentID]);

    console.log("Data", data);

    // Assuming data contains an OrderID property
    const order = data.OrderID;
    console.log("DataOrder", order);

    const [orderData, setOrderData] = useState({ orders: [], order_details: [] });

    useEffect(() => {
        const fetchOrderData = async () => {
            if (!order) return; // Ensure order is defined before making the request
            try {
                const accessToken = localStorage.getItem('authTokens');
                const { access } = JSON.parse(accessToken);
                const response = await axios.get(`http://127.0.0.1:8000/api/order/${order}`, {
                    headers: {
                        Authorization: `Bearer ${access}`,
                        'Content-Type': 'application/json',
                    },
                });
                setOrderData(response.data);
            } catch (error) {
                console.error('Error', error);
            }
        };
        fetchOrderData();
    }, [order]); // Added order as a dependency

    console.log("Order Data", orderData);
    console.log("Order Data", orderData.order_details);
    // console.log("Order Data", orderData.order_details[0].Item_ID);
    // console.log("Order Data", orderData.order_details[0].Item_ID.cafe);
    // console.log("Order Data", orderData.order_details[0].Item_ID.cafe.CafeName);
    const firstOrderDetail = orderData.order_details && orderData.order_details[0];
    const cafeInfo = firstOrderDetail ? {
        logoImage: firstOrderDetail.Item_ID.cafe.LogoImage,
        cafeName: firstOrderDetail.Item_ID.cafe.CafeName
    } : null;

    return (
        <div>
            <h1>Order Summary</h1>
            {/* <div className="main"> */}

            {cafeInfo && (
                <div className="container_orderC">
                    <div className="orderidcontainerCafeimg">
                        <img className='orderdcafeimg' src={`http://127.0.0.1:8000/api${cafeInfo.logoImage}`} alt={cafeInfo.cafeName} />
                        <h2 className='order_id'>{cafeInfo.cafeName}</h2>
                    </div>
                </div>
            )}
            <div className="maincon">

                <div className="FullCa">
                    <p className='Title'>ITEMS</p>
                    {orderData.order_details && orderData.order_details.map((detail) => (
                        <div key={detail.OrderDetailsID} className="container_orderD">
                            <div className="orderidcontainerItemimg">
                                {/* <div className="dummyC"> */}

                                <img className='orderditemimg' src={`http://127.0.0.1:8000/api${detail.Item_ID.ItemImage}`} alt={detail.Item_ID.cafe.CafeName} />
                                <div className="c">
                                    <p className='order_item_name_q'>{detail.Item_ID.ItemName}</p>
                                    <p className='order_item_name_q'>Price: {detail.Item_ID.ItemPrice}</p>
                                    <p className='order_item_name_q'>Item Quantity: {detail.ItemQuantity}</p>
                                </div>
                            </div>
                            {/* </div> */}
                        </div>

                    ))}
                </div>
            <div className="total">
                <div className="totalsummary">
                    <h2>Total</h2>
                </div>
                <div className="ids">
                    <div className="x">
                    {/* <h3>Order Id : {orderData.order.OrderID}</h3> */}
                    <h3>Order Id : {data.OrderID}</h3>
                    </div>
                    <div className="x">
                    <h3>Payment Id : {data.PaymentID}</h3>
                    </div>
                    <div className="x">
                    <h3>Payment time : {data.PaymentTime}</h3>
                    </div>
                </div>
                <div className="jjk">
                <div className="subtotal">
                <h3>SubTotal : intotaladd{orderData.order_details.Subtotal}</h3>
                {/* <h3>500</h3> */}
                </div>
                <div className="Maintotal">
                <h3>Total : {orderData.order.Total}</h3>
                {/* <h3>500</h3> */}
                </div>

                </div>
            </div>
            </div>
            {/* {orderData.order_details && orderData.order_details.map((detail) => (
                    <div key={detail.OrderDetailsID} className="div2">
                        <h4>total</h4>

                    </div>
                     ))} */}
        </div>
        //  </div>

    );
}

export default OrderSummary;
