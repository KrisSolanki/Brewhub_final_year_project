import React , { useEffect } from 'react'

function Aboutus({setProgress}) {

  useEffect(()=>{
    setProgress(30);
    setTimeout(()=>{
     setProgress(100);
    },0);
  }, [setProgress])

  return (
    <div>
      <h1>About Us</h1>
    </div>
  )
}

export default Aboutus
