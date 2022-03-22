import React, { useEffect, useState } from "react";
import shuffle from "../utils/shuffleDeck";
// import codeGen from "../utils/codeGenerator";
import io from "socket.io-client";
// import queryString from "query-string";
import { Link, useParams } from "react-router-dom";
import Playerview from "./PlayerView";
import CARDS from "../utils/cards";
import Pending from "./Pending";
// sounds
import Howler from "react-howler";
//https://www.youtube.com/watch?v=P3nENGCxAXc
import bgMusic from "../sounds/bg.mp3";
import gobgMusic from "../sounds/gameover.mp3";
import Button from "./tryButton";

let socket;
const PORT = "http://localhost:3001";

const Gamestate = () => {
  const params = useParams();
  //set socket state
  const room = params.code;
  // const [room, setRoom] = useState(params.code);
  const [roomFull, setRoomFull] = useState(false);

  const [players, setplayers] = useState([]);
  const [currentPlayer, setcurrentPlayer] = useState("");

  // main state
  const [gameOver, setgameOver] = useState(false);
  const [winner, setwinner] = useState("");
  const [turn, setturn] = useState("");
  const playerDefaultStats = { cards: [], life: 3, coins: 0 };

  const [p1, setp1] = useState(playerDefaultStats);
  const [p2, setp2] = useState(playerDefaultStats);
  const [p1XCards, setp1XCards] = useState([]);
  const [p2XCards, setp2XCards] = useState([]);
  const [deck, setdeck] = useState([]);
  const [log, setlog] = useState('');
  const [hiddenLog, sethiddenLog] = useState('');
  const [currentMove, setcurrentMove] = useState(``);

  // connection
  useEffect(() => {
    const options = {
      forceNew: true,
      reconnectionAttempts: "Infinity",
      timeout: 10000,
      transports: ["websocket"],
    };
    socket = io.connect(PORT, options);

    socket.emit("join", { room }, (error) => {
      if (error) setRoomFull(true);
    });

    //cleanup on component unmount
    return function cleanup() {
      socket.emit("discon");
      //
      //shut down connnection instance
      socket.off();
    };
  }, [room]);

  // init game state
  useEffect(() => {
    const shuffledCards = shuffle(CARDS);

    //extract first 7 elements to player1Deck
    const p1Cards = shuffledCards.splice(0, 2);
    console.log("p1Cards", p1Cards);
    //extract first 7 elements to player2Deck
    const p2Cards = shuffledCards.splice(0, 2);
    console.log("p2Cards", p2Cards);

    //store all remaining cards into drawCardPile
    const deck = shuffledCards;
    console.log("cards", shuffledCards);

    //send initial state to server
    socket.emit("startGame", {
      gameOver: false,
      turn: "Player 1",
      p1Cards,
      p2Cards,
      deck,
    });
  }, []);

  useEffect(() => {
    socket.on(
      "startGame",
      ({ gameOver, turn, p1Cards, p2Cards, deck, log,hiddenLog }) => {
        console.log("startGame from server");
        setgameOver(gameOver);
        setturn(turn);
        setp1({ ...p1, cards: p1Cards });
        setp2({ ...p2, cards: p2Cards });
        setdeck(deck);
        setlog(log);
        sethiddenLog(hiddenLog);
        setcurrentMove(``);
      }
    );

    socket.on(
      "updateGame",
      ({
        gameOver,
        turn,
        p1Cards,
        p2Cards,
        deck,
        p1Coins,
        p1Life,
        p2Coins,
        p2Life,
        log,
        hiddenLog,
        currentMove,
        winner,
        p1XCards,
        p2XCards,
      }) => {
        console.log("updateGame from server", currentMove);
        gameOver && setgameOver(gameOver);
        // gameOver===true && playGameOverSound()
        winner && setwinner(winner);
        turn && setturn(turn);
        p1Cards &&
          p1Coins !== null &&
          p1Life !== null &&
          setp1({ coins: p1Coins, life: p1Life, cards: p1Cards });
        p2Cards &&
          p2Coins !== null &&
          p2Life !== null &&
          setp2({ coins: p2Coins, life: p2Life, cards: p2Cards });
        deck && setdeck(deck);
        log && setlog(log);
        hiddenLog && sethiddenLog(hiddenLog);
        p1XCards && setp1XCards(p1XCards);
        p2XCards && setp2XCards(p2XCards);
        setcurrentMove(currentMove);
      }
    );

    socket.on("roomData", ({ players }) => {
      setplayers(players);
    });

    socket.on("currentPlayerData", ({ name }) => {
      setcurrentPlayer(name);
    });
  }, []);

  // game over check
  // const checkGameOver = (arr) => {
  //   return arr.length === 1;
  // };

  // const checkWinner = (arr, player) => {
  //   return arr.length === 1 ? player : "";
  // };
  // useEffect(() => {
  //   console.log(JSON.stringify(players));
  // }, [players]);
  // useEffect(() => {
  //   console.log(`gameOver`, gameOver);
  //   console.log(`turn`, turn);
  //   console.log(`p1Cards`, JSON.stringify(p1));
  //   console.log(`p2Cards`, JSON.stringify(p2));
  //   console.log(`deck`, deck);
  //   console.log(`log`, log);
  // }, [gameOver, turn, p1, p2, deck, log]);
  // console.log(`game`);

  function updateGameState(data) {
    socket.emit("updateGame", data);
    console.log("updated game state from server");
  }
  return (
    <div>
      {/* game */}
      {!roomFull ? (
        <>
          {/* <h1>Game Code: {room}</h1>
          {players.length === 1 && currentPlayer === "Player 2" && (
            <h1 className="">Player 1 has left the game.</h1>
          )}
          {players.length === 1 && currentPlayer === "Player 1" && (
            <h1 className="">Waiting for Player 2 to join the game.</h1>
          )} */}
          {players.length === 1 && (
            <Pending code={room} currentPlayer={currentPlayer} />
          )}
          {/* test  */}
          {/* {true && ( */}
          {players.length === 2 && (
            <>
              {/* {!gameOver && (
                <div>
                  {winner !== "" && (
                    <div className="game-over">
                      <h1>GAME OVER</h1>
                      <h2>{winner} wins!</h2>
                    </div>
                  )}
                </div>
              )} */}
              {gameOver && (
                <div>
                  {winner !== "" && (
                    <div className="game-over-container">
                      <div className="game-over"></div>
                      <div className="float-above">
                        <h1>GAME OVER</h1>
                        <h2>{winner} wins!</h2>
                        <Link to={`/`}>
                          <Button text={`PLAY AGAIN`} buttonDes={`button-44`} />
                        </Link>
                        {hiddenLog && <textarea disabled value={hiddenLog}></textarea>}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Playerview
                player={currentPlayer}
                sinoNa={turn}
                coins={currentPlayer === "Player 1" ? p1["coins"] : p2["coins"]}
                cards={currentPlayer === "Player 1" ? p1["cards"] : p2["cards"]}
                life={currentPlayer === "Player 1" ? p1["life"] : p2["life"]}
                opp={currentPlayer === "Player 1" ? p2 : p1}
                log={log}
                hiddenLog={hiddenLog}
                updateGameState={updateGameState}
                deck={deck}
                currentMove={currentMove}
                p1XCardsG={p1XCards}
                p2XCardsG={p2XCards}
              />
              <Howler
                src={bgMusic}
                playing={!gameOver}
                loop={true}
                volume={0.1}
              />
              <Howler
                src={gobgMusic}
                playing={gameOver}
                loop={true}
                volume={0.1}
              />
            </>
          )}
        </>
      ) : (
        <>
          <h1>Room full</h1>
          <Link to={`/`}>
            <button className="">QUIT</button>
          </Link>
        </>
      )}
      {/* <Link to="/">
        <button className="game-button red">QUIT</button>
      </Link> */}
    </div>
  );
  // return <div>adf</div>;
};

export default Gamestate;
