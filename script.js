const width = 500;
const height = 500;

const stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height,
});

const layer = new Konva.Layer();
stage.add(layer);

// Add a neutral background (optional)
const background = new Konva.Rect({
  width: width,
  height: height,
  fill: '#f0f0f0',
});
layer.add(background);

// Declare userPhoto globally so we can reuse/replace it
let userPhoto;

// Handle photo upload
document.getElementById('upload-photo').addEventListener('change', function (e) {
  const reader = new FileReader();
  reader.onload = function () {
    const userImg = new Image();
    userImg.src = reader.result;
    userImg.onload = () => {
      if (userPhoto) {
        userPhoto.destroy(); // remove previous photo
      }

      // Calculate scale to fit image inside canvas
      const scale = Math.min(width / userImg.width, height / userImg.height);
      const imgWidth = userImg.width * scale;
      const imgHeight = userImg.height * scale;
      const offsetX = (width - imgWidth) / 2;
      const offsetY = (height - imgHeight) / 2;

      userPhoto = new Konva.Image({
        image: userImg,
        draggable: true,
        x: offsetX,
        y: offsetY,
        width: imgWidth,
        height: imgHeight,
      });

      // Allow zoom on scroll
      userPhoto.on('wheel', (e) => {
        e.evt.preventDefault();
        const scaleBy = 1.05;
        const oldScale = userPhoto.scaleX();
        const pointer = stage.getPointerPosition();
        const mousePointTo = {
          x: (pointer.x - userPhoto.x()) / oldScale,
          y: (pointer.y - userPhoto.y()) / oldScale,
        };

        const direction = e.evt.deltaY > 0 ? -1 : 1;
        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        userPhoto.scale({ x: newScale, y: newScale });
        userPhoto.position({
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        });

        layer.batchDraw();
      });

      layer.add(userPhoto);
      userPhoto.moveToBottom(); // move photo below frame (but above background)
      background.moveToBottom(); // background stays lowest
      layer.batchDraw();
    };
  };
  reader.readAsDataURL(e.target.files[0]);
});

// Add the frame on top (after background & photo)
const frameImg = new Image();
frameImg.src = 'frames/frame.png';
frameImg.onload = () => {
  const frame = new Konva.Image({
    image: frameImg,
    width: width,
    height: height,
    listening: false, // makes sure it doesn’t block user photo dragging
  });
  layer.add(frame);
  frame.moveToTop();
  layer.draw();
};

// Download image
document.getElementById('download-btn').addEventListener('click', function () {
  const dataURL = stage.toDataURL({ pixelRatio: 2 });
  const link = document.createElement('a');
  link.download = 'framed-photo.png';
  link.href = dataURL;
  link.click();
});
