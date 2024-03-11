// import React, { useState, useEffect } from 'react'; 
import React from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';

import Logo from '../../Assets/NavbarImgs/test1.png';
// import Search from '../../Assets/NavbarImgs/search.png';

// import { IoHomeOutline } from "react-icons/io5";<IoHomeOutline />
import { IoIosHome } from "react-icons/io";
import { MdGroups } from "react-icons/md";
// import { MdLogin } from "react-icons/md";<MdLogin />
import { RiLoginBoxFill } from "react-icons/ri";
// import { CiShoppingCart } from "react-icons/ci";<CiShoppingCart />
import { FaShoppingCart } from "react-icons/fa";

import { FaCircleUser } from "react-icons/fa6";

// import { IoSearchCircle } from "react-icons/io5";

// import { FaBars } from "react-icons/fa6";




const Navbar = () => {

  //   const [isScrolled, setIsScrolled] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 0) {
  //       setIsScrolled(true);
  //     } else {
  //       setIsScrolled(false);
  //     }
  //   };

  //   document.addEventListener('scroll', handleScroll);

  //   // Cleanup the event listener on component unmount
  //   return () => {
  //     document.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  //   document.addEventListener('scroll', handleScroll);
  return (
    <>
      <div className='container'>
        {/* <div className={`container ${isScrolled ? 'scrolled' : ''}`}> */}
        <div className="logo">
          <div className="logostl">
            <img src={Logo} alt="Logoimg" className="logo-img" />
          </div>
          <p>BREWHUB</p>
        </div>
        <div className="lst">
          {/* <ul className='srch'> */}
          {/* <li> */}
          {/*<div className="searchbox">
            <input type="text" placeholder="Search" className='searchtxt' />
            {/* <button className="btn1" id="btn1" type="submit"><img src={Search} alt="search img" className='search-img' /></button> */}
           {/*} <button className="btn1" id="btn1" type="submit"><IoSearchCircle size='3rem' /></button>
          </div> */}
          {/* </li> */}
          {/* </ul> */}
          <ul className='tgl'>
            <li><NavLink  to='/home'><span><IoIosHome /></span>Home</NavLink></li>
            <li><NavLink  to='/aboutus'><span><MdGroups /></span>About us</NavLink></li>
            <li><NavLink  to='/login'><span><RiLoginBoxFill /></span>Sign in</NavLink></li>
            <li><NavLink  to='/cart'><span><FaShoppingCart /></span>{/*Cart*/}</NavLink></li>
            <li><NavLink  to='www.instagram.com'><span><FaCircleUser /></span>{/*Profile*/}</NavLink></li>
          </ul>
        </div>
        {/* <div className="toggleBtn"><i><FaBars /></i></div> */}
      </div>
    </>
  )
}
export default Navbar
