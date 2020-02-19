initConfig();
const world = initWorld();
function scene(frames) { for (const [t, f] of frames) f(t); }
function blink(t) {
    const { ctx, height, width } = world;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000000";
    setTimeout(() => ctx.fillRect(0, 0, width, height), t);
    clear(t + 250);
    setTimeout(() => ctx.fillRect(0, 0, width, height), t + 400);
    clear(t + 650);
}
function wakeUp(t) {
    const { ctx, height, width } = world;
    ctx.textAlign = "center";
    setTimeout(() => ctx.fillText("WAKE UP.", width / 2, height / 2), t);
}
function clear(t) {
    const { ctx, height, width } = world;
    setTimeout(() => ctx.clearRect(0, 0, width, height), t);
}
scene([
    [0, blink],
    [1000, wakeUp],
    [3000, blink]
]);
