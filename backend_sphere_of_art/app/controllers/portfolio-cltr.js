// Importing the Portfolio model to interact with the portfolio collection in the database
import Portfolio from '../models/portfolio-model.js';  // Assuming Portfolio is your model for portfolio images

// Importing the Artist model to reference the artist associated with the portfolio
import Artist from '../models/artist-model.js';  // Assuming Artist model to reference the portfolio

// Import validationResult to handle request validation errors
import { validationResult } from 'express-validator' 

// Initialize an empty object to hold the controller functions
const portfolioCltr = {}

// Upload function to handle file upload and save portfolio entry
portfolioCltr.upload = async (req, res) => {
  // Check if a file is uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'no file uploaded' });
  }

  // Extract the title from the request body and file path
  const { title } = req.body;
  const filePath = req.file.path;
  const artistId = req.currentUser.userId; // Assuming this is set during authentication

  try {
    // Create a new portfolio entry with the file path and artist ID
    const newPortfolio = new Portfolio({
      title,
      filePath,
      artistId,
      fileHash : req.fileHash
      
    });

    // Save the portfolio entry to the database
    await newPortfolio.save();

    // Find the artist by userId
    const artist = await Artist.findOne({ user: artistId });
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Add the portfolio reference to the artist's portfolio array
    artist.portfolio.push(newPortfolio._id);
    await artist.save();

    // Return a success response with the portfolio data
    res.status(200).json({
      message: 'Portfolio image uploaded successfully',
      portfolio: newPortfolio,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading portfolio image' });
  }
};


portfolioCltr.show = async (req, res) => {
  // Check if there are validation errors from express-validator
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      // If errors are present, return a 400 response with the error details
      return res.status(400).json({errors: errors.array()})
  }
  const { id } = req.params; // Extract the portfolio ID from the request parameters

  try {
    // Find the portfolio by its ID
    const portfolio = await Portfolio.findById(id);

    // If no portfolio is found, return an error response
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Return the portfolio details
    res.status(200).json({
      message: ' Single portfolio retrieved successfully',
      portfolio,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving portfolio' });
  }
};

portfolioCltr.list = async (req, res) => {
  try {
    // Fetch all portfolios from the database
    const portfolios = await Portfolio.find();

    // If no portfolios are found, return an appropriate message
    if (portfolios.length === 0) {
      return res.status(404).json({ message: 'No portfolios found' });
    }

    // Return the list of portfolios
    res.status(200).json({
      message: 'Portfolios retrieved successfully',
      portfolios,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving portfolios' });
  }
};

portfolioCltr.update = async (req, res) => {
     // Check if there are validation errors from express-validator
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      // If errors are present, return a 400 response with the error details
      return res.status(400).json({errors: errors.array()})
    }

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
  

  portfolioCltr.delete = async (req, res) => {
    // Check if there are validation errors from express-validator
    const errors = validationResult(req)
    if(!errors.isEmpty()){
       // If errors are present, return a 400 response with the error details
       return res.status(400).json({errors: errors.array()})
    }

    const { id } = req.params; // Extract the portfolio ID from the request parameters
  
    try {
      // Find the portfolio to be deleted
      const portfolio = await Portfolio.findById(id);
  
      // If no portfolio is found, return an error response
      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }
  
      // Retrieve the artist associated with the portfolio
      const artist = await Artist.findOne({ user: portfolio.artistId });
  
      // If no artist is found, return an error response
      if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
      }
  
      // Remove the portfolio reference from the artist's portfolio array
      artist.portfolio = artist.portfolio.filter(
        (portfolioId) => portfolioId.toString() !== id
      );
  
      // Save the updated artist document
      await artist.save();
  
      // Delete the portfolio entry from the database
      await Portfolio.findOneAndDelete(id);
  
      // Return a success response
      res.status(200).json({
        message: 'Portfolio deleted successfully',
        portfolio
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting portfolio' });
    }
  };
  
  

// Exporting the portfolioCltr object which contains the upload function to be used in routes
export default portfolioCltr;
