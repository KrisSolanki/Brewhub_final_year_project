import React , { useEffect } from 'react'
import CafeList from '../Components/CafeList/CafeList';

function Home({setProgress}) {

  useEffect(()=>{
    setProgress(30);
    setTimeout(()=>{
     setProgress(100);
    },0);
  }, [setProgress])

  return (
    <div>
      {/* <h1>HomePage</h1> */}
      <div className=""><CafeList  /></div>

    </div>
  )
}

export default Home
