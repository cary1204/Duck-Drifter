const shop = {
    skins: [
        { id: 'default', name: 'Duck',    price: 0,   src: 'assets/duck.png' },
        { id: 'skin2',   name: 'White',   price: 10, src: 'assets/skins/skin2.png' },
        { id: 'skin3',   name: '???',     price: 25, src: 'assets/skins/skin3.png' },
        { id: 'skin4',   name: 'Goose',     price: 40, src: 'assets/skins/goose.png' },
        { id: 'skin5',   name: 'Pigeon',     price: 60, src: 'assets/skins/pigeon.png' },
    ],

    owned: JSON.parse(localStorage.getItem('quakers_owned') || '["default"]'),
    equipped: localStorage.getItem('quakers_equipped') || 'default',

    imgs: {},

    init() {
        for (const skin of this.skins) {
            const img = new Image();
            img.src = skin.src;
            this.imgs[skin.id] = img;
        }
        // own default always included on load
        if (!this.owned.includes('default')) {
            this.owned.push('default');
            this.save();
        }
    },

    save() {
        localStorage.setItem('quakers_owned', JSON.stringify(this.owned));
        localStorage.setItem('quakers_equipped', this.equipped);
    },

    purchase(id) {
        const skin = this.skins.find(s => s.id === id);
        if (!skin || this.owned.includes(id)) return;
        if (scoring.totalCoins < skin.price) return;
        scoring.totalCoins -= skin.price;
        localStorage.setItem('quakers_coins', scoring.totalCoins);
        this.owned.push(id);
        this.save();
    },

    equip(id) {
        if (!this.owned.includes(id)) return;
        this.equipped = id;
        this.save();
        // update duck
        renderer.duckImg = this.imgs[id];
    },

    // layout
    cardW: 130,
    cardH: 190,
    cols: 5,
    padding: 24,

    getCardPositions(W, H) {
        const totalW = this.cols * this.cardW + (this.cols - 1) * this.padding;
        const startX = W / 2 - totalW / 2;
        const rows = Math.ceil(this.skins.length / this.cols);
        const totalH = rows * this.cardH + (rows - 1) * this.padding;
        const startY = H / 2 - totalH / 2 + 20;
        const positions = [];
        for (let i = 0; i < this.skins.length; i++) {
            const col = i % this.cols;
            const row = Math.floor(i / this.cols);
            positions.push({
                x: startX + col * (this.cardW + this.padding),
                y: startY + row * (this.cardH + this.padding),
            });
        }
        return positions;
    },

    draw(ctx) {
        const W = ctx.canvas.width;
        const H = ctx.canvas.height;

        // background
        ctx.save();
        ctx.fillStyle = 'rgba(112, 112, 112, 0.15)';
        ctx.fillRect(0, 0, W, H);

        // title
        ctx.textAlign = 'center';
        ctx.font = 'bold 32px monospace';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 6;
        ctx.strokeText('SHOP', W / 2, 50);
        ctx.fillStyle = 'white';
        ctx.fillText('SHOP', W / 2, 50);

        // coin
        if (coin.img && coin.img.complete) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(coin.img, 0, 0, 20, 20, W - 120, 18, 30, 30);
        }
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'left';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.strokeText(`${scoring.totalCoins}`, W - 82, 40);
        ctx.fillStyle = '#f4c842';
        ctx.fillText(`${scoring.totalCoins}`, W - 82, 40);

        // back
        const bbw = 120, bbh = 38;
        const bbx = 20, bby = 14;
        ctx.fillStyle = 'white';
        ctx.fillRect(bbx, bby, bbw, bbh);
        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#1a1a1a';
        ctx.textAlign = 'center';
        ctx.fillText('< BACK', bbx + bbw / 2, bby + 26);

        // cards
        const positions = this.getCardPositions(W, H);
        for (let i = 0; i < this.skins.length; i++) {
            const skin = this.skins[i];
            const pos = positions[i];
            const owned = this.owned.includes(skin.id);
            const equipped = this.equipped === skin.id;

            // card bg
            ctx.fillStyle = 'rgba(165, 165, 165, 0.85)';
            ctx.strokeStyle = equipped ? '#f4c842' : '#ccc';
            ctx.lineWidth = equipped ? 3 : 1.5;
            ctx.beginPath();
            ctx.roundRect(pos.x, pos.y, this.cardW, this.cardH, 8);
            ctx.fill();
            ctx.stroke();

            // duck
            const img = this.imgs[skin.id];
            ctx.imageSmoothingEnabled = false;
            if (img && img.complete && img.width > 0) {
                ctx.drawImage(img, 0, 0, img.width, img.height, pos.x + 23, pos.y + 10, 85, 85);
            } else {
                // placeholder if image bad :(
                ctx.fillStyle = '#ddd';
                ctx.fillRect(pos.x + 23, pos.y + 10, 85, 85);
            }

            // lock
            if (!owned) {
                ctx.fillStyle = 'rgba(34, 33, 33, 0.55)';
                ctx.beginPath();
                ctx.roundRect(pos.x, pos.y, this.cardW, this.cardH - 40, 8);
                ctx.fill();
                ctx.font = '28px monospace';
                ctx.textAlign = 'center';
                ctx.fillStyle = 'white';
                // idk
            }

            // skin
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#333';
            ctx.fillText(skin.name, pos.x + this.cardW / 2, pos.y + 105);

            // price
            if (!owned) {
                if (coin.img && coin.img.complete) {
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(coin.img, 0, 0, 20, 20, pos.x + 26, pos.y + 115, 26, 26);
                }
                ctx.font = 'bold 15px monospace';
                ctx.fillStyle = scoring.totalCoins >= skin.price ? '#dbff98' : '#c00';
                ctx.textAlign = 'left';
                ctx.fillText(`${skin.price}`, pos.x + 57, pos.y + 133);
            }

            // button
            const btnY = pos.y + this.cardH - 38;
            const btnX = pos.x + 8;
            const btnW = this.cardW - 16;
            const btnH = 32;

            if (equipped) {
                ctx.fillStyle = '#bbb';
            } else if (owned) {
                ctx.fillStyle = '#3a8f3a';
            } else {
                ctx.fillStyle = scoring.totalCoins >= skin.price ? '#f4c842' : '#ccc';
            }

            ctx.beginPath();
            ctx.roundRect(btnX, btnY, btnW, btnH, 4);
            ctx.fill();

            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = equipped ? '#888' : '#1a1a1a';
            const btnLabel = equipped ? 'SELECTED' : owned ? 'SELECT' : 'BUY';
            ctx.fillText(btnLabel, pos.x + this.cardW / 2, btnY + 22);
        }

        ctx.restore();
    },

    handleClick(cx, cy, W, H) {
        // back
        if (cx >= 20 && cx <= 140 && cy >= 14 && cy <= 52) {
            state = 'title';
            return;
        }

        const positions = this.getCardPositions(W, H);
        for (let i = 0; i < this.skins.length; i++) {
            const skin = this.skins[i];
            const pos = positions[i];
            const owned = this.owned.includes(skin.id);
            const equipped = this.equipped === skin.id;

            const btnY = pos.y + this.cardH - 34;
            const btnX = pos.x + 8;
            const btnW = this.cardW - 16;
            const btnH = 26;

            if (cx >= btnX && cx <= btnX + btnW && cy >= btnY && cy <= btnY + btnH) {
                if (equipped) return;
                if (owned) {
                    this.equip(skin.id);
                } else {
                    this.purchase(skin.id);
                    if (this.owned.includes(skin.id)) this.equip(skin.id);
                }
            }
        }
    }
};