import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './CafeList.css';

const CafeList = (images) => {

  const [data, setData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/cafelist/");
        console.log(response.data);
        setData(response.data)
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);
  // console.log(data);
  // console.log(data)
  return (
    <>
      <div>
        <h1>Cafe List</h1>
        <div className="container_C">
          {data.map((cafe) => (
            <div key={cafe.CafeID} className="product">
              <div className="img">
              <img src={`http://127.0.0.1:8000/api${cafe.LogoImage}`} alt={cafe.CafeName} />
              </div>
              <div className="details">

              <h2>{cafe.CafeName}</h2>
              <p>{cafe.Description}</p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default CafeList
