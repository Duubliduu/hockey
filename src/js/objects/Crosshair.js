/*global Phaser, console */
var Crosshair = function (game, x, y) {

    'use strict';

    Phaser.Sprite.call(this, game, x, y, 'crosshair');

    this.anchor.setTo(0.5, 0.5);

    game.add.existing(this);

};

Crosshair.prototype = Object.create(Phaser.Sprite.prototype);
Crosshair.prototype.constructor = Crosshair;

Crosshair.prototype.update = function () {

    'use strict';

    this.position.x = this.game.input.x;
    this.position.y = this.game.input.y;

};
