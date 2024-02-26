import express from "express"

import {
  createGuest,
  getAllGuest,
  findGuestById,
  findGuestByPhoneOrEmail,
} from "../controllers/guest.js"

const router = express.Router()
router.get("/find", findGuestByPhoneOrEmail)

router.route("/").get(getAllGuest).post(createGuest)

router.route("/:id").get(findGuestById)

// router.route("/find").get(findGuestByPhoneOrEmail)

export default router
