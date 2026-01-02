const { v4: uuidv4 } = require('uuid');

/**
 * Generate UUID
 */
const generateUUID = () => {
  return uuidv4();
};

/**
 * Generate random password
 */
const generateRandomPassword = (length = 12) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Format date to MySQL format
 */
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace('T', ' ');
};

/**
 * Format MySQL date to ISO string
 */
const formatToISO = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

/**
 * Calculate date difference in days
 */
const dateDiffInDays = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Sanitize file name
 */
const sanitizeFileName = (fileName) => {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Build pagination object
 */
const buildPagination = (page = 1, limit = 10, total = 0) => {
  const currentPage = Math.max(1, parseInt(page));
  const itemsPerPage = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (currentPage - 1) * itemsPerPage;

  return {
    page: currentPage,
    limit: itemsPerPage,
    offset,
    total,
    totalPages: Math.ceil(total / itemsPerPage)
  };
};

/**
 * Remove undefined/null values from object
 */
const cleanObject = (obj) => {
  return Object.entries(obj)
    .filter(([_, v]) => v !== null && v !== undefined)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
};

module.exports = {
  generateUUID,
  generateRandomPassword,
  formatDate,
  formatToISO,
  dateDiffInDays,
  sanitizeFileName,
  buildPagination,
  cleanObject
};
