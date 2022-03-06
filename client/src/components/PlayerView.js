import React, { useState } from "react";
import "../App.css";
// import { useEffect, useState } from "react";
import duke from "../cards/duke.jpeg";
import ass from "../cards/assassin.jpeg"
import con from "../cards/contessa.jpeg"
import Button from "./tryButton";
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
    currentMove,
  } = props;
  const [newLife, setnewLife] = useState(life);
  const move = player === sinoNa;
  function removeLife(minusLife) {
    setnewLife(life - minusLife);
    if (newLife < 2) {
      return "lose influence";
    }
    return "";
  }
  function checkInfluence(card) {
    opp["cards"].some((c) => {
      console.log(`card: ${c} === ${c.includes(card)}`);
      return c.includes(card);
    });
  }

  function action(move) {
    const player1 = player === "Player 1";
    let newCoins;
    let currentMove;
    let newLog = coins;
    switch (move) {
      case "income":
        newCoins += 1;
        newLog = `${log}${player1 ? "P1" : "P2"}: Income\n`;
        break;
      case "foreignAid":
        currentMove = `foreignAid`;
        newLog = `${log}${player1 ? "P1" : "P2"}: Foreign Aid\n`;
        break;
      case "cForeignAid":
        currentMove = `cForeignAid`;
        newLog = `${log}${
          player1 ? "P1" : "P2"
        }: I have a duke, counter Foreign Aid\n`;
        break;
      case "cDuke":
        newLog = `${log}${player1 ? "P1" : "P2"}: You don't have a duke\n`;
        if (checkInfluence("duke")) {
          removeLife(1);
          currentMove = ``;
          // swap duke
        } else {
          currentMove = `loseInfluence`;
          newCoins += 2;
        }
        break;
      case "duke":
        currentMove = `duke`;
        newLog = `${log}${player1 ? "P1" : "P2"}: I have a Duke\n`;
        newCoins += 3;
        break;
      case "ass":
        currentMove = `ass`;
        newLog = `${log}${player1 ? "P1" : "P2"}: Assassinate\n`;
        newCoins -= 3;
        break;
      case "coup":
        newCoins -= 7;
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
  function getImage(influence) {
    console.log(influence)
    switch(influence.slice(0,-1)){
      case 'duke': return duke;
      case 'ass' :return ass;
      case 'con' :return con;
    }
  }
  return (
    <div className="grid">
      <div className="box">
        <div>
          <Button text ={'sadasdadadad'}/>
          Lives: {opp.life} <br />
          Cards: {opp.cards} <br />
          Coins: {opp.coins} <br />
        </div>
        <div className="cards">
          {opp['cards'].map((card) => (
            <img
              src={getImage(card)}
              alt={``}
              onClick={() => {
                console.log(`card ${card}`);
              }}
            />
          ))}
        </div>
      </div>
      <div className="box">
        Turn: ({move ? "Your" : `${sinoNa}'s`} turn)
        {log && <textarea disabled value={log}></textarea>}
      </div>
      <div className="box">
        <div>
          CHALLENGE?
          <Button text={`I have a Duke, you can't use Foreign Aid.`} 
          btnfunction={() => {
            action("cForeignAid");
            return console.log(`counter foreign aid`);}}
          buttonDes={`button-43`}
          />
          <button
            onClick={() => {
              action("cForeignAid");
              return console.log(`counter foreign aid`);
            }}
            disabled={currentMove !== "foreignAid" || !move}
          >
            I have a Duke, you can't use Foreign Aid.
          </button>
          <button
            onClick={() => {
              action("cDuke");
              return console.log(`counter duke`);
            }}
            disabled={
              !(
                move &&
                (currentMove === "cForeignAid" || currentMove === "duke")
              )
            }
          >
            You don't have a Duke.
          </button>
          <button
            onClick={() => console.log("counter assassin")}
            disabled={true}
          >
            You don't have an Assassin.
          </button>
          <button
            onClick={() => console.log("counter assassin w contessa")}
            disabled={true}
          >
            I have a Contessa, you can't assassinate an influence.
          </button>
          <button
            onClick={() => console.log("counter contessa")}
            disabled={true}
          >
            You don't have a Contessa.
          </button>
          <button onClick={() => console.log("no counter")} disabled={true}>
            Pass.
          </button>
        </div>
        <div>
          MAKE A MOVE
          <button
            onClick={() => action("income")}
            disabled={!(move && currentMove === "")}
          >
            Income
          </button>
          <button
            onClick={() => action("foreignAid")}
            disabled={!(move && currentMove === "")}
          >
            Foreign Aid
          </button>
          <button
            onClick={() => action("duke")}
            disabled={!(move && currentMove === "")}
          >
            I have a Duke
          </button>
          <button
            onClick={() => action("ass")}
            disabled={!(move && currentMove === "") || coins < 3}
          >
            Assassinate
          </button>
          <button
            onClick={() => action("coup")}
            disabled={!(move && currentMove === "") || coins < 7}
          >
            Coup
          </button>
        </div>
      </div>
      <div className="box">
        <div>
          Lives: {life} <br />
          Cards: {cards} <br />
          Coins: {coins} <br />
        </div>
        <div className="cards">
          {cards.map((card) => (
            <img
              src={getImage(card)}
              alt={``}
              onClick={() => {
                console.log(`card ${card}`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playerview;
