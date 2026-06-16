const renderer = {
    duckImg: null,

    init() {
        this.duckImg = new Image();
        this.duckImg.src = 'assets/duck.png';
        this.bgImg = new Image();
        this.bgImg.src = 'assets/BG.png';
    },

    drawBackground(ctx, cameraX, cameraY) {
        const W = ctx.canvas.width;
        const H = ctx.canvas.height;

        const offX = ((-cameraX % this.bgImg.width) + this.bgImg.width) % this.bgImg.width;
        const offY = ((-cameraY % this.bgImg.height) + this.bgImg.height) % this.bgImg.height;

        for (let x = offX - this.bgImg.width; x < W + this.bgImg.width; x += this.bgImg.width) {
            for (let y = offY - this.bgImg.height; y < H + this.bgImg.height; y += this.bgImg.height) {
                ctx.drawImage(this.bgImg, x, y);
            }
        }
    },

    drawDuck(ctx) {
        const W = ctx.canvas.width;
        const H = ctx.canvas.height;
        const cx = Math.floor(W / 2);
        const cy = Math.floor(H / 2);
      const size = 64; // double size(og:16px)

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(duck.angle);
        ctx.imageSmoothingEnabled = false;
        if (this.duckImg.complete) {
        ctx.drawImage(this.duckImg, -size / 2, -size / 2, size, size);
        }
        ctx.restore();
    },

    draw(ctx) {
        this.drawBackground(ctx, duck.x, duck.y);
        enemies.draw(ctx, duck.x, duck.y);
        this.drawDuck(ctx);
    }
};