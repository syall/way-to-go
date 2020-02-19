/**
 * Configuration
 */

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
    return {
        canvas,
        ctx,
        height: side,
        width: side * 2
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

function wakeUp(t) {
    const { ctx, height, width } = world;
    ctx.textAlign = "center";
    setTimeout(() => ctx.fillText("WAKE UP.", width / 2, height / 2), t);
}

function clear(t) {
    const { ctx, height, width } = world;
    setTimeout(() => ctx.clearRect(0, 0, width, height), t);
}
