var state = require('./state');

var score = {
  rounds: [],
  userScores: function () {
    var userScores = [];
    var users = state.users;
    Object.keys(users).forEach(function (name) {
      if (users[name].isActive) {
        userScores.push({
          "name": name,
          score: users[name].score
        });
      }
    });
    return userScores;
  },
  scoreboard: function () {
    return {
      rounds: this.rounds,
      currentScores: this.userScores()
    };
  }
};

module.exports = score;