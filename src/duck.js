const duck = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,        // visual
    heading: 0,      // vel angel
    maxSpeed: 8,
    accel: 0.12,     //logistic curve
    turnRate: 0.02,  //low = overshoot
    drag: 0.995,

    update(mouse, canvas) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const dx = mouse.x - cx;
        const dy = mouse.y - cy;
        const targetAngle = Math.atan2(dy, dx);

      //speed
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

        let headingDiff = targetAngle - this.heading;
      //-pi pi wrap
      while (headingDiff > Math.PI) headingDiff -= Math.PI * 2;
      while (headingDiff < -Math.PI) headingDiff += Math.PI * 2;
        //drifts
      const turnEase = this.turnRate / (1 + speed * 0.08);
      this.heading += headingDiff * turnEase;

        const alignment = Math.cos(headingDiff);

      // logistic
        const alignmentFactor = Math.max(0, alignment);
      const logisticAccel = this.accel * alignmentFactor * (1 - (speed / this.maxSpeed));

      this.vx += Math.cos(this.heading) * logisticAccel;
      this.vy += Math.sin(this.heading) * logisticAccel;

      this.vx *= this.drag;
      this.vy *= this.drag;

      //cap speed
      const newSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (newSpeed > this.maxSpeed) {
        this.vx = (this.vx / newSpeed) * this.maxSpeed;
        this.vy = (this.vy / newSpeed) * this.maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        let angleDiff = this.heading - this.angle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      this.angle += angleDiff * 0.12;
    }
    
};