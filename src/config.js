/**
 * Configuration
 */

// Configuration: FullScreen
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
