var state = require('../state');
var score = require('../score');
var startRound = require('../actions/startRound');
var initGame = require('../actions/initGame');

module.exports = function (io) {
  return function (name) {
    state.users[name].score++;
    var selectedAnswer = state.round.submittedAnswers[name];
    state.round.winningAnswer = selectedAnswer;
    state.round.winner = name;
    score.rounds.push(state.round);
    io.emit('scoreUpdated', score.scoreboard());
    if (state.users[name].score > 2) {
      io.emit("gameOver", score.rounds.filter(function (round) {
        return round.winner === name;
      }));
      initGame();
      return;
    } else {
      startRound();

      console.log('answer chosen! Round winner:', name);
      io.emit('roundUpdated', state.round);
    }
  };
};