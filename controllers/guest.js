import Guest from "../models/guest.js"

/**
 * Creates a new feedback entry in the database
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
export const createGuest = async (req, res) => {
  try {
    // create the feedback entry
    const newGuest = new Guest({
      ...req.body,
    })
    console.log(newGuest)
    // save the feedback entry
    await newGuest.save()

    // return success message
    res.status(200).json({ message: "Guest created successfully" })
  } catch (error) {
    // return error message
    res.status(400).json({ message: error.message })
  }
}

/**
 * Gets all the guest entries from the database
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
export const getAllGuest = async (req, res) => {
  try {
    // Find all the guest entries in the database
    const guests = await Guest.find()

    // Return success with the guest data
    res.status(200).json(guests)
  } catch (error) {
    // Return error with the error message
    res.status(400).json({ message: error.message })
  }
}

/**
 * Retrieves a guest from the database based on their ID
 *
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
export const findGuestById = async (req, res) => {
  try {
    // Find the guest with the given ID
    const guest = await Guest.findById(req.params.id)

    // If no guest was found, return a 404 (not found) response
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" })
    }

    // If a guest was found, return success with the guest data
    res.status(200).json(guest)
  } catch (error) {
    // If there was an error, return a 400 (bad request) response
    // with the error message
    res.status(400).json({ message: error.message })
  }
}

/**
 * Finds a guest in the database based on their phone number or email
 *
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
export const findGuestByPhoneOrEmail = async (req, res) => {
  try {
    console.log(req.query)
    const { phoneNumber, email } = req.query
    console.log("phone number ", phoneNumber, " email ", email)

    // validate the phone number or email is present
    if (!phoneNumber && !email) {
      return res
        .status(400)
        .json({ message: "Please provide a phone number or email" })
    }
    // Find the guest with the given phone number or email
    const guest = await Guest.findOne({
      $or: [{ phoneNumber }, { email }],
    })
    console.log("guest ", guest)

    // If no guest was found, return a 404 (not found) response
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" })
    }

    // If a guest was found, return success with the guest data
    res.status(200).json(guest)
  } catch (error) {
    // If there was an error, return a 400 (bad request) response
    // with the error message
    res.status(400).json({ message: error.message })
  }
}
