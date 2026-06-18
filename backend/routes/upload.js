const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const { optionalAuth } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(file.originalname.toLowerCase().split('.').pop());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
  },
});

let gfs;
mongoose.connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
});

const uploadToGridFS = (file) => {
  return new Promise((resolve, reject) => {
    const filename = `${Date.now()}-${file.originalname}`;
    const uploadStream = gfs.openUploadStream(filename, {
      contentType: file.mimetype,
      metadata: { originalName: file.originalname },
    });
    uploadStream.on('error', reject);
    uploadStream.on('finish', () => resolve(filename));
    uploadStream.end(file.buffer);
  });
};

router.post('/', optionalAuth, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    if (!gfs) {
      return res.status(500).json({ error: 'Storage not ready' });
    }
    const urls = [];
    for (const file of req.files) {
      const filename = await uploadToGridFS(file);
      urls.push(`/api/upload/${filename}`);
    }
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:filename', async (req, res) => {
  try {
    if (!gfs) {
      return res.status(500).json({ error: 'Storage not ready' });
    }
    const files = await gfs.find({ filename: req.params.filename }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.set('Content-Type', files[0].contentType);
    gfs.openDownloadStreamByName(req.params.filename).pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
