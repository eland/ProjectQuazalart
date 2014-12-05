var deck = require('../deck');
var state = require('../state');
var Round = require('../round');
var score = require('../score');

function initGame() {
  deck.populate();
  deck.shuffle();
  score.rounds = [];
  state.newGame();
  state.round = new Round({
    question: deck.dealQuestion()
  });
}

module.exports = initGame;