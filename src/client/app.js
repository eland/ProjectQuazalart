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
  round = _round;
  $('.question').text(round.question.text);
  $('.answers').empty();

  Object.keys(round.submittedAnswers).forEach(function (key) {
    $('.answers').append($('<div class="card answer-card">').data('name', key).text(round.submittedAnswers[key]
      .text));
  });
  if (user.name === round.czar.name) {
    $('.hand').addClass('czar');
  } else {
    $('.hand').removeClass('czar');
  }
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