const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const {
  addPlayer,
  removePlayer,
  getPlayer,
  getPlayersInRoom,
} = require("./players");
const path = require("path");

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());

// const io = require("socket.io")(3001, {
//   cors: {
//     origin: ["http://localhost:3000"],
//   },
// });

//deployment
// if (process.env.NODE_ENV !== "production")
//   require("dotenv").config({ path: "config.env" });
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/build")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
//   });
// }

// let counter = 0
// io.on("connection", (socket) => {
//   // leave
//   // io.in("room1").socketsLeave("room1");
//   // const socketId = socket.id;
//   // const roomC = io.sockets.adapter.rooms["coup"].length;
//   // console.log(socketId);
//   // console.log(ids);
//   // console.log(ids.length);
//   // if (ids.length > 1) {
//   //   io.emit("start", ids);
//   // }
//   // if (Array.from(roomC[`coup`]).length > 1) {
//   //   console.log(roomC[`coup`]);
//   // }
//   socket.on("join-room", (room, cb) => {
//     socket.join(room);
//     cb(`Joined the Coup room`);
//     // console.log(io.sockets.adapter.rooms["coup"].length);
//   });

//   //   socket.emit("msg", socket.id);
//   //   console.log(socket);
//   //   console.log("asdf");
//   // socket.on("move", (move) => {
//   //   console.log(move);
//   // });
// });
io.on("connection", (socket) => {
  socket.on("join", (data, cb) => {
    let numPplRoom = getPlayersInRoom(data.room).length;
    console.log(`data`, JSON.stringify(data));

    const { error, newPlayer } = addPlayer({
      id: socket.id,
      name: numPplRoom === 0 ? "Player 1" : "Player 2",
      room: data.room,
    });
    console.log(`error`, error);
    console.log(`bewOkayer`, newPlayer);

    if (error) return cb(error);

    socket.join(newPlayer.room);
    const dataroomusers = {
      room: newPlayer.room,
      players: getPlayersInRoom(newPlayer.room),
    };
    console.log(`roomdata: `, JSON.stringify(dataroomusers));
    io.to(newPlayer.room).emit("roomData", dataroomusers);

    socket.emit("currentPlayerData", { name: newPlayer.name });
    cb();
  });

  socket.on("startGame", (gameState) => {
    const user = getPlayer(socket.id);
    if (user)
      io.to(user.room).emit("startGame", { ...gameState, log: "Start Game\n", hiddenLog: "Complete Logs:\n--\nStart Game\n" });
  });

  socket.on("updateGame", (gameState) => {
    const user = getPlayer(socket.id);
    if (user) io.to(user.room).emit("updateGame", gameState);
  });

  // socket.on('sendMessage', (payload, callback) => {
  //     const user = getUser(socket.id)
  //     io.to(user.room).emit('message', {user: user.name, text: payload.message})
  //     callback()
  // })

  socket.on("discon", () => {
    const user = removePlayer(socket.id);
    if (user)
      io.to(user.room).emit("roomData", {
        room: user.room,
        players: getPlayersInRoom(user.room),
      });
  });
});

// console.log(io);

//serve static assets in production
// if (process.env.NODE_ENV === "production") {
//   //set static folder
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

// local
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// heroku
server.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
