import React, { useState } from "react";
import "../App.css";
// import { useEffect, useState } from "react";
import duke from "../cards/duke.jpeg";
import shuffle from "../utils/shuffleDeck";
import ass from "../cards/assassin.jpeg";
import con from "../cards/contessa.jpeg";
import Button from "./tryButton";

const Playerview = (props) => {
  const {
    player, //current player
    sinoNa, //turn current player
    coins, //coins of the current player
    cards, //cards of the current player
    opp, //opponent object
    life, //life of the current player
    log, //log string
    updateGameState, //update game state function
    deck, //draw pile
    currentMove, //string description kung ano na ganap

    p1XCardsG, //p1 lost Cards
    p2XCardsG, //p2 lost Cards
  } = props;

  const player1 = player === "Player 1"; //player 1 ung gagalaw
  const move = player === sinoNa; //kung sino na

  // removes 1 life from current player
  function removeLife(minusLife, kanino) {
    console.log(`minusLife`, minusLife);
    // setnewLife(newLife - minusLife);
    //current player's life minus minusLife
    const newLife = (kanino === "current" ? life : opp["life"]) - minusLife;
    //if newLife is less than 2, meaning 2 life na lang siya before mabawasan,
    //bawas influence
    // return { life: newLife, str: `${newLife < 2 ? "loseInfluence1" : ""}` };
    console.log(player, kanino, newLife);
    return {
      life: newLife,
      str: `${
        newLife < 2
          ? kanino === "current"
            ? "loseInfluence1"
            : "loseInfluence2"
          : ""
      }`,
    };
  }
  // check influence of opponent
  function checkInfluence(card) {
    const exists = opp["cards"].some((c) => {
      console.log(`card: ${c} === ${c.includes(card)}`);
      return c.includes(card);
    });
    return exists;
  }
  function swapCard(card) {
    console.log(`card`, card);
    console.log(`deck`, deck);
  }
  function removeCard(card, rev) {
    console.log(`card`, card);
    console.log(`cards`, cards);
    let newCards = cards;
    let newXCards = player1 ? p1XCardsG : p2XCardsG;
    console.log("delete", card);
    newXCards.push(card);
    console.log(`cards`, newCards);
    let newLog = `${log}${player1 ? "P1" : "P2"}: Lost an Influence.\n`;

    if (newXCards.length == 2) {
      updateGameState({ gameOver: true, winner: `${player1 ? "P2" : "P1"}` });
    } else {
      let p1Cards;
      let p1Coins;
      let p1Life;
      let p2Cards;
      let p2Coins;
      let p2Life;
      let turn;
      let p1XCards;
      let p2XCards;

      if (player1) {
        p1Cards = newCards;
        p1Coins = coins;
        p1Life = life;
        turn = rev ? "Player 2" : "Player 1";
        p1XCards = newXCards;
      } else {
        p2Cards = newCards;
        p2Coins = coins;
        p2Life = life;
        turn = rev ? "Player 1" : "Player 2";
        p2XCards = newXCards;
      }

      const data = {
        turn,
        p1Cards: p1Cards,
        p1Coins: p1Coins,
        p1Life: p1Life,
        p2Cards: p2Cards,
        p2Coins: p2Coins,
        p2Life: p2Life,
        log: newLog,
        p1XCards,
        p2XCards,
        currentMove: "",
      };
      console.log(`test`);
      console.log(`remove ${card}: `, JSON.stringify(data));
      updateGameState(data);
    }
  }
  function action(move) {
    //current player
    let newCoins = coins;
    let newLife = life;
    let newCards;
    // opponent
    let newOppCoins = opp["coins"];
    let newOppLife = opp["life"];
    let newOppCards = opp["cards"];
    //game data
    let newLog;
    let revTurn = false;
    let newCurrentMove = "";

    switch (move) {
      // Move
      case "income":
        newCoins += 1;
        newLog = `${log}${player1 ? "P1" : "P2"}: Income\n`;
        break;

      case "foreignAid":
        newCurrentMove = `foreignAid`;
        newLog = `${log}${player1 ? "P1" : "P2"}: Foreign Aid\n`;
        break;

      // Counter/Response
      case "pass":
        newCurrentMove = "";
        newLog = `${log}${player1 ? "P1" : "P2"}: Ok\n`;
        console.log(`currentmove: `, currentMove);

        if (currentMove === "foreignAid") {
          newOppCoins += 2;
          revTurn = true;
        }
        break;
      case "cForeignAid":
        newCurrentMove = `cForeignAid`;
        newLog = `${log}${
          player1 ? "P1" : "P2"
        }: I have a duke, counter Foreign Aid\n`;
        break;

      case "cDuke":
        let logStr = `${log}${player1 ? "P1" : "P2"}: You don't have a duke\n`;

        // check if opponnent has duke
        if (checkInfluence("duke")) {
          logStr += `${player1 ? "P2" : "P1"} has a Duke.\n${
            player1 ? "P1" : "P2"
          } lost a life\n`;
          const lifeRes = removeLife(1, "current");
          newLife = lifeRes.life;
          newCurrentMove = lifeRes.str;
          // swap duke
          // swapCard();
          revTurn = true;
        } else {
          logStr += `${player1 ? "P2" : "P1"} has no Duke.\n${
            player1 ? "P2" : "P1"
          } lost a life\n`;
          const lifeRes = removeLife(1, "");
          newOppLife = lifeRes.life;
          newCurrentMove = lifeRes.str;
          newCoins += 2;
        }
        newLog = logStr;
        break;
      case "duke":
        newCurrentMove = `duke`;
        newLog = `${log}${player1 ? "P1" : "P2"}: I have a Duke\n`;
        newCoins += 3;
        break;
      case "ass":
        newCurrentMove = `ass`;
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
      p1Life = newLife;
      p2Cards = opp["cards"];
      p2Coins = newOppCoins;
      p2Life = newOppLife;
      turn = revTurn ? "Player 1" : "Player 2";
    } else {
      p1Cards = opp["cards"];
      p1Coins = newOppCoins;
      p1Life = newOppLife;
      p2Cards = cards;
      p2Coins = newCoins;
      p2Life = newLife;
      turn = revTurn ? "Player 2" : "Player 1";
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
      currentMove: newCurrentMove,
    };
    console.log(`test`);
    console.log(`${move}: `, JSON.stringify(data));
    updateGameState(data);
  }
  function getImage(influence) {
    console.log(influence);
    switch (influence.slice(0, -1)) {
      case "duke":
        return duke;
      case "ass":
        return ass;
      case "con":
        return con;
    }
  }
  return (
    <div className="grid">
      <div className="box">
        <div>
          <Button text={"sadasdadadad"} />
          Lives: {opp.life} <br />
          Cards: {opp.cards} <br />
          Coins: {opp.coins} <br />
        </div>
        <div className="cards">
          {opp.cards.map((card) => {
            const deadCard = player1
              ? p2XCardsG.includes(card)
              : p1XCardsG.includes(card);
            return (
              <img
                src={getImage(card)}
                className={`  ${deadCard ? `card-dead` : ``}`}
                alt={``}
                onClick={() => {
                  console.log(`card ${card}`);
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="box">
        Turn: ({move ? "Your" : `${sinoNa}'s`} turn)
        {log && <textarea disabled value={log}></textarea>}
      </div>
      <div className="box">
        <div>
          CHALLENGE?
          <Button
            text={`I have a Duke, you can't use Foreign Aid.`}
            btnfunction={() => {
              action("cForeignAid");
              return console.log(`counter foreign aid`);
            }}
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
          <button
            onClick={() => {
              action("pass");
              console.log("no counter");
            }}
            disabled={
              !(
                move &&
                (currentMove === "foreignAid" ||
                  currentMove === "duke" ||
                  currentMove === "cForeignAid")
              )
            }
          >
            Pass.
          </button>
        </div>
        <div>
          MAKE A MOVE
          <button
            onClick={() => {
              console.log("move", move);
              console.log("currentMove", currentMove);
              console.log("player", player);
              console.log("sinoNa", sinoNa);
              console.log("life", life);
              console.log("coins", coins);
              console.log("cards", cards);
              console.log("opp.cards", opp.cards);
              console.log("opp.coins", opp.coins);
              console.log("opp.life", opp.life);
              console.log("p1XCardsG", p1XCardsG);
              console.log("p2XCardsG", p2XCardsG);
              // console.log("currentMove", currentMove);
              // console.log("currentMove", currentMove);
              // console.log("currentMove", currentMove);
              // console.log("currentMove", currentMove);
              // console.log("currentMove", currentMove);
            }}
          >
            asdf
          </button>
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
          {cards.map((card) => {
            const deadCard = player1
              ? p1XCardsG.includes(card)
              : p2XCardsG.includes(card);
            return (
              <img
                src={getImage(card)}
                alt={``}
                className={`${
                  (currentMove === "loseInfluence1" ||
                    currentMove === "loseInfluence2") &&
                  move
                    ? `hover-en`
                    : ``
                } ${deadCard ? `card-dead` : ``}`}
                title={
                  (currentMove === "loseInfluence1" ||
                    currentMove === "loseInfluence2") &&
                  move
                    ? `Give up this card`
                    : ``
                }
                onClick={() => {
                  console.log(`card ${card}`);
                  if (!deadCard) {
                    if (currentMove === "loseInfluence1" && move) {
                      removeCard(card, true);
                    }
                    if (currentMove === "loseInfluence2" && move) {
                      removeCard(card, false);
                    }
                  }
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Playerview;
