var state = require('../state');
var score = require('../score');
var clientState = require('../clientState');
var startRound = require('../actions/startRound');
var initGame = require('../actions/initGame');

module.exports = function (io) {
  return function (name) {
    state.users[name].score++;
    var selectedAnswers = state.round.submittedAnswers[name];
    state.round.winningAnswers = selectedAnswers;
    state.round.winner = name;
    score.rounds.push(state.round);
    clientState.scoreboard = score.scoreboard();
    if (state.users[name].score > 2) {
      io.emit("gameOver", score.rounds.filter(function (round) {
        return round.winner === name;
      }));
      initGame();
      return;
    } else {
      startRound();
      clientState.currentRound = state.round;
      clientState.czar = state.round.czar.name;
      console.log('answer chosen! Round winner:', name);
      io.emit('roundUpdated', clientState);
    }
  };
};