import mongoose from "mongoose"

const FeedbackSchema = new mongoose.Schema({
  id: {
    type: Number,
    autoIncrement: true,
  },
  bookingId: {
    type: String,
  },
  name: {
    type: String,
    require: true,
  },
  feedback: {
    type: Array,
  },
  feedback_type: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

FeedbackSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model("Feedback", FeedbackSchema)
