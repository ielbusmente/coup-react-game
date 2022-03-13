import React from "react";
import { Link } from "react-router-dom";

const Pending = ({ code, currentPlayer }) => {
  return (
    <div>
      <h1>Game Code: {code}</h1>
      {currentPlayer === "Player 2" && (
        <h1 className="">Player 1 has left the game.</h1>
      )}
      {currentPlayer === "Player 1" && (
        <h1 className="">Waiting for Player 2 to join the game.</h1>
      )}
      <Link to={`/`}>
        <button className="">QUIT</button>
      </Link>
    </div>
  );
};

export default Pending;
