import mongoose from "mongoose";

const checkinSchema = new mongoose.Schema({
    checkinId: {
        type: Number,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    checkinStatus: {
        type: String,
        enum: ["started", "inprogress", "complete"],
        default: "started"
    }
},
{timestamps : true}
);

export default mongoose.model("Checkin", checkinSchema);