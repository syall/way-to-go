/**
 * Animation
 */

// Runs Array of Frames([time, frame])
function scene(frames) { for (const [t, fn] of frames) fn(t); }

// Frame Definitions
const frames = {
    // Blink Frame
    blink: (closeDur = 100) => (openDur = 300) => t => {
        // Destructure World
        const { ctx, height, width } = world;
        // Fill Black
        ctx.fillStyle = '#000000';
        // Close Screen
        for (let i = 0; i <= closeDur; i++)
            setTimeout(() => {
                // Height
                const h = i / closeDur * height / 2;
                // Fill Top Height
                ctx.fillRect(0, 0, width, h);
                // Fill Bottom Height
                ctx.fillRect(0, height - h, width, h);
            }, t + i);
        // Open Screen
        for (let i = openDur; i >= 0; i--)
            setTimeout(() => {
                // Clear Canvas
                ctx.clearRect(0, 0, width, height);
                // Height
                const h = i / openDur * height / 2;
                // Fill Top Height
                ctx.fillRect(0, 0, width, h);
                // Fill Bottom Height
                ctx.fillRect(0, height - h, width, h);
            }, t + (openDur - i) + closeDur);
    },
    // Text Frame
    text: w => t => {
        // Destructure World
        const { ctx, height, width } = world;
        setTimeout(() => {
            // Set Text Align
            ctx.textAlign = 'center';
            // Fill Text at Center
            ctx.fillText(w, width / 2, height / 2);
        }, t);
    },
    // Clear Frame
    clear: t => {
        // Destructure World
        const { ctx, height, width } = world;
        // Clear Canvas
        setTimeout(() => ctx.clearRect(0, 0, width, height), t);
    },
    // Initial Draw Frame
    initDraw: t => {
        setTimeout(() => {
            // Start World
            world.start = true;
            // Draw World
            drawWorld();
        }, t);
    }
};
