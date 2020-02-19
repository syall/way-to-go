// Initialize Configuration
initConfig();

// Initialize World
const world = initWorld();

// Opening Scene
scene([
    [0000, text('WARNING: THIS CAN CAUSE SEIZURES')],
    [3000, blink],
    [4000, text('WAKE UP.')],
    [6000, blink],
    [7000, text('DO YOU KNOW HOW LONG IT\'S BEEN.')],
    [9000, initDraw],
    // [0000, initDraw], // Debug
]);

// Add Player to World
addToWorld(
    'player',
    { pos: { x: 40, y: 40 } },
    () => world.grid[40][40] = tile.player
);
