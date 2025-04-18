{\rtf1\ansi\ansicpg932\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const imageInput = document.getElementById('imageInput');\
const canvas = document.getElementById('canvas');\
const downloadLink = document.getElementById('downloadLink');\
\
const picaResizer = pica();\
\
imageInput.addEventListener('change', async (event) => \{\
  const file = event.target.files[0];\
  if (!file) return;\
\
  const img = new Image();\
  img.onload = async () => \{\
    const targetWidth = 800;\
    const scale = targetWidth / img.width;\
    const targetHeight = Math.round(img.height * scale);\
\
    canvas.width = targetWidth;\
    canvas.height = targetHeight;\
\
    await picaResizer.resize(img, canvas);\
\
    canvas.classList.remove('hidden');\
    downloadLink.classList.remove('hidden');\
\
    canvas.toBlob(blob => \{\
      const url = URL.createObjectURL(blob);\
      downloadLink.href = url;\
    \}, 'image/jpeg', 0.9);\
  \};\
\
  const reader = new FileReader();\
  reader.onload = e => \{\
    img.src = e.target.result;\
  \};\
  reader.readAsDataURL(file);\
\});}