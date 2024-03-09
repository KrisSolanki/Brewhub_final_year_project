import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import '../Components/Menu/MenuList.css'
import React from 'react'

// import Menu from '../Components/Menu/Menu';
// import { Params } from 'react-router-dom';

const MenuList = ({ setProgress }) => {

  const [data, setData] = useState([])
  const { CafeID } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/menulist/");
        // setData(response.data)
        // console.log(response.data)
        const Items = response.data.filter(item => item.cafe.CafeID == CafeID);
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
  console.log(data)

  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);

  const handleAddToCart = () => {
    setCartCount(1);
    setShowCart(true);
  };

  const handleIncrement = () => {
    setCartCount(prevCount => prevCount + 1);
  };

  const handleDecrement = () => {
    setCartCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
    if (cartCount === 1) {
      setShowCart(false);
    }
  };

  console.log("data:", data);

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


          <div className="container-item">
          {data.length > 0 && (
            <div className="cafe-details">
              <div className="cafe-logo">
                <img src="{`http://127.0.0.1:8000/api${cafe.LogoImage}`}" alt="" srcset="" />
              </div>
              <div className="cafe-name">
                {/* <p>{Items.cafe.CafeName}</p> */}
                <h1>{data[0].cafe.CafeName}</h1>
                {/* <h1>heloo</h1> */}
              </div>
              {/* <div className="status">
              {data[0].cafe.status}
              </div> */}

            </div>
             )}
      {data.map((Items) => (
        <div key={Items.ItemID} className=''>
            <div className="menu-card">
              <div className="grp">

              <div className="item-img">
                <p>img</p>
              </div>
              <div className="item-name">
                <h2>{Items.ItemName}</h2>

              </div>
              <div className="item-desc">
                <p>{Items.ItemDescription}</p>
              </div>
              </div>
              <div className="grp2">

              <div className="item-price">
                <p>Price: {Items.ItemPrice}</p>
              </div>
              <div className="item-add-to-card-btn">
                {showCart ? (
                  < div className="cart-controls">
                <button onClick={handleDecrement}>-</button>
                <span>{cartCount}</span>
                <button onClick={handleIncrement}>+</button>
              </div>
              ) : (
                <button onClick={handleAddToCart}>Add to Cart</button>
                )}
                </div>

            </div>
          </div>
        </div>


        ))}
      </div >

    </>
  )
}

export default MenuList
