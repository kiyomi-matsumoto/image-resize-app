const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const downloadLink = document.getElementById('downloadLink');
const fileNameDisplay = document.getElementById('fileName');

const picaResizer = pica();

function formatFileSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  } else {
    return (bytes / 1024).toFixed(1) + ' KB';
  }
}

imageInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const originalSizeText = formatFileSize(file.size);
  const fileName = file.name.replace(/\.[^/.]+$/, "");
  const newFileName = `${fileName}_02.jpg`;

  // ダウンロードボタンは一旦非表示に戻す（再選択時に備えて）
  downloadLink.classList.add('hidden');

  const img = new Image();
  img.onload = async () => {
    const targetWidth = 800;
    const scale = targetWidth / img.width;
    const targetHeight = Math.round(img.height * scale);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    await picaResizer.resize(img, canvas);

    canvas.toBlob(blob => {
      const resizedSizeText = formatFileSize(blob.size);
      fileNameDisplay.textContent = `${file.name}（元: ${originalSizeText} → リサイズ後: ${resizedSizeText}）`;

      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = newFileName;

      // ✅ リサイズ完了後にボタン表示
      downloadLink.classList.remove('hidden');
      canvas.classList.remove('hidden');
    }, 'image/jpeg', 0.9);
  };

  const reader = new FileReader();
  reader.onload = e => {
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});
