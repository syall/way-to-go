// Initialize Configuration
initConfig();

// Initialize World
const world = initWorld();

// Opening Scene
scene([
    [0000, blink],
    [1000, text("WAKE UP.")],
    [3000, blink],
    [4000, text("DO YOU KNOW HOW LONG IT'S BEEN.")],
    [6000, initDraw],
]);

// Draw First Grid
addToWorld(
    'player',
    { pos: { x: 40, y: 40 } },
    () => world.grid[40][40] = tile.player
);
