// import React from 'react'
// import axios from 'axios'
// import { useState } from 'react'
// const Cart = () => {
//     const [amount , setAmount] = useState(500)
//     const razorpayPayment = () => {
        
//         axios.post('http://127.0.0.1:8000/api/order/' ,{
//             "amount" : amount,
//             "currency":"INR"
//         })
//         .then(function(response){
//             console.log(response)
//         })
//         .catch(function(error){
//             console.log(error)
//     });
// }
    
//   return (
//     <>
//     <div className='container_bn'>
//         <div className="btn">
//             <button type='button' onClick={razorpayPayment}>click</button>
//         </div>
      
//     </div>
//     </>
//   )
// }

// export default Cart