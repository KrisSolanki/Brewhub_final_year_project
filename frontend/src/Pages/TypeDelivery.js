import { useEffect } from 'react'
import React from 'react'
import FiltDelivery from '../Components/CafeList/FiltDelivery'

const TypeDelivery = ({setProgress}) => {
    useEffect(()=>{
        setProgress(30);
        setTimeout(()=>{
         setProgress(100);
        },0);
      }, [setProgress])
  return (
    <div>
       <div className=""><FiltDelivery /></div>

    </div>
  )
}

export default TypeDelivery
