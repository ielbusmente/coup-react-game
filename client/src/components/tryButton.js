import "../App.css";

import React from 'react'

const tryButton = (props) => {
    const{
    text,
    btnfunction,
    buttonDes,
    disable
    } = props;
  return (
    <button className={buttonDes}
            onClick={ btnfunction}
            disabled= {disable}
          >
            {text}
    </button>
  )
}

export default tryButton