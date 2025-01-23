// Import necessary modules
// Import the User model to interact with the database
import User from '../models/user-model.js' 
// Import validationResult to handle request validation errors
import { validationResult } from 'express-validator' 
// Import the bcryptjs library for hashing and comparing passwords
import bcryptjs from 'bcryptjs';
// Import the jsonwebtoken library to handle the creation and verification of JSON Web Tokens (JWT)
import jwt from 'jsonwebtoken';



// Create an empty object to store the controller methods
const userCltr = {}

// Register method to handle user registration
userCltr.register = async (req, res) => {
    // Check if there are validation errors from express-validator
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        // If errors are present, return a 400 response with the error details
        return res.status(400).json({errors: errors.array()})
    }

    // Get the request body
    const body = req.body
    // Create a new User instance with the provided data
    const user = new User(body)
    
    try {
        // Generate a salt for hashing the password
        const salt = await bcryptjs.genSalt()
        // Hash the password using the generated salt
        const hashPassword = await bcryptjs.hash(body.password, salt)
        // Replace the plain password with the hashed password
        user.password = hashPassword

        // Count the number of users in the database
        const userCount = await User.countDocuments()
        // If this is the first user, assign them the 'admin' role
        if(userCount == 0){
            user.role = 'admin'
        }

        // Save the user to the database
        await user.save()
        // Return a 201 response with the created user
        res.status(201).json(user)
    } catch (err) {
        // Log any errors that occur
        console.log(err.message)
        // Return a 500 response if something goes wrong on the server
        res.status(500).json({error: 'Something went wrong'})
    }
}

// The login method handles user authentication based on email and password
userCltr.login = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //get the request body
    const { usernameOrEmail, password } = req.body;

    try {
        // Try to find the user by username or email
        const user = await User.findOne({$or: [{username:usernameOrEmail},{email:usernameOrEmail}],})

        // If no user is found, return an error
        if (!user) {
            return res.status(400).json({ errors: 'Invalid username/email or password' });
        }

        // Compare the password with the stored hashed password
        const isValidUser = await bcryptjs.compare(password, user.password);

        // If password is invalid, return an error
        if (!isValidUser) {
            return res.status(400).json({ errors: 'Invalid username/email or password' });
        }

        // Generate a JWT token if login is successful
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Send the token to the client
        return res.json({ token: `Bearer ${token}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: 'Something went wrong' });
    }
}

// The profile method handles the retrieval of the current user's profile information
userCltr.profile = async (req, res) => {
    try {
        // Retrieve the user's information from the database using the userId from the JWT token (stored in req.currentUser)
        const user = await User.findById(req.currentUser.userId);

        // Respond with the user data in JSON format
        res.json(user);
    } catch (err) {
        // Log any errors that occur during the process
        console.log(err);

        // Return a 500 response indicating a server-side error
        res.status(500).json({ errors: 'something went wrong' });
    }
};

// Export the controller for use in routes
export default userCltr

