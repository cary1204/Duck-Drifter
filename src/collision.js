const collision = {
    playerRadius: 12,
    enemyRadius: 16,
    nearMissRadius: 80,
    showHitboxes: false,

    check() {
        for (let i = 0; i < enemies.list.length; i++) {
            const e = enemies.list[i];
            const dx = duck.x - e.x;
            const dy = duck.y - e.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // hit
            if (dist < this.playerRadius + this.enemyRadius) {
                return { type: 'hit', enemy: e };
            }

            if (dist < this.playerRadius + this.nearMissRadius && !e.nearMissed && !e.inRange) {
                e.inRange = true; //miss
            }

            if (e.inRange && dist >= this.playerRadius + this.nearMissRadius) {
                e.inRange = false;
                if (!e.nearMissed) {
                e.nearMissed = true;
                return { type: 'nearMiss', enemy: e };
                }
            }
        }
        return null;
    },

    draw(ctx) {
        if (!this.showHitboxes) return;
        const W = ctx.canvas.width;
        const H = ctx.canvas.height;
        const cx = W / 2;
        const cy = H / 2;

        // player hitbox
        ctx.beginPath();
        ctx.arc(cx, cy, this.playerRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 1;
        ctx.stroke();

        // enemy hitboxes
        for (const e of enemies.list) {
            const sx = Math.round(e.x - duck.x + cx);
            const sy = Math.round(e.y - duck.y + cy);

            // hit hitbox
            ctx.beginPath();
            ctx.arc(sx, sy, this.enemyRadius, 0, Math.PI * 2);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
            ctx.stroke();
        
            // near miss hitbox
            ctx.beginPath();
            ctx.arc(sx, sy, this.nearMissRadius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(253, 237, 7, 0.92)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    },
};