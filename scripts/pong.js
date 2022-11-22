
// Ball class. It represents the ball in the game.
class Ball {

    // The ball's constructor takes the id of the document element as a parameter.
    constructor(id) {
        this.ball = document.getElementById(id);
        this.x = parseInt(this.ball.getAttribute("cx"));
        this.y = parseInt(this.ball.getAttribute("cy"));
        this.r = parseInt(this.ball.getAttribute("r"));
        this.speed = 0;
        this.angle = 0;
        this.moving = false;
        this.launch_ball();
    }

    // Method that launches the ball in a random direction at the beginning of every round.
    // It also checks the angle of the ball to make sure it doesn't go too far up or down.
    launch_ball() {
        this.speed = 5;
        this.angle = Math.floor(Math.random() * 361) * Math.PI / 180;
        while ((this.angle > 1.22173 && this.angle < 1.91986) || (this.angle > 4.36332 && this.angle < 5.06145)) {
            this.angle = Math.floor(Math.random() * 361) * Math.PI / 180;
        }
        if (!this.moving) this.moving = setInterval(this.move_ball.bind(this), 10);

    }

    // Method that moves the ball. The movement is calculated by using the speed and angle of the ball.
    // It checks if the ball is going to hit the borders of the game area and changes the angle accordingly.
    // It also checks if the ball is going to hit the paddles and changes the angle accordingly.
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

    // Method that resets the ball to the center of the game area.
    // It's called when a player scores a point.
    respawn_ball() {
        this.x = 500;
        this.y = 250;
        this.launch_ball();
    }

}

// Player class. It represents the paddles in the game.
class Player {

    // The player's constructor takes the id of the document element as a parameter.
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

    // Method that moves the player up.
    // It checks if the player is moving up and if the player is not at the top of the game area.
    move_player_up() {
        if (this.moveUp && this.y > 0) {
            this.y -= this.speed;
            this.y2 = this.y + 50;
            this.player.setAttribute("y", this.y.toString());
        }

    }

    // Method that moves the player down.
    // It checks if the player is moving down and if the player is not at the bottom of the game area.
    move_player_down() {
        if (this.moveDown && this.y < 400) {
            this.y += this.speed;
            this.y2 = this.y + 50;
            this.player.setAttribute("y", this.y.toString());
        }
    }

    // Method that updates the score of the player.
    update_score() {
        this.score_text = document.getElementById(this.player.id + "_score");
        this.score_text.textContent = this.score.toString();
    }

    // Method to be called when the player scores a point.
    goal() {
        this.score += 1;
        this.update_score();
    }

}

// Function that checks if the ball is colliding with the player.
// If a collision happens it returns true, otherwise it returns false.
function check_collision(ball, player) {
    if (Math.abs(ball.x - player.x2) < ball.r + 5) {
        if (Math.abs(ball.y - player.y2) < Math.abs(player.y2 - player.y)) {

            return true;
        }
    }
    return false;
}

// Function that handles the game loop. It's called every 10 milliseconds.
// It checks player's movement and scores.
function gameLoop() {
    setInterval(() => {
        player1.move_player_up();
        player1.move_player_down();
        player2.move_player_up();
        player2.move_player_down();
        if (ball.x < 0) {
            player2.goal();
            ball.respawn_ball();
        }
        else if (ball.x > 1000) {
            player1.goal();
            ball.respawn_ball();
        }
    });

}

// Event listener for players movement when a key is pressed.
window.addEventListener("keydown", (e) => {
    if (e.key === "w") player1.moveUp = true;
    if (e.key === "s") player1.moveDown = true;
    if (e.key === "ArrowUp") player2.moveUp = true;
    if (e.key === "ArrowDown") player2.moveDown = true;
});

// Event listener for players movement when a key is released.
window.addEventListener("keyup", (e) => {
    if (e.key === "w") player1.moveUp = false;
    if (e.key === "s") player1.moveDown = false;
    if (e.key === "ArrowUp") player2.moveUp = false;
    if (e.key === "ArrowDown") player2.moveDown = false;
});

// Main variables.
let player1 = new Player("player1");
let player2 = new Player("player2");
let ball = new Ball("ball");

// Game starter.
window.onload = () => {
    ball.launch_ball();
    gameLoop();
}

