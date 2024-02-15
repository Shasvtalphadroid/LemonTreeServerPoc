import Bookings from "../models/bookings.js";

export const bookingidSearch = async (req, res) => {
    try {
        const booking = await Bookings.findOne({ bookingId: req.query.bookingId });
        if (booking)
            res.status(200).json(Boolean(true));
        else
            res.status(200).json(Boolean(false));
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

export const bookingnameSearch = async (req, res) => {
    try {
        const booking = await Bookings.findOne({ name: req.query.bookingName });
        if (booking)
            res.status(200).json(Boolean(true));
        else
            res.status(200).json(Boolean(false));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const addDetails = async (req, res) => {
    try {
        const booking = new Bookings(req.body);
        await booking.save();
        res.status(200).json(booking);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export const getDetails = async (req, res) => {
    console.log(req.query.bookingName)
    try {
        const booking = await Bookings.findOne({ name: req.query.bookingName });
        if (!booking)
            res.status(401).json({ message: "No booking found" });
        else
            res.status(200).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getDetailsNew = async (req, res) => {
    console.log(req.query.firstName)
    console.log(req.query.lastName)

    try {
        const booking = await Bookings.find({ firstName: req.query.firstName, lastName: req.query.lastName });
        if (!booking || booking.length === 0)
            res.status(401).json(parseInt(0));
        else {
            res.status(200).json(parseInt(booking.length));
            // res.status(200).json(booking);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getDetailsData = async (req, res) => {
    console.log(req.query.firstName)
    console.log(req.query.lastName)

    try {
        const booking = await Bookings.findOne({ firstName: req.query.firstName, lastName: req.query.lastName });
        if (!booking || booking.length === 0)
            res.status(401).json(parseInt(0));
        else {
            res.status(200).json(booking);
            // res.status(200).json(booking);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getDetailsContact = async (req, res) => {
    console.log(req.query.phoneNumber)
    try {
        const booking = await Bookings.find({ contactNumber: req.query.phoneNumber });
        if (!booking || booking.length === 0)
            res.status(401).json(parseInt(0));
        else {
            var updatedBooking = booking[0];
            for(var i =1;i<booking.length;i++){
                updatedBooking.adults += booking[i].adults;
                updatedBooking.children += booking[i].children;
            }
            res.status(200).json(updatedBooking);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export const editBookingDeatails = async (req, res) => {
    const { phoneNumber,guestName, idUploaded, editedGuestName } = req.body;
    console.log(phoneNumber);
    try {
        const booking = await Bookings.findOne({phoneNumber : phoneNumber});
        if (!booking)
            res.status(401).json({ message: "No booking found" });
        else{
            console.log("found booking",booking.guestList);
            booking.guestList.map((guest) => {
                if (guest.name === guestName) {
                    guest.idUploaded = idUploaded;
                    guest.name = editedGuestName;
                    guest.inProcess = false;
                }
            })
            await Bookings.findOneAndUpdate({ name: bookingName }, booking, { new: true });
            res.status(200).json(booking);
    }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export const checkEarly = async (req, res) => {
    const {checkIn, checkOut } = req.body;
    console.log(req.body)
    try {
        const dateTimeCI = new Date(checkIn);
        const dateTimeCDT = new Date();
        const dateTimeCO = new Date(checkOut);

        if(dateTimeCDT>=dateTimeCI && dateTimeCDT<=dateTimeCO){
            res.status(200).json(true);
        }
        else{
            res.status(404).json(false);
        }
    }
    catch(err){
        res.status(404).json({error:err});
    }
}
