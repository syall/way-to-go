function initConfig() {
    const button = document.getElementById('toggle-fs');
    button.addEventListener('click', toggleFs);
    button.innerHTML = '';
}

function initWorld() {
    const canvas = document.getElementById('canvas');
    const side = 600;
    canvas.width = 2 * side;
    canvas.height = side;
    const ctx = canvas.getContext("2d");
    return { canvas, ctx };
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
