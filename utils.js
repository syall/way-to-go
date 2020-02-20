/**
 * Configuration
 */

function initConfig() {

    // Toggle Full Screen Button
    const button = document.getElementById('toggle-fs');
    button.innerHTML = '⤢';
    button.addEventListener('click', toggleFs);
    function toggleFs() {
        // Window
        const doc = window.document;
        const docEl = doc.documentElement;

        // Request Full Screen
        const requestFullScreen =
            docEl.requestFullscreen ||
            docEl.mozRequestFullScreen ||
            docEl.webkitRequestFullScreen ||
            docEl.msRequestFullscreen;

        // Not Full Screen
        const notFullScreen =
            !doc.fullscreenElement &&
            !doc.mozFullScreenElement &&
            !doc.webkitFullscreenElement &&
            !doc.msFullscreenElement;

        // If not Full Screen, toggle Full Screen
        if (notFullScreen) {
            requestFullScreen.call(docEl);
            document.getElementById('toggle-fs').style.display = 'none';
        }
    }

    // On Full Screen Close, add back Button
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    function exitHandler() {
        if (document.webkitIsFullScreen === false)
            document.getElementById('toggle-fs').style.display = 'block';
        else if (document.mozFullScreen === false)
            document.getElementById('toggle-fs').style.display = 'block';
        else if (document.msFullscreenElement === false)
            document.getElementById('toggle-fs').style.display = 'block';
    }

}

function initWorld() {

    // High DPI Canvas
    const canvas = document.getElementById('canvas');
    const dpr = window.devicePixelRatio;
    const side = 600;
    canvas.width = Math.ceil(side * 2 * dpr);
    canvas.height = Math.ceil(side * dpr);
    canvas.style.width = `${canvas.width / dpr}px`;
    canvas.style.height = `${canvas.height / dpr}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Grid
    const grid = [];
    for (let i = 0; i < side; i += 10) {
        const t = [];
        for (let j = 0; j < side * 2; j += 10)
            t.push(tile.floor);
        grid.push(t);
    }

    // World
    return {
        canvas,
        ctx,
        height: side,
        width: side * 2,
        grid,
        start: false
    };
}

/**
 * Animation
 */

// Runs Array of Scenes([time, frame])
function scene(frames) { for (const [t, fn] of frames) fn(t); }

// Blink Frame
const blink = (closeDur = 100) => (openDur = 300) => t => {
    const { ctx, height, width } = world;
    ctx.fillStyle = '#000000';
    // Close
    for (let i = 0; i <= closeDur; i++)
        setTimeout(() => {
            const h = i / closeDur * height / 2;
            ctx.fillRect(0, 0, width, h);
            ctx.fillRect(0, height - h, width, h);
        }, t + i);
    // Open
    for (let i = openDur; i >= 0; i--)
        setTimeout(() => {
            ctx.clearRect(0, 0, width, height);
            const h = i / openDur * height / 2;
            ctx.fillRect(0, 0, width, h);
            ctx.fillRect(0, height - h, width, h);
        }, t + (openDur - i) + closeDur);
};

// Write Frame
const text = w => t => {
    const { ctx, height, width } = world;
    setTimeout(() => {
        ctx.textAlign = 'center';
        ctx.fillText(w, width / 2, height / 2);
    }, t);
};

// Clear Frame
function clear(t) {
    const { ctx, height, width } = world;
    setTimeout(() => ctx.clearRect(0, 0, width, height), t);
}

// Initial Draw Frame
function initDraw(t) {
    setTimeout(() => {
        world.start = true;
        drawWorld();
    }, t);
}

/**
 * Game
 */

// Tile Enumeration
const tile = {
    wall: '■',
    floor: '□',
    player: '@'
};

// Draw Grid
function drawWorld() {
    if (world.start === false)
        return;
    const { ctx, grid, width, height } = world;
    ctx.textAlign = 'center';
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[i].length; j++)
            ctx.fillText(grid[i][j], hor(j), ver(i));
    function hor(n) {
        return n * 10 + 5;
    }
    function ver(n) {
        return n * 10 + 8;
    }
}

// Add Entity to World
function addToWorld(s, o, init) {
    world[s] = o;
    init();
}

// Arroy Key Enumeration
const dirKeys = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
};

function collide(type) {
    const bump = [
        tile.wall,
        tile.player
    ].filter(t => t !== type);
    return y => x => bump.includes(world.grid[y][x]);
}

// On Arrow Key Movement, Move Player
const keys = () => {
    const keysPressed = e => {
        if (!world.start)
            return;

        world.player.keys.set(e.keyCode, true);
        const { y, x } = world.player.pos;
        const block = collide(tile.player);

        if (world.player.keys.get(dirKeys.LEFT, true) && x > 0 && !block(y)(x - 1)) {
            world.player.pos.x -= 1;
            e.preventDefault();
        }
        if (world.player.keys.get(dirKeys.RIGHT, true) && x < world.width - 1 && !block(y)(x + 1)) {
            world.player.pos.x += 1;
            e.preventDefault();
        }
        if (world.player.keys.get(dirKeys.UP, true) && y > 0 && !block(y - 1)(x)) {
            world.player.pos.y -= 1;
            e.preventDefault();
        }
        if (world.player.keys.get(dirKeys.DOWN, true) && y < world.height - 1 && !block(y + 1)(x)) {
            world.player.pos.y += 1;
            e.preventDefault();
        }

        world.grid[y][x] = tile.wall;
        world.grid[world.player.pos.y][world.player.pos.x] = tile.player;
        drawWorld();
    };

    const keysReleased = e => world.player.keys.set(e.keyCode, false);

    window.addEventListener('keydown', keysPressed, false);
    window.addEventListener('keyup', keysReleased, false);
};
