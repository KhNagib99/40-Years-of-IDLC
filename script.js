const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
const downloadBtn = document.getElementById('download');
let panZoom;
let img = new Image();

upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();

  reader.onload = function (event) {
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
});

img.onload = () => {
  canvas.width = 1080;
  canvas.height = 1080;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  if (panZoom) panZoom.dispose(); // Reset on new image
  panZoom = panzoom(canvas, {
    bounds: true,
    boundsPadding: 0.1,
    maxZoom: 3,
    minZoom: 0.5
  });
};

downloadBtn.addEventListener('click', () => {
  // Save canvas as image
  const link = document.createElement('a');
  link.download = 'framed-photo.png';
  link.href = canvas.toDataURL();
  link.click();
});
