import "../App.css";

import React from "react";

const tryButton = (props) => {
  const { text, btnfunction, buttonDes, disabled } = props;
  return (
    <button
      className={`${buttonDes} ${disabled ? `disabled` : ``}`}
      onClick={btnfunction}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default tryButton;
