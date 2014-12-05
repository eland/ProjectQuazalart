var state = require('../state');
var clientState = require('../clientState');
var score = require('../score');
var deck = require('../deck');

module.exports = function (io, socket) {
  return function (cards) {
    var name = state.userMap[socket.id];

    if (state.users[name] && state.users[name].isActive &&
      !state.round.submittedAnswers.hasOwnProperty(name) &&
      state.round.czar.name !== name) {

      state.round.submittedAnswers[name] = cards;
      var user = state.users[name];
      cards.forEach(function (card) {
        for (var i = 0; i < user.hand.length; i++) {
          if (card.id === user.hand[i].id) {
            user.hand.splice(i, 1);
            user.hand.push(deck.dealAnswers(1)[0]);
            socket.emit('user', user);
            break;
          }
        }
      });

      Object.keys(state.round.submittedAnswers).forEach(function (name) {
        if (!state.users[name].isActive) {
          delete state.round.submittedAnswers[name];
        }
      });

      var answersNeeded = 0;
      Object.keys(state.users).forEach(function (name) {
        if (state.users[name].isActive && !state.round.submittedAnswers[name] && state.round.czar.name !== name) {
          answersNeeded++;
        }
      });

      console.log('answers needed:', answersNeeded);
      if (answersNeeded === 0) {
        state.round.czarTime = true;
      }

      clientState.currentRound = state.round;
      clientState.czar = state.round.czar.name;
      clientState.scoreboard = score.scoreboard();
      io.emit('roundUpdated', clientState);
    }
  };
};