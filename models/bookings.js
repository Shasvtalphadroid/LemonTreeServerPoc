import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    roomType: {
      type: String,
    },
    roomTypeFullName: {
      type: String,
    },
    roomPack: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    roomNumber: {
      type: String,
    },
    bookingType: {
      type: String,
    },
    adults: {
      type: Number,
    },
    adultsCheckedIn: {
      type: Number,
      default: 0,
    },
    children: {
      type: Number,
    },
    childrenCheckedIn: {
      type: Number,
      default: 0,
    },

    checkInDate: {
      type: Date,
    },
    checkOutDate: {
      type: Date,
    },
    checkInTime: {
      type: String,
    },
    checkOutTime: {
      type: String,
    },
    checkInDueAmount: {
      type: Number,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    checkInStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    checkOutStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

bookingSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model("Bookings", bookingSchema)
