import Art from '../models/art-model.js';

const artCltr = {};

// Upload function for creating an artwork entry in the database
artCltr.upload = async (req, res) => {
  try {
    // Extract the title and styles of the artwork from the request body
    const { title, styles } = req.body;

    // Get the customerId from the authenticated user (assuming 'currentUser' is set during authentication)
    const customerId = req.currentUser.userId;

    // Prepare the list of image details for the artwork
    // Map over the uploaded files to include both the file path and the generated file hash
    const images = req.files.map(file => ({
      path: file.path, // Store the path to the uploaded file
      fileHash: file.fileHash, // Store the file hash to avoid duplicates later
    }));

    // Create a new artwork entry in the database with the extracted data
    const art = await Art.create({ title, styles, image: images, customerId });

    // Respond with a success message and the created artwork data
    res.status(201).json({
      message: 'Artwork created successfully',
      data: art,
    });
  } catch (error) {
    // Handle any errors during the process by responding with a 500 error and the error message
    res.status(500).json({ message: error.message });
  }
};

artCltr.list = async ( req,res ) => {
    try {
        // Fetch all art from the database
        const arts = await Art.find();
    
        // If no portfolios are found, return an appropriate message
        if (arts.length === 0) {
          return res.status(404).json({ message: 'No arts found' });
        }
    
        // Return the list of portfolios
        res.status(200).json({
          message: 'Arts retrieved successfully',
          arts,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving arts' });
      }
}

export default artCltr;
