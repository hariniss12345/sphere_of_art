import Order from '../models/order-model.js'
import Art from '../models/art-model.js'

const orderCltr = {}

orderCltr.create = async ( req,res ) => {
    try {
        // Extract the title, styles, and order-specific details from the request body
        const { title, styles, artist, customRequest } = req.body;
    
        // Get the customerId from the authenticated user (assuming 'currentUser' is set during authentication)
        const customer = req.currentUser.userId;
    
        // Prepare the list of image details for the artwork
        const images = req.files.map(file => ({
          path: file.path,        // Store the path to the uploaded file
          fileHash: file.hash,    // Store the file hash (adjust this to match your file upload handling)
        }));
    
        // 1. Create and save the artwork
        const art = new Art({
          title,
          styles,
          image: images,          // Store the array of image objects
          customer,
        });
    
        const savedArt = await art.save();
    
        // 2. Create the order associated with the created artwork
        const order = new Order({
          customer,
          artist,              // The artist selected by the customer
          arts: savedArt._id,   // Link the artwork to the order
          customRequest,         // Any custom request from the customer
          status: 'pending',     // Default order status
        });
    
        // Save the order
        const savedOrder = await order.save();
    
        // 3. Respond with the success message, including the created artwork and order
        res.status(201).json({
          message: 'Artwork and Order created successfully',
          artwork: savedArt,
          order: savedOrder,
        });
      } catch (error) {
        // Handle any errors during the process by responding with a 500 error and the error message
        console.error(error);
        res.status(500).json({ message: error.message });
      }
}


export default orderCltr



