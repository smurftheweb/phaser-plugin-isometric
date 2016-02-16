﻿/// <reference path="../../libs/phaser.d.ts" />
/// <reference path="../../libs/p2.d.ts" />
/// <reference path="../../libs/pixi.d.ts" />
/// <reference path="../../dist/phaser.plugin.isometric.d.ts" />

class DepthSorting {

    game: Phaser.Game;
    iso: Phaser.Plugin.Isometric;

    isoGroup: Phaser.Group;

    sorted: boolean;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content',
            { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }

    preload() {

        // setup phaser
        this.game.time.advancedTiming = true;

        // setup plugins
        this.iso = this.game.plugins.add(Phaser.Plugin.Isometric);

        this.iso.projector.anchor.setTo(0.5, 0.2);

        this.game.load.image('cube', '/examples/cube.png');
    }

    create() {
        this.isoGroup = this.game.add.group();

        // Let's make a load of cubes on a grid, but do it back-to-front so they get added out of order.
        var cube: ExampleCube;
        var sprite: ExampleCube;
        for (var xx = 256; xx > 0; xx -= 48) {
            for (var yy = 256; yy > 0; yy -= 48) {
                // Create a cube using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                
                // For typescript, we can't use game.add.isoSprite, we have to use iso instead.
                // As we can't inject variables easily, we use a class to hold the sprite and oldZ.
                sprite = new ExampleCube(this.game, xx, yy, 0, 'cube', 0, this.isoGroup);
                sprite.oldZ = sprite.z;
                sprite.anchor.setTo(0.5);

                // Add a slightly different tween to each cube so we can see the depth sorting working more easily.
                this.game.add.tween(sprite).to({ isoZ: 10 }, 100 * ((xx + yy) % 10),
                                                Phaser.Easing.Quadratic.InOut, true, 0, Infinity, true);
            }
        }

        // Just a var so we can tell if the group is sorted or not.
        this.sorted = false;

        // Toggle sorting on click/tap.
        this.game.input.onDown.add(function () {
            this.sorted = !this.sorted;
            if (this.sorted) {
                this.iso.projector.simpleSort(this.isoGroup);
            }
            else {
                this.isoGroup.sort('oldZ');
            }
        }, this);

    }

    update() { }

    render() {
        this.game.debug.text("Click to toggle! Sorting enabled: " + this.sorted, 2, 36, "#ffffff");
        this.game.debug.text(String(this.game.time.fps) || '---', 2, 14, "#a7aebe");
    }
}

class ExampleCube extends Phaser.Plugin.Isometric.IsoSprite {

    public oldZ: number;

    constructor(game: Phaser.Game, x: number, y: number, z: number, key: string, frame: number, group: Phaser.Group) {
        super(game, x, y, z, key, frame);
        group.add(this);
    }
}

window.onload = () => {
    var game = new DepthSorting();
};