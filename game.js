//initialise kaboom
kaboom({
  background: [134, 135, 247],
  global: true,
  fullscreen: true,
  debug: true,
  scale: 2,
});

// loading the sprites
//loadRoot('https://imgur.com/')
loadSprite('brick','https://imgur.com/pogC9x5')
loadSprite('coin','https://imgur.com/wbKxhcd')
loadSprite('evil-shroom','https://imgur.com/KPO3fR9')
loadSprite('mario','https://imgur.com/Wb1qfhK')
loadSprite('mushroom','https://imgur.com/0wMd92p')
loadSprite('pipe','https://imgur.com/rl3cTER')
loadSprite('surprise','https://imgur.com/gesQ1KP')
loadSprite('unboxed','https://imgur.com/bdrLpi6')
loadSprite('block','sprites/block.png')
loadSprite('block2','sprites/block2.png')
loadSprite('hill','sprites/hill.png')

//making two levels
const LEVELS = [
  [
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "      -?-b-                                                                         ",
    "                                                    ?        ?                      ",
    "                                                        ?                           ",
    "                                 n    n                                             ",
    "                           nn    n    n                  n                          ",
    "       E                   nn    n    n   E   E         nn                P         ",
    "================     ===============================================================",
    "================     ===============================================================",
  ],
  [
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                       ?                                            ",
    "                                                                                    ",
    "                                   -?-                                              ",
    "                                                                                    ",
    "      -?-b-                  -?-                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                           n                                                        ",
    "                         n n                                                        ",
    "       P                nn n                           P          E    E            ",
    "================     ===============================================================",
    "================     ===============================================================",
  ]
];
//level config
const levelConf = {
  width: 20,
  height: 20,
  pos: vec2(0, 0),
  // define each object as a list of components
  "=": () => [
    sprite("block"),
    area(),
    solid(),
    origin("bot"),
    "ground"
  ],
  "-": () => [
    sprite("brick"),
    area(),
    solid(),
    origin("bot"),
    "brick"
  ],
  "?": () => [
    sprite("surprise"),
    area(),
    solid(),
    origin("bot"),
    "surprise",
    "coinBox"
  ],
  "b": () => [
    sprite("surprise"),
    area(),
    solid(),
    origin("bot"),
    "surprise",
    "mushyBox"
  ],
  "!": () => [
    sprite("unboxed"),
    area(),
    solid(),
   // bump(),
    origin("bot"),
    "unboxed"
  ],
  "c": () => [
    sprite("coin"),
    area(),
    solid(),
    //bump(64, 8),
    cleanup(),
    origin("bot"),
    "coin"
  ],
  "M": () => [
    sprite("mushroom"),
    area(),
    solid(),
    //patrol(10000),
    body(),
    cleanup(),
    origin("bot"),
    "mushroom"
  ],
  "P": () => [
    sprite("pipe"),
    area(),
    solid(),
    origin("bot"),
    "pipe"
  ],
  "E": () => [
    sprite("evil-shroom"),
    area(),
    solid(),
    body(),
    //patrol(50),
    //enemy(),
    origin("bot"),
    "badGuy"
  ],
  "p": () => [
    sprite("mario"),
    area(),
    body(),
    //mario(),
    //bump(150, 20, false),
    origin("bot"),
    "player"
  ]
};

//adding scenes
scene("start", () => {

  add([
    text("Press enter to start", { size: 24 }),
    pos(width/2,height/2),
    origin("center"),
    color(255, 255, 255),
  ]);

  onKeyRelease("enter", () => {
    go("game");
  })
});

go("start");
//add game scene
scene("game", (levelNumber = 0) => {

  layers([
    "bg",
    "game",
    "ui",
  ], "game");


  const level = addLevel(LEVELS[levelNumber], levelConf);

  /*add([
    sprite("cloud"),
    pos(20, 50),
    layer("bg")
  ]);*/

  add([
    sprite("hill"),
    pos(32, 208),
    layer("bg"),
    origin("bot")
  ])


  add([
    text("Level " + (levelNumber + 1), { size: 24 }),
    pos(vec2(160, 120)),
    color(255, 255, 255),
    origin("center"),
    layer('ui'),
    lifespan(1, { fade: 0.5 })
  ]);

  const player = level.spawn("p", 1, 10)

});
