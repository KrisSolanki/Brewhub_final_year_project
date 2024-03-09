import React from 'react'
import { useEffect } from 'react'
import FiltTakeAway from '../Components/CafeList/FiltTakeAway';

const TypeTakeaway = ({setProgress}) => {
    useEffect(()=>{
        setProgress(30);
        setTimeout(()=>{
         setProgress(100);
        },0);
      }, [setProgress])
  return (
    
    <div>
    <div className=""><FiltTakeAway /></div>
    </div>

  )
}

export default TypeTakeaway
