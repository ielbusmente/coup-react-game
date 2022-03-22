import React, { useState } from "react";
import { Link } from "react-router-dom";
import codeGen from "../utils/codeGenerator";
import Button from "./tryButton";

const Lobby = () => {
  const [code, setcode] = useState("");
  console.log(`lobby`);
  return (
    <div
      style={{
        display: `flex`,
        flexDirection: `column`,
        alignItems: "center",
        justifyContent: "center",
        margin: "20px",
        padding: "20px",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: `3rem`, fontWeight: "bold", margin: "30px 0 " }}>
        Mini Coup
      </div>
      <div style={{ margin: `10px`, width: `50%`, display: "flex" }}>
        <input
          style={{
            // margin: `10px`,
            flex: "1",
            padding: `10px`,
            fontSize: `1.5rem`,
          }}
          placeholder="Game Code"
          onChange={(e) => setcode(e.target.value)}
        />
        <div style={{ flexShrink: "0" }}>
          <Link to={`/play/${code}`}>
            <Button text={`Join`} buttonDes={`button-44`} />
            {/* <button className="">Join</button> */}
          </Link>
        </div>
      </div>

      <div className="" style={{ margin: `10px`, width: `50%` }}>
        <Link to={`/play/${codeGen(5)}`}>
          <Button text={`Create Room`} buttonDes={`button-44`} />
          {/* <button className="">Create Room</button> */}
        </Link>
      </div>
      
      <div className="instructions">
      <h1>Bluff and call bluffs to Victory! </h1>
        
        <br/>
        <h1>Instructions</h1>
        Moves of the Game
        <ul>
          <br/>
          <li>Income: Get 1 coin <br/>(can't be countered)</li>
          <br/>
          <li>Foreign Aid: Get 2 coins from Foreign Aid <br/>(can be countered if the other player claims to have a Duke)</li>
          <br/>
          <li>I have a Duke: Get 3 coins if you claim you have a Duke <br/> (can be countered when the other player calls it a bluff)</li>
          <br/>
          <li>Assasinate: Pay 3 coins and the other player selects an Influence to be killed <br/>(can be countered by a Contessa or a bluff call )</li>
          <br/>
          <li>Coup: Pay 7 coins, Remove an Influence from opponent <br/>(can't be countered)</li>
          <br/>
         </ul>
        <br/>
       
      </div>
      <h3>
          Artist: Behnam Balali, Luis Francisco, Stephanie Gustafsson, Andrew
          Higgins + 8 more <br />
          Publisher: Indie Boards & Cards, La Mame Games and many more
        </h3>
    </div>
  );
};

export default Lobby;
