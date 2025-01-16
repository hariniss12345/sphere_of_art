// Importing the Portfolio model to interact with the portfolio collection in the database
import Portfolio from '../models/portfolio-model.js';  // Assuming Portfolio is your model for portfolio images

// Importing the Artist model to reference the artist associated with the portfolio
import Artist from '../models/artist-model.js';  // Assuming Artist model to reference the portfolio

// Initialize an empty object to hold the controller functions
const portfolioCltr = {}

// Upload function to handle the portfolio image upload and save it to the database
portfolioCltr.upload = async (req, res) => {
  // Check if a file is uploaded, return error if no file is found
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Extract the title from the request body, which is submitted alongside the file
  const { title } = req.body;

  try {
    // Get the file path of the uploaded image, saved by multer
    const filePath = req.file.path;

    // Get the artist's userId from the authenticated request (assumed to be set during authentication)
    const artistId = req.currentUser.userId;

    // Create a new Portfolio entry with the extracted data (title, file path, and artist's ID)
    const newPortfolio = new Portfolio({
      title,  // Use the title provided in the request body
      filePath,
      artistId,
    });

    // Save the new portfolio entry to the database
    await newPortfolio.save();

    // Find the artist in the database based on the userId (artistId)
    const artist = await Artist.findOne({ user: artistId });

    // If no artist is found, return an error response
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Add the newly created portfolio reference (ID) to the artist's portfolio array
    artist.portfolio.push(newPortfolio._id);
    await artist.save();

    // Return a success response with the newly uploaded portfolio details
    res.status(200).json({
      message: 'Portfolio image uploaded successfully',
      portfolio: newPortfolio,
    });
  } catch (error) {
    // In case of an error, log it and send an error response
    console.error(error);
    res.status(500).json({ error: 'Error uploading portfolio image' });
  }
};

// Exporting the portfolioCltr object which contains the upload function to be used in routes
export default portfolioCltr;
