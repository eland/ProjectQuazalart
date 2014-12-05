var deck = require('./deck');

var state = {
  deck: deck,
  discard: {
    questions: [],
    answers: []
  },
  users: {},
  userMap: {},
  round: {},
  czarQueue: [],
  nextCzar: function () {
    console.log(this.czarQueue);
    var currentCzar = this.czarQueue.shift();
    this.czarQueue.push(currentCzar);
    console.log(this.czarQueue);
    return this.users[this.czarQueue[0]];
  },
  newGame: function () {
    this.deck = deck;
    this.users = {};
    this.userMap = {};
    this.round = {};
    this.czarQueue = [];
  }
};

module.exports = state;