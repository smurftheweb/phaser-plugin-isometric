module Examples {
    export class Cube extends Phaser.Plugin.Isometric.IsoSprite {

        public oldZ: number;

        constructor(game: Phaser.Game, x: number, y: number, z: number, key: string, frame: number, group: Phaser.Group) {
            super(game, x, y, z, key, frame);
            group.add(this);
        }
    }
}