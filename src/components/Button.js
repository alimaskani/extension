import React from "react";
import Button_lang from '../assets/images/index.png'

const Button = () => {
    return (
        <button className="lly-toggle-button ytp-button" data-toggle="tooltip" id="lly-toggle-on-off"
                title="TURN LLY ON/OFF">
            <img className="image_button" src={Button_lang}/>
        </button>
    )
}

export default Button