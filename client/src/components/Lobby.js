import React, { useState } from "react";
import { Link } from "react-router-dom";
import codeGen from "../utils/codeGenerator";

const Lobby = () => {
  const [code, setcode] = useState("");
  console.log(`lobby`);
  return (
    <div>
      <input
        placeholder="Game Code"
        onChange={(e) => setcode(e.target.value)}
      />
      <Link to={`/play/${code}`}>
        <button className="game-button green">Join</button>
      </Link>

      <div className="homepage-create">
        <Link to={`/play/${codeGen(5)}`}>
          <button className="game-button orange">Create Room</button>
        </Link>
      </div>
    </div>
  );
};

export default Lobby;
