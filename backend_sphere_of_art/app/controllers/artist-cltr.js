import Artist from '../models/artist-model.js'  // Importing the Artist model
import User from '../models/user-model.js'
import { validationResult } from 'express-validator'  // Importing validationResult to check request validation
import _ from 'lodash'  // Importing lodash for object manipulation (in this case, for picking specific fields from the body)

const artistCltr = {}

// Create method for the artist controller
artistCltr.create = async (req, res) => {
    // Check if there are any validation errors in the request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // If validation errors are found, return a 400 status with the error details
        return res.status(400).json({ errors: errors.array() })
    }
    
    // Pick the required fields from the request body using lodash (bio, styles, portfolio)
    const body = _.pick(req.body, ['bio', 'styles', 'portfolio'])
    
    try {
        // Create a new instance of the Artist model using the picked data
        const artist = new Artist(body)
        
        // Assign the user ID from the authenticated user (this assumes userId is present in req.currentUser)
        artist.user = req.currentUser.userId
        
        // Save the artist to the database
        await artist.save()
        
        // Send the created artist object as the response
        res.json(artist)
    } catch (err) {
        // If any error occurs during the save operation, log the error and send a generic error response
        console.log(err.message)
        res.status(500).json({ error: 'Something went wrong' })
    }
}

artistCltr.list = async (req, res) => {
    try {
        // Find all artists and populate user details (username, email, profilePic)
        const artists = await Artist.find()
            .populate({
                path: "user", // Reference field in Artist schema
                select: "username email", // Only get needed fields
            });

        res.json(artists);
    } catch (err) {
        console.error("Error retrieving artists:", err.message);
        res.status(500).json({ error: "Failed to retrieve artists. Please try again later." });
    }
};



// Define the show method in the artist controller to retrieve the current artist's information
artistCltr.show = async ( req,res ) => {
   
    try {
        // Fetch the artist record from the database using the userId from the JWT token (stored in req.currentUser)
        const artist = await Artist.findOne({ user: req.currentUser.userId });

        // If no artist record is found, return a 400 response indicating the record was not found
        if (!artist) {
            return res.status(400).json({ error: 'record not found' });
        }

        // Respond with the artist data in JSON format
        res.json(artist);
    } catch (err) {
        // Log any errors that occur during the process
        console.log(err.message);

        // Return a 500 response indicating a server-side error
        res.status(500).json({ error: 'Something went wrong' });
    }

}

// Define the update method in the artist controller to update the artist's information
artistCltr.update = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // If validation errors exist, return a 400 response with the error details
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id; // Extract artist ID from URL parameters
    const body = req.body; // Extract updated data from request body

    try {
        // Update the artist document by its ID
        const artist = await Artist.findOneAndUpdate(
            { _id: id }, // Query condition to find the document
            body,        // Data to update
            { new: true, runValidators: true } // Options: return updated document and validate
        );

        if (!artist) {
            // If no matching artist found, return an error
            return res.status(404).json({ error: 'record not found' });
        }

        // Return the updated artist document
        res.json(artist);
    } catch (err) {
        // Log and handle any errors during the update process
        console.error(err.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

// Define the delete method in the artist controller to delete the artist's information
artistCltr.delete = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If validation errors exist, return a 400 response with the error details
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id; // Extract artist ID from URL parameters

    try {
        // Delete the artist document by its ID
        const artist = await Artist.findOneAndDelete({ _id: id }); // Use the ID to find and delete

        if (!artist) {
            // If no matching artist found, return an error
            return res.status(404).json({ error: 'record not found' });
        }

        // Return the deleted artist document
        res.json({ message: 'Artist deleted successfully', artist });
    } catch (err) {
        // Log and handle any errors during the delete process
        console.error(err.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

export default artistCltr  // Exporting the artist controller to be used in other parts of the application
