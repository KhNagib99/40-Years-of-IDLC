const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const userPhotoInput = document.getElementById("userPhoto");
const downloadBtn = document.getElementById("downloadBtn");

let userImage = null;
let frameImage = new Image();
frameImage.src = "frames/frame.png"; // Static frame set by admin

frameImage.onload = () => {
  drawImages();
};

userPhotoInput.addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    userImage = new Image();
    userImage.onload = drawImages;
    userImage.src = event.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

function drawImages() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (userImage) {
    ctx.drawImage(userImage, 0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
}

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "framed-photo.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
