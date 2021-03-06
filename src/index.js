// Initialize World
const world = initWorld();
initDungeon();
addPlayer();
addGoal();

// Opening Scene
scene((sessionStorage.getItem('wtg-opening'))
    ? [[0000, frames.initDraw]]
    : [
        [0000, frames.text('WARNING: SCENE HAS SUDDEN FLASHES')],
        [3000, frames.blink()()],
        [3400, frames.blink()()],
        [4000, frames.text('WAKE UP.')],
        [6000, frames.blink()()],
        [6400, frames.blink()()],
        [7000, frames.text('DO YOU KNOW HOW LONG IT\'S BEEN.')],
        [9000, frames.blink()()],
        [9400, frames.blink()()],
        [9999, frames.initDraw],
        [0000, () => sessionStorage.setItem('wtg-opening', true)]
    ]
);


// Service Worker
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
