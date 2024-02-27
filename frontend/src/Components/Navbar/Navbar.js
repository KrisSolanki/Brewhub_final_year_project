import React from 'react'; 
import './Navbar.css' ;
import Logo from '../../Assets/NavbarImgs/Logo.png' ;
import Search from '../../Assets/NavbarImgs/search.png'; 

const Navbar = () => {
  return (
    <>
    <div className='container'>
        <div className="logo">
            <div className="logostl">
            <img src={Logo} alt="Logoimg" className="logo-img" />
            </div>
            <p>BREWHUB</p>
        </div>
        <div className="lists">
            <ul>
                <li>

        <div className="searchbox">
            <input type="text" placeholder="Search"/>
            <button className="btn1" id="btn1" type="submit"><img src={Search} alt="search img" className='search-img'/></button>
        </div>
                </li>
                <li>Home</li>
                <li>About us</li>
                <li>Sign in</li>
                <li>Cart</li>
            </ul>
        </div>
      
    </div>
    </>
  )
}

export default Navbar
