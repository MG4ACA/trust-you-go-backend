const multer = require('multer');
const path = require('path');
const {
  generateUniqueFilename,
  getLocationUploadDir,
  ensureDirectory,
} = require('../services/fileService');
const config = require('../config');

// Storage configuration for location images
const locationStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const locationId = req.params.id || req.body.location_id;

      if (!locationId) {
        return cb(new Error('Location ID is required'));
      }

      const uploadDir = getLocationUploadDir(locationId);
      await ensureDirectory(uploadDir);
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = generateUniqueFilename(file.originalname);
    cb(null, uniqueName);
  },
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  const allowedMimes = config.upload.allowedTypes;

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedMimes.join(', ')}`), false);
  }
};

// Multer upload middleware for location images
const uploadLocationImage = multer({
  storage: locationStorage,
  limits: {
    fileSize: config.upload.maxSize,
  },
  fileFilter: fileFilter,
});

// Multer upload middleware for memory storage (if needed)
const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.upload.maxSize,
  },
  fileFilter: fileFilter,
});

module.exports = {
  uploadLocationImage,
  uploadMemory,
};
