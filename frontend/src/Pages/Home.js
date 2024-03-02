import React , { useEffect } from 'react'

function Home({setProgress}) {
 
  useEffect(()=>{
    setProgress(30);
    setTimeout(()=>{
     setProgress(100);
    },0);
  }, [setProgress])

  return (
    <div>
      <h1>HomePage</h1>
    </div>
  )
}

export default Home
