const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const downloadLink = document.getElementById('downloadLink');

const picaResizer = pica();

imageInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const fileName = file.name.replace(/\.[^/.]+$/, ""); // 拡張子除去
  const newFileName = `${fileName}_02.jpg`;

  const img = new Image();
  img.onload = async () => {
    const targetWidth = 800;
    const scale = targetWidth / img.width;
    const targetHeight = Math.round(img.height * scale);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    await picaResizer.resize(img, canvas);

    canvas.classList.remove('hidden');
    downloadLink.classList.remove('hidden');

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = newFileName;
    }, 'image/jpeg', 0.9);
  };

  const reader = new FileReader();
  reader.onload = e => {
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});
