/**
 * Game
 */

// Tile Enumeration
const tile = {
    wall: '',
    floor: '◻', // '□',
    trail: '◼', // '⊡', // '■',
    player: '',
    def: '⽅', // '⏣'
};

// Initialize World
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
            t.push(tile.wall);
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

// Initialize Dungeon
function initDungeon() {

    // Get Stored Grid
    if (sessionStorage.getItem('wtg-grid')) {
        world.grid = JSON.parse(sessionStorage.getItem('wtg-grid'));
        return;
    }

    // Max Number of Iterations
    const max = 100_000;
    // Minimum Length of Room
    const min_size = 8;
    // Maximum Size of Room
    const max_size = 12;
    // Height of Grid
    const gh = world.height / 10 - 1;
    // Width of Grid
    const gw = world.width / 10 - 1;

    // Add Rooms
    addToWorld('rooms', [], () => null);

    // Generate Rooms
    for (let i = 0; i < max; i++) {

        // Top Left Corner
        const y = rng(0, gh);
        const x = rng(0, gw);

        // Width and Height
        let w = rng(min_size, max_size);
        let h = rng(min_size, max_size);

        // If out of bounds, ignore
        if (y + h > gh || x + w > gw)
            continue;

        // Create Room
        const cur = { w, h, y, x };

        // If there is an intersection, ignore
        if (world.rooms.some(r => intersect(r, cur)))
            continue;

        // Add Room
        addRoom(cur);

        // Tunnel if Another Room Exists
        if (world.rooms.length !== 0) {

            // Center of Current Room
            const cy = Math.floor(cur.y + (cur.h / 2));
            const cx = Math.floor(cur.x + (cur.w / 2));

            // Center of Previous Room
            const prev = world.rooms[world.rooms.length - 1];
            const py = Math.floor(prev.y + (prev.h / 2));
            const px = Math.floor(prev.x + (prev.w / 2));

            // Horizontal First
            if (rng(0, 1) === 1) {
                hor_tunnel(px, cx, py);
                ver_tunnel(py, cy, cx);
            }
            // Vertical First
            else {
                ver_tunnel(py, cy, px);
                hor_tunnel(px, cx, cy);
            }
        }

        // Add Room to World
        world.rooms.push(cur);
    }

    // Add Player
    const { w, h, y, x } = world.rooms[0];
    const p = {
        pos: {
            y: Math.floor(y + (h / 2)),
            x: Math.floor(x + (w / 2))
        },
        keys: new Map()
    };
    addToWorld('player', p, () => {
        world.grid[p.pos.y][p.pos.x] = tile.def;
        player_keys();
    });

    // On Arrow Key Movement, Move Player
    function player_keys() {

        // Arroy KeyCodes
        const dirKeys = {
            UP: 38,
            DOWN: 40,
            LEFT: 37,
            RIGHT: 39
        };

        function collide(type) {
            // List of Things that will Collide
            const bump = [
                tile.wall,
                tile.player
            ].filter(t => t !== type);
            // Return Function to test it will Collide with those Types
            return y => x => bump.includes(world.grid[y][x]);
        }

        // On Key Down
        window.addEventListener('keydown', keysPressed, false);
        function keysPressed(e) {
            // If World is paused, ignore
            if (!world.start)
                return;

            // Set Direction from Key
            world.player.keys.set(e.keyCode, true);

            // Previous Player Position
            const { y, x } = world.player.pos;

            // Function that tests Collision
            const block = collide(tile.player);

            // Left
            if (world.player.keys.get(dirKeys.LEFT, true) &&
                !block(y)(x - 1)) {
                world.player.pos.x -= 1;
                tile.player = '左'; // '←';
                e.preventDefault();
            }
            // Right
            else if (world.player.keys.get(dirKeys.RIGHT, true) &&
                !block(y)(x + 1)) {
                world.player.pos.x += 1;
                tile.player = '右'; // '→';
                e.preventDefault();
            }
            // Up
            else if (world.player.keys.get(dirKeys.UP, true) &&
                !block(y - 1)(x)) {
                world.player.pos.y -= 1;
                tile.player = '上'; // '↑';
                e.preventDefault();
            }
            // Down
            else if (world.player.keys.get(dirKeys.DOWN, true) &&
                !block(y + 1)(x)) {
                world.player.pos.y += 1;
                tile.player = '下'; // '↓';
                e.preventDefault();
            }
            // Else, set default
            else {
                tile.player = tile.def;
            }

            // Mark Trail
            world.grid[y][x] = tile.trail;

            // Mark Player
            world.grid[world.player.pos.y][world.player.pos.x] = tile.player;

            // Draw World
            drawWorld();
        }

        // On Key Release
        window.addEventListener('keyup', keysReleased, false);
        function keysReleased(e) {
            // Remove Direction
            world.player.keys.set(e.keyCode, false);

            // Mark Player as default
            world.grid[world.player.pos.y][world.player.pos.x] = tile.def;

            // Draw World
            drawWorld();
        };
    };

    // Add to session storage
    sessionStorage.setItem('wtg-grid', JSON.stringify(world.grid));

    // Room Intersection
    function intersect(r1, r2) {
        return (
            r1.x <= r2.x + r2.w &&
            r2.x + r2.w >= r2.x &&
            r1.y <= r2.y + r2.h &&
            r1.y + r1.h >= r2.y
        );
    }

    // Apply Room
    function addRoom(room) {
        for (let i = room.y; i < room.y + room.h; i++)
            for (let j = room.x; j < room.x + room.w; j++)
                world.grid[i][j] = tile.floor;
    }

    // Apply Horizontal Tunnel
    function hor_tunnel(px, cx, py) {
        for (let i = Math.min(px, cx); i <= Math.max(px, cx); i++)
            world.grid[py][i] = tile.floor;
    }

    // Apply Vertical Tunnel
    function ver_tunnel(py, cy, px) {
        for (let i = Math.min(py, cy); i <= Math.max(py, cy); i++)
            world.grid[i][px] = tile.floor;
    }

}

// Draw Grid
function drawWorld() {
    // If World is paused, ignore
    if (world.start === false)
        return;

    // Destructure World
    const { ctx, grid, width, height } = world;

    // Set Text Align
    ctx.textAlign = 'center';

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // Fill Text with Grid
    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[i].length; j++)
            ctx.fillText(grid[i][j], hor(j), ver(i));

    // Functions for Position
    function hor(n) { return n * 10 + 5; }
    function ver(n) { return n * 10 + 8; }
}

// Add Entity to World
function addToWorld(s, o, init) {
    // Set Property
    world[s] = o;
    // Function to Initialize if Necessary
    init();
}
