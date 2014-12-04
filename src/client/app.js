  var socket = io();
  socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('authenticate', function () {
    var name = localStorage.getItem('name');
    if (!name) {
      name = prompt('Please put in your username');
      localStorage.setItem('name', name);
    }

    socket.emit('login', name);
  });

  $('form').submit(function () {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });