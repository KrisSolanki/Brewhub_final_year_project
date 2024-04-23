import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios'
// import '../Components/Menu/MenuList.css'
import React from 'react'
import Menu from '../Components/Menu/Menu';
// import Menu from '../Components/Menu/Menu';

// import Menu from '../Components/Menu/Menu';
// import { Params } from 'react-router-dom';

const MenuList = ({ setProgress }) => {

  const [data, setData] = useState([])
  // const [cartStates, setCartStates] = useState({});

  const { CafeID } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/menulist/");
        // setData(response.data)
        // console.log(response.data)
        const Items = response.data.filter(item => String(item.cafe.CafeID) === CafeID);
        setData(Items)
        // const deliveryCafes = response.data.filter(cafe => cafe.Delivery === true);
        // console.log("deliveryCafes",deliveryCafes)
        // setFilteredData(deliveryCafes);
        // if (typeof setFilteredData === 'function') {
        //   const deliveryCafes = response.data.filter(cafe => cafe.Delivery === true);
        //   setFilteredData(deliveryCafes);
        // }


      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [CafeID]);
  console.log("assA", data)
//00099999999999999999999999999999999999
// const [cartCounts, setCartCounts] = useState(0);
// const [showCarts, setShowCarts] = useState(false);
//00099999999999999999999999999999999999

  // const handleAddToCart = () => {
  //   setCartCount(1);
  //   setShowCart(true);
  // };

  // const handleIncrement = () => {
  //   setCartCount(prevCount => prevCount + 1);
  // };

  // const handleDecrement = () => {
  //   setCartCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
  //   if (cartCount === 1) {
  //     setShowCart(false);
  //   }
  // };

  // const handleAddToCart = (itemId) => {
  //   setCartCounts(prevCounts => ({
  //     ...prevCounts,
  //     [itemId]: 1,
  //   }));

  //   setShowCarts(prevShowCarts => ({
  //     ...prevShowCarts,
  //     [itemId]: true,
  //   }));
  // };

  // const handleIncrement = (itemId) => {
  //   setCartCounts(prevCounts => ({
  //     ...prevCounts,
  //     [itemId]: (prevCounts[itemId] || 0) + 1,
  //   }));
  // };

  // const handleDecrement = (itemId) => {
  //   setCartCounts(prevCounts => ({
  //     ...prevCounts,
  //     [itemId]: Math.max(0, (prevCounts[itemId] || 0) - 1),
  //   }));

  //   setShowCarts(prevShowCarts => ({
  //     ...prevShowCarts,
  //     [itemId]: cartCounts[itemId] > 1,
  //   }));
  // };



  // console.log("data:", data);

  useEffect(() => {
    setProgress(30);
    setTimeout(() => {
      setProgress(100);
    }, 0);
  }, [setProgress])
  return (
    <>
      {/* <div> */}
      {/* <div className=""> */}
      {/* <div className="menu-item"> */}
      {/* <img src={item.image} alt={item.name} className="menu-item-image" /> */}
      {/* <div className="menu-item-details">
            <h2>Pizza</h2>
            <p>test desc</p>
              <p>Price: 399</p> */}
      {/* {showCart ? (
              <div className="cart-controls">
              <button onClick={handleDecrement}>-</button>
              <span>{cartCount}</span>
              <button onClick={handleIncrement}>+</button>
              </div>
              ) : (
                <button onClick={handleAddToCart}>Add to Cart</button>
              )} */}
      {/* </div> */}
      {/* </div> */}
      {/* </div> */}
      {/* <p>my id is {CafeID}</p> */}
      {/* <Menu/> */}
      {/* </div> */}

              {/* {data.map((Items) => (

              ))} */}
          <div style={{ background: 'burlywood' }} >
            <Menu data={data}/>
            </div>
            

    </>
  )
}

export default MenuList
