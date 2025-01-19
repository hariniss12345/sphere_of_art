// Importing the Art model to interact with the art collection in the database
import Art from '../models/art-model.js';

// Import validationResult to handle request validation errors
import { validationResult } from 'express-validator' 

const artCltr = {};

// Upload function for creating an artwork entry in the database
artCltr.upload = async (req, res) => {
  try {
    // Extract the title and styles of the artwork from the request body
    const { title, styles } = req.body;

    // Get the customerId from the authenticated user (assuming 'currentUser' is set during authentication)
    const customerId = req.currentUser.userId;

    // Prepare the list of image details for the artwork
    // Map over the uploaded files to include both the file path and the generated file hash
    const images = req.files.map(file => ({
      path: file.path, // Store the path to the uploaded file
      fileHash: file.fileHash, // Store the file hash to avoid duplicates later
    }));

    // Create a new artwork entry in the database with the extracted data
    const art = await Art.create({ title, styles, image: images, customerId });

    // Respond with a success message and the created artwork data
    res.status(201).json({
      message: 'Artwork created successfully',
      data: art,
    });
  } catch (error) {
    // Handle any errors during the process by responding with a 500 error and the error message
    res.status(500).json({ message: error.message });
  }
};

// List function to retrieve all art documents from the database
artCltr.list = async (req, res) => {
    try {
        // Fetch all art from the database
        const arts = await Art.find();
    
        // If no art are found, return an appropriate message
        if (arts.length === 0) {
          return res.status(404).json({ message: 'No arts found' });
        }
    
        // Return the list of arts
        res.status(200).json({
          message: 'Arts retrieved successfully',
          arts,
        });
      } catch (error) {
        // Log error and respond with an error message
        console.error(error);
        res.status(500).json({ error: 'Error retrieving arts' });
      }
}

// Show function to retrieve a specific art by ID
artCltr.show = async (req, res) => {
  // Check if there are validation errors from express-validator
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      // If errors are present, return a 400 response with the error details
      return res.status(400).json({errors: errors.array()})
  }
  const { id } = req.params; // Extract the art ID from the request parameters

  try {
    // Find the art by its ID
    const art = await Art.findById(id);

    // If no portfolio is found, return an error response
    if (!art) {
      return res.status(404).json({ message: 'Art not found' });
    }

    // Return the art details
    res.status(200).json({
      message: 'Single art retrieved successfully',
      art,
    });
  } catch (error) {
    // Log error and respond with an error message
    console.error(error);
    res.status(500).json({ error: 'Error retrieving art' });
  }
}

// Delete function to remove an art document from the database by ID
artCltr.delete = async (req, res) => {
  try {
    const { artId } = req.params; // Get the artwork ID from the request params
  
    // Find and delete the artwork by its ID
    const deletedArt = await Art.findByIdAndDelete(artId);

    // If no artwork is found, return a 404 response
    if (!deletedArt) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Respond with a success message and the deleted art data
    res.status(200).json({
      message: 'Artwork deleted successfully',
      data: deletedArt,
    });
  } catch (error) {
    // Handle any errors during the process by responding with a 500 error and the error message
    res.status(500).json({ message: error.message });
  }
}

export default artCltr;
