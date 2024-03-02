import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
    },
    roomType: {
      type: String,
    },
    roomStatus: {
      type: String,
      enum: ["Checked", "Un-Checked"],
    },
    roomPrice: {
      type: Number,
    },
    feature1: {
      type: String,
      enum: ["Smoking", "Non-Smoking"],
      deafult: "Non-Smoking",
    },
    feature2: {
      type: String,
      enum: ["Near To Elevator", "Away From Elevator"],
      default: "Near To Elevator",
    },
    feature3: {
      type: String,
      enum: ["King Bed", "Twin Bed"],
      deafult: "King Bed",
    },
    alloted: {
      type: Boolean,
      default: false,
    },
    capacity: {
      type: Number,
      deafult: 0,
    },
  },
  { timestamps: true }
)

export default mongoose.model("Room", roomSchema);