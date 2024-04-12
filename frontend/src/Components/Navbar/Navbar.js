import React, { useContext, useState , useEffect } from 'react';
import { NavLink , useNavigate} from 'react-router-dom';
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
 
 const [searchQuery, setSearchQuery] = useState('');
 const [searchResults, setSearchResults] = useState([]);

 const navigate = useNavigate();

 const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
 };

 const handleAdminPanelClick = () => {
  window.open('http://127.0.0.1:8000/admin/', '_blank');
 };

 const debounce = (func, delay) => {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

const handleSearchInputChange = (e) => {
  const value = e.target.value;
  setSearchQuery(value);
 
  // If the input is cleared, clear the search results
  if (value === '') {
     setSearchResults([]);
  }
 };

const debouncedSearch = debounce(() => {
  if (searchQuery) {
    fetch(`http://127.0.0.1:8000/api/cafelist?q=${encodeURIComponent(searchQuery)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("&&&&&&&&&&&&&&&&&&&&&&&")
        console.log("DATA",data)
        // Check if data.cafe is an array before setting it
        if (Array.isArray(data)) {
          setSearchResults(data);
        } else {
          console.error('Expected data.cafe to be an array, but received:', data);
          // Optionally, set searchResults to an empty array if data.cafe is not an array
          setSearchResults([]);
        }
      })
      .catch((error) => console.error("Error fetching search results:", error));
  }
}, 500);

useEffect(() => {
  // If the search query is empty, clear the search results immediately
  if (searchQuery === '') {
     setSearchResults([]);
  } else {
     // Otherwise, trigger the debounced search
     debouncedSearch();
  }
 }, [searchQuery]);

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
              <input 
              type="text" 
              placeholder="Search" 
              className='searchtxtSubNav' 
              value={searchQuery}
              onChange={handleSearchInputChange}
              />
              <button className="btn1SubNav" 
              type="submit"><img src={Search} 
              alt="search img" className='search-img' 
              // onClick={handleSearchSubmit}
              /></button>
            </div>   
            </li>
            <li><NavLink to='/'><span><IoIosHome /></span>Home</NavLink></li>
            <li><NavLink to='/aboutus'><span><MdGroups /></span>About us</NavLink></li>
            {user ? (
              <>
                <li><NavLink to='/cart'><span><FaShoppingCart /></span>Cart</NavLink></li>
                <li onClick={toggleDropdown}><span><FaCircleUser /></span>Profile</li>
                {showDropdown && (
                 <div className="dropdown-menu">
                     <p className="dropdown-item">{user.username}</p>
                      <button className="dropdown-item" onClick={() => navigate('/Userorder')}>
                        Your Orders
                      </button>
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
      {searchResults.length > 0 && (
        <div className="search_results">
          {searchResults.map((cafe, index) => (
            <div
              key={index}
              className="search_result"
              onClick={() => {
                navigate(`/CafeList/${cafe.CafeID}`);
                
                setSearchResults([]);
                setSearchQuery("");
                
              }}
              ><div className="cafe-imagecontainer">
              <img
               src={`http://127.0.0.1:8000/api${cafe.LogoImage}`}
               alt={cafe.CafeName}
               className="cafe-image"
              />
            </div>
            <div className="Cafe-details">
              <h3>{cafe.CafeName}</h3>
            </div>
          </div>
        ))}
      </div>
    )}
      
          
    </>
 )
}

export default Navbar;



