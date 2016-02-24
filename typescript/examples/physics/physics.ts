/// <reference path="../../libs/phaser.d.ts" />
/// <reference path="../../libs/p2.d.ts" />
/// <reference path="../../libs/pixi.d.ts" />
/// <reference path="../../dist/phaser.plugin.isometric.d.ts" />
/// <reference path="../cube.ts" />

module Examples {
    export class Physics {

        game: Phaser.Game;
        iso: Phaser.Plugin.Isometric;
        isoArcade: Phaser.Plugin.Isometric.Arcade;

        isoGroup: Phaser.Group;

        constructor() {

            this.mapBinds();

            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content',
                { preload: this.preload, create: this.create, update: this.update, render: this.render });
        }

        /**
         * We need to bind things here, as we are using our own methods
         */
        private mapBinds(): void {
            this.preload = this.preload.bind(this);
            this.create = this.create.bind(this);
            this.update = this.update.bind(this);
            this.render = this.render.bind(this);
        }

        public spawnCubes(): void {
            var cube: Phaser.Plugin.Isometric.IsoSprite;
            for (var xx = 256; xx > 0; xx -= 64) {
                for (var yy = 256; yy > 0; yy -= 64) {
                    // Create a cube using the new game.add.isoSprite factory method at the specified position.
                    // The last parameter is the group you want to add it to (just like game.add.sprite)
                
                    // For typescript, we can't use game.add.isoSprite, we have to use iso instead.
                    // As we can't inject variables easily, we use a class to hold the sprite and oldZ.
                    cube = new Phaser.Plugin.Isometric.IsoSprite(this.game, xx, yy, 400, 'cube', 0);
                    this.isoGroup.add(cube);
                    cube.anchor.setTo(0.5);

                    // Enable the physics body on this cube.
                    this.isoArcade.enable(cube);

                    // Collide with the world bounds so it doesn't go falling forever or fly off the screen!
                    cube.body.collideWorldBounds = true;

                    // Add a full bounce on the x and y axes, and a bit on the z axis. 
                    cube.body.bounce.set(1, 1, 0.2);

                    // Send the cubes off in random x and y directions! Wheee!
                    cube.body.velocity.setTo(this.game.rnd.integerInRange(-50, 50), this.game.rnd.integerInRange(-50, 50), 0);
                }
            }
        }

        preload() {

            // setup phaser
            this.game.time.advancedTiming = true;

            // setup plugins
            this.iso = this.game.plugins.add(Phaser.Plugin.Isometric);

            // Start the IsoArcade physics system
            // For typescript, we need to create the plugin, so we have a handle on it
            this.isoArcade = new Phaser.Plugin.Isometric.Arcade(this.game);
            this.game.physics.enable(this.isoArcade);

            this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

            this.iso.projector.anchor.setTo(0.5, 0.2);

            this.game.load.image('cube', '/examples/cube.png');
        }

        create() {
            this.isoGroup = this.game.add.group();

            // Set the global gravity for IsoArcade
            this.isoArcade.gravity.setTo(0, 0, -500);
            
            // Let's make a load of cubes on a grid
            this.spawnCubes();

            // Allow the user to spawn another set of cubes each time they click/tap.
            this.game.input.onDown.add(function () {
                this.spawnCubes();
            }, this);
        }

        update() {
            // Just like Arcade Physics!
            this.isoArcade.collide(this.isoGroup, null);

            // Ensure everything stays sorted as it moves about. 
            // We'll use advanced sorting here as we're dealing with z axis stuff.
            this.iso.projector.topologicalSort(this.isoGroup);
        }

        render() {
            this.game.debug.text("Click to spawn more cubes!", 2, 36, "#ffffff");
            this.game.debug.text(String(this.game.time.fps) || '---', 2, 14, "#a7aebe");

            /*
            // Uncomment this to see debug bodies
            this.isoGroup.forEach(function (cube) {
                if (cube.inCamera) {
                    this.game.debug.body(cube, null, true, true);
                }
            }, this);
            */

            // game.debug.octree(this.isoArcade.octree);
        }
    }
}

window.onload = () => {
    var game = new Examples.Physics();
};