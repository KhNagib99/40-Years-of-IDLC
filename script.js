const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const frameInput = document.getElementById("frameInput");
const photoInput = document.getElementById("photoInput");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");

let frameImg = null;
let photoImg = null;
let photoPos = { x: 0, y: 0, scale: 1 };
let dragging = false;
let lastTouchDistance = null;
let lastMousePos = null;

function drawCanvas() {
  if (!frameImg || !photoImg) return;

  loading.style.display = "none";

  canvas.width = frameImg.width;
  canvas.height = frameImg.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const w = photoImg.width * photoPos.scale;
  const h = photoImg.height * photoPos.scale;
  const x = photoPos.x;
  const y = photoPos.y;

  ctx.drawImage(photoImg, x, y, w, h);
  ctx.drawImage(frameImg, 0, 0);
}

frameInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    frameImg = new Image();
    frameImg.onload = () => {
      if (photoImg) drawCanvas();
    };
    frameImg.src = reader.result;
    loading.style.display = "block";
  };
  reader.readAsDataURL(file);
});

photoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    photoImg = new Image();
    photoImg.onload = () => {
      photoPos = {
        x: canvas.width / 4,
        y: canvas.height / 4,
        scale: 1
      };
      drawCanvas();
    };
    photoImg.src = reader.result;
  };
  reader.readAsDataURL(file);
});

canvas.addEventListener("mousedown", (e) => {
  dragging = true;
  lastMousePos = { x: e.offsetX, y: e.offsetY };
});

canvas.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  const dx = e.offsetX - lastMousePos.x;
  const dy = e.offsetY - lastMousePos.y;
  photoPos.x += dx;
  photoPos.y += dy;
  lastMousePos = { x: e.offsetX, y: e.offsetY };
  drawCanvas();
});

canvas.addEventListener("mouseup", () => dragging = false);
canvas.addEventListener("mouseleave", () => dragging = false);

// Mobile touch drag & pinch zoom
canvas.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    dragging = true;
    lastMousePos = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  } else if (e.touches.length === 2) {
    lastTouchDistance = getDistance(e.touches);
  }
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (e.touches.length === 1 && dragging) {
    const dx = e.touches[0].clientX - lastMousePos.x;
    const dy = e.touches[0].clientY - lastMousePos.y;
    photoPos.x += dx;
    photoPos.y += dy;
    lastMousePos = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    drawCanvas();
  } else if (e.touches.length === 2) {
    const newDist = getDistance(e.touches);
    if (lastTouchDistance) {
      const delta = newDist / lastTouchDistance;
      photoPos.scale *= delta;
      drawCanvas();
    }
    lastTouchDistance = newDist;
  }
}, { passive: false });

canvas.addEventListener("touchend", () => {
  dragging = false;
  lastTouchDistance = null;
});

function getDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "framed-photo.png";
  link.href = canvas.toDataURL();
  link.click();
});
