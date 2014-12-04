var cards = require('../data/cards');

var answers = cards.filter(function (card) {
  return card.cardType === 'A';
});

var questions = cards.filter(function (card) {
  return card.cardType === 'Q' &&
    card.numAnswers === 1; //We'll tackle 2-answer questions later and haikus
});

var state = {
  cards: {
    questions: questions,
    answers: answers
  },
  deck: {
    questions: questions,
    answers: answers
  },
  discard: {
    questions: [],
    answers: []
  },
  users: {}
};

module.exports = state;