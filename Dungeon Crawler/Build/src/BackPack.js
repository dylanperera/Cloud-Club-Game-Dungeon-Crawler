var cursors
var backpack
var active_items

maingame.BackPack = function (game) {

};

maingame.BackPack.prototype = {
        preload: function () {
                game.load.image('boots', '../Assets/General assets/Skill Tree/speed.png')
                game.load.image('arrow', '../Assets/General assets/Skill Tree/atks.png')
                game.load.image('backpack', '../Assets/General assets/backpack.png')
                game.load.image('actives', '../Assets/General assets/ActiveItems.png')
                game.load.image('button', '../Assets/General assets/Grass.png')
                game.load.atlas(
                        "potion_set",
                        "../Assets/General assets/Potions/potions.png",
                        "../Assets/General assets/Potions/potions.json"
                );
                game.load.atlas('sword',
                        '../Assets/Example assets/0x72_DungeonTilesetII_v1.3.1/Spritesheets/sword_spritesheet.png',
                        '../Assets/Example assets/0x72_DungeonTilesetII_v1.3.1/Spritesheets/sword.json')

        },

        create: function () {
                cursors = game.input.keyboard.createCursorKeys()
                cursors.bckpck = game.input.keyboard.addKey(Phaser.Keyboard.B)
                button = game.add.button(500, 70, 'button', actionOnClick, this, 2, 1, 0);

                backpack = game.player_attributes["backpack"]
                active_items = game.player_attributes["actives"]
                inventory = []
                actives = Array(3).fill(0);

                console.log(backpack)
                console.log(active_items)

                for (var i = 0; i < 4; i++) {
                        inventory.push([])
                        for (var j = 0; j < 4; j++) {
                                inventory[i][j] = 0
                        }
                }

                this.add.image(50, 50, 'backpack');
                this.add.image(50, 400, 'actives')

                var item = game.add.group();

                item.inputEnableChildren = true;


                //initializing backpack interface with items
                bpList = Object.keys(backpack)
                count = 0;
                for (var i = 1; i <= 4; i++) {
                        for (var j = 1; j <= 4; j++) {
                                if (count == bpList.length) {
                                        break;
                                }
                                backpack[bpList[count]]["group"] = item.create(i * 70, j * 70, backpack[bpList[count]]["atlas"], backpack[bpList[count]]["src"])
                                backpack[bpList[count]]["group"].inputEnabled = true;
                                backpack[bpList[count]]["group"].input.enableDrag();
                                backpack[bpList[count]]["group"].events.onDragStart.add(onDragStart, this);
                                backpack[bpList[count]]["group"].events.onDragStop.add(onDragStop, this);
                                backpack[bpList[count]]["group"].inv_x = i - 1
                                backpack[bpList[count]]["group"].inv_y = j - 1
                                backpack[bpList[count]]["group"].inv = [i - 1, j - 1]
                                backpack[bpList[count]]["group"].name = backpack[bpList[count]]["name"]
                                inventory[i - 1][j - 1] = 1;
                                count++;
                                console.log(count)
                        }
                }

                //initializing active items interface 
                for (var i = 1; i <= active_items.length; i++) {
                        active_items[i - 1]["group"] = item.create(i * 70, 70 * 6, active_items[i - 1]["atlas"], active_items[i - 1]["src"] )
                        active_items[i - 1]["group"].inputEnabled = true;
                        active_items[i - 1]["group"].input.enableDrag();
                        active_items[i - 1]["group"].events.onDragStart.add(onDragStart, this);
                        active_items[i - 1]["group"].events.onDragStop.add(onDragStop, this);
                        active_items[i - 1]["group"].inv_x = i - 1
                        active_items[i - 1]["group"].inv_y = 5
                        active_items[i - 1]["group"].inv = [i - 1, j - 1]
                        actives[i - 1] = 1
                }

                function actionOnClick() {
                        console.log("return to game")
                        game.state.start("Game");
                }
                function onDragStart(sprite, pointer) {
                        console.log("Dragging " + sprite.key);
                        sprite.input.enableSnap(70, 70, false, true);

                }

                function onDragStop(sprite, pointer) {
                        var inv_x = (sprite.x / 70) - 1
                        var inv_y = (sprite.y / 70) - 1
                        console.log(sprite.x + ", " + sprite.y);
                        console.log(inventory);
                        console.log(actives)

                        if (inv_y == 5 && inv_x >= 3 || inv_x >= 4 || inv_y >= 4 && (inv_y != 5) || inv_x < 0 || inv_y < 0) {
                                //move it back / fail
                                sprite.position.x = (sprite.inv[0] + 1) * 70
                                sprite.position.y = (sprite.inv[1] + 1) * 70
                                return
                        } else if (inv_y == 5) {
                                act_x = inv_x;
                                if (actives[act_x] == 1) {
                                        //move it back/fail
                                        sprite.position.x = (sprite.inv[0] + 1) * 70
                                        sprite.position.y = (sprite.inv[1] + 1) * 70
                                        return
                                } else {
                                        //success

                                        if (sprite.inv[1] == 5) {
                                                actives[sprite.inv[0]] = 0
                                        } else {
                                                inventory[sprite.inv[1]][sprite.inv[0]] = 0
                                        }
                                        moveBackpackToActive(backpack, sprite, act_x)
                                        actives[act_x] = 1
                                        sprite.inv[0] = inv_x
                                        sprite.inv[1] = inv_y
                                        return
                                }
                        } else if (inventory[inv_y][inv_x] === 1) {
                                //move it back / fail
                                sprite.position.x = (sprite.inv[0] + 1) * 70
                                sprite.position.y = (sprite.inv[1] + 1) * 70
                                return
                        } else {
                                //can move item with success
                                if (sprite.inv[1] == 5) {
                                        actives[sprite.inv[0]] = 0
                                } else {
                                        inventory[sprite.inv[1]][sprite.inv[0]] = 0
                                }
                                inventory[inv_y][inv_x] = 1
                                sprite.inv[0] = inv_x
                                sprite.inv[1] = inv_y
                                return
                        }
                }
                moveBackpackToActive = function (backpack, item, index) {
                        console.log("MoveBTA", item.name)
                        if (active_items.length < 3) {
                                active_items.splice(index, 1, backpack[item.name]);
                                delete backpack[item.name];
                        } else {
                                item_moved = player.active_items[index];
                                active_items.splice(index, 1, item);
                                backpack.delete(item);
                                backpack[item_moved["name"]] = item_moved;
                        }
                }

                moveActiveToBackpack = function (item, index) {
                        if (player.backpack.length < MAX_BACKPACK_SIZE) {
                            idx = player.active_items.indexOf(item);
                            player.backpack[item["name"]] = item;
                            player.active_items.splice(idx, 1);
                        } else {
                            return "fail";
                        }
                }
        },

        update: function () {
                if (cursors.bckpck.isDown) {
                        game.player_attributes = {
                                backpack: backpack,
                                actives: active_items,
                                current: player.current_item,
                        };
                        game.state.start("Game");
                }

        }

}