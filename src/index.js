import Phaser from 'phaser';

const config = {
    // AUTO, CAVNAS or WEBGL
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        // Images and other assets must be preloaded
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let stars;
let bombs;
let platforms;
let cursors;
let score = 0;
let gameOver = false;
let scoreText;

// The game instance
const game = new Phaser.Game(config);

function preload ()
{
    console.log(this);
    this.load.image('sky', '../phaser-tutorial/assets/sky.png');
    this.load.image('ground', '../phaser-tutorial/assets/platform.png');
    this.load.image('star', '../phaser-tutorial/assets/star.png');
    this.load.image('bomb', '../phaser-tutorial/assets/bomb.png');
    this.load.spritesheet('dude', '../phaser-tutorial/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

//let platforms;

function create ()
{
    // Add the sky image at 400 by 300 (that's the center of
    // the sky image, which is 800 by 600). Images appear in
    // the order you add then as layers, so this image will
    // be the bottom layer and other images will appear on top
    // of it.
    this.add.image(400, 300, 'sky');

    // A static group if a group of objects that are fixed in
    // place and unaffected by game physics, whereas a dynamic 
    // group can be affected by the game physics. A group has
    // helper functions like "create".
    platforms = this.physics.add.staticGroup();

    // We need to scale the ground image to make it wide
    // enough. That then means that we have call refreshBody()
    // because we've altered a static object
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        // This tells the animation to loop
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Populate the cursors object with four properties: 
    // up, down, left, right, that are all instances of Key objects
    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    bombs = this.physics.add.group();

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update ()
{
    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}