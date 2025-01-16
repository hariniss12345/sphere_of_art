import multer from 'multer'
import path from 'path'

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Specify the directory where files will be uploaded
  },
  filename: (req, file, cb) => {
    // Set the filename to the current timestamp + the original file extension
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Set up file filter to allow only specific file types (e.g., images)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/; // Allowed image types
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());  // Check file extension
  const mimetype = filetypes.test(file.mimetype);  // Check MIME type

  if (extname && mimetype) {
    return cb(null, true);  // Accept the file
  } else {
    cb('Error: Only images are allowed');  // Reject the file
  }
};

// Set up multer configuration
const upload = multer({
  storage,
  fileFilter,
});

export default upload