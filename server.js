// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '/static/index.html'));
});

// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

//setInterval(function() {
//  io.sockets.emit('message', 'hi!');
//}, 1000);

var players = {};

io.on('connection', function(socket) {
    
    socket.on('new player', function() {
        
        players[socket.id] = {
            
            x: 300,
            y: 300
            
        };
        
        socket.emit("yoursocketid", socket.id);
        
    });
    
    socket.on('movement', function(data) {
        
        var player = players[socket.id] || {};
        
        if (data.left) {
            
            player.x -=5;
            
        }
        
        if (data.up) {
            player.y -= 5;
        }
        if (data.right) {
          player.x += 5;
        }
        if (data.down) {
          player.y += 5;
        }
        
    });
    
    socket.on('disconnect', function() {
            
            io.sockets.emit('player disconnected', "player " + socket.id + " disconnected");
            delete players[socket.id];
            
    });
    
    socket.on("chat message", function(data) {
        
        console.log("message from " + data.from + ": " + data.message);
        
        io.sockets.emit("new message", data.from + ": " + data.message);
        
    });
    
    socket.on("myusername", function(data) {
        
        players[socket.id].username = data;
        
    });
    
});



setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);