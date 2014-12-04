var deck = require('./deck');

var state = {
  deck: deck,
  discard: {
    questions: [],
    answers: []
  },
  users: {},
  userMap: {},
  currentUsers: []
};

module.exports = state;