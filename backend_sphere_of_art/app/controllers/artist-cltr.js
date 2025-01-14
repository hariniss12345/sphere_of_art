// Importing the Artist model
import Artist from '../models/artist-model.js'  
// Importing validationResult to check request validation
import { validationResult } from 'express-validator' 
// Importing lodash for object manipulation (in this case, for picking specific fields from the body)
import _ from 'lodash'  

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


// Exporting the artist controller to be used in other parts of the application
export default artistCltr 