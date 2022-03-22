const users = [];

const addPlayer = ({ id, name, room }) => {
  const numberOfUsersInRoom = users.filter((user) => user.room === room).length;
  if (numberOfUsersInRoom === 2) return { error: "Room full" };

  const newPlayer = { id, name, room };
  users.push(newPlayer);
  return { newPlayer };
};

const removePlayer = (id) => {
  const removeIndex = users.findIndex((user) => user.id === id);

  if (removeIndex !== -1) return users.splice(removeIndex, 1)[0];
};

const getPlayer = (id) => {
  return users.find((user) => user.id === id);
};

const getPlayersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = { addPlayer, removePlayer, getPlayer, getPlayersInRoom };
