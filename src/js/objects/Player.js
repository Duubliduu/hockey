/*global Phaser, console */
var Player = function (game, x, y) {

    'use strict';

    Phaser.Sprite.call(this, game, x, y, 'blank');

    var graphics = game.add.graphics(0, 0);

    graphics.lineStyle(2, '#000');

    this.id = 0;

    this.circle = graphics.drawCircle(0, 0, 32);
    this.line = graphics.lineTo(0, 0);

    this.anchor.setTo(0.5, 0.5);

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.velocity.set(0, 0);
    this.body.collideWorldBounds = true;
    this.body.maxVelocity.set(300, 300);
    this.body.width = 32;
    this.body.height = 32;
    this.body.bounce.set(0.5, 0.5);

    game.add.existing(this);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {

    'use strict';

    this.circle.x = this.position.x;
    this.circle.y = this.position.y;

    this.body.velocity.x = this.game.physics.arcade.computeVelocity(0, this.body, this.body.velocity.x, null, 100);
    this.body.velocity.y = this.game.physics.arcade.computeVelocity(0, this.body, this.body.velocity.y, null, 100);

};
