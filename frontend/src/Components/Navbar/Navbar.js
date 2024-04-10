import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IoIosHome } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import { RiLoginBoxFill } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import Logo from '../../Assets/NavbarImgs/test1.png';
import Search from '../../Assets/NavbarImgs/search.png';
import './Navbar.css';
import AuthContext from '../../Context/AuthContext';

const Navbar = () => {
 const { user, logoutUser } = useContext(AuthContext);
 const [showDropdown, setShowDropdown] = useState(false);

 const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
 };

 const handleAdminPanelClick = () => {
  window.open('http://127.0.0.1:8000/admin/', '_blank');
};

 return (
    <>
      <div className='container'>
        <div className="logo">
          <div className="logostl">
            <img src={Logo} alt="Logoimg" className="logo-img" />
          </div>
          <p>BREWHUB</p>
        </div>
        <div className="lst">
          <ul className='tgl'>
            <li><div className="searchboxNavbar">
              <input type="text" placeholder="Search" className='searchtxtSubNav' />
              <button className="btn1SubNav" type="submit"><img src={Search} alt="search img" className='search-img' /></button>
            </div></li>
            <li><NavLink to='/'><span><IoIosHome /></span>Home</NavLink></li>
            <li><NavLink to='/aboutus'><span><MdGroups /></span>About us</NavLink></li>
            {user ? (
              <>
                <li><NavLink to='/cart'><span><FaShoppingCart /></span>Cart</NavLink></li>
                <li onClick={toggleDropdown}><span><FaCircleUser /></span>Profile</li>
                {showDropdown && (
                 <div className="dropdown-menu">
                     <p className="dropdown-item">{user.username}</p>
                    <button className="dropdown-item" onClick={logoutUser}>Logout</button>
                    console.log("User Role:", user.Role),
                 </div>
                )}
                {user && user.Role === "Admin" && (
                   console.log("Rendering Admin Panel link"),
                  <li onClick={handleAdminPanelClick} >Admin Panel</li>
                )}
              </>
            ) : (
              <li><NavLink to='/login'><span><RiLoginBoxFill /></span>Sign in</NavLink></li>
            )}
          </ul>
        </div>
      </div>
    </>
 )
}

export default Navbar;



