import { Schema, model } from 'mongoose';

// Define the schema for the Artist model
const artistSchema = new Schema(
  {
    // Reference to the User model 
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    profilePic: {
      type: String, // URL or file path to the profile picture
      default: null, // Default empty string if no profile picture is set
    },

    // Short biography of the artist
    bio: {
      type:String, 
      default:"",
    },    
    // Array to store the artist's preferred styles 
    styles: {
      type: [String], // Array of strings
      default: [], // Defaults to an empty array if no styles are provided
    },

    // Placeholder for portfolio entries, will be linked to the Portfolio model later
    portfolio: [{ type: Schema.Types.ObjectId, ref: 'Portfolio' }],

    // Boolean flag to indicate if the artist is verified
    isVerified: {
      type: Boolean, 
      default: false, // Default value is false
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Create the Artist model based on the schema
const Artist = model('Artist', artistSchema);

// Export the model for use in other parts of the application
export default Artist;
