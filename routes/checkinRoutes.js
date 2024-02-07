import express from 'express';
import { getCheckin, postCheckin} from '../controllers/checkin.js';
import {scanAdhaarBack, scanAdhaarFront} from '../controllers/scanAdhaar.js';
import { createOrder, verifyPayment } from '../controllers/razorpay.js';
import { maximumMatching } from '../controllers/maximumMatching.js';
import { scanVoterIdBack, scanVoterIdFront} from '../controllers/ScanVoterId.js';
import { scanPassport } from '../controllers/scanPassport.js';
import { scanDl } from '../controllers/scanDl.js';

const router = express.Router();

router.get("/get", getCheckin);
router.post("/create", postCheckin);

export default router;
