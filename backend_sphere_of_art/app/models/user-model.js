// Import the Schema and model functions from Mongoose
import { Schema, model } from 'mongoose';

/*
 * Define the schema for the User collection in the database.
 
 * The schema outlines the structure and rules for User documents.
 */

const userSchema = new Schema(
    {
        username: String,
        email: String,
        password: String,
        phoneNumber: String,
        role: {
            type: String,
            enum: ['admin', 'artist', 'customer'],
        },
    },
    { timestamps: true }
)

// Create a Mongoose model for the User schema
// This will allow interaction with the 'User' collection in the database
const User = model('User', userSchema);

// Export the User model for use in other parts of the application
export default User;
