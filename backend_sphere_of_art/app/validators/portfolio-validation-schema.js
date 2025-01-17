const portfolioValidationSchema = {
    title: {
      exists: {
        errorMessage: 'Title field is required',  // This will trigger if the title is not present
      },
      notEmpty: {
        errorMessage: 'Title should not be empty',  // This will trigger if the title is an empty string
      },
      isString: {
        errorMessage: 'Title must be a string',
      },
      isLength: {
        options: { min: 3, max: 100 },
        errorMessage: 'Title must be between 3 and 100 characters long.',
      },
    },
    trim: true,  // Trims leading and trailing spaces from the title field
  };
  
  export default portfolioValidationSchema;
  