import ID from "../models/ID.js";


export const addId  = async (req,res) => {
    try{
        const newUserData = new ID(req.body);
        await newUserData.save();
        res.status(200).json(newUserData);
    }catch(error){
        console.error(error);
    }
}

export const fetchGuestList = async (req,res) => {
    // console.log(req.query);
    try{
        const list = await ID.findOne({primaryBookerContactNumber: req.query.contactNumber});
        // console.log(list);
        res.status(200).json(list);
    }catch(error){
        console.error(error);
    }
}

export const editGuestName = async (req,res) => {
    const { contactNumber,guestId,editedGuestName} = req.body;
    console.log(editedGuestName);
    try {
        var id = await ID.findOne({primaryBookerContactNumber : contactNumber});
        if (!id)
            res.status(401).json({ message: "No booking found" });
        else{
            const nameParts = editedGuestName.split(' ');
            const lastName = nameParts.length > 1 ? nameParts.pop(): '';
            const firstName = nameParts.join(' ');
            id.guestList.map((guest) => {
                if (guest._id == guestId) {
                    guest.firstName = firstName;
                    guest.lastName = lastName;
                    guest.name = editedGuestName;
                }
            })
            const updatedId = await ID.findOneAndUpdate({primaryBookerContactNumber : contactNumber}, id, { new: true });
            res.status(200).json(updatedId);
    }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
export const editGuestDetails = async (req,res) => {
    const { contactNumber,guestId, idUploaded,inProgress} = req.body;
    console.log(phoneNumber);
    try {
        var id = await ID.findOne({primaryBookerContactNumber : contactNumber});
        if (!id)
            res.status(401).json({ message: "No booking found" });
        else{
            id.guestList.map((guest) => {
                if (guest._id == guestId) {
                    guest.idUploaded = idUploaded;
                    guest.inProgress = inProgress;
                }
            })
            const updatedId = await ID.findOneAndUpdate({primaryBookerContactNumber : contactNumber},id, { new: true });
            res.status(200).json(updatedId);
    }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}