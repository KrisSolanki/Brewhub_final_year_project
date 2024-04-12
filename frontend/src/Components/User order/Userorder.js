import React from 'react'
import axios from 'axios'
import { useState , useEffect } from 'react'


const Userorder = () => {
  const [data ,SetData ] = useState([]);

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
            SetData(response.data);
        } catch (error) {
            console.error('Error', error);
        }
    };
    fetchData();
}, []);
  console.log("Data",data);
    return (
    <div>
      <h1>Your Orders</h1>

    </div>
  )
}

export default Userorder
