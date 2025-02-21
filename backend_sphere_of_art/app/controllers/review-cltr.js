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


reviewCltr.update = async(req,res) => {
    try {
        const reviewId = req.params.id;
        const updates = req.body;
    
        const updatedReview = await Review.findByIdAndUpdate(reviewId, updates, { new: true });
        if (!updatedReview) {
          return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
      } catch (error) {
        res.status(500).json({ message: 'Failed to update review', error: error.message });
      }
}

reviewCltr.list = async(req,res) => {
    try {
        const reviews = await Review.find().populate('orderId customerId artistId');
        res.status(200).json({ reviews });
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
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