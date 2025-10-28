const multer = require('multer');

// Konfigurasi penyimpanan di memori
const storage = multer.memoryStorage();

// Filter file yang diizinkan
const fileFilter = (_req, file, cb) => {
  if (
    [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ].includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Jenis berkas tidak valid! Hanya JPEG, PNG, dan PDF yang diizinkan.',
      ),
      false,
    );
  }
};

// Middleware upload
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Max file size = 5 MB
  fileFilter,
}).any();

// Middleware untuk menangani error dari Multer
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Error dari multer (ukuran file terlalu besar, dll.)
      return res.status(400).json({
        success: false,
        message:
          err.code === 'LIMIT_FILE_SIZE'
            ? 'Ukuran berkas terlalu besar! Maksimal 5 MB.'
            : err.message,
      });
    } else if (err) {
      // Error lain (misalnya format file tidak sesuai)
      return res.status(400).json({
        success: false,
        message: err.message || 'Pengunggahan berkas gagal!',
      });
    }
    next();
  });
};

module.exports = {
  uploadMiddleware,
};
