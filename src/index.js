// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Initialize Configuration
initConfig();

// Initialize World
const world = initWorld();
initDungeon();
addPlayer();
addGoal();

// Opening Scene
scene((sessionStorage.getItem('wtg-opening'))
    ? [
        [0000, frames.text('WARNING: GAME CAN CAUSE SEIZURES')],
        [3000, frames.initDraw]
    ]
    : [
        [0000, frames.text('WARNING: GAME CAN CAUSE SEIZURES')],
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
