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

var round = {};
socket.on('roundUpdated', function (_round) {
  if (isGameOver) {
    return;
  }
  round = _round;
  $('.current-question').text(round.question.text);
  $('.answers').empty();
  Object.keys(round.submittedAnswers).forEach(function (key) {
    if (round.czarTime) {
      $('.answers').append($('<div class="card answer-card">').data('name', key).text(round.submittedAnswers[
          key]
        .text));
    } else {
      $('.answers').append($('<div class="card answer-card">').text("Cards Against Humanity"));
    }
  });
  if (user.name === round.czar.name) {
    $('.hand-card').addClass('grey');
  } else {
    $('.hand-card').removeClass('grey');
  }
});

socket.on('scoreUpdated', function (scoreboard) {
  if (isGameOver) {
    return;
  }
  $('.scores').empty();
  scoreboard.currentScores.forEach(function (userScore) {
    $('.scores').append($('<li class="score">').text(userScore.name + ': ' + userScore.score));
  });
  var numberOfRounds = scoreboard.rounds.length;
  if (numberOfRounds > 0) {
    var lastRound = scoreboard.rounds[numberOfRounds - 1];
    $('.last-question').text(lastRound.question.text);
    $('.last-answer').text(lastRound.winningAnswer.text);
    $('.last-winner').text(lastRound.winner);
  } else {
    $('.last-question, .last-answer, .last-winner').text('');
  }

});
socket.on('gameOver', function (rounds) {
  var winner = rounds[0].winner;
  $('body').html('<h1><pre>The winner is: ' + winner + '</pre></h1>');
  rounds.forEach(function (round) {
    $('body').append($('<div class="question card black_card">').text(round.question.text)).append($(
      '<div class="card">').text(round.winningAnswer.text));
  });
  isGameOver = true;
});
$(document).on('click', '.hand-card', function () {
  element = $(this);
  socket.emit('answerSubmitted', element.data('card'));
  return false;
});

$(document).on('click', '.answer-card', function () {
  if (user && user.name === round.czar.name && round.czarTime) {
    element = $(this);
    socket.emit('answerChosen', element.data('name'));
  }
});