const coin = {
    x: 0,
    y: 0,
    active: false,
    lifetime: 0,
    maxLifetime: 7 * 60,

    frame: 0,
    frameTimer: 0,
    frameRate: 6,
    totalFrames: 9,

    spawnTimer: 0,
    spawnInterval: 300,
    spawnChance: 0.5,

    img: null,

    init() {
        this.img = new Image();
        this.img.src = 'assets/coin.png';
    },

    spawn() {
        const angle = Math.random() * Math.PI * 2;
        const dist = 200 + Math.random() * 300;
        this.x = duck.x + Math.cos(angle) * dist;
        this.y = duck.y + Math.sin(angle) * dist;
        this.active = true;
        this.lifetime = this.maxLifetime;
        this.frame = 0;
        this.frameTimer = 0;
    },

    update() {
        if (!this.active) {
            this.spawnTimer++;
            if (this.spawnTimer >= this.spawnInterval) {
                this.spawnTimer = 0;
                if (Math.random() < this.spawnChance) {
                    this.spawn();
                }
            }
            return;
        }

        this.lifetime--;
        if (this.lifetime <= 0) {
            this.active = false;
            return;
        }

        this.frameTimer++;
        if (this.frameTimer >= this.frameRate) {
            this.frameTimer = 0;
            this.frame = (this.frame + 1) % this.totalFrames;
        }

        const dx = duck.x - this.x;
        const dy = duck.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 12 + 20) {
            this.collect();
        }
    },

    collect() {
        this.active = false;
        scoring.addCoin(1);
    },

    draw(ctx, cameraX, cameraY) {
        if (!this.active || !this.img.complete) return;

        const W = ctx.canvas.width;
        const H = ctx.canvas.height;
        const sx = Math.round(this.x - cameraX + W / 2);
        const sy = Math.round(this.y - cameraY + H / 2);

        const fadeFrames = 120;
        if (this.lifetime < fadeFrames) {
            ctx.globalAlpha = this.lifetime / fadeFrames;
        }

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            this.img,
            this.frame * 20, 0, 20, 20,
            sx - 20, sy - 20, 40, 40
        );

        ctx.globalAlpha = 1;
    }
};
