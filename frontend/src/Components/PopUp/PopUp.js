import React from 'react'
import { FaWindowClose } from "react-icons/fa";
import "./PopUp.css"

function PopUp(props) {
    return (props.trigger) ? (
        <div className="cover">
            
<div className="popup">
    <div className="popup_inner">
        <button className='close_btn' onClick={() => props.setTrigger(false)}><FaWindowClose /></button>
        { props.children }
    </div>
</div>
        </div>
) : "";
}

export default PopUp
