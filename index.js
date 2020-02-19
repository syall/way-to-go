// Initialize Configuration
initConfig();

// Initialize World
const world = initWorld();

// Opening Scene
scene([
    [0400, blink],
    [1600, text("WAKE UP.")],
    [3600, blink],
    [4800, text("DO YOU KNOW HOW LONG IT'S BEEN.")],
    [6400, initDraw],
]);

// Draw First Grid
addToWorld(
    'player',
    { pos: { x: 40, y: 40 } },
    () => world.grid[40][40] = tile.player
);
