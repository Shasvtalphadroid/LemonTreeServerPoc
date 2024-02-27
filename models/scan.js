import mongoose from "mongoose";

const ScanDataSchema = new mongoose.Schema({
    data:{
        type: JSON,
        require:true,
        default: {}
    }
},
{timestamps : true}
);

export default mongoose.model("ScanData", ScanDataSchema);