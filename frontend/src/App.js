//import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import SubNavbar from './Components/SubNavbar/SubNavbar';
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import React , { useState } from 'react';
import Home from './Pages/Home';
import Aboutus from './Pages/Aboutus';
import LoadingBar from 'react-top-loading-bar'

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
      <Navbar/>
      <SubNavbar/>
      <Routes>
        
        <Route path='/home' element={<Home setProgress = {setProgress} />} />
        <Route path='/aboutus' element={<Aboutus setProgress = {setProgress} />} />

      </Routes>
    </div>
    </Router>
    </>
  );
}

export default App;
