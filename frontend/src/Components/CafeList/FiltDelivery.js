import React,{ useState , useEffect } from 'react'
import './CafeList.css';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
const FiltDelivery = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/cafelist/");
        const deliveryCafes = response.data.filter(cafe => cafe.Delivery === true);
        // setData(response.data)
        setData(deliveryCafes)
        // console.log("deliveryCafes",deliveryCafes)
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);
  console.log("data:",data);

  return (
    <>
        <div>
        <h1>Cafe List</h1>
        <div className="container_C">
          {data.map((cafe) => (
            <NavLink to={`/CafeList/${cafe.CafeID}`} className="nav-linkP">
            <div key={cafe.CafeID} className="product">
              <div className="img">
              <img src={`http://127.0.0.1:8000/api${cafe.LogoImage}`} alt={cafe.CafeName} />
              </div>
              <div className="details">
                <div className="title">
              <h2>{cafe.CafeName}</h2>

                </div>
              <div className="desc">
              <p>{cafe.Description}</p>
              </div>
              <div className="ratings">
              <p>4.1</p>  
              </div>    
              </div>

            </div>
            </NavLink>
          ))}
        </div>
      </div>
    
    </>
  )
}

export default FiltDelivery
