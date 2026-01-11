// =======================
// CANVAS
// =======================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// =======================
// GAME STATE
// =======================
let score = 0;
let running = false;
let handVisible = false;
let gameOver = false;

// =======================
// PADDLE
// =======================
const paddle = {
  x: 40,
  y: canvas.height / 2,
  width: 14,
  height: 120,
  targetY: canvas.height / 2
};

// =======================
// BALL
// =======================
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: 9,
  vx: 6,
  vy: 4,
  speed: 1
};

// =======================
// UI
// =======================
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");
const scoreEl = document.getElementById("score");

function showOverlay(html) {
  overlay.style.display = "flex";
  overlay.style.pointerEvents = "auto";
  overlayText.innerHTML = html;
}


function hideOverlay() {
  overlay.style.display = "none";
  overlay.style.pointerEvents = "none";
}


// =======================
// RESET GAME
// =======================
function resetGame() {
  score = 0;
  scoreEl.textContent = score;
  gameOver = false;
  resetBall();
  hideOverlay();
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = 6 * (Math.random() > 0.5 ? 1 : -1);
  ball.vy = 4 * (Math.random() > 0.5 ? 1 : -1);
  ball.speed = 1;
}

// =======================
// UPDATE
// =======================
function update() {
  if (!running || gameOver) return;

  // Paddle smoothing
  paddle.y += (paddle.targetY - paddle.y) * 0.3;
  paddle.y = Math.max(
    0,
    Math.min(canvas.height - paddle.height, paddle.y)
  );

  // Ball movement
  ball.x += ball.vx * ball.speed;
  ball.y += ball.vy * ball.speed;

  // Top / bottom walls
  if (ball.y <= ball.r || ball.y >= canvas.height - ball.r) {
    ball.vy *= -1;
  }

  // Right wall bounce
  if (ball.x >= canvas.width - ball.r) {
    ball.vx = -Math.abs(ball.vx);
  }

  // Paddle hit
  if (
    ball.x - ball.r <= paddle.x + paddle.width &&
    ball.x > paddle.x &&
    ball.y >= paddle.y &&
    ball.y <= paddle.y + paddle.height
  ) {
    ball.vx = Math.abs(ball.vx);
    ball.speed += 0.05;
    score++;
    scoreEl.textContent = score;
  }

  // Miss → GAME OVER
  if (ball.x <= 0) {
    gameOver = true;
    running = false;

    showOverlay(`
      <div style="text-align:center">
        <div style="font-size:36px;margin-bottom:12px;">YOU LOSE</div>
        <div style="font-size:20px;margin-bottom:20px;">Score: ${score}</div>
        <button id="retryBtn" style="
          font-size:18px;
          padding:10px 24px;
          background:#fff;
          color:#000;
          border:none;
          cursor:pointer;
        ">RETRY</button>
      </div>
    `);

    document.getElementById("retryBtn").onclick = resetGame;
  }
}

// =======================
// DRAW (BLACK & WHITE)
// =======================
function draw() {
  // Black background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Center line
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.setLineDash([12, 16]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Paddle (white)
  ctx.fillStyle = "#fff";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // Ball (white)
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
}

// =======================
// LOOP
// =======================
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

// =======================
// MEDIAPIPE HANDS
// =======================
const video = document.getElementById("webcam");

const hands = new Hands({
  locateFile: f =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults(res => {
  if (!res.multiHandLandmarks || res.multiHandLandmarks.length === 0) {
    if (handVisible && !gameOver) {
      running = false;
      showOverlay("Hand not detected<br/>Show your hand to resume");
    }
    handVisible = false;
    return;
  }

  if (gameOver) return;

  handVisible = true;
  running = true;
  hideOverlay();

  const lm = res.multiHandLandmarks[0];

  // Palm center
  const palmY =
    (lm[0].y + lm[5].y + lm[9].y + lm[13].y + lm[17].y) / 5;

  paddle.targetY = palmY * canvas.height - paddle.height / 2;
});

// =======================
// CAMERA
// =======================
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});

camera.start().catch(() => {
  showOverlay("Camera access required");
});
// =======================