const fs = require('fs').promises;
const path = require('path');
const config = require('../config');

/**
 * Delete file from filesystem
 * @param {string} filePath - Path to file
 */
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log('✓ File deleted:', filePath);
    return { success: true };
  } catch (error) {
    console.error('✗ Error deleting file:', error.message);
    throw error;
  }
};

/**
 * Delete directory and all contents
 * @param {string} dirPath - Path to directory
 */
const deleteDirectory = async (dirPath) => {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
    console.log('✓ Directory deleted:', dirPath);
    return { success: true };
  } catch (error) {
    console.error('✗ Error deleting directory:', error.message);
    throw error;
  }
};

/**
 * Get file size in bytes
 * @param {string} filePath - Path to file
 * @returns {number} - File size in bytes
 */
const getFileSize = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    console.error('✗ Error getting file size:', error.message);
    throw error;
  }
};

/**
 * Check if file exists
 * @param {string} filePath - Path to file
 * @returns {boolean}
 */
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Path to directory
 */
const ensureDirectory = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return { success: true };
  } catch (error) {
    console.error('✗ Error creating directory:', error.message);
    throw error;
  }
};

/**
 * Convert file path to URL
 * @param {string} filePath - Relative file path
 * @returns {string} - Full URL
 */
const getFileUrl = (filePath) => {
  // Remove uploads/ prefix if present
  const relativePath = filePath.replace(/^uploads[\/\\]/, '');
  return `/uploads/${relativePath.replace(/\\/g, '/')}`;
};

/**
 * Convert URL to file path
 * @param {string} url - File URL
 * @returns {string} - File path
 */
const getFilePath = (url) => {
  // Remove /uploads/ prefix and convert to system path
  const relativePath = url.replace(/^\/uploads\//, '');
  return path.join(config.upload.dir, relativePath);
};

/**
 * Get file extension
 * @param {string} filename - File name
 * @returns {string} - File extension (lowercase)
 */
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

/**
 * Generate unique filename
 * @param {string} originalName - Original filename
 * @returns {string} - Unique filename
 */
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const ext = getFileExtension(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  const sanitizedName = nameWithoutExt.replace(/[^a-z0-9]/gi, '_').toLowerCase();

  return `${sanitizedName}_${timestamp}_${random}${ext}`;
};

/**
 * Validate file type
 * @param {string} mimetype - File MIME type
 * @returns {boolean}
 */
const isValidFileType = (mimetype) => {
  return config.upload.allowedTypes.includes(mimetype);
};

/**
 * Validate file size
 * @param {number} size - File size in bytes
 * @returns {boolean}
 */
const isValidFileSize = (size) => {
  return size <= config.upload.maxSize;
};

/**
 * Get upload directory for location
 * @param {string} locationId - Location ID
 * @returns {string} - Upload directory path
 */
const getLocationUploadDir = (locationId) => {
  return path.join(config.upload.dir, 'locations', locationId);
};

/**
 * Generate thumbnail (placeholder for future implementation)
 * @param {string} imagePath - Original image path
 * @returns {Promise<string>} - Thumbnail path
 */
const generateThumbnail = async (imagePath) => {
  // TODO: Implement thumbnail generation using sharp library
  // For now, return null as thumbnails are deferred
  console.log('⏳ Thumbnail generation will be implemented in future');
  return null;
};

module.exports = {
  deleteFile,
  deleteDirectory,
  getFileSize,
  fileExists,
  ensureDirectory,
  getFileUrl,
  getFilePath,
  getFileExtension,
  generateUniqueFilename,
  isValidFileType,
  isValidFileSize,
  getLocationUploadDir,
  generateThumbnail,
};
