import mongoose from "mongoose";

const screenStateSchema = new mongoose.Schema({
    screenId: {
        type: String,
        default: ''
    },
    avatarViewed: {
        type: Boolean,
        default: false
    },
},
{timestamps : true}
);

export default mongoose.model("ScreenState", screenStateSchema);