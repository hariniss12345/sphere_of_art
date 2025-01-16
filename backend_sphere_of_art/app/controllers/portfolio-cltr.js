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


portfolioCltr.update = async (req, res) => {
    const { id } = req.params; // Extract portfolio ID from request parameters
    const { title } = req.body; // Extract updated title from request body
  
    try {
      // Prepare the fields to update
      const updateData = {};
  
      if (title) updateData.title = title; // Update the title if provided
      if (req.file) updateData.filePath = req.file.path; // Update file path if new file is uploaded
  
      // Update the portfolio using findOneAndUpdate
      const updatedPortfolio = await Portfolio.findOneAndUpdate(
        { _id: id }, // Search by portfolio ID
        updateData,   // Fields to update (title, filePath)
        { new: true } // Return the updated document
      );
  
      if (!updatedPortfolio) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }
  
      // Log the updated portfolio for debugging
      console.log('Updated Portfolio:', updatedPortfolio);
  
      // Retrieve the artist who owns the portfolio
      const artist = await Artist.findOne({ user: updatedPortfolio.artistId });
  
      if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
      }
  
      // Log the artist's portfolio for debugging
      console.log('Artist Portfolio Array:', artist.portfolio);
  
      // Optionally, update the artist's portfolio array (if necessary)
      // For example, if you want to ensure the portfolio ID is correctly updated in the artist's portfolio array
      const portfolioIndex = artist.portfolio.indexOf(updatedPortfolio._id);
      if (portfolioIndex === -1) {
        artist.portfolio.push(updatedPortfolio._id); // Push new portfolio if not found
      }
  
      // Save the artist model with the updated portfolio reference (if needed)
      await artist.save();
  
      // Return a success response with the updated portfolio and artist info
      res.status(200).json({
        message: 'Portfolio and artist updated successfully',
        portfolio: updatedPortfolio,
        artist,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating portfolio or artist' });
    }
  };
  
  

// Exporting the portfolioCltr object which contains the upload function to be used in routes
export default portfolioCltr;
