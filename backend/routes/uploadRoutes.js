const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('admin', 'student'), upload.single('image'), (req, res) => {
  if (req.file) {
    res.status(200).json({ success: true, file: req.file.filename });
  } else {
    res.status(400).json({ success: false, message: 'File upload failed' });
  }
});

module.exports = router;
