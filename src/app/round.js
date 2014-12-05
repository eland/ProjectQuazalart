function Round(options) {
  this.submittedAnswers = options.submittedAnswers || {};
  this.czar = options.czar || {};
  this.question = options.question || {};
  this.czarTime = options.czarTime || false;
  this.winningAnswers = [];
  this.winner = '';
}

module.exports = Round;