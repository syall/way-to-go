/**
 * Configuration
 */

const tile = {
    wall: '■',
    floor: '□',
    player: '@'
};

function initConfig() {
    const button = document.getElementById('toggle-fs');
    button.addEventListener('click', toggleFs);
    button.innerHTML = '';
}

function initWorld() {
    const canvas = document.getElementById('canvas');
    const dpr = window.devicePixelRatio;
    const side = 600;
    canvas.width = Math.ceil(side * 2 * dpr);
    canvas.height = Math.ceil(side * dpr);
    canvas.style.width = `${canvas.width / dpr}px`;
    canvas.style.height = `${canvas.height / dpr}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const grid = [];
    for (let i = 0; i < side; i += 10) {
        const t = [];
        for (let j = 0; j < side * 2; j += 10)
            t.push(tile.floor);
        grid.push(t);
    }
    return {
        canvas,
        ctx,
        height: side,
        width: side * 2,
        grid,
        start: false
    };
}

function toggleFs() {
    const doc = window.document;
    const docEl = doc.documentElement;

    const requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen;

    const cancelFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen;

    const notFullScreen =
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement;

    return (notFullScreen)
        ? requestFullScreen.call(docEl)
        : cancelFullScreen.call(doc);
}

/**
 * Animation
 */

function scene(frames) {
    for (const [t, fn] of frames) fn(t);
}

function blink(t) {
    const { ctx, height, width } = world;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000000";
    setTimeout(() => ctx.fillRect(0, 0, width, height), t);
    clear(t + 250);
    setTimeout(() => ctx.fillRect(0, 0, width, height), t + 400);
    clear(t + 650);
}

const text = w => t => {
    const { ctx, height, width } = world;
    setTimeout(() => {
        ctx.textAlign = "center";
        ctx.fillText(w, width / 2, height / 2);
    }, t);
};

function clear(t) {
    const { ctx, height, width } = world;
    setTimeout(() => ctx.clearRect(0, 0, width, height), t);
}

/**
 * Game
 */

function drawWorld() {
    if (world.start === false)
        return;
    const { ctx, grid, width, height } = world;
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

function addToWorld(s, o, init) {
    world[s] = o;
    init();
}

const dirKeys = {
    UP: '38',
    DOWN: '40',
    LEFT: '37',
    RIGHT: '39'
};

document.onkeydown = function ({ keyCode }) {
    if (!world.start)
        return;
    const { y, x } = world.player.pos;
    const { UP, DOWN, LEFT, RIGHT } = dirKeys;
    world.grid[y][x] = tile.wall;
    if (keyCode == UP && y > 0 && world.grid[y - 1][x] !== tile.wall)
        world.player.pos.y -= 1;
    else if (keyCode == DOWN && y < 59 && world.grid[y + 1][x] !== tile.wall)
        world.player.pos.y += 1;
    else if (keyCode == LEFT && y > 0 && world.grid[y][x - 1] !== tile.wall)
        world.player.pos.x -= 1;
    else if (keyCode == RIGHT && y < 119 && world.grid[y][x + 1] !== tile.wall)
        world.player.pos.x += 1;
    world.grid[world.player.pos.y][world.player.pos.x] = tile.player;
    drawWorld();
};
