// Define the validation schema for the 'Art' model
const artValidationSchema = { 
    title: {
      exists: {
        errorMessage: 'title is required', // Error message when the title field is missing
      },
      isEmpty: {
        errorMessage: 'title should not be empty', // Error message when the title is empty
      },
      isLength: {
        options: { min: 3, max: 50 }, // Ensures the title has a length between 3 and 50 characters
        errorMessage: 'the title length should be at least 3 to 20 characters long', // Error message for invalid length
      },
      trim: true, // Removes leading and trailing whitespace from the title
    },
    style: {
      exists: {
        errorMessage: 'style is required', // Error message when the style field is missing
      },
      isEmpty: {
        errorMessage: 'style should not be empty', // Error message when the style is empty
      },
      trim: true, // Removes leading and trailing whitespace from the style
    },
    image: {
      exists: {
        errorMessage: 'image is required', // Error message when the image field is missing
      },
      isEmpty: {
        errorMessage: 'image should not be empty', // Error message when the image is empty
      },
      trim: true, // Removes leading and trailing whitespace from the image
    },
  };
  
  export default artValidationSchema; // Export the validation schema for use in other parts of the application
  