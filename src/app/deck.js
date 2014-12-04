var cards = require('../data/cards');

function deck() {
  this.questions = [];
  this.answers = [];

  this.populate = function () {
    this.answers = cards.filter(function (card) {
      return card.cardType === 'A';
    });

    this.questions = cards.filter(function (card) {
      return card.cardType === 'Q' &&
        card.numAnswers === 1; //We'll tackle 2-answer questions later and haikus
    });
  };

  this.shuffle = function () {
    this.questions = shuffle(this.questions);
    this.answers = shuffle(this.answers);
  };

  this.dealAnswers = function (number) {
    number = number || 1;
    var cards = [];
    for (var i = 0; i < number; ++i) {
      cards.push(this.answers.pop());
    }
    //todo: shuffle used answers if need more cards?
    return cards;
  };

  this.dealQuestion = function () {
    return this.questions.pop();
  };
}

//Fisher-Yates shuffle
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


module.exports = new deck();