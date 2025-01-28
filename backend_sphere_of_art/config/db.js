// Import the Mongoose library for MongoDB object modeling and connection management
import mongoose from 'mongoose';

/*
  Asynchronous function to configure and establish a connection to the MongoDB database.
*/

const configureDB = async () => {
    try {
        // Connect to the MongoDB database using the URL specified in the environment variables
        const db = await mongoose.connect(process.env.DB_URL);

        // Log a success message if the connection is established
        console.log('Connected to the database');
    } catch (err) {
        // Log an error message if the connection attempt fails
        console.log('err',err.message);
    }
};

// Export the configureDB function for use in other parts of the application
export default configureDB;
