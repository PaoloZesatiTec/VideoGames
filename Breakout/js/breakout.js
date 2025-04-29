"use strict";

const canvasWidth = 800;
const canvasHeight = 600;

let oldTime;
let ctx;
let game;

const paddleVelocity = 0.7;
const ballInitialSpeed = 0.4;

const numRows = 5;    // Número configurable de renglones
const numCols = 7;   // Número configurable de columnas

class Ball extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "ball");
        this.reset();
    }

    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(deltaTime));
    }

    reset() {
        this.inPlay = false;
        this.position = new Vec(canvasWidth / 2, canvasHeight / 2);
        this.velocity = new Vec(0, 0);
    }

    launch() {
        if (!this.inPlay) {
            this.inPlay = true;
            let angle = Math.random() * Math.PI / 3 + Math.PI / 6;
            this.velocity = new Vec(Math.cos(angle), -Math.sin(angle)).times(ballInitialSpeed);
        }
    }
}

class Paddle extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "paddle");
        this.velocity = new Vec(0.0, 0.0);
    }

    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(deltaTime));
        // No salir de los bordes
        if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width;
        }
    }
}

class Game {
    constructor(canvasWidth, canvasHeight) {
        this.ball = new Ball(new Vec(canvasWidth / 2, canvasHeight / 2), 20, 20, "white");
        this.paddle = new Paddle(new Vec(canvasWidth / 2 - 50, canvasHeight - 40), 100, 20, "blue");

        this.blocks = [];
        this.blockWidth = 100;
        this.blockHeight = 40;
        this.blockPadding = 10;
        this.offsetTop = 60;
        this.offsetLeft = 20;

        this.createBlocks();

        this.destroyedBlocks = 0;
        this.lives = 3;

        this.createEventListeners();
    }

    createBlocks() {
        for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
                let x = this.offsetLeft + c * (this.blockWidth + this.blockPadding);
                let y = this.offsetTop + r * (this.blockHeight + this.blockPadding);
                let block = new GameObject(new Vec(x, y), this.blockWidth, this.blockHeight, this.randomColor(), "block");
                this.blocks.push(block);
            }
        }
    }

    randomColor() {
        const colors = ["red", "gray", "blue", "green", "cyan", "purple", "gold"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(deltaTime) {
        this.ball.update(deltaTime);
        this.paddle.update(deltaTime);

        // Rebote contra paredes
        if (this.ball.position.x <= 0 || this.ball.position.x + this.ball.width >= canvasWidth) {
            this.ball.velocity.x *= -1;
        }
        if (this.ball.position.y <= 0) {
            this.ball.velocity.y *= -1;
        }

        // Rebote contra paleta
        if (boxOverlap(this.ball, this.paddle)) {
            this.ball.velocity.y *= -1;
        }

        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            if (block && boxOverlap(this.ball, block)) {
                this.ball.velocity.y *= -1;
                
                // Barra de oro vale 5 puntos

                if (block.color === "gold") {
                    this.destroyedBlocks += 5;
                } else {
                    this.destroyedBlocks++;
                }
        
                this.blocks.splice(i, 1);
                break;
            }
        }
        

        // Pierde vida si cae abajo
        if (this.ball.position.y > canvasHeight) {
            this.lives--;
            if (this.lives <= 0) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                this.ball.reset();
            }
        }

        // Gana si destruyó todos los bloques
        if (this.destroyedBlocks === numRows * numCols) {
            alert("¡GANASTE!");
            document.location.reload();
        }
    }

    draw(ctx) {
        // Fondo
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        this.paddle.draw(ctx);
        this.ball.draw(ctx);

        for (let block of this.blocks) {
                block.draw(ctx);
            }
        

        ctx.fillStyle = "red";
        ctx.font = "20px Arial";
        ctx.fillText(`VIDAS: ${this.lives}`, 10, 20);
        ctx.fillText(`BLOQUES DESTRUIDOS: ${this.destroyedBlocks}`, 10, 40);
    }

    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key == 'ArrowLeft') {
                this.paddle.velocity = new Vec(-paddleVelocity, 0);
            } else if (event.key == 'ArrowRight') {
                this.paddle.velocity = new Vec(paddleVelocity, 0);
            } else if (event.key == ' ' && !this.ball.inPlay) {
                this.ball.launch();
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
                this.paddle.velocity = new Vec(0, 0);
            }
        });
    }
}

function main() {
    const canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    game = new Game(canvasWidth, canvasHeight);

    drawScene(0);
}

function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.update(deltaTime);
    game.draw(ctx);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}
