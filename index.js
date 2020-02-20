// Initialize Configuration
initConfig();

// Initialize World
const world = initWorld();

// Opening Scene
(sessionStorage.getItem('way-to-go-opening'))
    ? initDraw(0)
    : scene([
        [0000, text('WARNING: GAME CAN CAUSE SEIZURES')],
        [3000, blink()()],
        [3400, blink()()],
        [4000, text('WAKE UP.')],
        [6000, blink()()],
        [6400, blink()()],
        [7000, text('DO YOU KNOW HOW LONG IT\'S BEEN.')],
        [9000, blink()()],
        [9400, blink()()],
        [9999, initDraw],
        [0000, () => sessionStorage.setItem('way-to-go-opening', true)]
    ]);


// Add Player to World
const p = { pos: { y: 30, x: 60 }, keys: new Map() };
addToWorld('player', p, () => (world.grid[p.pos.y][p.pos.x] = tile.player) && keys());
