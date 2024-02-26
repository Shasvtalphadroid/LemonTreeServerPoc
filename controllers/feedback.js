import Feedback from "../models/feedback.js"
/**
 * Middleware function to validate the body of the request
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Function} next The next middleware function
 */
const validateBody = (req, res, next) => {
  const { feedback, feedback_type } = req.body
  if (!feedback && !feedback_type) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" })
  }
  next()
}

/**
 * Creates a new feedback entry in the database
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
export const storeFeedback = async (req, res) => {
  const { bookingId, feedback_type, feedback } = req.body

  try {
    // validate the request parameters
    validateBody(req, res, () => {})
    // create the feedback entry
    const newFeedback = new Feedback({
      bookingId,
      feedback_type,
      feedback,
      feedback_type,
    })
    console.log(newFeedback)
    // save the feedback entry
    await newFeedback.save()

    // return success message
    res.status(200).json({ message: "Feedback submitted successfully" })
  } catch (error) {
    // return error message
    res.status(400).json({ message: error.message })
  }
}
