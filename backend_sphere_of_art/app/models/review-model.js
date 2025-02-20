import { Schema, model} from 'mongoose'

const reviewSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
  },
  artistId: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
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
