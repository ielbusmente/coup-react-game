import "../App.css";

import React from 'react'

const tryButton = (props) => {
    const{
    text,
    btnfunction,
    buttonDes
    } = props;
  return (
    <button className={buttonDes}
            onClick={ btnfunction}
          >
            {text}
    </button>
  )
}

export default tryButton