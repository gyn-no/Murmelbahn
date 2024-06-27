class Pixel {

    // Array zum Speichern der Pixel
    static pixels = [];

    static dust(pos, color, size) {
        for (let i = 0; i < 100; i++) {
            pixels.push(new Pixel(pos.x - (i % 2) * 10, pos.y, color, size, 'DUST'));
        }
    }

    static boom(pos, color, size) {
        for (let i = 0; i < 100; i++) {
            let pixel = new Pixel(pos.x - (i % 2) * 10, pos.y, color, size, 'BOOM')
            pixel.speed.x = 2 - Math.random() * 5;
            pixel.speed.y = 2 - Math.random() * 5;
            pixels.push(pixel);
        }
    }

    // Animationsschleife
    static animate() {
        // Entferne Pixel, die aus dem Sichtbereich fallen
        pixels = pixels.filter(pixel => pixel.x >= 0 && pixel.x <= canvas.width && pixel.y >= 0 && pixel.y <= canvas.height);
        // Aktualisiere und zeichne jedes Pixel
        pixels.forEach(pixel => {
            if (pixel.type == 'DUST') {
                pixel.curve();
                pixel.straight();
                pixel.spray();
            } else {
                pixel.straight();
                pixel.size = Math.max(1, pixel.size - 0.1)
            }
            pixel.draw();
        });
    }

    constructor(x, y, color, size, type) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size || 2;
        this.type = type || 'DUST';
        this.x0 = 0;
        this.y0 = 0;
        this.a = Math.random() * 1 * Math.PI;
        this.r = { x: Math.random() * 3, y: 20 + Math.random() * 10 };
        this.speed = { x: 0, y: 2 + Math.random() * 3 }; // zufällige Geschwindigkeit
        this.dx = 0.7 - Math.random() * 1.4;
        this.ttl = 50 + Math.random() * 50;
    }

    straight() {
        this.x += this.speed.x;
        this.y -= this.speed.y;
    }

    curve() {
        this.x0 = this.r.x * Math.sin(this.a);
        this.y0 = this.r.y * Math.cos(this.a);
        this.r.x += Math.random()
        this.a += 0.1;
    }

    spray() {
        this.y -= this.speed.y;
        // this.speed -= 0.05;
        this.x += this.dx;
    }

    draw() {
        noStroke();
        fill(this.color);
        rect(this.x + this.x0, this.y + this.y0, this.size, this.size);
        if (this.ttl-- < 0) {
            this.y = -100
        }
    }
}  