import React from "react";
import "../App.css";
// import { useEffect, useState } from "react";
import duke from "../cards/duke.jpeg";

const Playerview = (props) => {
  const {
    player,
    sinoNa,
    coins,
    cards,
    opp,
    life,
    log,
    updateGameState,
    deck,
  } = props;
  function income() {
    let newCoins = coins + 1;
    const player1 = player === "Player 1";
    let p1Cards;
    let p1Coins;
    let p1Life;
    let p2Cards;
    let p2Coins;
    let p2Life;
    let turn;
    let newLog = `${log}${player1 ? "P1" : "P2"}: Income\n`;
    if (player1) {
      p1Cards = cards;
      p1Coins = newCoins;
      p1Life = life;
      p2Cards = opp["cards"];
      p2Coins = opp["coins"];
      p2Life = opp["life"];
      turn = "Player 2";
    } else {
      p1Cards = opp["cards"];
      p1Coins = opp["coins"];
      p1Life = opp["life"];
      p2Cards = cards;
      p2Coins = newCoins;
      p2Life = life;
      turn = "Player 1";
      console.log("opp cards", opp["cards"]);
      console.log("cards", cards);
    }
    const data = {
      gameOver: false,
      turn,
      deck: deck,
      p1Cards: p1Cards,
      p1Coins: p1Coins,
      p1Life: p1Life,
      p2Cards: p2Cards,
      p2Coins: p2Coins,
      p2Life: p2Life,
      log: newLog,
    };
    console.log(`test`);
    console.log(`income: `, JSON.stringify(data));
    updateGameState(data);
  }
  return (
    <div className="grid">
      <div className="box">
        Lives: {opp.life} <br />
        Cards: {opp.cards} <br />
        Coins: {opp.coins} <br />
      </div>
      <div className="box">
        Turn: 1 ({player === sinoNa ? "Your" : `${sinoNa}'s`} turn)
        {log && <textarea disabled value={log}></textarea>}
      </div>
      <div className="box">
        <button onClick={income}>Move 1</button>
        <button>Move 2</button>
        <button>Move 3</button>
        <button>Move 4</button>
      </div>
      <div className="box">
        <div>
          Lives: {life} <br />
          Cards: {cards} <br />
          Coins: {coins} <br />
        </div>
        <div className="cards">
          <img src={duke} alt={``} />
          <img src={duke} alt={``} />
        </div>
      </div>
    </div>
  );
};

export default Playerview;
