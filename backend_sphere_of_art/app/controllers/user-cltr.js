// Import necessary modules
// Import the User model to interact with the database
import User from '../models/user-model.js'

// Import the Customer model to interact with the database
import Customer from '../models/customer-model.js'

// Import the Artist model to interact with the database
import Artist from '../models/artist-model.js'

// Import validationResult to handle request validation errors
import { validationResult } from 'express-validator' 

// Import the bcryptjs library for hashing and comparing passwords
import bcryptjs from 'bcryptjs';

// Import the jsonwebtoken library to handle the creation and verification of JSON Web Tokens (JWT)
import jwt from 'jsonwebtoken';

// Utility function to send an email
import sendEmail from '../../utils/mailer.js'



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

// // The profile method handles the retrieval of the current user's profile information
// userCltr.profile = async (req, res) => {
//     try {
//         // Retrieve the user's information from the database using the userId from the JWT token (stored in req.currentUser)
//         const user = await User.findById(req.currentUser.userId);

//         // Respond with the user data in JSON format
//         res.json(user);
//     } catch (err) {
//         // Log any errors that occur during the process
//         console.log(err);

//         // Return a 500 response indicating a server-side error
//         res.status(500).json({ errors: 'something went wrong' });
//     }
// };

userCltr.profile = async (req, res) => {
    try {
        // Retrieve the user's basic information
        const user = await User.findById(req.currentUser.userId).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ errors: 'User not found' });
        }

        // Initialize profile with basic user details
        let profile = {
            username: user.username,
            email: user.email,
            role: user.role,
        };

        // Fetch extra details based on role
        if (user.role === 'artist') {
            // Populate portfolio with specific fields
            const artistDetails = await Artist.findOne({ user: user._id }).populate('portfolio', 'title filePath');
            if (artistDetails) {
                profile.details = {
                    bio: artistDetails.bio,
                    styles: artistDetails.styles,
                    portfolio: artistDetails.portfolio, // Now includes title and filePath
                };
            }
        } else if (user.role === 'customer') {
            const customerDetails = await Customer.findOne({ user: user._id });
            if (customerDetails) {
                profile.details = {
                    address: customerDetails.address,
                    contactNumber: customerDetails.contactNumber,
                };
            }
        }

        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: 'Something went wrong' });
    }
};




userCltr.forgotPassword = async ( req,res ) => {
    const { email } = req.body;

    try {
         // Step 1: Check if the user exists

        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: 'User with that email does not exist.' });
        }

        // Step 2: Create a JWT reset password token
        
        const resetToken = jwt.sign(
        { userId: user._id }, // Include user ID in the token payload
        process.env.JWT_SECRET, // Use your secret key
        { expiresIn: process.env.JWT_RESET_PASSWORD_EXPIRATION } // Token expiration time
        );

        // Step 3: Create reset password URL (you can customize the URL based on your frontend)
    
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
   
        // Step 4: Send email with the reset URL

        const subject = 'Password Reset Request';
        const text = `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;
        const html = `<p>You requested a password reset. Click the link below to reset your password:</p>
                 <a href="${resetUrl}">${resetUrl}</a>
                 <p>If you did not request this, please ignore this email.</p>`;

        await sendEmail(user.email, subject, text, html); // Send the email

        // Step 5: Respond to the client
        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: 'Something went wrong' });
 }   
}

// Export the controller for use in routes
export default userCltr

