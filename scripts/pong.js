
class Ball {

    constructor() {
        this.ball = document.getElementById("ball");
        this.x = parseInt(this.ball.getAttribute("cx"));
        this.y = parseInt(this.ball.getAttribute("cy"));
        this.r = parseInt(this.ball.getAttribute("r"));
        this.speed = 0;
        this.angle = 0;
        this.moving = false;
        this.launch_ball();
    }

    launch_ball() {
        this.speed = 5;
        this.angle = Math.floor(Math.random() * 361) * Math.PI / 180;
        while ((this.angle > 1.22173 && this.angle < 1.91986) || (this.angle > 4.36332 && this.angle < 5.06145)) {
            this.angle = Math.floor(Math.random() * 361) * Math.PI / 180;
        }
        if (!this.moving) this.moving = setInterval(this.move_ball.bind(this), 10);

    }

    move_ball() {
        if ((this.x < -2 || this.x > 1002) || check_collision(this, player1) || check_collision(this, player2)) {
            this.angle = Math.PI - this.angle;
            this.speed += 0.3;
        }
        if (this.y < 5 || this.y > 495) {
            this.angle = -this.angle;
        }
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        this.ball.setAttribute("cx", this.x.toString());
        this.ball.setAttribute("cy", this.y.toString());
    }

}

class Player {

    constructor(id) {
        this.player = document.getElementById(id);
        this.x = parseInt(this.player.getAttribute("x"));
        this.x2 = this.x + 5;
        this.y = parseInt(this.player.getAttribute("y"));
        this.y2 = this.y + 50;
        this.speed = 1;
        this.score = 0;
        this.moveUp = false;
        this.moveDown = false;
    }

    move_player_up() {
        if (this.moveUp && this.y > 0) {
            this.y -= this.speed;
            this.player.setAttribute("y", this.y.toString());
            console.log(this.y);
        }

    }

    move_player_down() {
        if (this.moveDown && this.y < 400) {
            this.y += this.speed;
            console.log(this.y);
            this.player.setAttribute("y", this.y.toString());
        }
    }

    update_score() {
        this.score_text = document.getElementById(this.player.id + "_score");
        this.score_text.textContent = this.score.toString();
    }

    goal() {
        this.score += 1;
        this.update_score();
    }

}

function respawn_ball() {
    ball.x = 500;
    ball.y = 250;
    ball.launch_ball();
}

function check_collision(ball, player) {
    if (Math.abs(ball.x - player.x2) < ball.r + 5) {
        if (Math.abs(ball.y - player.y2) < Math.abs(player.y2 - player.y)) {

            return true;
        }
    }
    return false;
}

function gameLoop() {
    setInterval(() => {
        player1.move_player_up();
        player1.move_player_down();
        player2.move_player_up();
        player2.move_player_down();
        if (ball.x < 0) {
            player2.goal();
            respawn_ball();
        }
        else if (ball.x > 1000) {
            player1.goal();
            respawn_ball();
        }
    });

}

window.addEventListener("keydown", (e) => {
    if (e.key === "w") player1.moveUp = true;
    if (e.key === "s") player1.moveDown = true;
    if (e.key === "ArrowUp") player2.moveUp = true;
    if (e.key === "ArrowDown") player2.moveDown = true;
});

window.addEventListener("keyup", (e) => {
    if (e.key === "w") player1.moveUp = false;
    if (e.key === "s") player1.moveDown = false;
    if (e.key === "ArrowUp") player2.moveUp = false;
    if (e.key === "ArrowDown") player2.moveDown = false;
});


let player1 = new Player("player1");
let player2 = new Player("player2");
let ball = new Ball();

window.onload = () => {
    ball.launch_ball();
    gameLoop();
}

