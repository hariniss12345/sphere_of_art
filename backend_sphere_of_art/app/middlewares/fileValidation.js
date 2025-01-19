import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import Portfolio from '../models/portfolio-model.js';
import Art from '../models/art-model.js';

// Middleware function for validating uploaded files
const fileValidation = async (req, res, next) => {
  try {
    // Check if files were uploaded; if not, return a 400 error
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'no file uploaded' });
    }

    // Define allowed file extensions
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    
    // Loop through each uploaded file and validate
    for (const file of req.files) {
      // Get the file extension and convert to lowercase
      const fileExtension = path.extname(file.originalname).toLowerCase();

      // If the file type is not in the allowed list, return a 400 error
      if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({
          error: `Invalid file type for ${file.originalname}. Allowed types are jpg, jpeg, png, gif.`,
        });
      }

      // Create a SHA-256 hash to check for duplicate content
      const hash = crypto.createHash('sha256');
      const fileStream = fs.createReadStream(file.path);

      // Stream the file to generate the hash asynchronously
      await new Promise((resolve, reject) => {
        fileStream.on('data', (data) => hash.update(data)); // Update hash with file data
        fileStream.on('end', resolve); // Resolve promise when stream ends
        fileStream.on('error', reject); // Reject promise if an error occurs during streaming
      });

      // Finalize the hash and get the hex value
      const fileHash = hash.digest('hex');

      // Check if a file with the same hash already exists in Portfolio or Art models
      const [existingPortfolioFile, existingArtFile] = await Promise.all([
        Portfolio.findOne({ fileHash }), // Check if file exists in Portfolio
        Art.findOne({ 'image.fileHash': fileHash }), // Check if file exists in Art
      ]);

      // If a duplicate is found, return a 400 error
      if (existingPortfolioFile || existingArtFile) {
        return res.status(400).json({
          error: `Duplicate file detected: ${file.originalname} already exists.`,
        });
      }

      // Attach the generated hash to the file object for later use (saving to DB, etc.)
      file.fileHash = fileHash;
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If an error occurs during the process, return a 500 error
    res.status(500).json({ error: error.message });
  }
};

export default fileValidation;
