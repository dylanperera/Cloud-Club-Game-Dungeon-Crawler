var maingame = {}

//-------------------- Tile map --------------------
var map
var ground
var walls
var water
var kelp
var glass
var rocks

//-------------------- Player --------------------
var player
var player_facing = 3

//-------------------- Enemies --------------------
var lizard
var lizard_direction = 1
var big_guy
var new_nme
var shark
var pirate
var tourist
var cn_tourist
var black_beard
var sharky

//-------------------- Utilities --------------------
var keyReset = false
var cursors
var w = 800, h = 600;

//-------------------- Weapons --------------------
var default_sword
var weapon

//-------------------- Treasure --------------------
var chest

maingame.test_env = function (game) { }

maingame.test_env.prototype = {
    preload: function () {
        this.load.tilemap('cnTower',
            '../Assets/General assets/CN Tower/CNTower_Map_col_Ex.json',
            null,
            Phaser.Tilemap.TILED_JSON)

        this.load.image('cnTower_tiles',
            '../Assets/General assets/CN Tower/CNTower_StructureTileset.png'
        )

        // Ripleys
        this.load.tilemap('ripleys',
            '../Assets/General assets/Ripleys Aquarium/ripleys-aquarium-map.json',
            null,
            Phaser.Tilemap.TILED_JSON)

        this.load.image('ripleys_tiles',
            '../Assets/General assets/Ripleys Aquarium/tileset.png'
        )

        this.load.atlas('shark',
            '../Assets/General assets/Ripleys Aquarium/shark-swim/Shark_atlas_sheet.png',
            '../Assets/General assets/Ripleys Aquarium/shark-swim/Shark_atlas_js.json'
        )

        // this.load.atlas('pirate',
        // )
        //

        this.load.atlas('tourist',
            '../Assets/General assets/CN Tower/Enemy/Tourist_Compact_1.png',
            '../Assets/General assets/CN Tower/Enemy/Tourist_Compact_json.json'
        )

        this.load.image('tiles',
            '../Assets/Example assets/0x72_DungeonTilesetII_v1.3.1/0x72_DungeonTilesetII_v1.3.png')

        this.load.tilemap('example_map',
            '../Assets/Example assets/Tiled Map/Example_tile.json',
            null,
            Phaser.Tilemap.TILED_JSON)

        this.load.atlas('player',
            '../Assets/Example assets/legend of faune files/spritesheet.png',
            '../Assets/Example assets/legend of faune files/faun_spritesheet.json')

        this.load.atlas('lizard',
            '../Assets/Example assets/0x72_DungeonTilesetII_v1.3.1/Spritesheets/lizard_spritesheet.png',
            '../Assets/Example assets/0x72_DungeonTilesetII_v1.3.1/Spritesheets/lizard.json')


        this.load.atlas('sword',
            '../Assets/Example assets/0x72_DungeonTilesetII_v1.3.1/Spritesheets/sword_spritesheet.png',
            '../Assets/Example assets/0x72_DungeonTilesetII_v1.3.1/Spritesheets/sword.json')

        this.load.atlas('big_guy',
            '../Assets/Example assets/0x72_DungeonTilesetII_v1.3.1/Spritesheets/biguy_spritesheet.png',
            '../Assets/Example assets/0x72_DungeonTilesetII_v1.3.1/Spritesheets/bigguy.json')

        this.load.atlas('chest',
            '../Assets/Example assets/0x72_DungeonTilesetII_v1.3.1/Spritesheets/chest_spritesheet.png',
            '../Assets/Example assets/0x72_DungeonTilesetII_v1.3.1/Spritesheets/chest.json')

        this.load.image('heart',
            '../Assets/Example assets/0x72_DungeonTilesetII_v1.3.1/frames/ui_heart_full.png'
        )

        this.load.atlas('water',
            '../Assets/General assets/Ripleys Aquarium/water_atlas.png',
            '../Assets/General assets/Ripleys Aquarium/water_atlas.json',
        )

        this.load.atlas('eng',
            '../Assets/General assets/Player/main-character.png',
            '../Assets/General assets/Player/main-character.json'
        )

        this.load.image('arrow', '../Assets/General assets/arrow_right.png')
        

    },

    create: function () {
        //-------------------- Start physics engine --------------------
        game.physics.startSystem(Phaser.Physics.ARCADE)

        // map = game.add.tilemap('cnTower')
        // map.addTilesetImage('CNTower_StructureTileset', 'cnTower_tiles')
        // walls = map.createLayer('Walls')
        // ground = map.createLayer('Tile Layer 1')

        //-------------------- Add tile map and tile set --------------------
        map = game.add.tilemap('ripleys')
        map.addTilesetImage('ripleys', 'ripleys_tiles')

        // //-------------------- Create layer --------------------
        walls = map.createLayer('wall')
        ground = map.createLayer('ground')
        water = map.createLayer('water')
        kelp = map.createLayer('kelp')
        glass = map.createLayer('glass')
        rocks = map.createLayer('rocks')


        // game.physics.arcade.enable(ground)
        // game.physics.arcade.enable(walls)

        // //-------------------- Add wall colision --------------------
        map.setCollisionBetween(1, 9999, true, walls)

        // map.setTileIndexCallback([103, 104, 105, 106, 107, 108], function wow(){console.log('It works!')}, this, 'Test')

        //-------------------- Add player model --------------------
        player = game.add.sprite(750, 850, 'eng', 'idle_down.png')
        player.swing = false
        player = init_player(game, player)

        player.animations.add(
            'walk_down',
            Phaser.Animation.generateFrameNames(
                'walk_down_',
                1,
                7,
                '.png'
            ),
            10,
            true
        )
        player.animations.add(
            'walk_up',
            Phaser.Animation.generateFrameNames(
                'walk_up_',
                1,
                7,
                '.png'
            ),
            10,
            true
        )
        player.animations.add(
            'walk_right',
            Phaser.Animation.generateFrameNames(
                'walk_right_',
                1,
                8,
                '.png'
            ),
            10,
            true
        )
        player.animations.add(
            'walk_left',
            Phaser.Animation.generateFrameNames(
                'walk_left_',
                1,
                8,
                '.png',
            ),
            10,
            true
        )
        player.animations.add(
            'attack_right',
            Phaser.Animation.generateFrameNames(
                'attack_right_',
                1,
                4,
                '.png'
            ),
            8,
            true
        )
        player.animations.add(
            'attack_left',
            Phaser.Animation.generateFrameNames(
                'attack_left_',
                1,
                4,
                '.png'
            ),
            8,
            true
        )
        player.animations.add(
            'attack_up',
            Phaser.Animation.generateFrameNames(
                'attack_up_',
                1,
                3,
                '.png'
            ),
            8,
            true
        )
        player.animations.add(
            'attack_down',
            Phaser.Animation.generateFrameNames(
                'attack_down_',
                1,
                4,
                '.png'
            ),
            8,
            true
        )
        player.animations.add(
            'hurt_up',
            Phaser.Animation.generateFrameNames(
                'hurt_up_',
                1,
                3,
                '.png'
            ),
            10,
            true
        )
        player.animations.add(
            'hurt_down',
            Phaser.Animation.generateFrameNames(
                'hurt_down_',
                1,
                3,
                '.png'
            ),
            10,
            true
        )
        player.animations.add(
            'hurt_left',
            Phaser.Animation.generateFrameNames(
                'hurt_left_',
                1,
                4,
                '.png'
            ),
            10,
            true
        )
        player.animations.add(
            'hurt_right',
            Phaser.Animation.generateFrameNames(
                'hurt_right_',
                1,
                4,
                '.png'
            ),
            10,
            true
        )
        player.animations.add(
            'idle-left',
            ['idle_left.png'],
            2,
            true
        )
        player.animations.add(
            'idle-right',
            ['idle_right.png'],
            2,
            true
        )
        player.animations.add(
            'idle-down',
            ['idle_down.png'],
            2,
            true
        )
        player.animations.add(
            'idle-up',
            ['idle_up.png'],
            2,
            true
        )

        //-------------------- Add example weapon --------------------
        default_sword = game.add.group()
        default_sword.enableBody = true

        //-------------------- Add example enemies --------------------
        lizard = game.add.physicsGroup(Phaser.Physics.ARCADE)
        shark = game.add.physicsGroup(Phaser.Physics.ARCADE)
        pirate = game.add.physicsGroup(Phaser.Physics.ARCADE)
        tourist = game.add.physicsGroup(Phaser.Physics.ARCADE)

        lizard.enableBody = true
        shark.enableBody = true
        pirate.enableBody = true
        tourist.enableBody = true

        game.physics.arcade.enable(lizard, Phaser.Physics.ARCADE)
        game.physics.arcade.enable(shark, Phaser.Physics.ARCADE)
        game.physics.arcade.enable(pirate, Phaser.Physics.ARCADE)
        game.physics.arcade.enable(tourist, Phaser.Physics.ARCADE)

        new_nme = lizard.create(738, 680, 'lizard', 'lizard_m_idle_anim_f0.png')
        new_nme = enemy_init(new_nme, 10, 500)

        big_guy = lizard.create(600, 200, 'big_guy', 'big_demon_idle_anim_f3.png')
        var big_guy_tween = game.add.tween(big_guy)
        big_guy_tween.to({ x: 700, y: 200 }, 1000, null, true, 0, -1, true)
        big_guy = enemy_init(big_guy, 25, 500)

        sharky = shark.create(16, 48, 'shark', 'shark-swim-left-f1.png')
        sharky.scale.setTo(1.5)
        sharky.bounds = {
            x1 : 16,
            x2 : 60,
            y1 : 48,
            y2 : 112
        }
        sharky.inBounds = function(){

            if(this.position.x > this.bounds.x1 && this.position.x < this.bounds.x2){
                if(this.position.y > this.bounds.y1 && this.position.y < this.bounds.y2){
                    return true
                }
            }
            return false
        }

        // black_beard = pirate.create(741, 575, '')
        cn_tourist = tourist.create(741, 575, 'tourist', 'Tourist_Front_Attack.png')

        cn_tourist.animations.add(
            'walk_down',
            Phaser.Animation.generateFrameNames(
                'Tourist_Front_Walk_',
                1,
                3,
                '.png'
            ),
            5,
            true
        )

        cn_tourist.animations.add(
            'walk_up',
            Phaser.Animation.generateFrameNames(
                'Tourist_Back_Walk_',
                1,
                3,
                '.png'
            ),
            5,
            true
        )

        cn_tourist.animations.add(
            'walk_left',
            Phaser.Animation.generateFrameNames(
                'Tourist_Left_Walk_',
                1,
                2,
                '.png'
            ),
            5,
            true
        )


        sharky.animations.add(
            'swim_right',
            Phaser.Animation.generateFrameNames(
                'shark-swim-right-f',
                1,
                4,
                '.png'
            ),
            10,
            true
        )
        sharky.animations.add(
            'swim_left',
            Phaser.Animation.generateFrameNames(
                'shark-swim-left-f',
                1,
                4,
                '.png'
            ),
            10,
            true
        )
        sharky.animations.add(
            'swim_up',
            Phaser.Animation.generateFrameNames(
                'shark-swim-up-f',
                1,
                4,
                '.png'
            ),
            10,
            true
        )
        sharky.animations.add(
            'swim_down',
            Phaser.Animation.generateFrameNames(
                'shark-swim-down-f',
                1,
                4,
                '.png'
            ),
            10,
            true
        )

        sharky.animations.play('swim_up')


        big_guy.animations.add(
            'idle',
            Phaser.Animation.generateFrameNames(
                'big_demon_idle_anim_f',
                0,
                3,
                '.png'
            ),
            10,
            true
        )
        big_guy.animations.add(
            'run',
            Phaser.Animation.generateFrameNames(
                'big_demon_run_anim_f',
                0,
                3,
                '.png'
            ),
            10,
            true
        )
        big_guy.animations.play('run')
        new_nme.animations.add(
            'idle',
            Phaser.Animation.generateFrameNames(
                'lizard_m_idle_anim_f',
                0,
                3,
                '.png'
            ),
            10,
            true
        )
        new_nme.animations.add(
            'run',
            Phaser.Animation.generateFrameNames(
                'lizard_m_run_anim_f',
                0,
                3,
                '.png'
            ),
            10,
            true
        )

        new_nme.animations.play('run')
        new_nme.body.velocity.x = 120
        new_nme.body.bounce.set(-1)

        //-------------------- Physics engine and control setting --------------------
        game.world.setBounds(0, 0, 16 * 100, 16 * 100)
        game.camera.follow(player)

        cursors = game.input.keyboard.createCursorKeys()
        cursors.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        cursors.esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC)

        //-------------------- Adding player weapons and dictionary --------------------
        player.current_item = {
            "name": "sword",
            "group": default_sword,
            "src": "sword_spritesheet.png",
            "dmg": 1,
            "quantity": 1
        }

        //-------------------- Chest example --------------------
        chest = game.add.group()
        chest.enableBody = true

        const new_chest = chest.create(50, 200, 'chest', 'chest_empty_open_anim_f0.png')
        new_chest.body.immovable = true
        new_chest.opened = false
        new_chest.item = {
            "name": "potion"
        }
        new_chest.animations.add(
            'open',
            Phaser.Animation.generateFrameNames(
                'chest_empty_open_anim_f',
                0,
                2,
                '.png'
            ),
            10,
            false
        )

        //-------------------- Added water example --------------------
        const test = game.add.sprite(100, 200, 'water', 'water_f1.png')
        test.animations.add(
            'wave',
            Phaser.Animation.generateFrameNames(
                'water_f',
                1,
                6,
                '.png'
            ),
            5,
            true
        )
        test.animations.play('wave')

        //-------------------- Weapon example --------------------
        weapon = game.add.weapon(30, 'arrow')
        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
        weapon.bulletSpeed = 400
        weapon.fireRate = 1000
        weapon.trackSprite(player, 0, 0, true)
        cursors.z = game.input.keyboard.addKey(Phaser.Keyboard.Z)

    },

    update: function () {
        //-------------------- Collision engine --------------------
        game.physics.arcade.collide(player, walls, function tileMapColExample() {
            console.log("Example wall collision...")
        }, null, this)
        game.physics.arcade.collide(lizard, walls, lizard_turn_around, null, this)
        game.physics.arcade.collide(default_sword, lizard, lizard_dmg, null, this)
        game.physics.arcade.collide(player, chest, open_chest, null, this)
        game.physics.arcade.collide(player, lizard, damage_player, null, this)
        game.physics.arcade.collide(player, shark, damage_player, null, this)
        game.physics.arcade.collide(shark, walls)

        // game.physics.arcade.collide(player, tile_col_ex, function tileMapColExample() {
        //     console.log("Example water collision...")
        //     return
        // }, null, this)

        //-------------------- Movement --------------------
        var speed = player.speed
        idle_direction = ['idle-left', 'idle-right', 'idle-up', 'idle-down']

        if (!player.knockback) {
            if (!player.swing) {
                if (cursors.left.isDown) {
                    player_facing = 0
                    player.body.velocity.x = -speed
                    player.animations.play('walk_left', true)


                } else if (cursors.right.isDown) {
                    player_facing = 1
                    player.body.velocity.x = speed
                    player.animations.play('walk_right', true)

                } else if (cursors.down.isDown) {
                    player_facing = 3
                    player.body.velocity.y = speed
                    player.animations.play('walk_down', true)

                } else if (cursors.up.isDown) {
                    player_facing = 2
                    player.body.velocity.y = -speed
                    player.animations.play('walk_up', true)

                } else {
                    player.animations.play(idle_direction[player_facing])
                    player.body.velocity.x = 0
                    player.body.velocity.y = 0

                }
            } else {
                player.body.velocity.x = 0
                player.body.velocity.y = 0
            }
        }

        if (cursors.space.downDuration(100) && !keyReset) {
            keyReset = true;
            swing_default_sword(player)
        }
        if (!cursors.space.isDown) {
            keyReset = false
        }

        if (cursors.z.isDown) {
            weapon.fire()
        }

        shark.forEach(shark_track)

        //-------------------- Enter skill tree state --------------------
        if (cursors.esc.downDuration(100)) {
            game.state.start("Skill tree", false, false)
        }
    },

    render: function () {
        game.debug.bodyInfo(player, 32, 32);
        // game.debug.body(player);
        // game.debug.body(sharky)
        // // game.debug.body(new_nme)
        // // if (weapon) {
        // //     game.debug.body(weapon)
        // // }
    }
}