// Importing the Artist model to check for existing artist data
import Artist from '../models/artist-model.js';

// Defining the validation schema for artist data
const artistValidationSchema = {
  // Validation for userId field
  userId: {
    in: ['body'], // Indicates the field should be in the request body
    isMongoId: {
      errorMessage: 'Invalid user ID format. It should be a valid MongoDB ObjectId.', // Custom error message for invalid ObjectId
    },
    notEmpty: {
      errorMessage: 'User ID is required.', // Custom error message when userId is missing
    },
    custom: {
      // Custom validation to check if the artist already exists
      options: async (value) => {
        try {
          const existingArtist = await Artist.findOne({ userId: value });
          if (existingArtist) {
            throw new Error('An artist with this user ID already exists.');
          }
          return true;
        } catch (err) {
          throw new Error('Error checking artist uniqueness.'); // Handle errors that occur during the uniqueness check
        }
      },
    },
  },

  // Validation for bio field
  bio: {
    in: ['body'], // Indicates the field should be in the request body
    isString: {
      errorMessage: 'Bio must be a string.', // Custom error message for invalid bio type
    },
    isLength: {
      options: { max: 500 }, // Maximum length for bio
      errorMessage: 'Bio must not exceed 500 characters.', // Custom error message for bio length
    },
    trim: true, // Automatically trims whitespace from the bio
  },

  // Validation for styles field
  styles: {
    in: ['body'], // Indicates the field should be in the request body
    isArray: {
      errorMessage: 'Styles must be an array.', // Custom error message when styles is not an array
    },
    custom: {
      // Custom validation to ensure all styles are strings
      options: (value) => {
        if (!value.every((style) => typeof style === 'string')) {
          throw new Error('All styles must be strings.');
        }
        return true;
      },
    },
  },

  // Validation for isVerified field
  isVerified: {
    in: ['body'], // Indicates the field should be in the request body
    isBoolean: {
      errorMessage: 'isVerified must be a boolean.', // Custom error message for invalid boolean type
    },
  },
};

// Export the validation schema to be used elsewhere in the application
export default artistValidationSchema;
