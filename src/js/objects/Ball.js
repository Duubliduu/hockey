/*global Phaser, console */
var Ball = function (game, x, y) {

    'use strict';

    Phaser.Sprite.call(this, game, x, y, 'blank');

    var graphics = game.add.graphics(0, 0);

    graphics.lineStyle(0);
    graphics.beginFill('#000');
    this.circle = graphics.drawCircle(0, 0, 10);
    graphics.endFill();

    // Middle the object
    this.anchor.setTo(0.5, 0.5);

    // The player holding the ball
    this.player = null;

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.width = 10;
    this.body.height = 10;
    this.body.velocity.set(0, 0);
    this.body.collideWorldBounds = true;
    this.body.bounce.set(1, 1);
    this.body.gravity.set(0, 0);
    this.weight = 1;

    game.add.existing(this);

};

Ball.prototype = Object.create(Phaser.Sprite.prototype);
Ball.prototype.constructor = Ball;


/**
 * Update the ball's state
 *
 * @return void
 */
Ball.prototype.update = function () {

    'use strict';

    this.circle.x = this.position.x;
    this.circle.y = this.position.y;

    if (this.player !== null) {

        this.rotation = this.player.rotation;

        this.position.x = this.player.position.x + 21 * Math.cos(this.rotation);
        this.position.y = this.player.position.y + 21 * Math.sin(this.rotation);

    } else {

        this.body.velocity.x = this.game.physics.arcade.computeVelocity(0, this.body, this.body.velocity.x, null, 200);
        this.body.velocity.y = this.game.physics.arcade.computeVelocity(0, this.body, this.body.velocity.y, null, 200);

    }
};



/**
 * Set the player holding the ball
 *
 * @param Player player The player object
 */
Ball.prototype.setPlayer = function (player) {

    'use strict';

    // if the player is one holding the ball
    if (this.player !== player) {
        this.player = player;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }

    return false;

};


/**
 * Shoot the ball
 *
 * @return void
 */
Ball.prototype.shoot = function () {

    'use strict';

    if (this.player === null) {
        return;
    }

    this.angle = this.player.angle + (Math.random() * 30 - 15);

    this.game.physics.arcade.velocityFromRotation(this.rotation, 1000, this.body.velocity);

    this.player = null;
};
