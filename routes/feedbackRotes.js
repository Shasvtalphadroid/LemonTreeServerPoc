import express from "express"

import { storeFeedback } from "../controllers/feedback.js"

const router = express.Router()

router.route("/").post(storeFeedback)

export default router
