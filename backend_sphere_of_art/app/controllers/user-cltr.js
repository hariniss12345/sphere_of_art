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

// The login method handles user authentication and login
userCltr.login = async (req, res) => {
    // Check if there are any validation errors from express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // If errors are present, return a 400 response with the error details
        return res.status(400).json({ errors: errors.array() })
    }

    // Get the request body containing login details
    const body = req.body;

    try {
        // Find the user in the database based on the provided email
        const user = await User.findOne({ email: body.email })

        // If no user is found with the given email, return a 404 response
        if (!user) {
            return res.status(404).json({ errors: 'invalid email' })
        }

        // Compare the provided password with the hashed password stored in the database
        const isValidUser = await bcryptjs.compare(body.password, user.password)

        // If the password is incorrect, return a 404 response
        if (!isValidUser) {
            return res.status(404).json({ errors: 'invalid email/ password' })
        }

        // If user is valid, generate a JWT token with the user's ID and role, set to expire in 7 days
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })

        // Return the token in the response, prefixed with 'Bearer ' to follow standard authorization practices
        res.json({ token: `Bearer ${token}` })
    } catch (err) {
        // Log any errors that occur
        console.log(err)

        // Return a 500 response if something goes wrong on the server
        res.status(500).json({ errors: 'Something went wrong' })
    }
}


// Export the controller for use in routes
export default userCltr

