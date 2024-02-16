import express from 'express';
// import { bookingidSearch, bookingnameSearch,addDetails, editBookingDeatails, getDetails, getDetailsNew, getDetailsContact, getDetailsData, checkEarly} from '../controllers/bookings.js';
import { avatarSpeakScreen } from '../controllers/avatarSpeak.js';

const router = express.Router();

router.get("/screen", avatarSpeakScreen);

export default router;
