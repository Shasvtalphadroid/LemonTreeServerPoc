import mongoose, { Schema } from "mongoose";

const UserDataSchema = new mongoose.Schema({
    primaryBookerFirstName:{
        type:String,
    },
    primaryBookerLastName:{
        type:String,
    },
    primaryBookerContactNumber:{
        type:String,
    },
    guestList:[{
        _id: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId },
        idUploaded: {type: Boolean, default: false},
        inProgress: {type: Boolean, default: false},
        firstName: {type: String, default:null},
        lastName: {type: String, default:null},
        name:{type: String, default:null},
        idType: {type: String, default:null},
        idImage: {type: String, default:null},
        dob: {type: String, default:null},
        nationality: {type: String, default:null},
        guestPicture: {type: String, default:null},
        address: {type: String, default:null},
        dateOfIssue: {type: String, default:null},
        dateOfExpiry: {type: String, default:null},
    }]
},
{timestamps : true}
);

export default mongoose.model("ID", UserDataSchema);