//import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import SubNavbar from './Components/SubNavbar/SubNavbar';
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import React , { useState } from 'react';
import Home from './Pages/Home';
import Aboutus from './Pages/Aboutus';
import Cart from './Pages/Cart';
import LoadingBar from 'react-top-loading-bar'
import TypeDelivery from './Pages/TypeDelivery';
import TypeTakeaway from './Pages/TypeTakeaway';
import MenuList from './Pages/MenuList';
import LoginPage from './Pages/Auth/LoginPage';
import OTPPage from './Pages/Auth/OTPPage';
// import CafeList from './Components/CafeList/CafeList';
// import FiltDelivery from './Components/CafeList/FiltDelivery';
import {AuthProvider} from './Context/AuthContext';
import { MenuContext, MenuContextProvider } from './Context/MenuContext';

function App() {
  
  const [ progress,setProgress] = useState(0)
  
  return (
    <>
    <Router>
    <div className="App">


      
      <LoadingBar
        color='#f11946'
        height={4}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        />
      <AuthProvider>

      
      <Navbar/>
      <SubNavbar/>
        <MenuContextProvider>
      <Routes>
        
        <Route path='/' element={<Cart setProgress = {setProgress} />} />
        <Route path='/cart' element={<Cart setProgress = {setProgress} />} />
        <Route path='/home' element={<Home setProgress = {setProgress} />} />
        <Route path='/aboutus' element={<Aboutus setProgress = {setProgress} />} />
        <Route path='/TypeDelivery' element={<TypeDelivery setProgress = {setProgress} />} />
        <Route path='/TypeTakeAway' element={<TypeTakeaway setProgress = {setProgress} />} />
        <Route path='/CafeList/:CafeID/' element={<MenuList setProgress = {setProgress} />} />
          
        {/* <Route path='/TypeDelivery' element={<FiltDelivery />} /> */}

        <Route path="/login" element={<LoginPage/>} />
          <Route path="/otp" element={<OTPPage />} />

      </Routes>
        </MenuContextProvider>
    </AuthProvider>
  
    </div>
    </Router>
    </>
  );
}

export default App;
