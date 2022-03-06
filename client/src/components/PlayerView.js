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
  const move = player === sinoNa;
  function action(move) {
    const player1 = player === "Player 1";
    let newCoins;
    let currentMove;
    let newLog;
    switch (move) {
      case "income":
        newCoins = coins + 1;
        newLog = `${log}${player1 ? "P1" : "P2"}: Income\n`;
        break;
      case "foreignAid":
        currentMove = `foreignAid`;
        newLog = `${log}${player1 ? "P1" : "P2"}: Foreign Aid\n`;
        newCoins = coins + 2;
        break;
      case "duke":
        currentMove = `duke`;
        newLog = `${log}${player1 ? "P1" : "P2"}: I have a Duke\n`;
        newCoins = coins + 3;
        break;
      case "ass":
        currentMove = `ass`;
        newLog = `${log}${player1 ? "P1" : "P2"}: Assassinate\n`;
        newCoins = coins - 3;
        break;
      case "coup":
        newCoins = coins - 7;
        newLog = `${log}${player1 ? "P1" : "P2"}: Coup\n`;
        break;
      default:
        console.error("Invalid Move");
    }

    let p1Cards;
    let p1Coins;
    let p1Life;
    let p2Cards;
    let p2Coins;
    let p2Life;
    let turn;

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
      currentMove: currentMove,
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
        Turn: ({move ? "Your" : `${sinoNa}'s`} turn)
        {log && <textarea disabled value={log}></textarea>}
      </div>
      <div className="box">
        <button onClick={() => action("income")} disabled={!move}>
          Income
        </button>
        <button onClick={() => action("foreignAid")} disabled={!move}>
          Foreign Aid
        </button>
        <button onClick={() => action("duke")} disabled={!move}>
          I have a Duke
        </button>
        <button onClick={() => action("ass")} disabled={!move || coins < 3}>
          Assassinate
        </button>
        <button onClick={() => action("coup")} disabled={!move || coins < 7}>
          Coup
        </button>
      </div>
      <div className="box">
        <div>
          Lives: {life} <br />
          Cards: {cards} <br />
          Coins: {coins} <br />
        </div>
        <div className="cards">
          {cards.map((card) => (
            <img src={duke} alt={``} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playerview;
