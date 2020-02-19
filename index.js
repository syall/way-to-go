// Initialize Configuration
initConfig();

// Initialize World
const world = initWorld();

// Create Scene
scene([
    [0, blink],
    [1000, wakeUp],
    [3000, blink]
]);
