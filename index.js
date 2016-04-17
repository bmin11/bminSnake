var express = require('express');
app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/snake.html');
});

http.listen(3000, function() {
  console.log('listening on port 3000');
});

io.on('connection', function(socket){
  socket.broadcast.emit('new connect');

  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
    io.emit('user gone');
  });

  socket.on('greeting', function(){
    console.log('greeting');
    io.emit('greeting');
  });

  socket.on('host', function(e){
    console.log('host');
    socket.broadcast.emit('host', e);
  });

  socket.on('change direction', function(e){
    console.log('direction changed');
    io.emit('change direction', e);
  });

  socket.on('start game', function(e){
    console.log('game started');
    io.emit('start game', e);
  });

  socket.on('stop game', function(){
    console.log('game stopped');
    io.emit('stop game');
  });

  socket.on('resume game', function(){
    console.log('game resumed');
    io.emit('resume game');
  });

  socket.on('create orb', function(e){
    console.log('create orb');
    io.emit('create orb',e);
  });

});
