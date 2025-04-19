const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const downloadLink = document.getElementById('downloadLink');
const fileNameDisplay = document.getElementById('fileName');

const picaResizer = pica();

// ファイルサイズをKB/MBに変換する関数
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
  const fileName = file.name.replace(/\.[^/.]+$/, ""); // 拡張子を除く
  const newFileName = `${fileName}_02.jpg`;

  const img = new Image();
  img.onload = async () => {
    const targetWidth = 800;
    const scale = targetWidth / img.width;
    const targetHeight = Math.round(img.height * scale);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    await picaResizer.resize(img, canvas);

    // Blob作成 → リサイズ後サイズ取得
    canvas.toBlob(blob => {
      const resizedSizeText = formatFileSize(blob.size);

      // ✅ 表示を更新（元とリサイズ後両方）
      fileNameDisplay.textContent = `${file.name}（元: ${originalSizeText} → リサイズ後: ${resizedSizeText}）`;

      // ダウンロードリンク設定
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = newFileName;

      // 表示切り替え
      canvas.classList.remove('hidden');
      downloadLink.classList.remove('hidden');
    }, 'image/jpeg', 0.9);
  };

  const reader = new FileReader();
  reader.onload = e => {
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});
