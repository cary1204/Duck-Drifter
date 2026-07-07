const renderer = {
  duckImg: null,
  enemyDuckImg: null,
  bgImg: null,
  titleImg: null,
  nearMissTimer: 0,
  bgCache: null,
  bgCacheCtx: null,
  lastBgX: null,
  lastBgY: null,
  shakeDuration: 0,
  shakeMagnitude: 0,

  init() {
      const duckSkinId = shop.equipped || shop.skins[0].id;

      this.enemyDuckImg = new Image();
      this.enemyDuckImg.src = 'assets/duck.png';
      
      this.duckImg = new Image();
      this.duckImg.src = shop.imgs?.[duckSkinId]?.src ?? 'assets/duck.png';

      this.bgImg = new Image();
      this.bgImg.src = 'assets/BG.png';
      this.titleImg = new Image();
      this.titleImg.src = 'assets/title.png';

      this.bgCache = document.createElement('canvas');
      this.bgCache.width = window.innerWidth;
      this.bgCache.height = window.innerHeight;
      this.bgCacheCtx = this.bgCache.getContext('2d');
  },

  startShake(duration, magnitude) {
      this.shakeDuration = duration;
      this.shakeMagnitude = magnitude;
  },

  drawBackground(ctx, cameraX, cameraY) {
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;

      const bgX = Math.round(cameraX);
      const bgY = Math.round(cameraY);

      if (bgX !== this.lastBgX || bgY !== this.lastBgY) {
          this.lastBgX = bgX;
          this.lastBgY = bgY;

          // water
          this.bgCacheCtx.fillStyle = '#0496c7';
          this.bgCacheCtx.fillRect(0, 0, W, H);

          // grid
          const gridSize = 128;
          const offX = ((-bgX % gridSize) + gridSize) % gridSize;
          const offY = ((-bgY % gridSize) + gridSize) % gridSize;

          this.bgCacheCtx.strokeStyle = '#ffffff';
          this.bgCacheCtx.lineWidth = 1;
          for (let x = offX - gridSize; x < W + gridSize; x += gridSize) {
              this.bgCacheCtx.beginPath();
              this.bgCacheCtx.moveTo(x, 0);
              this.bgCacheCtx.lineTo(x, H);
              this.bgCacheCtx.stroke();
          }
          for (let y = offY - gridSize; y < H + gridSize; y += gridSize) {
              this.bgCacheCtx.beginPath();
              this.bgCacheCtx.moveTo(0, y);
              this.bgCacheCtx.lineTo(W, y);
              this.bgCacheCtx.stroke();
          }
      }

      ctx.drawImage(this.bgCache, 0, 0);
  },

  drawDuck(ctx) {
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      const cx = Math.floor(W / 2);
      const cy = Math.floor(H / 2);
      const size = 64;

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
      ctx.save();
      if (this.shakeDuration > 0) {
          this.shakeDuration--;
          const mag = this.shakeMagnitude * (this.shakeDuration / 20);
          const sx = (Math.random() - 0.5) * mag;
          const sy = (Math.random() - 0.5) * mag;
          ctx.translate(sx, sy);
      }
      this.drawBackground(ctx, duck.x, duck.y);
      if (state !== 'title') enemies.draw(ctx, duck.x, duck.y);
      if (state !== 'title') coin.draw(ctx, duck.x, duck.y);
      if (state !== 'title') this.drawDuck(ctx);
      if (state !== 'title') collision.draw(ctx);
      if (state !== 'title') this.drawHUD(ctx);
      ctx.restore();
      this.drawBackground(ctx, duck.x, duck.y);
      if (state !== 'title' && state !== 'store') enemies.draw(ctx, duck.x, duck.y);
      if (state !== 'title' && state !== 'store') coin.draw(ctx, duck.x, duck.y);
      if (state !== 'title' && state !== 'store') this.drawDuck(ctx);
      if (state !== 'title' && state !== 'store') collision.draw(ctx);
      if (state !== 'title' && state !== 'store') this.drawHUD(ctx);
      ctx.restore();
  },

  drawDeath(ctx, progress) {
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;

      // vignette
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

          ctx.strokeText(`BEST: ${scoring.highScore}`, W/2, H/2 + 44);
          ctx.fillText(`BEST: ${scoring.highScore}`, W/2, H/2 + 44);

          ctx.strokeText(`TIME: ${timeStr}`, W/2, H/2 + 78);
          ctx.fillText(`TIME: ${timeStr}`, W/2, H/2 + 78);

          ctx.strokeText(`NEAR MISSES: ${scoring.totalNearMisses}`, W/2, H/2 + 112);
          ctx.fillText(`NEAR MISSES: ${scoring.totalNearMisses}`, W/2, H/2 + 112);

          if (coin.img && coin.img.complete) {
              ctx.imageSmoothingEnabled = false;
              ctx.drawImage(coin.img, 0, 0, 20, 20, W/2 - 160, H/2 + 128, 30, 30);
          }
          ctx.fillText(`+${scoring.runCoins} collected  +${Math.floor(scoring.score / 60)} bonus`, W/2 + 20, H/2 + 150);
          ctx.fillText(`TOTAL COINS: ${scoring.totalCoins}`, W/2, H/2 + 285);

          ctx.fillStyle = `rgba(199, 199, 199, 0.8)`;
          ctx.fillText(`---------------- Press to restart ----------------`, W/2, H/2 + 365);

          ctx.restore();
      }

      if (progress > 0.5) {
          const bw = 260, bh = 44;
          const bx = W/2 - bw/2, by = H/2 + 210;
          ctx.fillStyle = 'white';
          ctx.fillRect(bx, by, bw, bh);
          ctx.font = 'bold 20px monospace';
          ctx.fillStyle = '#1a1a1a';
          ctx.textAlign = 'center';
          ctx.fillText('RETURN TO TITLE', W/2, by + 30);
      }
  },

  drawTitle(ctx) {
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;

      for (const d of titleDucks) {
          ctx.save();
          ctx.translate(Math.round(d.x), Math.round(d.y));
          ctx.rotate(d.angle);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(this.enemyDuckImg, -32, -32, 64, 64);
          ctx.restore();
      }

      ctx.save();
      ctx.textAlign = 'center';
      ctx.imageSmoothingEnabled = false;

      // title 
      if (this.titleImg && this.titleImg.complete) {
          const tw = this.titleImg.width * 4;
          const th = this.titleImg.height * 4;
          ctx.drawImage(this.titleImg, W/2 - tw/2, H/2 - th - 40, tw, th);
      }

      // credits
      ctx.font = '18px monospace';
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'white';
      ctx.lineWidth = 4;
      ctx.strokeText('By cary1204 & fish', W/2, H/2 - 30);
      ctx.fillText('By cary1204 & fish', W/2, H/2 - 30);

      // high score
      if (scoring.highScore > 0) {
          ctx.font = 'bold 20px monospace';
          ctx.fillStyle = '#f4c842';
          ctx.strokeStyle = '#80400B';
          ctx.lineWidth = 4;
          ctx.strokeText(`BEST: ${scoring.highScore}`, W/2, H/2 + 20);
          ctx.fillText(`BEST: ${scoring.highScore}`, W/2, H/2 + 20);
      }

      // coin
      if (coin.img && coin.img.complete) {
          ctx.drawImage(coin.img, 0, 0, 20, 20, W/2 - 50, H/2 + 33, 30, 30);
      }
      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = '#f4c842';
      ctx.strokeStyle = '#80400B';
      ctx.lineWidth = 4;
      ctx.textAlign = 'left';
      ctx.strokeText(`${scoring.totalCoins}`, W/2 - 10, H/2 + 57);
      ctx.fillText(`${scoring.totalCoins}`, W/2 - 10, H/2 + 57);
      ctx.textAlign = 'center';

      // play 
      const bw = 220, bh = 48;
      const bx = W/2 - bw/2, by = H/2 + 80;
      ctx.fillStyle = '#f4c842';
      ctx.fillRect(bx, by, bw, bh);
      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = '#1a1a1a';
      ctx.fillText('PLAY', W/2, by + 32);

      // shop 
      const sbw = 220, sbh = 48;
      const sbx = W/2 - sbw/2, sby = H/2 + 140;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(sbx, sby, sbw, sbh);
      if (coin.img && coin.img.complete) {
          ctx.drawImage(coin.img, 0, 0, 20, 20, sbx + 14, sby + 9, 30, 30);
      }
      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = '#1a1a1a';
      ctx.fillText('SHOP', W/2, sby + 32);

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

      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 4;
      ctx.strokeText(`SCORE: ${scoring.score}`, W / 2, 30);
      ctx.fillStyle = 'white';
      ctx.fillText(`SCORE: ${scoring.score}`, W / 2, 30);

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

      ctx.textAlign = 'left';
      ctx.font = 'bold 18px monospace';
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'black';
      ctx.strokeText(`BEST: ${scoring.highScore}`, 12, 30);
      ctx.fillStyle = 'white';
      ctx.fillText(`BEST: ${scoring.highScore}`, 12, 30);

      ctx.restore();
  },
};