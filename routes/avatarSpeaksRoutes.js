import express from 'express';
// import { bookingidSearch, bookingnameSearch,addDetails, editBookingDeatails, getDetails, getDetailsNew, getDetailsContact, getDetailsData, checkEarly} from '../controllers/bookings.js';
import { avatarSpeakScreen, screenStateUpdate, screenStateFetch } from '../controllers/avatarSpeak.js';

const router = express.Router();

router.get("/screen", avatarSpeakScreen);
router.post("/screenStateUpdate", screenStateUpdate);
router.get("/screenState", screenStateFetch);

export default router;
