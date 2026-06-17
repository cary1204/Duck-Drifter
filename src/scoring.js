const scoring = {
    score: 0,
    multiplier: 1,
    timer: 0,
    nearMissChain: 0,
    nearMissChainTimer: 0,

    update() {
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
        this.multiplier = speed >= 4.7 ? 1.5 : 1;
    },

    nearMiss() {
        this.nearMissChain++;
        this.nearMissChainTimer = 120;

        const base = this.nearMissChain >= 8 ? 10 : 5;
        const chainBonus = this.nearMissChain >= 8 ? 2 : 1;
        this.score += Math.round(base * chainBonus * this.multiplier);
    },

    reset() {
        this.score = 0;
        this.multiplier = 1;
        this.timer = 0;
        this.nearMissChain = 0;
        this.nearMissChainTimer = 0;
    }
};