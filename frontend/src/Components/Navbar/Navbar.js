// import React, { useState, useEffect } from 'react'; 
import React from 'react';
import './Navbar.css';

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

import { IoSearchCircle } from "react-icons/io5";

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
            <li><a className='active' href='https://www.google.com/'><span><IoIosHome /></span>Home</a></li>
            <li><a className='' href='www.youtube.com'><span><MdGroups /></span>About us</a></li>
            <li><a className='' href='www.yahoo,com'><span><RiLoginBoxFill /></span>Sign in</a></li>
            <li><a className='' href='www.facebook.com'><span><FaShoppingCart /></span>Cart</a></li>
            <li><a className='' href='www.instagram.com'><span><FaCircleUser /></span>Profile</a></li>
          </ul>
        </div>
        {/* <div className="toggleBtn"><i><FaBars /></i></div> */}



      </div>
      {/*<body>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis earum quisquam id dolor soluta perspiciatis alias dignissimos consequatur 
        voluptatum possimus maiores rem, quas natus voluptatibus quidem? Quod officiis ut porro
        
  </body>*/}
    </>
  )
}
export default Navbar
