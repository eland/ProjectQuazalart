function Round(options) {
  this.submittedAnswers = options.submittedAnswers || {};
  this.czar = options.czar || {};
  this.question = options.question || {};
}

module.exports = Round;