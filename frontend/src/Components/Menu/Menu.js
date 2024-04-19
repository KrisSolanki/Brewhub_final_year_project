import React, { useContext, useState } from 'react';
import { MenuContext } from '../../Context/MenuContext';
import './MenuList.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notification from '../Notification/Notification';

const Menu = ({ data }) => {
    const { addToCart } = useContext(MenuContext);
    const [isExpanded, setIsExpanded] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationColor, setNotificationColor] = useState("");

    const navigate = useNavigate();

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    const handleAddToCart = async (itemId) => {
        try {
            const accessToken = localStorage.getItem('authTokens');
            const { access } = JSON.parse(accessToken);

            await axios.post('http://127.0.0.1:8000/api/cart/', {
                Item_ID: itemId,
                ItemQuantity: 1,
            }, {
                headers: {
                    Authorization: `Bearer ${access}`,
                    'Content-Type': 'application/json',
                },
            });

            addToCart(itemId);
            setNotificationMessage("Item added to Cart successfully.");
            setNotificationColor("green");
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        } catch (error) {
            setNotificationMessage("Some error occur while adding item to cart");
            setNotificationColor("green");
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
            console.error('Error adding item to cart:', error);
        }
    };

    const handleViewCart = () => {
        navigate('/cart');
    };

    // Group 
    const groupedItems = data.reduce((acc, item) => {
        const key = item.category.CategoryName;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});

    return (
        <>
            {showNotification && (
                <Notification message={notificationMessage} color={notificationColor} />
            )}
            <div className="group">
                <div className="cafegrp">
                    {data.length > 0 && (
                        <>
                            <div className="cnamelogo">
                                <div className="cafe-logo">
                                    <img className='cafelogoimg' src={`http://127.0.0.1:8000/api${data[0].cafe.LogoImage}`} alt="" srcset="" />
                                </div>
                                <div className="cafe-name">
                                    <h1>{data[0].cafe.CafeName}</h1>
                                </div>
                            </div>
                            <div className="status">
                                {data[0].cafe.status.Status_Name}
                            </div>
                            <div className="cafe-desc-p">
                                <div className="cafe-desc" onClick={toggleDescription} style={{ height: isExpanded ? 'auto' : '3em' }}>
                                    <p>{data[0].cafe.Description}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="container-item">
                {Object.entries(groupedItems).map(([categoryName, items]) => (
                    <div key={categoryName} className='categoryname'> 
                    <div className="ctname">
                        <h2 className='categoryname-p'>{categoryName}</h2>
                        </div> 
                        {items.map((item) => (
                            <div key={item.ItemID} className='menu-card'>
                                <div className="grp">
                                    <div className="item-img">
                                        <img src={`http://127.0.0.1:8000/api${item.ItemImage}`} alt="" srcset="" />
                                    </div>
                                    <div className="name_desc">

                                    <div className="namec">

                                    <div className="item_name">
                                        {/* <h2 className='item-namep'>{item.ItemName}</h2> */}
                                        <p className='item-namep'>{item.ItemName}</p>
                                    </div>
                                    </div>
                                    <div className="item-desc">
                                        <p>{item.ItemDescription}</p>
                                    </div>
                                    </div>
                                </div>
                                <div className="grp2">
                                    <div className="item-price">
                                        <h4 className='item-price'>Price: {item.ItemPrice}</h4>
                                    </div>
                                    <div className="item-add-to-card-btn">
                                        <button className="button" onClick={() => handleAddToCart(item.ItemID)}>
                                            Add to cart
                                        </button>
                                        <button className="button" onClick={handleViewCart}>
                                            View Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Menu;

