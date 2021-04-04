var socket = io();
socket.on('player disconnected', function(data) {
  console.log("Data: " + data);
});

var movement = {
    
    up: false,
    down: false,
    left: false,
    right: false
    
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

var mysocketid;

socket.on("yoursocketid", function(data) {
    
    mysocketid = data;
    
});

document.addEventListener('keydown', function(e) {
    
    switch (e.keyCode) {
            
        case 65: //A
            movement.left = true;
            break;
        case 87: //W
            movement.up = true;
            break;
        case 68: //D
            movement.right = true;
            break;
        case 83: //S
            movement.down = true;
            break;
            
    }
    
});

document.addEventListener('keyup', function(e) {
    
    switch (event.keyCode) {
            
        case 65: //A
            movement.left = false;
            break;
        case 87: //W
            movement.up = false;
            break;
        case 68: //D
            movement.right = false;
            break;
        case 83: //S
            movement.down = false;
            break;
    }
    
});

socket.emit('new player');
setInterval(function() {
    
    socket.emit('movement', movement);
    
}, 1000/60);

var canvas = document.getElementById('canvas');
canvas.width = 900;
canvas.height = 550;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
  context.clearRect(0, 0, 900, 550);
  context.fillStyle = 'yellow';
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x, player.y, 20, 0, 2 * Math.PI);
    context.fill();
    if (mysocketid == id) {
        
        context.font = "30px Arial";
        context.strokeStyle = 'black';
        context.textAlign = "center";
        context.strokeText("You", player.x, player.y + 10);
        
    } else {
        
        context.fillStyle = 'yellow';
        context.font = "30px Arial";
        context.strokeStyle = 'black';
        context.textAlign = "center";
        context.strokeText(player.username, player.x, player.y + 10);
        
    }
  }
    //console.log(players);
});

var form = document.getElementById("chat-form");
var input = document.getElementById("chat-message");

form.addEventListener("submit", function(e) {
    
    e.preventDefault();
    if (input.value) {
        
        var thisnewmessage = {
            
            from: myusername,
            message: input.value
            
        }
        socket.emit("chat message", thisnewmessage);
        console.log(thisnewmessage);
        input.value = "";
        
    }
    
});

var messages = document.getElementById("messages");

socket.on("new message", function(data) {
    
    var item = document.createElement("li");
    item.textContent = data;
    messages.appendChild(item);
    
    var messagesinchat = [];
    var vwidth= Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            
    if (vwidth <= 1197) {

        messagesinchat = document.getElementById("chatbox").getElementsByTagName("li");
        var numberofmessages = messagesinchat.length;
        
        document.getElementById("chatbox").style.height = numberofmessages * 60 + 60;
        document.getElementById("chat-form").style.marginBottom = numberofmessages * 60-40;
        
        console.log(vwidth);
        console.log(messagesinchat);
        console.log(numberofmessages);
        console.log("chatbox height: " + document.getElementById("chatbox").style.height);

    } else {

        document.getElementById("chatbox").style.height = "550px";
        document.getElementById("chat-form").style.marginBottom = "15px";

    }
    
});

var myusername;

window.onload = function () {
    myusername = prompt("Please enter your username.", "coolplayer" + Math.floor(Math.random() * 10 + Math.floor(Math.random() * 10)));
    socket.emit("myusername", myusername);    
}
                                   