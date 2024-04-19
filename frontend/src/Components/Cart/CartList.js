import React from 'react'
import "../Cart/Cart.css"
import { MenuContext } from '../../Context/MenuContext';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useContext } from 'react';
import useRazorpay from 'react-razorpay';
import { useNavigate } from 'react-router-dom';
import PopUp from '../PopUp/PopUp';
import { FaWindowClose } from "react-icons/fa";
import Notification from '../Notification/Notification';



const CartList = () => {
  const navigate = useNavigate();
  const { addToCart, removeFromCart, cartItems } = useContext(MenuContext);

  const [data, setData] = useState({

    cart: {},
    cart_items: [],
    menus: [],
    message: ''
  });


  const [cartCounts1, setCartCounts1] = useState({});

  const [offerData, setOfferData] = useState();
  const [btnpopup, setBtnPopUp] = useState(false);
  const [offer_id, setOffer_Id] = useState();
  const [offerresponse, setOfferResponse] = useState();
  const [removeoffermsg,setRemoveOfferMsg] = useState('');
  const [appliedOfferName, setAppliedOfferName] = useState('');
  const [appliedOfferID, setAppliedOfferID] = useState('');
  const [showCloseButton, setShowCloseButton] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationColor, setNotificationColor] = useState("");
  useEffect(()=>{
    const storedOfferID = data.cart.Offer_ID;
    // data
    if(storedOfferID){
      setAppliedOfferID(storedOfferID);
      fetchOfferDetails(storedOfferID);
      setShowCloseButton(true);
    }
  },[data.cart])
  
