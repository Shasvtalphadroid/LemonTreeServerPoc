import express from "express"

import { storeFeedback } from "../controllers/feedBack.js"

const router = express.Router()

router.route("/").post(storeFeedback)

export default router
