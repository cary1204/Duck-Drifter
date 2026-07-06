const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { alpha: false });

//canvas - cap res for slow devices
canvas.width =(Math.floor(window.innerWidth / 2) * 2);
canvas.height =(Math.floor(window.innerHeight / 2) * 2);

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

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const cy = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (state === 'title') {
        if (state === 'title') {
        const sbw = 220, sbh = 48;
        const sbx = canvas.width/2 - sbw/2;
        const sby = canvas.height/2 + 140;

        if (cx >= sbx && cx <= sbx + sbw && cy >= sby && cy <= sby + sbh) {
            state = 'store';
        } else {
            state = 'playing';
        }
        }

    } else if (state === 'dead' && deathProgress >= 0.5) {
        const bw = 260, bh = 44;
        const bx = canvas.width/2 - bw/2;
        const by = canvas.height/2 + 210;

        if (cx >= bx && cx <= bx + bw && cy >= by && cy <= by + bh) {
            duck.x = 0; duck.y = 0; duck.vx = 0; duck.vy = 0;
            enemies.list = [];
            enemies.spawnInterval = 80;
            scoring.reset();
            deathProgress = 0;
            titleDucks = [];
            coinFinalized = false;
            spawnTitleDucks(canvas);
            state = 'title';
        } else {
            duck.x = 0; duck.y = 0; duck.vx = 0; duck.vy = 0;
            enemies.list = [];
            enemies.spawnInterval = 80;
            scoring.reset();
            deathProgress = 0;
            coinFinalized = false;
            state = 'playing';
        }
    }
});

renderer.init();
coin.init();

let state = 'title'; //title, playing, dead
let deathProgress = 0;
let coinFinalized = false;
let titleDucks = [];

function spawnTitleDucks(canvas) {
    for (let i = 0; i < 20; i++) {
        titleDucks.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            angle: Math.random() * Math.PI * 2,
            heading: Math.random() * Math.PI * 2,
            wobbleTimer: 0,
            wobbleX: 0,
            wobbleY: 0,
        });
    }
}

function updateTitleDucks(canvas) {
    const W = canvas.width;
    const H = canvas.height;
    for (const d of titleDucks) {
        d.wobbleTimer++;
        if (d.wobbleTimer > 50 + Math.random() * 60) {
            d.wobbleTimer = 0;
            const a = Math.random() * Math.PI * 2;
            d.wobbleX = Math.cos(a) * 0.4;
            d.wobbleY = Math.sin(a) * 0.4;
        }
        d.vx += d.wobbleX * 0.05;
        d.vy += d.wobbleY * 0.05;
        const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
        if (speed > 4) { d.vx = (d.vx/speed)*4; d.vy = (d.vy/speed)*4; }
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -32) d.x = W + 32;
        if (d.x > W + 32) d.x = -32;
        if (d.y < -32) d.y = H + 32;
        if (d.y > H + 32) d.y = -32;
        if (speed > 0.1) d.heading = Math.atan2(d.vy, d.vx);
        let diff = d.heading - d.angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        d.angle += diff * 0.08;
    }
}

spawnTitleDucks(canvas);

// framerate cap
let last = 0;
const FRAME_TIME = 1000 / 60;

function loop(ts) {
    requestAnimationFrame(loop);
    if (ts - last < FRAME_TIME - 2) return;
    last = ts;

    if (state === 'title') {
        updateTitleDucks(canvas);
    }

    if (state === 'playing') {
        duck.update(mouse, canvas);
        enemies.update(canvas);
        coin.update();

        const result = collision.check();
        if (result) {
            if (result.type === 'hit') {
                state = 'dead';
                scoring.finalizeCoins();
                coinFinalized = true;
                renderer.startShake(20, 24);
            } else if (result.type === 'nearMiss') {
                scoring.nearMiss();
                renderer.nearMissTimer = 90;
            }
        }
        scoring.update();
        scoring.checkHighScore();
    } else if (state === 'dead') {
        deathProgress = Math.min(1, deathProgress + 0.03);
    }

    renderer.draw(ctx);
    if (state === 'dead') renderer.drawDeath(ctx, deathProgress);
    if (state === 'title') renderer.drawTitle(ctx);
}

requestAnimationFrame(loop);