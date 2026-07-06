const scoring = {
    score: 0,
    highScore: parseInt(localStorage.getItem('quakers_highscore') || '0'),
    totalCoins: parseInt(localStorage.getItem('quakers_coins') || '0'),
    runCoins: 0,
    multiplier: 1,
    timer: 0,
    nearMissChain: 0,
    nearMissChainTimer: 0,
    totalNearMisses: 0,
    survivalFrames: 0, 

    update() {
    this.survivalFrames++;
    this.timer++;
    if (this.timer >= 60) {
        this.timer = 0;
        this.score += 1 * this.multiplier;
    }

      //cahin timer
    if (this.nearMissChainTimer > 0) {
        this.nearMissChainTimer--;
        if (this.nearMissChainTimer <= 0) {
            this.nearMissChain = 0;
        }
    }

        const speed = Math.sqrt(duck.vx * duck.vx + duck.vy * duck.vy);
        this.multiplier = speed >= 8.5 ? 1.5 : 1;
    },

    nearMiss() {
        this.totalNearMisses++;
        this.nearMissChain++;
        this.nearMissChainTimer = 120;

        const base = this.nearMissChain >= 8 ? 10 : 5;
        const chainBonus = this.nearMissChain >= 8 ? 2 : 1;
        this.score += Math.round(base * chainBonus * this.multiplier);
    },

    addCoin(amount) {
        this.runCoins += amount;
    },

    finalizeCoins() {
        if (this.coinsFinalized) return;
        this.coinsFinalized = true;
        const bonus = Math.floor(this.score / 60);
        const total = this.runCoins + bonus;
        this.totalCoins += total;
        localStorage.setItem('quakers_coins', this.totalCoins);
        return { bonus, runCoins: this.runCoins, total };
    },


    reset() {
        this.score = 0;
        this.multiplier = 1;
        this.timer = 0;
        this.nearMissChain = 0;
        this.nearMissChainTimer = 0;
        this.totalNearMisses = 0;
        this.survivalFrames = 0;
        this.runCoins = 0;
        this.coinsFinalized = false;
    },

    checkHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('quakers_highscore', this.highScore);
        }
    },
};