import { Schema, model} from 'mongoose'

const reviewSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  artistId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  }
}, { timestamps: true });

const Review = model('Review', reviewSchema)

export default Review
