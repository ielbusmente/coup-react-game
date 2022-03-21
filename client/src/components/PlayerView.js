import React, { useEffect, useState } from "react";
import "../App.css";

//refactor
import duke from "../cards/duke-edited.jpeg";
import ass from "../cards/assassin-edited.jpeg";
import con from "../cards/contessa-edited.jpeg";
import back from "../cards/backcards.png";

// components
import Button from "./tryButton";
// utils
import shuffle from "../utils/shuffleDeck";
import formatCard from "../utils/formatCard";
import { Link } from "react-router-dom";

// sounds
//https://www.youtube.com/watch?v=jlcLzC5bIf0&t=15s
import assMusic from "../sounds/ass.mp3";
import incMusic from "../sounds/income.mp3";
// import dukMusic from "../sounds/duke.mp3";
import conMusic from "../sounds/cont.mp3";
import counMusic from "../sounds/counter.mp3";

import Howler from "react-howler";

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

  // music
  const [assassinMusic, setassassinMusic] = useState(false);
  const [counterMusic, setcounterMusic] = useState(false);
  const [currentLife, setcurrentLife] = useState(3);
  // const [dukeMusic, setdukeMusic] = useState(false);
  const [contessaMusic, setcontessaMusic] = useState(false);
  const [incomeMusic, setincomeMusic] = useState(false);
  const [loseLife, setloseLife] = useState(false);

  //to flip reveal the card
  const [swapCardStyle, setswapCardStyle] = useState("");
  // const [swap, setswap] = useState("");
  /**kung sino na */
  const move = player === sinoNa;
  /**player 1 ung gagalaw */
  const player1 = player === "Player 1";
  /**player string "P1:" kung player 1 current player, else "P2:" */
  const terP = `${player1 ? "P1" : "P2"}: `;
  /**player string "P2:" kung player 1 current player, else "P1:" */
  const terPR = `${player1 ? "P2" : "P1"}: `;

  // useEffect(() => {
  //   effect
  //   return () => {
  //     cleanup
  //   };
  // }, [input]);
  // check game over
  useEffect(() => {
    if (life < 1) {
      updateGameState({
        gameOver: true,
        winner: player1 ? "Player 2" : "Player 1",
      });
    }
    // console.log(`life`, life);
    // console.log(`loseLife`, loseLife);
    if (life !== currentLife) {
      setcurrentLife(life);
      setloseLife(true);
    }
  }, [life]);
  // for the card to flip back down
  useEffect(() => {
    if (currentMove === "") setswapCardStyle("");
    // life animation
    // if (currentMove.includes("loselife")) {
    //   console.log(currentMove);
    //   // currentMove = currentMove.slice(8);
    //   // console.log(currentMove);

    //   setloseLife(true);
    // }
  }, [currentMove]);

  // test functions
  function endGame() {
    updateGameState({ gameOver: true, winner: "asdf" });
  }

  /**removes (minusLife) life from (kanino)
   * -minusLife wants number
   * -kanino wants string "current" or ""
   */
  function removeLife(minusLife, kanino) {
    const ako = kanino === "current"; // player target
    // ako && setloseLife(true);
    //current player's/opponent's life minus minusLife
    const newLife = (ako ? life : opp["life"]) - minusLife;
    //if newLife is less than 2, meaning 2 life na lang siya before mabawasan,
    //bawas influence
    return {
      life: newLife,
      str: `${
        newLife < 2
          ? ako
            ? "loseInfluence1" //lose influence current player
            : "loseInfluence2" //lose influence next player
          : ""
      }`,
    };
  }
  /**check a specific influence card of opponent*/
  function checkInfluence(card) {
    let cardRet;
    const exists = opp["cards"].some((c) => {
      const returnTheCard =
        c.includes(card) && !(player1 ? p2XCardsG : p1XCardsG).includes(c);
      cardRet = returnTheCard ? c : "";
      return returnTheCard;
    });
    // console.log(cardRet);
    return { exists, card: cardRet };
  }
  /**swaps (card) from the current player's hand with a card from the deck */
  function swapCard(card) {
    const rev = currentMove.includes(`from`);
    let newCards = cards;
    let newDeck = deck;
    const swapIndex = newCards.indexOf(card); //index ng tatanggalin na card
    const cardStr = card.slice(0, -1); //card string
    let newLog = `${log}${terP}Put ${formatCard(cardStr)} in the deck\n`;
    //delete card from hand
    delete newCards[swapIndex];
    // push card from hand to the draw pile
    newDeck.push(card);
    // test
    newLog += `Deck: ${newDeck}\n`;
    // shuffle deck
    newDeck = shuffle(newDeck);
    newLog += `Deck Shuffled.\n`;
    // test
    newLog += `Deck: ${newDeck}\n`;
    // draw card and give card to player
    const newCard = newDeck.pop();
    newCards[swapIndex] = newCard;

    newLog += `${terP}Given a card from the deck.\n`;
    // test
    newLog += `${terP}got ${newCard}\n`;

    // update game state
    let p1Cards, p1Coins, p1Life, p2Cards, p2Coins, p2Life, turn;

    if (player1) {
      p1Cards = newCards;
      p1Coins = coins;
      p1Life = life;
      turn = rev ? "Player 2" : "Player 1";
    } else {
      p2Cards = newCards;
      p2Coins = coins;
      p2Life = life;
      turn = rev ? "Player 1" : "Player 2";
    }
    const data = {
      turn,
      deck: newDeck,
      p1Cards: p1Cards,
      p1Coins: p1Coins,
      p1Life: p1Life,
      p2Cards: p2Cards,
      p2Coins: p2Coins,
      p2Life: p2Life,
      log: newLog,
      currentMove: "",
    };
    console.log(`swap card-${card}: `, JSON.stringify(data));
    updateGameState(data);
  }
  /**remove (card) of the current player
   * -(rev) determines who is the next
   */
  function removeCard(card, rev) {
    let newCurrentMove = currentMove.slice(14);
    if (
      newCurrentMove === "fromcDuke" ||
      newCurrentMove === "fromasspass" ||
      newCurrentMove === "fromcAss"
    )
      newCurrentMove = "";
    let newCards = cards;
    let newXCards = player1 ? p1XCardsG : p2XCardsG;
    // puts card in current players graveyard
    newXCards.push(card);
    let newLog = `${log}${terP}Lost an Influence.\n`;
    let p1Cards,
      p1Coins,
      p1Life,
      p2Cards,
      p2Coins,
      p2Life,
      turn,
      p1XCards,
      p2XCards;
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
      currentMove: newCurrentMove,
    };
    console.log(`card-${card}-rev-${rev}: `, JSON.stringify(data));
    updateGameState(data);
  }
  /**main function called when a player makes a move */
  function action(act) {
    //current player
    let newCoins = coins;
    let newLife = life;
    // opponent
    let newOppCoins = opp["coins"];
    let newOppLife = opp["life"];
    //game data
    let newLog = log;
    let revTurn = false;
    let newCurrentMove = "";

    switch (act) {
      // Move
      case "income":
        newCoins += 1;
        newLog += `${terP}Income\n`;
        break;
      case "foreignAid":
        newCurrentMove = `foreignAid`;
        newLog += `${terP}Foreign Aid\n`;
        break;
      case "duke":
        newCurrentMove = `duke`;
        newLog += `${terP}I have a Duke\n`;
        break;
      case "ass":
        newCurrentMove = `ass`;
        newLog += `${terP}Assassinate Influence\n`;
        newCoins -= 3;
        break;
      case "coup":
        newCoins -= 7;
        newLog += `${terP}Coup\n`;
        const lifeRes = removeLife(1, "");
        newOppLife = lifeRes.life;
        newCurrentMove = lifeRes.str;
        break;
      // Counter/Response
      case "pass":
        newLog += `${terP}Ok\n`;
        if (currentMove === "foreignAid") {
          newOppCoins += 2;
          revTurn = true;
        }
        if (currentMove === "duke") {
          newOppCoins += 3;
          revTurn = true;
        }
        if (currentMove === "ass") {
          const lifeRes = removeLife(1, "current");
          newLife = lifeRes.life;
          newCurrentMove = `${lifeRes.str}`;
          if (newCurrentMove.includes("loseInfluence1")) {
            newCurrentMove += "fromasspass";
          }
          revTurn = true;
        }
        break;
      case "cForeignAid":
        newCurrentMove = `cForeignAid`;
        newLog += `${terP}I have a duke, counter Foreign Aid\n`;
        break;
      case "cDuke":
        newLog += `${terP}You don't have a duke\n`;
        const dukeMove = currentMove === "duke" ? "duke" : "";
        // check if opponnent has duke
        const influenceDuke = checkInfluence("duke");
        // console.log("currentMove", currentMove);
        if (influenceDuke.exists) {
          newLog += `${terPR}has a Duke.\n${terP}lost a life\n`;
          const lifeRes = removeLife(1, "current");
          newLife = lifeRes.life;
          newCurrentMove = `${lifeRes.str}swap${influenceDuke.card}`;
          if (dukeMove) {
            newOppCoins += 3;
            newCurrentMove += `fromduke`;
          }
          setswapCardStyle(influenceDuke.card);
          // swap duke
          // swapCard();
          if (newCurrentMove.includes("loseInfluence1")) revTurn = true;
        } else {
          newLog += `${terPR}has no Duke.\n${terPR}lost a life\n`;
          if (dukeMove) revTurn = true;
          const lifeRes = removeLife(1, "");
          newOppLife = lifeRes.life;
          newCurrentMove = lifeRes.str;
          if (lifeRes.str.includes(`loseInfluence2`)) {
            revTurn = false;
            newCurrentMove += "fromcDuke";
          }
          newCoins += 2;
        }
        break;
      case "cAss":
        newLog += `${terP}You don't have an assassin\n`;
        // newCurrentMove = `cAss`;
        const influenceAss = checkInfluence("ass");
        if (influenceAss.exists) {
          newLog += `${terPR}has an Assassin.\n${terP}lost 2 lives\n`;
          const lifeRes = removeLife(2, "current");
          newLife = lifeRes.life;
          newCurrentMove = `${lifeRes.str}swap${influenceAss.card}`;
          newCurrentMove += "fromcAss";
          setswapCardStyle(influenceAss.card);
          // if (newCurrentMove.includes("loseInfluence1"))
          // revTurn = true;
          console.log("counter assassin liferes");
          console.log(JSON.stringify(lifeRes));
          if (newCurrentMove.includes("loseInfluence1")) revTurn = true;
        } else {
          const lifeRes = removeLife(1, "");
          newOppLife = lifeRes.life;
          newCurrentMove = lifeRes.str;
          console.log(JSON.stringify(lifeRes));

          if (!lifeRes.str.includes(`loseInfluence2`)) {
            revTurn = true;
          } else {
            newCurrentMove += "fromcAss";
          }
        }

        break;
      case "con":
        newLog += `${terP}I have a Contessa\n`;
        newCurrentMove = "con";
        break;

      case "cCon":
        newLog += `${terP}You don't have a Contessa\n`;
        // newCurrentMove = "cCon";
        const influenceCon = checkInfluence("con");
        if (influenceCon.exists) {
          newLog += `${terPR}has a Contessa\n`;
          const lifeRes = removeLife(1, "current");
          newLife = lifeRes.life;
          newCurrentMove = `${lifeRes.str}swap${influenceCon.card}`;
          setswapCardStyle(influenceCon.card);
          if (newCurrentMove.includes("loseInfluence1")) revTurn = true;
        } else {
          newLog += `${terPR}has no Contessa\n`;
          const lifeRes = removeLife(2, "");
          newOppLife = lifeRes.life;
          newCurrentMove = `${lifeRes.str}`;
        }
        break;
      default:
        console.error("Invalid Move");
    }

    let p1Cards, p1Coins, p1Life, p2Cards, p2Coins, p2Life, turn;

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
    console.log(`${act}: `, JSON.stringify(data));
    updateGameState(data);
  }
  function getImage(influence) {
    // console.log(influence);
    switch (influence.slice(0, -1)) {
      case "duke":
        return duke;
      case "ass":
        return ass;
      case "con":
        return con;
      default:
        return back;
    }
  }
  return (
    <div className={`grid ${loseLife ? `lose-life` : ``}`}>
      {/* first box  */}
      <div className="box">
        <div>
          Lives: {opp.life} <br />
          Cards: {opp.cards} <br />
          Coins: {opp.coins} <br />
        </div>
        <div className="cards">
          {opp["cards"].map((card) => {
            const deadCard = player1
              ? p2XCardsG.includes(card)
              : p1XCardsG.includes(card);
            return (
              <div
                className={`flip-card ${
                  swapCardStyle === card || deadCard ? `flip` : ""
                }`}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-back">
                    <img src={back} alt={``} />
                  </div>
                  <div className="flip-card-front">
                    <img
                      src={
                        swapCardStyle === card || deadCard
                          ? getImage(card)
                          : back
                      }
                      alt={``}
                      className={`${deadCard ? `card-dead` : ``} `}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* second box  */}
      <div className="box">
        Turn: ({move ? "Your" : `${sinoNa}'s`} turn)
        {log && <textarea disabled value={log}></textarea>}
      </div>
      <div className="box">
        <div>
          CHALLENGE?
          {/* test  */}
          {/* <button onClick={endGame}>End Game</button> */}
          <Button
            text={`I have a Duke, you can't use Foreign Aid.`}
            btnfunction={() => {
              action("cForeignAid");
              setcounterMusic(true);
              return console.log(`counter foreign aid`);
            }}
            buttonDes={`button-43`}
            disabled={currentMove !== "foreignAid" || !move}
          />
          <Button
            text={`You don't have a Duke.`}
            btnfunction={() => {
              action("cDuke");
              setcounterMusic(true);
              return console.log(`counter duke`);
            }}
            disabled={
              !(
                move &&
                (currentMove === "cForeignAid" || currentMove === "duke")
              )
            }
            buttonDes={`button-44`}
          />
          <Button
            text={`You don't have an Assassin.`}
            btnfunction={() => {
              action("cAss");
              setcounterMusic(true);
              console.log("counter assassin");
            }}
            disabled={!(move && currentMove === "ass")}
            buttonDes={`button-43`}
          />
          <Button
            text={`I have a Contessa, you can't assassinate an influence.`}
            btnfunction={() => {
              action("con");
              setcontessaMusic(true);
              console.log("counter assassin w contessa");
            }}
            disabled={!(move && currentMove === "ass")}
            buttonDes={`button-44`}
          />
          <Button
            text={`You don't have a Contessa.`}
            btnfunction={() => {
              action("cCon");
              setcounterMusic(true);
              console.log("counter contessa");
            }}
            disabled={!(move && currentMove === "con")}
            buttonDes={`button-43`}
          />
          <Button
            text={`Pass.`}
            btnfunction={() => {
              action("pass");
              console.log("no counter");
            }}
            disabled={
              !(
                move &&
                (currentMove === "foreignAid" ||
                  currentMove === "duke" ||
                  currentMove === "ass" ||
                  currentMove === "con" ||
                  currentMove === "cForeignAid")
              )
            }
            buttonDes={`button-44`}
          />
          {/* <button onClick={() => console.log("no counter")} disabled={true}>
            Pass.
          </button> */}
        </div>

        <div>
          MAKE A MOVE
          {/* test  */}
          {/* <button
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
              console.log("swapCardStyle", swapCardStyle);
              // console.log("gameOver", gameOver);
              // console.log("winner", winner);
            }}
          >
            show state
          </button> */}
          <Button
            text={`Income`}
            btnfunction={() => {
              action("income");
              setincomeMusic(true);
            }}
            disabled={!(move && currentMove === "")}
            buttonDes={`button-43`}
          />
          <Button
            text={`Foreign Aid`}
            btnfunction={() => {
              setincomeMusic(true);
              action("foreignAid");
            }}
            disabled={!(move && currentMove === "")}
            buttonDes={`button-44`}
          />
          <Button
            text={`I have a Duke`}
            btnfunction={() => {
              action("duke");
              // setdukeMusic(true);
            }}
            disabled={!(move && currentMove === "")}
            buttonDes={`button-43`}
          />
          <Button
            text={`Assassinate`}
            btnfunction={() => {
              action("ass");
              setassassinMusic(true);
            }}
            disabled={!(move && currentMove === "") || coins < 3}
            buttonDes={`button-44`}
          />
          <Button
            text={`Coup`}
            btnfunction={() => action("coup")}
            disabled={!(move && currentMove === "") || coins < 7}
            buttonDes={`button-43`}
          />
          <Button
            text={`Swap`}
            btnfunction={() => {
              // setswap(true);
              let string = currentMove.slice(4);
              if (currentMove.includes("from")) {
                string = string.slice(0, string.indexOf("from"));
              }
              // const stringRef = string.slice(string.indexOf("from") + 4);
              console.log(`currentMove`);
              console.log(currentMove);
              console.log(`string`);
              console.log(string);
              // console.log(currentMove.includes(`swap`));
              // console.log(move && currentMove.includes(`swap`));
              swapCard(string);
            }}
            disabled={
              !(
                move &&
                !(currentMove && currentMove.includes("loseInfluence1")) &&
                currentMove &&
                currentMove.includes(`swap`)
              )
            }
            buttonDes={"button-44"}
          />
        </div>
      </div>
      <div className={`box`}>
        {/* <Card /> */}
        <div>
          {player}
          <br />
          Lives: {life} <br />
          Cards: {cards} <br />
          Coins: {coins} <br />
          {/* <button onClick={() => setloseLife(true)}>set bg</button> */}
        </div>
        <div className="cards">
          {cards.map((card) => {
            const currentLoseInfluence1 =
              currentMove && currentMove.includes("loseInfluence1");
            const currentLoseInfluence2 =
              currentMove && currentMove.includes("loseInfluence2");
            const deadCard = player1
              ? p1XCardsG.includes(card)
              : p2XCardsG.includes(card);
            return (
              <div
                className={`current-player-card ${
                  (currentLoseInfluence1 || currentLoseInfluence2) &&
                  move &&
                  !deadCard
                    ? `card-container`
                    : ``
                }`}
              >
                <div className="current-inner">
                  <div className="current-face">
                    <img
                      src={getImage(card)}
                      alt={``}
                      className={`${
                        currentMove && currentMove.includes(card)
                          ? `swap-effect`
                          : ""
                      }  ${
                        (currentLoseInfluence1 || currentLoseInfluence2) &&
                        move &&
                        !deadCard
                          ? `hover-en`
                          : ``
                      } ${deadCard ? `card-dead` : ``}`}
                      title={
                        (currentLoseInfluence1 || currentLoseInfluence2) &&
                        move &&
                        !deadCard
                          ? `Give up this card`
                          : ``
                      }
                      onClick={() => {
                        console.log(`card ${card}`);
                        if (!deadCard) {
                          if (currentLoseInfluence1 && move) {
                            removeCard(
                              card,
                              !currentMove.includes("fromasspass")
                            );
                          }
                          if (currentLoseInfluence2 && move) {
                            removeCard(
                              card,
                              currentMove.includes("fromcDuke") ||
                                currentMove.includes("fromcAss")
                            );
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Link to={`/`}>
          <button className="">QUIT</button>
        </Link>

        <Howler
          src={assMusic}
          playing={assassinMusic}
          onEnd={() => setassassinMusic(false)}
          volume={0.3}
        />
        <Howler
          src={incMusic}
          playing={incomeMusic}
          onEnd={() => setincomeMusic(false)}
          volume={0.3}
        />
        {/* <Howler
          src={dukMusic}
          playing={dukeMusic}
          onEnd={() => setdukeMusic(false)}
        /> */}
        <Howler
          src={conMusic}
          playing={contessaMusic || loseLife}
          onEnd={() => {
            setcontessaMusic(false);
            setloseLife(false);
          }}
          volume={0.3}
        />
        <Howler
          src={counMusic}
          playing={counterMusic}
          onEnd={() => setcounterMusic(false)}
          volume={0.3}
        />
      </div>
    </div>
  );
};

export default Playerview;
