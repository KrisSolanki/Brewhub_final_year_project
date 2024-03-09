import React from 'react'
// import { IoSearchCircle } from "react-icons/io5";
import './SubNavbar.css';
import { MdDeliveryDining } from "react-icons/md";
import { CiCoffeeCup } from "react-icons/ci";
// import { RiTakeawayFill } from "react-icons/ri"; <RiTakeawayFill />
import Search from '../../Assets/NavbarImgs/search.png';
import { NavLink } from 'react-router-dom';

function SubNavbar() {
  return (
    <>
    <div className="subnavbar">
    <div className="lstSubNavbar">
          <ul className='ygl1'>
            <li><NavLink className='navLink_s' to="/TypeDelivery"><MdDeliveryDining />Delivery</NavLink></li>
            <li><NavLink className='navLink_s' to="/TypeTakeaway"><CiCoffeeCup />Takeaway</NavLink></li>
          </ul>
          <div className="searchboxSubNavbar">
            <input type="text" placeholder="Search" className='searchtxtSubNav' />
            <button className="btn1SubNav" type="submit"><img src={Search} alt="search img" className='search-img' /></button>
            {/* <button className="btn1SubNav" id="btn1SubNav" type="submit"><IoSearchCircle size='4rem' className='icon' /></button> */}
          </div>
          </div>
    </div>
    </>
  )
}

export default SubNavbar

