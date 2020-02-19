// Initialize Configuration
initConfig();

// Initialize World
const world = initWorld();

// Opening Scene
scene([
    [0000, text('WARNING: THIS CAN CAUSE SEIZURES')],
    [3000, blink()()],
    [3400, blink()()],
    [4000, text('WAKE UP.')],
    [6000, blink()()],
    [6400, blink()()],
    [7000, text('DO YOU KNOW HOW LONG IT\'S BEEN.')],
    [9000, blink()()],
    [9400, blink()()],
    [9999, initDraw],
    // [0000, initDraw], // Debug
]);

// Add Player to World
const p = { pos: { y: 30, x: 60 } };
addToWorld('player', p, () => world.grid[p.pos.y][p.pos.x] = tile.player);
