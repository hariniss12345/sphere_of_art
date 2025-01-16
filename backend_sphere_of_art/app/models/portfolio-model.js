//Importing the Schema and model functions from the mongoose library
import { Schema, model } from 'mongoose';

// Define the Portfolio schema to represent portfolio items in the database
const PortfolioSchema = new Schema({
    // Title of the portfolio item or artwork
    title: String, 

    // Path to the uploaded file, stored as a string (e.g., file location on the server)
    filePath: String,

    // Reference to the Artist model, linking this portfolio item to an artist
    artistId: { 
        type: Schema.Types.ObjectId, // This field stores an ObjectId (MongoDB unique identifier)
        ref: 'Artist' // Specifies the referenced collection/model as 'Artist'
    },
}, { timestamps: true })

// Create a Portfolio model using the defined schema
const Portfolio = model('Portfolio', PortfolioSchema);

// Export the Portfolio model as the default export to make it available in other modules
export default Portfolio