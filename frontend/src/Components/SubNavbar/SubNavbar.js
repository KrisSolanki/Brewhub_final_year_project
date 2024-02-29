import React from 'react'
import { IoSearchCircle } from "react-icons/io5";
import './SubNavbar.css';
function SubNavbar() {
  return (
    <>
    <div className="subnavbar">
    <div className="lstSubNavbar">
          <ul className='ygl1'>
            <li><a href="">Delivery</a></li>
            <li><a href="">Takeaway</a></li>
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

