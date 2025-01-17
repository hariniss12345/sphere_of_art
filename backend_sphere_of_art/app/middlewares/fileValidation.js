import crypto from 'crypto'; // For hashing the file contents
import fs from 'fs';
import path from 'path';
import Portfolio from '../models/portfolio-model.js';

// Custom file validation middleware
const fileValidation = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required.' });
  }

  // Check the file extension (allow only specific image formats)
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const fileExtension = path.extname(req.file.originalname).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({ error: 'Invalid file type. Allowed types are jpg, jpeg, png, gif.' });
  }

  // Generate file hash to check if the content is the same as an existing file
  const hash = crypto.createHash('sha256');
  const fileStream = fs.createReadStream(req.file.path);
  fileStream.on('data', (data) => {
    hash.update(data);
  });

  fileStream.on('end', async () => {
    const fileHash = hash.digest('hex');

    // Check if any file with the same hash already exists in the database
    const existingFile = await Portfolio.findOne({ fileHash });
    if (existingFile) {
      return res.status(400).json({ error: 'File already exists in the portfolio collection.' });
    }

    // Add the fileHash to the request object for later use
    req.fileHash = fileHash;

    // Continue to the next middleware or route handler
    next();
  });
};

export default fileValidation;





