const multer = require("multer");
const storage = multer.memoryStorage();

// Filter file yang diizinkan
const fileFilter = (_req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format Image tidak sesuai"), false);
  }
};

// Konfigurasi multer
const size = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Maksimum 5 MB
  fileFilter,
}).any();

// Middleware upload
const upload = (req, res, next) => {
  size(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Error dari multer
      return res.status(400).json({
        status: 102,
        message:
          err.code === "LIMIT_FILE_SIZE"
            ? "Ukuran berkas terlalu besar! Maksimal 5 MB."
            : err.message,
        data: null,
      });
    } else if (err) {
      return res.status(400).json({
        status: 102,
        message: err.message || "Pengunggahan berkas gagal!",
        data: null,
      });
    }
    next();
  });
};

module.exports = {
  upload,
};
