import { Schema, model } from 'mongoose'; // Import Schema and model from mongoose

// Define the schema for the 'Art' model
const artSchema = new Schema(
  {
    title: String, // The title of the artwork
    style: String, // The style or category of the artwork 
    image: String, // The image URL or file path for the artwork
    customerId: {
      type: Schema.Types.ObjectId, // Refers to the ObjectId of a Customer
      ref: 'User', // Specifies that this field references the 'User' model
    },
  },
  { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt' timestamps
);

// Create the 'Art' model using the defined schema
const Art = model('Art', artSchema);

export default Art; // Export the model to use it in other parts of the application
