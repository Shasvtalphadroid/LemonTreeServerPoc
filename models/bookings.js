import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    roomType: {
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
    children: {
      type: Number,
    },
    checkInDate: {
      type: String,
    },
    checkOutDate: {
      type: String,
    },
    checkInTime: {
      type: String,
    },
    checkOutTime: {
      type: String,
    },
    // amountPaid:{
    //     type:Number,
    //     default:0
    // }
  },
  { timestamps: true }
)

export default mongoose.model("Bookings", bookingSchema);