/*global window, Player, game, Ball */

(function () {
    'use strict';

    function Game() {
        this.player = null;
        this.players = {};
        this.ball = null;
        this.controls = {};
        this.id = '';

        // Connectiong to server
        this.socket = io.connect('http://localhost:3000');
    }

    Game.prototype = {

        create: function () {

            var self = this;

            this.game.world.setBounds(0, 0, 1000, 500);

            this.stage.backgroundColor = '#ffffff';

            this.controls = {
                w: this.game.input.keyboard.addKey(87),
                a: this.game.input.keyboard.addKey(65),
                s: this.game.input.keyboard.addKey(83),
                d: this.game.input.keyboard.addKey(68)
            };

            this.player = new Player(this.game, 200, 200);

            this.socket.emit('Connect player', {});
            this.socket.on('Player connected', function (id) {
                // Set my player id form the server
                self.id = id;
            });

            this.socket.on('Player disconnected', function (id) {
                delete self.players[id];
            });

            this.ball = new Ball(this.game, 100, 100);
            // this.crosshair = new Crosshair(this.game, 0, 0);

            var timer = this.game.time.create(false);

            timer.loop(100, function(){
                this.socket.emit('Input ball', {
                    ball:[
                        self.ball.position.x,
                        self.ball.position.y,
                        self.ball.body.velocity.x,
                        self.ball.body.velocity.y,
                        self.ball.rotation
                    ],
                    player: [
                        self.id,
                        self.player.position.x,
                        self.player.position.y,
                        self.player.body.velocity.x,
                        self.player.body.velocity.y
                    ]
                });
            }, this);

            timer.start();

            this.camera.target = this.player;

            this.game.input.onDown.add(this.onInputDown, this);

            // New player connected
            this.socket.on('New player', function(id) {
                self.players[id] = new Player(this.game, 200, 200);
            });

            this.socket.on('Output ball', function (data) {
                self.ball.position.x = data.ball[0];
                self.ball.position.y = data.ball[1];
                self.ball.body.velocity.x = data.ball[2];
                self.ball.body.velocity.y = data.ball[3];
                self.ball.rotation = data.ball[4];

                // Update player data
                for (var i in data.players) {
                    if (i !== self.id) {
                        if (self.players.hasOwnProperty(i)) {
                            self.players[i].position.x = data.players[i].x;
                            self.players[i].position.y = data.players[i].y;
                            self.players[i].body.velocity.x = data.players[i].vx;
                            self.players[i].body.velocity.y = data.players[i].vy;
                        } else {
                            self.players[i] = new Player(self.game, data.players[i].x, data.players[i].y);
                        }
                    }
                }
            });

        },

        update: function () {

            // Set the player angle
            this.player.rotation = this.game.physics.arcade.angleToPointer(this.player);

            // this.crosshair.radius = this.game.physics.arcade.distanceToPointer(this.player);

            // Loop thru players to find who gets the ball
            this.game.physics.arcade.overlap(this.player, this.ball, this.ball.setPlayer, null, this.ball);

            if (this.controls.w.isDown === true) {
                this.player.body.velocity.y -= 10;
            }

            if (this.controls.s.isDown === true) {
                this.player.body.velocity.y += 10;
            }

            if (this.controls.d.isDown === true) {
                this.player.body.velocity.x += 10;
            }

            if (this.controls.a.isDown === true) {
                this.player.body.velocity.x -= 10;
            }

            var self = this;

        },

        onInputDown: function () {
            this.ball.shoot();
        }

    };

    window.hockey = window.hockey || {};
    window.hockey.Game = Game;

}());
