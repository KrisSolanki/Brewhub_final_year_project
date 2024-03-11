import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import CartList from '../Components/Cart/CartList'
const Cart = () => {
    // const [amount , setAmount] = useState(500)
    
    const razorpayPayment = () => {
        const reviewData = {
            "Review": "Great service!",
            "Rating": 5,
            "Status_ID": 1,
            "User_ID": 73
            // Add other required fields here
        };
        
        axios.post('http://127.0.0.1:8000/api/order/',reviewData)
            // "amount" : amount,
            // "currency":"INR"
        .then(function(response){
            console.log(response)
        })
        .catch(function(error){
            console.log(error)
        });
    }
    // useEffect(()=>{
    //     setProgress(30);
    //     setTimeout(()=>{
    //      setProgress(100);
    //     },0);
    //   }, [setProgress])
    
    return (
    <>
    <div className='container_bn'>
        {/* <div className="btn">
            <button type='button' onClick={razorpayPayment}>click</button>
            <CartList/>
        </div> */}
        <CartList/>
      
    </div>
    </>
  )
}

export default Cart