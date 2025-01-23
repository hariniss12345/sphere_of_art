const loginValidation = (req, res, next) => {
    const { usernameOrEmail, password } = req.body;
  
    // Ensure usernameOrEmail is provided
    if (!usernameOrEmail || usernameOrEmail.trim().length === 0) {
      return res.status(400).json({
        errors: ["The username or email field is required"],
      });
    }
  
    // Ensure password is provided
    if (!password || password.trim().length === 0) {
      return res.status(400).json({
        errors: ["The password field is required"],
      });
    }
  
    next(); // Proceed to the next middleware
  };
  
  export default loginValidation;