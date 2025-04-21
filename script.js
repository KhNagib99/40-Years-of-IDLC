const photoInput = document.getElementById("photoInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const downloadBtn = document.getElementById("downloadBtn");

let userImage = null;
let frameImage = new Image();
frameImage.src = "frames/frame1.png"; // Your default frame

frameImage.onload = () => {
  drawCanvas();
};

photoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    userImage = new Image();
    userImage.onload = drawCanvas;
    userImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (userImage) {
    const scale = Math.max(
      canvas.width / userImage.width,
      canvas.height / userImage.height
    );
    const x = (canvas.width / 2) - (userImage.width / 2) * scale;
    const y = (canvas.height / 2) - (userImage.height / 2) * scale;

    ctx.drawImage(userImage, x, y, userImage.width * scale, userImage.height * scale);
  }

  if (frameImage.complete) {
    ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
  }
}

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "framed-photo.png";
  link.href = canvas.toDataURL();
  link.click();
});
