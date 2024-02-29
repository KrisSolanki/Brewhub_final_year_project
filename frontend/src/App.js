//import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import SubNavbar from './Components/SubNavbar/SubNavbar';
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";

import Home from './Pages/Home';
import Aboutus from './Pages/Aboutus';

function App() {
  return (
    <>
    <Router>
    <div className="App">

      
      <Navbar/>
      <SubNavbar/>
      <Routes>
        
        <Route path='/home' element={<Home/>} />
        <Route path='/aboutus' element={<Aboutus/>} />

      </Routes>
    </div>
    </Router>
    </>
  );
}

export default App;
