import React from 'react'
import { IoSearchCircle } from "react-icons/io5";
import './SubNavbar.css';
import { MdDeliveryDining } from "react-icons/md";
import { RiTakeawayFill } from "react-icons/ri";

function SubNavbar() {
  return (
    <>
    <div className="subnavbar">
    <div className="lstSubNavbar">
          <ul className='ygl1'>
            <li><a href=""><MdDeliveryDining />Delivery</a></li>
            <li><a href=""><RiTakeawayFill />Takeaway</a></li>
          </ul>
          <div className="searchboxSubNavbar">
            <input type="text" placeholder="Search" className='searchtxtSubNav' />
            {/* <button className="btn1" id="btn1" type="submit"><img src={Search} alt="search img" className='search-img' /></button> */}
            <button className="btn1SubNav" id="btn1SubNav" type="submit"><IoSearchCircle /></button>
          </div>
          </div>
    </div>
    </>
  )
}

export default SubNavbar

