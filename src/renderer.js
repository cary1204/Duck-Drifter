const renderer = {
    duckImg: null,
    nearMissTimer: 0,

    init() {
        this.duckImg = new Image();
        this.duckImg.src = 'assets/duck.png';
        this.bgImg = new Image();
        this.bgImg.src = 'assets/BG.png';
        this.titleImg = new Image();
        this.titleImg.src = 'assets/title.png';
    },


    drawBackground(ctx, cameraX, cameraY) {
        const W = ctx.canvas.width;
        const H = ctx.canvas.height;

      // water
        ctx.fillStyle = '#0496c7';
        ctx.fillRect(0, 0, W, H);

      // grid
        const gridSize = 128;
        const offX = ((-cameraX % gridSize) + gridSize) % gridSize;
        const offY = ((-cameraY % gridSize) + gridSize) % gridSize;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        for (let x = offX - gridSize; x < W + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
        }
        for (let y = offY - gridSize; y < H + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
        }
    },
    // drawBackground(ctx, cameraX, cameraY) {
    //     const W = ctx.canvas.width;
    //     const H = ctx.canvas.height;

    //     const offX = ((-cameraX % this.bgImg.width) + this.bgImg.width) % this.bgImg.width;
    //     const offY = ((-cameraY % this.bgImg.height) + this.bgImg.height) % this.bgImg.height;

    //     for (let x = offX - this.bgImg.width; x < W + this.bgImg.width; x += this.bgImg.width) {
    //         for (let y = offY - this.bgImg.height; y < H + this.bgImg.height; y += this.bgImg.height) {
    //             ctx.drawImage(this.bgImg, x, y);
    //         }
    //     }
    // },

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
      if (state !== 'title') this.drawDuck(ctx);
      collision.draw(ctx);
      if (state !== 'title') this.drawHUD(ctx);
    },

    drawDeath(ctx, progress) {
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      // vignete
      const gradient = ctx.createRadialGradient(W/2, H/2, H * 0.05, W/2, H/2, H * 0.6);
      
      gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
      gradient.addColorStop(0.6, `rgba(80, 0, 0, ${progress * 0.6})`);
      gradient.addColorStop(1, `rgba(0, 0, 0, ${progress * 0.95})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);
    
      if (progress > 0.4) {
        const textAlpha = (progress - 0.4) / 0.6;
        const secs = Math.floor(scoring.survivalFrames / 60);
        const mins = Math.floor(secs / 60);
        const timeStr = mins > 0 ? `${mins}m ${secs % 60}s` : `${secs}s`;

        ctx.save();
        ctx.textAlign = 'center';

        ctx.font = 'bold 52px monospace';
        ctx.lineWidth = 8;
        ctx.strokeStyle = `rgba(0, 0, 0, ${textAlpha})`;
        ctx.strokeText('YOU GOT QUACKED', W/2, H/2 - 60);
        ctx.fillStyle = `rgba(255, 60, 60, ${textAlpha})`;
        ctx.fillText('YOU GOT QUACKED', W/2, H/2 - 60);

        ctx.font = 'bold 24px monospace';
        ctx.strokeText(`SCORE: ${scoring.score}`, W/2, H/2 + 10);
        ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`;
        ctx.fillText(`SCORE: ${scoring.score}`, W/2, H/2 + 10);

        ctx.strokeText(`TIME: ${timeStr}`, W/2, H/2 + 44);
        ctx.fillText(`TIME: ${timeStr}`, W/2, H/2 + 44);
        ctx.strokeText(`NEAR MISSES: ${scoring.totalNearMisses}`, W/2, H/2 + 78);
        ctx.fillText(`NEAR MISSES: ${scoring.totalNearMisses}`, W/2, H/2 + 78);

        ctx.fillText(`Press to restart`, W/2, H/2 + 130);

        ctx.restore();
      }
    },
        
    nearMissTimer: 0,
    drawTitle(ctx) {
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
    
      for (const d of titleDucks) {
        ctx.save();
        ctx.translate(Math.round(d.x), Math.round(d.y));
        ctx.rotate(d.angle);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.duckImg, -32, -32, 64, 64);
        ctx.restore();
      }
    
      ctx.save();
      ctx.textAlign = 'center';
    
      ctx.imageSmoothingEnabled = false;
      if (this.titleImg && this.titleImg.complete) {
        const tw = this.titleImg.width * 4;
        const th = this.titleImg.height * 4;
        ctx.drawImage(this.titleImg, W/2 - tw/2, H/2 - th - 40, tw, th);
      }


      ctx.font = '18px monospace';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'white';
      ctx.lineWidth = 4;
      ctx.strokeText('By cary1204 & fish', W/2, H/2 - 30);
      ctx.fillText('By cary1204 & fish', W/2, H/2 - 30);

      const bw = 220, bh = 48;
      const bx = W/2 - bw/2, by = H/2 + 80;
      ctx.fillStyle = '#f4c842';
      ctx.fillRect(bx, by, bw, bh);
      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = '#1a1a1a';
      ctx.fillText('PLAY', W/2, by + 32);
    
      ctx.restore();
    },

    drawHUD(ctx) {
      const speed = Math.sqrt(duck.vx * duck.vx + duck.vy * duck.vy).toFixed(1);
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;

      ctx.save();
      ctx.font = '16px monospace';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'right';
      ctx.fillText(`SPD: ${speed}`, W - 12, 24);
      ctx.fillText(`SPAWN: ${enemies.spawnInterval}`, W - 12, 44);
      ctx.fillText(`SCORE: ${scoring.score}`, W - 12, 64);
      ctx.fillText(`${scoring.multiplier}x`, W - 12, 84);
      
      //center score
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 4;
      ctx.strokeText(`SCORE: ${scoring.score}`, W / 2, 30);
      ctx.fillStyle = 'white';
      ctx.fillText(`SCORE: ${scoring.score}`, W / 2, 30);

      //near miss indicator, center top
      if (renderer.nearMissTimer > 0) {
        renderer.nearMissTimer--;
        const chain = scoring.nearMissChain;
        const label = chain >= 8
          ? `NEAR MISS x${chain}!! +${Math.round(10 * 2 * scoring.multiplier)}`
          : `NEAR MISS x${chain}! +${Math.round(5 * scoring.multiplier)}`;
        ctx.font = 'bold 36px monospace';
        ctx.lineWidth = 6;
        ctx.strokeStyle = `rgba(0, 0, 0, ${Math.min(1, renderer.nearMissTimer / 40)})`;
        ctx.textAlign = 'center';
        ctx.strokeText(label, W / 2, 90);
        ctx.fillStyle = `rgba(255, 220, 0, ${Math.min(1, renderer.nearMissTimer / 40)})`;
        ctx.fillText(label, W / 2, 90);
      }

      ctx.restore();
    },
};