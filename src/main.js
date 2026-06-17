const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//canvas
canvas.width = Math.floor(window.innerWidth / 2) * 2;
canvas.height = Math.floor(window.innerHeight / 2) * 2;

const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

//potentially for mobile support
canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
}, { passive: false });

renderer.init();

let dead = false;
let deathProgress = 0;

function loop() {
    if (!dead) {
        duck.update(mouse, canvas);
        enemies.update(canvas);

        const result = collision.check();
        if (result) {
        if (result.type === 'hit') {
            dead = true;
        } else if (result.type === 'nearMiss') {
            scoring.nearMiss();
            renderer.nearMissTimer = 90;
        }
        }
        scoring.update();
    } else {
        deathProgress = Math.min(1, deathProgress + 0.008);
    }

    renderer.draw(ctx);
    if (dead) renderer.drawDeath(ctx, deathProgress);
    requestAnimationFrame(loop);
}

loop();