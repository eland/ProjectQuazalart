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
  user.hand.forEach(function (card) {
    $('.hand').append($('<div class="card">').text(card.text));
  });
});

var question;
socket.on('question', function (_question) {
  question = _question;
  $('.question').text(question.text);
});

var submittedAnswers = [];
socket.on('answerSubmitted', function (answer) {
  submittedAnswers.push(answer);
  $('.answers').append($('<div class="card">').text(answer.text));
});