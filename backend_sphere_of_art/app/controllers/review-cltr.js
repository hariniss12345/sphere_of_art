import Review from '../models/review-model.js'

const reviewCltr = {}

reviewCltr.create = async(req,res) => {
    try {
        const { orderId, customerId, artistId, rating, comment} = req.body;
    
        const review = new Review({
          orderId,
          customerId,
          artistId,
          rating,
          comment,
         
        });
    
        await review.save();
        res.status(201).json({ message: 'Review created successfully', review });
      } catch (error) {
        res.status(500).json({ message: 'Failed to create review', error: error.message });
      }
}

// GET reviews for a specific artist given by the customer
reviewCltr.customerReviews = async (req, res) => {
  const {customerId} = req.params;
  try {
    // Find all reviews that match the given customer and artist IDs
    const reviews = await Review.find({customerId})
    .sort({ createdAt: -1 })
    .populate('artistId', 'username email'); 

    console.log(reviews)

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching reviews',
    });
  }
};

reviewCltr.artistReviews = async (req, res) => {
  const {artistId} = req.params;
  try {
    // Find all reviews that match the given customer and artist IDs
    const reviews = await Review.find({artistId})
    .sort({ createdAt: -1 })
    .populate('customerId', 'username email'); 

    console.log(reviews)

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching reviews',
    });
  }
};

reviewCltr.update = async(req,res) => {
    try {
        const reviewId = req.params.id;
        const updates = req.body;
    
        const updatedReview = await Review.findByIdAndUpdate(reviewId, updates, { new: true })
        .populate('artistId', 'username email');

        if (!updatedReview) {
          return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
      } catch (error) {
        res.status(500).json({ message: 'Failed to update review', error: error.message });
      }
}

reviewCltr.delete = async(req,res) => {
    try {
    const reviewId = req.params.id;
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
}

export default reviewCltr