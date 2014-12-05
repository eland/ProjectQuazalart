var state = require('../state');
var Round = require('../round');
var deck = require('../deck');

function startRound() {
  var newCzar = state.nextCzar();
  state.round = new Round({
    question: deck.dealQuestion(),
    czar: newCzar
  });
}

module.exports = startRound;