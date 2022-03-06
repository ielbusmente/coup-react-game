// import logo from "./logo.svg";
// import "./App.css";
// import { useEffect, useState } from "react";
// import duke from "./cards/duke.jpeg";
// import { io } from "socket.io-client";

// // const socket = io("http://localhost:3001");

// function App() {
//   const [gameStart, setgameStart] = useState(false);
//   // const [move, setMove] = useState("");
//   // function confirmMove() {
//   //   socket.emit("move", move);
//   // }
//   const cards = [
//     "ass1",
//     "ass2",
//     "ass3",
//     "duke1",
//     "duke2",
//     "duke3",
//     "con1",
//     "con2",
//     "con3",
//   ];
//   useEffect(() => {
//     // socket.on("start", (arr) => {
//     //   if (arr[0] === socket.id || arr[1] === socket.id) {
//     //     console.log("start game");
//     //     setgameStart(true);
//     //   }
//     // });
//   }, []);

//   return gameStart ? (
//     <div className="grid">
//       <div className="box">a</div>
//       <div className="box">
//         Turn: 1 (P1's turn)
//         <textarea disabled></textarea>
//       </div>
//       <div className="box">
//         <button>Move 1</button>
//         <button>Move 2</button>
//         <button>Move 3</button>
//         <button>Move 4</button>
//       </div>
//       <div className="box">
//         <div>
//           Lives: 3 <br /> Coins: 0
//         </div>
//         <div className="cards">
//           <img src={duke} alt={``} />
//           <img src={duke} alt={``} />
//         </div>
//       </div>
//     </div>
//   ) : (
//     <div>hello world {`game: ${gameStart}`}</div>
//   );
// }

// export default App;

// // <div className="App">
// //   <header className="App-header">
// //     <img src={logo} className="App-logo" alt="logo" />
// //     <p>
// //       Edit <code>src/App.js</code> and save to reload.
// //     </p>
// //     <a
// //       className="App-link"
// //       href="https://reactjs.org"
// //       target="_blank"
// //       rel="noopener noreferrer"
// //     >
// //       Learn React
// //     </a>
// //     <input
// //       placeholder="Move"
// //       value={move}
// //       onChange={function (e) {
// //         setMove(e.target.value);
// //       }}
// //     />
// //     <button onClick={confirmMove}>Confirm</button>
// //   </header>
// // </div>

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Lobby from "./components/Lobby";
import GameState from "./components/GameState";

const App = () => {
  return (
    <BrowserRouter className="App">
      <Routes>
        <Route path="/" exact element={<Lobby />} />
        <Route path="/play/:code" element={<GameState />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
