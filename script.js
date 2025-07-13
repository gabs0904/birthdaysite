const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;
let revealed = false;

function setupCanvas() {
  ctx.fillStyle = "#c0c0c0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = "#888";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Scratch me!", canvas.width / 2, canvas.height / 2);
}

function getPosition(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
    y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top,
  };
}

function scratch(e) {
  if (!isDrawing) return;
  e.preventDefault();
  const pos = getPosition(e);
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
  ctx.fill();

  checkReveal();
}

function checkReveal() {
  if (revealed) return;

  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let transparentPixels = 0;

  for (let i = 3; i < pixels.data.length; i += 4) {
    if (pixels.data[i] === 0) transparentPixels++;
  }

  const percent = transparentPixels / (canvas.width * canvas.height) * 100;

  if (percent > 50) {
    revealed = true;
    launchConfetti();
  }
}

function launchConfetti() {
  const duration = 20 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 600, ticks: 60, zIndex: 999 };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    });
  }, 250);

    const cake = document.getElementById("cake");
  cake.style.display = "block";
}

canvas.addEventListener("mousedown", () => (isDrawing = true));
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mousemove", scratch);

canvas.addEventListener("touchstart", () => (isDrawing = true));
canvas.addEventListener("touchend", () => (isDrawing = false));
canvas.addEventListener("touchmove", scratch);

setupCanvas();
