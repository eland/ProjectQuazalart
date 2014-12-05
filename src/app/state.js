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
    var currentCzar = this.czarQueue.shift();
    this.czarQueue.push(currentCzar);
    return this.users[this.czarQueue[0]];
  },
  getUserScores: function () {
      var userScores = [];
      var users = this.users;
      Object.keys(users).forEach(function (name) {
        if (users[name].isActive) {
          userScores.push({
            "name": name,
            score: users[name].score
          });
        }
      });
      return userScores;
    }
    // activeUserCount: function () {
    //   return Object.keys(users).filter(function (key) {
    //     return this.users[key].isActive === true;
    //   }).length;
    // }
};

module.exports = state;