var isGameOver = false;
var socket = io();
socket.on('chat message', function (msg) {
  $('#messages').append($('<li>').text(msg));
  $("#messages").animate({
    scrollTop: $("#messages")[0].scrollHeight
  }, 200);
});

$('form').submit(function () {
  var message = $('#message-input').val();
  if (message) {
    socket.emit('chat message', message);
  }
  $('#message-input').val('');
  return false;
});

socket.on('authenticate', function () {
  var name = localStorage.getItem('name');
  if (!name) {
    name = prompt('Please put in your username');
    localStorage.setItem('name', name);
  }

  socket.emit('login', name);
});

var user;
socket.on('user', function (_user) {
  user = _user;
  $('.hand').empty();
  user.hand.forEach(function (card) {
    $('.hand').append($('<div class="card hand-card">').data('card', card).text(
      card.text));
  });
});

function appendAnswer(answers, name, placeholder) {
  var answerGroup = $('<div>');
  if (answers.length > 1) {
    answerGroup.addClass('clearfix');
    answerGroup.addClass('answer-group');
  }
  answers.forEach(function (answer) {
    console.log(answer || placeholder);
    answerGroup.append($('<div class="card answer-card">').data('name', name).text(placeholder || answer.text));
  });

  $('.answers').append(answerGroup);
}

var round = {};
socket.on('roundUpdated', function (clientState) {
  if (isGameOver) {
    return;
  }
  round = clientState.currentRound;
  $('.current-question').text(round.question.text);
  $('.answers').empty();
  Object.keys(round.submittedAnswers).forEach(function (key) {
    if (round.czarTime) {
      appendAnswer(round.submittedAnswers[key], key);
    } else {
      appendAnswer(round.submittedAnswers[key], key, "Cards Against Humanity");
    }
  });
  if (user.name === clientState.czar) {
    $('.hand-card').addClass('grey');
  } else {
    $('.hand-card').removeClass('grey');
  }

  UpdateScore(clientState);
});

var clientState = {};

function UpdateScore(_clientState) {
  if (isGameOver) {
    return;
  }
  clientState = _clientState;
  var scoreboard = clientState.scoreboard;
  var scorelist = {};
  $('.scores').empty();
  scoreboard.currentScores.forEach(function (userScore) {
    scorelist[userScore.name] = [];
  });

  scoreboard.rounds.forEach(function (round) {
    Object.keys(scorelist).forEach(function (name) {
      if (round.winner === name) {
        scorelist[name].push('+');
      } else {
        scorelist[name].push('-');
      }
    });
  });

  Object.keys(scorelist).forEach(function (name) {
    var score = $('<li class="score">');
    if (name === clientState.czar) {
      score.addClass('czar');
    }
    $('.scores').append(score.text(name + ': '));
    scorelist[name].forEach(function (scores) {
      score.append($('<span>').text(scores));
    });
  });

  var numberOfRounds = scoreboard.rounds.length;
  if (numberOfRounds > 0) {
    var lastRound = scoreboard.rounds[numberOfRounds - 1];
    $('.last-question').text(lastRound.question.text);
    $('.last-answer').empty();
    lastRound.winningAnswers.forEach(function (answer) {
      $('.last-answer').append('<div class="card">' + answer.text + '</div>');
    });

    $('.last-winner').text(lastRound.winner);
  } else {
    $('.last-question, .last-answer, .last-winner').text('');
  }
}

socket.on('gameOver', function (rounds) {
  var winner = rounds[0].winner;
  $('body').html('<h1><pre>The winner is: ' + winner + '</pre></h1>');
  rounds.forEach(function (round) {
    $('body').append($('<div style="clear: both">'));
    $('body').append($('<div class="question card black_card">').text(round.question.text));
    round.winningAnswers.forEach(function (answer) {
      $('body').append($('<div class="card">').text(answer.text));
    });

  });
  isGameOver = true;
});
var selectedAnswers = [];
$(document).on('click', '.hand-card', function () {
  var round = clientState.currentRound;
  if (round.submittedAnswers.hasOwnProperty(user.name) || clientState.czar === user.name) {
    return;
  }
  element = $(this);
  var card = element.data('card');
  if (element.hasClass('selected-hand-card')) {
    var indexOfRemovedCard = 0;
    console.log(selectedAnswers);
    selectedAnswers.forEach(function (answer, index) {
      console.log(answer.id, card.id);
      if (answer.id === card.id) {
        indexOfRemovedCard = index;
      }
      element.removeClass('selected-hand-card');
      return false;
    });
    console.log('removing ', indexOfRemovedCard);
    selectedAnswers.splice(indexOfRemovedCard, 1);
  } else {
    element.addClass('selected-hand-card');
    selectedAnswers.push(card);
  }

  if (round.question.numAnswers === $('.selected-hand-card').length) {
    socket.emit('answersSubmitted', selectedAnswers);
    selectedAnswers = [];
  }
  return false;
});

$(document).on('click', '.answer-card', function () {
  if (user && user.name === round.czar.name && round.czarTime) {
    element = $(this);
    socket.emit('answerChosen', element.data('name'));
  }
});