import express from 'express';
import {
  bookingidSearch,
  bookingnameSearch,
  addDetails,
  editBookingDeatails,
  getDetails,
  getDetailsNew,
  getDetailsContact,
  getDetailsData,
  checkEarly,
  bookingDetailsForCheckout,
} from "../controllers/bookings.js"
import { scanAdhaarBack, scanAdhaarFront } from "../controllers/scanAdhaar.js"
import { createOrder, verifyPayment } from "../controllers/razorpay.js"
import { maximumMatching } from "../controllers/maximumMatching.js"
import {
  scanVoterIdBack,
  scanVoterIdFront,
} from "../controllers/ScanVoterId.js"
import { scanPassport } from "../controllers/scanPassport.js"
import { scanDl } from "../controllers/scanDl.js"
import { addId, editGuestName, fetchGuestList } from "../controllers/Ids.js"
import { addRooms, fetchRooms } from "../controllers/rooms.js"

const router = express.Router()

router.get("/search/id", bookingidSearch)
router.get("/search/name", bookingnameSearch)
router.post("/newDetails", addDetails)
router.get("/getDetails", getDetails)
router.get("/getDetailsNew", getDetailsNew)
router.get("/getDetailsContact", getDetailsContact)
router.get("/getDetailsData", getDetailsData)
router.patch("/editBookings", editBookingDeatails)
router.post("/makePayment", createOrder)
router.get("/verifyPayment", verifyPayment)
router.post("/maximumMatch", maximumMatching)
router.get("/getGuestList", fetchGuestList)
router.patch("/editGuestName", editGuestName)

//Scaneing Routes
router.post("/AdhaarScanfront", scanAdhaarFront)
router.patch("/AdhaarScanback", scanAdhaarBack)
router.post("/VoterIdScanfront", scanVoterIdFront)
router.patch("/VoterIdScanback", scanVoterIdBack)
router.patch("/PassportScan", scanPassport)
router.patch("/DlScan", scanDl)
router.patch("/VisaScan", scanDl)
router.post("/checkEarly", checkEarly)
router.post("/addID", addId)

// **************
router.post("/addRoom", addRooms)
router.get("/fetchRomms", fetchRooms)

// routes for booking details for checkout
router.get("/bookingDetails", bookingDetailsForCheckout)


export default router;
