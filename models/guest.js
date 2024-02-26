import mongoose from "mongoose"
const guestSchema = new mongoose.Schema({
  id: {
    type: String,
    autoIncrement: true,
  },
  idUploaded: {
    type: Boolean,
  },
  inProgress: {
    type: Boolean,
  },
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value)
      },
      message: "Invalid email format",
    },
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  idType: {
    type: String,
  },
  idImage_front: {
    type: String,
  },
  idImage_back: {
    type: String,
  },
  dob: {
    type: String,
  },
  nationality: {
    type: String,
  },
  guestPicture: {
    type: String,
  },
  address: {
    type: String,
  },
  dateOfIssue: {
    type: Date,
  },
  dateOfExpiry: {
    type: Date,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})
guestSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})
export default mongoose.model("Guest", guestSchema)
