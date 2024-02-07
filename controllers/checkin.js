import Checkin from "../models/checkin.js";

export const getCheckin = async (req, res) => {
    try {
        const checkin = await Checkin.findOne({ checkinStatus: "started"});
        if(checkin){
            const checkinUpdate = await Checkin.findByIdAndUpdate({
                _id: checkin._id
            },
            {
                $set: {
                    checkinStatus: "inprogress"
                }
            },
            {
                new: true
            });
            // res.status(200).json({checkin, checkinUpdate});
            res.status(200).json({message: `Hi, ${checkinUpdate.firstName} ${checkinUpdate.lastName || ''}. Please proceed with the instructions displayed on the screen.`});
            // res.status(200).json(checkinUpdate);
        } else {
            res.status(200).json({message: ""});
            // res.status(200).json({});
        }
    } catch (error) {
        res.status(401).json({message: ""});
        // res.status(401).json({ message: error.message });
    }
}

export const postCheckin = async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const newCheckin = await Checkin.create({
            checkinId: (new Date()).getTime(),
            firstName,
            lastName,
            checkinStatus: "started"
        });

        // const booking = await Bookings.findOne({ bookingId: req.query.bookingId});
        if(newCheckin)
            res.status(200).json(newCheckin);
        else
            res.status(200).json(Boolean(false));
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}