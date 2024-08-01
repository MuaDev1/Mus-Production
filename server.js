const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // زيادة الحد الأقصى لحجم الملف إلى 10 ميجابايت
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/chapter', upload.array('images'), (req, res) => {
  const { title, chapterNumber, mangaId } = req.body;
  const images = req.files.map(file => file.path);

  console.log('Received data:', { title, chapterNumber, mangaId, images });

  // أضف هنا منطق لتخزين الفصل في قاعدة البيانات

  res.status(201).json({ title, chapterNumber, mangaId, images });
});

app.listen(5000, () => {
  console.log('Server is running on port 3000');
});
