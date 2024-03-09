import { useEffect , useState } from 'react';
// import { useParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import '../Components/Menu/Menu.css'
import React from 'react'

// import Menu from '../Components/Menu/Menu';
// import { Params } from 'react-router-dom';

const MenuList = ({setProgress}) => {

  const [data, setData] = useState([])
  const { CafeID } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/menulist/");
        setData(response.data)

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
  }, []);

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

  console.log("data:",data);
  
  useEffect(()=>{
    setProgress(30);
    setTimeout(()=>{
     setProgress(100);
    },0);
  }, [setProgress])
  return (
    <div>
      <div className="">
    

    <div className="menu-item">
      {/* <img src={item.image} alt={item.name} className="menu-item-image" /> */}
      <div className="menu-item-details">
        <h2>Pizza</h2>
        <p>test desc</p>
        <p>Price: 399</p>
      {showCart ? (
        <div className="cart-controls">
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
      <p>my id is {CafeID}</p>
      {/* <Menu/> */}
    </div>
  )
}

export default MenuList
