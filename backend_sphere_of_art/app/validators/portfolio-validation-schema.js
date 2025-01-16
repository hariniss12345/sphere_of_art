// Importing the Portfolio model to interact with the portfolio collection in the database
import Portfolio from '../models/portfolio-model.js'

// Define a schema for validating portfolio data before it is saved
const portfolioValidationSchema = {
    // Validation for the title field
    title : {
        in : ['body'],  // Ensure the field is in the body of the request
        exists: {
            errorMessage: 'title field is required'  // Error message if the title field is missing
        },
        notEmpty: {
            errorMessage: 'title should not be empty'  // Error message if the title is empty
        },
        isString : {
            errorMessage : 'title must be string'  // Error message if the title is not a string
        },
        isLength: {
            options: { min: 3, max: 100 }, 
            errorMessage: 'Title must be between 3 and 100 characters long.',  // Error message for invalid title length
        },
        trim: true,  // Automatically trim spaces from the title
    },
    // Validation for the filePath field
    filePath : {
        in : ['body'],  // Ensure the field is in the body of the request
        exists: {
            errorMessage: 'file path field is required'  // Error message if the file path is missing
        },
        notEmpty: {
            errorMessage: 'file path should not be empty'  // Error message if the file path is empty
        },
        isString : {
            errorMessage : 'file path must be string'  // Error message if the file path is not a string
        },
        custom: {
            // Custom validation function to check if the file extension is valid
            options: (value) => {
              const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];  // Allowed image file extensions
              const fileExtension = value.slice(value.lastIndexOf('.')).toLowerCase();  // Extract the file extension from the file path
              if (!allowedExtensions.includes(fileExtension)) {
                // Throw an error if the file extension is not allowed
                throw new Error('File path must point to a valid image file (jpg, jpeg, png, gif).');
              }
              return true;  // Return true if the validation passes
            },
          },
        trim: true,  // Automatically trim spaces from the file path
    }
}

// Exporting the schema for use in other parts of the application
export default portfolioValidationSchema