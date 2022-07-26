//import kaboom from "kaboom"
//initialise kaboom
kaboom({
  background: [134, 135, 247],
  global: true,
  fullscreen: true,
  debug: true,
  scale: 2,
});

const MOVE_SPEED = 120
const DEATHFALL = 400
let isJumping = true;


// loading the sprites
loadRoot('sprites/')
loadSprite('brick', 'brick.png')
loadSprite('coin', 'coin.png')
loadSprite('evil-shroom', 'evil-shroom.png')
loadSprite('mario', 'Mario.png')
loadSprite('mushroom', 'mushroom.png')
loadSprite('pipe', 'pipe.png')
loadSprite('surprise', 'surprise.png')
loadSprite('unboxed', 'unboxed.png')
loadSprite('block', 'block.png')
loadSprite('block2', 'block2.png')
loadSprite('hill', 'hill.png')
loadSprite('cloud', 'cloud.png')
loadSprite('bush', 'bush.png')

//add game scene
scene("game", ({ level,score }) => {

  layers(['bg', 'obj', 'ui',], 'obj')

  //making two levels
  const LEVELS = [
    [
      "                                                                                    ",
      "                                                                                    ",
      "                                                                                    ",
      "               ^                                                                    ",
      "   ^                                  ^                    ^                        ",
      "                                            ^                                       ",
      "                                                                                    ",
      "      -?-b-                                                                         ",
      "                              n                     ?        ?                      ",
      "                              n                         ?                           ",
      "                            n n                                                     ",
      "                           nn n                                                     ",
      "       E                  nnn n        E    E                        P              ",
      "================     ===============================================================",
      "================     ===============================================================",
    ],
    [
      "                                                                                    ",
      "                                    ?                                               ",
      "                                                                                    ",
      "                                                                                    ",
      "                                                                                    ",
      "                                   -?-                                              ",
      "                                                                                    ",
      "      -?-b-                  -?-                                                    ",
      "                                                                                    ",
      "                                              ---b-                                 ",
      "                           n                                                        ",
      "                         n n                                                        ",
      " P                      nn n    E       E          E                   P            ",
      "================    ================================================================",
      "================    ================================================================",
    ]
  ]
  //level config
  const levelConf = {
    width: 16,
    height: 16,
    // define each object as a list of components
    "=": () => [
      sprite("block"),
      area(),
      solid(),
      "ground"
    ],
    "-": () => [
      sprite("brick"),
      area(),
      solid(),
      "brick"
    ],
    "?": () => [
      sprite("surprise"),
      area(),
      solid(),
      "coin-surprise"
    ],
    "b": () => [
      sprite("surprise"),
      area(),
      solid(),
      "mushy-surprise"
    ],
    "!": () => [
      sprite("unboxed"),
      area(),
      solid(),
      "unboxed"
    ],
    "c": () => [
      sprite("coin"),
      area(),
      solid(),
      cleanup(),
      "coin"
    ],
    "M": () => [
      sprite("mushroom"),
      area(),
      solid(),
      body(),
      origin('bot'),
      cleanup(),
      "mushroom"
    ],
    "P": () => [
      sprite("pipe"),
      area(),
      solid(),
      body(),
      origin('bot'),
      "pipe"
    ],
    "E": () => [
      sprite("evil-shroom"),
      area(),
      solid(),
      body(),
      origin('bot'),
      patrol(),
      "badGuy"
    ],
    "n": () => [
      sprite("block2"),
      area(),
      solid(),
      "block2"
    ],
    "^": () => [
      sprite("cloud"),
      layer('bg'),
      "cloud"
    ]
  };

  //making the game level
  var levelNumber = LEVELS[level];
  const gameLevel = addLevel(levelNumber, levelConf);

  //add bg stuff
  add([
    sprite("hill"),
    pos(50, 212),
    layer("bg"),
    origin("bot")
  ])

  add([
    sprite("bush"),
    pos(550, 208),
    layer("bg"),
    origin("bot")
  ])

  //add a score
  const scoreLabel = add([
    text('Score: ' + score),
    pos(100, 5),
    layer('ui'),
    {
      value: score,
      size: 16,
      font: 'sinko'
    }
  ])

  //add text for level
  const levelText = add([
    text('Level ' + parseInt(level + 1)),
    pos(20, 5),
    layer('ui'),
    {
      size: 16,
      font: 'sinko'
    }
  ])

  //making mario big
  function big() {
    let timer = 0
    let isBig = false
    return {
      update() {
        if (isBig) {
          timer -= dt()
          if (timer <= 0) {
            this.smallify()
          }
        }
      },
      isBig() {
        return isBig
      },
      smallify() {
        this.scale = vec2(1)
        timer = 0
        isBig = false
      },
      biggify(time) {
        this.scale = vec2(2)
        timer = time
        isBig = true
      }
    }
  }

  //making the player
  const player = add([
    sprite('mario', { frame: 0 }),
    solid(),
    area({ width: 16, height: 16 }),
    body(),
    big(),
    origin('bot'),
    pos(10, 1),
    scale(vec2(1)),
    'player'
  ])

  //moving the mushroom
  onUpdate('mushroom', (m) => {
    m.move(20, 0)
  })

  //headbumping things
  player.on('headbutt', (obj) => {
    if (obj.is('coin-surprise')) {
      gameLevel.spawn('c', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('!', obj.gridPos.sub(0, 0))
    }
    if (obj.is('mushy-surprise')) {
      gameLevel.spawn('M', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('!', obj.gridPos.sub(0, 0))
    }
  })

  //if mario eats mushroom
  player.onCollide('mushroom', (m) => {
    destroy(m),
    player.biggify(6)
  })

  //collect coins
  player.onCollide('coin', (c) => {
    destroy(c)
    scoreLabel.value++
    scoreLabel.text = 'Score: ' + scoreLabel.value
  })

  //make evil shroom patrol and not fall into pit
  function patrol(distance = 100, speed = 50, dir = 1) {
    return {
      id: "patrol",
      require: ["pos", "area",],
      startingPos: vec2(0, 0),
      add() {
        this.startingPos = this.pos;
        this.on("Collide", (obj, side) => {
          if (side === "left" || side === "right") {
            dir = -dir;
          }
        });
      },
      update() {
        if (Math.abs(this.pos.x - this.startingPos.x) >= distance) {
          dir = -dir;
        }
        this.move(speed * dir, 0);
      },
    };
  }

  //if mario hits an enemy
  player.onCollide('badGuy', (baddie) => {
    //squash the enemy
    if (isJumping) {
      destroy(baddie)
    }
    else {
        destroy(player)
        go('lose', { score: scoreLabel.value })
      }
  })

  //camera scrolls with mario
  player.onUpdate(() => {
    let currCam = camPos()
    if (currCam.x < player.pos.x) {
      camPos(player.pos.x, currCam.y)
    }
  })

  //mario dies if he falls into pit
  player.onUpdate(() => {
    if (player.pos.y >= DEATHFALL) {
      go('lose', { score: scoreLabel.value })
    }
  })

  //pipe let's mario move to next level
  player.onCollide('pipe', () => {
    keyDown('down', () => {
      go('game', {
        level: (level + 1) % LEVELS.length,
        score: scoreLabel.value
      })
    })
  })

  //moving the player
  onKeyDown('left', () => {
    player.move(-MOVE_SPEED, 0)
  })

  onKeyDown('right', () => {
    player.move(MOVE_SPEED, 0)
  })

  player.onUpdate(() => {
    if (player.isGrounded()) {
      isJumping = false
    }
  })

  onKeyPress('space', () => {
    if (player.isGrounded()) {
      isJumping = true
      player.jump()
    }

  })
})

//making the lose scene
scene('lose', ({ score }) => {
  add([
    text("Game Over!\n\nScore: " + score, { size: 24 }),
    origin('center'),
    pos(width() / 2, height() / 2),
    color(255, 255, 255)
  ])
  //wait before moving to start scene
  wait(3, () => {
    go("start");
  })
})

//making the start scene
scene('start', () => {
  add([
    text("-- Super Mario --\n\nPress ENTER to play!", { size: 24 }),
    origin('center'),
    pos(width() / 2, height() / 2),
    color(255, 255, 255)
  ])
  onKeyPress('enter', () => {
    go('game', { level: 0,score: 0 })
  })
})

go('start')
