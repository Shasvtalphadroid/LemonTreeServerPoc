import mongoose from "mongoose";

const VoterIdSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    dob:{
        type:String,
    },
    gender:{
        type:String,
    },
    address:{
        type:String,
    },
    photo:{
        type:String,
        default:'https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg'
    },

},
{timestamps : true}
);

export default mongoose.model("voterId", VoterIdSchema);