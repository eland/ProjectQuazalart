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

socket.on('roundUpdated', function (round) {
  $('.question').text(round.question.text);
  $('.answers').empty();

  Object.keys(round.submittedAnswers).forEach(function (key) {
    $('.answers').append($('<div class="card">').text(round.submittedAnswers[key].text));
  });
});

$(document).on('click', '.hand-card', function () {
  element = $(this);
  socket.emit('answerSubmitted', element.data('card'));
  return false;
});