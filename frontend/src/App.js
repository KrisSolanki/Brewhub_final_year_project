//import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
// import SubNavbar from './Components/SubNavbar/SubNavbar';
import { BrowserRouter as Router,Routes,Route , useLocation } from "react-router-dom";
import React , { useState } from 'react';
import Home from './Pages/Home';
import Aboutus from './Pages/Aboutus';
import Cart from './Pages/Cart';
import LoadingBar from 'react-top-loading-bar'
// import TypeDelivery from './Pages/TypeDelivery';
// import TypeTakeaway from './Pages/TypeTakeaway';
import MenuList from './Pages/MenuList';
import LoginPage from './Pages/Auth/LoginPage';
import OTPPage from './Pages/Auth/OTPPage';
// import CafeList from './Components/CafeList/CafeList';
// import FiltDelivery from './Components/CafeList/FiltDelivery';
import {AuthProvider} from './Context/AuthContext';
// import { MenuContext, MenuContextProvider } from './Context/MenuContext';
import { MenuContextProvider } from './Context/MenuContext';
import ForgetPasswdPage from './Pages/Auth/ForgetPasswdPage';
import RegistrationPage from './Pages/Auth/RegistrationPage';
import UserOrderPage from './Pages/UserOrderPage';
import OrderlistdetailsPage from './Pages/OrderlistdetailsPage';
import OrderSummaryPage from './Pages/OrderSummaryPage';
import ChnagePasswordPage from './Pages/Auth/ChnagePasswordPage';
import AddressPage from './Pages/Auth/AddressPage';
import Footer from './Components/footer/Footer';

function App() {
  
  const [ progress,setProgress] = useState(0)
  // const location = useLocation();
//   const shouldHideNavbar = () => {
//     return location.pathname === '/login';
//  };
  
  return (
    
    <Router>
      
    <div className="App">


      
      <LoadingBar
        color='#f11946'
        height={4}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        />
      <AuthProvider>

      
      {/* {!shouldHideNavbar() && <Navbar />} */}
      <Navbar />
      {/* <SubNavbar/> */}
        <MenuContextProvider>
      <Routes>
        
        {/* <Route path='/' element={<Cart setProgress = {setProgress} />} /> */}
        <Route path='/cart' element={<Cart setProgress = {setProgress} />} />
        <Route path='/' element={<Home setProgress = {setProgress} />} />
        <Route path='/aboutus' element={<Aboutus setProgress = {setProgress} />} />
        {/* <Route path='/TypeDelivery' element={<TypeDelivery setProgress = {setProgress} />} /> */}
        {/* <Route path='/TypeTakeAway' element={<TypeTakeaway setProgress = {setProgress} />} /> */}
        <Route path='/CafeList/:CafeID/' element={<MenuList setProgress = {setProgress} />} />
          
        {/* <Route path='/TypeDelivery' element={<FiltDelivery />} /> */}

        <Route path="/login" element={<LoginPage/>} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/forgotpassword" element={<ForgetPasswdPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/changepassword" element={<ChnagePasswordPage />} />
          <Route path="/address" element={<AddressPage />} />
          {/* <Route path="/address/:userId/" element={<AddressPage />} /> */}
          
        {/* User Profile order*/}
        <Route path="/Userorder" element={<UserOrderPage />} />
        <Route path="/Orderlistdetails/:OrderID/" element={<OrderlistdetailsPage />} />
        <Route path="/OrderSummary/:PaymentID" element={<OrderSummaryPage />} />

      </Routes>
        </MenuContextProvider>
        <Footer/>
    </AuthProvider>
  
    </div>
    </Router>
    
  );
}

export default App;
