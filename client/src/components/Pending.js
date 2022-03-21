import React from "react"; 

const Pending = ({ code, currentPlayer }) => {
  const styleObj = { margin: "20px", padding: "20px" };
  return (
    <div
      style={{
        margin: "20px",
        padding: "20px",
        textAlign: "center",
        marginTop: "15%",
      }}
    >
      <h1>Game Code: {code}</h1>
      {currentPlayer === "Player 2" && (
        <h1 style={styleObj}>Player 1 has left the game.</h1>
      )}
      {currentPlayer === "Player 1" && (
        <h1 style={styleObj}>Waiting for Player 2 to join the game.</h1>
      )} 
    </div>
  );
};

export default Pending;
