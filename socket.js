var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var players = {};
var host = '';
var ball = [];

io.on('connection', function(socket){

    // if no host is set -- first one is the host
    if (host === '') {

        // Set host
        host = socket.id;
    }

    // Send new player to other players
    socket.broadcast.emit('New player', socket.id)

    // Add Empty user
    players[socket.id] = {x:0, y:0};

    socket.on('Connect player', function (data) {
        socket.emit('Player connected', socket.id);
    });

    socket.on('Input ball', function (data) {

        // get host ball
        if (data.player[0] === host) {
            ball = data.ball;
        }

        if (players.hasOwnProperty(data.player[0])) {

            players[data.player[0]].x = data.player[1];
            players[data.player[0]].y = data.player[2];
            players[data.player[0]].vx = data.player[3];
            players[data.player[0]].vy = data.player[4];

        }

        socket.broadcast.emit('Output ball', {
            ball: ball,
            players: players
        });

    });

    socket.on('disconnect', function () {
        delete players[socket.id];
        socket.broadcast.emit('Player disconnected', socket.id);
        if (socket.id === host) {
            for (var i in players) {
                host = i;
                break;
            }
        }
    });

});

server.listen(3000);
