import mongoose from "mongoose"

const CheckoutDueSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    bookingIdRef: {
      type: String,
    },
    roomNumber: {
      type: String,
    },
    bookingType: {
      type: String,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    roomRent: {
      type: Number,
    },
    foodBeverages: {
      type: Number,
    },
    spa: {
      type: Number,
    },
    roomRentDue: {
      type: Number,
    },
    foodBeveragesDue: {
      type: Number,
    },
    spaDue: {
      type: Number,
    },
    totalDue: {
      type: Number,
    },
    isTaBooking: {
      type: Boolean,
      default: false,
    },
    checkOutStatus: {
      type: String,
      enum: ["Pending", "checked-out"],
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

CheckoutDueSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model("CheckoutDue", CheckoutDueSchema)