// useEffect(() => {},[data])

  const fetchOfferData = () => {
    // Make an API call to fetch offer data using Axios
    axios.get("http://127.0.0.1:8000/api/offer/")
      .then(response => {
        setOfferData(response.data);
        // Open the popup menu
        console.log("ffffffffffffffffffffffffffffffffffffff", offerData)
        setBtnPopUp(true)
      })
      .catch(error => console.error('Error fetching offer data:', error));
  };
  const fetchOfferDetails = async (offer_id) => {
    try{
      const response = await axios.get(`http://127.0.0.1:8000/api/offer/${offer_id}`);
      setAppliedOfferName(response.data.OfferTitle);
    } catch (error) {
      console.error('Error fetching offer details:',error)
    }
  };
  
  const handleOffers = async (offer_id , offerName) => {
    try {
      setAppliedOfferID(offer_id);
      setShowCloseButton(true);
      setAppliedOfferName(offerName)
      const accessToken = localStorage.getItem('authTokens');
      const { access } = JSON.parse(accessToken);
      console.log('Access Token:', access);
      setOffer_Id(prevId => prevId === offer_id ? null : offer_id);
      setAppliedOfferName(offerName);
      const response = await axios.put(`http://127.0.0.1:8000/api/cart1/`,
        {
          Offer_ID: offer_id
        },
        {
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setOfferResponse(response);
      setNotificationMessage("Offer applied successfully");
      setNotificationColor("green");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      const response1 = await axios.get("http://127.0.0.1:8000/api/cart/", {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      });
      setData(response1.data);
      
    } catch (error) {
      console.error('Error:', error);
    }
  };
  console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv", offerresponse)

  const handleRemoveOffer = async () => {
    try{
      setAppliedOfferName('');
      setAppliedOfferID('null');
      setShowCloseButton(false);
        const accessToken = localStorage.getItem('authTokens');
        const { access } = JSON.parse(accessToken)
        const response = await axios.delete('http://127.0.0.1:8000/api/cart1/',
      {
        headers:{
          Authorization: `Bearer ${access}`,
        'Content-Type': 'application/json'
        }
      });
      setRemoveOfferMsg(response);
      setNotificationMessage("Offer removed successfully");
      setNotificationColor("green");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      const response1 = await axios.get("http://127.0.0.1:8000/api/cart/", {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      });
      setData(response1.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  


  // const [count,setCount] = useState(); 
  useEffect(() => {

  }, [cartCounts1]);

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
        

        setData(response.data);
        console.log("adrfs", data)
        
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
    // }, [data]);
  }, []);



  const handleIncrement = async (event, cart_items ) => {
    event.preventDefault();
    const updatedCounts = { ...cartCounts1, [cartItems.Cart_Item_ID]: (cartCounts1[cartItems.Cart_Item_ID] || cartItems.ItemQuantity) + 1 };
    setCartCounts1(updatedCounts);

    try {
      const accessToken = localStorage.getItem('authTokens');
      const { access } = JSON.parse(accessToken);

      // Ensure the request body reflects the updated quantity
      const updatedQuantity = (cart_items.ItemQuantity || 0) + 1;

      await axios.put(
        `http://127.0.0.1:8000/api/cart/`,
        {
          Cart_Item_ID: cart_items.CartDetailsID,
          ItemQuantity: updatedQuantity,
          Cart_ID: data.cart.CartID,
          Item_ID: cart_items.Item_ID,
          // Offer_ID : offer_id,

        },
        {
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const response = await axios.get("http://127.0.0.1:8000/api/cart/", {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data);
      // addToCart(cart_items.Item_ID);



    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
    console.log("data.cart.CartID", data.cart.CartID)
    console.log("cart_items", cart_items)
  };

  const handleDecrement = async (cart_items, itemId,offer_id) => {

    setCartCounts1((prevCounts) => {
      const updatedCounts = {
        ...prevCounts,
        [cart_items.CartDetailsID]: Math.max(0, (prevCounts[cart_items.CartDetailsID] || 0) - 1),
      };
      return updatedCounts;
    });


    try {
      const accessToken = localStorage.getItem('authTokens');
      const { access } = JSON.parse(accessToken);
      const updatedQuantity = (cart_items.ItemQuantity || 0) - 1;

      // Ensure the request body reflects the updated quantity

      console.log("access:", access)
      // console.log("updatedQuantity", updatedQuantity)
      await axios.patch(
        `http://127.0.0.1:8000/api/cart/`,
        {
          Cart_Item_ID: cart_items.CartDetailsID,
          ItemQuantity: updatedQuantity,
          Cart_ID: data.cart.CartID,
          Item_ID: cart_items.Item_ID,
          // Offer_ID : offer_id,
        },
        {
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json',
          }
        }
      );
      const response = await axios.get("http://127.0.0.1:8000/api/cart/", {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data);
      // removeFromCart(cart_items.Item_ID)
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }

  };
  //=============================================================


  // Handle order and razorpay---------------------  

  const complete_payment = (paymentid, orderid, sig, oid) => {
    console.log("orderid", orderid)
    console.log("paymentid", paymentid)
    console.log("sig", sig)
    const accessToken = localStorage.getItem('authTokens');
    const { access } = JSON.parse(accessToken);
    axios.post('http://127.0.0.1:8000/api/complete/', {
      "razorpay_order_id": orderid,
      "razorpay_payment_id": paymentid,
      "razorpay_signature": sig,
      "OrderID": oid
    },
      {
        headers: {
          Authorization: `Bearer ${access}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        console.log(response.data.PaymentData.PaymentID);
        navigate(`/OrderSummary/${response.data.PaymentData.PaymentID}`);

      })
      .catch((error) => {
        console.log(error.message)
      })
    console.log("COMPLETE api called")
  }
  const [Razorpay] = useRazorpay();


  const handleorder = () => {

    const accessToken = localStorage.getItem('authTokens');
    const { access } = JSON.parse(accessToken);

    axios.post(
      `http://127.0.0.1:8000/api/order/`,
      {

      },
      {
        headers: {
          Authorization: `Bearer ${access}`,
          'Content-Type': 'application/json',
        },
      }
    ).then(function (response) {
      console.log("Response", response.data.RAZORPAY_ORDER_ID);
      console.log("ResponseAAAAA", response.data);
      console.log("ResponseBBBBB", response.data.ORDERID);
      const oid = response.data.ORDERID;
      const orderid = response.data.RAZORPAY_ORDER_ID; // Assuming the order ID is in the response data

      const options = {
        key: "rzp_test_hcdXSoauARgkpH",
        name: "Acme Corp",
        description: "Test Transaction",
        order_id: orderid,
        handler: function (response) {
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature);
          complete_payment(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature,
            oid
          )
        },
        prefill: {
          name: "Piyush Garg",
          email: "youremail@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp.open();

    }).catch(function (error) {
      console.error('Error updating item quantity:', error);
    });
  }
  const handleDelete = async (itemId) => {
    const accessToken = localStorage.getItem('authTokens');
    const { access } = JSON.parse(accessToken);
    try {
      axios.delete(
        `http://127.0.0.1:8000/api/cart1/${itemId}/`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json',
          },

        }
      )
        // .then(response => {
        //   console.log('Item deleted successfully:', response.data);
        //   // Handle the response, e.g., update the UI to reflect the deletion
        // })
        // .catch(error => {
        //   console.error('Error deleting item:', error);
        //   // Handle the error, e.g., show an error message to the user
        // });
        const response = await axios.get("http://127.0.0.1:8000/api/cart/", {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error parsing access token:', error);
      // Handle the error, e.g., show an error message to the user
    }


  };
  // console.log("open", useRazorpay());
  // console.log("Type of first element:", typeof useRazorpay()[0]);
  // console.log("cartCounts1", cartCounts1);
  // console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", offer_id)
  // // console.log("zzzz",data.cart.menus.ItemID )
  console.log('OFFERID ---------------------------',offer_id)
  return (

    <>
    {showNotification && (
                <Notification message={notificationMessage} color={notificationColor} />
            )}
    


      <div class="cart-container">
        <div class="cart-items">
          <h1>Cart</h1>
          <div className="parent">
            <div className="parent2">


              {data.cart_items.map((cartItem) => {
                // Find the corresponding menu item for the cart item
                const menuItem = data.menus.find(menu => menu.ItemID === cartItem.Item_ID);

                return (
                  <div class="cart-item" key={cartItem.CartDetailsID}>
                    <div class="item-details">
                      <img src={`http://127.0.0.1:8000/api${menuItem.ItemImage}`} alt="" srcset="" />
                      <div class="item-info">
                        <p><strong>Item Name:</strong> {menuItem.ItemName}</p>
                        {/* <p><strong>Description:</strong> {menuItem.ItemDescription}</p> */}
                        <p><strong>Price:</strong> {menuItem.ItemPrice}</p>
                        <p><strong>Quantity:</strong> {cartCounts1[cartItem.CartDetailsID] || cartItem.ItemQuantity}</p>
                        <p><strong>Subtotal:</strong> {cartItem.Subtotal}</p>
                      </div>
                    </div>
                    <div class="item-actions">
                      <button class="action-btn" onClick={(event) => handleIncrement(event, cartItem)}>+</button>
                      <p class="quantityDisplay">{cartCounts1[cartItem.CartDetailsID] || cartItem.ItemQuantity}</p>
                      <button class="action-btn" onClick={() => handleDecrement(cartItem, cartItem.CartDetailsID)}>-</button>
                      <button class="delete-btn" onClick={() => handleDelete(cartItem.CartDetailsID)}>DELETE</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="totalcart">
              <div className="totalsummarycart">
                <h2>Offer</h2>
                <div className="offerboxcontainer">
                  <div className="offerbox">
                    <h5 onClick={fetchOfferData}>{appliedOfferName ? appliedOfferName : 'Offers'}</h5>

                    <PopUp trigger={btnpopup} setTrigger={setBtnPopUp}>
                    {showNotification && (
                <Notification message={notificationMessage} color={notificationColor} />
            )}
                      <center><h2>Offers</h2></center>
                      <div className="offermain_container">

                        {offerData ? ( // Check if offerData is not null
                          offerData.map(offer => (
                            <div key={offer.OfferID} className='offer_container' >
                              <div className="left">

                                <h3>{offer.OfferTitle}</h3>
                                <p>{offer.OfferDescription}</p>
                                <p>Minimum Amount: {offer.MinimumAmount}</p>
                                <p>Discount Percentage: {offer.DiscountPercentage}</p>
                              </div>
                              <div className="right">
                                <button onClick={() => handleOffers(offer.OfferID , offer.OfferTitle)}>Apply</button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>Loading offer data...</p> // Placeholder while offerData is null
                        )}                      
                        </div>
                    </PopUp>
                    
                  </div>
                        {/* <button><FaWindowClose size={20} /></button> */}
                        {appliedOfferName && <button onClick={() => {handleRemoveOffer()}}><FaWindowClose size={20} /></button>}
                </div>
              </div>
              <div className="totalsummaryc">
                <h2>Total</h2>
              </div>
              
              <div className="jjkcart">
                <div className="subtotalcart">
                  <h3><strong>SubTotal : </strong>{data.cart.Subtotal}</h3>
                  
                  {/* <h3>500</h3> */}
                </div>
                <div className="Maintotalcart">
                  {offerData ? (
                     <div className="Maintotalcartd">
                     <h3><strong>Discount : </strong>-{data.cart.Subtotal - data.cart.Total }</h3>
                     </div> 
                     ) : ( <></>
                        )}  
                  <h3>Total : {data.cart.Total} </h3>
                  {/* <h3>500</h3> */}
                </div>
                <div class="checkout-btn">
                  <center>
                    <button onClick={handleorder}>Checkout</button>
                  </center>
                </div>

              </div>


            </div>
          </div>
          {data.cart_items.length === 0 && <h1>Your Cart is Empty</h1>}
          <div class="cart-summary">
            <div class="summary-total">
              <h3><strong>Total:</strong> {data.cart.Total}</h3>
            </div>
            <div class="checkout-btn">
              <button onClick={handleorder}>Checkout</button>
            </div>
          </div>
        </div>
      </div>

    </>

  );
};


export default CartList
