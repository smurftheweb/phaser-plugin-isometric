/// <reference path="../../libs/phaser.d.ts" />
/// <reference path="../../libs/p2.d.ts" />
/// <reference path="../../libs/pixi.d.ts" />
/// <reference path="../../dist/phaser.plugin.isometric.d.ts" />
var PointerInteraction = (function () {
    function PointerInteraction() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }
    PointerInteraction.prototype.preload = function () {
        // setup phaser
        this.game.time.advancedTiming = true;
        // setup plugins
        this.iso = this.game.plugins.add(Phaser.Plugin.Isometric);
        this.iso.projector.anchor.setTo(0.5, 0.2);
        this.game.load.image('tile', '/examples/tile.png');
    };
    PointerInteraction.prototype.create = function () {
        this.isoGroup = this.game.add.group();
        // spawn the tiles
        var tile;
        for (var xx = 0; xx < 256; xx += 38) {
            for (var yy = 0; yy < 256; yy += 38) {
                // create a tile using the new isoSprite factory method
                tile = this.iso.addIsoSprite(xx, yy, 0, 'tile', 0, this.isoGroup);
                tile.anchor.setTo(0.5, 0);
            }
        }
        // provide a 3d position for the cursor
        this.cursorPos = new Phaser.Plugin.Isometric.Point3();
    };
    PointerInteraction.prototype.update = function () {
        // update cursor position
        // when converting to isometric, we need to specify z-pos manually, as
        // it cannot easily be gotten from 2d position
        this.iso.projector.unproject(this.game.input.activePointer.position, this.cursorPos);
        // loop over the group to find if the 3d position that intersects with any isoSprite bounds
        this.isoGroup.forEach(function (tile) {
            var inBounds = tile.isoBounds.containsXY(this.cursorPos.x, this.cursorPos.y);
            // if yes, do a little animation and tint change
            if (!tile.selected && inBounds) {
                tile.selected = true;
                tile.tint = 0x86bfda;
                this.game.add.tween(tile).to({ isoZ: 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;
                this.game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
        }, this);
    };
    PointerInteraction.prototype.render = function () {
        this.game.debug.text("Move your mouse around!", 2, 36, "#ffffff");
        this.game.debug.text(String(this.game.time.fps) || '---', 2, 14, "#a7aebe");
    };
    return PointerInteraction;
})();
window.onload = function () {
    var game = new PointerInteraction();
};
//# sourceMappingURL=pointer-interaction.js.map