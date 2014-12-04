var state = require('../state');
var User = require('../User');
var deck = require('../deck');

module.exports = function (io, socket) {
  return function (name) {
    if (!name) {
      return;
    }

    io.emit('chat message', name + " is logged in");
    if (state.userMap[socket.id] !== name) {
      state.userMap[socket.id] = name;
      if (!state.users.hasOwnProperty(name)) {
        state.users[name] = new User({
          name: name
        });
        state.users[name].hand = deck.dealAnswers(10);
      }
    }

    socket.emit('user', state.users[name]);
  };
};