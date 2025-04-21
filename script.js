const canvas = new fabric.Canvas("canvas", {
  width: 600,
  height: 600,
  selection: false
});

const canvasContainer = document.getElementById("imageCanvas");
const photoUpload = document.getElementById("photoUpload");

let userImage;

photoUpload.addEventListener("change", function (e) {
  const reader = new FileReader();
  reader.onload = function (f) {
    fabric.Image.fromURL(f.target.result, function (img) {
      if (userImage) canvas.remove(userImage);

      img.set({
        left: 0,
        top: 0,
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
        hasBorders: false,
        hasControls: true,
        lockRotation: true,
        cornerStyle: "circle",
        cornerColor: "#e60012"
      });

      img.setControlsVisibility({
        mt: false, mb: false, ml: false, mr: false, mtr: false
      });

      canvas.add(img);
      canvas.sendToBack(img);
      userImage = img;
    });
  };
  reader.readAsDataURL(e.target.files[0]);
});

// Load frame as image on canvas
fabric.Image.fromURL("assets/frame.png", function (frameImg) {
  frameImg.set({
    left: 0,
    top: 0,
    selectable: false
  });
  frameImg.scaleToWidth(canvas.width);
  canvas.add(frameImg);
  canvas.bringToFront(frameImg);
});

document.getElementById("downloadBtn").addEventListener("click", function () {
  const dataURL = canvas.toDataURL({
    format: "png"
  });

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "framed-photo.png";
  link.click();
});
